// Supabase Auth Context - Simplified

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './client';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  weekly_budget: number;
  household_size: number;
  dietary_preferences: string[];
  skill_level: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    // Dynamic import to avoid issues when Supabase isn't configured
    import('./client').then(({ getSupabase }) => {
      const supabase = getSupabase();

      supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, supabase);
        } else {
          setIsLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event: string, session: any) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (event === 'SIGNED_IN' && session?.user) {
            await fetchProfile(session.user.id, supabase);
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
          }
        }
      );

      return () => subscription.unsubscribe();
    });
  }, [isConfigured]);

  const fetchProfile = async (userId: string, supabase: any) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      setProfile(data as Profile | null);
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!isConfigured) return;
    const { getSupabase } = await import('./client');
    const supabase = getSupabase();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isConfigured) return { error: new Error('Supabase not configured') };
    const { getSupabase } = await import('./client');
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    if (!isConfigured) return { error: new Error('Supabase not configured') };
    const { getSupabase } = await import('./client');
    const supabase = getSupabase();
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    // Profile will be created by database trigger
    return { error: error as Error | null };
  };

  const signOut = async () => {
    if (!isConfigured) return;
    const { getSupabase } = await import('./client');
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !isConfigured) return;
    const { getSupabase } = await import('./client');
    const supabase = getSupabase();
    
    await supabase.from('profiles').update(updates).eq('id', user.id);
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{
      user, session, profile, isLoading, isConfigured,
      signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
