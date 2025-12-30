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
      call_sessions: {
        Row: {
          admin_commission: number | null
          admin_rate_per_minute: number
          caller_id: string | null
          created_at: string | null
          duration_seconds: number | null
          end_reason: string | null
          end_time: string | null
          host_earnings: number | null
          host_id: string | null
          host_rate_per_minute: number
          id: string
          rate_per_minute: number
          session_type: Database["public"]["Enums"]["session_type"]
          start_time: string | null
          status: string | null
          total_cost: number | null
        }
        Insert: {
          admin_commission?: number | null
          admin_rate_per_minute: number
          caller_id?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          end_reason?: string | null
          end_time?: string | null
          host_earnings?: number | null
          host_id?: string | null
          host_rate_per_minute: number
          id?: string
          rate_per_minute: number
          session_type: Database["public"]["Enums"]["session_type"]
          start_time?: string | null
          status?: string | null
          total_cost?: number | null
        }
        Update: {
          admin_commission?: number | null
          admin_rate_per_minute?: number
          caller_id?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          end_reason?: string | null
          end_time?: string | null
          host_earnings?: number | null
          host_id?: string | null
          host_rate_per_minute?: number
          id?: string
          rate_per_minute?: number
          session_type?: Database["public"]["Enums"]["session_type"]
          start_time?: string | null
          status?: string | null
          total_cost?: number | null
        }
        Relationships: []
      }
      host_settings: {
        Row: {
          bio: string | null
          category: string | null
          created_at: string | null
          id: string
          languages: string[] | null
          rating: number | null
          total_calls: number | null
          total_minutes: number | null
          updated_at: string | null
          user_id: string
          video_rate_per_minute: number | null
          voice_rate_per_minute: number | null
        }
        Insert: {
          bio?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          languages?: string[] | null
          rating?: number | null
          total_calls?: number | null
          total_minutes?: number | null
          updated_at?: string | null
          user_id: string
          video_rate_per_minute?: number | null
          voice_rate_per_minute?: number | null
        }
        Update: {
          bio?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          languages?: string[] | null
          rating?: number | null
          total_calls?: number | null
          total_minutes?: number | null
          updated_at?: string | null
          user_id?: string
          video_rate_per_minute?: number | null
          voice_rate_per_minute?: number | null
        }
        Relationships: []
      }
      kyc_details: {
        Row: {
          created_at: string | null
          document_type: string | null
          document_url: string | null
          id: string
          rejection_reason: string | null
          selfie_url: string | null
          updated_at: string | null
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type?: string | null
          document_url?: string | null
          id?: string
          rejection_reason?: string | null
          selfie_url?: string | null
          updated_at?: string | null
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string | null
          document_url?: string | null
          id?: string
          rejection_reason?: string | null
          selfie_url?: string | null
          updated_at?: string | null
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          availability:
            | Database["public"]["Enums"]["availability_status"]
            | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string
          gender: string | null
          id: string
          phone: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name: string
          gender?: string | null
          id?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      recharge_orders: {
        Row: {
          base_amount: number
          bonus_amount: number | null
          bonus_percent: number | null
          created_at: string | null
          credits_received: number
          gst_amount: number
          id: string
          offer_tag: string | null
          payment_reference: string | null
          platform_fee: number
          status: Database["public"]["Enums"]["order_status"] | null
          total_paid: number
          user_id: string
        }
        Insert: {
          base_amount: number
          bonus_amount?: number | null
          bonus_percent?: number | null
          created_at?: string | null
          credits_received: number
          gst_amount: number
          id?: string
          offer_tag?: string | null
          payment_reference?: string | null
          platform_fee: number
          status?: Database["public"]["Enums"]["order_status"] | null
          total_paid: number
          user_id: string
        }
        Update: {
          base_amount?: number
          bonus_amount?: number | null
          bonus_percent?: number | null
          created_at?: string | null
          credits_received?: number
          gst_amount?: number
          id?: string
          offer_tag?: string | null
          payment_reference?: string | null
          platform_fee?: number
          status?: Database["public"]["Enums"]["order_status"] | null
          total_paid?: number
          user_id?: string
        }
        Relationships: []
      }
      settlements: {
        Row: {
          admin_id: string | null
          amount: number
          bank_account: string | null
          bank_name: string | null
          created_at: string | null
          id: string
          ifsc_code: string | null
          settled_at: string | null
          settlement_reference: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          upi_id: string | null
        }
        Insert: {
          admin_id?: string | null
          amount: number
          bank_account?: string | null
          bank_name?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          settled_at?: string | null
          settlement_reference?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          upi_id?: string | null
        }
        Update: {
          admin_id?: string | null
          amount?: number
          bank_account?: string | null
          bank_name?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          settled_at?: string | null
          settlement_reference?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          upi_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          created_at: string | null
          description: string | null
          id: string
          reference_id: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          total_earned: number | null
          total_recharged: number | null
          total_spent: number | null
          total_withdrawn: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          total_earned?: number | null
          total_recharged?: number | null
          total_spent?: number | null
          total_withdrawn?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          total_earned?: number | null
          total_recharged?: number | null
          total_spent?: number | null
          total_withdrawn?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          amount: number
          bank_account: string | null
          bank_name: string | null
          created_at: string | null
          id: string
          ifsc_code: string | null
          processed_at: string | null
          processed_by: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          upi_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          bank_account?: string | null
          bank_name?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          processed_at?: string | null
          processed_by?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          upi_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          bank_account?: string | null
          bank_name?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          processed_at?: string | null
          processed_by?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          upi_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_host_verified: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      availability_status: "online" | "busy" | "offline"
      order_status: "pending" | "completed" | "failed"
      session_type: "voice" | "video"
      transaction_type:
        | "recharge"
        | "deduction"
        | "reward"
        | "commission"
        | "gst"
        | "platform_fee"
        | "withdrawal"
      user_role: "caller" | "host" | "admin"
      user_status: "active" | "blocked" | "pending"
      verification_status: "pending" | "approved" | "rejected"
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
    Enums: {
      availability_status: ["online", "busy", "offline"],
      order_status: ["pending", "completed", "failed"],
      session_type: ["voice", "video"],
      transaction_type: [
        "recharge",
        "deduction",
        "reward",
        "commission",
        "gst",
        "platform_fee",
        "withdrawal",
      ],
      user_role: ["caller", "host", "admin"],
      user_status: ["active", "blocked", "pending"],
      verification_status: ["pending", "approved", "rejected"],
    },
  },
} as const
