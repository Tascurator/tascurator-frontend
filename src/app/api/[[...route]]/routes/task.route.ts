import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { taskCreationSchema } from '@/constants/schema';
import prisma from '@/lib/prisma';

const app = new Hono();

export default app;

app.patch('/:taskId', (c) => {
  const taskId = c.req.param('taskId');
  return c.json({ message: `Updating task id: ${taskId}` });
});

app.post('/', zValidator('json', taskCreationSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      return c.json({ error: 'Category not found' }, 404);
    }

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
    return c.json({ error: 'An error occurred while creating the task' }, 500);
  }
});

app.delete('/:taskId', (c) => {
  const taskId = c.req.param('taskId');
  return c.json({ message: `Deleting task id: ${taskId}` });
});
