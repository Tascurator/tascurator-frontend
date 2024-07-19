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

const app = new Hono();

const routes = app
  .basePath('/api')
  .route('/sharehouse', sharehouseRoute)
  .route('/sharehouses', sharehousesRoute)
  .route('/rotation', rotationRoute)
  .route('/category', categoryRoute)
  .route('/task', taskRoute)
  .route('/tenant', tenantRoute)

  /**
   * This is a test route to check if the user is logged in.
   * TODO: Remove this route before deploying to production.
   */
  .get('/whoami', async (c) => {
    const session = await auth();

    if (!session) {
      return c.json(
        {
          error: 'You are not logged in!',
        },
        401,
      );
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

/**
 * Expose the type of the api routes.
 */
export type AppType = typeof routes;

/**
 * Expose HTTP methods for the app.
 */
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
