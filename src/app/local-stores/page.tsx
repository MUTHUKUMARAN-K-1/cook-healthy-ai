// Premium Local Stores Page - International Friendly

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Store, TrendingDown, Truck, Users, Clock, Leaf, ShoppingBag, ArrowRight, ChevronRight, Star, Phone, Plus, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const localStores = [
  { id: 1, name: 'Fresh Market', distance: '0.3 mi', rating: 4.5, specialty: 'Organic Produce', savings: '25%', icon: '🥬' },
  { id: 2, name: 'Farmers Co-op', distance: '0.5 mi', rating: 4.8, specialty: 'Local Dairy', savings: '30%', icon: '🥛' },
  { id: 3, name: 'Spice World', distance: '0.8 mi', rating: 4.3, specialty: 'International Spices', savings: '40%', icon: '🌶️' },
  { id: 4, name: 'Whole Foods Express', distance: '1.2 mi', rating: 4.6, specialty: 'Health Foods', savings: '20%', icon: '🌿' },
];

const priceComparisons = [
  { item: 'Chicken Breast (1 lb)', homeCook: 4.50, delivery: 12.00, savings: 7.50 },
  { item: 'Salmon Fillet (1 lb)', homeCook: 8.00, delivery: 18.00, savings: 10.00 },
  { item: 'Pasta Primavera', homeCook: 3.50, delivery: 14.00, savings: 10.50 },
  { item: 'Buddha Bowl', homeCook: 5.00, delivery: 16.00, savings: 11.00 },
];

const vegetablePrices = [
  { name: 'Tomatoes', price: 2.50, unit: 'lb', trend: 'down', change: -8 },
  { name: 'Onions', price: 1.20, unit: 'lb', trend: 'stable', change: 0 },
  { name: 'Spinach', price: 3.00, unit: 'bunch', trend: 'up', change: 5 },
  { name: 'Bell Peppers', price: 1.50, unit: 'each', trend: 'down', change: -12 },
  { name: 'Avocados', price: 1.75, unit: 'each', trend: 'down', change: -15 },
];

const bulkGroups = [
  { name: 'Downtown Co-op', members: 12, nextOrder: 'Tomorrow', savings: '35%' },
  { name: 'Healthy Living Group', members: 8, nextOrder: 'Saturday', savings: '28%' },
];

export default function LocalStoresPage() {
  const [activeTab, setActiveTab] = useState('stores');

  return (
    <div className="page-container safe-bottom">
      {/* Header */}
      <header className="page-header">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-title"
        >
          <span className="text-gradient-green">Local</span> Stores
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="page-subtitle"
        >
          Find fresh ingredients near you 📍
        </motion.p>
      </header>

      {/* Tabs */}
      <section className="section">
        <div className="flex gap-2 bg-[var(--surface)] p-1 rounded-2xl">
          {[
            { id: 'stores', label: 'Stores', icon: '🏪' },
            { id: 'prices', label: 'Prices', icon: '💲' },
            { id: 'bulk', label: 'Bulk Buy', icon: '📦' },
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

      {/* Stores Tab */}
      {activeTab === 'stores' && (
        <section className="section space-y-3">
          {localStores.map((store, i) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="premium-card p-4"
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[var(--surface)] flex items-center justify-center text-2xl">
                  {store.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{store.name}</h3>
                    <span className="rating-badge text-xs">{store.rating}★</span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">{store.specialty}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {store.distance}
                    </span>
                    <span className="text-[var(--secondary)] font-semibold">
                      Save {store.savings}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* Prices Tab */}
      {activeTab === 'prices' && (
        <section className="section space-y-4">
          {/* Comparison */}
          <div className="premium-card p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-[var(--secondary)]" />
              Home Cooking vs Delivery
            </h3>
            <div className="space-y-3">
              {priceComparisons.map((item, i) => (
                <div key={item.item} className="flex items-center justify-between py-2 border-b border-[var(--border-light)] last:border-0">
                  <span className="text-sm">{item.item}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[var(--secondary)] font-semibold">${item.homeCook.toFixed(2)}</span>
                    <span className="text-[var(--text-muted)] line-through">${item.delivery.toFixed(2)}</span>
                    <span className="text-[var(--primary)] font-bold">Save ${item.savings.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Prices */}
          <div className="premium-card p-4">
            <h3 className="font-bold mb-3">Today's Prices</h3>
            <div className="grid grid-cols-2 gap-2">
              {vegetablePrices.map((veg) => (
                <div key={veg.name} className="p-3 bg-[var(--surface)] rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{veg.name}</span>
                    <span className={`text-xs ${
                      veg.trend === 'down' ? 'text-[var(--secondary)]' : 
                      veg.trend === 'up' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'
                    }`}>
                      {veg.change > 0 ? '+' : ''}{veg.change}%
                    </span>
                  </div>
                  <p className="text-lg font-bold">${veg.price.toFixed(2)}<span className="text-xs text-[var(--text-muted)] font-normal">/{veg.unit}</span></p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bulk Tab */}
      {activeTab === 'bulk' && (
        <section className="section space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-4"
            style={{ background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)' }}
          >
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Join a Buying Group</h3>
                <p className="text-white/80 text-sm">Save up to 40% on bulk purchases</p>
              </div>
            </div>
          </motion.div>

          {bulkGroups.map((group, i) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="premium-card p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{group.name}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{group.members} members • Next order: {group.nextOrder}</p>
                </div>
                <div className="text-right">
                  <span className="text-[var(--secondary)] font-bold">{group.savings}</span>
                  <p className="text-xs text-[var(--text-muted)]">avg savings</p>
                </div>
              </div>
            </motion.div>
          ))}

          <button className="w-full btn-primary py-3">
            <Plus className="w-5 h-5" /> Create New Group
          </button>
        </section>
      )}
    </div>
  );
}
