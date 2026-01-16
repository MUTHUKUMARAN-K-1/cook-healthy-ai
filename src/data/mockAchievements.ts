// Mock data for Cook Healthy AI - Achievements

import { Achievement } from '@/types';

export const mockAchievements: Achievement[] = [
  // Streak Achievements
  {
    id: 'streak-3',
    name: '3-Day Streak',
    description: 'Cook at home for 3 consecutive days',
    icon: '🔥',
    unlocked: true,
    unlockedAt: new Date('2024-01-10'),
    progress: 3,
    target: 3,
    category: 'streak',
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Cook at home for 7 consecutive days',
    icon: '⭐',
    unlocked: true,
    unlockedAt: new Date('2024-01-14'),
    progress: 7,
    target: 7,
    category: 'streak',
  },
  {
    id: 'streak-14',
    name: 'Fortnight Fighter',
    description: 'Cook at home for 14 consecutive days',
    icon: '🏆',
    unlocked: false,
    progress: 7,
    target: 14,
    category: 'streak',
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Cook at home for 30 consecutive days',
    icon: '👑',
    unlocked: false,
    progress: 7,
    target: 30,
    category: 'streak',
  },

  // Savings Achievements
  {
    id: 'save-500',
    name: 'First Savings',
    description: 'Save ₹500 by cooking at home',
    icon: '💰',
    unlocked: true,
    unlockedAt: new Date('2024-01-08'),
    progress: 500,
    target: 500,
    category: 'savings',
  },
  {
    id: 'save-1000',
    name: 'Smart Saver',
    description: 'Save ₹1000 by cooking at home',
    icon: '💵',
    unlocked: true,
    unlockedAt: new Date('2024-01-12'),
    progress: 1000,
    target: 1000,
    category: 'savings',
  },
  {
    id: 'save-2500',
    name: 'Money Master',
    description: 'Save ₹2500 by cooking at home',
    icon: '🤑',
    unlocked: false,
    progress: 2450,
    target: 2500,
    category: 'savings',
  },
  {
    id: 'save-5000',
    name: 'Budget King',
    description: 'Save ₹5000 by cooking at home',
    icon: '💎',
    unlocked: false,
    progress: 2450,
    target: 5000,
    category: 'savings',
  },

  // Cooking Achievements
  {
    id: 'recipes-5',
    name: 'Adventurous Chef',
    description: 'Try 5 different recipes',
    icon: '🍳',
    unlocked: true,
    unlockedAt: new Date('2024-01-11'),
    progress: 5,
    target: 5,
    category: 'cooking',
  },
  {
    id: 'recipes-10',
    name: 'Culinary Explorer',
    description: 'Try 10 different recipes',
    icon: '👨‍🍳',
    unlocked: false,
    progress: 8,
    target: 10,
    category: 'cooking',
  },
  {
    id: 'cuisines-3',
    name: 'Culture Curator',
    description: 'Cook from 3 different cuisines',
    icon: '🌍',
    unlocked: true,
    unlockedAt: new Date('2024-01-13'),
    progress: 3,
    target: 3,
    category: 'cooking',
  },
  {
    id: 'quick-meals',
    name: 'Speed Chef',
    description: 'Cook 5 meals under 20 minutes',
    icon: '⚡',
    unlocked: false,
    progress: 3,
    target: 5,
    category: 'cooking',
  },

  // Health Achievements
  {
    id: 'nutrition-week',
    name: 'Perfect Nutrition Week',
    description: 'Maintain balanced nutrition for 7 days',
    icon: '🥗',
    unlocked: false,
    progress: 5,
    target: 7,
    category: 'health',
  },
  {
    id: 'protein-goal',
    name: 'Protein Champion',
    description: 'Hit protein goals for 5 consecutive days',
    icon: '💪',
    unlocked: true,
    unlockedAt: new Date('2024-01-09'),
    progress: 5,
    target: 5,
    category: 'health',
  },
  {
    id: 'health-score-80',
    name: 'Health Hero',
    description: 'Achieve a health score of 80+',
    icon: '❤️',
    unlocked: false,
    progress: 78,
    target: 80,
    category: 'health',
  },
  {
    id: 'veggies-lover',
    name: 'Veggie Lover',
    description: 'Eat vegetables in every meal for 5 days',
    icon: '🥬',
    unlocked: true,
    unlockedAt: new Date('2024-01-07'),
    progress: 5,
    target: 5,
    category: 'health',
  },
];

// Mock Leaderboard Data
export const mockLeaderboard = [
  { rank: 1, name: 'Priya S.', city: 'Mumbai', streak: 28, saved: 8500, avatar: '👩‍🍳' },
  { rank: 2, name: 'Rahul M.', city: 'Mumbai', streak: 24, saved: 7200, avatar: '👨‍🍳' },
  { rank: 3, name: 'Anita K.', city: 'Mumbai', streak: 21, saved: 6800, avatar: '🧑‍🍳' },
  { rank: 4, name: 'You', city: 'Mumbai', streak: 7, saved: 2450, avatar: '🙋', isUser: true },
  { rank: 5, name: 'Vikram J.', city: 'Mumbai', streak: 5, saved: 1800, avatar: '👨‍🍳' },
  { rank: 6, name: 'Sneha P.', city: 'Mumbai', streak: 3, saved: 950, avatar: '👩‍🍳' },
];

export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return mockAchievements.filter(a => a.category === category);
};

export const getUnlockedAchievements = (): Achievement[] => {
  return mockAchievements.filter(a => a.unlocked);
};

export const getInProgressAchievements = (): Achievement[] => {
  return mockAchievements.filter(a => !a.unlocked && a.progress > 0);
};

export const getNextAchievement = (): Achievement | undefined => {
  const inProgress = getInProgressAchievements();
  return inProgress.sort((a, b) => (b.progress / b.target) - (a.progress / a.target))[0];
};
