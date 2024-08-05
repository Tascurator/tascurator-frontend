/**
 * Get the base URL of the application based on the environment.
 * If the environment is production, the base URL will be the production URL, such as https://example.com.
 * If the environment is not production, the base URL will be the Vercel URL, such as https://example.vercel.app.
 * If the environment is not Vercel, the base URL will be http://localhost:3000.
 *
 * @returns {string} The base URL of the application
 */
export const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : `http://localhost:3000`;
};
