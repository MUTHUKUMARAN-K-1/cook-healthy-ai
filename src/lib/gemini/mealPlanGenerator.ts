// Gemini AI Meal Plan Generator - Enhanced with Budget-First Planning

import { generateContent, isGeminiAvailable } from './client';

interface MealPlanRequest {
  budget: number;
  currency: string;
  days: number;
  numberOfPeople: number;
  mealsPerDay: number;
  dietType: string;
  cuisinePreferences: string[];
  healthGoals: string[];
  skillLevel: string;
  equipment: string[];
  availableIngredients?: string[];
  expiringIngredients?: string[];
}

interface GeneratedMeal {
  name: string;
  cuisine: string;
  calories: number;
  protein: number;
  cost: number;
  prepTime: number;
  description: string;
  ingredients: string[];
}

interface DayPlan {
  day: string;
  breakfast: GeneratedMeal;
  lunch: GeneratedMeal;
  dinner: GeneratedMeal;
  snack?: GeneratedMeal;
  totalCalories: number;
  totalCost: number;
}

interface GeneratedMealPlan {
  planName: string;
  days: DayPlan[];
  totalCost: number;
  totalCalories: number;
  shoppingList: string[];
  tips: string[];
  nutritionHighlights: string[];
  wasteReduction: string[];
}

interface MealPlanResponse {
  plans: GeneratedMealPlan[];
  budgetSummary: {
    totalBudget: number;
    estimatedSpend: number;
    savings: number;
  };
}

const MEAL_PLANNING_PROMPT = `You are an AI-powered budget meal planning assistant for a healthy cooking platform.

Your task is to generate realistic, affordable, and nutritionally balanced meal plans based strictly on the user's real-life constraints.

You MUST prioritize practicality over ideal or gourmet recipes.

INSTRUCTIONS:
1. Start meal planning from the user's budget and available ingredients, NOT from recipes.
2. Ensure the total estimated cost does NOT exceed the given weekly budget.
3. Prioritize using existing ingredients first to minimize food waste.
4. Reuse ingredients intelligently across multiple meals.
5. Select meals that match the user's skill level and available equipment.
6. Avoid rare, expensive, or hard-to-source ingredients.
7. Ensure meals are nutritionally balanced across the day.
8. Prefer simple cooking steps and minimal preparation time.

OUTPUT: Respond ONLY with valid JSON (no markdown, no code blocks) in this exact format:
{
  "plans": [
    {
      "planName": "Budget-Friendly Week",
      "days": [
        {
          "day": "Monday",
          "breakfast": {
            "name": "Oatmeal with Banana",
            "cuisine": "American",
            "calories": 350,
            "protein": 12,
            "cost": 1.50,
            "prepTime": 10,
            "description": "Quick and filling breakfast",
            "ingredients": ["oats", "banana", "milk", "honey"]
          },
          "lunch": {...},
          "dinner": {...},
          "totalCalories": 1200,
          "totalCost": 8.50
        }
      ],
      "totalCost": 60,
      "totalCalories": 14000,
      "shoppingList": ["oats 2lb", "bananas 6", "milk 1gal"],
      "tips": ["Cook rice in bulk on Sunday"],
      "nutritionHighlights": ["High protein", "Good fiber intake"],
      "wasteReduction": ["Bananas used in breakfast and smoothies"]
    }
  ],
  "budgetSummary": {
    "totalBudget": 100,
    "estimatedSpend": 60,
    "savings": 40
  }
}`;

export async function generateMealPlan(request: MealPlanRequest): Promise<MealPlanResponse> {
  if (!isGeminiAvailable()) {
    console.log('Gemini not available, using mock data');
    return getMockMealPlan(request);
  }

  try {
    const userContext = `
USER INPUTS:
- Weekly food budget: ${request.currency}${request.budget} for ${request.days} days
- Number of people: ${request.numberOfPeople}
- Meals per day: ${request.mealsPerDay} (breakfast, lunch, dinner${request.mealsPerDay > 3 ? ', snacks' : ''})
- Dietary preferences: ${request.dietType}
- Health goals: ${request.healthGoals.join(', ')}
- Cooking skill level: ${request.skillLevel}
- Available equipment: ${request.equipment.join(', ')}
- Preferred cuisines: ${request.cuisinePreferences.join(', ')}
${request.availableIngredients?.length ? `- Available ingredients: ${request.availableIngredients.join(', ')}` : ''}
${request.expiringIngredients?.length ? `- Expiring soon (use first): ${request.expiringIngredients.join(', ')}` : ''}

Generate 2 alternative weekly meal plans that fit this budget and preferences.`;

    const prompt = MEAL_PLANNING_PROMPT + '\n\n' + userContext;

    const response = await generateContent(prompt);
    
    if (!response) {
      return getMockMealPlan(request);
    }
    
    // Extract JSON from response
    try {
      // Try direct parse first
      const parsed = JSON.parse(response);
      if (parsed.plans) return parsed;
    } catch {
      // Try to find JSON object
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.plans) return parsed;
        } catch {
          console.error('Failed to parse extracted JSON');
        }
      }
    }
    
    return getMockMealPlan(request);
  } catch (error) {
    console.error('Meal plan generation error:', error);
    return getMockMealPlan(request);
  }
}

function getMockMealPlan(request: MealPlanRequest): MealPlanResponse {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].slice(0, request.days);
  
  const breakfasts: GeneratedMeal[] = [
    { name: 'Oatmeal with Banana', cuisine: 'American', calories: 350, protein: 12, cost: 1.5, prepTime: 10, description: 'Quick and filling', ingredients: ['oats', 'banana', 'milk'] },
    { name: 'Greek Yogurt Parfait', cuisine: 'Mediterranean', calories: 300, protein: 15, cost: 2.0, prepTime: 5, description: 'Protein-rich start', ingredients: ['yogurt', 'granola', 'berries'] },
    { name: 'Scrambled Eggs Toast', cuisine: 'American', calories: 380, protein: 18, cost: 2.5, prepTime: 12, description: 'Classic breakfast', ingredients: ['eggs', 'bread', 'butter'] },
  ];

  const lunches: GeneratedMeal[] = [
    { name: 'Buddha Bowl', cuisine: 'International', calories: 420, protein: 18, cost: 4.0, prepTime: 20, description: 'Nutritious and colorful', ingredients: ['quinoa', 'chickpeas', 'vegetables', 'tahini'] },
    { name: 'Chicken Salad Wrap', cuisine: 'American', calories: 450, protein: 28, cost: 3.5, prepTime: 15, description: 'Light and filling', ingredients: ['chicken', 'lettuce', 'tortilla', 'mayo'] },
    { name: 'Lentil Soup', cuisine: 'Mediterranean', calories: 380, protein: 16, cost: 2.0, prepTime: 25, description: 'Hearty and cheap', ingredients: ['lentils', 'carrots', 'onion', 'spices'] },
  ];

  const dinners: GeneratedMeal[] = [
    { name: 'Pasta Primavera', cuisine: 'Italian', calories: 480, protein: 14, cost: 3.5, prepTime: 25, description: 'Veggie-loaded pasta', ingredients: ['pasta', 'vegetables', 'olive oil', 'parmesan'] },
    { name: 'Stir-Fry with Rice', cuisine: 'Asian', calories: 520, protein: 22, cost: 4.0, prepTime: 20, description: 'Quick weeknight dinner', ingredients: ['rice', 'vegetables', 'tofu', 'soy sauce'] },
    { name: 'Baked Chicken & Veggies', cuisine: 'American', calories: 550, protein: 35, cost: 5.0, prepTime: 35, description: 'One-pan meal', ingredients: ['chicken thighs', 'potatoes', 'broccoli'] },
  ];

  const plan1Days = days.map((day, i) => ({
    day,
    breakfast: breakfasts[i % 3],
    lunch: lunches[i % 3],
    dinner: dinners[i % 3],
    totalCalories: breakfasts[i % 3].calories + lunches[i % 3].calories + dinners[i % 3].calories,
    totalCost: breakfasts[i % 3].cost + lunches[i % 3].cost + dinners[i % 3].cost,
  }));

  const plan1Total = plan1Days.reduce((sum, d) => sum + d.totalCost, 0) * request.numberOfPeople;

  return {
    plans: [
      {
        planName: 'Budget-Friendly Week',
        days: plan1Days,
        totalCost: Math.round(plan1Total * 100) / 100,
        totalCalories: plan1Days.reduce((sum, d) => sum + d.totalCalories, 0),
        shoppingList: [
          'Oats (2 lb) - $3', 'Bananas (6) - $2', 'Milk (1 gal) - $4',
          'Eggs (12) - $4', 'Bread (1 loaf) - $3', 'Chicken thighs (2 lb) - $8',
          'Rice (2 lb) - $3', 'Pasta (1 lb) - $2', 'Lentils (1 lb) - $2',
          'Mixed vegetables - $6', 'Greek yogurt - $5', 'Cheese - $4',
        ],
        tips: [
          'Cook grains in bulk on Sunday to save time',
          'Use leftover chicken in salads and wraps',
          'Freeze extra soup portions for later',
          'Buy seasonal vegetables for best prices',
        ],
        nutritionHighlights: [
          'High protein from eggs, chicken, lentils',
          'Good fiber from oats, vegetables, lentils',
          'Balanced macros throughout the day',
        ],
        wasteReduction: [
          'Chicken used in lunch wraps and dinner',
          'Vegetables reused across stir-fry and pasta',
          'Bread used for breakfast and lunch sandwiches',
        ],
      },
      {
        planName: 'Quick & Easy Week',
        days: plan1Days.map(d => ({ ...d, totalCost: d.totalCost * 0.9 })),
        totalCost: Math.round(plan1Total * 0.9 * 100) / 100,
        totalCalories: plan1Days.reduce((sum, d) => sum + d.totalCalories, 0),
        shoppingList: [
          'Oats (2 lb) - $3', 'Frozen berries - $4', 'Eggs (18) - $6',
          'Whole wheat bread - $4', 'Canned beans (4) - $4', 'Rice (3 lb) - $4',
          'Frozen vegetables (2 bags) - $6', 'Chicken breast (2 lb) - $10',
          'Pasta sauce (2 jars) - $5', 'Cheese block - $5',
        ],
        tips: [
          'Use canned beans for quick protein',
          'Frozen vegetables are just as nutritious',
          'Prep ingredients on weekends',
          'One-pot meals save cleanup time',
        ],
        nutritionHighlights: [
          'High fiber from beans and vegetables',
          'Complete proteins from eggs and chicken',
          'Low sodium options available',
        ],
        wasteReduction: [
          'Frozen vegetables dont spoil',
          'Canned beans last longer than fresh',
          'Bulk rice and oats used daily',
        ],
      },
    ],
    budgetSummary: {
      totalBudget: request.budget,
      estimatedSpend: Math.round(plan1Total * 100) / 100,
      savings: Math.round((request.budget - plan1Total) * 100) / 100,
    },
  };
}

export default generateMealPlan;
