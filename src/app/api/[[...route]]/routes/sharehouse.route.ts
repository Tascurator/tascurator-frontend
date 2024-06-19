import { Hono } from 'hono';

export const app = new Hono();

export default app;

app.get('/', (c) => {
  return c.json({ message: 'share house route' });
});

app.get('/:share_house_id', (c) => {
  const share_house_id = c.req.param('share_house_id');
  return c.json({ message: `Share house id: ${share_house_id}` });
});

app.patch('/:share_house_id', (c) => {
  const share_house_id = c.req.param('share_house_id');
  return c.json({ message: `Updating share house id: ${share_house_id}` });
});

app.delete('/:share_house_id', (c) => {
  const share_house_id = c.req.param('share_house_id');
  return c.json({ message: `Deleting share house id: ${share_house_id}` });
});

app.post('/:landlord_id', (c) => {
  const landlord_id = c.req.param('landlord_id');
  return c.json({
    message: `Landlord id for creating new share hose: ${landlord_id}`,
  });
});
