export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      citadel_inventory: {
        Row: {
          created_at: string
          id: string
          item_name: string
          item_type: string
          player_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_name: string
          item_type: string
          player_id: string
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          item_name?: string
          item_type?: string
          player_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "citadel_inventory_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "citadel_players"
            referencedColumns: ["id"]
          },
        ]
      }
      citadel_kills: {
        Row: {
          created_at: string
          district: string
          id: string
          killer_id: string
          loot_chips: number
          victim_id: string
        }
        Insert: {
          created_at?: string
          district: string
          id?: string
          killer_id: string
          loot_chips?: number
          victim_id: string
        }
        Update: {
          created_at?: string
          district?: string
          id?: string
          killer_id?: string
          loot_chips?: number
          victim_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "citadel_kills_killer_id_fkey"
            columns: ["killer_id"]
            isOneToOne: false
            referencedRelation: "citadel_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citadel_kills_victim_id_fkey"
            columns: ["victim_id"]
            isOneToOne: false
            referencedRelation: "citadel_players"
            referencedColumns: ["id"]
          },
        ]
      }
      citadel_market: {
        Row: {
          created_at: string
          id: string
          is_npc_shop: boolean
          item_name: string
          item_type: string
          price: number
          quantity: number
          seller_id: string | null
          shop_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_npc_shop?: boolean
          item_name: string
          item_type: string
          price: number
          quantity?: number
          seller_id?: string | null
          shop_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_npc_shop?: boolean
          item_name?: string
          item_type?: string
          price?: number
          quantity?: number
          seller_id?: string | null
          shop_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "citadel_market_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "citadel_players"
            referencedColumns: ["id"]
          },
        ]
      }
      citadel_players: {
        Row: {
          chips: number
          created_at: string
          credits: number
          current_district: string
          display_name: string
          has_floppy_id: boolean
          id: string
          is_alive: boolean
          job: string | null
          job_earnings: number
          losses: number
          pos_x: number
          pos_y: number
          updated_at: string
          user_id: string
          wins: number
        }
        Insert: {
          chips?: number
          created_at?: string
          credits?: number
          current_district?: string
          display_name?: string
          has_floppy_id?: boolean
          id?: string
          is_alive?: boolean
          job?: string | null
          job_earnings?: number
          losses?: number
          pos_x?: number
          pos_y?: number
          updated_at?: string
          user_id: string
          wins?: number
        }
        Update: {
          chips?: number
          created_at?: string
          credits?: number
          current_district?: string
          display_name?: string
          has_floppy_id?: boolean
          id?: string
          is_alive?: boolean
          job?: string | null
          job_earnings?: number
          losses?: number
          pos_x?: number
          pos_y?: number
          updated_at?: string
          user_id?: string
          wins?: number
        }
        Relationships: []
      }
      citadel_races: {
        Row: {
          created_at: string
          id: string
          player_id: string
          race_time: number
          wager_amount: number
          won: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          player_id: string
          race_time: number
          wager_amount?: number
          won?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          player_id?: string
          race_time?: number
          wager_amount?: number
          won?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "citadel_races_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "citadel_players"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
