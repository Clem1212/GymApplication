import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Timer, Info } from 'lucide-react';
import { ALL_EXERCISES } from '@/components/data/exercises';

export default function TodayWorkout({ daySchedule, onComplete }) {
  const [checkedExercises, setCheckedExercises] = useState({});
  const [expandedExercise, setExpandedExercise] = useState(null);

  const toggle = (name) => setCheckedExercises(prev => ({ ...prev, [name]: !prev[name] }));
  const completedCount = Object.values(checkedExercises).filter(Boolean).length;
  const totalCount = daySchedule?.exercises?.length || 0;
  const allDone = completedCount === totalCount && totalCount > 0;

  const getExerciseInfo = (name) => ALL_EXERCISES.find(e => e.name === name);

  return (
    <div className="rounded-3xl overflow-hidden bg-gray-900/60 border border-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-5 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Today's Session</p>
            <h3 className="text-white font-bold text-xl">{daySchedule?.day}</h3>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-white">{completedCount}</span>
            <span className="text-gray-400">/{totalCount}</span>
            <p className="text-gray-500 text-xs">done</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Exercise list */}
      <div className="divide-y divide-gray-800/60">
        {daySchedule?.exercises?.map((exercise, index) => {
          const info = getExerciseInfo(exercise.name);
          const isChecked = checkedExercises[exercise.name];
          const isExpanded = expandedExercise === exercise.name;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggle(exercise.name)}
                    className="flex-shrink-0"
                  >
                    <motion.div whileTap={{ scale: 0.8 }}>
                      {isChecked ? (
                        <CheckCircle2 className="w-7 h-7 text-green-400" />
                      ) : (
                        <Circle className="w-7 h-7 text-gray-600" />
                      )}
                    </motion.div>
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isChecked ? 'line-through text-gray-500' : 'text-white'}`}>
                      {exercise.name}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                      <span className="font-medium text-gray-400">{exercise.sets} sets × {exercise.reps}</span>
                      {exercise.rest_seconds && (
                        <span className="flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {exercise.rest_seconds}s rest
                        </span>
                      )}
                    </div>
                  </div>

                  {info && (
                    <button
                      onClick={() => setExpandedExercise(isExpanded ? null : exercise.name)}
                      className="text-gray-500 hover:text-blue-400 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {isExpanded && info && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 ml-10 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-gray-400 mb-1">🎯 Muscles: <span className="text-gray-300">{info.muscles}</span></p>
                        <p className="text-xs text-blue-300 italic">"{info.tips}"</p>
                        {exercise.notes && (
                          <p className="text-xs text-yellow-400/80 mt-1">📝 {exercise.notes}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Complete button */}
      <div className="p-4">
        <motion.button
          onClick={() => allDone && onComplete()}
          whileTap={{ scale: 0.97 }}
          className={`w-full h-14 rounded-2xl font-bold text-base transition-all ${
            allDone
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {allDone ? '🎉 Complete Workout & Earn XP!' : `Complete all ${totalCount - completedCount} remaining exercises`}
        </motion.button>
      </div>
    </div>
  );
}