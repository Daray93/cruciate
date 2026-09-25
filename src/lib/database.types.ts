export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
    Tables: {
      sessions: {
        Row: {
          id: string
          user_id: string
          date: string
          day_key: string
          cycle_week: number
          red_flag: boolean
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          day_key: string
          cycle_week: number
          red_flag?: boolean
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          day_key?: string
          cycle_week?: number
          red_flag?: boolean
          created_at?: string
          completed_at?: string | null
        }
        Relationships: []
      }
      exercises_logged: {
        Row: {
          id: string
          session_id: string
          name: string
          done: boolean
          weight: number | null
          reps: number | null
          rpe: number | null
          sets_completed: number
          holds_completed: number
        }
        Insert: {
          id?: string
          session_id: string
          name: string
          done?: boolean
          weight?: number | null
          reps?: number | null
          rpe?: number | null
          sets_completed?: number
          holds_completed?: number
        }
        Update: {
          id?: string
          session_id?: string
          name?: string
          done?: boolean
          weight?: number | null
          reps?: number | null
          rpe?: number | null
          sets_completed?: number
          holds_completed?: number
        }
        Relationships: []
      }
      rom_readings: {
        Row: {
          id: string
          session_id: string
          extension: number | null
          flexion: number | null
        }
        Insert: {
          id?: string
          session_id: string
          extension?: number | null
          flexion?: number | null
        }
        Update: {
          id?: string
          session_id?: string
          extension?: number | null
          flexion?: number | null
        }
        Relationships: []
      }
      clearance: {
        Row: {
          user_id: string
          load_cleared: boolean
          run_cleared: boolean
        }
        Insert: {
          user_id: string
          load_cleared?: boolean
          run_cleared?: boolean
        }
        Update: {
          user_id?: string
          load_cleared?: boolean
          run_cleared?: boolean
        }
        Relationships: []
      }
      waiver_acceptances: {
        Row: {
          user_id: string
          version: string
          accepted_at: string
        }
        Insert: {
          user_id: string
          version: string
          accepted_at?: string
        }
        Update: {
          user_id?: string
          version?: string
          accepted_at?: string
        }
        Relationships: []
      }
      user_profile: {
        Row: {
          user_id: string
          name: string
          age: number | null
          track: string
          surgery_timeframe: string | null
          surgery_date: string | null
          injury_date: string | null
          current_phase: string
          phase_advanced_at: string
          phase_advanced_by: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          name: string
          age?: number | null
          track: string
          surgery_timeframe?: string | null
          surgery_date?: string | null
          injury_date?: string | null
          current_phase: string
          phase_advanced_at?: string
          phase_advanced_by?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          age?: number | null
          track?: string
          surgery_timeframe?: string | null
          surgery_date?: string | null
          injury_date?: string | null
          current_phase?: string
          phase_advanced_at?: string
          phase_advanced_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      milestone_checkins: {
        Row: {
          id: string
          user_id: string
          phase_target: string
          question_id: string
          response: string
          passed: boolean
          date: string
        }
        Insert: {
          id?: string
          user_id: string
          phase_target: string
          question_id: string
          response: string
          passed: boolean
          date?: string
        }
        Update: {
          id?: string
          user_id?: string
          phase_target?: string
          question_id?: string
          response?: string
          passed?: boolean
          date?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          id: string
          name: string
          track: string
          phase: string
          category: string | null
          instructions: string | null
          purpose: string | null
          cue: string | null
          sets: number | null
          reps_target: string | null
          frequency_note: string | null
          equipment: string | null
          contraindications: string | null
          requires_load_clearance: boolean
          hold_seconds: number | null
          hold_reps: number | null
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          track: string
          phase: string
          category?: string | null
          instructions?: string | null
          purpose?: string | null
          cue?: string | null
          sets?: number | null
          reps_target?: string | null
          frequency_note?: string | null
          equipment?: string | null
          contraindications?: string | null
          requires_load_clearance?: boolean
          hold_seconds?: number | null
          hold_reps?: number | null
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          track?: string
          phase?: string
          category?: string | null
          instructions?: string | null
          purpose?: string | null
          cue?: string | null
          sets?: number | null
          reps_target?: string | null
          frequency_note?: string | null
          equipment?: string | null
          contraindications?: string | null
          requires_load_clearance?: boolean
          hold_seconds?: number | null
          hold_reps?: number | null
          sort_order?: number
        }
        Relationships: []
      }
      user_exercise_prefs: {
        Row: {
          user_id: string
          exercise_id: string
          hidden: boolean
        }
        Insert: {
          user_id: string
          exercise_id: string
          hidden?: boolean
        }
        Update: {
          user_id?: string
          exercise_id?: string
          hidden?: boolean
        }
        Relationships: []
      }
    }
  }
}
