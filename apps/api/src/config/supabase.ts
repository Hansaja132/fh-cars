import { createClient, SupabaseClient } from '@supabase/supabase-js';

const isPlaceholder = (val: string) => !val || val.includes('your-supabase');

const rawUrl = (process.env.SUPABASE_URL || '').trim();
const rawServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const rawKey = (process.env.SUPABASE_KEY || '').trim();

const supabaseUrl = !isPlaceholder(rawUrl) ? rawUrl : '';
// Prioritize real SUPABASE_SERVICE_ROLE_KEY, fallback to real SUPABASE_KEY if service role key is missing/placeholder
const supabaseKey = !isPlaceholder(rawServiceKey)
  ? rawServiceKey
  : !isPlaceholder(rawKey)
  ? rawKey
  : '';

export const BUCKET_NAME = (process.env.SUPABASE_STORAGE_BUCKET || '').trim();

let supabaseClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey && BUCKET_NAME) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (err) {
    console.error('[Supabase Config Error]: Failed to create client:', err);
    supabaseClient = null;
  }
}

export { supabaseClient };
