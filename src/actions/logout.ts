'use server';

import { signOut } from '@/lib/auth';

export const logout = async () => {
  /**
   * TODO: Please implement the proper sign out logic.
   */
  await signOut({ redirect: true });
};
