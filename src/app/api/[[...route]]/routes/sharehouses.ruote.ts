import { Hono } from 'hono';

import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import { THonoEnv } from '@/app/api/[[...route]]/route';

const app = new Hono<THonoEnv>()

  /**
   * Retrieve all share houses with their progress rate
   * @route GET /api/sharehouses
   */
  .get('/', (c) => {
    try {
      const shareHouses = c.get('sharehouses');

      const shareHousesWithProgress = shareHouses.map((shareHouse) => {
        const assignedData = shareHouse.assignmentSheet.assignedData;

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
      });

      return c.json({ shareHouses: shareHousesWithProgress });
    } catch (error) {
      console.error(
        SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR(
          'fetching data for all share houses the landlord has',
        ),
        error,
      );
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
