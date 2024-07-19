import type { Prisma } from '@prisma/client';
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
import { InitialAssignedData } from '@/services/InitialAssignedData';

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

app.delete('/:shareHouseId', async (c) => {
  try {
    const shareHouseId = c.req.param('shareHouseId');
    const shareHouse = await prisma.shareHouse.findUnique({
      where: {
        id: shareHouseId,
      },
    });

    if (!shareHouse) return c.json({ error: 'ShareHouse not found' }, 404);

    const transaction = await prisma.$transaction(async (prisma) => {
      const deleteShareHouse = await prisma.shareHouse.delete({
        where: {
          id: shareHouseId,
        },
        include: {
          assignmentSheet: true,
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

      await prisma.assignmentSheet.delete({
        where: {
          id: deleteShareHouse.assignmentSheetId,
        },
      });

      await prisma.tenant.deleteMany({
        where: {
          tenantPlaceholders: {
            none: {},
          },
        },
      });

      return deleteShareHouse;
    });

    return c.json(transaction, 201);
  } catch (error) {
    console.error('Error deleting the shareHouse:', error);
    return c.json(
      { error: 'An error occurred while deleting the shareHouse' },
      500,
    );
  }
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

    // Check if the landlord has a share house with the same name
    const ShareHouseWithSameName = await prisma.shareHouse.findFirst({
      where: {
        name: data.name,
        landlordId: landlordId,
      },
    });

    if (ShareHouseWithSameName)
      return c.json({ error: 'ShareHouse name already exists' }, 400);

    if (landlord.shareHouses.length > CONSTRAINTS.SHAREHOUSE_MAX_AMOUNT)
      return c.json(
        {
          error: `The number of shareHouses has reached the maximum limit of ${CONSTRAINTS.SHAREHOUSE_MAX_AMOUNT}`,
        },
        400,
      );

    // Check for duplicate tenant names and emails within the provided data
    const categories = data.categories.map((category) => category.category);
    const isDuplicatedCategoryName = categories.some(
      (category, idx) => categories.indexOf(category) !== idx,
    );
    if (isDuplicatedCategoryName)
      return c.json(
        {
          error: 'Duplicate category name(s) found in the provided data',
        },
        400,
      );

    // Check for duplicate tenant names and emails within the provided data
    const tenantNames = data.tenants.map((tenant) => tenant.name);
    const isDuplicatedTenantName = tenantNames.some(
      (name, idx) => tenantNames.indexOf(name) !== idx,
    );
    if (isDuplicatedTenantName)
      return c.json(
        { error: 'Duplicate tenant name(s) found in the provided data' },
        400,
      );

    const tenantEmails = data.tenants.map((tenant) => tenant.email);
    const isDuplicatedTenantEmail = tenantEmails.some(
      (email, idx) => tenantEmails.indexOf(email) !== idx,
    );
    if (isDuplicatedTenantEmail)
      return c.json(
        { error: 'Duplicate tenant email(s) found in the provided data' },
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

      const sharehouse = await prisma.shareHouse.findUnique({
        where: { id: newShareHouse.id },
        select: {
          assignmentSheet: true,
          RotationAssignment: {
            select: {
              rotationCycle: true,
              categories: {
                include: { tasks: true },
              },
              tenantPlaceholders: {
                include: {
                  tenant: true,
                },
              },
            },
          },
        },
      });

      if (!sharehouse || !sharehouse.RotationAssignment) {
        throw new Error('Share house not found');
      }

      const newInitialAssignedData = new InitialAssignedData(
        sharehouse,
        startDate,
        data.rotationCycle,
      );

      const assignedData = newInitialAssignedData.getAssignedData();

      await prisma.assignmentSheet.update({
        where: {
          id: newAssignmentSheet.id,
        },
        data: {
          assignedData: assignedData as unknown as Prisma.JsonArray,
        },
      });

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
