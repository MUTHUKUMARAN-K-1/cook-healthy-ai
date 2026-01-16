// Pantry Page

'use client';

import { PantryManager } from '@/components/PantryManager';

export default function PantryPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Pantry Manager</h1>
      <p className="text-gray-500 mb-8">Add what you have, and AI will suggest recipes you can make right now.</p>
      <PantryManager />
    </div>
  );
}
