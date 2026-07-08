import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

/**
 * Server-side Supabase client with service role key (full access).
 * Use ONLY in API routes and server-side code, NEVER on the client.
 * Lazy initialization — won't crash at build time if env vars are missing.
 */
export function getSupabase(): SupabaseClient {
  if (_client) return _client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local or Vercel env vars.'
    )
  }

  _client = createClient(supabaseUrl, supabaseKey)
  return _client
}
