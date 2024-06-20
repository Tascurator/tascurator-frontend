import { Hono } from 'hono';

export const app = new Hono();

export default app;

app.patch('/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({
    message: `share house id for rotation cycle: ${shareHouseId}`,
  });
});
