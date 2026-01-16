// Supabase exports

export { getSupabase, createClient, isSupabaseConfigured } from './client';
export { AuthProvider, useAuth } from './auth';
export { useMealPlans, useStreak, useShoppingList, usePantry, useImpactMetrics } from './hooks';
export type { Profile, MealPlan, Streak, ShoppingList, PantryItemDB, FoodScan, ImpactMetric } from './database.types';
