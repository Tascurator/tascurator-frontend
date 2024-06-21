import { Hono } from 'hono';

export const app = new Hono();

export default app;

app.get('/', (c) => {
  return c.json({ message: 'share house route' });
});

app.get('/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({ message: `Share house id: ${shareHouseId}` });
});

app.patch('/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({ message: `Updating share house id: ${shareHouseId}` });
});

app.delete('/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({ message: `Deleting share house id: ${shareHouseId}` });
});

app.post('/:landlordId', (c) => {
  const landlordId = c.req.param('landlordId');
  return c.json({
    message: `Landlord id for creating new share hose: ${landlordId}`,
  });
});
