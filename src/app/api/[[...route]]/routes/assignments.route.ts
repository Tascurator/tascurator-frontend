import { Hono } from 'hono';
import prisma from '@/lib/prisma';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import { AssignedData } from '@/services/AssignedData';
import {
  IAssignedData,
  TRotationScheduleForecast,
  TSanitizedPrismaShareHouse,
} from '@/types/server';
import { addDays, convertToPacificTime, getToday } from '@/utils/dates';
import { zValidator } from '@hono/zod-validator';
import { taskCompletionUpdateSchema } from '@/constants/schema';
import { Prisma } from '@prisma/client';
import { automaticRotation } from '@/utils/automatic-rotation';

const app = new Hono()

  /**
   * Retrieves the categories assigned to a tenant for a given assignment sheet, including the categories expected to be assigned in the next 3 future rotations.
   * @route GET /api/assignments/:assignmentSheetId/:tenantId
   */
  .get('/:assignmentSheetId/:tenantId', async (c) => {
    const assignmentSheetId = c.req.param('assignmentSheetId');
    const tenantId = c.req.param('tenantId');

    try {
      const doesAssignmentSheetExist = await prisma.assignmentSheet.findUnique({
        where: {
          id: assignmentSheetId,
        },
        include: {
          ShareHouse: {
            include: {
              assignmentSheet: true,
              RotationAssignment: {
                select: {
                  id: true,
                  rotationCycle: true,
                  categories: {
                    include: {
                      tasks: {
                        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
                      },
                    },
                    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
                  },
                  tenantPlaceholders: {
                    include: {
                      tenant: true,
                    },
                    orderBy: {
                      index: 'asc',
                    },
                  },
                },
              },
            },
          },
        },
      });

      /**
       * Return an internal server error if the related resources are not found.
       */
      if (
        !doesAssignmentSheetExist ||
        !doesAssignmentSheetExist.ShareHouse ||
        !doesAssignmentSheetExist.ShareHouse.RotationAssignment
      ) {
        return c.json(
          { error: SERVER_ERROR_MESSAGES.NOT_FOUND('assignmentSheet') },
          500,
        );
      }

      /**
       * Check if the tenant exists in the share house.
       */
      if (
        !doesAssignmentSheetExist.ShareHouse.RotationAssignment.tenantPlaceholders.some(
          (tenantPlaceholder) => tenantPlaceholder.tenantId === tenantId,
        )
      ) {
        return c.json(
          { error: SERVER_ERROR_MESSAGES.NOT_FOUND('tenant') },
          404,
        );
      }

      /**
       * Recreate the AssignedData for the share house if the current date is after the end date of the current AssignedData.
       */
      const sanitizedSharehouse: TSanitizedPrismaShareHouse = {
        ...doesAssignmentSheetExist.ShareHouse,
        assignmentSheet: {
          ...doesAssignmentSheetExist,
          assignedData:
            doesAssignmentSheetExist.assignedData as unknown as IAssignedData,
        },
        RotationAssignment:
          doesAssignmentSheetExist.ShareHouse.RotationAssignment,
      };
      await automaticRotation(sanitizedSharehouse);

      const { assignmentSheet, RotationAssignment } = sanitizedSharehouse;

      /**
       * Create an AssignedData instance from the assignedData in the assignmentSheet.
       */
      const assignedData = new AssignedData(
        assignmentSheet.assignedData,
        assignmentSheet.startDate,
        assignmentSheet.endDate,
      );

      const rotationScheduleForecast: TRotationScheduleForecast = {
        1: {
          startDate: '',
          endDate: '',
          categories: [],
        },
        2: {
          startDate: '',
          endDate: '',
          categories: [],
        },
        3: {
          startDate: '',
          endDate: '',
          categories: [],
        },
        4: {
          startDate: '',
          endDate: '',
          categories: [],
        },
      };

      /**
       * Get the currently assigned categories for the tenant.
       */
      const assignedCategories = assignedData.getAssignedCategories(tenantId);

      rotationScheduleForecast['1'] = {
        startDate: assignmentSheet.startDate.toISOString(),
        endDate: addDays(assignmentSheet.endDate, -1).toISOString(),
        categories: assignedCategories.map((category) => ({
          id: category.id,
          name: category.name,
          tasks: category.tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            isCompleted: task.isCompleted,
          })),
        })),
      };

      let nextAssignedData: AssignedData | null = null;

      /**
       * Get the subsequent rotations for the tenant.
       */
      for (let i: number = 2; i <= 4; i++) {
        nextAssignedData = (
          nextAssignedData ?? assignedData
        ).createNextRotation(
          RotationAssignment.categories,
          RotationAssignment.tenantPlaceholders,
          RotationAssignment.rotationCycle,
        );

        const nextAssignedCategories =
          nextAssignedData.getAssignedCategories(tenantId);

        rotationScheduleForecast[i as 2 | 3 | 4] = {
          startDate: nextAssignedData.getStartDate().toISOString(),
          endDate: addDays(nextAssignedData.getEndDate(), -1).toISOString(),
          categories: nextAssignedCategories.map((category) => ({
            id: category.id,
            name: category.name,
            tasks: category.tasks.map((task) => ({
              id: task.id,
              title: task.title,
            })),
          })),
        };
      }

      return c.json(rotationScheduleForecast);
    } catch (error) {
      console.error(
        SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR(
          'fetching data for the tenant',
        ),
        error,
      );
      return c.json(
        {
          error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR(
            'fetching data for the tenant',
          ),
        },
        500,
      );
    }
  })

  /**
   * Updates the tasks' completion status for a tenant for a given assignment sheet
   * @route PATCH /api/assignments/:assignmentSheetId/:tenantId
   */
  .patch(
    '/:assignmentSheetId/:tenantId',
    zValidator('json', taskCompletionUpdateSchema),
    async (c) => {
      const assignmentSheetId = c.req.param('assignmentSheetId');
      const tenantId = c.req.param('tenantId');
      const data = c.req.valid('json');

      /**
       * Check if the tasks array is empty.
       */
      if (data.tasks.length === 0) {
        return c.json(
          { error: SERVER_ERROR_MESSAGES.EMPTY_ARRAY('task') },
          400,
        );
      }

      try {
        const assignmentSheet = await prisma.assignmentSheet.findUnique({
          where: {
            id: assignmentSheetId,
          },
        });

        /**
         * Return an internal server error if the assignment sheet is not found.
         */
        if (!assignmentSheet) {
          return c.json(
            { error: SERVER_ERROR_MESSAGES.NOT_FOUND('assignmentSheet') },
            500,
          );
        }

        /**
         * Create an AssignedData instance from the assignedData in the assignmentSheet.
         */
        const assignedData = new AssignedData(
          assignmentSheet.assignedData as unknown as IAssignedData,
          assignmentSheet.startDate,
          assignmentSheet.endDate,
        );

        /**
         * Check if the tenant exists in the assignedData.
         */
        if (!assignedData.hasTenant(tenantId)) {
          return c.json(
            { error: SERVER_ERROR_MESSAGES.NOT_FOUND('tenant') },
            404,
          );
        }

        /**
         * Get all the tasks assigned to the tenant.
         */
        const assignedTasks = assignedData.getAssignedTasks(tenantId);

        /**
         * Check if only the tasks that the tenant has been assigned are included in the request.
         */
        if (
          !data.tasks.every((task) =>
            assignedTasks.some((assignedTask) => assignedTask.id === task.id),
          )
        ) {
          return c.json(
            { error: SERVER_ERROR_MESSAGES.UNASSIGNED_TASK_UPDATE_ERROR },
            400,
          );
        }

        /**
         * Check if the end date of the AssignedData has already passed.
         * If the end date has passed, return an error.
         * If not, proceed with updating the task completion status.
         */
        if (
          getToday() >= convertToPacificTime(assignedData.getEndDate()).toDate()
        ) {
          return c.json(
            { error: SERVER_ERROR_MESSAGES.PAST_END_DATE_ERROR },
            400,
          );
        }

        /**
         * Update the task completion status for only the tasks that the tenant has been assigned.
         */
        for (const task of data.tasks) {
          assignedData.toggleTaskCompletion(
            tenantId,
            task.id,
            task.isCompleted,
          );
        }

        /**
         * Update the assignedData in the assignmentSheet.
         */
        await prisma.assignmentSheet.update({
          where: {
            id: assignmentSheetId,
          },
          data: {
            assignedData:
              assignedData.getAssignedData() as unknown as Prisma.JsonArray,
          },
        });

        return c.json({ message: 'Task completion updated' });
      } catch (error) {
        console.error(
          SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR(
            'updating the task completion',
          ),
          error,
        );
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR(
              'updating the task completion',
            ),
          },
          500,
        );
      }
    },
  );

export default app;
