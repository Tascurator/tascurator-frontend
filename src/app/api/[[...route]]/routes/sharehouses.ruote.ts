import { Hono } from 'hono';

export const app = new Hono();

export default app;

app.get('/', (c) => {
  return c.json({ message: 'Share houses route' });
});

app.get('/:landlordId', (c) => {
  const landlordId = c.req.param('landlordId');
  return c.json({ message: `Landlord id: ${landlordId}` });
});
