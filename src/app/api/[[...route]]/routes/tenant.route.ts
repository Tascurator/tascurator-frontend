import { Hono } from 'hono';

const app = new Hono();

export default app;

app.patch('/:tenantId', (c) => {
  const tenantId = c.req.param('tenantId');
  return c.json({ message: `Updating tenant id: ${tenantId}` });
});

app.delete('/:tenantId', (c) => {
  const tenantId = c.req.param('tenantId');
  return c.json({ message: `Deleting tenant id: ${tenantId}` });
});

app.post('/:shareHouseId', (c) => {
  const shareHouseId = c.req.param('shareHouseId');
  return c.json({
    message: `Creating share house id for tenant: ${shareHouseId}`,
  });
});

app.get('/:assignmentSheetId/:tenantId', (c) => {
  const assignmentSheetId = c.req.param('assignmentSheetId');
  const tenantId = c.req.param('tenantId');
  return c.json({
    message: `Assignment sheet id: ${assignmentSheetId}, tenant id: ${tenantId}`,
  });
});

app.patch('/:assignmentSheetId/:tenantId', (c) => {
  const assignmentSheetId = c.req.param('assignmentSheetId');
  const tenantId = c.req.param('tenantId');
  return c.json({
    message: `Updating assignment sheet id: ${assignmentSheetId}, tenant id: ${tenantId}`,
  });
});
