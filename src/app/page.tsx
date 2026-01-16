// Premium HomePage - Fixed Hydration & International with Local Images

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Mic, Clock, ArrowRight } from 'lucide-react';
import { mockRecipes } from '@/data/mockRecipes';

// Feature cards with gradient icons
const features = [
  { href: '/meal-planner', label: 'Meal Plan', icon: '📋', gradient: 'linear-gradient(135deg, #FF9A56 0%, #FF6B3D 100%)' },
  { href: '/food-scan', label: 'Scan Food', icon: '📸', gradient: 'linear-gradient(135deg, #3DD9B3 0%, #2EC4A0 100%)' },
  { href: '/coach', label: 'AI Coach', icon: '🤖', gradient: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)' },
  { href: '/community', label: 'Community', icon: '👥', gradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)' },
  { href: '/local-stores', label: 'Stores', icon: '🏪', gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)' },
  { href: '/health-programs', label: 'Health', icon: '❤️', gradient: 'linear-gradient(135deg, #F472B6 0%, #EC4899 100%)' },
];

const stats = [
  { value: '15K+', label: 'Users', colorClass: 'text-gradient-red' },
  { value: '$2.5K', label: 'Saved/Week', colorClass: 'text-gradient-green' },
  { value: '4.8★', label: 'Rating', colorClass: 'text-gradient-red' },
];

// Fixed ratings by recipe ID (deterministic for hydration)
const recipeRatings: Record<string, number> = {
  'r1': 4.8, 'r2': 4.6, 'r3': 4.9, 'r4': 4.5, 'r5': 4.7, 'r6': 4.4,
  'r7': 4.3, 'r8': 4.8, 'r9': 4.6, 'r10': 4.5,
};

export default function HomePage() {
  const popularRecipes = mockRecipes.slice(0, 6);

  return (
    <div className="page-container safe-bottom">
      {/* Header */}
      <header className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-title"
        >
          Eat <span className="text-gradient-green">Healthy</span>, Save <span className="text-gradient-red">Money</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="page-subtitle"
        >
          AI-powered meal planning for everyone worldwide 🌍
        </motion.p>
      </header>

      {/* Search Bar */}
      <section className="section">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="search-bar"
        >
          <Search className="w-5 h-5 text-[var(--text-muted)]" />
          <input type="text" placeholder="Search healthy recipes, meal plans..." />
          <button className="search-mic">
            <Mic className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* Stats Row */}
      <section className="section">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="stats-card"
            >
              <span className={`stats-value ${stat.colorClass}`}>{stat.value}</span>
              <span className="stats-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="section">
        <div className="grid grid-cols-3 gap-3">
          {features.map((feature, i) => (
            <Link key={feature.href} href={feature.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="feature-card"
              >
                <div className="feature-icon" style={{ background: feature.gradient }}>
                  <span className="text-white drop-shadow-lg">{feature.icon}</span>
                </div>
                <span className="feature-label">{feature.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Recipes */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Popular Recipes</h2>
          <Link href="/meal-planner" className="section-link flex items-center gap-1">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="scroll-x">
          {popularRecipes.map((recipe, i) => (
            <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="recipe-card"
              >
                <div className="recipe-image relative overflow-hidden">
                  {recipe.image ? (
                    <img 
                      src={recipe.image} 
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-orange-100 to-orange-200">
                      🍛
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="rating-badge text-xs">
                      {recipeRatings[recipe.id] || 4.5}★
                    </span>
                  </div>
                </div>
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mb-2 line-clamp-1">{recipe.cuisine}</p>
                  <div className="recipe-meta">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recipe.prepTime + recipe.cookTime}m
                    </span>
                    <span className="text-[var(--secondary)] font-semibold">
                      ${recipe.costPerServing.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Voice AI Banner */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card p-5"
          style={{ background: 'linear-gradient(135deg, #E85D5D 0%, #FF7B7B 100%)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              🎙️
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">Voice-Guided Cooking</h3>
              <p className="text-white/80 text-sm">AI reads recipe steps - hands-free!</p>
            </div>
            <Link href="/coach">
              <button className="px-4 py-2 bg-white text-[var(--primary)] font-semibold rounded-full text-sm">
                Try it →
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* International Support Banner */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="premium-card p-4"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🌍</span>
            <div className="flex-1">
              <h4 className="font-bold">Global Cuisine Support</h4>
              <p className="text-sm text-[var(--text-muted)]">Recipes from 50+ countries, localized nutrition</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {['🇮🇳 Indian', '🇺🇸 American', '🇮🇹 Italian', '🇯🇵 Japanese', '🇲🇽 Mexican', '🇹🇭 Thai'].map((cuisine) => (
              <span key={cuisine} className="chip text-xs py-1">{cuisine}</span>
            ))}
          </div>
        </motion.div>
      </section>

      <div className="h-4" />
    </div>
  );
}
