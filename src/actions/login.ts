'use server';

import { signIn } from '@/lib/auth';
import { TLoginSchema } from '@/constants/schema';
import { AuthError } from 'next-auth';

import { redirect } from 'next/navigation';
import { AUTH_INDEX_PAGE_REDIRECT } from '@/middleware';
import { TOAST_ERROR_MESSAGES } from '@/constants/toast-texts';

export const login = async (credentials: TLoginSchema) => {
  try {
    await signIn('credentials', {
      ...credentials,
      redirectTo: AUTH_INDEX_PAGE_REDIRECT,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        // This error is thrown when the credentials are invalid.
        case 'CredentialsSignin':
          return { error: TOAST_ERROR_MESSAGES.CREDENTIAL_INVALID };

        // This error is thrown when the callback route is not found.
        case 'CallbackRouteError':
          return { error: TOAST_ERROR_MESSAGES.UNKNOWN_ERROR };

        default:
          return { error: TOAST_ERROR_MESSAGES.UNKNOWN_ERROR };
      }
    }
    return { error: TOAST_ERROR_MESSAGES.UNKNOWN_ERROR };
  }

  redirect(AUTH_INDEX_PAGE_REDIRECT);
};
