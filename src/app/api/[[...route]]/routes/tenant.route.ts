import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { Prisma, Tenant } from '@prisma/client';

import {
  taskCompletionUpdateSchema,
  tenantInvitationSchema,
} from '@/constants/schema';
import prisma from '@/lib/prisma';
import { AssignedData } from '@/services/AssignedData';
import { IAssignedData, TRotationScheduleForecast } from '@/types/server';
import { addDays } from '@/utils/dates';
import { sendEmail } from '@/lib/resend';
import { EMAILS } from '@/constants/emails';

const app = new Hono()

  /**
   * Updates the tenant name by its ID
   * @route PATCH /api/tenant/:tenantId
   */
  .patch(
    '/:tenantId',
    zValidator('json', tenantInvitationSchema.pick({ name: true })),
    async (c) => {
      try {
        const tenantId = c.req.param('tenantId');
        const data = c.req.valid('json');

        const tenant = await prisma.tenant.findUnique({
          where: {
            id: tenantId,
          },
        });

        if (!tenant) return c.json({ error: 'Tenant not found' }, 404);

        const updateTenant = await prisma.tenant.update({
          where: {
            id: tenantId,
          },
          data: {
            name: data.name,
          },
        });

        return c.json(updateTenant, 201);
      } catch (error) {
        console.error('Error updating tenant:', error);
        return c.json(
          { error: 'An error occurred while updating  tenant' },
          500,
        );
      }
    },
  )

  /**
   * Deletes a tenant by its ID
   * @route DELETE /api/tenant/:tenantId
   */
  .delete('/:tenantId', async (c) => {
    try {
      const tenantId = c.req.param('tenantId');
      const tenant = await prisma.tenant.findUnique({
        where: {
          id: tenantId,
        },
      });
      if (!tenant) return c.json({ error: 'Tenant not found' }, 404);

      const deleteTenant = await prisma.tenant.delete({
        where: {
          id: tenantId,
        },
      });
      return c.json(deleteTenant, 201);
    } catch (error) {
      console.error('Error deleting tenant:', error);
      return c.json({ error: 'An error occurred while deleting  tenant' }, 500);
    }
  })

  /**
   * Creates a tenant for a shareHouse
   * @route POST /api/tenant/:shareHouseId
   */
  .post(
    '/:shareHouseId',
    zValidator('json', tenantInvitationSchema),
    async (c) => {
      try {
        const shareHouseId = c.req.param('shareHouseId');
        const data = c.req.valid('json');

        const sanitizedEmail = data.email.toLowerCase();
        const existingTenant = await prisma.tenant.findFirst({
          where: {
            email: sanitizedEmail,
          },
        });

        if (existingTenant)
          return c.json(
            { error: 'Tenant with this email already exists' },
            400,
          );

        const sharehouse = await prisma.shareHouse.findUnique({
          where: {
            id: shareHouseId,
          },
          include: {
            RotationAssignment: {
              include: {
                tenantPlaceholders: true,
              },
            },
            assignmentSheet: true,
          },
        });

        if (!sharehouse) {
          return c.json({ error: 'ShareHouse not found' }, 404);
        }

        const { RotationAssignment, assignmentSheet } = sharehouse;

        if (!RotationAssignment || !assignmentSheet)
          return c.json(
            {
              error:
                'ShareHouse, RotationAssignment, or AssignmentSheet not found for the given shareHouseId',
            },
            404,
          );

        const transaction = await prisma.$transaction(async (prisma) => {
          const availableTenantPlaceholder =
            RotationAssignment.tenantPlaceholders.find(
              (tenantPlaceholder) => tenantPlaceholder.tenantId === null,
            );

          let newTenant: Tenant;

          if (availableTenantPlaceholder) {
            newTenant = await prisma.tenant.create({
              data: {
                name: data.name,
                email: sanitizedEmail,
                extraAssignedCount: 0,
                tenantPlaceholders: {
                  connect: {
                    rotationAssignmentId_index: {
                      rotationAssignmentId:
                        availableTenantPlaceholder.rotationAssignmentId,
                      index: availableTenantPlaceholder.index,
                    },
                  },
                },
              },
            });
          } else {
            const lastIndex = RotationAssignment.tenantPlaceholders.length;
            newTenant = await prisma.tenant.create({
              data: {
                name: data.name,
                email: sanitizedEmail,
                extraAssignedCount: 0,
                tenantPlaceholders: {
                  create: {
                    rotationAssignmentId: RotationAssignment.id,
                    index: lastIndex,
                  },
                },
              },
            });
          }

          /**
           * Send email to the tenant with their personalized link
           */
          try {
            await sendEmail({
              to: sanitizedEmail,
              subject: EMAILS.TENANT_INVITATION.subject,
              html: EMAILS.TENANT_INVITATION.html(
                `${process.env.NEXT_PUBLIC_APPLICATION_URL!}/${assignmentSheet.id}/${newTenant.id}`,
              ),
            });
          } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('An error occurred while sending an email');
          }

          return newTenant;
        });

        return c.json(transaction, 201);
      } catch (error) {
        console.error('Error creating tenant:', error);
        return c.json(
          { error: 'An error occurred while creating the tenant' },
          500,
        );
      }
    },
  )

  /**
   * Retrieves the categories assigned to a tenant for a given assignment sheet, including the categories expected to be assigned in the next 3 future rotations.
   * @route GET /api/tenant/:assignmentSheetId/:tenantId
   */
  .get('/:assignmentSheetId/:tenantId', async (c) => {
    const assignmentSheetId = c.req.param('assignmentSheetId');
    const tenantId = c.req.param('tenantId');

    try {
      const assignmentSheet = await prisma.assignmentSheet.findUnique({
        where: {
          id: assignmentSheetId,
        },
        include: {
          ShareHouse: {
            include: {
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
          },
        },
      });

      /**
       * Return an internal server error if the related resources are not found.
       */
      if (
        !assignmentSheet ||
        !assignmentSheet.ShareHouse ||
        !assignmentSheet.ShareHouse.RotationAssignment
      ) {
        return c.json({ error: 'Assignment sheet not found' }, 500);
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
        return c.json({ error: 'Tenant not found' }, 404);
      }

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
          assignmentSheet.ShareHouse.RotationAssignment.categories,
          assignmentSheet.ShareHouse.RotationAssignment.tenantPlaceholders,
          assignmentSheet.ShareHouse.RotationAssignment.rotationCycle,
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
      console.error('Error getting tenant:', error);
      return c.json({ error: 'An error occurred while getting tenant' }, 500);
    }
  })

  /**
   * Updates the tasks' completion status for a tenant for a given assignment sheet
   * @route PATCH /api/tenant/:assignmentSheetId/:tenantId
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
        return c.json({ error: 'Tasks array is empty' }, 400);
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
          return c.json({ error: 'Assignment sheet not found' }, 500);
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
          return c.json({ error: 'Tenant not found' }, 404);
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
            { error: 'Tenant can update only assigned tasks' },
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
        console.error('Error updating tenant:', error);
        return c.json(
          { error: 'An error occurred while updating task completion' },
          500,
        );
      }
    },
  );

export default app;
