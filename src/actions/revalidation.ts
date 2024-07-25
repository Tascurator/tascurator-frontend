'use server';

import { revalidatePath } from 'next/cache';

export const revalidatePage = (path: string) => {
  revalidatePath(path);
};
