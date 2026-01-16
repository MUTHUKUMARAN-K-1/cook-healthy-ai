// Achievement Badges and Streak Tracker Component

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Lock, Check, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Achievement } from '@/types';
import { mockAchievements, mockLeaderboard, getInProgressAchievements } from '@/data/mockAchievements';
import { mockImpactMetrics } from '@/data/mockUserData';

// Confetti component for unlocking achievements
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#22c55e', '#f97316', '#3b82f6', '#ec4899', '#8b5cf6'][i % 5],
          }}
          initial={{ top: '-10%', rotate: 0, opacity: 1 }}
          animate={{
            top: '110%',
            rotate: Math.random() * 720 - 360,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// Streak Tracker Component
export function StreakTracker() {
  const [showConfetti, setShowConfetti] = useState(false);
  const { currentStreak, longestStreak } = mockImpactMetrics;
  const [markedToday, setMarkedToday] = useState(false);

  const handleMarkMeal = () => {
    setMarkedToday(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <>
      {showConfetti && <Confetti />}
      
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Flame className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400">Current Streak</p>
                <p className="text-4xl font-bold text-orange-700 dark:text-orange-300">{currentStreak}</p>
                <p className="text-xs text-orange-500">days cooking at home</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Longest Streak</p>
              <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{longestStreak} days</p>
            </div>
          </div>

          {/* Week View */}
          <div className="flex justify-between mb-4">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
              const isCurrent = i === new Date().getDay() - 1 || (new Date().getDay() === 0 && i === 6);
              const isCompleted = i < (currentStreak % 7);
              return (
                <motion.div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : day}
                </motion.div>
              );
            })}
          </div>

          <Button
            onClick={handleMarkMeal}
            disabled={markedToday}
            className="w-full"
            variant={markedToday ? 'secondary' : 'default'}
          >
            {markedToday ? (
              <span className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                Meal Marked for Today!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Mark Today&apos;s Meal as Cooked
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

// Achievement Badge Component
interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="relative"
    >
      <div
        className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center ${
          achievement.unlocked
            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        {achievement.unlocked ? (
          <span className={sizeClasses[size].split(' ')[2]}>{achievement.icon}</span>
        ) : (
          <Lock className="w-6 h-6 text-gray-400" />
        )}
      </div>
      {!achievement.unlocked && achievement.progress > 0 && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4">
          <Progress value={(achievement.progress / achievement.target) * 100} />
        </div>
      )}
    </motion.div>
  );
}

// Achievement List Component
export function AchievementList() {
  const categories = [
    { id: 'streak', label: '🔥 Streak', color: 'orange' },
    { id: 'savings', label: '💰 Savings', color: 'green' },
    { id: 'cooking', label: '👨‍🍳 Cooking', color: 'blue' },
    { id: 'health', label: '❤️ Health', color: 'red' },
  ];

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryAchievements = mockAchievements.filter(a => a.category === category.id);
        
        return (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-lg">{category.label} Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categoryAchievements.map(achievement => (
                  <motion.div
                    key={achievement.id}
                    className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                    whileHover={{ y: -4 }}
                  >
                    <AchievementBadge achievement={achievement} />
                    <p className="text-sm font-medium mt-2">{achievement.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                    {!achievement.unlocked && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {achievement.progress}/{achievement.target}
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Leaderboard Component
export function Leaderboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          City Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockLeaderboard.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                entry.isUser
                  ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                  : 'bg-gray-50 dark:bg-gray-800/50'
              }`}
            >
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center font-bold">
                {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
              </span>
              <span className="text-2xl">{entry.avatar}</span>
              <div className="flex-1">
                <p className="font-medium">{entry.name}</p>
                <p className="text-xs text-gray-500">{entry.city}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-500">{entry.streak} 🔥</p>
                <p className="text-xs text-green-500">₹{entry.saved} saved</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default AchievementList;
