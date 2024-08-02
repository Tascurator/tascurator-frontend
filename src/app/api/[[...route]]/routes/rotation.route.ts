import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { SERVER_MESSAGES } from '@/constants/server-messages';
import { rotationCycleUpdateSchema } from '@/constants/schema';
import prisma from '@/lib/prisma';
import type { IAssignedData } from '@/types/server';
import { AssignedData } from '@/services/AssignedData';
import { addDays } from '@/utils/dates';

type CategoryData = {
  id: string | null;
  name: string | null;
  maxTasks: number | null;
  completedTasks: number | null;
  tenant: {
    id: string;
    name: string;
  };
};

const app = new Hono()

  /**
   * Retrieves both the current and next rotation cycle data of a sharehouse by its ID
   * @route GET /api/rotation/:shareHouseId
   */
  .get('/:shareHouseId', async (c) => {
    const shareHouseId = c.req.param('shareHouseId');
    try {
      const shareHouse = await prisma.shareHouse.findUnique({
        where: {
          id: shareHouseId,
        },
        include: {
          assignmentSheet: true,
          RotationAssignment: {
            select: {
              rotationCycle: true,
              categories: {
                include: {
                  tasks: true,
                },
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

      /**
       * Return 404 if sharehouse not found
       */
      if (!shareHouse) {
        return c.json(
          {
            error: SERVER_MESSAGES.NOT_FOUND('share house'),
          },
          404,
        );
      }

      /**
       * Return 500 if RotationAssignment or AssignmentSheet not found
       */
      if (!shareHouse.RotationAssignment || !shareHouse.assignmentSheet) {
        return c.json({ error: SERVER_MESSAGES.INTERNAL_SERVER_ERROR }, 500);
      }

      // Current rotation data
      const assignedData = shareHouse.assignmentSheet
        .assignedData as unknown as IAssignedData;

      let totalTasks = 0;
      let totalCompletedTasks = 0;

      const categories: CategoryData[] = assignedData.assignments
        .map((assignment) => {
          const maxTasks = assignment.tasks ? assignment.tasks.length : null;
          const completedTasks = assignment.tasks
            ? assignment.tasks.filter((task) => task.isCompleted === true)
                .length
            : null;

          if (maxTasks !== null) totalTasks += maxTasks;
          if (completedTasks !== null) totalCompletedTasks += completedTasks;

          const categoryId = assignment.category
            ? assignment.category.id
            : null;
          const categoryName = assignment.category
            ? assignment.category.name
            : null;

          if (!assignment.tenant) return null;

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
        })
        .filter((assignment) => assignment !== null);

      const progressRate =
        totalTasks > 0
          ? Number(((totalCompletedTasks / totalTasks) * 100).toFixed(1))
          : 0;

      const currentRotationData = {
        name: shareHouse.name,
        startDate: shareHouse.assignmentSheet.startDate.toISOString(),
        endDate: addDays(shareHouse.assignmentSheet.endDate, -1).toISOString(),
        progressRate: progressRate,
        categories: categories,
      };

      // Next rotation data
      /**
       * Create an AssignedData instance for the current rotation cycle.
       */
      const assignedDataInstance = new AssignedData(
        shareHouse.assignmentSheet.assignedData as unknown as IAssignedData,
        shareHouse.assignmentSheet.startDate,
        shareHouse.assignmentSheet.endDate,
      );

      /**
       * Generate the next rotation's assigned data.
       */
      const nextAssignedData = assignedDataInstance.createNextRotation(
        shareHouse.RotationAssignment.categories,
        shareHouse.RotationAssignment.tenantPlaceholders,
        shareHouse.RotationAssignment.rotationCycle,
      );

      /**
       * Structure the nextRotationData to be returned.
       */
      const nextRotationData = {
        name: shareHouse.name,
        startDate: nextAssignedData.getStartDate().toISOString(),
        endDate: addDays(nextAssignedData.getEndDate(), -1).toISOString(),
        categories: nextAssignedData
          .getAssignments()
          .map((assignment) => {
            if (!assignment.tenant) {
              return null;
            }

            return {
              id: assignment.category?.id ?? null,
              name: assignment.category?.name ?? null,
              tenant: {
                id: assignment.tenant.id,
                name: assignment.tenant.name,
              },
            };
          })
          .filter((assignment) => assignment !== null),
      };

      /**
       *  Combine and return both current and next rotation data.
       */
      const combinedData = {
        current: currentRotationData,
        next: nextRotationData,
      };

      return c.json(combinedData);
    } catch (error) {
      console.error(
        SERVER_MESSAGES.CONSOLE_COMPLETION_ERROR(
          'fetching the data for the current rotation',
        ),
        error,
      );
      return c.json(
        {
          error: SERVER_MESSAGES.COMPLETION_ERROR(
            'fetching the data for the current rotation',
          ),
        },
        500,
      );
    }
  })

  /**
   * Updates the rotation cycle of a sharehouse by its ID
   * @route PATCH /api/rotation/:shareHouseId
   */
  .patch(
    '/:shareHouseId',
    zValidator('json', rotationCycleUpdateSchema),
    async (c) => {
      try {
        const shareHouseId = c.req.param('shareHouseId');
        const data = c.req.valid('json');

        const shareHouse = await prisma.shareHouse.findUnique({
          where: {
            id: shareHouseId,
          },
          include: {
            RotationAssignment: true,
          },
        });

        /**
         * Return 404 if sharehouse not found
         */
        if (!shareHouse) {
          return c.json(
            { error: SERVER_MESSAGES.NOT_FOUND('share house') },
            404,
          );
        }

        if (!shareHouse.RotationAssignment)
          return c.json({ error: SERVER_MESSAGES.INTERNAL_SERVER_ERROR }, 500);

        const updateRotationCycle = await prisma.rotationAssignment.update({
          where: {
            id: shareHouse.RotationAssignment.id,
          },
          data: {
            rotationCycle: data.rotationCycle,
          },
        });

        return c.json(updateRotationCycle, 201);
      } catch (error) {
        console.error(
          SERVER_MESSAGES.CONSOLE_COMPLETION_ERROR(
            'updates the rotation cycle',
          ),
          error,
        );
        return c.json(
          {
            error: SERVER_MESSAGES.COMPLETION_ERROR(
              'updates the rotation cycle',
            ),
          },
          500,
        );
      }
    },
  );

export default app;
