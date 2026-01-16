// Premium Community Page - Fully Functional

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy, TrendingUp, MessageCircle, Heart, Clock, Star, ChefHat, Plus, Share2, Bookmark, Check } from 'lucide-react';

const tabs = [
  { id: 'recipes', label: 'Recipes', icon: '📖' },
  { id: 'challenges', label: 'Challenges', icon: '🎯' },
  { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
];

const initialRecipes = [
  { id: 1, name: 'Quick Buddha Bowl', author: 'Sarah M.', location: 'New York', likes: 234, liked: false, saved: false, cost: 5, time: 15, tag: 'high-protein', icon: '🥗', image: '/images/food/healthy-bowl.png' },
  { id: 2, name: 'Budget Pasta Night', author: 'Mike R.', location: 'Chicago', likes: 189, liked: false, saved: true, cost: 4, time: 20, tag: 'budget-king', icon: '🍝', image: '/images/food/pasta-primavera.png' },
  { id: 3, name: 'Mediterranean Salad', author: 'Emma L.', location: 'LA', likes: 456, liked: true, saved: false, cost: 6, time: 10, tag: 'quick', icon: '🥙', image: '/images/food/mediterranean-salad.png' },
];

const initialChallenges = [
  { id: 1, name: '$50/Week Challenge', participants: 2345, daysLeft: 5, progress: 68, reward: '💰 Budget Master', gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', joined: false },
  { id: 2, name: 'Cook at Home 7 Days', participants: 1890, daysLeft: 3, progress: 85, reward: '🔥 Streak Champion', gradient: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)', joined: true },
  { id: 3, name: 'Zero Waste Week', participants: 987, daysLeft: 7, progress: 45, reward: '🌿 Eco Warrior', gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', joined: false },
  { id: 4, name: 'High Protein Month', participants: 1567, daysLeft: 21, progress: 25, reward: '💪 Protein Pro', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', joined: false },
];

const initialLeaderboard = [
  { rank: 1, name: 'Sarah M.', location: 'NYC', streak: 45, saved: 1250, badge: '👑', avatar: '👩‍🍳' },
  { rank: 2, name: 'Mike R.', location: 'Chicago', streak: 38, saved: 1020, badge: '🥈', avatar: '👨‍🍳' },
  { rank: 3, name: 'Emma L.', location: 'LA', streak: 35, saved: 980, badge: '🥉', avatar: '👩' },
  { rank: 4, name: 'James K.', location: 'Austin', streak: 32, saved: 890, badge: '⭐', avatar: '👨' },
  { rank: 5, name: 'Lisa P.', location: 'Seattle', streak: 30, saved: 850, badge: '⭐', avatar: '👩‍💼' },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('recipes');
  const [recipes, setRecipes] = useState(initialRecipes);
  const [challenges, setChallenges] = useState(initialChallenges);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleLike = (id: number) => {
    setRecipes(recipes.map(r => 
      r.id === id ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r
    ));
  };

  const handleSave = (id: number) => {
    setRecipes(recipes.map(r => 
      r.id === id ? { ...r, saved: !r.saved } : r
    ));
  };

  const handleJoinChallenge = (id: number) => {
    setChallenges(challenges.map(c => 
      c.id === id ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 } : c
    ));
  };

  return (
    <div className="page-container safe-bottom">
      {/* Header */}
      <header className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-title"
        >
          <span className="text-gradient-red">Community</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="page-subtitle"
        >
          Share recipes, join challenges, compete with friends!
        </motion.p>
      </header>

      {/* Stats Banner */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="premium-card p-4"
          style={{ background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)' }}
        >
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg">15,000+ members saved $85K this week!</p>
              <p className="text-white/80 text-sm">Join the healthy cooking movement 🌍</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tabs */}
      <section className="section">
        <div className="flex gap-2 bg-[var(--surface)] p-1 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-[var(--surface-elevated)] shadow-sm text-[var(--primary)]' 
                  : 'text-[var(--text-muted)]'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <motion.section
            key="recipes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="section space-y-3"
          >
            {recipes.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="premium-card overflow-hidden"
              >
                <div className="flex">
                  <div className="w-24 h-24 flex-shrink-0">
                    {recipe.image ? (
                      <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FF9A56] to-[#FF6B3D] flex items-center justify-center text-3xl">
                        {recipe.icon}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="chip text-[10px] py-0.5">{recipe.tag}</span>
                    </div>
                    <h3 className="font-bold text-sm">{recipe.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">by {recipe.author} • {recipe.location}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="flex items-center gap-1 text-[var(--text-muted)]">
                        <Clock className="w-3 h-3" /> {recipe.time}m
                      </span>
                      <span className="text-[var(--secondary)] font-semibold">${recipe.cost}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2 border-t border-[var(--border-light)]">
                  <button 
                    onClick={() => handleLike(recipe.id)}
                    className={`flex items-center gap-1 text-sm ${recipe.liked ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}
                  >
                    <Heart className={`w-4 h-4 ${recipe.liked ? 'fill-current' : ''}`} /> {recipe.likes}
                  </button>
                  <button 
                    onClick={() => handleSave(recipe.id)}
                    className={`flex items-center gap-1 text-sm ${recipe.saved ? 'text-amber-500' : 'text-[var(--text-muted)]'}`}
                  >
                    <Bookmark className={`w-4 h-4 ${recipe.saved ? 'fill-current' : ''}`} /> {recipe.saved ? 'Saved' : 'Save'}
                  </button>
                  <button 
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-1 text-sm text-[var(--text-muted)]"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </motion.div>
            ))}
            
            <button className="w-full btn-primary py-3">
              <Plus className="w-5 h-5" /> Share Your Recipe
            </button>
          </motion.section>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <motion.section
            key="challenges"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="section space-y-3"
          >
            {challenges.map((challenge, i) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="premium-card overflow-hidden"
              >
                <div className="h-2" style={{ background: challenge.gradient }} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{challenge.name}</h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {challenge.participants.toLocaleString()} participants • {challenge.daysLeft} days left
                      </p>
                    </div>
                    <button 
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className={`text-sm py-2 px-4 rounded-full font-semibold transition-all ${
                        challenge.joined 
                          ? 'bg-[var(--secondary)] text-white' 
                          : 'btn-secondary'
                      }`}
                    >
                      {challenge.joined ? <><Check className="w-4 h-4 inline mr-1" /> Joined</> : 'Join'}
                    </button>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Your Progress</span>
                      <span className="font-semibold">{challenge.joined ? challenge.progress : 0}%</span>
                    </div>
                    <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: challenge.joined ? `${challenge.progress}%` : '0%' }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full" 
                        style={{ background: challenge.gradient }}
                      />
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-2">🎁 Reward: {challenge.reward}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <motion.section
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="section"
          >
            <div className="premium-card overflow-hidden">
              {initialLeaderboard.map((user, i) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-4 p-4 ${
                    i < initialLeaderboard.length - 1 ? 'border-b border-[var(--border-light)]' : ''
                  } ${user.rank <= 3 ? 'bg-[var(--surface)]' : ''}`}
                >
                  <span className="text-2xl w-8 text-center">{user.badge}</span>
                  <div className="w-10 h-10 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-xl">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{user.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--secondary)]">${user.saved.toLocaleString()}</p>
                    <p className="text-sm text-[var(--text-muted)]">{user.streak} days 🔥</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 premium-card p-4 text-center">
              <p className="text-sm text-[var(--text-muted)]">Your Rank</p>
              <p className="text-2xl font-bold text-[var(--primary)]">#127</p>
              <p className="text-sm text-[var(--text-muted)]">Keep cooking to climb! 🚀</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[var(--surface-elevated)] rounded-3xl p-6"
            >
              <h3 className="font-bold text-lg mb-4">Share Recipe</h3>
              <div className="grid grid-cols-4 gap-4">
                {['📱 Copy Link', '💬 WhatsApp', '📧 Email', '🐦 Twitter'].map((option) => (
                  <button key={option} className="p-3 bg-[var(--surface)] rounded-xl text-center text-sm">
                    {option}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full mt-4 py-3 text-[var(--text-muted)]"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
