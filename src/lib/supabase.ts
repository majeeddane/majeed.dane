import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client-side Supabase client (uses anon key - respects RLS)
let supabaseInstance: SupabaseClient | null = null;

export function getClientSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
      );
    }
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

// For backward compatibility
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as unknown as SupabaseClient;

// Server-side Supabase client (uses service role key - bypasses RLS)
// Only use in API routes / server-side code
export function getServerSupabase(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local'
    );
  }
  return createClient(supabaseUrl, serviceRoleKey);
}

// Storage bucket name
export const STORAGE_BUCKET = 'uploads';
