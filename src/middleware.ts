import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';
import { NextRequest } from 'next/server';
import {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from '@/app/api/[[...route]]/route';

// Use only one of the two middleware options below
// 1. Use middleware directly
export const { auth: middleware } = NextAuth(authConfig);

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
  const session = await auth();
  console.log('session:', session);
  const isLoggedIn = !!session;
  console.log('isLoggedIn:', isLoggedIn);

  const nextUrl = new URL(req.url);

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return new Response(null, { status: 401 }); // return Response 401 Unauthorized
  }
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/login', nextUrl));
  }

  return new Response(null, { status: 200 }); // return Response 200 OK
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
