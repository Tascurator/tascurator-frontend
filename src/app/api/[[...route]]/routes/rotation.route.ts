import { Hono } from 'hono';

import prisma from '@/lib/prisma';
import type { IAssignedData } from '@/types/commons';

const app = new Hono();

export default app;

app.get('/current/:shareHouseId', async (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  try {
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

    const assignedData = shareHouseWithAssignmentSheet.assignmentSheet
      .assignedData as unknown as IAssignedData;

    let totalTasks = 0;
    let totalCompletedTasks = 0;

    const categories = assignedData.assignments.map((assignment) => {
      const maxTasks = assignment.tasks ? assignment.tasks.length : null;
      const completedTasks = assignment.tasks
        ? assignment.tasks.filter((task) => task.isCompleted === true).length
        : null;

      if (maxTasks !== null) totalTasks += maxTasks;
      if (completedTasks !== null) totalCompletedTasks += completedTasks;

      const categoryId = assignment.category ? assignment.category.id : null;
      const categoryName = assignment.category
        ? assignment.category.name
        : null;

      if (!assignment.tenant)
        return c.json({ error: 'Internal Server Error' }, 500);

      const tenantId = assignment.tenant.id;
      const tenantName = assignment.tenant.name;

      return {
        id: categoryId,
        name: categoryName,
        maxTasks: maxTasks,
        completedTasks: completedTasks,
        tenant: {
          id: tenantId,
          name: tenantName,
        },
      };
    });

    const progressRate =
      totalTasks > 0
        ? ((totalCompletedTasks / totalTasks) * 100).toFixed(1)
        : 0;

    const currentRotationData = {
      id: shareHouseWithAssignmentSheet.id,
      name: shareHouseWithAssignmentSheet.name,
      startDate: shareHouseWithAssignmentSheet.assignmentSheet.startDate,
      endDate: shareHouseWithAssignmentSheet.assignmentSheet.endDate,
      progressRate: progressRate,
      categories: categories,
    };

    return c.json(currentRotationData);
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
