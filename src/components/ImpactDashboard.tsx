// Impact Dashboard Component

'use client';

import { motion } from 'framer-motion';
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Leaf,
  Flame,
  Target,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils';
import { mockImpactMetrics, weeklySpendingData } from '@/data/mockUserData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'green' | 'orange' | 'blue' | 'red';
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}

function MetricCard({ title, value, subtitle, icon, color, trend, delay = 0 }: MetricCardProps) {
  const colorClasses = {
    green: 'from-green-500 to-emerald-600',
    orange: 'from-orange-500 to-amber-600',
    blue: 'from-blue-500 to-indigo-600',
    red: 'from-red-500 to-rose-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="relative overflow-hidden">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClasses[color]}`} />
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
              <motion.p
                className="text-3xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
              >
                {value}
              </motion.p>
              {subtitle && (
                <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white`}>
              {icon}
            </div>
          </div>
          
          {trend && (
            <div className="mt-3 flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.value}%
              </span>
              <span className="text-xs text-gray-400">vs last week</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ImpactDashboard() {
  const metrics = mockImpactMetrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Impact Dashboard</h2>
          <p className="text-gray-500">Track your health, savings, and environmental impact</p>
        </div>
        <Badge variant="success" className="text-sm">
          <Calendar className="w-4 h-4 mr-1" />
          This Week
        </Badge>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Health Score"
          value={metrics.healthScore}
          subtitle="Based on nutrition & activity"
          icon={<Heart className="w-6 h-6" />}
          color="green"
          trend={{ value: 5, isPositive: true }}
          delay={0}
        />
        <MetricCard
          title="Money Saved"
          value={formatCurrency(metrics.moneySaved)}
          subtitle={`vs $${metrics.typicalSpending} typical spending`}
          icon={<DollarSign className="w-6 h-6" />}
          color="orange"
          trend={{ value: 12, isPositive: true }}
          delay={0.1}
        />
        <MetricCard
          title="Meals Cooked"
          value={metrics.mealsCooked}
          subtitle="This month"
          icon={<Flame className="w-6 h-6" />}
          color="blue"
          trend={{ value: 8, isPositive: true }}
          delay={0.2}
        />
        <MetricCard
          title="CO₂ Saved"
          value={`${metrics.co2Saved.toFixed(1)} kg`}
          subtitle="By cooking at home"
          icon={<Leaf className="w-6 h-6" />}
          color="green"
          trend={{ value: 15, isPositive: true }}
          delay={0.3}
        />
      </div>

      {/* Health Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Health Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Nutrition Balance</span>
                <span className="text-sm text-gray-500">{metrics.avgNutritionBalance}%</span>
              </div>
              <Progress value={metrics.avgNutritionBalance} />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Cooking Streak</span>
                <span className="text-sm text-gray-500">{metrics.currentStreak} days</span>
              </div>
              <Progress 
                value={(metrics.currentStreak / 30) * 100} 
                indicatorColor="bg-gradient-to-r from-orange-500 to-amber-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Calories Tracked</span>
                <span className="text-sm text-gray-500">{metrics.totalCaloriesTracked.toLocaleString()} cal</span>
              </div>
              <Progress 
                value={75} 
                indicatorColor="bg-gradient-to-r from-blue-500 to-indigo-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spending Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-orange-500" />
            Weekly Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySpendingData}>
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" stroke="#a3a3a3" fontSize={12} />
                <YAxis stroke="#a3a3a3" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="spending" 
                  stroke="#22c55e" 
                  fillOpacity={1} 
                  fill="url(#colorSpending)" 
                  strokeWidth={2}
                  name="Spending"
                />
                <Area 
                  type="monotone" 
                  dataKey="saved" 
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#colorSaved)" 
                  strokeWidth={2}
                  name="Saved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">Spending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-gray-600">Saved</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                Environmental Impact
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                By cooking at home, you&apos;ve saved the equivalent of{' '}
                <strong>{(metrics.co2Saved * 2).toFixed(0)} km</strong> of car travel!
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{metrics.co2Saved.toFixed(1)}</p>
              <p className="text-xs text-green-500">kg CO₂ Saved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{(metrics.mealsCooked * 0.3).toFixed(1)}</p>
              <p className="text-xs text-green-500">L Water Saved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{metrics.mealsCooked}</p>
              <p className="text-xs text-green-500">Plastic Avoided</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ImpactDashboard;
