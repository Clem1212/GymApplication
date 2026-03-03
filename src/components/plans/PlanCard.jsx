import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Dumbbell, ChevronRight, CheckCircle2 } from 'lucide-react';

const difficultyColors = {
  beginner: 'text-green-400 bg-green-400/10 border-green-400/20',
  intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  advanced: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const typeColors = {
  calisthenics: 'from-purple-500/20 to-blue-500/10 border-purple-500/30',
  weighted: 'from-orange-500/20 to-red-500/10 border-orange-500/30',
  mixed: 'from-green-500/20 to-teal-500/10 border-green-500/30',
};

export default function PlanCard({ plan, isActive, onStart, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onStart}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${typeColors[plan.type]} border p-5 cursor-pointer active:scale-95 transition-transform`}
    >
      {isActive && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="text-4xl">{plan.emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-tight">{plan.name}</h3>
          <p className="text-gray-400 text-sm mt-0.5">{plan.description}</p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[plan.difficulty]} font-medium`}>
              {plan.difficulty}
            </span>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Calendar className="w-3 h-3" />
              {plan.days_per_week}x/week
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Clock className="w-3 h-3" />
              {plan.weeks_duration} weeks
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
      </div>
    </motion.div>
  );
}