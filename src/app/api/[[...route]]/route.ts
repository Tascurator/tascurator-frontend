import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import sharehouseRoute from './routes/sharehouse.route';
import sharehousesRoute from './routes/sharehouses.ruote';
import rotationRoute from './routes/rotation.route';
import categoryRoute from './routes/category.route';
import taskRoute from './routes/task.route';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

const defaultRoutes = [
  { path: '/sharehouse', route: sharehouseRoute },
  { path: '/sharehouses', route: sharehousesRoute },
  { path: '/rotation', route: rotationRoute },
  { path: '/category', route: categoryRoute },
  { path: '/task', route: taskRoute },
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
