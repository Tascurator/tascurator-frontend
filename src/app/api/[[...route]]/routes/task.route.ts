import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { taskCreationSchema, taskUpdateSchema } from '@/constants/schema';
import { CONSTRAINTS } from '@/constants/constraints';
import prisma from '@/lib/prisma';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';

const app = new Hono()

  /**
   * Updates a task's title or description by its ID
   * @route PATCH /api/task/:taskId
   */
  .patch('/:taskId', zValidator('json', taskUpdateSchema), async (c) => {
    try {
      const taskId = c.req.param('taskId');
      const data = c.req.valid('json');

      if (!data || Object.keys(data).length === 0)
        return c.json({ error: 'No data' }, 400);

      const task = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

      if (!task)
        return c.json({ error: SERVER_ERROR_MESSAGES.NOT_FOUND('task') }, 404);

      const updateData: { title?: string; description?: string } = {};
      if (data.title) updateData.title = data.title;
      if (data.description) updateData.description = data.description;

      const updateTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: updateData,
      });

      return c.json(updateTask, 201);
    } catch (error) {
      console.error('Error updating task:', error);
      return c.json(
        { error: 'An error occurred while updating the task' },
        500,
      );
    }
  })

  /**
   * Creates a new task for a category
   * @route POST /api/task
   */
  .post('/', zValidator('json', taskCreationSchema), async (c) => {
    try {
      const data = c.req.valid('json');
      const category = await prisma.category.findUnique({
        where: {
          id: data.categoryId,
        },
        include: {
          tasks: true,
        },
      });

      if (!category) {
        return c.json(
          { error: SERVER_ERROR_MESSAGES.NOT_FOUND('category') },
          404,
        );
      }

      if (category.tasks.length > CONSTRAINTS.TASK_MAX_AMOUNT)
        return c.json(
          {
            error: `The number of tasks has reached the maximum limit of ${CONSTRAINTS.TASK_MAX_AMOUNT}`,
          },
          404,
        );

      const newTask = await prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          category: {
            connect: { id: data.categoryId },
          },
        },
      });

      return c.json(newTask, 201);
    } catch (error) {
      console.error('Error creating task:', error);
      return c.json(
        { error: 'An error occurred while creating the task' },
        500,
      );
    }
  })

  /**
   * Deletes a task by its ID
   * @route DELETE /api/task/:taskId
   */
  .delete('/:taskId', async (c) => {
    try {
      const taskId = c.req.param('taskId');
      const task = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

      if (!task)
        return c.json({ error: SERVER_ERROR_MESSAGES.NOT_FOUND('task') }, 404);

      const tasks = await prisma.task.findMany({
        where: {
          categoryId: task.categoryId,
        },
      });

      if (tasks.length <= 1)
        return c.json(
          { error: 'You are not allowed to delete this task' },
          403,
        );

      const deleteTask = await prisma.task.delete({
        where: {
          id: taskId,
        },
      });

      return c.json(deleteTask, 201);
    } catch (error) {
      console.error('Error deleting the task:', error);
      return c.json(
        { error: 'An error occurred while deleting the task' },
        500,
      );
    }
  });

export default app;
