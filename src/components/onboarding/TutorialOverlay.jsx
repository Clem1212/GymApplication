import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { setLocalStorage } from '@/components/hooks/useLocalStorage';

const TUTORIAL_STEPS = [
  {
    emoji: '🏠',
    title: 'Your Dashboard',
    body: 'This is Home base. See your streak, XP level, today\'s workout plan, and calorie progress all in one place. Your streak resets if you miss a day — don\'t break the chain!',
    highlight: null,
    color: 'from-blue-500/20 to-purple-500/10',
    border: 'border-blue-500/30',
  },
  {
    emoji: '📋',
    title: 'Workout Plans',
    body: 'Tap Plans to pick a structured program. Each day, check off your exercises as you complete them. Finish the full workout to earn XP and keep your streak alive.',
    highlight: null,
    color: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/30',
  },
  {
    emoji: '📹',
    title: 'AI Form Analysis',
    body: 'Record yourself doing an exercise and tap Analyze. Our AI coach will give you a form score out of 100, specific corrections, and coaching cues — like having a trainer in your pocket.',
    highlight: null,
    color: 'from-purple-500/20 to-pink-500/10',
    border: 'border-purple-500/30',
  },
  {
    emoji: '📸',
    title: 'Food Scanner',
    body: 'Snap a photo of any meal and we\'ll instantly calculate the calories, protein, carbs, and fat. Your daily totals track against targets tailored to your goal (cut or bulk).',
    highlight: null,
    color: 'from-orange-500/20 to-red-500/10',
    border: 'border-orange-500/30',
  },
  {
    emoji: '🔥',
    title: 'Streaks & XP',
    body: 'Train every day to grow your streak. Earn XP for logging workouts and good form. Level up from Rookie all the way to GOD MODE. Unlock badges for milestones like 7-day streaks and perfect form.',
    highlight: null,
    color: 'from-orange-500/20 to-yellow-500/10',
    border: 'border-orange-500/30',
  },
  {
    emoji: '📊',
    title: 'Track Progress',
    body: 'The Progress tab shows your full history — activity calendar, weekly charts, total workouts, calories burned, and all your earned badges. Your grind visualized.',
    highlight: null,
    color: 'from-teal-500/20 to-cyan-500/10',
    border: 'border-teal-500/30',
  },
];

export default function TutorialOverlay({ onClose }) {
  const [step, setStep] = useState(0);
  const current = TUTORIAL_STEPS[step];
  const isLast = step === TUTORIAL_STEPS.length - 1;

  const handleClose = () => {
    setLocalStorage('gymiq_tutorial_done', true);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
    >
      <div className="w-full max-w-sm">
        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {TUTORIAL_STEPS.map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: i <= step ? 1 : 0.3 }}
              className={`h-1.5 rounded-full flex-1 ${i <= step ? 'bg-blue-500' : 'bg-gray-700'}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className={`relative rounded-3xl bg-gradient-to-br ${current.color} border ${current.border} p-7`}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-5xl mb-4">{current.emoji}</div>
            <h2 className="text-white text-2xl font-black mb-3">{current.title}</h2>
            <p className="text-gray-300 text-base leading-relaxed">{current.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3 mt-5">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => isLast ? handleClose() : setStep(s => s + 1)}
            className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2"
          >
            {isLast ? "I'm Ready! 💪" : (
              <>Next <ChevronRight className="w-4 h-4" /></>
            )}
          </motion.button>
        </div>

        <button onClick={handleClose} className="w-full mt-3 text-gray-600 text-sm py-2">
          Skip tutorial
        </button>
      </div>
    </motion.div>
  );
}