// Pantry Manager Component

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Refrigerator, Plus, X, Sparkles, ChefHat, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PantryItem } from '@/types';
import { generateId } from '@/utils';
import { suggestRecipesFromPantry } from '@/lib/gemini/pantryRecipes';

const initialPantry: PantryItem[] = [
  { id: '1', name: 'Rice', quantity: '2', unit: 'kg', category: 'Grains' },
  { id: '2', name: 'Onions', quantity: '500', unit: 'g', category: 'Vegetables' },
  { id: '3', name: 'Tomatoes', quantity: '4', unit: 'pcs', category: 'Vegetables' },
  { id: '4', name: 'Toor Dal', quantity: '500', unit: 'g', category: 'Pulses' },
  { id: '5', name: 'Potatoes', quantity: '1', unit: 'kg', category: 'Vegetables' },
];

export function PantryManager() {
  const [items, setItems] = useState<PantryItem[]>(initialPantry);
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, { id: generateId(), name: newItem, quantity: '1', unit: 'pcs', category: 'Other' }]);
    setNewItem('');
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const getRecipeSuggestions = async () => {
    setIsLoading(true);
    try {
      const result = await suggestRecipesFromPantry(items.map(i => i.name));
      setSuggestions(result);
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Refrigerator className="w-5 h-5 text-blue-500" />My Pantry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Add ingredient..." onKeyDown={(e) => e.key === 'Enter' && addItem()} />
            <Button onClick={addItem}><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map(item => (
              <motion.div key={item.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-gray-500">{item.quantity} {item.unit}</span>
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={getRecipeSuggestions} disabled={isLoading || items.length === 0} className="w-full" size="lg">
        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Finding Recipes...</> : <><Sparkles className="w-5 h-5 mr-2" />Suggest Recipes from Pantry</>}
      </Button>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2"><ChefHat className="w-5 h-5" />Suggested Recipes</h3>
          {suggestions.map((recipe, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div><h4 className="font-semibold">{recipe.name}</h4><p className="text-sm text-gray-500">{recipe.description}</p></div>
                    <Badge variant={recipe.difficulty === 'Easy' ? 'success' : 'warning'}>{recipe.difficulty}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{recipe.prepTime + recipe.cookTime}m</span>
                    <span>₹{recipe.estimatedCost}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {recipe.matchingIngredients?.map((ing: string, j: number) => <Badge key={j} variant="success" className="text-xs">{ing}</Badge>)}
                    {recipe.missingIngredients?.map((ing: string, j: number) => <Badge key={j} variant="destructive" className="text-xs">{ing} (need)</Badge>)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PantryManager;
