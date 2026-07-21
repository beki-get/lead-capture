import { createBrowserClient } from '@supabase/ssr';
 
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 
  if (!url || !anonKey) {
    throw new Error(
      'Missing required environment variables. ' +
        'Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set in .env, ' +
        'then restart the dev server.'
    );
  }
 
  return createBrowserClient(url, anonKey);
}

