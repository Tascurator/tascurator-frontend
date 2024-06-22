import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

export const app = new Hono();
const prisma = new PrismaClient();

export default app;

app.get('/', (c) => {
  return c.json({ message: 'share house route' });
});

app.get('/:shareHouseId', async (c) => {
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
  // return c.json({ message: `Share house id: ${shareHouseId}` });
});

app.patch('/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({ message: `Updating share house id: ${shareHouseId}` });
});

app.delete('/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({ message: `Deleting share house id: ${shareHouseId}` });
});

app.post('/:landlordId', (c) => {
  const landlordId = c.req.param('landlordId');
  return c.json({
    message: `Landlord id for creating new share hose: ${landlordId}`,
  });
});
