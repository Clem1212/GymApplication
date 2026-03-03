const db = globalThis.__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } }
};

import React, { useState, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Upload, Video, Loader2, Dumbbell, CheckCircle2, ChevronDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormAnalysisResult from '@/components/workout/FormAnalysisResult';
import { ALL_EXERCISES, CALISTHENICS, WEIGHTED } from '@/components/data/exercises';

const CATEGORY_SECTIONS = [
  {
    label: '🤸 Calisthenics — Push',
    exercises: CALISTHENICS.push,
  },
  {
    label: '🤸 Calisthenics — Pull',
    exercises: CALISTHENICS.pull,
  },
  {
    label: '🤸 Calisthenics — Legs',
    exercises: CALISTHENICS.legs,
  },
  {
    label: '🤸 Calisthenics — Core',
    exercises: CALISTHENICS.core,
  },
  {
    label: '🤸 Calisthenics — Full Body',
    exercises: CALISTHENICS.full,
  },
  {
    label: '🏋️ Weighted — Legs & Hinge',
    exercises: WEIGHTED.legs,
  },
  {
    label: '🏋️ Weighted — Push',
    exercises: WEIGHTED.push,
  },
  {
    label: '🏋️ Weighted — Pull',
    exercises: WEIGHTED.pull,
  },
];

const diffBadge = { beginner: 'text-green-400', intermediate: 'text-yellow-400', advanced: 'text-red-400' };

export default function WorkoutAnalysis() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const filteredSections = searchQuery
    ? [{ label: 'Search Results', exercises: ALL_EXERCISES.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())) }]
    : CATEGORY_SECTIONS;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const analyzeForm = async () => {
    if (!videoFile || !selectedExercise) return;
    setIsAnalyzing(true);
    try {
      const { file_url } = await db.integrations.Core.UploadFile({ file: videoFile });

      const isBodyweight = selectedExercise.category === 'calisthenics';
      const analysis = await db.integrations.Core.InvokeLLM({
        prompt: `You are an expert coach specializing in both calisthenics and weighted training. Analyze this video of someone performing a ${selectedExercise.name}.

This is a ${isBodyweight ? 'CALISTHENICS / bodyweight' : 'WEIGHTED barbell/dumbbell'} exercise.

Key form points for ${selectedExercise.name}: ${selectedExercise.tips}
Primary muscles worked: ${selectedExercise.muscles}

Provide detailed, specific coaching feedback covering:
1. Body positioning and alignment
2. Range of motion 
3. Tempo and control
4. Safety considerations
5. Most important fix they can make RIGHT NOW

Be direct, specific, and encouraging. Reference cues a real coach would use.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            analysis: { type: "string" },
            score: { type: "number" },
            improvements: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAnalysisResult({ ...analysis, video_url: file_url });

      const caloriesBurned = Math.round((parseInt(sets) || 3) * (parseInt(reps) || 10) * (isBodyweight ? 2.5 : 3.5));
      await db.entities.WorkoutSession.create({
        exercise_name: selectedExercise.name,
        video_url: file_url,
        form_analysis: analysis.analysis,
        form_score: analysis.score,
        improvements: analysis.improvements,
        sets: parseInt(sets) || null,
        reps: parseInt(reps) || null,
        weight: parseFloat(weight) || null,
        workout_date: format(new Date(), 'yyyy-MM-dd'),
        calories_burned: caloriesBurned,
      });

      // Update streak/progress
      const progressList = await db.entities.UserProgress.list();
      const p = progressList[0];
      const today = format(new Date(), 'yyyy-MM-dd');
      const XP = 100 + Math.round(analysis.score / 2);
      if (p) {
        const lastDate = p.last_workout_date;
        let streak = p.current_streak || 0;
        if (lastDate !== today) {
          const diff = lastDate ? (new Date(today) - new Date(lastDate)) / 86400000 : 999;
          streak = diff <= 1 ? streak + 1 : 1;
        }
        const newXp = (p.xp_points || 0) + XP;
        const newLevel = Math.floor(newXp / 500) + 1;
        const newBadges = [...(p.badges || [])];
        if (!newBadges.includes('first_workout')) newBadges.push('first_workout');
        if (analysis.score >= 95 && !newBadges.includes('perfect_form')) newBadges.push('perfect_form');
        await db.entities.UserProgress.update(p.id, {
          current_streak: streak, longest_streak: Math.max(streak, p.longest_streak || 0),
          total_workouts: (p.total_workouts || 0) + 1, xp_points: newXp, level: newLevel,
          badges: newBadges, last_workout_date: today,
          total_calories_burned: (p.total_calories_burned || 0) + caloriesBurned,
        });
      } else {
        await db.entities.UserProgress.create({
          current_streak: 1, longest_streak: 1, total_workouts: 1,
          xp_points: XP, level: 1, badges: ['first_workout'], last_workout_date: today,
          daily_calorie_target: 2000, daily_protein_target: 150, total_calories_burned: caloriesBurned,
        });
      }
      queryClient.invalidateQueries(['userProgress', 'todayWorkouts', 'allWorkoutsCalendar']);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pb-28">
      <div className="px-5 pt-12 pb-5">
        <h1 className="text-2xl font-black text-white">AI Form Analysis</h1>
        <p className="text-gray-400 text-sm mt-0.5">Get expert coaching on your technique</p>
      </div>

      <div className="px-5 space-y-5">
        {/* Exercise Picker */}
        <button
          onClick={() => setShowExercisePicker(true)}
          className="w-full flex items-center justify-between p-5 rounded-2xl bg-gray-900/60 border border-gray-700 hover:border-blue-500/50 transition-colors"
        >
          <div className="flex items-center gap-3 text-left">
            <Dumbbell className="w-5 h-5 text-blue-400 flex-shrink-0" />
            {selectedExercise ? (
              <div>
                <p className="text-white font-semibold">{selectedExercise.name}</p>
                <p className="text-gray-400 text-xs">{selectedExercise.muscles}</p>
              </div>
            ) : (
              <p className="text-gray-400">Select an exercise...</p>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {/* Form tips */}
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20"
          >
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-blue-200 text-sm italic">"{selectedExercise.tips}"</p>
          </motion.div>
        )}

        {/* Video Upload */}
        <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          {!videoPreview ? (
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-white font-medium">Tap to record or upload</p>
              <p className="text-gray-500 text-sm mt-1">Film your set from the side or front</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <video src={videoPreview} controls className="w-full rounded-xl max-h-64 object-cover" />
              <button onClick={() => { setVideoFile(null); setVideoPreview(null); setAnalysisResult(null); }}
                className="w-full py-2 rounded-xl bg-gray-800 text-gray-400 text-sm">
                Change Video
              </button>
            </div>
          )}
        </div>

        {/* Workout Details */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sets', value: sets, setter: setSets, placeholder: '3' },
            { label: 'Reps', value: reps, setter: setReps, placeholder: '10' },
            { label: selectedExercise?.category === 'weighted' ? 'Weight (lbs)' : 'BW', value: weight, setter: setWeight, placeholder: selectedExercise?.category === 'weighted' ? '135' : '--' },
          ].map((f, i) => (
            <div key={i}>
              <label className="text-gray-500 text-xs mb-1 block">{f.label}</label>
              <Input
                type="number"
                value={f.value}
                onChange={e => f.setter(e.target.value)}
                placeholder={f.placeholder}
                disabled={i === 2 && selectedExercise?.category !== 'weighted'}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          ))}
        </div>

        {/* Analyze Button */}
        <Button
          onClick={analyzeForm}
          disabled={!videoFile || !selectedExercise || isAnalyzing}
          className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-bold text-lg"
        >
          {isAnalyzing ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyzing your form...</>
          ) : (
            <><Dumbbell className="w-5 h-5 mr-2" />Analyze My Form</>
          )}
        </Button>

        {/* Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/15 border border-green-500/20">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">+{100 + Math.round(analysisResult.score / 2)} XP earned!</span>
              </div>
              <FormAnalysisResult
                analysis={analysisResult.analysis}
                score={analysisResult.score}
                improvements={analysisResult.improvements}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Exercise Picker Modal */}
      <AnimatePresence>
        {showExercisePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowExercisePicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="w-full bg-gray-950 border-t border-gray-800 rounded-t-3xl p-5 pb-10 max-h-[85vh] flex flex-col"
            >
              <h3 className="text-white font-bold text-xl mb-4">Choose Exercise</h3>
              <Input
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mb-4"
              />
              <div className="overflow-y-auto flex-1 space-y-4">
                {filteredSections.map((section) => (
                  <div key={section.label}>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2 px-1">{section.label}</p>
                    <div className="space-y-1">
                      {section.exercises.map((ex) => (
                        <button
                          key={ex.name}
                          onClick={() => { setSelectedExercise({ ...ex, category: ex.category || (section.label.includes('Weighted') ? 'weighted' : 'calisthenics') }); setShowExercisePicker(false); setSearchQuery(''); }}
                          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-900 hover:bg-gray-800 transition-colors text-left"
                        >
                          <div>
                            <p className="text-white font-medium text-sm">{ex.name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{ex.muscles}</p>
                          </div>
                          <span className={`text-xs font-medium ${diffBadge[ex.difficulty]}`}>{ex.difficulty}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}