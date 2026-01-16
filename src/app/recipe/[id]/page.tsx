// Recipe Details Page - Fixed for string/object instructions

'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Flame, ChefHat, AlertTriangle, Check, Volume2, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VoiceInstructions, StepPlayButton } from '@/components/VoiceInstructions';
import { getRecipeById } from '@/data/mockRecipes';
import { formatDuration, getDifficultyColor } from '@/utils';

const cuisineEmojis: Record<string, string> = {
  'Indian': '🍛', 'Italian': '🍝', 'American': '🍔', 'Thai': '🍜', 
  'Mexican': '🌮', 'Mediterranean': '🥗', 'International': '🌍',
};

// Helper to normalize instructions
function normalizeInstructions(instructions: any[]): { step: number; text: string }[] {
  return instructions.map((inst, i) => {
    if (typeof inst === 'string') {
      return { step: i + 1, text: inst };
    }
    return { step: inst.step || i + 1, text: inst.text || String(inst) };
  });
}

export default function RecipeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const recipe = getRecipeById(id);

  if (!recipe) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🍽️</span>
          <h1 className="text-2xl font-bold mb-2">Recipe not found</h1>
          <p className="text-[var(--text-muted)] mb-6">Sorry, we couldn't find that recipe.</p>
          <Link href="/"><button className="btn-primary">Go Home</button></Link>
        </div>
      </div>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;
  const steps = normalizeInstructions(recipe.instructions);

  return (
    <div className="page-container safe-bottom">
      {/* Back Button */}
      <div className="p-4">
        <Link href="/">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Recipes
          </motion.button>
        </Link>
      </div>

      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-4 rounded-3xl overflow-hidden mb-6"
      >
        <div className="h-56 sm:h-72 relative">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#E85D5D] to-[#FF7B7B] flex items-center justify-center">
              <span className="text-8xl">{cuisineEmojis[recipe.cuisine] || '🍽️'}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="rating-badge">{recipe.cuisine}</span>
            <span className="chip text-xs py-1 bg-white/20 text-white border-0">{recipe.difficulty}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{recipe.name}</h1>
          <p className="text-white/80 text-sm line-clamp-2">{recipe.description}</p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <section className="section">
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Clock, label: 'Time', value: formatDuration(totalTime), color: 'text-blue-500' },
            { icon: Users, label: 'Serves', value: recipe.servings.toString(), color: 'text-purple-500' },
            { icon: Flame, label: 'Calories', value: `${recipe.nutrition.calories}`, color: 'text-orange-500' },
            { icon: DollarSign, label: 'Cost', value: `$${recipe.costPerServing.toFixed(2)}`, color: 'text-[var(--secondary)]' },
          ].map((stat) => (
            <div key={stat.label} className="premium-card p-3 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className="font-bold text-sm">{stat.value}</p>
              <p className="text-[10px] text-[var(--text-muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nutrition */}
      <section className="section">
        <div className="premium-card p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">🥗</span> Nutrition per Serving
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: 'Protein', value: recipe.nutrition.protein, unit: 'g', color: 'bg-blue-500' },
              { name: 'Carbs', value: recipe.nutrition.carbs, unit: 'g', color: 'bg-amber-500' },
              { name: 'Fat', value: recipe.nutrition.fat, unit: 'g', color: 'bg-orange-500' },
              { name: 'Fiber', value: recipe.nutrition.fiber || 0, unit: 'g', color: 'bg-green-500' },
            ].map((n) => (
              <div key={n.name} className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-xl ${n.color} text-white flex items-center justify-center font-bold text-lg mb-2`}>
                  {n.value}
                </div>
                <p className="text-xs text-[var(--text-muted)]">{n.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="section">
        <div className="premium-card p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">🥬</span> Ingredients
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recipe.ingredients.map((ing, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-3 bg-[var(--surface)] rounded-xl"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--secondary)]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[var(--secondary)]" />
                </div>
                <span className="text-sm">
                  <strong>{ing.quantity} {ing.unit}</strong> {ing.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice Instructions Banner */}
      <section className="section">
        <VoiceInstructions steps={steps} recipeName={recipe.name} />
      </section>

      {/* Step-by-Step Instructions */}
      <section className="section">
        <div className="premium-card p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[var(--primary)]" />
            Step-by-Step Instructions
          </h3>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--secondary)] to-[#4ADE80] text-white flex items-center justify-center font-bold text-lg shadow-lg flex-shrink-0">
                    {step.step}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-[var(--border)] mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[var(--text-primary)] leading-relaxed">{step.text}</p>
                    <StepPlayButton step={step.step} text={step.text} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Start Cooking Button */}
      <section className="section">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-primary py-4 text-base"
        >
          <ChefHat className="w-5 h-5" />
          Start Cooking
        </motion.button>
      </section>

      <div className="h-4" />
    </div>
  );
}
