// Type definitions for Cook Healthy AI - International Friendly

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image?: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  costPerServing: number; // in USD
  cuisine: string;
  mealType?: string;
  dietType: string | string[];
  equipment?: string[];
  nutrition: NutritionInfo;
  ingredients: Ingredient[];
  instructions: string[] | Instruction[];
  tags?: string[];
}

export interface NutritionInfo {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sodium?: number; // in mg
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  cost?: number;
  estimatedCost?: number;
  alternatives?: string[];
}

export interface Instruction {
  step: number;
  text: string;
  duration?: number; // in minutes
  tips?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  totalCost: number;
  days: DayPlan[];
  createdAt: Date;
}

export interface DayPlan {
  day: string;
  meals: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
    snacks?: Recipe[];
  };
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  weeklyBudget: number;
  numberOfPeople: number;
  mealsPerDay: number;
  dietRestrictions: string[];
  availableEquipment: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  preferredCuisines: string[];
  healthGoals: string[];
  currency?: string;
  locale?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  target: number;
  category: 'streak' | 'savings' | 'cooking' | 'health';
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  estimatedCost: number;
  category: string;
  checked: boolean;
  alternatives?: {
    name: string;
    cost: number;
    store: string;
  }[];
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  expiryDate?: Date;
  category: string;
}

export interface ImpactMetrics {
  healthScore: number; // 1-100
  totalCaloriesTracked: number;
  avgNutritionBalance: number;
  moneySaved: number;
  typicalSpending: number;
  co2Saved: number; // in kg
  mealsCooked: number;
  currentStreak: number;
  longestStreak: number;
}

export interface FoodRecognitionResult {
  dishName: string;
  confidence: number;
  calories: number;
  nutrition: NutritionInfo;
  estimatedCost: number;
  homemadeCost: number;
  ingredients: string[];
  healthRating: number; // 1-10
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
