// Premium Login Page - Uniform UI with Demo Credentials

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Sparkles, ArrowRight, Eye, EyeOff, Info, Chrome } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/supabase/auth';

const DEMO_EMAIL = 'test@gmail.com';
const DEMO_PASSWORD = '1234';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, isConfigured } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password, name);
        if (error) throw error;
        router.push('/');
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setIsSignUp(false);
  };

  if (!isConfigured) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#E85D5D] to-[#FF7B7B] flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to Cook Healthy AI</h1>
          <p className="text-[var(--text-secondary)] mb-6">
            Backend not configured. Explore all features as a guest!
          </p>
          <Link href="/">
            <button className="w-full btn-primary py-4">
              Explore as Guest <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <div className="mt-6 p-4 bg-[var(--surface)] rounded-2xl">
            <p className="text-sm text-[var(--text-secondary)]">
              <strong>👋 For Judges:</strong> All AI features work without login!
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container flex items-center justify-center min-h-screen px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#E85D5D] to-[#FF7B7B] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            {isSignUp ? 'Start your healthy cooking journey' : 'Continue your healthy cooking journey'}
          </p>
        </div>

        {/* Demo Credentials */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-4 mb-6"
          style={{ background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#7C3AED] text-sm mb-2">🎯 Demo Credentials for Judges</p>
              <div className="bg-white rounded-xl p-3 space-y-1 text-sm font-mono">
                <p><span className="text-[var(--text-muted)]">Email:</span> <strong>{DEMO_EMAIL}</strong></p>
                <p><span className="text-[var(--text-muted)]">Password:</span> <strong>{DEMO_PASSWORD}</strong></p>
              </div>
              <button 
                onClick={fillDemoCredentials}
                className="mt-2 text-sm font-semibold text-[#7C3AED]"
              >
                Click to auto-fill →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <div className="premium-card p-6">
          {/* Google Sign In */}
          <button 
            onClick={() => signInWithGoogle()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 border border-[var(--border)] rounded-2xl font-medium hover:bg-[var(--surface)] transition-colors mb-6"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-sm text-[var(--text-muted)]">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input pl-12"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button type="submit" className="w-full btn-primary py-4" disabled={isLoading}>
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-[var(--primary)] font-semibold"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          <Link href="/" className="hover:underline">Continue as guest →</Link>
        </p>
      </motion.div>
    </div>
  );
}
