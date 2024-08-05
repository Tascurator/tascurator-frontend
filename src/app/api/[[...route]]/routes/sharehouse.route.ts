import type { Prisma } from '@prisma/client';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { CONSTRAINTS } from '@/constants/constraints';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import {
  shareHouseCreationSchema,
  shareHouseNameSchema,
} from '@/constants/schema';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { addDays } from '@/utils/dates';
import type { Category, Tenant } from '@prisma/client';
import { InitialAssignedData } from '@/services/InitialAssignedData';
import { sendEmail } from '@/lib/resend';
import { EMAILS } from '@/constants/emails';
import { getBaseUrl } from '@/utils/base-url';

const app = new Hono()

  /**
   * Retrieves the categories, tasks, rotation cycles, and tenants of a shareHouse by its ID
   * @route GET /api/shareHouse/:shareHouseId
   */
  .get('/:shareHouseId', async (c) => {
    const shareHouseId = c.req.param('shareHouseId');

    try {
      const shareHouseWithOtherTables = await prisma.shareHouse.findUnique({
        where: {
          id: shareHouseId,
        },
        include: {
          RotationAssignment: {
            include: {
              tenantPlaceholders: {
                include: {
                  tenant: true,
                },
                orderBy: [
                  { tenant: { createdAt: 'asc' } },
                  { tenant: { id: 'asc' } },
                ],
              },
              categories: {
                include: {
                  tasks: {
                    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
                  },
                },
                orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
              },
            },
          },
          assignmentSheet: {
            select: {
              endDate: true,
            },
          },
        },
      });

      if (!shareHouseWithOtherTables)
        return c.json(
          { error: SERVER_ERROR_MESSAGES.NOT_FOUND('share house') },
          404,
        );

      if (!shareHouseWithOtherTables.RotationAssignment)
        return c.json(
          { error: SERVER_ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
          500,
        );

      const shareHouseData = {
        nextRotationStartDate:
          shareHouseWithOtherTables.assignmentSheet.endDate.toISOString(),
        tenants: shareHouseWithOtherTables.RotationAssignment.tenantPlaceholders
          .map((tenantPlaceholder) => {
            if (tenantPlaceholder.tenant) {
              return {
                id: tenantPlaceholder.tenant.id,
                name: tenantPlaceholder.tenant.name,
                email: tenantPlaceholder.tenant.email,
                createdAt: tenantPlaceholder.tenant.createdAt,
              };
            }
            return null;
          })
          .filter((tenantPlaceholder) => tenantPlaceholder !== null),

        rotationCycle:
          shareHouseWithOtherTables.RotationAssignment.rotationCycle,
        categories: shareHouseWithOtherTables.RotationAssignment.categories.map(
          (category) => ({
            id: category.id,
            name: category.name,
            tasks: category.tasks.map((task) => ({
              id: task.id,
              title: task.title,
              description: task.description,
              createdAt: task.createdAt,
            })),
            createdAt: category.createdAt,
          }),
        ),
      };

      return c.json(shareHouseData);
    } catch (error) {
      console.error(
        SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR(
          'fetching data for the share house',
        ),
        error,
      );
      return c.json(
        {
          error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR(
            'fetching data for the share house',
          ),
        },
        500,
      );
    }
  })

  /**
   * Updates the name of a shareHouse by its ID
   * @route PATCH /api/shareHouse/:shareHouseId
   */
  .patch(
    '/:shareHouseId',
    zValidator('json', shareHouseNameSchema),
    async (c) => {
      try {
        const session = await auth();

        if (!session) {
          return c.json(
            {
              error: SERVER_ERROR_MESSAGES.AUTH_REQUIRED,
            },
            401,
          );
        }
        const landlordId = session.user.id;
        const shareHouseId = c.req.param('shareHouseId');
        const data = c.req.valid('json');

        const shareHouse = await prisma.shareHouse.findUnique({
          where: {
            id: shareHouseId,
          },
        });

        if (!shareHouse)
          return c.json(
            { error: SERVER_ERROR_MESSAGES.NOT_FOUND('share house') },
            404,
          );

        if (data.name === shareHouse.name)
          return c.json(
            { message: SERVER_ERROR_MESSAGES.CHANGE_SAME_NAME },
            200,
          );

        // Check if the landlord has a share house with the same name
        const ShareHouseWithSameName = await prisma.shareHouse.findFirst({
          where: {
            name: data.name,
            landlordId: landlordId,
          },
        });

        if (ShareHouseWithSameName)
          return c.json(
            {
              error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY(
                'name',
                'share house',
                'landlord',
              ),
            },
            400,
          );

        const updateShareHouse = await prisma.shareHouse.update({
          where: {
            id: shareHouseId,
          },
          data: {
            name: data.name,
          },
        });

        return c.json(updateShareHouse, 201);
      } catch (error) {
        console.error(
          SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR(
            'updating data for the share house',
          ),
          error,
        );
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR(
              'updating data for the share house',
            ),
          },
          500,
        );
      }
    },
  )

  /**
   * Deletes a shareHouse by its ID
   * @route DELETE /api/shareHouse/:shareHouseId
   */
  .delete('/:shareHouseId', async (c) => {
    try {
      const shareHouseId = c.req.param('shareHouseId');
      const shareHouse = await prisma.shareHouse.findUnique({
        where: {
          id: shareHouseId,
        },
      });

      if (!shareHouse)
        return c.json(
          { error: SERVER_ERROR_MESSAGES.NOT_FOUND('share house') },
          404,
        );

      const transaction = await prisma.$transaction(async (prisma) => {
        const deleteShareHouse = await prisma.shareHouse.delete({
          where: {
            id: shareHouseId,
          },
          include: {
            assignmentSheet: true,
            RotationAssignment: {
              include: {
                tenantPlaceholders: {
                  include: {
                    tenant: true,
                  },
                },
                categories: {
                  include: {
                    tasks: true,
                  },
                },
              },
            },
          },
        });

        await prisma.assignmentSheet.delete({
          where: {
            id: deleteShareHouse.assignmentSheetId,
          },
        });

        await prisma.tenant.deleteMany({
          where: {
            tenantPlaceholders: {
              none: {},
            },
          },
        });

        return deleteShareHouse;
      });

      return c.json(transaction, 201);
    } catch (error) {
      console.error(
        SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR(
          'deleting the share house',
        ),
        error,
      );
      return c.json(
        {
          error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR(
            'deleting the share house',
          ),
        },
        500,
      );
    }
  })

  /**
   * Creates a shareHouse
   * @route POST /api/shareHouse
   */
  .post('/', zValidator('json', shareHouseCreationSchema), async (c) => {
    try {
      const session = await auth();

      if (!session) {
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.AUTH_REQUIRED,
          },
          401,
        );
      }
      const landlordId = session.user.id;
      const data = c.req.valid('json');

      const landlord = await prisma.landlord.findUnique({
        where: {
          id: landlordId,
        },
        include: {
          shareHouses: true,
        },
      });

      if (!landlord)
        return c.json(
          { error: SERVER_ERROR_MESSAGES.NOT_FOUND('landlord') },
          404,
        );

      // Check if the landlord has a share house with the same name
      const ShareHouseWithSameName = await prisma.shareHouse.findFirst({
        where: {
          name: data.name,
          landlordId: landlordId,
        },
      });

      if (ShareHouseWithSameName)
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY(
              'name',
              'share house',
              'landlord',
            ),
          },
          400,
        );

      if (landlord.shareHouses.length > CONSTRAINTS.SHAREHOUSE_MAX_AMOUNT)
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.MAX_LIMIT_REACHED(
              'shareHouses',
              CONSTRAINTS.SHAREHOUSE_MAX_AMOUNT,
            ),
          },
          400,
        );

      // Check for duplicate category names within the provided data
      const categories = data.categories.map((category) => category.name);
      const isDuplicatedCategoryName = categories.some(
        (category, idx) => categories.indexOf(category) !== idx,
      );
      if (isDuplicatedCategoryName)
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY(
              'name',
              'category',
              'provided data',
            ),
          },
          400,
        );

      // Check for duplicate tenant names and emails within the provided data
      const tenantNames = data.tenants.map((tenant) => tenant.name);
      const isDuplicatedTenantName = tenantNames.some(
        (name, idx) => tenantNames.indexOf(name) !== idx,
      );
      if (isDuplicatedTenantName)
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY(
              'name',
              'tenant',
              'provided data',
            ),
          },
          400,
        );

      const tenantEmails = data.tenants.map((tenant) => tenant.email);
      const isDuplicatedTenantEmail = tenantEmails.some(
        (email, idx) => tenantEmails.indexOf(email) !== idx,
      );
      if (isDuplicatedTenantEmail)
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY(
              'email',
              'tenant',
              'provided data',
            ),
          },
          400,
        );

      const transaction = await prisma.$transaction(async (prisma) => {
        const startDate = new Date(data.startDate);
        const endDate = addDays(startDate, data.rotationCycle);

        const newAssignmentSheet = await prisma.assignmentSheet.create({
          data: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            assignedData: '',
          },
        });

        const newShareHouse = await prisma.shareHouse.create({
          data: {
            name: data.name,
            landlordId: landlordId,
            assignmentSheetId: newAssignmentSheet.id,
          },
        });

        const newRotationAssignment = await prisma.rotationAssignment.create({
          data: {
            shareHouseId: newShareHouse.id,
            rotationCycle: data.rotationCycle,
          },
        });

        const createdCategories: Category[] = [];
        for (const categoryData of data.categories) {
          const newCategory = await prisma.category.create({
            data: {
              name: categoryData.name,
              rotationAssignmentId: newRotationAssignment.id,
              tasks: {
                create: categoryData.tasks.map((task) => ({
                  title: task.title,
                  description: task.description,
                })),
              },
            },
          });
          createdCategories.push(newCategory);
        }

        const createdTenants: Tenant[] = [];
        for (let i = 0; i < data.tenants.length; i++) {
          const tenantData = data.tenants[i];
          const newTenant = await prisma.tenant.create({
            data: {
              name: tenantData.name,
              email: tenantData.email,
              extraAssignedCount: 0,
              tenantPlaceholders: {
                create: {
                  rotationAssignmentId: newRotationAssignment.id,
                  index: i,
                },
              },
            },
          });
          createdTenants.push(newTenant);
        }

        const sharehouse = await prisma.shareHouse.findUnique({
          where: { id: newShareHouse.id },
          select: {
            assignmentSheet: true,
            RotationAssignment: {
              select: {
                rotationCycle: true,
                categories: {
                  include: { tasks: true },
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

        if (!sharehouse || !sharehouse.RotationAssignment) {
          throw new Error(SERVER_ERROR_MESSAGES.NOT_FOUND('shareHouse'));
        }

        const newInitialAssignedData = new InitialAssignedData(
          sharehouse,
          startDate,
          data.rotationCycle,
        );

        const assignedData = newInitialAssignedData.getAssignedData();

        await prisma.assignmentSheet.update({
          where: {
            id: newAssignmentSheet.id,
          },
          data: {
            assignedData: assignedData as unknown as Prisma.JsonArray,
          },
        });

        /**
         * Send emails to each tenant with their personalized link
         */
        try {
          for (const tenant of createdTenants) {
            await sendEmail({
              to: tenant.email,
              subject: EMAILS.TENANT_INVITATION.subject,
              html: EMAILS.TENANT_INVITATION.html(
                `${getBaseUrl()}/${newAssignmentSheet.id}/${tenant.id}`,
              ),
            });
          }
        } catch (error) {
          console.error(SERVER_ERROR_MESSAGES.EMAIL_SEND_ERROR, error);
          return c.json(
            {
              error: SERVER_ERROR_MESSAGES.EMAIL_SEND_ERROR,
            },
            500,
          );
        }

        return {
          shareHouse: newShareHouse,
          rotationAssignment: newRotationAssignment,
          categories: createdCategories,
          tenants: createdTenants,
        };
      });

      return c.json(transaction, 201);
    } catch (error) {
      console.error(
        SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR(
          'creating data for the share house',
        ),
        error,
      );
      return c.json(
        {
          error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR(
            'creating data for the share house',
          ),
        },
        500,
      );
    }
  });

export default app;
