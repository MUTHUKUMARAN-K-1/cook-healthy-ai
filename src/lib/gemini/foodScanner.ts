// Gemini AI Food Scanner - Real-time Image Analysis

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface FoodScanResult {
  dishName: string;
  cuisine: string;
  confidence: number;
  nutrition: NutritionInfo;
  ingredients: string[];
  healthRating: number;
  healthTips: string[];
  homemadeCost: number;
  restaurantCost: number;
  savings: number;
}

export function isGeminiVisionAvailable(): boolean {
  return !!GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here';
}

export async function scanFood(imageBase64: string): Promise<FoodScanResult> {
  // If no image or no API key, return mock data
  if (!imageBase64 || !isGeminiVisionAvailable()) {
    console.log('Gemini Vision not available or no image, using mock data');
    return getMockScanResult();
  }

  try {
    // Clean the base64 string - remove the data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `You are a nutrition expert. Analyze this food image and provide detailed information.

Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks, just pure JSON):
{
  "dishName": "Name of the dish",
  "cuisine": "Cuisine type (e.g., Indian, Italian, American, etc.)",
  "confidence": 0.95,
  "nutrition": {
    "calories": 450,
    "protein": 25,
    "carbs": 45,
    "fat": 18,
    "fiber": 6
  },
  "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
  "healthRating": 8,
  "healthTips": ["tip1", "tip2", "tip3"],
  "homemadeCost": 5.00,
  "restaurantCost": 15.00,
  "savings": 10.00
}

Make sure:
- calories, protein, carbs, fat, fiber are realistic numbers
- healthRating is 1-10 (10 being healthiest)
- costs are in USD
- ingredients list has 4-8 items
- healthTips has 2-4 practical tips`
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return getMockScanResult();
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log('Gemini raw response:', text);
    
    // Try to extract JSON from the response
    // First try: direct parse
    try {
      return JSON.parse(text) as FoodScanResult;
    } catch {
      // Second try: find JSON object in the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]) as FoodScanResult;
        } catch {
          console.error('Failed to parse extracted JSON');
        }
      }
    }
    
    console.log('Could not parse Gemini response, using mock data');
    return getMockScanResult();
  } catch (error) {
    console.error('Food scan error:', error);
    return getMockScanResult();
  }
}

function getMockScanResult(): FoodScanResult {
  const dishes = [
    {
      dishName: 'Chicken Biryani',
      cuisine: 'Indian',
      confidence: 0.92,
      nutrition: { calories: 520, protein: 28, carbs: 65, fat: 18, fiber: 4 },
      ingredients: ['Basmati Rice', 'Chicken', 'Onions', 'Yogurt', 'Spices', 'Saffron', 'Ghee', 'Mint'],
      healthRating: 7,
      healthTips: ['Add raita for probiotics', 'Include salad for fiber', 'Use brown rice for more nutrition'],
      homemadeCost: 5.50,
      restaurantCost: 14.00,
      savings: 8.50,
    },
    {
      dishName: 'Caesar Salad',
      cuisine: 'American',
      confidence: 0.95,
      nutrition: { calories: 320, protein: 12, carbs: 18, fat: 24, fiber: 5 },
      ingredients: ['Romaine Lettuce', 'Parmesan', 'Croutons', 'Caesar Dressing', 'Chicken', 'Lemon'],
      healthRating: 8,
      healthTips: ['Use light dressing for fewer calories', 'Add extra vegetables', 'Grill chicken for extra protein'],
      homemadeCost: 4.00,
      restaurantCost: 12.00,
      savings: 8.00,
    },
    {
      dishName: 'Pasta Carbonara',
      cuisine: 'Italian',
      confidence: 0.88,
      nutrition: { calories: 580, protein: 22, carbs: 68, fat: 24, fiber: 3 },
      ingredients: ['Spaghetti', 'Eggs', 'Parmesan', 'Pancetta', 'Black Pepper', 'Garlic'],
      healthRating: 6,
      healthTips: ['Use whole wheat pasta for more fiber', 'Add vegetables like peas', 'Reduce portion size'],
      homemadeCost: 4.50,
      restaurantCost: 16.00,
      savings: 11.50,
    },
    {
      dishName: 'Grilled Salmon',
      cuisine: 'Mediterranean',
      confidence: 0.94,
      nutrition: { calories: 420, protein: 38, carbs: 12, fat: 24, fiber: 3 },
      ingredients: ['Salmon Fillet', 'Olive Oil', 'Lemon', 'Garlic', 'Herbs', 'Asparagus'],
      healthRating: 9,
      healthTips: ['Rich in omega-3 fatty acids', 'Great for heart health', 'Pair with more vegetables'],
      homemadeCost: 10.00,
      restaurantCost: 24.00,
      savings: 14.00,
    },
  ];

  return dishes[Math.floor(Math.random() * dishes.length)];
}

export default scanFood;
