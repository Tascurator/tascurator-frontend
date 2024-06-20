import { Hono } from 'hono';

const app = new Hono();

export default app;

app.patch('/:taskId', (c) => {
  const taskId = c.req.param('taskId');
  return c.json({ message: `Updating task id: ${taskId}` });
});

app.post('/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({ message: `Creating task share house id: ${shareHouseId}` });
});

app.delete('/:taskId', (c) => {
  const taskId = c.req.param('taskId');
  return c.json({ message: `Deleting task id: ${taskId}` });
});
