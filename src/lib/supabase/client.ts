// Supabase Client Configuration - Without Strict Types

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a Supabase client without strict database typing
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Singleton client
let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  if (!client) {
    client = createClient();
  }
  return client;
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'your_supabase_project_url' &&
    !supabaseUrl.includes('your_supabase')
  );
}

export default getSupabase;
