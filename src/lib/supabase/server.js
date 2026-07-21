
// Supabase client for use inside Server Components, Server Actions, and
// Route Handlers. Reads/writes the session via Next's
// cookies() so the server always sees the same session as the browser.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function getRequiredEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        'Add it to .env.local (see .env.example) and restart the dev server.'
    );
  }
  return value;
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            
          }
        },
      },
    }
  );
}