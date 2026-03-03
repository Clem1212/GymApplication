import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dumbbell, Camera, Target, TrendingUp } from 'lucide-react';

const actions = [
  { icon: Dumbbell, label: 'Log Workout', page: 'WorkoutAnalysis', color: 'from-blue-500 to-blue-600' },
  { icon: Camera, label: 'Scan Food', page: 'FoodScanner', color: 'from-green-500 to-green-600' },
  { icon: Target, label: 'Set Goals', page: 'Goals', color: 'from-orange-500 to-orange-600' },
  { icon: TrendingUp, label: 'Progress', page: 'Progress', color: 'from-purple-500 to-purple-600' },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link to={createPageUrl(action.page)}>
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all hover:scale-105">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color}`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-400 text-center">{action.label}</span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}