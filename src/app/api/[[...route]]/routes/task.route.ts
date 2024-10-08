import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { taskCreationSchema, taskUpdateSchema } from '@/constants/schema';
import { CONSTRAINTS } from '@/constants/constraints';
import prisma from '@/lib/prisma';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import { THonoEnv } from '@/types/hono-env';

const app = new Hono<THonoEnv>()

  /**
   * Updates a task's title or description by its ID
   * @route PATCH /api/task/:taskId
   */
  .patch('/:taskId', zValidator('json', taskUpdateSchema), async (c) => {
    try {
      const taskId = c.req.param('taskId');
      const data = c.req.valid('json');

      if (!data || Object.keys(data).length === 0)
        return c.json({ error: SERVER_ERROR_MESSAGES.NO_DATA_PROVIDED }, 400);

      const doesTaskExist = c.var.getTaskById(taskId);

      /**
       * Ensure only the associated landlord can update the task
       */
      if (!doesTaskExist)
        return c.json({ error: SERVER_ERROR_MESSAGES.NOT_FOUND('task') }, 404);

      const { task } = doesTaskExist;

      if (data.title === task.title)
        return c.json({ message: SERVER_ERROR_MESSAGES.CHANGE_SAME_NAME }, 200);

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
      console.error(
        SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR('updating the task'),
        error,
      );
      return c.json(
        {
          error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR('updating the task'),
        },
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

      const doesCategoryExist = c.var.getCategoryById(data.categoryId);

      /**
       * Ensure only the associated landlord can create a task for the category
       */
      if (!doesCategoryExist) {
        return c.json(
          { error: SERVER_ERROR_MESSAGES.NOT_FOUND('category') },
          404,
        );
      }

      const { category } = doesCategoryExist;

      if (category.tasks.length >= CONSTRAINTS.TASK_MAX_AMOUNT)
        return c.json(
          {
            error: SERVER_ERROR_MESSAGES.MAX_LIMIT_REACHED(
              'tasks',
              CONSTRAINTS.TASK_MAX_AMOUNT,
            ),
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
      console.error(
        SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR('creating the task'),
        error,
      );
      return c.json(
        { error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR('creating the task') },
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

      const doesTaskExist = c.var.getTaskById(taskId);

      /**
       * Ensure only the associated landlord can delete the task
       */
      if (!doesTaskExist)
        return c.json({ error: SERVER_ERROR_MESSAGES.NOT_FOUND('task') }, 404);

      const tasks = c.var.getTasksByCategoryId(doesTaskExist.categoryId);

      if (tasks.length <= 1)
        return c.json(
          { error: SERVER_ERROR_MESSAGES.DELETE_NOT_ALLOWED('task') },
          403,
        );

      const deleteTask = await prisma.task.delete({
        where: {
          id: taskId,
        },
      });

      return c.json(deleteTask, 201);
    } catch (error) {
      console.error(
        SERVER_ERROR_MESSAGES.CONSOLE_COMPLETION_ERROR('deleting the task'),
        error,
      );
      return c.json(
        { error: SERVER_ERROR_MESSAGES.COMPLETION_ERROR('deleting the task') },
        500,
      );
    }
  });

export default app;
