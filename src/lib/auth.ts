import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from '@/lib/auth.config';
import prisma from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
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
  pages: {
    signIn: '/login',
  },
  ...authConfig,
});
