// Premium Food Scanner Page - Real-time Gemini AI Analysis

'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Zap, Clock, Flame, Sparkles, X, RotateCcw, CheckCircle, TrendingDown, Heart, Loader2, DollarSign, Image } from 'lucide-react';
import { scanFood, isGeminiVisionAvailable } from '@/lib/gemini/foodScanner';

interface ScanResult {
  dishName: string;
  cuisine: string;
  confidence: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredients: string[];
  healthRating: number;
  healthTips: string[];
  homemadeCost: number;
  restaurantCost: number;
  savings: number;
}

const recentScans = [
  { name: 'Buddha Bowl', calories: 420, time: '10 min ago', icon: '🥗', healthRating: 9 },
  { name: 'Pasta Carbonara', calories: 580, time: '2 hours ago', icon: '🍝', healthRating: 6 },
  { name: 'Fruit Salad', calories: 150, time: 'Yesterday', icon: '🍓', healthRating: 10 },
];

export default function FoodScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      await performScan(base64);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const performScan = async (imageBase64?: string) => {
    setIsScanning(true);
    setScanResult(null);
    setError(null);

    try {
      console.log('Starting food scan...', imageBase64 ? 'with image' : 'demo mode');
      
      // Use Gemini AI to analyze the image
      const result = await scanFood(imageBase64 || '');
      
      console.log('Scan result:', result);
      setScanResult(result);
    } catch (err) {
      console.error('Scan error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleDemoScan = () => {
    setImagePreview(null);
    performScan();
  };

  const resetScan = () => {
    setScanResult(null);
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getHealthRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-500';
    if (rating >= 6) return 'text-amber-500';
    return 'text-red-500';
  };

  const getHealthRatingBg = (rating: number) => {
    if (rating >= 8) return 'bg-green-500';
    if (rating >= 6) return 'bg-amber-500';
    return 'bg-red-500';
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
          <span className="text-gradient-green">Food</span> Scanner
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="page-subtitle"
        >
          Upload any food photo for instant AI nutrition analysis
        </motion.p>
      </header>

      {/* API Status */}
      <section className="section">
        <div className={`flex items-center gap-2 text-sm p-2 rounded-xl ${isGeminiVisionAvailable() ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'}`}>
          <span className={`w-2 h-2 rounded-full ${isGeminiVisionAvailable() ? 'bg-green-500' : 'bg-amber-500'}`} />
          {isGeminiVisionAvailable() ? 'Gemini AI Connected - Ready for real analysis' : 'Demo Mode - Add GEMINI API key for real analysis'}
        </div>
      </section>

      {/* Scanner Area */}
      <section className="section">
        <AnimatePresence mode="wait">
          {!scanResult ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="premium-card p-6"
            >
              <div className="aspect-square max-w-[300px] mx-auto rounded-3xl bg-gradient-to-br from-[var(--surface)] to-[var(--border-light)] flex flex-col items-center justify-center relative overflow-hidden border-2 border-dashed border-[var(--border)]">
                {imagePreview ? (
                  <img src={imagePreview} alt="Food preview" className="w-full h-full object-cover" />
                ) : isScanning ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-center"
                  >
                    <span className="text-6xl block mb-2">🔍</span>
                    <p className="text-sm text-[var(--text-muted)]">Analyzing with AI...</p>
                  </motion.div>
                ) : (
                  <>
                    <Image className="w-16 h-16 text-[var(--primary)] mb-4" />
                    <p className="text-[var(--text-secondary)] text-center px-4 text-sm">
                      Upload a food photo to analyze
                    </p>
                    <p className="text-[var(--text-muted)] text-center px-4 text-xs mt-2">
                      JPG, PNG up to 10MB
                    </p>
                  </>
                )}
                
                {isScanning && (
                  <motion.div
                    initial={{ top: 0 }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute left-0 right-0 h-1 bg-[var(--primary)]"
                  />
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="flex-1 btn-secondary py-3"
                >
                  <Upload className="w-5 h-5" />
                  Upload Photo
                </button>
                <button
                  onClick={handleDemoScan}
                  disabled={isScanning}
                  className="flex-1 btn-primary py-3"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> Demo Scan
                    </>
                  )}
                </button>
              </div>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              {/* Header with Image */}
              <div className="premium-card p-4">
                <div className="flex items-start gap-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Scanned food" className="w-20 h-20 rounded-xl object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#4ADE80] flex items-center justify-center text-3xl shadow-lg">
                      🍽️
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{scanResult.dishName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getHealthRatingBg(scanResult.healthRating)} text-white`}>
                        {scanResult.healthRating}/10
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">{scanResult.cuisine} Cuisine</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Confidence: {Math.round(scanResult.confidence * 100)}%
                    </p>
                  </div>
                  <button onClick={resetScan} className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-[var(--text-muted)]" />
                  </button>
                </div>
              </div>

              {/* Nutrition Grid */}
              <div className="premium-card p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" /> Nutrition Facts
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: 'Calories', value: scanResult.nutrition.calories, unit: 'kcal', color: 'bg-orange-500' },
                    { label: 'Protein', value: scanResult.nutrition.protein, unit: 'g', color: 'bg-blue-500' },
                    { label: 'Carbs', value: scanResult.nutrition.carbs, unit: 'g', color: 'bg-amber-500' },
                    { label: 'Fat', value: scanResult.nutrition.fat, unit: 'g', color: 'bg-red-400' },
                    { label: 'Fiber', value: scanResult.nutrition.fiber, unit: 'g', color: 'bg-green-500' },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className={`w-10 h-10 mx-auto rounded-xl ${item.color} text-white flex items-center justify-center font-bold text-sm mb-1`}>
                        {item.value}
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Savings */}
              <div className="premium-card p-4" style={{ background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)' }}>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-8 h-8" />
                    <div>
                      <p className="text-white/80 text-sm">You could save</p>
                      <p className="text-2xl font-bold">${scanResult.savings.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-white/80">Homemade: <strong>${scanResult.homemadeCost.toFixed(2)}</strong></p>
                    <p className="text-white/80">Restaurant: <span className="line-through">${scanResult.restaurantCost.toFixed(2)}</span></p>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="premium-card p-4">
                <h4 className="font-semibold mb-3">🥬 Detected Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {scanResult.ingredients.map((ing, i) => (
                    <span key={i} className="chip text-sm">{ing}</span>
                  ))}
                </div>
              </div>

              {/* Health Tips */}
              <div className="premium-card p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[var(--primary)]" /> Health Tips
                </h4>
                <div className="space-y-2">
                  {scanResult.healthTips.map((tip, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <CheckCircle className="w-4 h-4 text-[var(--secondary)] flex-shrink-0" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 btn-secondary py-3">
                  📖 Find Recipe
                </button>
                <button className="flex-1 btn-primary py-3">
                  ➕ Log to Diary
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Recent Scans */}
      {!scanResult && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Recent Scans</h2>
          </div>
          <div className="space-y-3">
            {recentScans.map((scan, i) => (
              <motion.div
                key={scan.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="premium-card p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--surface)] flex items-center justify-center text-2xl">
                  {scan.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{scan.name}</h4>
                  <p className="text-sm text-[var(--text-muted)]">{scan.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--primary)]">{scan.calories}</p>
                  <p className="text-xs text-[var(--text-muted)]">kcal</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
