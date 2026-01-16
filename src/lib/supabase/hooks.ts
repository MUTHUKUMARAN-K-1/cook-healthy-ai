// Supabase Database Hooks

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabase, isSupabaseConfigured } from './client';
import { useAuth } from './auth';
import { MealPlan, Streak, ShoppingList, PantryItemDB, ImpactMetric } from './database.types';

// Hook for user's meal plans
export function useMealPlans() {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const fetchMealPlans = async () => {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setMealPlans(data || []);
      setIsLoading(false);
    };

    fetchMealPlans();
  }, [user]);

  const saveMealPlan = useCallback(async (plan: Omit<MealPlan, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return null;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('meal_plans')
      .insert({ ...plan, user_id: user.id })
      .select()
      .single();
    
    if (data) setMealPlans(prev => [data, ...prev]);
    return { data, error };
  }, [user]);

  return { mealPlans, isLoading, saveMealPlan };
}

// Hook for cooking streak
export function useStreak() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<Streak | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const fetchStreak = async () => {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setStreak(data);
      setIsLoading(false);
    };

    fetchStreak();
  }, [user]);

  const markMealCooked = useCallback(async () => {
    if (!user) return;
    
    const supabase = getSupabase();
    const today = new Date().toISOString().split('T')[0];
    
    if (streak) {
      const lastCooked = streak.last_cooked_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      let newStreak = streak.current_streak;
      if (lastCooked === yesterday) {
        newStreak += 1;
      } else if (lastCooked !== today) {
        newStreak = 1;
      }

      const { data } = await supabase
        .from('streaks')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, streak.longest_streak),
          last_cooked_date: today,
          total_meals_cooked: streak.total_meals_cooked + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (data) setStreak(data);
    } else {
      const { data } = await supabase
        .from('streaks')
        .insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_cooked_date: today,
          total_meals_cooked: 1,
        })
        .select()
        .single();
      
      if (data) setStreak(data);
    }
  }, [user, streak]);

  return { streak, isLoading, markMealCooked };
}

// Hook for shopping list
export function useShoppingList() {
  const { user } = useAuth();
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const fetchList = async () => {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();
      
      setShoppingList(data);
      setIsLoading(false);
    };

    fetchList();
  }, [user]);

  const updateList = useCallback(async (items: any[]) => {
    if (!user) return;
    const supabase = getSupabase();
    const total = items.reduce((sum, item) => sum + item.estimatedCost, 0);

    if (shoppingList) {
      const { data } = await supabase
        .from('shopping_lists')
        .update({ items, total_estimated_cost: total })
        .eq('id', shoppingList.id)
        .select()
        .single();
      if (data) setShoppingList(data);
    } else {
      const { data } = await supabase
        .from('shopping_lists')
        .insert({
          user_id: user.id,
          name: 'My Shopping List',
          items,
          total_estimated_cost: total,
          is_active: true,
        })
        .select()
        .single();
      if (data) setShoppingList(data);
    }
  }, [user, shoppingList]);

  return { shoppingList, isLoading, updateList };
}

// Hook for pantry items
export function usePantry() {
  const { user } = useAuth();
  const [items, setItems] = useState<PantryItemDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const fetchPantry = async () => {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('pantry_items')
        .select('*')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });
      
      setItems(data || []);
      setIsLoading(false);
    };

    fetchPantry();
  }, [user]);

  const addItem = useCallback(async (item: Omit<PantryItemDB, 'id' | 'user_id' | 'added_at'>) => {
    if (!user) return;
    const supabase = getSupabase();
    const { data } = await supabase
      .from('pantry_items')
      .insert({ ...item, user_id: user.id })
      .select()
      .single();
    if (data) setItems(prev => [data, ...prev]);
  }, [user]);

  const removeItem = useCallback(async (id: string) => {
    if (!user) return;
    const supabase = getSupabase();
    await supabase.from('pantry_items').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  }, [user]);

  return { items, isLoading, addItem, removeItem };
}

// Hook for impact metrics
export function useImpactMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ImpactMetric | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const months = new Date().toISOString().slice(0, 7);
    const fetchMetrics = async () => {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('impact_metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', months)
        .single();
      
      setMetrics(data);
      setIsLoading(false);
    };

    fetchMetrics();
  }, [user]);

  return { metrics, isLoading };
}

export { useAuth } from './auth';
