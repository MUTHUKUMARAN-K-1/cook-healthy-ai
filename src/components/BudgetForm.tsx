// Budget Form Component for Meal Planning

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IndianRupee, Users, Utensils, Leaf, ChefHat, 
  Flame, Zap, Heart, Timer, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BudgetFormData {
  weeklyBudget: number;
  numberOfPeople: number;
  mealsPerDay: number;
  dietRestrictions: string[];
  availableEquipment: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  preferredCuisines: string[];
}

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => void;
  isLoading?: boolean;
}

const DIET_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'high-protein', label: 'High Protein', icon: '💪' },
  { id: 'low-carb', label: 'Low Carb', icon: '🍳' },
  { id: 'diabetes-friendly', label: 'Diabetes Friendly', icon: '💚' },
  { id: 'keto', label: 'Keto', icon: '🥑' },
  { id: 'heart-healthy', label: 'Heart Healthy', icon: '❤️' },
];

const EQUIPMENT_OPTIONS = [
  { id: 'gas-stove', label: 'Gas Stove', icon: '🔥' },
  { id: 'induction', label: 'Induction', icon: '⚡' },
  { id: 'pressure-cooker', label: 'Pressure Cooker', icon: '♨️' },
  { id: 'microwave', label: 'Microwave', icon: '📡' },
  { id: 'oven', label: 'Oven', icon: '🍞' },
  { id: 'blender', label: 'Blender/Mixer', icon: '🔄' },
  { id: 'air-fryer', label: 'Air Fryer', icon: '🍟' },
  { id: 'rice-cooker', label: 'Rice Cooker', icon: '🍚' },
];

const CUISINE_OPTIONS = [
  { id: 'north-indian', label: 'North Indian', icon: '🍛' },
  { id: 'south-indian', label: 'South Indian', icon: '🥘' },
  { id: 'indo-chinese', label: 'Indo-Chinese', icon: '🍜' },
  { id: 'gujarati', label: 'Gujarati', icon: '🥗' },
  { id: 'bengali', label: 'Bengali', icon: '🐟' },
  { id: 'punjabi', label: 'Punjabi', icon: '🫓' },
  { id: 'maharashtrian', label: 'Maharashtrian', icon: '🌶️' },
  { id: 'continental', label: 'Continental', icon: '🍝' },
];

export function BudgetForm({ onSubmit, isLoading }: BudgetFormProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    weeklyBudget: 2000,
    numberOfPeople: 2,
    mealsPerDay: 3,
    dietRestrictions: [],
    availableEquipment: ['gas-stove', 'pressure-cooker'],
    skillLevel: 'Intermediate',
    preferredCuisines: ['north-indian'],
  });

  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Budget & People Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-green-500" />
            Budget & Household
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Weekly Budget (₹)
              </label>
              <Input
                type="number"
                value={formData.weeklyBudget}
                onChange={(e) => setFormData({ ...formData, weeklyBudget: Number(e.target.value) })}
                min={500}
                max={10000}
                step={100}
                icon={<IndianRupee className="w-4 h-4" />}
              />
              <p className="text-xs text-gray-500 mt-1">
                ≈ ₹{Math.round(formData.weeklyBudget / (formData.numberOfPeople * formData.mealsPerDay * 7))}/meal
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of People
              </label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData({ ...formData, numberOfPeople: Math.max(1, formData.numberOfPeople - 1) })}
                >
                  -
                </Button>
                <span className="w-12 text-center font-bold text-lg">{formData.numberOfPeople}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData({ ...formData, numberOfPeople: Math.min(10, formData.numberOfPeople + 1) })}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Meals per Day
              </label>
              <div className="flex gap-2">
                {[2, 3, 4].map(num => (
                  <Button
                    key={num}
                    type="button"
                    variant={formData.mealsPerDay === num ? 'default' : 'outline'}
                    onClick={() => setFormData({ ...formData, mealsPerDay: num })}
                    className="flex-1"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-500" />
            Cooking Skill Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map(level => (
              <motion.button
                key={level}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, skillLevel: level })}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  formData.skillLevel === level
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl mb-2 block">
                  {level === 'Beginner' ? '👶' : level === 'Intermediate' ? '👨‍🍳' : '👑'}
                </span>
                <span className="font-medium">{level}</span>
                <p className="text-xs text-gray-500 mt-1">
                  {level === 'Beginner' 
                    ? 'Simple, quick recipes' 
                    : level === 'Intermediate' 
                    ? 'Some complexity OK' 
                    : 'Challenge me!'
                  }
                </p>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diet Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-500" />
            Dietary Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {DIET_OPTIONS.map(option => (
              <motion.button
                key={option.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({
                  ...formData,
                  dietRestrictions: toggleArrayItem(formData.dietRestrictions, option.id)
                })}
                className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 transition-all ${
                  formData.dietRestrictions.includes(option.id)
                    ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-blue-500" />
            Available Equipment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {EQUIPMENT_OPTIONS.map(option => (
              <motion.button
                key={option.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({
                  ...formData,
                  availableEquipment: toggleArrayItem(formData.availableEquipment, option.id)
                })}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                  formData.availableEquipment.includes(option.id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{option.icon}</span>
                <span className="text-xs font-medium text-center">{option.label}</span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cuisine Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            Preferred Cuisines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map(option => (
              <motion.button
                key={option.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({
                  ...formData,
                  preferredCuisines: toggleArrayItem(formData.preferredCuisines, option.id)
                })}
                className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 transition-all ${
                  formData.preferredCuisines.includes(option.id)
                    ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Button 
          type="submit" 
          size="lg" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              AI is planning your meals...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Meal Plans with AI
            </span>
          )}
        </Button>
      </motion.div>
    </form>
  );
}

export default BudgetForm;
