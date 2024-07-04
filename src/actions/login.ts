'use server';

import { signIn } from '@/lib/auth';
import { TLoginSchema } from '@/constants/schema';

export const login = async (credentials: TLoginSchema) => {
  /**
   * TODO: Please implement the proper sign in logic.
   */
  await signIn('credentials', {
    ...credentials,
    redirect: true,
  });
};
