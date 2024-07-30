import type { NextAuthConfig } from 'next-auth';
import Credentials from '@auth/core/providers/credentials';
import { loginSchema } from '@/constants/schema';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/utils/prisma-helper';

export default {
  providers: [
    Credentials({
      /**
       * Authorize the user based on the credentials
       * This checks if the user exists and the password is correct
       */
      authorize: async (credentials) => {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user) return null;

          const passwordValid = await bcrypt.compare(password, user.password);

          if (passwordValid) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
