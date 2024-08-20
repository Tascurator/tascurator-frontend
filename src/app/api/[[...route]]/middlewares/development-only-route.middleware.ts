import { createMiddleware } from 'hono/factory';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';

export const developmentOnlyRouteMiddleware = createMiddleware(
  async (c, next) => {
    if (
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
      process.env.NODE_ENV === 'production'
    ) {
      return c.json(
        { error: SERVER_ERROR_MESSAGES.DEVELOPMENT_ONLY_ROUTE },
        404,
      );
    }

    await next();
  },
);
