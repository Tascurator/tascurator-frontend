import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { categoryCreationSchema } from '@/constants/schema';
import { CONSTRAINTS } from '@/constants/constraints';
import prisma from '@/lib/prisma';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import { THonoEnv } from '@/app/api/[[...route]]/route';

const app = new Hono<THonoEnv>()

  /**
   * Updates a category's name by its ID
   * @route PATCH /api/category/:categoryId
   */
  .patch(
    '/:categoryId',
    zValidator('json', categoryCreationSchema.pick({ name: true })),
    async (c) => {
      try {
        const categoryId = c.req.param('categoryId');
        const data = c.req.valid('json');

        const doesCategoryExist = c.var.getCategoryById(categoryId);

        /**
         * Ensure only the associated landlord can update the category
         */
        if (doesCategoryExist === null) {
          return c.json(
            { error: SERVER_ERROR_MESSAGES.NOT_FOUND('category') },
            404,
          );
        }

        const { shareHouseId, category } = doesCategoryExist;

        if (data.name === category.name)
          return c.json(
            { message: SERVER_ERROR_MESSAGES.CHANGE_SAME_NAME },
            200,
          );

        // Check if the sharehouse has a category with the same name
        const categoryWithSameName = c.var
          .getCategoriesBySharehouseId(shareHouseId)
          .find((c) => c.name === data.name);

        if (categoryWithSameName)
          return c.json(
            {
              error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY(
                'name',
                'category',
                'share house',
              ),
            },
            400,
          );

        const updateCategory = await prisma.category.update({
          where: {
            id: categoryId,
          },
          data: {
            name: data.name,
          },
        });

        return c.json(updateCategory, 201);
      } catch (error) {
        console.error(
          SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR(
            'updating the category',
          ),
          error,
        );
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR(
              'updating the category',
            ),
          },
          500,
        );
      }
    },
  )

  /**
   * Deletes a category by its ID
   * @route DELETE /api/category/:categoryId
   */
  .delete('/:categoryId', async (c) => {
    try {
      const categoryId = c.req.param('categoryId');

      const doesCategoryExist = c.var.getCategoryById(categoryId);

      /**
       * Ensure only the associated landlord can update the category
       */
      if (doesCategoryExist === null) {
        return c.json(
          { error: SERVER_ERROR_MESSAGES.NOT_FOUND('category') },
          404,
        );
      }

      const categories = c.var.getCategoriesBySharehouseId(
        doesCategoryExist.shareHouseId,
      );

      if (categories.length <= 1)
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.DELETE_NOT_ALLOWED('category'),
          },
          403,
        );

      const deleteCategory = await prisma.category.delete({
        where: {
          id: categoryId,
        },
      });

      return c.json(deleteCategory, 201);
    } catch (error) {
      console.error(
        SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR(
          'deleting the category:',
        ),
        error,
      );
      return c.json(
        {
          error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR('delete the category'),
        },
        500,
      );
    }
  })

  /**
   * Creates a category
   * @route POST /api/category/:shareHouseId
   */
  .post(
    '/:shareHouseId',
    zValidator('json', categoryCreationSchema),
    async (c) => {
      try {
        const shareHouseId = c.req.param('shareHouseId');
        const data = c.req.valid('json');

        const doesShareHouseExist = c.var.getSharehouseById(shareHouseId);

        /**
         * Ensure only the associated landlord can create the category for the sharehouse
         */
        if (doesShareHouseExist === null) {
          return c.json(
            { error: SERVER_ERROR_MESSAGES.NOT_FOUND('share house') },
            404,
          );
        }

        const categories = c.var.getCategoriesBySharehouseId(shareHouseId);

        if (categories.length >= CONSTRAINTS.CATEGORY_MAX_AMOUNT) {
          return c.json(
            {
              error: SERVER_ERROR_MESSAGES.MAX_LIMIT_REACHED(
                'categories',
                CONSTRAINTS.CATEGORY_MAX_AMOUNT,
              ),
            },
            400,
          );
        }

        // Check if the sharehouse has a category with the same name
        const categoryWithSameName = categories.find(
          (c) => c.name === data.name,
        );

        if (categoryWithSameName)
          return c.json(
            {
              error: SERVER_ERROR_MESSAGES.DUPLICATE_ENTRY(
                'name',
                'category',
                'share house',
              ),
            },
            400,
          );

        const newCategory = await prisma.category.create({
          data: {
            name: data.name,
            rotationAssignment: {
              connect: {
                id: doesShareHouseExist.RotationAssignment.id,
              },
            },
            tasks: {
              create: {
                title: data.task.title,
                description: data.task.description,
              },
            },
          },
        });

        return c.json(newCategory, 201);
      } catch (error) {
        console.error(
          SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR(
            'creating the category',
          ),
          error,
        );
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR(
              'creating the category',
            ),
          },
          500,
        );
      }
    },
  );

export default app;
