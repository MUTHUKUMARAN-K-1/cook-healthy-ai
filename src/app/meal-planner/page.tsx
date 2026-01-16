// Premium Meal Planner Page - Full AI Features with Budget-First Planning

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Sparkles, ArrowRight, Globe, Loader2, Check, X, ShoppingCart, ChefHat, Lightbulb, DollarSign, Users, Leaf, TrendingDown, Recycle, Flame, Plus } from 'lucide-react';
import { generateMealPlan } from '@/lib/gemini/mealPlanGenerator';
import { isGeminiAvailable } from '@/lib/gemini/client';
import Link from 'next/link';

const dietTypes = ['Balanced', 'Vegetarian', 'Vegan', 'High Protein', 'Low Carb', 'Keto', 'Mediterranean'];
const cuisineOptions = ['Any', 'American', 'Italian', 'Indian', 'Asian', 'Mexican', 'Mediterranean'];
const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
const equipmentOptions = ['Stove', 'Oven', 'Microwave', 'Blender', 'Air Fryer', 'Slow Cooker', 'Instant Pot'];

interface MealPlanResult {
  planName: string;
  days: any[];
  totalCost: number;
  totalCalories: number;
  shoppingList: string[];
  tips: string[];
  nutritionHighlights: string[];
  wasteReduction: string[];
}

export default function MealPlannerPage() {
  // Form state
  const [budget, setBudget] = useState(100);
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [dietType, setDietType] = useState('Balanced');
  const [cuisines, setCuisines] = useState<string[]>(['Any']);
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [equipment, setEquipment] = useState<string[]>(['Stove', 'Microwave']);
  const [availableIngredients, setAvailableIngredients] = useState('');
  const [expiringIngredients, setExpiringIngredients] = useState('');
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [generatedPlans, setGeneratedPlans] = useState<MealPlanResult[]>([]);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [activeTab, setActiveTab] = useState<'plan' | 'shopping' | 'tips' | 'nutrition'>('plan');
  const [budgetSummary, setBudgetSummary] = useState<{totalBudget: number; estimatedSpend: number; savings: number} | null>(null);

  const toggleEquipment = (item: string) => {
    setEquipment(prev => 
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    );
  };

  const toggleCuisine = (item: string) => {
    if (item === 'Any') {
      setCuisines(['Any']);
    } else {
      const filtered = cuisines.filter(c => c !== 'Any');
      if (filtered.includes(item)) {
        setCuisines(filtered.filter(c => c !== item));
      } else {
        setCuisines([...filtered, item]);
      }
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setShowPlans(false);

    try {
      const result = await generateMealPlan({
        budget,
        currency: '$',
        days: 7,
        numberOfPeople,
        mealsPerDay,
        dietType,
        cuisinePreferences: cuisines,
        healthGoals: ['Balanced Nutrition', 'Budget Friendly'],
        skillLevel,
        equipment,
        availableIngredients: availableIngredients.split(',').map(s => s.trim()).filter(Boolean),
        expiringIngredients: expiringIngredients.split(',').map(s => s.trim()).filter(Boolean),
      });

      if (result && result.plans) {
        setGeneratedPlans(result.plans);
        setBudgetSummary(result.budgetSummary);
        setShowPlans(true);
        setSelectedPlan(0);
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentPlan = generatedPlans[selectedPlan];

  return (
    <div className="page-container safe-bottom">
      {/* Header */}
      <header className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-title"
        >
          <span className="text-gradient-green">AI Meal</span> Planner
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="page-subtitle"
        >
          Budget-first meal planning • Powered by {isGeminiAvailable() ? 'Gemini AI' : 'Smart Algorithms'}
        </motion.p>
      </header>

      <AnimatePresence mode="wait">
        {!showPlans ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Budget & People */}
            <section className="section">
              <div className="premium-card p-4">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" /> Budget & Household
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-[var(--text-muted)] block mb-1">Weekly Budget</label>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold">$</span>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="input text-lg font-bold"
                        min={20}
                        max={500}
                        step={10}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-muted)] block mb-1">People</label>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                        className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center"
                      >-</button>
                      <span className="text-lg font-bold w-8 text-center">{numberOfPeople}</span>
                      <button 
                        onClick={() => setNumberOfPeople(Math.min(10, numberOfPeople + 1))}
                        className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center"
                      >+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-muted)] block mb-1">Meals/Day</label>
                    <div className="flex gap-1">
                      {[2, 3, 4].map(n => (
                        <button
                          key={n}
                          onClick={() => setMealsPerDay(n)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                            mealsPerDay === n ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)]'
                          }`}
                        >{n}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-3 text-center">
                  ≈ ${(budget / (numberOfPeople * mealsPerDay * 7)).toFixed(2)} per meal per person
                </p>
              </div>
            </section>

            {/* Diet & Skill */}
            <section className="section">
              <div className="premium-card p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-500" /> Diet & Skill Level
                </h3>
                <div className="mb-3">
                  <label className="text-xs text-[var(--text-muted)] block mb-2">Diet Type</label>
                  <div className="flex flex-wrap gap-2">
                    {dietTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setDietType(type)}
                        className={`chip ${dietType === type ? 'active' : ''}`}
                      >{type}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)] block mb-2">Skill Level</label>
                  <div className="flex gap-2">
                    {skillLevels.map(level => (
                      <button
                        key={level}
                        onClick={() => setSkillLevel(level)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                          skillLevel === level ? 'bg-[var(--secondary)] text-white' : 'bg-[var(--surface)]'
                        }`}
                      >
                        {level === 'Beginner' ? '👶' : level === 'Intermediate' ? '👨‍🍳' : '👑'} {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Cuisines */}
            <section className="section">
              <div className="premium-card p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" /> Preferred Cuisines
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cuisineOptions.map(cuisine => (
                    <button
                      key={cuisine}
                      onClick={() => toggleCuisine(cuisine)}
                      className={`chip ${cuisines.includes(cuisine) ? 'active' : ''}`}
                    >{cuisine}</button>
                  ))}
                </div>
              </div>
            </section>

            {/* Equipment */}
            <section className="section">
              <div className="premium-card p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-orange-500" /> Available Equipment
                </h3>
                <div className="flex flex-wrap gap-2">
                  {equipmentOptions.map(item => (
                    <button
                      key={item}
                      onClick={() => toggleEquipment(item)}
                      className={`chip ${equipment.includes(item) ? 'active' : ''}`}
                    >{item}</button>
                  ))}
                </div>
              </div>
            </section>

            {/* Available Ingredients */}
            <section className="section">
              <div className="premium-card p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-green-500" /> Use What You Have (Optional)
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[var(--text-muted)] block mb-1">Available ingredients (comma-separated)</label>
                    <input
                      type="text"
                      value={availableIngredients}
                      onChange={(e) => setAvailableIngredients(e.target.value)}
                      placeholder="e.g., rice, chicken, onions, tomatoes"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-muted)] block mb-1">Expiring soon - use first (comma-separated)</label>
                    <input
                      type="text"
                      value={expiringIngredients}
                      onChange={(e) => setExpiringIngredients(e.target.value)}
                      placeholder="e.g., spinach, milk, bread"
                      className="input"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Generate Button */}
            <section className="section">
              <motion.button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                className="w-full btn-primary py-4 text-base disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI is creating your meal plans...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate AI Meal Plans
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="plans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Budget Summary */}
            {budgetSummary && (
              <section className="section">
                <div className="premium-card p-4" style={{ background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)' }}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="w-8 h-8" />
                      <div>
                        <p className="text-white/80 text-sm">Potential savings</p>
                        <p className="text-2xl font-bold">${budgetSummary.savings.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-white/80">Budget: <strong>${budgetSummary.totalBudget}</strong></p>
                      <p className="text-white/80">Estimated: <strong>${budgetSummary.estimatedSpend.toFixed(2)}</strong></p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Plan Selector */}
            <section className="section">
              <div className="flex gap-2 mb-4">
                {generatedPlans.map((plan, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPlan(i)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedPlan === i 
                        ? 'bg-[var(--primary)] text-white shadow-lg' 
                        : 'bg-[var(--surface)] text-[var(--text-muted)]'
                    }`}
                  >
                    {plan.planName}
                  </button>
                ))}
              </div>

              {currentPlan && (
                <div className="premium-card overflow-hidden">
                  {/* Tabs */}
                  <div className="flex border-b border-[var(--border)]">
                    {[
                      { id: 'plan', label: 'Weekly Plan', icon: Calendar },
                      { id: 'shopping', label: 'Shopping', icon: ShoppingCart },
                      { id: 'nutrition', label: 'Nutrition', icon: Flame },
                      { id: 'tips', label: 'Tips', icon: Lightbulb },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
                          activeTab === tab.id 
                            ? 'bg-[var(--surface)] text-[var(--primary)] border-b-2 border-[var(--primary)]' 
                            : 'text-[var(--text-muted)]'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-4 max-h-[400px] overflow-y-auto">
                    {activeTab === 'plan' && (
                      <div className="space-y-3">
                        {currentPlan.days.map((day: any, i: number) => (
                          <motion.div
                            key={day.day}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-3 bg-[var(--surface)] rounded-xl"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold">{day.day}</p>
                              <span className="text-xs text-[var(--text-muted)]">{day.totalCalories} cal • ${day.totalCost.toFixed(2)}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="w-6">🌅</span>
                                <span className="flex-1">{day.breakfast.name}</span>
                                <span className="text-[var(--text-muted)] text-xs">${day.breakfast.cost}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="w-6">☀️</span>
                                <span className="flex-1">{day.lunch.name}</span>
                                <span className="text-[var(--text-muted)] text-xs">${day.lunch.cost}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="w-6">🌙</span>
                                <span className="flex-1">{day.dinner.name}</span>
                                <span className="text-[var(--text-muted)] text-xs">${day.dinner.cost}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'shopping' && (
                      <div className="space-y-2">
                        {currentPlan.shoppingList.map((item: string, i: number) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="flex items-center gap-3 p-2"
                          >
                            <div className="w-5 h-5 rounded border-2 border-[var(--border)] flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'nutrition' && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-500" /> Nutrition Highlights
                          </h4>
                          <div className="space-y-2">
                            {currentPlan.nutritionHighlights.map((item: string, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <Check className="w-4 h-4 text-green-500" />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Recycle className="w-4 h-4 text-green-500" /> Waste Reduction
                          </h4>
                          <div className="space-y-2">
                            {currentPlan.wasteReduction.map((item: string, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <Check className="w-4 h-4 text-green-500" />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'tips' && (
                      <div className="space-y-3">
                        {currentPlan.tips.map((tip: string, i: number) => (
                          <motion.div
                            key={tip}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-[var(--surface)] rounded-xl"
                          >
                            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />
                            <p className="text-sm">{tip}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stats Footer */}
                  <div className="flex p-3 bg-[var(--surface)] border-t border-[var(--border)]">
                    <div className="flex-1 text-center">
                      <p className="text-lg font-bold text-[var(--secondary)]">${currentPlan.totalCost}</p>
                      <p className="text-xs text-[var(--text-muted)]">Total Cost</p>
                    </div>
                    <div className="flex-1 text-center border-l border-[var(--border)]">
                      <p className="text-lg font-bold text-[var(--primary)]">{currentPlan.totalCalories.toLocaleString()}</p>
                      <p className="text-xs text-[var(--text-muted)]">Total Cal</p>
                    </div>
                    <div className="flex-1 text-center border-l border-[var(--border)]">
                      <p className="text-lg font-bold text-purple-500">{currentPlan.days.length * 3}</p>
                      <p className="text-xs text-[var(--text-muted)]">Meals</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Actions */}
            <section className="section flex gap-3">
              <button 
                onClick={() => setShowPlans(false)} 
                className="flex-1 btn-secondary py-3"
              >
                ← Modify Plan
              </button>
              <button className="flex-1 btn-primary py-3">
                <ChefHat className="w-5 h-5" /> Start Cooking
              </button>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
