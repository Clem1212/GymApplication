const db = globalThis.__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } }
};

import React, { useState, useEffect } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Target, Dumbbell, Scale, Flame, Zap, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getLocalStorage, setLocalStorage } from '@/components/hooks/useLocalStorage';

const fitnessGoals = [
  { id: 'muscle_gain', icon: Dumbbell, label: 'Build Muscle', desc: 'Gain strength and size', color: 'from-blue-500 to-blue-600' },
  { id: 'weight_loss', icon: Flame, label: 'Lose Weight', desc: 'Burn fat and slim down', color: 'from-orange-500 to-red-500' },
  { id: 'maintenance', icon: Scale, label: 'Maintain', desc: 'Stay at current weight', color: 'from-green-500 to-emerald-500' },
  { id: 'endurance', icon: Zap, label: 'Endurance', desc: 'Improve stamina', color: 'from-purple-500 to-pink-500' },
];

export default function Goals() {
  const profile = getLocalStorage('gymiq_profile', {});
  const [selectedGoal, setSelectedGoal] = useState(profile?.goal || 'maintenance');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');
  const [dailyProtein, setDailyProtein] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const list = await db.entities.UserProgress.list();
      return list[0] || null;
    },
  });

  useEffect(() => {
    const src = progress || profile;
    if (src) {
      setSelectedGoal(src.fitness_goal || src.goal || 'maintenance');
      setCurrentWeight((src.weight_current || src.current_weight)?.toString() || '');
      setGoalWeight((src.weight_goal || src.goal_weight)?.toString() || '');
      setDailyCalories(src.daily_calorie_target?.toString() || '');
      setDailyProtein(src.daily_protein_target?.toString() || '');
    }
  }, [progress]);

  // Auto-calculate targets based on goal
  useEffect(() => {
    if (currentWeight && selectedGoal) {
      const weight = parseFloat(currentWeight);
      let calories, protein;

      switch (selectedGoal) {
        case 'muscle_gain':
          calories = Math.round(weight * 18);
          protein = Math.round(weight * 1);
          break;
        case 'weight_loss':
          calories = Math.round(weight * 12);
          protein = Math.round(weight * 1.2);
          break;
        case 'endurance':
          calories = Math.round(weight * 16);
          protein = Math.round(weight * 0.8);
          break;
        default:
          calories = Math.round(weight * 15);
          protein = Math.round(weight * 0.9);
      }

      if (!dailyCalories) setDailyCalories(calories.toString());
      if (!dailyProtein) setDailyProtein(protein.toString());
    }
  }, [currentWeight, selectedGoal]);

  const saveGoals = async () => {
    setIsSaving(true);
    try {
      const data = {
        fitness_goal: selectedGoal,
        weight_current: parseFloat(currentWeight) || null,
        weight_goal: parseFloat(goalWeight) || null,
        daily_calorie_target: parseInt(dailyCalories) || 2000,
        daily_protein_target: parseInt(dailyProtein) || 150,
      };

      if (progress) {
        await db.entities.UserProgress.update(progress.id, data);
      } else {
        await db.entities.UserProgress.create({
          ...data,
          current_streak: 0,
          longest_streak: 0,
          total_workouts: 0,
          total_calories_burned: 0,
          xp_points: 0,
          level: 1,
          badges: [],
        });
      }

      // Also save to localStorage
      const updatedProfile = { ...profile, goal: selectedGoal, daily_calorie_target: parseInt(dailyCalories) || 2000, daily_protein_target: parseInt(dailyProtein) || 150, current_weight: parseFloat(currentWeight) || null, goal_weight: parseFloat(goalWeight) || null };
      setLocalStorage('gymiq_profile', updatedProfile);

      queryClient.invalidateQueries(['userProgress']);
      toast.success('Goals saved!');
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save goals');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white">Set Your Goals</h1>
        <p className="text-gray-400 text-sm mt-1">Customize your fitness journey</p>
      </div>

      <div className="px-5 space-y-6">
        {/* Fitness Goal Selection */}
        <div>
          <label className="text-white font-medium text-sm mb-3 block">What's your main goal?</label>
          <div className="grid grid-cols-2 gap-3">
            {fitnessGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedGoal(goal.id)}
                className={`relative p-4 rounded-2xl cursor-pointer transition-all ${
                  selectedGoal === goal.id
                    ? 'bg-gradient-to-br ' + goal.color + ' shadow-lg'
                    : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
                }`}
              >
                {selectedGoal === goal.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
                <goal.icon className={`w-8 h-8 mb-2 ${selectedGoal === goal.id ? 'text-white' : 'text-gray-400'}`} />
                <p className={`font-semibold ${selectedGoal === goal.id ? 'text-white' : 'text-white'}`}>{goal.label}</p>
                <p className={`text-xs mt-1 ${selectedGoal === goal.id ? 'text-white/80' : 'text-gray-500'}`}>{goal.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weight Goals */}
        <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5 space-y-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-400" />
            Weight Goals
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs mb-2 block">Current Weight (lbs)</label>
              <Input
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="165"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-2 block">Goal Weight (lbs)</label>
              <Input
                type="number"
                value={goalWeight}
                onChange={(e) => setGoalWeight(e.target.value)}
                placeholder="175"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Daily Targets */}
        <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5 space-y-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            Daily Targets
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs mb-2 block">Daily Calories (kcal)</label>
              <Input
                type="number"
                value={dailyCalories}
                onChange={(e) => setDailyCalories(e.target.value)}
                placeholder="2000"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-2 block">Daily Protein (g)</label>
              <Input
                type="number"
                value={dailyProtein}
                onChange={(e) => setDailyProtein(e.target.value)}
                placeholder="150"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <p className="text-gray-500 text-xs">
            💡 Targets auto-calculated based on your goal and weight
          </p>
        </div>

        {/* Reset onboarding */}
        <button
          onClick={() => {
            if (window.confirm('Redo the setup questions? This will restart the onboarding flow.')) {
              setLocalStorage('gymiq_onboarding_done', false);
              setLocalStorage('gymiq_tutorial_done', false);
              window.location.reload();
            }
          }}
          className="w-full py-3 text-gray-500 text-sm flex items-center justify-center gap-2 hover:text-gray-400 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Redo initial setup
        </button>

        {/* Save Button */}
        <Button
          onClick={saveGoals}
          disabled={isSaving}
          className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl font-semibold text-lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Save Goals
            </>
          )}
        </Button>
      </div>
    </div>
  );
}