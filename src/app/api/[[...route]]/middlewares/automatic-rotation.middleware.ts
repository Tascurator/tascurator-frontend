import { createMiddleware } from 'hono/factory';
import { THonoEnv } from '@/types/hono-env';
import { automaticRotation } from '@/utils/automatic-rotation';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';

const { COMPLETION_ERROR, CONSOLE_COMPLETION_ERROR } = SERVER_ERROR_MESSAGES;

/**
 * Middleware that automatically rotates each share house's AssignedData.
 */
export const automaticRotationMiddleware = createMiddleware<THonoEnv>(
  async (c, next) => {
    try {
      /**
       * Automatically recreate AssignedData for each share house if the current date is after the end date of the current AssignedData.
       */
      await automaticRotation(c.get('sharehouses'));
    } catch (error) {
      console.error(
        CONSOLE_COMPLETION_ERROR(
          "automatically rotating each shared houses's AssignedData",
        ),
        error,
      );
      return c.json(
        {
          error: COMPLETION_ERROR("rotating each shared house's AssignedData"),
        },
        500,
      );
    }

    await next();
  },
);
