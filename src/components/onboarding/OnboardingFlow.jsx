import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { setLocalStorage } from '@/components/hooks/useLocalStorage';

const STEPS = [
  {
    id: 'experience',
    title: "What's your experience level?",
    subtitle: 'Be honest — we\'ll customize your plan',
    type: 'choice',
    options: [
      { id: 'beginner', emoji: '🌱', label: 'Beginner', desc: 'Less than 6 months training' },
      { id: 'intermediate', emoji: '💪', label: 'Intermediate', desc: '6 months – 2 years' },
      { id: 'advanced', emoji: '🔥', label: 'Advanced', desc: '2+ years serious training' },
    ],
  },
  {
    id: 'goal',
    title: 'What\'s your #1 goal?',
    subtitle: 'This shapes your workout plan & nutrition',
    type: 'choice',
    options: [
      { id: 'weight_loss', emoji: '🔥', label: 'Cut & Lose Fat', desc: 'Drop body fat, get leaner' },
      { id: 'muscle_gain', emoji: '💪', label: 'Bulk & Build Muscle', desc: 'Gain size and strength' },
      { id: 'maintenance', emoji: '⚖️', label: 'Recomp / Maintain', desc: 'Stay lean, build slowly' },
      { id: 'endurance', emoji: '⚡', label: 'Endurance & Fitness', desc: 'Cardio, stamina, health' },
    ],
  },
  {
    id: 'training_type',
    title: 'How do you prefer to train?',
    subtitle: 'We\'ll build your program around this',
    type: 'choice',
    options: [
      { id: 'calisthenics', emoji: '🤸', label: 'Calisthenics', desc: 'Bodyweight — no gym needed' },
      { id: 'weighted', emoji: '🏋️', label: 'Gym / Weights', desc: 'Barbells, dumbbells, machines' },
      { id: 'mixed', emoji: '⚡', label: 'Both', desc: 'Mix of bodyweight & weights' },
    ],
  },
  {
    id: 'days_per_week',
    title: 'How many days can you train?',
    subtitle: 'Pick what you can actually stick to',
    type: 'choice',
    options: [
      { id: 2, emoji: '2️⃣', label: '2 days/week', desc: 'Minimum effective dose' },
      { id: 3, emoji: '3️⃣', label: '3 days/week', desc: 'The sweet spot for most' },
      { id: 4, emoji: '4️⃣', label: '4 days/week', desc: 'Serious commitment' },
      { id: 5, emoji: '5️⃣', label: '5+ days/week', desc: 'All-in athlete' },
    ],
  },
  {
    id: 'body_stats',
    title: 'A few quick numbers',
    subtitle: "We'll calculate your nutrition targets",
    type: 'stats',
  },
  {
    id: 'name',
    title: "Last thing — what should we call you?",
    subtitle: 'Your name on the leaderboard',
    type: 'name',
  },
];

function ChoiceStep({ step, value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {step.options.map((opt) => {
        const isSelected = value === opt.id;
        return (
          <motion.button
            key={opt.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt.id)}
            className={`relative text-left p-4 rounded-2xl border transition-all ${
              isSelected
                ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
            }`}
          >
            {isSelected && (
              <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="text-2xl mb-2">{opt.emoji}</div>
            <p className={`font-bold text-sm ${isSelected ? 'text-blue-300' : 'text-white'}`}>{opt.label}</p>
            <p className="text-gray-500 text-xs mt-0.5 leading-snug">{opt.desc}</p>
          </motion.button>
        );
      })}
    </div>
  );
}

function StatsStep({ value, onChange }) {
  const v = value || {};
  const update = (key, val) => onChange({ ...v, [key]: val });
  return (
    <div className="space-y-4">
      {[
        { key: 'current_weight', label: 'Current Weight (lbs)', placeholder: '165', emoji: '⚖️' },
        { key: 'goal_weight', label: 'Goal Weight (lbs)', placeholder: '175', emoji: '🎯' },
        { key: 'age', label: 'Age', placeholder: '25', emoji: '🎂' },
      ].map(({ key, label, placeholder, emoji }) => (
        <div key={key} className="rounded-2xl bg-gray-900/60 border border-gray-800 p-4">
          <label className="text-gray-400 text-xs mb-2 block">{emoji} {label}</label>
          <input
            type="number"
            value={v[key] || ''}
            onChange={e => update(key, e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-white text-2xl font-bold placeholder-gray-700 outline-none"
          />
        </div>
      ))}
      <p className="text-gray-600 text-xs text-center">These are optional but help personalize your nutrition</p>
    </div>
  );
}

function NameStep({ value, onChange }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gray-900/60 border border-gray-800 p-5">
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="Your name or nickname..."
          maxLength={20}
          className="w-full bg-transparent text-white text-3xl font-black placeholder-gray-700 outline-none"
          autoFocus
        />
      </div>
      <p className="text-gray-500 text-sm text-center">This appears on your profile and leaderboard</p>
    </div>
  );
}

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentStep = STEPS[step];
  const currentValue = answers[currentStep.id];
  const canAdvance = currentStep.type === 'stats' || currentStep.type === 'name' ? true : !!currentValue;
  const isLast = step === STEPS.length - 1;

  const handleAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [currentStep.id]: val }));
  };

  const next = () => {
    if (isLast) {
      // Calculate nutrition targets
      const weight = parseFloat(answers.body_stats?.current_weight) || 165;
      const goal = answers.goal;
      let calories, protein;
      if (goal === 'weight_loss') { calories = Math.round(weight * 12); protein = Math.round(weight * 1.2); }
      else if (goal === 'muscle_gain') { calories = Math.round(weight * 18); protein = Math.round(weight * 1.0); }
      else { calories = Math.round(weight * 15); protein = Math.round(weight * 0.9); }

      const profile = {
        nickname: answers.name || 'Athlete',
        experience: answers.experience,
        goal: answers.goal,
        training_type: answers.training_type,
        days_per_week: answers.days_per_week,
        current_weight: parseFloat(answers.body_stats?.current_weight) || null,
        goal_weight: parseFloat(answers.body_stats?.goal_weight) || null,
        age: parseInt(answers.body_stats?.age) || null,
        daily_calorie_target: calories,
        daily_protein_target: protein,
        completed_at: new Date().toISOString(),
      };
      setLocalStorage('gymiq_profile', profile);
      setLocalStorage('gymiq_onboarding_done', true);
      onComplete(profile);
    } else {
      setStep(s => s + 1);
    }
  };

  const back = () => setStep(s => s - 1);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0A0A0F]">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-12 pb-6">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            animate={{ width: i === step ? 24 : 8, opacity: i <= step ? 1 : 0.3 }}
            className={`h-2 rounded-full ${i <= step ? 'bg-blue-500' : 'bg-gray-700'}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-black text-white leading-tight">{currentStep.title}</h1>
              <p className="text-gray-400 mt-2">{currentStep.subtitle}</p>
            </div>

            {currentStep.type === 'choice' && (
              <ChoiceStep step={currentStep} value={currentValue} onChange={handleAnswer} />
            )}
            {currentStep.type === 'stats' && (
              <StatsStep value={currentValue} onChange={handleAnswer} />
            )}
            {currentStep.type === 'name' && (
              <NameStep value={currentValue} onChange={handleAnswer} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-10 pt-4 flex items-center gap-3">
        {step > 0 && (
          <button
            onClick={back}
            className="w-12 h-14 rounded-2xl bg-gray-800 flex items-center justify-center flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
        )}
        <motion.button
          onClick={next}
          disabled={!canAdvance}
          whileTap={{ scale: 0.97 }}
          className={`flex-1 h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            canAdvance
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isLast ? "Let's Go! 🚀" : 'Continue'}
          {!isLast && <ChevronRight className="w-5 h-5" />}
        </motion.button>
      </div>
    </div>
  );
}