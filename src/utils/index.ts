// Utility functions for Cook Healthy AI

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency in US Dollars
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format time duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Calculate total nutrition from multiple items
export function calculateTotalNutrition(
  items: Array<{ nutrition: { calories: number; protein: number; carbs: number; fat: number; fiber: number } }>
) {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.nutrition.calories,
      protein: acc.protein + item.nutrition.protein,
      carbs: acc.carbs + item.nutrition.carbs,
      fat: acc.fat + item.nutrition.fat,
      fiber: acc.fiber + item.nutrition.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

// Get health score color based on value
export function getHealthScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

// Get difficulty color
export function getDifficultyColor(difficulty: 'Easy' | 'Medium' | 'Hard'): string {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-500/20 text-green-400';
    case 'Medium':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'Hard':
      return 'bg-red-500/20 text-red-400';
  }
}

// Calculate savings percentage
export function calculateSavingsPercent(original: number, saved: number): number {
  if (original === 0) return 0;
  return Math.round((saved / original) * 100);
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Parse Gemini response safely
export function parseGeminiResponse<T>(response: string): T | null {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]) as T;
    }
    // Try direct JSON parse
    return JSON.parse(response) as T;
  } catch {
    console.error('Failed to parse Gemini response:', response);
    return null;
  }
}

// Delay utility for retry logic
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await delay(baseDelay * Math.pow(2, i));
      }
    }
  }
  
  throw lastError;
}

// Get greeting based on time
export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Calculate CO2 savings (cooking at home vs delivery)
export function calculateCO2Savings(mealsCooked: number): number {
  // Average CO2 savings per home-cooked meal vs delivery: ~0.5 kg
  return mealsCooked * 0.5;
}

// Get random motivational message
export function getMotivationalMessage(): string {
  const messages = [
    "Great job cooking at home! You're saving money and eating healthier.",
    "Every home-cooked meal is a step towards better health!",
    "Your kitchen skills are improving! Keep it up!",
    "You're doing amazing! Your body thanks you.",
    "Consistency is key - you're building great habits!",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
