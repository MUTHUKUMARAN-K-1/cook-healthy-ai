// Achievements Page

'use client';

import { StreakTracker, AchievementList, Leaderboard } from '@/components/Achievements';

export default function AchievementsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Achievements & Streaks</h1>
        <p className="text-gray-500">Track your cooking streaks, unlock badges, and compete with others!</p>
      </div>
      <StreakTracker />
      <Leaderboard />
      <AchievementList />
    </div>
  );
}
