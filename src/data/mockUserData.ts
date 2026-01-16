// Mock data for Cook Healthy AI - User Data & Personas (International)

import { UserProfile, ImpactMetrics, Achievement } from '@/types';

// Demo Personas for Presentation - International
export const mockUserProfiles: UserProfile[] = [
  {
    id: 'u1',
    name: 'Budget Ben',
    avatar: '/avatars/ben.jpg',
    weeklyBudget: 75,
    numberOfPeople: 2,
    mealsPerDay: 3,
    dietRestrictions: ['Vegetarian'],
    availableEquipment: ['Gas Stove', 'Pressure Cooker', 'Basic Utensils'],
    skillLevel: 'Beginner',
    preferredCuisines: ['American', 'Mediterranean'],
    healthGoals: ['Save Money', 'Eat Healthy'],
  },
  {
    id: 'u2',
    name: 'Fitness Fiona',
    avatar: '/avatars/fiona.jpg',
    weeklyBudget: 150,
    numberOfPeople: 1,
    mealsPerDay: 5,
    dietRestrictions: ['High-Protein', 'Low-Carb'],
    availableEquipment: ['Gas Stove', 'Oven', 'Blender', 'Air Fryer'],
    skillLevel: 'Intermediate',
    preferredCuisines: ['Mediterranean', 'Asian', 'Salads'],
    healthGoals: ['Build Muscle', 'Lose Fat', 'High Protein'],
  },
  {
    id: 'u3',
    name: 'Busy Beth',
    avatar: '/avatars/beth.jpg',
    weeklyBudget: 100,
    numberOfPeople: 4,
    mealsPerDay: 3,
    dietRestrictions: ['Kid-Friendly'],
    availableEquipment: ['Gas Stove', 'Microwave', 'Instant Pot'],
    skillLevel: 'Intermediate',
    preferredCuisines: ['American', 'Italian', 'Mexican'],
    healthGoals: ['Quick Meals', 'Family Nutrition', 'Under 30 Minutes'],
  },
  {
    id: 'u4',
    name: 'Health-conscious Henry',
    avatar: '/avatars/henry.jpg',
    weeklyBudget: 125,
    numberOfPeople: 2,
    mealsPerDay: 3,
    dietRestrictions: ['Low-Sodium', 'Low-Cholesterol', 'Diabetes-Friendly'],
    availableEquipment: ['Gas Stove', 'Steamer', 'Blender'],
    skillLevel: 'Advanced',
    preferredCuisines: ['Mediterranean', 'Asian'],
    healthGoals: ['Control Diabetes', 'Heart Health', 'Weight Management'],
  },
  {
    id: 'u5',
    name: 'Student Sam',
    avatar: '/avatars/sam.jpg',
    weeklyBudget: 50,
    numberOfPeople: 1,
    mealsPerDay: 2,
    dietRestrictions: [],
    availableEquipment: ['Microwave', 'Basic Utensils'],
    skillLevel: 'Beginner',
    preferredCuisines: ['Quick American', 'Easy Italian', 'Sandwiches'],
    healthGoals: ['Budget Friendly', 'Easy to Make', 'Minimal Cleanup'],
  },
];

// Default User for Demo
export const defaultUser: UserProfile = mockUserProfiles[0];

// Mock Impact Metrics (USD/International)
export const mockImpactMetrics: ImpactMetrics = {
  healthScore: 78,
  totalCaloriesTracked: 42500,
  avgNutritionBalance: 85,
  moneySaved: 125,
  typicalSpending: 250,
  co2Saved: 12.5,
  mealsCooked: 25,
  currentStreak: 7,
  longestStreak: 14,
};

// Weekly Spending Data for Charts (USD)
export const weeklySpendingData = [
  { name: 'Week 1', spending: 60, saved: 15, target: 75 },
  { name: 'Week 2', spending: 55, saved: 20, target: 75 },
  { name: 'Week 3', spending: 68, saved: 7, target: 75 },
  { name: 'Week 4', spending: 49, saved: 26, target: 75 },
];

// Daily Nutrition Data
export const dailyNutritionData = [
  { day: 'Mon', calories: 1850, protein: 65, carbs: 220, fat: 55 },
  { day: 'Tue', calories: 2100, protein: 75, carbs: 250, fat: 60 },
  { day: 'Wed', calories: 1900, protein: 70, carbs: 230, fat: 52 },
  { day: 'Thu', calories: 2000, protein: 72, carbs: 240, fat: 58 },
  { day: 'Fri', calories: 1800, protein: 68, carbs: 210, fat: 50 },
  { day: 'Sat', calories: 2200, protein: 80, carbs: 260, fat: 65 },
  { day: 'Sun', calories: 2050, protein: 74, carbs: 245, fat: 60 },
];

// Monthly Trends Data (USD)
export const monthlyTrendsData = [
  { month: 'Jan', moneySaved: 60, healthScore: 65, mealsCooked: 45 },
  { month: 'Feb', moneySaved: 75, healthScore: 70, mealsCooked: 52 },
  { month: 'Mar', moneySaved: 90, healthScore: 72, mealsCooked: 58 },
  { month: 'Apr', moneySaved: 105, healthScore: 75, mealsCooked: 62 },
  { month: 'May', moneySaved: 125, healthScore: 78, mealsCooked: 68 },
];

export const getUserById = (id: string): UserProfile | undefined => {
  return mockUserProfiles.find(user => user.id === id);
};
