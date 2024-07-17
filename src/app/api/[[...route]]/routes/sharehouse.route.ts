import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { shareHouseNameSchema } from '@/constants/schema';
import prisma from '@/lib/prisma';

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

app.post('/:landlordId', (c) => {
  const landlordId = c.req.param('landlordId');
  return c.json({
    message: `Landlord id for creating new share hose: ${landlordId}`,
  });
});
