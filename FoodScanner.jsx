import { db } from '@/api/base44Client';

import React, { useState, useRef } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Camera, Loader2, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NutritionDisplay from '@/components/food/NutritionDisplay';

export default function FoodScanner() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nutritionResult, setNutritionResult] = useState(null);
  const [mealType, setMealType] = useState('lunch');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const list = await db.entities.UserProgress.list();
      return list[0] || null;
    },
  });

  const { data: todayMeals = [] } = useQuery({
    queryKey: ['todayMeals'],
    queryFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      return db.entities.MealLog.filter({ meal_date: today });
    },
  });

  const todayCalories = todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const dailyTarget = progress?.daily_calorie_target || 2000;
  const remaining = dailyTarget - todayCalories;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setNutritionResult(null);
      setSaved(false);
    }
  };

  const analyzeFood = async () => {
    if (!imageFile) return;
    
    setIsAnalyzing(true);
    try {
      console.log('Starting food analysis...');
      console.log('DB object:', db);
      console.log('Integrations available:', db.integrations);
      
      const { file_url } = await db.integrations.Core.UploadFile({ file: imageFile });
      console.log('File uploaded:', file_url);
      
      const goalContext = progress?.fitness_goal === 'weight_loss' 
        ? 'The user is trying to lose weight, so be accurate and slightly conservative with estimates.'
        : progress?.fitness_goal === 'muscle_gain'
        ? 'The user is trying to build muscle, so pay special attention to protein content.'
        : 'Provide balanced nutritional information.';

      console.log('Calling InvokeLLM...');
      const analysis = await db.integrations.Core.InvokeLLM({
        prompt: `You are a nutritionist analyzing a photo of food. ${goalContext}
        
        Identify all food items in the image and estimate their nutritional content.
        Be as accurate as possible with portions visible in the image.
        
        Provide:
        1. A name for this meal
        2. Total calories, protein, carbs, and fat
        3. List of individual food items with their portions and calories`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            meal_name: { type: "string" },
            total_calories: { type: "number" },
            total_protein: { type: "number" },
            total_carbs: { type: "number" },
            total_fat: { type: "number" },
            food_items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  portion: { type: "string" },
                  calories: { type: "number" }
                }
              }
            }
          }
        }
      });

      console.log('Analysis result:', analysis);
      
      // Check if this is mock data
      const isMockData = !import.meta.env.VITE_BASE44_ACCESS_TOKEN;
      
      setNutritionResult({ 
        ...analysis, 
        image_url: file_url,
        isMockData 
      });
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(`Analysis failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveMeal = async () => {
    if (!nutritionResult) return;
    
    await db.entities.MealLog.create({
      meal_name: nutritionResult.meal_name,
      image_url: nutritionResult.image_url,
      calories: nutritionResult.total_calories,
      protein: nutritionResult.total_protein,
      carbs: nutritionResult.total_carbs,
      fat: nutritionResult.total_fat,
      meal_type: mealType,
      meal_date: format(new Date(), 'yyyy-MM-dd'),
      food_items: nutritionResult.food_items
    });

    setSaved(true);
    queryClient.invalidateQueries(['todayMeals']);
  };

  const resetScanner = () => {
    setImageFile(null);
    setImagePreview(null);
    setNutritionResult(null);
    setSaved(false);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white">Food Scanner</h1>
        <p className="text-gray-400 text-sm mt-1">Snap a photo to track calories</p>
      </div>

      <div className="px-5 space-y-6">
        {/* Daily Progress */}
        <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 text-sm">Today's Calories</span>
            <span className="text-green-400 font-medium">{remaining > 0 ? remaining : 0} remaining</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((todayCalories / dailyTarget) * 100, 100)}%` }}
              className={`h-full rounded-full ${todayCalories > dailyTarget ? 'bg-red-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-white font-medium">{todayCalories} kcal</span>
            <span className="text-gray-500">/ {dailyTarget} kcal</span>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!imagePreview ? (
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-green-500/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-medium">Tap to take photo</p>
              <p className="text-gray-500 text-sm mt-1">or upload from gallery</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Food preview"
                className="w-full rounded-xl object-cover max-h-64"
              />
              {!nutritionResult && (
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="w-full"
                >
                  Choose Different Photo
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Meal Type Selection */}
        {imagePreview && !nutritionResult && (
          <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5">
            <label className="text-white font-medium text-sm mb-3 block">Meal Type</label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                <SelectItem value="lunch">☀️ Lunch</SelectItem>
                <SelectItem value="dinner">🌙 Dinner</SelectItem>
                <SelectItem value="snack">🍎 Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Analyze Button */}
        {imagePreview && !nutritionResult && (
          <Button
            onClick={analyzeFood}
            disabled={isAnalyzing}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl font-semibold text-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Analyze Food
              </>
            )}
          </Button>
        )}

        {/* Results */}
        <AnimatePresence>
          {nutritionResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{nutritionResult.meal_name}</h3>
                {saved && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">Saved</span>
                  </div>
                )}
              </div>
              
              {nutritionResult.isMockData && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ Demo Mode: This is sample data. Log in to Base44 for real AI analysis.
                  </p>
                </div>
              )}
              
              <NutritionDisplay
                calories={nutritionResult.total_calories}
                protein={nutritionResult.total_protein}
                carbs={nutritionResult.total_carbs}
                fat={nutritionResult.total_fat}
                items={nutritionResult.food_items}
              />

              {!saved ? (
                <Button
                  onClick={saveMeal}
                  className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl font-semibold text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Log This Meal
                </Button>
              ) : (
                <Button
                  onClick={resetScanner}
                  variant="outline"
                  className="w-full h-14 rounded-2xl font-semibold"
                >
                  Scan Another Meal
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}