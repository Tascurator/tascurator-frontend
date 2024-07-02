import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

import sharehouseRoute from './routes/sharehouse.route';
import sharehousesRoute from './routes/sharehouses.ruote';
import rotationRoute from './routes/rotation.route';
import categoryRoute from './routes/category.route';
import taskRoute from './routes/task.route';
import tenantRoute from './routes/tenant.route';

const app = new Hono().basePath('/api');

const defaultRoutes = [
  { path: '/sharehouse', route: sharehouseRoute },
  { path: '/sharehouses', route: sharehousesRoute },
  { path: '/rotation', route: rotationRoute },
  { path: '/category', route: categoryRoute },
  { path: '/task', route: taskRoute },
  { path: '/tenant', route: tenantRoute },
];

/**
 * This is a test route to check if the user is logged in.
 * TODO: Remove this route before deploying to production.
 */
app.get('/whoami', async (c) => {
  const session = await auth();

  if (!session) {
    return c.json({
      message: 'You are not logged in!',
    });
  }

  const landlord = await prisma.landlord.findUnique({
    where: { id: session.user.id },
  });

  return c.json({
    message: 'You are logged in!',
    session,
    landlord,
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
