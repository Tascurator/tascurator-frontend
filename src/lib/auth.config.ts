import { type NextAuthConfig } from 'next-auth';
import Credentials from '@auth/core/providers/credentials';
import { loginSchema } from '@/constants/schema';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default {
  providers: [
    Credentials({
      /**
       * Authorize the user based on the credentials
       * This checks if the user exists and the password is correct
       */
      authorize: async (credentials) => {
        try {
          const validatedFields = loginSchema.safeParse(credentials);

          if (validatedFields.success) {
            const { email, password } = validatedFields.data;

            if (!email || !password) {
              throw new Error('Missing credentials.');
            }

            const user = await prisma.landlord.findUnique({
              where: { email },
            });

            if (!user) return null;

            const passwordValid = await bcrypt.compare(password, user.password);

            if (passwordValid) {
              return user;
            } else {
              throw new Error(
                'Invalid credentials. Please check your email and password.',
              );
            }
          }

          return null;
        } catch (error) {
          console.error('Authorize user:', error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
