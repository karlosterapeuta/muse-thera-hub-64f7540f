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
          active_musical_listening: boolean | null
          active_sound_search: boolean | null
          adhd: boolean | null
          adverse_sound_reactivity: boolean | null
          anxiety: boolean | null
          anxiety_disorders: boolean | null
          auditory_hypersensitivity: boolean | null
          autism_spectrum: boolean | null
          autonomous_walking: boolean | null
          babbling: boolean | null
          body_expression: boolean | null
          body_musical_expression: boolean | null
          brazilian_popular: boolean | null
          broad_motor_dev: boolean | null
          cervical_control: boolean | null
          children_repertoire: boolean | null
          choral_activities: boolean | null
          chronic_encephalopathy: boolean | null
          classical_music: boolean | null
          country_music: boolean | null
          crawling_pattern: boolean | null
          created_at: string | null
          current_medication: string | null
          down_syndrome: boolean | null
          echolalia: boolean | null
          emotional_ability: boolean | null
          equine_therapy: boolean | null
          extracurricular_activities: string | null
          family_relationship: string | null
          fine_motor_dev: boolean | null
          first_words: boolean | null
          frequent_crying: boolean | null
          heteroaggressive: boolean | null
          id: string
          independent_sitting: boolean | null
          instrumental_exploration: boolean | null
          instrumental_practice: boolean | null
          intellectual_disability: boolean | null
          irritability: boolean | null
          legal_guardian: string | null
          low_frustration_tolerance: boolean | null
          main_clinical_demand: string | null
          musical_education: boolean | null
          no_musical_experience: boolean | null
          nominal_call_response: boolean | null
          nonverbal_communication: boolean | null
          occupational_therapy: boolean | null
          other_diagnoses: boolean | null
          other_musical_genres: boolean | null
          patient_id: string | null
          peer_interaction: boolean | null
          physiotherapy: boolean | null
          positive_musical_response: boolean | null
          professional_id: string | null
          psychological_support: boolean | null
          psychopedagogical: boolean | null
          referral_professional: string | null
          restricted_interests: boolean | null
          rock_genre: boolean | null
          sacred_gospel: boolean | null
          school_adaptation: string | null
          school_enrollment: string | null
          shared_play: boolean | null
          simple_phrases: boolean | null
          social_isolation: boolean | null
          sound_responsiveness: boolean | null
          sound_source_location: boolean | null
          specific_sound_aversion: boolean | null
          speech_therapy: boolean | null
          spontaneous_vocal: boolean | null
          stereotyped_behavior: boolean | null
          therapeutic_goals: string | null
          treatment_approach: string | null
          updated_at: string | null
          verbal_language_absence: boolean | null
          visual_contact: boolean | null
          vocal_expression: boolean | null
        }
        Insert: {
          active_musical_listening?: boolean | null
          active_sound_search?: boolean | null
          adhd?: boolean | null
          adverse_sound_reactivity?: boolean | null
          anxiety?: boolean | null
          anxiety_disorders?: boolean | null
          auditory_hypersensitivity?: boolean | null
          autism_spectrum?: boolean | null
          autonomous_walking?: boolean | null
          babbling?: boolean | null
          body_expression?: boolean | null
          body_musical_expression?: boolean | null
          brazilian_popular?: boolean | null
          broad_motor_dev?: boolean | null
          cervical_control?: boolean | null
          children_repertoire?: boolean | null
          choral_activities?: boolean | null
          chronic_encephalopathy?: boolean | null
          classical_music?: boolean | null
          country_music?: boolean | null
          crawling_pattern?: boolean | null
          created_at?: string | null
          current_medication?: string | null
          down_syndrome?: boolean | null
          echolalia?: boolean | null
          emotional_ability?: boolean | null
          equine_therapy?: boolean | null
          extracurricular_activities?: string | null
          family_relationship?: string | null
          fine_motor_dev?: boolean | null
          first_words?: boolean | null
          frequent_crying?: boolean | null
          heteroaggressive?: boolean | null
          id?: string
          independent_sitting?: boolean | null
          instrumental_exploration?: boolean | null
          instrumental_practice?: boolean | null
          intellectual_disability?: boolean | null
          irritability?: boolean | null
          legal_guardian?: string | null
          low_frustration_tolerance?: boolean | null
          main_clinical_demand?: string | null
          musical_education?: boolean | null
          no_musical_experience?: boolean | null
          nominal_call_response?: boolean | null
          nonverbal_communication?: boolean | null
          occupational_therapy?: boolean | null
          other_diagnoses?: boolean | null
          other_musical_genres?: boolean | null
          patient_id?: string | null
          peer_interaction?: boolean | null
          physiotherapy?: boolean | null
          positive_musical_response?: boolean | null
          professional_id?: string | null
          psychological_support?: boolean | null
          psychopedagogical?: boolean | null
          referral_professional?: string | null
          restricted_interests?: boolean | null
          rock_genre?: boolean | null
          sacred_gospel?: boolean | null
          school_adaptation?: string | null
          school_enrollment?: string | null
          shared_play?: boolean | null
          simple_phrases?: boolean | null
          social_isolation?: boolean | null
          sound_responsiveness?: boolean | null
          sound_source_location?: boolean | null
          specific_sound_aversion?: boolean | null
          speech_therapy?: boolean | null
          spontaneous_vocal?: boolean | null
          stereotyped_behavior?: boolean | null
          therapeutic_goals?: string | null
          treatment_approach?: string | null
          updated_at?: string | null
          verbal_language_absence?: boolean | null
          visual_contact?: boolean | null
          vocal_expression?: boolean | null
        }
        Update: {
          active_musical_listening?: boolean | null
          active_sound_search?: boolean | null
          adhd?: boolean | null
          adverse_sound_reactivity?: boolean | null
          anxiety?: boolean | null
          anxiety_disorders?: boolean | null
          auditory_hypersensitivity?: boolean | null
          autism_spectrum?: boolean | null
          autonomous_walking?: boolean | null
          babbling?: boolean | null
          body_expression?: boolean | null
          body_musical_expression?: boolean | null
          brazilian_popular?: boolean | null
          broad_motor_dev?: boolean | null
          cervical_control?: boolean | null
          children_repertoire?: boolean | null
          choral_activities?: boolean | null
          chronic_encephalopathy?: boolean | null
          classical_music?: boolean | null
          country_music?: boolean | null
          crawling_pattern?: boolean | null
          created_at?: string | null
          current_medication?: string | null
          down_syndrome?: boolean | null
          echolalia?: boolean | null
          emotional_ability?: boolean | null
          equine_therapy?: boolean | null
          extracurricular_activities?: string | null
          family_relationship?: string | null
          fine_motor_dev?: boolean | null
          first_words?: boolean | null
          frequent_crying?: boolean | null
          heteroaggressive?: boolean | null
          id?: string
          independent_sitting?: boolean | null
          instrumental_exploration?: boolean | null
          instrumental_practice?: boolean | null
          intellectual_disability?: boolean | null
          irritability?: boolean | null
          legal_guardian?: string | null
          low_frustration_tolerance?: boolean | null
          main_clinical_demand?: string | null
          musical_education?: boolean | null
          no_musical_experience?: boolean | null
          nominal_call_response?: boolean | null
          nonverbal_communication?: boolean | null
          occupational_therapy?: boolean | null
          other_diagnoses?: boolean | null
          other_musical_genres?: boolean | null
          patient_id?: string | null
          peer_interaction?: boolean | null
          physiotherapy?: boolean | null
          positive_musical_response?: boolean | null
          professional_id?: string | null
          psychological_support?: boolean | null
          psychopedagogical?: boolean | null
          referral_professional?: string | null
          restricted_interests?: boolean | null
          rock_genre?: boolean | null
          sacred_gospel?: boolean | null
          school_adaptation?: string | null
          school_enrollment?: string | null
          shared_play?: boolean | null
          simple_phrases?: boolean | null
          social_isolation?: boolean | null
          sound_responsiveness?: boolean | null
          sound_source_location?: boolean | null
          specific_sound_aversion?: boolean | null
          speech_therapy?: boolean | null
          spontaneous_vocal?: boolean | null
          stereotyped_behavior?: boolean | null
          therapeutic_goals?: string | null
          treatment_approach?: string | null
          updated_at?: string | null
          verbal_language_absence?: boolean | null
          visual_contact?: boolean | null
          vocal_expression?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "anamnesis_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
      clinics: {
        Row: {
          address: string | null
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          patient_ids: string[] | null
          service_days: string[] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          patient_ids?: string[] | null
          service_days?: string[] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          patient_ids?: string[] | null
          service_days?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_records: {
        Row: {
          amount: number
          clinic_id: string
          created_at: string | null
          description: string | null
          id: string
          patient_id: string | null
          professional_id: string
          session_date: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          clinic_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          patient_id?: string | null
          professional_id: string
          session_date: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          clinic_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          patient_id?: string | null
          professional_id?: string
          session_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_records_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          status: Database["public"]["Enums"]["invite_code_status"]
          used_at: string | null
          used_by_user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          id?: string
          status?: Database["public"]["Enums"]["invite_code_status"]
          used_at?: string | null
          used_by_user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          status?: Database["public"]["Enums"]["invite_code_status"]
          used_at?: string | null
          used_by_user_id?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          age: number | null
          birth_date: string | null
          contact: string | null
          created_at: string | null
          id: string
          name: string
          professional_id: string | null
          responsible: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          birth_date?: string | null
          contact?: string | null
          created_at?: string | null
          id?: string
          name: string
          professional_id?: string | null
          responsible?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          birth_date?: string | null
          contact?: string | null
          created_at?: string | null
          id?: string
          name?: string
          professional_id?: string | null
          responsible?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          association: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          license_number: string | null
          name: string
          phone: string | null
          register: string | null
          specialty: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          association?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_number?: string | null
          name: string
          phone?: string | null
          register?: string | null
          specialty?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          association?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_number?: string | null
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
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          role?: string
          status?: string
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
          intervention_activities: Json | null
          notes: string | null
          patient_id: string | null
          therapeutic_goals: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          emotional_state?: Json | null
          id?: string
          intervention_activities?: Json | null
          notes?: string | null
          patient_id?: string | null
          therapeutic_goals?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          emotional_state?: Json | null
          id?: string
          intervention_activities?: Json | null
          notes?: string | null
          patient_id?: string | null
          therapeutic_goals?: Json | null
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
        Relationships: [
          {
            foreignKeyName: "user_roles_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_status_logs: {
        Row: {
          changed_by: string
          created_at: string
          id: string
          new_status: string
          previous_status: string
          user_id: string
        }
        Insert: {
          changed_by: string
          created_at?: string
          id?: string
          new_status: string
          previous_status: string
          user_id: string
        }
        Update: {
          changed_by?: string
          created_at?: string
          id?: string
          new_status?: string
          previous_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_status_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_status_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      force_user_logout: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      generate_invite_code: {
        Args: { expiration_days?: number }
        Returns: string
      }
      has_role: {
        Args: { role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      update_user_status: {
        Args: { target_user_id: string; new_status: string }
        Returns: boolean
      }
      validate_and_use_invite_code: {
        Args: { invite_code: string; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "professional"
      invite_code_status: "unused" | "used" | "expired"
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
      app_role: ["admin", "professional"],
      invite_code_status: ["unused", "used", "expired"],
      report_type: [
        "initial_evaluation",
        "progress_report",
        "session_summary",
        "discharge_summary",
        "assessment_report",
        "individual_session",
        "group_session",
        "daily_evolution",
        "monthly_evolution",
        "semester_evolution",
        "therapeutic_discharge",
        "administrative_discharge",
        "tea_scale",
        "family_report",
        "team_report",
        "technical_report",
      ],
    },
  },
} as const
