import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import sharehouseRoute from './routes/sharehouse.route';
import sharehousesRoute from './routes/sharehouses.ruote';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

const defaultRoutes = [
  { path: '/sharehouse', route: sharehouseRoute },
  { path: '/sharehouses', route: sharehousesRoute },
];

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  });
});

for (const route of defaultRoutes) {
  console.log(`Adding route: /api${route.path}`);
  app.route(`${route.path}`, route.route);
}

/**
 * Expose HTTP methods for the app.
 */
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
