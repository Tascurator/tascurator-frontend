'use server';

import { signIn } from '@/lib/auth';
import { TLoginSchema } from '@/constants/schema';
import { AuthError, CredentialsSignin } from 'next-auth';

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
    if (error instanceof CredentialsSignin) {
      switch (error.code) {
        case 'email_not_verified':
          return { error: TOAST_ERROR_MESSAGES.EMAIL_NOT_VERIFIED };
        default:
          return { error: TOAST_ERROR_MESSAGES.UNKNOWN_ERROR };
      }
    }
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
