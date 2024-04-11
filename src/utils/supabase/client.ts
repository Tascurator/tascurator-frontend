import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

// If you're using Supabase on the client component, use this function to create a client instance.
export const createSupabaseBrowserClient = () => {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
