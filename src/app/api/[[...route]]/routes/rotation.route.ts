import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const app = new Hono();
const prisma = new PrismaClient();

export default app;

app.get('/current/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({
    message: `Share house id for current rotation: ${shareHouseId}`,
  });
});

app.get('/next/:shareHouseId', async (c) => {
  const shareHouseId = c.req.param('shareHouseId');

  try {
    const sharehouseWithOtherTables = await prisma.shareHouse.findUnique({
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

    if (!sharehouseWithOtherTables) {
      return c.json({ error: 'ShareHouse not found' }, 404);
    }

    return c.json(sharehouseWithOtherTables);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'An error occurred while fetching data' }, 500);
  }
});
