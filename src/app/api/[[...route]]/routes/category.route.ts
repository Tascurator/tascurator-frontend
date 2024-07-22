import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { categoryCreationSchema } from '@/constants/schema';
import { CONSTRAINTS } from '@/constants/constraints';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

const app = new Hono()

  /**
   * Updates a category's name by its ID
   * @route PATCH /api/category/:categoryId
   */
  .patch(
    '/:categoryId',
    zValidator('json', categoryCreationSchema.pick({ category: true })),
    async (c) => {
      try {
        const session = await auth();

        if (!session) {
          return c.json(
            {
              error: 'You are not logged in!',
            },
            401,
          );
        }

        const categoryId = c.req.param('categoryId');
        const data = c.req.valid('json');

        const category = await prisma.category.findUnique({
          where: {
            id: categoryId,
          },
          include: {
            rotationAssignment: true,
          },
        });

        if (!category) return c.json({ error: 'Category not found' }, 404);

        const shareHouseId = category.rotationAssignment.shareHouseId;

        // Check if the sharehouse has a category with the same name
        const categoryWithSameName = await prisma.category.findFirst({
          where: {
            name: data.category,
            rotationAssignment: {
              shareHouseId: shareHouseId,
            },
          },
        });

        if (categoryWithSameName)
          return c.json({ error: 'Category name already exists' }, 400);

        const updateCategory = await prisma.category.update({
          where: {
            id: categoryId,
          },
          data: {
            name: data.category,
          },
        });

        return c.json(updateCategory, 201);
      } catch (error) {
        console.error(error);
        return c.json({ error: 'An error occurred while updating data' }, 500);
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
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      if (!category) return c.json({ error: 'Category not found' }, 404);

      const categories = await prisma.category.findMany({
        where: {
          rotationAssignmentId: category.rotationAssignmentId,
        },
      });

      if (categories.length <= 1)
        return c.json(
          { error: 'You are not allowed to delete this category' },
          403,
        );

      const deleteCategory = await prisma.category.delete({
        where: {
          id: categoryId,
        },
      });

      return c.json(deleteCategory, 201);
    } catch (error) {
      console.error('Error deleting the category:', error);
      return c.json(
        { error: 'An error occurred while updating the category' },
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
        const session = await auth();

        if (!session) {
          return c.json(
            {
              error: 'You are not logged in!',
            },
            401,
          );
        }

        const shareHouseId = c.req.param('shareHouseId');
        const data = c.req.valid('json');

        const rotationAssignment = await prisma.rotationAssignment.findUnique({
          where: {
            shareHouseId: shareHouseId,
          },
          include: {
            categories: true,
          },
        });

        if (!rotationAssignment) {
          return c.json(
            {
              error: 'RotationAssignment not found for the given shareHouseId',
            },
            404,
          );
        }

        if (
          rotationAssignment.categories.length > CONSTRAINTS.CATEGORY_MAX_AMOUNT
        ) {
          return c.json(
            {
              error: `The number of categories has reached the maximum limit of ${CONSTRAINTS.CATEGORY_MAX_AMOUNT}`,
            },
            400,
          );
        }

        // Check if the sharehouse has a category with the same name
        const categoryWithSameName = await prisma.category.findFirst({
          where: {
            name: data.category,
            rotationAssignment: {
              shareHouseId: shareHouseId,
            },
          },
        });

        if (categoryWithSameName)
          return c.json({ error: 'Category name already exists' }, 400);

        const newCategory = await prisma.category.create({
          data: {
            name: data.category,
            rotationAssignment: {
              connect: {
                id: rotationAssignment.id,
              },
            },
            tasks: {
              create: {
                title: data.title,
                description: data.description,
              },
            },
          },
        });

        return c.json(newCategory, 201);
      } catch (error) {
        console.error(error);
        return c.json(
          { error: 'An error occurred while creating the category' },
          500,
        );
      }
    },
  );

export default app;
