import { Hono } from 'hono';

import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import type { IAssignedData } from '@/types/server';

const app = new Hono()

  /**
   * Retrieve all share houses with their progress rate
   * @route GET /api/sharehouses
   */
  .get('/', async (c) => {
    try {
      const session = await auth();

      if (!session)
        return c.json({ error: SERVER_ERROR_MESSAGES.UNAUTHORIZED }, 401);

      const shareHouses = await prisma.landlord.findUnique({
        where: { id: session.user.id },
        include: {
          shareHouses: {
            include: {
              assignmentSheet: {
                select: {
                  assignedData: true,
                },
              },
            },
          },
        },
      });

      if (!shareHouses)
        return c.json(
          { error: SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
          500,
        );

      const shareHousesWithProgress = shareHouses.shareHouses.map(
        (shareHouse) => {
          const assignedData = shareHouse.assignmentSheet
            .assignedData as unknown as IAssignedData;

          const isCompletedValues: boolean[] = [];

          if (assignedData) {
            for (const assignment of assignedData.assignments) {
              if (assignment.tasks) {
                for (const task of assignment.tasks) {
                  isCompletedValues.push(task.isCompleted);
                }
              }
            }
          }

          const completedValues = isCompletedValues.filter(
            (value) => value === true,
          );
          const progressRate = Number(
            ((completedValues.length / isCompletedValues.length) * 100).toFixed(
              1,
            ),
          );

          return {
            id: shareHouse.id,
            name: shareHouse.name,
            progress: Number.isNaN(progressRate) ? 0 : progressRate,
          };
        },
      );

      return c.json({ shareHouses: shareHousesWithProgress });
    } catch (error) {
      console.error(error);
      return c.json(
        {
          error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR(
            'fetching data for all share houses the landlord has',
          ),
        },
        500,
      );
    }
  });

export default app;
