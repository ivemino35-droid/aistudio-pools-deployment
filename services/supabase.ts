
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

/**
 * Supabase credentials.
 * These are injected via environment variables during deployment.
 */
const supabaseUrl = (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL) 
  ? process.env.VITE_SUPABASE_URL 
  : 'https://placeholder.supabase.co';

const supabaseKey = (typeof process !== 'undefined' && process.env.VITE_SUPABASE_ANON_KEY) 
  ? process.env.VITE_SUPABASE_ANON_KEY 
  : 'placeholder-key';

const isPlaceholder = supabaseUrl.includes('placeholder') || supabaseKey === 'placeholder-key';

/**
 * A strictly in-memory storage mock to ensure cross-browser compatibility 
 * and avoid persistence issues in non-standard environments.
 */
const noopStorage = {
  getItem: (_key: string) => null,
  setItem: (_key: string, _value: string) => {},
  removeItem: (_key: string) => {},
};

// Create client with production environment variables or fallback to a dummy client
export const supabase = createClient(
  supabaseUrl, 
  supabaseKey, 
  {
    auth: {
      storage: noopStorage,
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

export const isDemoMode = isPlaceholder;