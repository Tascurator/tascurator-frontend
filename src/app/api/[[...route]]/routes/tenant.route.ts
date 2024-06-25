import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const app = new Hono();
const prisma = new PrismaClient();

export default app;

app.patch('/:tenantId', (c) => {
  const tenantId = c.req.param('tenantId');
  return c.json({ message: `Updating tenant id: ${tenantId}` });
});

app.delete('/:tenantId', (c) => {
  const tenantId = c.req.param('tenantId');
  return c.json({ message: `Deleting tenant id: ${tenantId}` });
});

app.post('/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({
    message: `Creating share house id for tenant: ${shareHouseId}`,
  });
});

app.get('/:assignmentSheetId/:tenantId', async (c) => {
  const assignmentSheetId = c.req.param('assignmentSheetId');
  const tenantId = c.req.param('tenantId');

  try {
    const tenantWithOtherTables = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
      include: {
        tenantPlaceholders: {
          include: {
            rotationAssignment: {
              include: {
                categories: {
                  include: {
                    tasks: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const assignmentSheet = await prisma.assignmentSheet.findUnique({
      where: {
        id: assignmentSheetId,
      },
    });

    return c.json({ tenantWithOtherTables, assignmentSheet });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'An error occurred while fetching data' }, 500);
  }
});

app.patch('/:assignmentSheetId/:tenantId', (c) => {
  const assignmentSheetId = c.req.param('assignmentSheetId');
  const tenantId = c.req.param('tenantId');
  return c.json({
    message: `Updating assignment sheet id: ${assignmentSheetId}, tenant id: ${tenantId}`,
  });
});
