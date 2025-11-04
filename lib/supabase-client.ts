import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (for Client Components)
export const createSupabaseClient = () => {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Database types (will be generated from Supabase)
export type Database = {
  public: {
    Tables: {
      areas: {
        Row: {
          id: string
          name: string
          prefecture: string
          city: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          prefecture: string
          city: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          prefecture?: string
          city?: string
          created_at?: string
          updated_at?: string
        }
      }
      shops: {
        Row: {
          id: string
          name: string
          area_id: string
          address: string | null
          phone: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          area_id: string
          address?: string | null
          phone?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          area_id?: string
          address?: string | null
          phone?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      shop_prices_time: {
        Row: {
          id: string
          shop_id: string
          start_time: string
          end_time: string
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          start_time: string
          end_time: string
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          start_time?: string
          end_time?: string
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      shop_prices_nomination: {
        Row: {
          id: string
          shop_id: string
          nomination: string
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          nomination?: string
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          nomination?: string
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      shop_tax: {
        Row: {
          id: string
          shop_id: string
          tax_category: string
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          tax_category?: string
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          tax_category?: string
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      casts: {
        Row: {
          id: string
          name: string
          shop_id: string
          image_url: string | null
          instagram_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          shop_id: string
          image_url?: string | null
          instagram_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          shop_id?: string
          image_url?: string | null
          instagram_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          cast_id: string
          ip_address: string
          cute_score: number
          talk_score: number
          price_score: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cast_id: string
          ip_address: string
          cute_score: number
          talk_score: number
          price_score: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cast_id?: string
          ip_address?: string
          cute_score?: number
          talk_score?: number
          price_score?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          cast_id: string
          ip_address: string
          created_at: string
        }
        Insert: {
          id?: string
          cast_id: string
          ip_address: string
          created_at?: string
        }
        Update: {
          id?: string
          cast_id?: string
          ip_address?: string
          created_at?: string
        }
      }
    }
  }
}
