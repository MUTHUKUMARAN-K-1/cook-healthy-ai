// Premium Health Programs Page - Fully Functional

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Check, ArrowRight, TrendingUp, AlertCircle, ChevronRight, X } from 'lucide-react';

const healthPrograms = [
  { 
    id: 'diabetes', 
    name: 'Diabetes Management', 
    icon: '🩸', 
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
    description: 'Low glycemic recipes with balanced carbs for blood sugar control',
    enrolled: 2450,
    features: ['Blood sugar friendly', 'Fiber-rich meals', 'Portion control tips'],
    weeklyPlan: ['Oatmeal with berries', 'Grilled chicken salad', 'Salmon with quinoa'],
  },
  { 
    id: 'heart', 
    name: 'Heart Health', 
    icon: '❤️', 
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
    description: 'Low sodium, heart-healthy recipes rich in omega-3s',
    enrolled: 1890,
    features: ['Low cholesterol', 'Omega-3 rich', 'Low sodium options'],
    weeklyPlan: ['Avocado toast', 'Mediterranean bowl', 'Grilled fish'],
  },
  { 
    id: 'weight', 
    name: 'Weight Loss', 
    icon: '⚖️', 
    gradient: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
    description: 'Calorie-controlled, satisfying meals for sustainable weight loss',
    enrolled: 5600,
    features: ['High protein', 'Low calorie', 'Filling meals'],
    weeklyPlan: ['Protein smoothie', 'Buddha bowl', 'Lean turkey stir-fry'],
  },
  { 
    id: 'energy', 
    name: 'Energy Boost', 
    icon: '⚡', 
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    description: 'Energizing meals for active lifestyles and peak performance',
    enrolled: 1200,
    features: ['Complex carbs', 'Iron-rich foods', 'B-vitamin sources'],
    weeklyPlan: ['Banana oat pancakes', 'Quinoa power bowl', 'Chicken stir-fry'],
  },
  { 
    id: 'gut', 
    name: 'Gut Health', 
    icon: '🦠', 
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    description: 'Probiotic-rich recipes for digestive wellness',
    enrolled: 980,
    features: ['Probiotic foods', 'High fiber', 'Anti-bloating'],
    weeklyPlan: ['Greek yogurt parfait', 'Fermented veggie bowl', 'Fiber-rich soup'],
  },
  { 
    id: 'muscle', 
    name: 'Muscle Building', 
    icon: '💪', 
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    description: 'High-protein meals optimized for muscle growth and recovery',
    enrolled: 2100,
    features: ['40g+ protein/meal', 'Post-workout friendly', 'Muscle recovery'],
    weeklyPlan: ['Egg white omelette', 'Grilled chicken breast', 'Salmon with rice'],
  },
];

const micronutrients = [
  { name: 'Iron', current: 65, target: 100, status: 'low', emoji: '🔴' },
  { name: 'Vitamin B12', current: 45, target: 100, status: 'deficient', emoji: '🟠' },
  { name: 'Calcium', current: 80, target: 100, status: 'good', emoji: '🟢' },
  { name: 'Vitamin D', current: 55, target: 100, status: 'low', emoji: '🟡' },
  { name: 'Zinc', current: 90, target: 100, status: 'good', emoji: '🟢' },
  { name: 'Omega-3', current: 40, target: 100, status: 'deficient', emoji: '🟠' },
];

const weeklyHighlights = [
  { label: 'Calories tracked', value: '12,450 kcal', trend: 'stable' },
  { label: 'Protein intake', value: '420g', trend: 'up' },
  { label: 'Fiber intake', value: '168g', trend: 'up' },
  { label: 'Sugar reduced', value: '-35%', trend: 'down' },
];

export default function HealthProgramsPage() {
  const [activeTab, setActiveTab] = useState('programs');
  const [enrolledPrograms, setEnrolledPrograms] = useState<string[]>(['weight']);
  const [selectedProgram, setSelectedProgram] = useState<typeof healthPrograms[0] | null>(null);

  const handleEnroll = (programId: string) => {
    if (enrolledPrograms.includes(programId)) {
      setEnrolledPrograms(enrolledPrograms.filter(id => id !== programId));
    } else {
      setEnrolledPrograms([...enrolledPrograms, programId]);
    }
  };

  const isEnrolled = (programId: string) => enrolledPrograms.includes(programId);

  return (
    <div className="page-container safe-bottom">
      {/* Header */}
      <header className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-title"
        >
          <span className="text-gradient-red">Health</span> Programs
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="page-subtitle"
        >
          Personalized nutrition for your wellness goals
        </motion.p>
      </header>

      {/* Tabs */}
      <section className="section">
        <div className="flex gap-2 bg-[var(--surface)] p-1 rounded-2xl">
          {[
            { id: 'programs', label: 'Programs', icon: '💊' },
            { id: 'nutrition', label: 'Nutrition', icon: '📊' },
            { id: 'report', label: 'Report', icon: '📋' },
          ].map((tab) => (
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
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <motion.section
            key="programs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="section"
          >
            {/* Enrolled Count */}
            {enrolledPrograms.length > 0 && (
              <div className="mb-4 p-3 bg-[var(--secondary)]/10 rounded-xl flex items-center gap-2">
                <Check className="w-5 h-5 text-[var(--secondary)]" />
                <span className="text-sm">You're enrolled in <strong>{enrolledPrograms.length}</strong> program(s)</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {healthPrograms.map((program, i) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedProgram(program)}
                  className={`premium-card p-4 cursor-pointer ${isEnrolled(program.id) ? 'ring-2 ring-[var(--secondary)]' : ''}`}
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-lg"
                    style={{ background: program.gradient }}
                  >
                    {program.icon}
                  </div>
                  <h3 className="font-bold text-sm mb-1">{program.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">{program.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-[var(--secondary)] font-medium">
                      {program.enrolled.toLocaleString()} enrolled
                    </p>
                    {isEnrolled(program.id) && (
                      <Check className="w-4 h-4 text-[var(--secondary)]" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Nutrition Tab */}
        {activeTab === 'nutrition' && (
          <motion.section
            key="nutrition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="section space-y-3"
          >
            <div className="premium-card p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--primary)]" />
                Micronutrient Tracking
              </h3>
              <div className="space-y-4">
                {micronutrients.map((nutrient) => (
                  <div key={nutrient.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span>{nutrient.emoji}</span>
                        {nutrient.name}
                      </span>
                      <span className={`text-xs font-semibold ${
                        nutrient.status === 'good' ? 'text-[var(--secondary)]' :
                        nutrient.status === 'low' ? 'text-amber-500' : 'text-[var(--primary)]'
                      }`}>
                        {nutrient.current}%
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${nutrient.current}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`h-full rounded-full ${
                          nutrient.status === 'good' ? 'bg-[var(--secondary)]' :
                          nutrient.status === 'low' ? 'bg-amber-500' : 'bg-[var(--primary)]'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="premium-card p-4 border-l-4 border-amber-500">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Vitamin B12 & Omega-3 Low</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Consider adding salmon, eggs, or fortified foods to your diet.
                  </p>
                  <button className="text-xs text-[var(--primary)] font-medium mt-2">
                    View recommended recipes →
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Report Tab */}
        {activeTab === 'report' && (
          <motion.section
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="section space-y-3"
          >
            <div className="premium-card p-6 text-center">
              <h3 className="text-sm text-[var(--text-muted)] mb-2">Weekly Health Score</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="var(--surface)" strokeWidth="12" fill="none" />
                  <motion.circle 
                    cx="64" cy="64" r="56" 
                    stroke="url(#gradient)" 
                    strokeWidth="12" 
                    fill="none"
                    initial={{ strokeDasharray: '0 352' }}
                    animate={{ strokeDasharray: '274 352' }}
                    transition={{ duration: 1, delay: 0.2 }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#4ADE80" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">78</span>
                </div>
              </div>
              <p className="text-sm text-[var(--secondary)] font-medium">Great progress! 🎉</p>
            </div>

            <div className="premium-card p-4">
              <h3 className="font-bold mb-3">This Week's Highlights</h3>
              <div className="space-y-3">
                {weeklyHighlights.map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-[var(--border-light)] last:border-0">
                    <span className="text-sm text-[var(--text-muted)]">{item.label}</span>
                    <span className={`text-sm font-bold ${
                      item.trend === 'up' ? 'text-[var(--secondary)]' :
                      item.trend === 'down' ? 'text-[var(--primary)]' : ''
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Program Detail Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[var(--surface-elevated)] rounded-3xl overflow-hidden"
            >
              <div className="h-24 flex items-center justify-center text-5xl" style={{ background: selectedProgram.gradient }}>
                {selectedProgram.icon}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{selectedProgram.name}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">{selectedProgram.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Features:</h4>
                  <div className="space-y-2">
                    {selectedProgram.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-[var(--secondary)]" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Sample Meals:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedProgram.weeklyPlan.map((meal) => (
                      <span key={meal} className="chip text-xs">{meal}</span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    handleEnroll(selectedProgram.id);
                    setSelectedProgram(null);
                  }}
                  className={`w-full py-3 rounded-xl font-semibold ${
                    isEnrolled(selectedProgram.id) 
                      ? 'bg-[var(--surface)] text-[var(--text-muted)]' 
                      : 'btn-primary'
                  }`}
                >
                  {isEnrolled(selectedProgram.id) ? 'Leave Program' : 'Join Program'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
