import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { CONSTRAINTS } from '@/constants/constraints';
import {
  shareHouseCreationSchema,
  shareHouseNameSchema,
} from '@/constants/schema';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { addDays } from '@/utils/dates';
import type { Category, Tenant } from '@prisma/client';

const app = new Hono();

export default app;

app.get('/:shareHouseId', async (c) => {
  const shareHouseId = c.req.param('shareHouseId');

  try {
    const shareHouseWithOtherTables = await prisma.shareHouse.findUnique({
      where: {
        id: shareHouseId,
      },
      include: {
        RotationAssignment: {
          include: {
            tenantPlaceholders: {
              include: {
                tenant: true,
              },
            },
            categories: {
              include: {
                tasks: true,
              },
            },
          },
        },
      },
    });

    if (!shareHouseWithOtherTables)
      return c.json({ error: 'ShareHouse not found' }, 404);

    if (!shareHouseWithOtherTables.RotationAssignment)
      return c.json({ error: 'Internal Server Error' }, 500);

    const shareHouseData = {
      tenants: shareHouseWithOtherTables.RotationAssignment.tenantPlaceholders
        .map((tenantPlaceholder) => {
          if (tenantPlaceholder.tenant) {
            return {
              id: tenantPlaceholder.tenant.id,
              name: tenantPlaceholder.tenant.name,
              email: tenantPlaceholder.tenant.email,
            };
          }
          return null;
        })
        .filter((tenantPlaceholder) => tenantPlaceholder !== null),

      rotationCycle: shareHouseWithOtherTables.RotationAssignment.rotationCycle,
      categories: shareHouseWithOtherTables.RotationAssignment.categories.map(
        (category) => ({
          id: category.id,
          name: category.name,
          tasks: category.tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
          })),
        }),
      ),
    };

    return c.json(shareHouseData);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'An error occurred while fetching data' }, 500);
  }
});

app.patch(
  '/:shareHouseId',
  zValidator('json', shareHouseNameSchema),
  async (c) => {
    try {
      const shareHouseId = c.req.param('shareHouseId');
      const data = c.req.valid('json');
      const shareHouse = await prisma.shareHouse.findUnique({
        where: {
          id: shareHouseId,
        },
      });

      if (!shareHouse) return c.json({ error: 'ShareHouse not found' }, 404);

      const updateShareHouse = await prisma.shareHouse.update({
        where: {
          id: shareHouseId,
        },
        data: {
          name: data.name,
        },
      });

      return c.json(updateShareHouse, 201);
    } catch (error) {
      console.error('Error updating shareHouse:', error);
      return c.json(
        { error: 'An error occurred while updating shareHouse' },
        500,
      );
    }
  },
);

app.delete('/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({ message: `Deleting share house id: ${shareHouseId}` });
});

app.post('/', zValidator('json', shareHouseCreationSchema), async (c) => {
  try {
    const session = await auth();

    if (!session) {
      return c.json({
        message: 'You are not logged in!',
      });
    }
    const landlordId = session.user.id;
    const data = c.req.valid('json');

    const landlord = await prisma.landlord.findUnique({
      where: {
        id: landlordId,
      },
      include: {
        shareHouses: true,
      },
    });

    if (!landlord)
      return c.json(
        { error: 'Landlord not found for the given landlordId' },
        404,
      );

    if (!session.user.email)
      return c.json({ error: 'User email is missing' }, 400);

    const existingLandlord = await prisma.landlord.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (existingLandlord)
      return c.json({ error: 'Landlord email already exists' }, 400);

    if (landlord.shareHouses.length > CONSTRAINTS.SHAREHOUSE_MAX_AMOUNT)
      return c.json(
        {
          error: `The number of shareHouses has reached the maximum limit of ${CONSTRAINTS.SHAREHOUSE_MAX_AMOUNT}`,
        },
        400,
      );

    const transaction = await prisma.$transaction(async (prisma) => {
      const startDate = new Date(data.startDate);
      const endDate = addDays(startDate, data.rotationCycle);

      const newAssignmentSheet = await prisma.assignmentSheet.create({
        data: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          assignedData: '',
        },
      });

      const newShareHouse = await prisma.shareHouse.create({
        data: {
          name: data.name,
          landlordId: landlordId,
          assignmentSheetId: newAssignmentSheet.id,
        },
      });

      const newRotationAssignment = await prisma.rotationAssignment.create({
        data: {
          shareHouseId: newShareHouse.id,
          rotationCycle: data.rotationCycle,
        },
      });

      const createdCategories: Category[] = [];
      for (const categoryData of data.categories) {
        const newCategory = await prisma.category.create({
          data: {
            name: categoryData.category,
            rotationAssignmentId: newRotationAssignment.id,
            tasks: {
              create: categoryData.tasks.map((task) => ({
                title: task.title,
                description: task.description,
              })),
            },
          },
        });
        createdCategories.push(newCategory);
      }

      const createdTenants: Tenant[] = [];
      for (let i = 0; i < data.tenants.length; i++) {
        const tenantData = data.tenants[i];
        const newTenant = await prisma.tenant.create({
          data: {
            name: tenantData.name,
            email: tenantData.email,
            extraAssignedCount: 0,
            tenantPlaceholders: {
              create: {
                rotationAssignmentId: newRotationAssignment.id,
                index: i,
              },
            },
          },
        });
        createdTenants.push(newTenant);
      }

      return {
        shareHouse: newShareHouse,
        rotationAssignment: newRotationAssignment,
        categories: createdCategories,
        tenants: createdTenants,
      };
    });

    return c.json(transaction, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'An error occurred while creating data' }, 500);
  }
});
