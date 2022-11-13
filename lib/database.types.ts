export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: number
          name: string | null
          upload_bucket: string | null
          download_bucket: string | null
        }
        Insert: {
          id?: number
          name?: string | null
          upload_bucket?: string | null
          download_bucket?: string | null
        }
        Update: {
          id?: number
          name?: string | null
          upload_bucket?: string | null
          download_bucket?: string | null
        }
      }
      uploads: {
        Row: {
          upload_id: string
          created_at: string | null
          path: string | null
          user_id: string | null
          bucket: string | null
        }
        Insert: {
          upload_id?: string
          created_at?: string | null
          path?: string | null
          user_id?: string | null
          bucket?: string | null
        }
        Update: {
          upload_id?: string
          created_at?: string | null
          path?: string | null
          user_id?: string | null
          bucket?: string | null
        }
      }
      users: {
        Row: {
          client_id: number | null
          user_id: string | null
        }
        Insert: {
          client_id?: number | null
          user_id?: string | null
        }
        Update: {
          client_id?: number | null
          user_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_clients_for_authenticated_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

