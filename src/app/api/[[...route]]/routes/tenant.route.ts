import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { Tenant } from '@prisma/client';
import { tenantInvitationSchema } from '@/constants/schema';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/resend';
import { CONSTRAINTS } from '@/constants/constraints';
import { AssignedData } from '@/services/AssignedData';
import { THonoEnv } from '@/types/hono-env';

const app = new Hono<THonoEnv>()

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

        const doesTenantExist = c.var.getTenantById(tenantId);

        /**
         * Ensure only the associated landlord can update the tenant
         */
        if (!doesTenantExist)
          return c.json(
            { error: SERVER_ERROR_MESSAGES.NOT_FOUND('tenant') },
            404,
          );

        const { shareHouseId, tenant } = doesTenantExist;

        if (data.name === tenant.name)
          return c.json(
            { message: SERVER_ERROR_MESSAGES.CHANGE_SAME_NAME },
            200,
          );

        // Check if the sharehouse has a tenant with the same name
        const tenants = c.var.getTenantsBySharehouseId(shareHouseId);

        if (tenants.some((t) => t.name === data.name))
          return c.json(
            {
              error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY('tenant name'),
            },
            400,
          );

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
        console.error(
          SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR('updating the tenant'),
          error,
        );
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR(
              'updating the tenant',
            ),
          },
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

      /**
       * Get the tenant by its ID
       */
      const doesTenantExist = c.var.getTenantById(tenantId);

      /**
       * Return 404 if the tenant is not found
       */
      if (!doesTenantExist) {
        return c.json(
          { error: SERVER_ERROR_MESSAGES.NOT_FOUND('tenant') },
          404,
        );
      }

      /**
       * Get the share house that associated with the tenant
       */
      const shareHouse = c.var.getSharehouseById(doesTenantExist.shareHouseId);

      /**
       * Return 500 if the share house is not found
       */
      if (!shareHouse) {
        return c.json({
          error: SERVER_ERROR_MESSAGES.NOT_FOUND('share house'),
        });
      }

      const { assignmentSheet, RotationAssignment } = shareHouse;

      const result = await prisma.$transaction(async (prisma) => {
        /**
         * Delete the tenant by its tenant ID
         */
        const deletedTenant = await prisma.tenant.delete({
          where: {
            id: tenantId,
          },
        });

        /**
         * Instantiate the AssignedData class with the assigned data
         */
        const assignedData = new AssignedData(
          assignmentSheet.assignedData,
          assignmentSheet.startDate,
          assignmentSheet.endDate,
        );

        /**
         * Get the previous tenant placeholders in the AssignedData
         */
        const previousTenantPlaceholders = assignedData.getTenantPlaceholders();

        /**
         * Get the current tenant placeholders in the rotation assignment (sorted by index)
         */
        const currentTenantPlaceholders =
          await prisma.tenantPlaceholder.findMany({
            where: {
              rotationAssignmentId: RotationAssignment.id,
            },
            orderBy: {
              index: 'asc',
            },
          });

        const lastAssignedTenantPlaceholder =
          currentTenantPlaceholders.findLastIndex((tp) => tp.tenantId !== null);

        /**
         * Check if each tenant placeholder has a tenant assigned until the last assigned tenant placeholder. If so, just return the deleted tenant.
         *
         * @example
         * If the tenant placeholders after the deletion are...
         *
         * [A, B, C, D], stop here and return the deleted tenant
         * [A, null, C, D, E], proceed to the next step and update the tenant placeholders
         */
        if (
          currentTenantPlaceholders
            .slice(0, lastAssignedTenantPlaceholder + 1)
            .every((tp) => tp.tenantId !== null)
        ) {
          return deletedTenant;
        }

        /**
         * Calculate the newly added tenants in the current tenant placeholders by comparing the previous tenant placeholders
         */
        const newTenants = currentTenantPlaceholders
          .map((tenantPlaceholder) => {
            if (tenantPlaceholder.tenantId === null) return null;

            return {
              index: tenantPlaceholder.index,
              tenantId: tenantPlaceholder.tenantId,
            };
          })
          .filter((tenantPlaceholder) => tenantPlaceholder !== null)
          .filter((tenantPlaceholder) =>
            previousTenantPlaceholders.every(
              (previousTenantPlaceholder) =>
                previousTenantPlaceholder.tenant?.id !==
                tenantPlaceholder.tenantId,
            ),
          );

        /**
         * Update the tenant placeholders with the new tenants
         *
         * @example
         * Previous tenant placeholders: [A, B, C, D]
         * Current tenant placeholders: [A, null, C, D, E] after deleting tenant B
         * --->
         * Updated current tenant placeholders: [A, E, C, D, null]
         */
        for (let i = 0; i < currentTenantPlaceholders.length; i++) {
          /**
           * Break the loop if there are no new tenants
           */
          if (newTenants.length === 0) break;

          /**
           * Skip the tenant placeholder if the tenant ID is the same as the previous tenant placeholder with the same index
           */
          if (
            i < previousTenantPlaceholders.length &&
            currentTenantPlaceholders[i].tenantId ===
              previousTenantPlaceholders[i].tenant?.id
          ) {
            continue;
          }

          /**
           * Get the first new tenant
           */
          const newTenant = newTenants.shift();

          if (newTenant) {
            /**
             * Update the tenant placeholder with the new tenant
             */
            await prisma.tenantPlaceholder.update({
              where: {
                rotationAssignmentId_index: {
                  rotationAssignmentId: RotationAssignment.id,
                  index: currentTenantPlaceholders[i].index,
                },
              },
              data: {
                tenantId: newTenant.tenantId,
              },
            });

            /**
             * If it's the last tenant, update the original tenant placeholder with null
             */
            if (newTenants.length === 0) {
              await prisma.tenantPlaceholder.update({
                where: {
                  rotationAssignmentId_index: {
                    rotationAssignmentId: RotationAssignment.id,
                    index: newTenant.index,
                  },
                },
                data: {
                  tenantId: null,
                },
              });
            }
          }
        }

        return deletedTenant;
      });

      return c.json(result, 201);
    } catch (error) {
      console.error(
        SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR('deleting the tenant'),
        error,
      );
      return c.json(
        {
          error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR('deleting the tenant'),
        },
        500,
      );
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

        const tenants = c.var.getTenantsBySharehouseId(shareHouseId);

        if (tenants.some((tenant) => tenant.email === sanitizedEmail))
          return c.json(
            {
              error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY('tenant email'),
            },
            400,
          );

        const sharehouse = c.var.getSharehouseById(shareHouseId);

        if (!sharehouse) {
          return c.json(
            { error: SERVER_ERROR_MESSAGES.NOT_FOUND('share house') },
            404,
          );
        }

        const { RotationAssignment, assignmentSheet } = sharehouse;

        if (tenants.length >= CONSTRAINTS.TENANT_MAX_AMOUNT) {
          return c.json(
            {
              error: SERVER_ERROR_MESSAGES.MAX_LIMIT_REACHED(
                'tenants',
                CONSTRAINTS.TENANT_MAX_AMOUNT,
              ),
            },
            400,
          );
        }

        // Check if the sharehouse has a tenant with the same name
        const tenantWithSameName = tenants.find((t) => t.name === data.name);

        if (tenantWithSameName)
          return c.json(
            {
              error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY('tenant name'),
            },
            400,
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
              type: 'TENANT_INVITATION',
              callbackUrl: `${process.env.NEXT_PUBLIC_APPLICATION_URL!}/${assignmentSheet.id}/${newTenant.id}`,
            });
          } catch (error) {
            console.error(SERVER_ERROR_MESSAGES.EMAIL_SEND_ERROR, error);
            throw new Error(SERVER_ERROR_MESSAGES.EMAIL_SEND_ERROR);
          }

          return newTenant;
        });

        return c.json(transaction, 201);
      } catch (error) {
        console.error(
          SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR('creating the tenant'),
          error,
        );
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR(
              'creating the tenant',
            ),
          },
          500,
        );
      }
    },
  );

export default app;
