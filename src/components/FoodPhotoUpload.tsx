// Food Photo Upload Component with AI Recognition

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Loader2, Sparkles, TrendingDown, AlertCircle, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FoodRecognitionResult } from '@/types';
import { formatCurrency } from '@/utils';
import { analyzeFoodPhoto, getCostComparison, getHealthInsights } from '@/lib/gemini/foodRecognition';

export function FoodPhotoUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImage(base64);
      setError(null);
      setResult(null);
      setIsAnalyzing(true);
      try {
        const base64Data = base64.split(',')[1];
        const analysisResult = await analyzeFoodPhoto(base64Data, file.type);
        setResult(analysisResult);
      } catch {
        setError('Failed to analyze image. Please try again.');
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const resetUpload = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  const costComparison = result ? getCostComparison(result) : null;
  const healthInsights = result ? getHealthInsights(result) : [];

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors cursor-pointer">
              <CardContent className="py-12">
                <label className="flex flex-col items-center cursor-pointer">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Upload Food Photo</h3>
                  <p className="text-sm text-gray-500 text-center mb-4">
                    AI will analyze calories, nutrition & cost
                  </p>
                  <Button variant="outline"><Upload className="w-4 h-4 mr-2" />Choose Photo</Button>
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                </label>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="overflow-hidden">
              <div className="relative">
                <img src={image} alt="Uploaded food" className="w-full h-64 object-cover" />
                <Button variant="secondary" size="icon" className="absolute top-2 right-2" onClick={resetUpload}><X className="w-4 h-4" /></Button>
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-white" />
                  </div>
                )}
                {result && <Badge variant="success" className="absolute bottom-2 left-2"><Sparkles className="w-4 h-4 mr-1" />{result.confidence}%</Badge>}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <Card className="border-red-200 bg-red-50"><CardContent className="py-4 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-600">{error}</p></CardContent></Card>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{result.dishName}</span>
                <Badge variant="warning"><Flame className="w-4 h-4 mr-1" />{result.calories} cal</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl"><p className="text-xl font-bold text-blue-600">{result.nutrition.protein}g</p><p className="text-xs">Protein</p></div>
                <div className="text-center p-3 bg-amber-50 rounded-xl"><p className="text-xl font-bold text-amber-600">{result.nutrition.carbs}g</p><p className="text-xs">Carbs</p></div>
                <div className="text-center p-3 bg-orange-50 rounded-xl"><p className="text-xl font-bold text-orange-600">{result.nutrition.fat}g</p><p className="text-xs">Fat</p></div>
              </div>
              <div className="mb-4"><div className="flex justify-between mb-2"><span className="text-sm">Health Rating</span><span>{result.healthRating}/10</span></div><Progress value={result.healthRating * 10} /></div>
              <div className="flex flex-wrap gap-2">{result.ingredients.map((ing, i) => <Badge key={i} variant="secondary">{ing}</Badge>)}</div>
            </CardContent>
          </Card>

          {costComparison && (
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-4"><TrendingDown className="w-5 h-5 text-green-500" />Cost Comparison</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-white rounded-xl"><p className="text-xs text-gray-500">Restaurant</p><p className="text-xl font-bold text-red-500">{formatCurrency(costComparison.restaurantCost)}</p></div>
                  <div className="text-center p-4 bg-green-100 rounded-xl"><p className="text-xs text-gray-500">Homemade</p><p className="text-xl font-bold text-green-600">{formatCurrency(costComparison.homemadeCost)}</p></div>
                </div>
                <div className="text-center p-4 bg-green-500 text-white rounded-xl"><p className="text-sm">Save {formatCurrency(costComparison.savings)} ({costComparison.savingsPercent}%)</p></div>
              </CardContent>
            </Card>
          )}

          <Card><CardHeader><CardTitle className="text-base">Health Insights</CardTitle></CardHeader><CardContent><div className="space-y-2">{healthInsights.map((insight, i) => <p key={i} className="text-sm p-2 bg-gray-50 rounded">{insight}</p>)}</div></CardContent></Card>
          <Button className="w-full" onClick={resetUpload}><Camera className="w-5 h-5 mr-2" />Scan Another</Button>
        </motion.div>
      )}
    </div>
  );
}

export default FoodPhotoUpload;
