'use server';

import { signIn } from '@/lib/auth';
import { loginSchema, TLoginSchema } from '@/constants/schema';
import { AuthError } from 'next-auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/app/api/[[...route]]/route';

export const login = async (credentials: TLoginSchema) => {
  const validatedFields = loginSchema.safeParse(credentials);

  if (!validatedFields.success) {
    return { error: 'Invalid credentials' };
  }

  try {
    await signIn('credentials', {
      ...credentials,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
      redirect: false,
    });
  } catch (error) {
    // assert that error is of type Error to access its properties safely
    const e = error as Error & { cause?: { err: { code: string } } };

    //check if the error has a cause and err.code property
    if (e.cause?.err.code === 'credentials') {
      return {
        error: 'Invalid credentials. Please check your email and password!',
      };
    }

    //
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          console.error('Error signing in (Invalid credentials):', error);
          return { error: 'Invalid credentials(CredentialsSignin)' };
        default:
          console.error('Error signing in (Others):', error);
          return { error: 'Something went wrong' };
      }
    }

    throw error;
  }
};
