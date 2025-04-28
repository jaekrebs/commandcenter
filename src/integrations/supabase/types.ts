export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_codes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      character_profiles: {
        Row: {
          class: string
          created_at: string | null
          gear: string | null
          gear_loadout: string | null
          id: string
          lifepath: string
          name: string
          primary_weapons: string | null
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          class?: string
          created_at?: string | null
          gear?: string | null
          gear_loadout?: string | null
          id?: string
          lifepath?: string
          name?: string
          primary_weapons?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          class?: string
          created_at?: string | null
          gear?: string | null
          gear_loadout?: string | null
          id?: string
          lifepath?: string
          name?: string
          primary_weapons?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gear: {
        Row: {
          character_profile_id: string | null
          created_at: string | null
          description: string | null
          id: string
          installed: boolean | null
          name: string
          rarity: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          character_profile_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          installed?: boolean | null
          name: string
          rarity?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          character_profile_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          installed?: boolean | null
          name?: string
          rarity?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gear_character_profile_id_fkey"
            columns: ["character_profile_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          character_profile_id: string | null
          completed: boolean | null
          created_at: string | null
          id: string
          name: string
          notes: string | null
          progress_percent: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          character_profile_id?: string | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          progress_percent?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          character_profile_id?: string | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          progress_percent?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "missions_character_profile_id_fkey"
            columns: ["character_profile_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          character_profile_id: string | null
          content: string | null
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          character_profile_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          character_profile_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_character_profile_id_fkey"
            columns: ["character_profile_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      npc_relationships: {
        Row: {
          background: string | null
          character_profile_id: string | null
          created_at: string | null
          friendship: number | null
          id: string
          image: string | null
          love: number | null
          lust: number | null
          npc_name: string
          trust: number | null
          updated_at: string | null
        }
        Insert: {
          background?: string | null
          character_profile_id?: string | null
          created_at?: string | null
          friendship?: number | null
          id?: string
          image?: string | null
          love?: number | null
          lust?: number | null
          npc_name: string
          trust?: number | null
          updated_at?: string | null
        }
        Update: {
          background?: string | null
          character_profile_id?: string | null
          created_at?: string | null
          friendship?: number | null
          id?: string
          image?: string | null
          love?: number | null
          lust?: number | null
          npc_name?: string
          trust?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "npc_relationships_character_profile_id_fkey"
            columns: ["character_profile_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          selected_character_profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          selected_character_profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          selected_character_profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_selected_character_profile_id_fkey"
            columns: ["selected_character_profile_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      relic_status: {
        Row: {
          created_at: string | null
          id: string
          johnny_influence: number | null
          profile_id: string | null
          relic_integrity: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          johnny_influence?: number | null
          profile_id?: string | null
          relic_integrity?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          johnny_influence?: number | null
          profile_id?: string | null
          relic_integrity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relic_status_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_by_access_code: {
        Args: { access_code: string }
        Returns: {
          email: string
        }[]
      }
      has_role: {
        Args: { user_id: string; role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "user"],
    },
  },
} as const
