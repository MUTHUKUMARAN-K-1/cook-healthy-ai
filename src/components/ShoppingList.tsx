// Shopping List Component - International Version

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Check, Plus, Trash2, Sparkles, 
  TrendingDown, Store, ChevronDown, ChevronUp 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingItem } from '@/types';
import { formatCurrency, generateId } from '@/utils';

// International shopping list data (USD)
const initialShoppingList: ShoppingItem[] = [
  { id: '1', name: 'Onions', quantity: '2', unit: 'lb', estimatedCost: 2.50, category: 'Vegetables', checked: false },
  { id: '2', name: 'Tomatoes', quantity: '1', unit: 'lb', estimatedCost: 3.00, category: 'Vegetables', checked: false },
  { id: '3', name: 'Potatoes', quantity: '3', unit: 'lb', estimatedCost: 4.00, category: 'Vegetables', checked: true },
  { id: '4', name: 'Lentils', quantity: '1', unit: 'lb', estimatedCost: 3.50, category: 'Pulses', checked: false },
  { id: '5', name: 'Brown Rice', quantity: '2', unit: 'lb', estimatedCost: 4.00, category: 'Grains', checked: false },
  { id: '6', name: 'Chicken Breast', quantity: '2', unit: 'lb', estimatedCost: 8.00, category: 'Protein', checked: false },
  { id: '7', name: 'Milk', quantity: '1', unit: 'gal', estimatedCost: 4.50, category: 'Dairy', checked: true },
  { id: '8', name: 'Eggs', quantity: '12', unit: 'pcs', estimatedCost: 5.00, category: 'Protein', checked: false },
  { id: '9', name: 'Olive Oil', quantity: '16', unit: 'oz', estimatedCost: 8.00, category: 'Cooking', checked: false },
  { id: '10', name: 'Garlic', quantity: '1', unit: 'head', estimatedCost: 0.75, category: 'Vegetables', checked: false },
];

// AI Suggestions - International stores
const aiSuggestions = [
  { original: 'Chicken Breast', alternative: 'Store Brand Chicken', savings: 2.00, store: 'Walmart' },
  { original: 'Brown Rice', alternative: 'Costco Bulk Rice', savings: 1.50, store: 'Costco' },
  { original: 'Olive Oil', alternative: 'Kirkland Olive Oil', savings: 3.00, store: 'Costco' },
];

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(initialShoppingList);
  const [newItemName, setNewItemName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, ShoppingItem[]> = {};
    items.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [items]);

  // Calculate totals
  const totals = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.estimatedCost, 0);
    const checked = items.filter(i => i.checked).reduce((sum, item) => sum + item.estimatedCost, 0);
    const remaining = total - checked;
    return { total, checked, remaining };
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    const newItem: ShoppingItem = {
      id: generateId(),
      name: newItemName,
      quantity: '1',
      unit: 'pcs',
      estimatedCost: 3.00,
      category: 'Other',
      checked: false,
    };
    setItems([...items, newItem]);
    setNewItemName('');
  };

  return (
    <div className="space-y-6">
      {/* Header with Total */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Estimated Total</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${totals.total.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <Badge variant="success" className="mb-1">
                {items.filter(i => i.checked).length}/{items.length} items
              </Badge>
              <p className="text-sm text-gray-500">
                Remaining: ${totals.remaining.toFixed(2)}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(items.filter(i => i.checked).length / items.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    AI Cost-Saving Suggestions
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSuggestions(false)}
                  >
                    Dismiss
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <TrendingDown className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">
                            {suggestion.original} → {suggestion.alternative}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Store className="w-3 h-3" />
                            Available at {suggestion.store}
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">
                        Save ${suggestion.savings.toFixed(2)}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-center text-gray-500 mt-3">
                  Total potential savings: ${aiSuggestions.reduce((s, i) => s + i.savings, 0).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Item */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add item..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              className="flex-1"
            />
            <Button onClick={addItem} size="icon">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shopping List by Category */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <Card key={category}>
            <button
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {getCategoryEmoji(category)}
                </span>
                <div className="text-left">
                  <h3 className="font-medium">{category}</h3>
                  <p className="text-sm text-gray-500">
                    {categoryItems.filter(i => i.checked).length}/{categoryItems.length} items • 
                    ${categoryItems.reduce((s, i) => s + i.estimatedCost, 0).toFixed(2)}
                  </p>
                </div>
              </div>
              {expandedCategory === category ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <AnimatePresence>
              {(expandedCategory === category || expandedCategory === null) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0 pb-4">
                    <div className="space-y-2">
                      {categoryItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            item.checked
                              ? 'bg-green-50 dark:bg-green-900/20'
                              : 'bg-gray-50 dark:bg-gray-800/50'
                          }`}
                        >
                          <button
                            onClick={() => toggleItem(item.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              item.checked
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {item.checked && <Check className="w-4 h-4 text-white" />}
                          </button>
                          
                          <div className="flex-1">
                            <p className={`font-medium ${item.checked ? 'line-through text-gray-400' : ''}`}>
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.quantity} {item.unit}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-green-600 dark:text-green-400">
                              ${item.estimatedCost.toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-gray-400 hover:text-red-500"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    Vegetables: '🥬',
    Fruits: '🍎',
    Pulses: '🫘',
    Grains: '🌾',
    Dairy: '🥛',
    Protein: '🍗',
    Spices: '🌶️',
    Cooking: '🫒',
    Other: '📦',
  };
  return emojiMap[category] || '📦';
}

export default ShoppingList;
