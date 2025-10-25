import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Password {
  id: string
  user_id: string
  title: string
  username: string
  encrypted_password: string
  url?: string
  category?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  transaction_date: string
  created_at: string
}

export interface LinkGroup {
  id: string
  user_id: string
  name: string
  description?: string
  color: string
  created_at: string
}

export interface Link {
  id: string
  group_id: string
  title: string
  url: string
  description?: string
  order_index: number
  created_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  type: 'income' | 'expense' | 'both'
  color: string
  budget_limit?: number
  created_at: string
}

export interface Profile {
  id: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}