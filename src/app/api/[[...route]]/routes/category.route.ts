import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { categoryCreationSchema } from '@/constants/schema';
import { CONSTRAINTS } from '@/constants/constraints';
import prisma from '@/lib/prisma';

const app = new Hono();

export default app;

app.patch(
  '/:categoryId',
  zValidator('json', categoryCreationSchema.pick({ category: true })),
  async (c) => {
    try {
      const categoryId = c.req.param('categoryId');
      const data = c.req.valid('json');

      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) return c.json({ error: 'Category not found' }, 404);

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
);

app.delete('/:categoryId', (c) => {
  const categoryId = c.req.param('categoryId');
  return c.json({ message: `Deleting category id: ${categoryId}` });
});

app.post(
  '/:shareHouseId',
  zValidator('json', categoryCreationSchema.omit({ descriptionCount: true })),
  async (c) => {
    try {
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
          { error: 'RotationAssignment not found for the given shareHouseId' },
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
