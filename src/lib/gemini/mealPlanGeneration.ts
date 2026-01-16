// Gemini AI - Meal Plan Generation

import { generateContent, parseGeminiJSON } from './client';
import { Recipe, MealPlan, DayPlan } from '@/types';
import { mockRecipes, getRecipesByDiet, getBudgetRecipes } from '@/data/mockRecipes';

interface MealPlanRequest {
  weeklyBudget: number;
  numberOfPeople: number;
  mealsPerDay: number;
  dietRestrictions: string[];
  availableEquipment: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  preferredCuisines: string[];
}

interface GeneratedMealPlan {
  planName: string;
  totalCost: number;
  days: {
    day: string;
    breakfast?: { name: string; cost: number; calories: number; time: number };
    lunch?: { name: string; cost: number; calories: number; time: number };
    dinner?: { name: string; cost: number; calories: number; time: number };
  }[];
  summary: string;
}

// Generate meal plans using Gemini AI
export async function generateMealPlans(request: MealPlanRequest): Promise<GeneratedMealPlan[]> {
  const prompt = `You are a professional nutritionist and meal planner for Indian households. 
  
Generate 5 different weekly meal plans based on these requirements:
- Weekly Budget: ₹${request.weeklyBudget} for ${request.numberOfPeople} people
- Meals per day: ${request.mealsPerDay}
- Diet restrictions: ${request.dietRestrictions.join(', ') || 'None'}
- Available equipment: ${request.availableEquipment.join(', ')}
- Cooking skill level: ${request.skillLevel}
- Preferred cuisines: ${request.preferredCuisines.join(', ')}

For each plan, provide:
1. A creative name for the plan
2. Total weekly cost (must be within budget)
3. 7 days of meals with breakfast, lunch, and dinner
4. For each meal: name, cost per serving, calories, and prep time in minutes

Focus on:
- Nutritionally balanced meals
- Cost-effective ingredients common in Indian markets
- Variety across the week
- Meals appropriate for the skill level

Return as JSON array with this structure:
[
  {
    "planName": "Budget Friendly Week",
    "totalCost": 1400,
    "days": [
      {
        "day": "Monday",
        "breakfast": { "name": "Masala Oats", "cost": 20, "calories": 180, "time": 15 },
        "lunch": { "name": "Dal Rice", "cost": 35, "calories": 350, "time": 30 },
        "dinner": { "name": "Roti Sabzi", "cost": 40, "calories": 400, "time": 35 }
      }
    ],
    "summary": "A budget-friendly plan focusing on lentils and seasonal vegetables"
  }
]`;

  try {
    const response = await generateContent(prompt);
    if (response) {
      const parsed = parseGeminiJSON<GeneratedMealPlan[]>(response);
      if (parsed && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error generating meal plans:', error);
  }

  // Fallback to mock data if Gemini fails
  return generateMockMealPlans(request);
}

// Generate mock meal plans as fallback
function generateMockMealPlans(request: MealPlanRequest): GeneratedMealPlan[] {
  const budgetRecipes = getBudgetRecipes(request.weeklyBudget / 21); // Approx per meal budget
  const dietRecipes = request.dietRestrictions.length > 0 
    ? getRecipesByDiet(request.dietRestrictions[0]) 
    : mockRecipes;
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const plans: GeneratedMealPlan[] = [
    {
      planName: '💰 Budget Saver Plan',
      totalCost: Math.round(request.weeklyBudget * 0.7),
      days: days.map((day, i) => ({
        day,
        breakfast: { name: 'Masala Oats', cost: 20, calories: 180, time: 15 },
        lunch: { name: mockRecipes[i % mockRecipes.length].name, cost: 30, calories: 320, time: 25 },
        dinner: { name: mockRecipes[(i + 1) % mockRecipes.length].name, cost: 40, calories: 380, time: 35 },
      })),
      summary: 'Maximize savings with simple, nutritious meals using affordable ingredients.',
    },
    {
      planName: '💪 High Protein Plan',
      totalCost: Math.round(request.weeklyBudget * 0.85),
      days: days.map((day, i) => ({
        day,
        breakfast: { name: 'Egg Bhurji', cost: 35, calories: 220, time: 10 },
        lunch: { name: 'Chana Masala', cost: 28, calories: 240, time: 30 },
        dinner: { name: 'Palak Paneer', cost: 55, calories: 280, time: 30 },
      })),
      summary: 'Protein-rich meals for fitness enthusiasts and growing families.',
    },
    {
      planName: '⚡ Quick & Easy Plan',
      totalCost: Math.round(request.weeklyBudget * 0.8),
      days: days.map((day, i) => ({
        day,
        breakfast: { name: 'Banana Smoothie', cost: 25, calories: 220, time: 5 },
        lunch: { name: 'Veg Pulao', cost: 30, calories: 250, time: 20 },
        dinner: { name: 'Khichdi', cost: 22, calories: 200, time: 20 },
      })),
      summary: 'All meals ready in under 30 minutes. Perfect for busy schedules.',
    },
    {
      planName: '🌿 Wholesome Vegetarian',
      totalCost: Math.round(request.weeklyBudget * 0.75),
      days: days.map((day, i) => ({
        day,
        breakfast: { name: 'Poha', cost: 18, calories: 180, time: 15 },
        lunch: { name: 'Dal Tadka + Rice', cost: 25, calories: 350, time: 30 },
        dinner: { name: 'Mixed Veg Curry', cost: 35, calories: 320, time: 35 },
      })),
      summary: 'Pure vegetarian meals packed with nutrients and flavor.',
    },
    {
      planName: '🎯 Balanced Nutrition',
      totalCost: Math.round(request.weeklyBudget * 0.9),
      days: days.map((day, i) => ({
        day,
        breakfast: { name: 'Upma', cost: 22, calories: 200, time: 20 },
        lunch: { name: 'Rajma Chawal', cost: 32, calories: 380, time: 40 },
        dinner: { name: 'Roti + Paneer Bhurji', cost: 45, calories: 350, time: 30 },
      })),
      summary: 'Perfectly balanced macros for optimal health and energy.',
    },
  ];
  
  return plans;
}

// Get single recipe suggestion based on criteria
export async function getSingleRecipeSuggestion(
  criteria: string,
  budget?: number,
  equipment?: string[]
): Promise<Recipe | null> {
  const prompt = `Suggest a single Indian recipe that matches: "${criteria}"
${budget ? `Budget: Under ₹${budget} per serving` : ''}
${equipment ? `Available equipment: ${equipment.join(', ')}` : ''}

Return JSON with: name, description, prepTime, cookTime, servings, difficulty, costPerServing, cuisine, ingredients (name, quantity, unit), instructions (step, text), and nutrition (calories, protein, carbs, fat).`;

  try {
    const response = await generateContent(prompt);
    if (response) {
      return parseGeminiJSON<Recipe>(response);
    }
  } catch (error) {
    console.error('Error getting recipe suggestion:', error);
  }
  
  // Fallback to random mock recipe
  return mockRecipes[Math.floor(Math.random() * mockRecipes.length)];
}
