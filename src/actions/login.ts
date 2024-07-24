'use server';

import { signIn } from '@/lib/auth';
import { TLoginSchema } from '@/constants/schema';
import { AuthError } from 'next-auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/app/api/[[...route]]/route';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { redirect } from 'next/navigation';

export const login = async (credentials: TLoginSchema) => {
  try {
    await signIn('credentials', {
      ...credentials,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        // This error is thrown when the credentials are invalid.
        case 'CredentialsSignin':
          return { error: ERROR_MESSAGES.EMAIL_INVALID };

        // This error is thrown when the callback route is not found.
        case 'CallbackRouteError':
          return { error: 'Something went wrong!!' };

        default:
          return { error: 'Something went wrong' };
      }
    }
    console.error('Unexpected error:', error);
    return { error: 'Something went wrong' };
  }

  redirect(DEFAULT_LOGIN_REDIRECT);
};
