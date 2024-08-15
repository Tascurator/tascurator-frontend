import type { Prisma } from '@prisma/client';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { CONSTRAINTS } from '@/constants/constraints';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import {
  shareHouseConfirmSchema,
  shareHouseNameSchema,
} from '@/constants/schema';
import prisma from '@/lib/prisma';
import { addDays } from '@/utils/dates';
import type { Category, Tenant } from '@prisma/client';
import { InitialAssignedData } from '@/services/InitialAssignedData';
import { sendEmail } from '@/lib/resend';
import { EMAILS } from '@/constants/emails';
import { THonoEnv } from '@/types/hono-env';

const app = new Hono<THonoEnv>()

  /**
   * Retrieves the categories, tasks, rotation cycles, and tenants of a shareHouse by its ID
   * @route GET /api/shareHouse/:shareHouseId
   */
  .get('/:shareHouseId', (c) => {
    const shareHouseId = c.req.param('shareHouseId');

    try {
      const doesShareHouseExist = c.var.getSharehouseById(shareHouseId);

      /**
       * Ensure only the associated landlord can view the share house data
       */
      if (!doesShareHouseExist)
        return c.json(
          { error: SERVER_ERROR_MESSAGES.NOT_FOUND('share house') },
          404,
        );

      const tenants = c.var.getTenantsBySharehouseId(
        shareHouseId,
        'tenantCreatedAt',
      );
      const categories = c.var.getCategoriesBySharehouseId(shareHouseId);

      const { assignmentSheet, RotationAssignment, name } = doesShareHouseExist;

      const shareHouseData = {
        name,
        nextRotationStartDate: assignmentSheet.endDate.toISOString(),
        tenants,
        rotationCycle: RotationAssignment.rotationCycle,
        categories,
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
        const shareHouseId = c.req.param('shareHouseId');
        const data = c.req.valid('json');

        const shareHouse = c.var.getSharehouseById(shareHouseId);

        /**
         * Ensure only the associated landlord can update the share house
         */
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
        if (c.get('sharehouses').find((s) => s.name === data.name))
          return c.json(
            {
              error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY('share house name'),
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

      const shareHouse = c.var.getSharehouseById(shareHouseId);

      /**
       * Ensure only the associated landlord can delete the share house
       */
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
  .post('/', zValidator('json', shareHouseConfirmSchema), async (c) => {
    try {
      const landlordId = c.get('session').user.id;
      const data = c.req.valid('json');

      const shareHouses = c.get('sharehouses');

      // Check if the landlord has a share house with the same name
      if (shareHouses.find((s) => s.name === data.name))
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY('share house name'),
          },
          400,
        );

      if (shareHouses.length >= CONSTRAINTS.SHAREHOUSE_MAX_AMOUNT)
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
            error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY('category name'),
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
            error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY('tenant name'),
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
            error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY('tenant email'),
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
                `${process.env.NEXT_PUBLIC_APPLICATION_URL!}/${newAssignmentSheet.id}/${tenant.id}`,
              ),
            });

            await new Promise((resolve) => setTimeout(resolve, 650));
          }
        } catch (error) {
          console.error(SERVER_ERROR_MESSAGES.EMAIL_SEND_ERROR, error);
          throw new Error(SERVER_ERROR_MESSAGES.EMAIL_SEND_ERROR);
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
