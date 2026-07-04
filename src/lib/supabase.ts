import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client-side Supabase (limited access)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin Supabase (full access, server-only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && supabaseServiceKey;
};
