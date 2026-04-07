// ============================================================
//  src/lib/supabaseClient.js
//  Single Supabase client instance — import this everywhere
// ============================================================
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.warn('⚠️ Missing Supabase env vars. Check your .env.local file.')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession:     true,
    storageKey:         'nestmatch_session',
    autoRefreshToken:   true,
    detectSessionInUrl: true,
  },
})

export default supabase
