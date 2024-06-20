import { Hono } from 'hono';

const app = new Hono();

export default app;

app.patch('/:categoryId', (c) => {
  const categoryId = c.req.param('categoryId');
  return c.json({ message: `Updating category id: ${categoryId}` });
});

app.delete('/:categoryId', (c) => {
  const categoryId = c.req.param('categoryId');
  return c.json({ message: `Deleting category id: ${categoryId}` });
});

app.post('/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({
    message: `Creating share house id for category: ${shareHouseId}`,
  });
});
