import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';

// Use only one of the two middleware options below
// 1. Use middleware directly

export const { auth: middleware } = NextAuth(authConfig);

// 2. Wrapped middleware option
// const { auth } = NextAuth(authConfig)
// export default auth(async function middleware(req: NextRequest) {
//   // Your custom middleware logic goes here
// })

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
