'use server';

import { revalidatePath } from 'next/cache';

/**
 * Revalidates a page by its path.
 * This is useful when you want to update the cache of a page from client components.
 *
 * @param path - The path of the page to revalidate
 *
 * @example
 * "use client";
 * import { revalidatePage } from '@/actions/revalidation';
 * import { usePathname } from 'next/navigation'
 *
 * const path = usePathname(); // Get the current path like '/sharehouses'
 *
 * revalidatePage(path); // Call this action after a mutation
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/revalidatePath
 * @see https://nextjs.org/docs/app/api-reference/functions/use-pathname
 */
export const revalidatePage = (path: string) => {
  revalidatePath(path);
};
