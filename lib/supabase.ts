import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Post = {
  id: string
  user_id: string
  title: string
  description: string
  category: string
  location: string
  image_url: string | null
  created_at: string
  user_name: string
  user_avatar: string
}

export type User = {
  id: string
  email: string
  name: string
  avatar_url: string | null
  created_at: string
}
