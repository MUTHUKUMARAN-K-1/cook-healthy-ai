// Supabase Database Types

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      // User profiles
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          // User preferences
          weekly_budget: number;
          household_size: number;
          dietary_preferences: string[];
          skill_level: 'Beginner' | 'Intermediate' | 'Advanced';
          preferred_cuisines: string[];
          available_equipment: string[];
          health_conditions: string[];
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          weekly_budget?: number;
          household_size?: number;
          dietary_preferences?: string[];
          skill_level?: 'Beginner' | 'Intermediate' | 'Advanced';
          preferred_cuisines?: string[];
          available_equipment?: string[];
          health_conditions?: string[];
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
          weekly_budget?: number;
          household_size?: number;
          dietary_preferences?: string[];
          skill_level?: 'Beginner' | 'Intermediate' | 'Advanced';
          preferred_cuisines?: string[];
          available_equipment?: string[];
          health_conditions?: string[];
        };
      };

      // Meal plans
      meal_plans: {
        Row: {
          id: string;
          user_id: string;
          plan_name: string;
          week_start: string;
          total_cost: number;
          meals: Json; // Stores the full meal plan data
          created_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_name: string;
          week_start: string;
          total_cost: number;
          meals: Json;
          created_at?: string;
          is_active?: boolean;
        };
        Update: {
          plan_name?: string;
          week_start?: string;
          total_cost?: number;
          meals?: Json;
          is_active?: boolean;
        };
      };

      // Cooking streaks
      streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_cooked_date: string | null;
          total_meals_cooked: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_cooked_date?: string | null;
          total_meals_cooked?: number;
          updated_at?: string;
        };
        Update: {
          current_streak?: number;
          longest_streak?: number;
          last_cooked_date?: string | null;
          total_meals_cooked?: number;
          updated_at?: string;
        };
      };

      // User achievements
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
          progress: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
          progress?: number;
        };
        Update: {
          progress?: number;
          unlocked_at?: string;
        };
      };

      // Shopping lists
      shopping_lists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          items: Json; // Array of ShoppingItem
          total_estimated_cost: number;
          created_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          items: Json;
          total_estimated_cost?: number;
          created_at?: string;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          items?: Json;
          total_estimated_cost?: number;
          is_active?: boolean;
        };
      };

      // Pantry items
      pantry_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          quantity: string;
          unit: string;
          category: string;
          expiry_date: string | null;
          added_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          quantity: string;
          unit: string;
          category?: string;
          expiry_date?: string | null;
          added_at?: string;
        };
        Update: {
          name?: string;
          quantity?: string;
          unit?: string;
          category?: string;
          expiry_date?: string | null;
        };
      };

      // Chat history (for AI coach)
      chat_history: {
        Row: {
          id: string;
          user_id: string;
          messages: Json; // Array of ChatMessage
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          messages: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          messages?: Json;
          updated_at?: string;
        };
      };

      // Food scan history
      food_scans: {
        Row: {
          id: string;
          user_id: string;
          dish_name: string;
          calories: number;
          nutrition: Json;
          image_url: string | null;
          scanned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          dish_name: string;
          calories: number;
          nutrition: Json;
          image_url?: string | null;
          scanned_at?: string;
        };
        Update: {
          dish_name?: string;
          calories?: number;
          nutrition?: Json;
        };
      };

      // Impact metrics (money saved, health score, etc.)
      impact_metrics: {
        Row: {
          id: string;
          user_id: string;
          month: string; // 'YYYY-MM'
          money_saved: number;
          meals_cooked: number;
          calories_tracked: number;
          co2_saved: number;
          health_score: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          month: string;
          money_saved?: number;
          meals_cooked?: number;
          calories_tracked?: number;
          co2_saved?: number;
          health_score?: number;
        };
        Update: {
          money_saved?: number;
          meals_cooked?: number;
          calories_tracked?: number;
          co2_saved?: number;
          health_score?: number;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type MealPlan = Database['public']['Tables']['meal_plans']['Row'];
export type Streak = Database['public']['Tables']['streaks']['Row'];
export type ShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
export type PantryItemDB = Database['public']['Tables']['pantry_items']['Row'];
export type FoodScan = Database['public']['Tables']['food_scans']['Row'];
export type ImpactMetric = Database['public']['Tables']['impact_metrics']['Row'];
