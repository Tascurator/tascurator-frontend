import { hc } from 'hono/client';
import { type AppType } from '@/app/api/[[...route]]/route';

/**
 * Creates a Hono client to work with RPC
 *
 * Without disabling the cache, this can't be used in server components
 * @credit https://zenn.dev/yoshikouki/articles/4e351b29a3cc56
 *
 * @see https://hono.dev/docs/guides/rpc
 */
const client = hc<AppType>(process.env.NEXT_PUBLIC_APPLICATION_URL!, {
  fetch: (input: RequestInfo | URL, requestInit?: RequestInit) =>
    fetch(input, {
      cache: 'no-store', // Opt-out of data caching
      ...requestInit,
    }),
});

/**
 * Use this to make requests to the API with RPC
 *
 * If you want to inject the user's cookie in server components, please include cookie: headers().get('cookie') || '' in the headers
 * @example
 * import { headers } from 'next/headers';
 *
 * const whoami = await api.whoami.$get(
 *   {
 *     //...
 *   },
 *   {
 *     headers: {
 *       cookie: headers().get('cookie') || ''
 *     }
 *   }
 * );
 * @see https://hono.dev/docs/guides/rpc#headers
 */
export const api = client.api;
