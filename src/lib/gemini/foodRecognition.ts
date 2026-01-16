// Gemini AI - Food Photo Recognition

import { generateContentWithImage, parseGeminiJSON } from './client';
import { FoodRecognitionResult, NutritionInfo } from '@/types';

// Analyze food photo using Gemini Vision
export async function analyzeFoodPhoto(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<FoodRecognitionResult | null> {
  const prompt = `Analyze this food image and provide detailed nutritional information.

Identify the dish and estimate:
1. Dish name (specific, e.g., "Butter Chicken with Naan" not just "Indian food")
2. Confidence level (0-100%)
3. Estimated calories
4. Macronutrient breakdown (protein, carbs, fat, fiber in grams)
5. Estimated restaurant price in Indian Rupees
6. How much it would cost to make at home
7. Main ingredients
8. Health rating (1-10, where 10 is very healthy)

Return as JSON:
{
  "dishName": "Butter Chicken with Naan",
  "confidence": 92,
  "calories": 650,
  "nutrition": {
    "calories": 650,
    "protein": 35,
    "carbs": 45,
    "fat": 38,
    "fiber": 3,
    "sodium": 980
  },
  "estimatedCost": 350,
  "homemadeCost": 120,
  "ingredients": ["Chicken", "Butter", "Cream", "Tomatoes", "Naan bread"],
  "healthRating": 5
}`;

  try {
    const response = await generateContentWithImage(prompt, imageBase64, mimeType);
    if (response) {
      const parsed = parseGeminiJSON<FoodRecognitionResult>(response);
      if (parsed) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error analyzing food photo:', error);
  }

  // Fallback to mock result
  return getMockFoodRecognition();
}

// Compare restaurant cost vs homemade
export function getCostComparison(result: FoodRecognitionResult) {
  const savings = result.estimatedCost - result.homemadeCost;
  const savingsPercent = Math.round((savings / result.estimatedCost) * 100);
  
  return {
    restaurantCost: result.estimatedCost,
    homemadeCost: result.homemadeCost,
    savings,
    savingsPercent,
    message: `Cooking at home saves you ₹${savings} (${savingsPercent}% less)!`,
  };
}

// Get health insights from recognition result
export function getHealthInsights(result: FoodRecognitionResult): string[] {
  const insights: string[] = [];
  const { nutrition, healthRating } = result;
  
  if (healthRating >= 7) {
    insights.push('✅ Great choice! This is a healthy meal option.');
  } else if (healthRating >= 4) {
    insights.push('⚠️ Moderate health rating. Consider balancing with vegetables.');
  } else {
    insights.push('🔴 High calorie/fat content. Best enjoyed occasionally.');
  }
  
  if (nutrition.protein >= 25) {
    insights.push('💪 High in protein - great for muscle building.');
  }
  
  if (nutrition.fiber && nutrition.fiber >= 5) {
    insights.push('🌾 Good fiber content for digestion.');
  }
  
  if (nutrition.sodium && nutrition.sodium > 800) {
    insights.push('🧂 High sodium - may not be suitable for those watching salt intake.');
  }
  
  if (nutrition.fat > 30) {
    insights.push('🫒 High fat content - consider portion control.');
  }
  
  return insights;
}

// Mock food recognition result
function getMockFoodRecognition(): FoodRecognitionResult {
  const mockResults: FoodRecognitionResult[] = [
    {
      dishName: 'Butter Chicken with Naan',
      confidence: 92,
      calories: 650,
      nutrition: {
        calories: 650,
        protein: 35,
        carbs: 45,
        fat: 38,
        fiber: 3,
        sodium: 980,
      },
      estimatedCost: 350,
      homemadeCost: 120,
      ingredients: ['Chicken', 'Butter', 'Cream', 'Tomatoes', 'Naan bread', 'Spices'],
      healthRating: 5,
    },
    {
      dishName: 'Vegetable Biryani',
      confidence: 88,
      calories: 420,
      nutrition: {
        calories: 420,
        protein: 12,
        carbs: 65,
        fat: 14,
        fiber: 6,
        sodium: 680,
      },
      estimatedCost: 280,
      homemadeCost: 80,
      ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Yogurt', 'Spices', 'Ghee'],
      healthRating: 7,
    },
    {
      dishName: 'Paneer Tikka',
      confidence: 95,
      calories: 380,
      nutrition: {
        calories: 380,
        protein: 22,
        carbs: 15,
        fat: 28,
        fiber: 3,
        sodium: 520,
      },
      estimatedCost: 320,
      homemadeCost: 110,
      ingredients: ['Paneer', 'Yogurt', 'Bell Peppers', 'Onions', 'Spices'],
      healthRating: 6,
    },
    {
      dishName: 'Masala Dosa with Sambar',
      confidence: 91,
      calories: 350,
      nutrition: {
        calories: 350,
        protein: 10,
        carbs: 52,
        fat: 12,
        fiber: 5,
        sodium: 480,
      },
      estimatedCost: 180,
      homemadeCost: 45,
      ingredients: ['Rice Batter', 'Potato Masala', 'Sambar', 'Chutney'],
      healthRating: 7,
    },
  ];
  
  return mockResults[Math.floor(Math.random() * mockResults.length)];
}

// Identify pantry items from photo
export async function identifyPantryItems(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<string[]> {
  const prompt = `Look at this image of kitchen/pantry items and list all the food ingredients you can identify.

Return as JSON array of ingredient names:
["Tomatoes", "Onions", "Rice", "Dal", "Cooking Oil"]

Only include food items, not containers or utensils.`;

  try {
    const response = await generateContentWithImage(prompt, imageBase64, mimeType);
    if (response) {
      const parsed = parseGeminiJSON<string[]>(response);
      if (parsed && Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error identifying pantry items:', error);
  }

  // Fallback
  return ['Onions', 'Tomatoes', 'Rice', 'Dal', 'Potatoes'];
}
