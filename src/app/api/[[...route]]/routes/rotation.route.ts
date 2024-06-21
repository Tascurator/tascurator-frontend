import { PrismaClient } from '@prisma/client';
import { Hono } from 'hono';

const app = new Hono();
const prisma = new PrismaClient();

export default app;

app.get('/current/:shareHouseId', async (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  try {
    // const shareHouse = await prisma.shareHouse.findUnique({
    // 	where: {
    // 		id: shareHouseId,
    // 	},
    // 	select: {
    // 		assignmentSheetId: true,
    // 	},
    // });
    const shareHouseWithAssignmentSheet = await prisma.shareHouse.findUnique({
      where: {
        id: shareHouseId,
      },
      include: {
        assignmentSheet: true,
      },
    });

    if (
      !shareHouseWithAssignmentSheet ||
      !shareHouseWithAssignmentSheet.assignmentSheet
    ) {
      return c.json({ error: 'ShareHouse or AssignmentSheet not found' }, 404);
    }

    return c.json(shareHouseWithAssignmentSheet?.assignmentSheet.assignedData);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'An error occurred while fetching data' }, 500);
  }
});

app.get('/next/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({
    message: `Share house id for current rotation for next rotation: ${shareHouseId}`,
  });
});
