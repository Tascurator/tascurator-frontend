import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';
import { NextRequest, NextResponse } from 'next/server';
import {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from '@/app/api/[[...route]]/route';

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig);

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  // Get the session for if the user is logged in
  const session = await auth();

  // Validate if the route is an auth route or public route
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Redirect to the login page if the user is not logged in
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // Redirect to the login page if the user is not logged in
  if (!session) {
    if (isAuthRoute || isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
});

/** Optionally, don't invoke Middleware on some paths
 * @see https://nextjs.org/docs/pages/building-your-application/routing/middleware#matcher
 * Plus, api/auth and logo.svg are excluded from the middleware
 */
export const config = {
  matcher: ['/((?!_next/static|api/auth|logo.svg|_next/image|favicon.ico).*)'],
};
