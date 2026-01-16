// Premium Navigation - Matching Reference Design

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, UtensilsCrossed, Users, MessageCircle, Menu, X, Moon, Sun, Sparkles, Store, Heart, User, Camera, ShoppingBag, Trophy, BarChart3, Search, Refrigerator } from 'lucide-react';
import { useAuth } from '@/lib/supabase/auth';

const bottomNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/meal-planner', label: 'Plan', icon: UtensilsCrossed },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/coach', label: 'Coach', icon: MessageCircle },
];

const allNavItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/meal-planner', label: 'Meal Planner', icon: '📋' },
  { href: '/food-scan', label: 'Food Scanner', icon: '📸' },
  { href: '/community', label: 'Community', icon: '👥' },
  { href: '/local-stores', label: 'Local Stores', icon: '🏪' },
  { href: '/health-programs', label: 'Health Programs', icon: '❤️' },
  { href: '/shopping-list', label: 'Shopping List', icon: '🛒' },
  { href: '/achievements', label: 'Achievements', icon: '🏆' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/pantry', label: 'Pantry', icon: '🧊' },
  { href: '/coach', label: 'AI Coach', icon: '🤖' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, isConfigured } = useAuth();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E85D5D] to-[#FF7B7B] flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Cook Healthy AI</h1>
            <p className="text-[10px] text-[var(--text-muted)]">Gemini + ElevenLabs</p>
          </div>
        </Link>

        <div className="flex items-center gap-1 bg-[var(--surface)] rounded-full p-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface)]'
                }`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/coach">
            <button className="btn-primary text-sm py-2 px-4">
              <Sparkles className="w-4 h-4" /> AI Coach
            </button>
          </Link>
          <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center">
            {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-[var(--text-muted)]" />}
          </button>
          {isConfigured && (
            <Link href={user ? '/dashboard' : '/login'}>
              <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center">
                <User className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Matching Reference */}
      <nav className="bottom-nav">
        {/* Logo/Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E85D5D] to-[#FF7B7B] flex items-center justify-center text-white font-bold text-sm shadow-lg">
          N
        </div>

        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}

        <button onClick={() => setIsOpen(true)} className="nav-item">
          <Menu className="w-5 h-5" />
        </button>
      </nav>

      {/* Mobile Full Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-[var(--surface-elevated)] rounded-t-3xl z-[200] max-h-[80vh] overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-4 border-b border-[var(--border-light)]">
                <h3 className="text-lg font-bold">Menu</h3>
                <div className="flex items-center gap-2">
                  <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center">
                    {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-3 gap-3">
                  {allNavItems.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-colors ${
                            isActive 
                              ? 'bg-[var(--primary)]/10 border-2 border-[var(--primary)]' 
                              : 'bg-[var(--surface)]'
                          }`}
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <span className={`text-xs font-medium text-center ${isActive ? 'text-[var(--primary)]' : ''}`}>
                            {item.label}
                          </span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                {isConfigured && (
                  <Link href={user ? '/dashboard' : '/login'} onClick={() => setIsOpen(false)}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#E85D5D] to-[#FF7B7B] text-white flex items-center justify-center gap-2"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-semibold">{user ? 'My Profile' : 'Login / Sign Up'}</span>
                    </motion.div>
                  </Link>
                )}
              </div>

              <div className="h-[env(safe-area-inset-bottom,0)]" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
