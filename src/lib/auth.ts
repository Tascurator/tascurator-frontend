import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from '@/lib/auth.config';
import prisma from '@/lib/prisma';
import { getUserById } from '@/utils/prisma-helper';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user }) {
      // Allow only users with email verified to sign in
      const existingUser = await getUserById(user.id!);
      if (!existingUser?.emailVerified) {
        throw false;
      }

      return true;
    },
    session: ({ session, token }) => {
      /**
       * Add the user id (token.sub) to the session object.
       * This makes it available in the session object to retrieve it globally.
       */
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  ...authConfig,
});
