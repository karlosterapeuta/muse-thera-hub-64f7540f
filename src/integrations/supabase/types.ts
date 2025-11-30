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
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
          childhood_sound_environment: string | null
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
          family_musical_history: string | null
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
          mother_movements_songs: string | null
          musical_education: boolean | null
          night_body_sounds: string | null
          no_musical_experience: boolean | null
          nominal_call_response: boolean | null
          nonverbal_communication: boolean | null
          occupational_therapy: boolean | null
          other_diagnoses: boolean | null
          other_musical_genres: boolean | null
          parents_sound_reactions: string | null
          patient_id: string | null
          patient_musical_history: string | null
          peer_interaction: boolean | null
          physiotherapy: boolean | null
          positive_musical_response: boolean | null
          pregnancy_sound_experiences: string | null
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
          typical_house_sounds: string | null
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
          childhood_sound_environment?: string | null
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
          family_musical_history?: string | null
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
          mother_movements_songs?: string | null
          musical_education?: boolean | null
          night_body_sounds?: string | null
          no_musical_experience?: boolean | null
          nominal_call_response?: boolean | null
          nonverbal_communication?: boolean | null
          occupational_therapy?: boolean | null
          other_diagnoses?: boolean | null
          other_musical_genres?: boolean | null
          parents_sound_reactions?: string | null
          patient_id?: string | null
          patient_musical_history?: string | null
          peer_interaction?: boolean | null
          physiotherapy?: boolean | null
          positive_musical_response?: boolean | null
          pregnancy_sound_experiences?: string | null
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
          typical_house_sounds?: string | null
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
          childhood_sound_environment?: string | null
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
          family_musical_history?: string | null
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
          mother_movements_songs?: string | null
          musical_education?: boolean | null
          night_body_sounds?: string | null
          no_musical_experience?: boolean | null
          nominal_call_response?: boolean | null
          nonverbal_communication?: boolean | null
          occupational_therapy?: boolean | null
          other_diagnoses?: boolean | null
          other_musical_genres?: boolean | null
          parents_sound_reactions?: string | null
          patient_id?: string | null
          patient_musical_history?: string | null
          peer_interaction?: boolean | null
          physiotherapy?: boolean | null
          positive_musical_response?: boolean | null
          pregnancy_sound_experiences?: string | null
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
          typical_house_sounds?: string | null
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
      course_lessons: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_free_preview: boolean | null
          module_id: string
          order_index: number | null
          title: string
          updated_at: string | null
          youtube_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean | null
          module_id: string
          order_index?: number | null
          title: string
          updated_at?: string | null
          youtube_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean | null
          module_id?: string
          order_index?: number | null
          title?: string
          updated_at?: string | null
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          instructor_name: string | null
          is_published: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          instructor_name?: string | null
          is_published?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          instructor_name?: string | null
          is_published?: boolean | null
          thumbnail_url?: string | null
          title?: string
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
          is_recurring: boolean | null
          parent_record_id: string | null
          patient_id: string | null
          professional_id: string
          recurrence_end_date: string | null
          recurrence_pattern: Json | null
          recurrence_type: string | null
          session_date: string
          session_status: Database["public"]["Enums"]["session_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          clinic_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          parent_record_id?: string | null
          patient_id?: string | null
          professional_id: string
          recurrence_end_date?: string | null
          recurrence_pattern?: Json | null
          recurrence_type?: string | null
          session_date: string
          session_status?: Database["public"]["Enums"]["session_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          clinic_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          parent_record_id?: string | null
          patient_id?: string | null
          professional_id?: string
          recurrence_end_date?: string | null
          recurrence_pattern?: Json | null
          recurrence_type?: string | null
          session_date?: string
          session_status?: Database["public"]["Enums"]["session_status"] | null
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
            foreignKeyName: "financial_records_parent_record_id_fkey"
            columns: ["parent_record_id"]
            isOneToOne: false
            referencedRelation: "financial_records"
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
          digital_signature_url: string | null
          digital_stamp_url: string | null
          email: string | null
          id: string
          license_number: string | null
          name: string
          phone: string | null
          qr_link: string | null
          register: string | null
          specialty: string | null
          stamp_photo_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          association?: string | null
          avatar_url?: string | null
          created_at?: string
          digital_signature_url?: string | null
          digital_stamp_url?: string | null
          email?: string | null
          id?: string
          license_number?: string | null
          name: string
          phone?: string | null
          qr_link?: string | null
          register?: string | null
          specialty?: string | null
          stamp_photo_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          association?: string | null
          avatar_url?: string | null
          created_at?: string
          digital_signature_url?: string | null
          digital_stamp_url?: string | null
          email?: string | null
          id?: string
          license_number?: string | null
          name?: string
          phone?: string | null
          qr_link?: string | null
          register?: string | null
          specialty?: string | null
          stamp_photo_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          expires_at?: string | null
          id: string
          name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          name?: string | null
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
          activity_sequence: string | null
          additional_notes: string | null
          approach_type: string | null
          clinical_diagnosis: string | null
          clinical_family_history: string | null
          complementary_materials: Json | null
          created_at: string | null
          estimated_period_months: number | null
          evaluation_criteria: string | null
          evaluation_criteria_list: Json | null
          evolution_recording: string | null
          expected_outcomes: string | null
          flexibility_adjustments: string | null
          general_objectives: Json | null
          id: string
          interaction_communication_level: string | null
          intervention_frequency: string | null
          intervention_strategies: string | null
          musical_composition: string | null
          musical_improvisation: string | null
          musical_instruments: Json | null
          musical_interests: string | null
          musical_methods: string | null
          musical_recreation: string | null
          musical_resources: string | null
          necessary_adjustments: string | null
          observed_behaviors: string | null
          patient_age: string | null
          patient_birth_date: string | null
          patient_full_name: string | null
          patient_id: string | null
          physical_cognitive_conditions: string | null
          plan_start_date: string | null
          professional_id: string | null
          receptive_listening: string | null
          reevaluation_frequency: string | null
          responsible_person: string | null
          rhythmic_dynamics: string | null
          session_duration: string | null
          session_duration_minutes: number | null
          session_structure: string | null
          specific_objectives: Json | null
          status: string | null
          technological_resources: Json | null
          therapeutic_focus: string | null
          treatment_model: string | null
          updated_at: string | null
          voice_body_resources: Json | null
          weekly_sessions: number | null
        }
        Insert: {
          activity_sequence?: string | null
          additional_notes?: string | null
          approach_type?: string | null
          clinical_diagnosis?: string | null
          clinical_family_history?: string | null
          complementary_materials?: Json | null
          created_at?: string | null
          estimated_period_months?: number | null
          evaluation_criteria?: string | null
          evaluation_criteria_list?: Json | null
          evolution_recording?: string | null
          expected_outcomes?: string | null
          flexibility_adjustments?: string | null
          general_objectives?: Json | null
          id?: string
          interaction_communication_level?: string | null
          intervention_frequency?: string | null
          intervention_strategies?: string | null
          musical_composition?: string | null
          musical_improvisation?: string | null
          musical_instruments?: Json | null
          musical_interests?: string | null
          musical_methods?: string | null
          musical_recreation?: string | null
          musical_resources?: string | null
          necessary_adjustments?: string | null
          observed_behaviors?: string | null
          patient_age?: string | null
          patient_birth_date?: string | null
          patient_full_name?: string | null
          patient_id?: string | null
          physical_cognitive_conditions?: string | null
          plan_start_date?: string | null
          professional_id?: string | null
          receptive_listening?: string | null
          reevaluation_frequency?: string | null
          responsible_person?: string | null
          rhythmic_dynamics?: string | null
          session_duration?: string | null
          session_duration_minutes?: number | null
          session_structure?: string | null
          specific_objectives?: Json | null
          status?: string | null
          technological_resources?: Json | null
          therapeutic_focus?: string | null
          treatment_model?: string | null
          updated_at?: string | null
          voice_body_resources?: Json | null
          weekly_sessions?: number | null
        }
        Update: {
          activity_sequence?: string | null
          additional_notes?: string | null
          approach_type?: string | null
          clinical_diagnosis?: string | null
          clinical_family_history?: string | null
          complementary_materials?: Json | null
          created_at?: string | null
          estimated_period_months?: number | null
          evaluation_criteria?: string | null
          evaluation_criteria_list?: Json | null
          evolution_recording?: string | null
          expected_outcomes?: string | null
          flexibility_adjustments?: string | null
          general_objectives?: Json | null
          id?: string
          interaction_communication_level?: string | null
          intervention_frequency?: string | null
          intervention_strategies?: string | null
          musical_composition?: string | null
          musical_improvisation?: string | null
          musical_instruments?: Json | null
          musical_interests?: string | null
          musical_methods?: string | null
          musical_recreation?: string | null
          musical_resources?: string | null
          necessary_adjustments?: string | null
          observed_behaviors?: string | null
          patient_age?: string | null
          patient_birth_date?: string | null
          patient_full_name?: string | null
          patient_id?: string | null
          physical_cognitive_conditions?: string | null
          plan_start_date?: string | null
          professional_id?: string | null
          receptive_listening?: string | null
          reevaluation_frequency?: string | null
          responsible_person?: string | null
          rhythmic_dynamics?: string | null
          session_duration?: string | null
          session_duration_minutes?: number | null
          session_structure?: string | null
          specific_objectives?: Json | null
          status?: string | null
          technological_resources?: Json | null
          therapeutic_focus?: string | null
          treatment_model?: string | null
          updated_at?: string | null
          voice_body_resources?: Json | null
          weekly_sessions?: number | null
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
      user_activity_logs: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_course_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          lesson_id: string
          updated_at: string | null
          user_id: string
          watch_time_seconds: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          lesson_id: string
          updated_at?: string | null
          user_id: string
          watch_time_seconds?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          lesson_id?: string
          updated_at?: string | null
          user_id?: string
          watch_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
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
      force_user_logout:
        | { Args: { target_user_id: string }; Returns: boolean }
        | {
            Args: { bypass_auth_check?: boolean; target_user_id: string }
            Returns: boolean
          }
      generate_invite_code: {
        Args: { expiration_days?: number }
        Returns: string
      }
      generate_recurring_financial_records: { Args: never; Returns: undefined }
      get_user_sessions_count: {
        Args: { target_user_id: string }
        Returns: number
      }
      has_role: {
        Args: { role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      is_user_access_expired: { Args: { user_id: string }; Returns: boolean }
      is_valid_uuid: { Args: { input_text: string }; Returns: boolean }
      set_default_expiration_for_users: {
        Args: { default_days?: number }
        Returns: number
      }
      update_user_expiration: {
        Args: { new_expires_at: string; target_user_id: string }
        Returns: boolean
      }
      update_user_status: {
        Args: { new_status: string; target_user_id: string }
        Returns: boolean
      }
      validate_and_use_invite_code: {
        Args: { invite_code: string; user_id: string }
        Returns: boolean
      }
      validate_invite_code_with_limits: {
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
        | "musicoterapia"
        | "evolution_musicoterapia"
      session_status: "scheduled" | "completed" | "no_show"
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
        "musicoterapia",
        "evolution_musicoterapia",
      ],
      session_status: ["scheduled", "completed", "no_show"],
    },
  },
} as const
