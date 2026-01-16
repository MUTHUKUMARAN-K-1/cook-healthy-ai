// Gemini AI - Pantry Recipe Suggestions

import { generateContent, parseGeminiJSON } from './client';
import { Recipe } from '@/types';
import { mockRecipes } from '@/data/mockRecipes';

interface PantryRecipeSuggestion {
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  matchingIngredients: string[];
  missingIngredients: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  estimatedCost: number;
}

// Suggest recipes based on available pantry items
export async function suggestRecipesFromPantry(
  pantryItems: string[],
  preferredCuisines?: string[],
  maxMissingIngredients: number = 3
): Promise<PantryRecipeSuggestion[]> {
  const prompt = `You are a creative Indian chef. A user has these ingredients in their pantry:
${pantryItems.join(', ')}

${preferredCuisines ? `Preferred cuisines: ${preferredCuisines.join(', ')}` : 'Any Indian cuisine is fine.'}

Suggest 5 recipes they can make with these ingredients. For each recipe:
1. Use as many available ingredients as possible
2. Keep missing ingredients to a minimum (max ${maxMissingIngredients} items)
3. Include a mix of difficulty levels
4. Be creative and suggest culturally relevant dishes

Return as JSON array:
[
  {
    "name": "Aloo Jeera",
    "description": "Simple cumin-flavored potato dish, perfect with roti",
    "prepTime": 10,
    "cookTime": 15,
    "matchingIngredients": ["Potatoes", "Cumin", "Oil"],
    "missingIngredients": ["Coriander leaves"],
    "difficulty": "Easy",
    "cuisine": "North Indian",
    "estimatedCost": 30
  }
]`;

  try {
    const response = await generateContent(prompt);
    if (response) {
      const parsed = parseGeminiJSON<PantryRecipeSuggestion[]>(response);
      if (parsed && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error suggesting recipes from pantry:', error);
  }

  // Fallback to mock suggestions
  return getMockPantrySuggestions(pantryItems);
}

// Get mock pantry suggestions
function getMockPantrySuggestions(pantryItems: string[]): PantryRecipeSuggestion[] {
  const suggestions: PantryRecipeSuggestion[] = [
    {
      name: 'Simple Aloo Jeera',
      description: 'Cumin-tempered potatoes - comfort food at its best',
      prepTime: 10,
      cookTime: 15,
      matchingIngredients: pantryItems.slice(0, 3),
      missingIngredients: ['Fresh Coriander'],
      difficulty: 'Easy',
      cuisine: 'North Indian',
      estimatedCost: 25,
    },
    {
      name: 'Mixed Vegetable Curry',
      description: 'Hearty vegetable curry with aromatic spices',
      prepTime: 15,
      cookTime: 25,
      matchingIngredients: pantryItems.slice(0, 4),
      missingIngredients: ['Cream', 'Kasuri Methi'],
      difficulty: 'Medium',
      cuisine: 'North Indian',
      estimatedCost: 45,
    },
    {
      name: 'Quick Fried Rice',
      description: 'Indo-Chinese style fried rice with vegetables',
      prepTime: 10,
      cookTime: 15,
      matchingIngredients: pantryItems.filter(i => 
        ['rice', 'onion', 'garlic', 'vegetables'].some(k => i.toLowerCase().includes(k))
      ),
      missingIngredients: ['Soy Sauce'],
      difficulty: 'Easy',
      cuisine: 'Indo-Chinese',
      estimatedCost: 35,
    },
    {
      name: 'Dal Tadka',
      description: 'Comfort lentil soup with aromatic tempering',
      prepTime: 10,
      cookTime: 25,
      matchingIngredients: pantryItems.filter(i => 
        ['dal', 'lentil', 'onion', 'tomato', 'garlic'].some(k => i.toLowerCase().includes(k))
      ),
      missingIngredients: [],
      difficulty: 'Easy',
      cuisine: 'North Indian',
      estimatedCost: 25,
    },
    {
      name: 'Vegetable Pulao',
      description: 'Fragrant rice with mixed vegetables',
      prepTime: 15,
      cookTime: 20,
      matchingIngredients: pantryItems.slice(0, 5),
      missingIngredients: ['Bay Leaves', 'Whole Spices'],
      difficulty: 'Medium',
      cuisine: 'Indian',
      estimatedCost: 40,
    },
  ];

  return suggestions;
}

// Get leftover usage suggestions
export async function suggestLeftoverUsage(
  leftoverItems: string[]
): Promise<PantryRecipeSuggestion[]> {
  const prompt = `A user has these leftover foods that need to be used:
${leftoverItems.join(', ')}

Suggest 3 creative ways to use these leftovers before they go bad. Focus on:
1. Zero waste cooking
2. Quick transformations
3. Making the leftovers taste fresh again

Return as JSON array with name, description, prepTime, cookTime, difficulty, and estimatedCost.`;

  try {
    const response = await generateContent(prompt);
    if (response) {
      const parsed = parseGeminiJSON<PantryRecipeSuggestion[]>(response);
      if (parsed) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error suggesting leftover usage:', error);
  }

  return getMockPantrySuggestions(leftoverItems).slice(0, 3);
}

// Check ingredient compatibility
export function checkIngredientCompatibility(ingredients: string[]): {
  compatible: boolean;
  suggestions: string[];
} {
  // Simple compatibility check based on common pairings
  const suggestions: string[] = [];
  
  const hasProtein = ingredients.some(i => 
    ['paneer', 'egg', 'chicken', 'dal', 'lentil', 'chana', 'soya'].some(p => 
      i.toLowerCase().includes(p)
    )
  );
  
  const hasCarbs = ingredients.some(i => 
    ['rice', 'roti', 'bread', 'potato', 'noodle'].some(c => 
      i.toLowerCase().includes(c)
    )
  );
  
  const hasVegetables = ingredients.some(i => 
    ['onion', 'tomato', 'spinach', 'carrot', 'peas', 'beans'].some(v => 
      i.toLowerCase().includes(v)
    )
  );
  
  if (!hasProtein) {
    suggestions.push('Add protein: eggs, paneer, or lentils');
  }
  if (!hasCarbs) {
    suggestions.push('Add carbs: rice, roti, or potatoes');
  }
  if (!hasVegetables) {
    suggestions.push('Add vegetables for a balanced meal');
  }
  
  return {
    compatible: suggestions.length < 2,
    suggestions,
  };
}
