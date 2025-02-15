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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      anamnesis: {
        Row: {
          attention_span: string | null
          auditory_processing: string | null
          cognitive_functions: string | null
          communication_skills: string | null
          created_at: string | null
          current_medications: string | null
          emotional_expression: string | null
          emotional_response_to_music: string | null
          family_history: string | null
          id: string
          main_complaint: string | null
          medical_history: string | null
          memory_function: string | null
          motor_skills: string | null
          musical_background: string | null
          musical_preferences: string | null
          musical_skills: string | null
          observations: string | null
          patient_id: string | null
          professional_id: string | null
          rhythmic_responses: string | null
          social_interaction: string | null
          therapeutic_goals: string | null
          treatment_approach: string | null
          updated_at: string | null
        }
        Insert: {
          attention_span?: string | null
          auditory_processing?: string | null
          cognitive_functions?: string | null
          communication_skills?: string | null
          created_at?: string | null
          current_medications?: string | null
          emotional_expression?: string | null
          emotional_response_to_music?: string | null
          family_history?: string | null
          id?: string
          main_complaint?: string | null
          medical_history?: string | null
          memory_function?: string | null
          motor_skills?: string | null
          musical_background?: string | null
          musical_preferences?: string | null
          musical_skills?: string | null
          observations?: string | null
          patient_id?: string | null
          professional_id?: string | null
          rhythmic_responses?: string | null
          social_interaction?: string | null
          therapeutic_goals?: string | null
          treatment_approach?: string | null
          updated_at?: string | null
        }
        Update: {
          attention_span?: string | null
          auditory_processing?: string | null
          cognitive_functions?: string | null
          communication_skills?: string | null
          created_at?: string | null
          current_medications?: string | null
          emotional_expression?: string | null
          emotional_response_to_music?: string | null
          family_history?: string | null
          id?: string
          main_complaint?: string | null
          medical_history?: string | null
          memory_function?: string | null
          motor_skills?: string | null
          musical_background?: string | null
          musical_preferences?: string | null
          musical_skills?: string | null
          observations?: string | null
          patient_id?: string | null
          professional_id?: string | null
          rhythmic_responses?: string | null
          social_interaction?: string | null
          therapeutic_goals?: string | null
          treatment_approach?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anamnesis_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnesis_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          content: Json | null
          created_at: string | null
          date: string
          id: string
          patient_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          date: string
          id?: string
          patient_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          date?: string
          id?: string
          patient_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          birth_date: string | null
          contact: string | null
          created_at: string | null
          id: string
          name: string
          responsible: string | null
          updated_at: string | null
        }
        Insert: {
          birth_date?: string | null
          contact?: string | null
          created_at?: string | null
          id?: string
          name: string
          responsible?: string | null
          updated_at?: string | null
        }
        Update: {
          birth_date?: string | null
          contact?: string | null
          created_at?: string | null
          id?: string
          name?: string
          responsible?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      professionals: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          register: string | null
          specialty: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          register?: string | null
          specialty?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          register?: string | null
          specialty?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          patient_id: string | null
          professional_id: string | null
          type: Database["public"]["Enums"]["report_type"]
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          patient_id?: string | null
          professional_id?: string | null
          type: Database["public"]["Enums"]["report_type"]
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          patient_id?: string | null
          professional_id?: string | null
          type?: Database["public"]["Enums"]["report_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          date: string
          emotional_state: Json | null
          id: string
          notes: string | null
          patient_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          emotional_state?: Json | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          emotional_state?: Json | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_plans: {
        Row: {
          additional_notes: string | null
          approach_type: string | null
          created_at: string | null
          evaluation_criteria: string | null
          expected_outcomes: string | null
          id: string
          intervention_frequency: string | null
          intervention_strategies: string | null
          musical_methods: string | null
          musical_resources: string | null
          patient_id: string | null
          professional_id: string | null
          session_duration: string | null
          status: string | null
          therapeutic_focus: string | null
          treatment_model: string | null
          updated_at: string | null
        }
        Insert: {
          additional_notes?: string | null
          approach_type?: string | null
          created_at?: string | null
          evaluation_criteria?: string | null
          expected_outcomes?: string | null
          id?: string
          intervention_frequency?: string | null
          intervention_strategies?: string | null
          musical_methods?: string | null
          musical_resources?: string | null
          patient_id?: string | null
          professional_id?: string | null
          session_duration?: string | null
          status?: string | null
          therapeutic_focus?: string | null
          treatment_model?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_notes?: string | null
          approach_type?: string | null
          created_at?: string | null
          evaluation_criteria?: string | null
          expected_outcomes?: string | null
          id?: string
          intervention_frequency?: string | null
          intervention_strategies?: string | null
          musical_methods?: string | null
          musical_resources?: string | null
          patient_id?: string | null
          professional_id?: string | null
          session_duration?: string | null
          status?: string | null
          therapeutic_focus?: string | null
          treatment_model?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_plans_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          id: string
          image: string | null
          name: string
          password: string | null
          professionalRegister: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          image?: string | null
          name: string
          password?: string | null
          professionalRegister?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          image?: string | null
          name?: string
          password?: string | null
          professionalRegister?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      VerificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      report_type:
        | "initial_evaluation"
        | "progress_report"
        | "session_summary"
        | "discharge_summary"
        | "assessment_report"
        | "individual_session"
        | "group_session"
        | "daily_evolution"
        | "monthly_evolution"
        | "semester_evolution"
        | "therapeutic_discharge"
        | "administrative_discharge"
        | "tea_scale"
        | "family_report"
        | "team_report"
        | "technical_report"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
