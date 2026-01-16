// Shopping List Page

'use client';

import { ShoppingList } from '@/components/ShoppingList';

export default function ShoppingListPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Smart Shopping List</h1>
      <p className="text-gray-500 mb-8">AI-optimized shopping list with cost-saving suggestions and real-time tracking.</p>
      <ShoppingList />
    </div>
  );
}
