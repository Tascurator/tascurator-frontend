import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import sharehouseRoute from '@/app/api/[[...route]]/routes/sharehouse.route';
import sharehousesRoute from '@/app/api/[[...route]]/routes/sharehouses.ruote';
import rotationRoute from '@/app/api/[[...route]]/routes/rotation.route';
import categoryRoute from '@/app/api/[[...route]]/routes/category.route';
import taskRoute from '@/app/api/[[...route]]/routes/task.route';
import tenantRoute from '@/app/api/[[...route]]/routes/tenant.route';
import assignmentsRoute from '@/app/api/[[...route]]/routes/assignments.route';

const app = new Hono();

const routes = app
  .basePath('/api')
  .route('/sharehouse', sharehouseRoute)
  .route('/sharehouses', sharehousesRoute)
  .route('/rotation', rotationRoute)
  .route('/category', categoryRoute)
  .route('/task', taskRoute)
  .route('/tenant', tenantRoute)
  .route('/assignments', assignmentsRoute)
  /**
   * This is a test route to check if the user is logged in.
   * TODO: Remove this route before deploying to production.
   */
  .get('/whoami', async (c) => {
    const session = await auth();

    if (!session) {
      return c.json(
        {
          error: SERVER_ERROR_MESSAGES.AUTH_REQUIRED,
        },
        401,
      );
    }

    const landlord = await prisma.landlord.findUnique({
      where: { id: session.user.id },
    });

    return c.json({
      message: SERVER_ERROR_MESSAGES.AUTH_REQUIRED,
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

/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes: string[] = ['/forgot-password'];

/**
 * An array of routes are used for authentication.
 * These routes will redirect logged in users to /sharehouses.
 * @type {string[]}
 */
export const authRoutes: string[] = ['/login', '/signup'];

/**
 * The default route to redirect to after logging in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/sharehouses';
