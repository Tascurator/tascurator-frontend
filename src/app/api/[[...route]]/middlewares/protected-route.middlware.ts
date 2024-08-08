import { createMiddleware } from 'hono/factory';
import { auth } from '@/lib/auth';
import { Env } from '@/app/api/[[...route]]/route';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';

/**
 * Middleware to check if the user is logged in.
 * If the user is not logged in, return 401.
 * If the user is logged in, set the session in the context.
 */
export const protectedRouteMiddleware = createMiddleware<Env>(
  async (c, next) => {
    const session = await auth();

    if (!session) {
      return c.json({ error: SERVER_ERROR_MESSAGES.UNAUTHORIZED }, 401);
    }

    /**
     * Set the session in the context
     */
    c.set('session', session);

    await next();
  },
);
