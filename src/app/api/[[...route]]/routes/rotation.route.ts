import { Hono } from 'hono';

const app = new Hono();

export default app;

app.get('/current/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({
    message: `Share house id for current rotation: ${shareHouseId}`,
  });
});

app.get('/next/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({
    message: `Share house id for current rotation for next rotation: ${shareHouseId}`,
  });
});
