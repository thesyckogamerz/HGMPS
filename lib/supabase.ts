import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Initializing Supabase client with URL:', supabaseUrl?.substring(0, 15) + '...')
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials missing! Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
