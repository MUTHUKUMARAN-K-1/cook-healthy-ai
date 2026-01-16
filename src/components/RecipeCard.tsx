// Zomato-Style Recipe Card

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Users, Flame, IndianRupee, Star, ChefHat } from 'lucide-react';
import { Recipe } from '@/types';
import { formatCurrency, formatDuration, getDifficultyColor } from '@/utils';

const cuisineEmojis: Record<string, string> = {
  'North Indian': '🍛',
  'South Indian': '🥘',
  'Indo-Chinese': '🍜',
  'Indian': '🍲',
  'Gujarati': '🥙',
  'Bengali': '🐟',
  'Maharashtrian': '🌶️',
};

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

export function RecipeCard({ recipe, compact = false }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const randomRating = (4 + Math.random() * 0.9).toFixed(1);
  const randomReviews = Math.floor(Math.random() * 500 + 50);

  if (compact) {
    return (
      <Link href={`/recipe/${recipe.id}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="food-card"
        >
          <div className="food-card-image">
            {cuisineEmojis[recipe.cuisine] || '🍽️'}
          </div>
          <div className="food-card-content">
            <div className="flex items-center gap-2 mb-1">
              <span className="zomato-rating">{randomRating} ★</span>
            </div>
            <h3 className="food-card-title">{recipe.name}</h3>
            <div className="food-card-meta">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {totalTime}m
              </span>
              <span className="price-tag">
                <IndianRupee className="w-3 h-3" />{recipe.costPerServing}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="zomato-card overflow-hidden cursor-pointer"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-[#E23744] to-[#FF7043] flex items-center justify-center">
          <span className="text-6xl">{cuisineEmojis[recipe.cuisine] || '🍽️'}</span>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {recipe.dietType === 'Vegetarian' && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-md">VEG</span>
            )}
            {totalTime <= 20 && (
              <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-md">QUICK</span>
            )}
          </div>
          
          {/* Rating */}
          <div className="absolute bottom-3 left-3">
            <span className="zomato-rating">
              {randomRating} <Star className="w-3 h-3 fill-current" />
            </span>
          </div>
          
          {/* Price */}
          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1.5 bg-white dark:bg-slate-900 text-[#24963F] font-bold text-sm rounded-lg shadow-lg">
              ₹{recipe.costPerServing}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{recipe.name}</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">{recipe.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(totalTime)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {recipe.servings}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4" />
              {recipe.nutrition.calories} cal
            </span>
          </div>

          {/* Nutrition Pills */}
          <div className="flex gap-2 mt-3">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
              P: {recipe.nutrition.protein}g
            </span>
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-full">
              C: {recipe.nutrition.carbs}g
            </span>
            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full">
              F: {recipe.nutrition.fat}g
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default RecipeCard;
