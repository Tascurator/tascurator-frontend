import { Hono } from 'hono';

export const app = new Hono();

export default app;

app.get('/', (c) => {
  return c.json({ message: 'Share houses route' });
});

app.get('/:landlord_id', (c) => {
  const landlord_id = c.req.param('landlord_id');
  return c.json({ message: `Landlord id: ${landlord_id}` });
});
