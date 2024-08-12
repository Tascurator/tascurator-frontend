import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import prisma from '@/lib/prisma';
import sharehouseRoute from '@/app/api/[[...route]]/routes/sharehouse.route';
import sharehousesRoute from '@/app/api/[[...route]]/routes/sharehouses.ruote';
import rotationRoute from '@/app/api/[[...route]]/routes/rotation.route';
import categoryRoute from '@/app/api/[[...route]]/routes/category.route';
import taskRoute from '@/app/api/[[...route]]/routes/task.route';
import tenantRoute from '@/app/api/[[...route]]/routes/tenant.route';
import assignmentsRoute from '@/app/api/[[...route]]/routes/assignments.route';
import { protectedRouteMiddleware } from '@/app/api/[[...route]]/middlewares/protected-route.middlware';
import { sharehousesLoaderMiddleware } from '@/app/api/[[...route]]/middlewares/sharehouses-loader.middleware';
import { THonoEnv } from '@/types/hono-env';
import { automaticRotationMiddleware } from '@/app/api/[[...route]]/middlewares/automatic-rotation.middleware';

const app = new Hono<THonoEnv>();

const routes = app
  .basePath('/api')

  /**
   * Public routes that do not require the user to be logged in.
   */
  .route('/assignments', assignmentsRoute)

  /**
   * Protected routes that require the user to be logged in.
   */
  .use(protectedRouteMiddleware)
  .use(sharehousesLoaderMiddleware)
  .use(automaticRotationMiddleware)
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
    const landlord = await prisma.landlord.findUnique({
      where: { id: c.get('session').user.id },
    });

    return c.json({
      message: 'You are logged in!',
      session: c.get('session'),
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
