// Gemini AI Wellness Coach Service - Enhanced Prompts

import { generateContent, isGeminiAvailable } from './client';
import { ChatMessage } from '@/types';
import { generateId } from '@/utils';

// Enhanced System Prompt for the Wellness Coach
const WELLNESS_COACH_SYSTEM_PROMPT = `You are "Cook Healthy AI Coach" - a warm, knowledgeable, and supportive AI wellness companion specializing in Indian cuisine, budget-friendly healthy eating, and personalized nutrition advice.

## Your Personality
- Friendly, encouraging, and empathetic like a caring family member
- Practical and budget-conscious - you understand Indian household economics
- Culturally aware of Indian food traditions, festivals, and regional cuisines
- You speak naturally, warmly, and concisely (responses should be voice-friendly)

## Your Expertise
1. **Indian Nutrition**: Deep knowledge of nutritional value of Indian foods, spices, and traditional cooking methods
2. **Budget Cooking**: Expert at maximizing nutrition while minimizing costs (think ₹30-80 per meal)
3. **Health Conditions**: Diet advice for diabetes, heart health, PCOS, thyroid, weight management
4. **Quick Meals**: 15-30 minute recipes for busy professionals and students
5. **Regional Cuisines**: North Indian, South Indian, Gujarati, Bengali, Maharashtrian, etc.
6. **Ayurvedic Principles**: Basic understanding of warming/cooling foods, seasonal eating

## Response Guidelines
- Keep responses SHORT and CONVERSATIONAL (2-4 sentences for simple questions)
- Use bullet points for lists (maximum 3-5 items)
- Always include practical, actionable advice
- Mention approximate costs in ₹ when suggesting recipes
- Include emoji sparingly for warmth (1-2 per response)
- For recipes, give brief ingredients and key steps only
- End with an encouraging note or follow-up question

## Response Structure Examples

For meal suggestions:
"Here's a quick healthy option! 🍳
**Dal Tadka with Brown Rice** (₹35/serving, 20 mins)
- High protein, fiber-rich, and satisfying
- Add a side of cucumber raita for probiotics
Want me to share the quick recipe?"

For health questions:
"Great question about managing sugar levels! 🌿
For diabetes-friendly meals, focus on:
• Low GI grains like brown rice, millets
• Plenty of fiber from vegetables
• Healthy fats from nuts and seeds
Shall I suggest a weekly meal plan?"

For budget questions:
"Absolutely! Eating healthy on ₹1500/week is doable! 💪
Focus on dal, seasonal vegetables, eggs, and local grains. Here's a sample day:
• Breakfast: Poha with peanuts (₹20)
• Lunch: Rajma rice + salad (₹35)
• Dinner: Roti + palak paneer (₹40)
Want more budget meal ideas?"

## Important Rules
- Never provide medical diagnoses - suggest consulting a doctor for health concerns
- Be inclusive of all dietary preferences (vegetarian, non-veg, vegan)
- Prioritize locally available, seasonal ingredients
- Remember context from the conversation
- If unsure, ask clarifying questions`;

// Create a chat message object
export function createChatMessage(role: 'user' | 'assistant', content: string): ChatMessage {
  return {
    id: generateId(),
    role,
    content,
    timestamp: new Date(),
  };
}

// Format conversation history for Gemini
function formatConversationHistory(messages: ChatMessage[]): string {
  return messages
    .slice(-6) // Keep last 6 messages for context
    .map(msg => `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}`)
    .join('\n\n');
}

// Get wellness advice from Gemini
export async function getWellnessAdvice(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  if (!isGeminiAvailable()) {
    return getMockResponse(userMessage);
  }

  try {
    const historyContext = conversationHistory.length > 0
      ? `\n\n## Previous Conversation:\n${formatConversationHistory(conversationHistory)}`
      : '';

    const prompt = `${WELLNESS_COACH_SYSTEM_PROMPT}${historyContext}

## Current User Message:
"${userMessage}"

Respond naturally and helpfully as Cook Healthy AI Coach. Keep it concise and voice-friendly:`;

    const response = await generateContent(prompt);
    return response || getMockResponse(userMessage);
  } catch (error) {
    console.error('Wellness advice error:', error);
    return getMockResponse(userMessage);
  }
}

// Get health-specific meal suggestions
export async function getHealthMealSuggestion(
  healthCondition: string,
  preferences: { budget?: number; dietary?: string; time?: number } = {}
): Promise<string> {
  if (!isGeminiAvailable()) {
    return getMockHealthResponse(healthCondition);
  }

  const prompt = `${WELLNESS_COACH_SYSTEM_PROMPT}

## Task:
Suggest 3 meal ideas for someone managing "${healthCondition}".

Preferences:
- Budget: ${preferences.budget ? `₹${preferences.budget}/meal` : 'flexible'}
- Dietary: ${preferences.dietary || 'no restrictions'}
- Time: ${preferences.time ? `${preferences.time} minutes` : 'any'}

Provide practical, Indian cuisine-based suggestions with brief reasoning for each.`;

  try {
    const response = await generateContent(prompt);
    return response || getMockHealthResponse(healthCondition);
  } catch {
    return getMockHealthResponse(healthCondition);
  }
}

// Get quick wellness tips
export async function getQuickWellnessTip(topic: string): Promise<string> {
  if (!isGeminiAvailable()) {
    return getRandomWellnessTip();
  }

  const prompt = `${WELLNESS_COACH_SYSTEM_PROMPT}

Give ONE quick, practical wellness tip about "${topic}" in 2-3 sentences. Make it actionable and specific to Indian lifestyle/cuisine.`;

  try {
    const response = await generateContent(prompt);
    return response || getRandomWellnessTip();
  } catch {
    return getRandomWellnessTip();
  }
}

// Enhanced mock responses
function getMockResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  // Budget-related
  if (message.includes('budget') || message.includes('cheap') || message.includes('save') || message.includes('₹') || message.includes('money')) {
    return `Great question about budget eating! 💪

Here's my top tip: Focus on **dal, eggs, seasonal veggies, and local grains** - they're nutritional powerhouses at low cost!

A sample budget day (under ₹100):
• Breakfast: Poha with peanuts & veggies (₹25)
• Lunch: Rajma chawal + cucumber salad (₹35)
• Dinner: Roti + aloo gobhi + dal (₹35)

Would you like a full weekly budget meal plan?`;
  }

  // Energy/tiredness
  if (message.includes('energy') || message.includes('tired') || message.includes('fatigue') || message.includes('weak')) {
    return `Feeling low on energy? Let's fix that with food! ⚡

For sustained energy, try these:
• Start your day with **soaked almonds + banana**
• Include **iron-rich foods** like spinach, dates, jaggery
• Stay hydrated with **nimbu pani** with a pinch of salt

Quick energy booster: A handful of roasted chana with jaggery!

Want me to suggest an energizing meal plan for your week?`;
  }

  // Diabetes
  if (message.includes('diabetes') || message.includes('sugar') || message.includes('blood sugar')) {
    return `Managing blood sugar through diet is so important! 🌿

Key tips for diabetes-friendly Indian meals:
• Choose **millets** (ragi, jowar, bajra) over white rice
• Load up on **fiber** - leafy greens, beans, whole dals
• Add **methi, cinnamon, jamun** - natural blood sugar helpers
• Avoid fruit juices, opt for whole fruits with protein

A great breakfast: Ragi dosa with sambar (low GI, high fiber)!

Shall I share a diabetes-friendly weekly meal plan?`;
  }

  // Weight loss
  if (message.includes('weight') || message.includes('lose') || message.includes('fat') || message.includes('slim')) {
    return `Great goal! Here's how to lose weight the healthy Indian way! 🎯

Key principles:
• Fill half your plate with **vegetables**
• Choose **whole grains** over refined (brown rice, whole wheat)
• Include **protein in every meal** - dal, paneer, eggs, chicken
• Avoid hidden calories in chai, biscuits, and fried snacks

A satisfying low-cal dinner: Grilled fish/paneer tikka with a big salad!

Would you like me to create a calorie-conscious meal plan?`;
  }

  // Quick meals
  if (message.includes('quick') || message.includes('fast') || message.includes('busy') || message.includes('minutes')) {
    return `I've got you covered with quick healthy meals! ⏰

15-minute wonders:
• **Egg bhurji** with whole wheat toast
• **Poha** loaded with veggies and peanuts
• **Dahi chawal** with pickle and papad
• **Vegetable upma** with coconut chutney

Pro tip: Meal prep dal and sabzi on weekends for quick weekday dinners!

Need more quick recipe ideas?`;
  }

  // Heart health
  if (message.includes('heart') || message.includes('cholesterol') || message.includes('bp') || message.includes('blood pressure')) {
    return `Heart health through food - excellent focus! ❤️

Heart-friendly Indian eating tips:
• Use **mustard oil or olive oil** instead of ghee
• Eat **oats, barley, and nuts** for cholesterol control
• Include **fatty fish** (if non-veg) or **flaxseeds**
• Reduce salt - use lemon, herbs, and spices for flavor
• Add **garlic** to your cooking daily

Try this: Oats upma with vegetables - tasty and heart-healthy!

Want a heart-healthy meal plan for the week?`;
  }

  // Protein
  if (message.includes('protein') || message.includes('muscle') || message.includes('gym') || message.includes('workout')) {
    return `Building muscle with Indian food? Absolutely possible! 💪

High-protein Indian options:
• **Paneer** - 18g protein per 100g
• **Chana/Rajma** - 15g protein per cup (cooked)
• **Eggs** - 6g each, super versatile
• **Chicken breast** - 31g per 100g
• **Greek yogurt/Hung curd** - 10g per 100g

Post-workout meal idea: Egg white bhurji + whole wheat roti + banana shake!

Shall I create a high-protein meal plan for you?`;
  }

  // Default friendly response
  return `Thanks for your question! 😊

I'm here to help with:
• 🍳 Healthy Indian meal ideas
• 💰 Budget-friendly cooking tips
• ❤️ Diet advice for health conditions
• ⚡ Energy-boosting foods
• ⏰ Quick recipes for busy days

What would you like to explore today? Feel free to ask anything about healthy eating!`;
}

// Mock health-specific responses
function getMockHealthResponse(condition: string): string {
  return `Here are 3 meal ideas for managing ${condition}:

1. **Breakfast**: Ragi dosa with sambar
   - Low GI, high fiber, keeps you full

2. **Lunch**: Brown rice + palak dal + salad
   - Balanced nutrition, iron-rich

3. **Dinner**: Grilled fish/paneer with stir-fry vegetables
   - High protein, low carb

These meals focus on whole foods and balanced nutrition. Want detailed recipes for any of these?`;
}

// Random wellness tips
function getRandomWellnessTip(): string {
  const tips = [
    "🌿 Start your day with warm water and lemon - it kickstarts digestion and hydration!",
    "💪 Add a handful of soaked almonds to your morning routine for brain power and energy!",
    "🍳 Eggs are your budget protein hero - versatile, nutritious, and just ₹7-8 each!",
    "🥬 Eat the rainbow! Different colored vegetables provide different nutrients.",
    "⏰ Try eating your last meal 3 hours before bed for better digestion and sleep!",
    "🌶️ Indian spices like turmeric, cumin, and coriander are anti-inflammatory powerhouses!",
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

export default {
  getWellnessAdvice,
  getHealthMealSuggestion,
  getQuickWellnessTip,
  createChatMessage,
};
