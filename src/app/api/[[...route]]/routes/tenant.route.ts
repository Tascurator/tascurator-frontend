import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { Tenant } from '@prisma/client';
import { tenantInvitationSchema } from '@/constants/schema';
import { SERVER_MESSAGES } from '@/constants/server-messages';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
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
        const session = await auth();

        if (!session) {
          return c.json(
            {
              error: SERVER_MESSAGES.AUTH_REQUIRED,
            },
            401,
          );
        }

        const tenantId = c.req.param('tenantId');
        const data = c.req.valid('json');

        const tenant = await prisma.tenant.findUnique({
          where: {
            id: tenantId,
          },
          include: {
            tenantPlaceholders: {
              include: {
                rotationAssignment: {
                  include: {
                    shareHouse: true,
                  },
                },
              },
            },
          },
        });

        if (!tenant)
          return c.json({ error: SERVER_MESSAGES.NOT_FOUND('tenant') }, 404);

        const shareHouseId =
          tenant.tenantPlaceholders[0]?.rotationAssignment.shareHouse.id;

        if (data.name === tenant.name)
          return c.json({ message: SERVER_MESSAGES.CHANGE_SAME_NAME }, 200);

        // Check if the sharehouse has a tenant with the same name
        const tenantWithSameName = await prisma.tenant.findFirst({
          where: {
            name: data.name,
            tenantPlaceholders: {
              some: {
                rotationAssignment: {
                  shareHouseId: shareHouseId,
                },
              },
            },
          },
        });

        if (tenantWithSameName)
          return c.json(
            {
              error: SERVER_MESSAGES.DUPLICATE_ENTRY(
                'name',
                'tenant',
                'share house',
              ),
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
          SERVER_MESSAGES.CONSOLE_COMPLETION_ERROR('updating the tenant'),
          error,
        );
        return c.json(
          {
            error: SERVER_MESSAGES.COMPLETION_ERROR('updating the tenant'),
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
      const tenant = await prisma.tenant.findUnique({
        where: {
          id: tenantId,
        },
      });
      if (!tenant)
        return c.json({ error: SERVER_MESSAGES.NOT_FOUND('tenant') }, 404);

      const deleteTenant = await prisma.tenant.delete({
        where: {
          id: tenantId,
        },
      });
      return c.json(deleteTenant, 201);
    } catch (error) {
      console.error(
        SERVER_MESSAGES.CONSOLE_COMPLETION_ERROR('deleting the tenant'),
        error,
      );
      return c.json(
        {
          error: SERVER_MESSAGES.COMPLETION_ERROR('deleting the tenant'),
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
        const session = await auth();

        if (!session) {
          return c.json(
            {
              error: SERVER_MESSAGES.AUTH_REQUIRED,
            },
            401,
          );
        }

        const shareHouseId = c.req.param('shareHouseId');
        const data = c.req.valid('json');

        const sanitizedEmail = data.email.toLowerCase();
        const existingTenant = await prisma.tenant.findFirst({
          where: {
            email: sanitizedEmail,
            tenantPlaceholders: {
              some: {
                rotationAssignment: {
                  shareHouseId: shareHouseId,
                },
              },
            },
          },
        });

        if (existingTenant)
          return c.json(
            {
              error: SERVER_MESSAGES.DUPLICATE_ENTRY(
                'email',
                'tenant',
                'share house',
              ),
            },
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
              error: SERVER_MESSAGES.NOT_FOUND(
                'share house, rotationAssignment, or assignmentSheet',
              ),
            },
            404,
          );

        // Check if the sharehouse has a tenant with the same name
        const tenantWithSameName = await prisma.tenant.findFirst({
          where: {
            name: data.name,
            tenantPlaceholders: {
              some: {
                rotationAssignment: {
                  shareHouseId: shareHouseId,
                },
              },
            },
          },
        });

        if (tenantWithSameName)
          return c.json(
            {
              error: SERVER_MESSAGES.DUPLICATE_ENTRY(
                'name',
                'tenant',
                'share house',
              ),
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
              subject: EMAILS.TENANT_INVITATION.subject,
              html: EMAILS.TENANT_INVITATION.html(
                `${process.env.NEXT_PUBLIC_APPLICATION_URL!}/${assignmentSheet.id}/${newTenant.id}`,
              ),
            });
          } catch (error) {
            console.error(SERVER_MESSAGES.EMAIL_SEND_ERROR, error);
            throw new Error(SERVER_MESSAGES.EMAIL_SEND_ERROR);
          }

          return newTenant;
        });

        return c.json(transaction, 201);
      } catch (error) {
        console.error(
          SERVER_MESSAGES.CONSOLE_COMPLETION_ERROR('creating the tenant'),
          error,
        );
        return c.json(
          {
            error: SERVER_MESSAGES.COMPLETION_ERROR('creating the tenant'),
          },
          500,
        );
      }
    },
  );

export default app;
