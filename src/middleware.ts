import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';
import { NextRequest, NextResponse } from 'next/server';

/**
 * An array of routes are used for default pages.
 * These routes will redirect logged in users to /sharehouses.
 * @type {string[]}
 */
const DEFAULT_ROUTES: string[] = ['/login', '/signup', '/forgot-password'];

/**
 * An array of routes are used for authentication.
 * These routes will redirect to /login if user is not logged in.
 * @type {string[]}
 */
const PROTECTED_ROUTES: RegExp[] = [/^\/sharehouses(\/.*)?$/];

/**
 * The default route to redirect to after logging in.
 * @type {string}
 */

const TENANT_REGEX =
  /^\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})+$/;

export const AUTH_INDEX_PAGE_REDIRECT: string = '/sharehouses';
export const DEFAULT_INDEX_PAGE_REDIRECT: string = '/login';

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig);

// // 2. Wrapped middleware option
const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  // Get the session for if the user is logged in
  const session = await auth();

  // Validate if the route is an auth route or public route
  const isDefaultRoute = DEFAULT_ROUTES.includes(nextUrl.pathname);
  const isProtectedRoute = PROTECTED_ROUTES.some((pattern) =>
    pattern.test(nextUrl.pathname),
  );
  const isTenantRoute = TENANT_REGEX.test(nextUrl.pathname);

  if (isTenantRoute) {
    return NextResponse.next();
  }

  // Redirect to the share house dashboard page if the user is logged in
  if (session && isDefaultRoute) {
    return NextResponse.redirect(new URL(AUTH_INDEX_PAGE_REDIRECT, nextUrl));
  }

  // Redirect to the login page if the user is not logged in
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL(DEFAULT_INDEX_PAGE_REDIRECT, nextUrl));
  }

  return NextResponse.next();
});

/** Optionally, don't invoke Middleware on some paths
 * @see https://nextjs.org/docs/pages/building-your-application/routing/middleware#matcher
 * Plus, api/auth and logo.svg are excluded from the middleware
 */
export const config = {
  matcher: [
    '/((?!_next/static|api/auth|api|logo.svg|_next/image|favicon.ico).*)',
  ],
};
