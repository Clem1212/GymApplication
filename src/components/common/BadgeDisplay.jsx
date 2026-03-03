import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Dumbbell, Target, Zap, Star, Crown, Medal } from 'lucide-react';

const badgeConfig = {
  'first_workout': { icon: Dumbbell, color: 'from-blue-500 to-blue-600', label: 'First Workout' },
  'streak_7': { icon: Flame, color: 'from-orange-500 to-red-500', label: '7 Day Streak' },
  'streak_30': { icon: Flame, color: 'from-red-500 to-pink-500', label: '30 Day Streak' },
  'perfect_form': { icon: Target, color: 'from-green-500 to-emerald-500', label: 'Perfect Form' },
  'calories_1000': { icon: Zap, color: 'from-yellow-500 to-orange-500', label: '1K Calories Burned' },
  'level_5': { icon: Star, color: 'from-purple-500 to-pink-500', label: 'Level 5' },
  'level_10': { icon: Crown, color: 'from-yellow-400 to-yellow-600', label: 'Level 10' },
  'workouts_50': { icon: Medal, color: 'from-cyan-500 to-blue-500', label: '50 Workouts' },
};

export default function BadgeDisplay({ badges = [], compact = false }) {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No badges yet</p>
        <p className="text-gray-500 text-sm">Complete workouts to earn badges!</p>
      </div>
    );
  }

  return (
    <div className={`grid ${compact ? 'grid-cols-4 gap-3' : 'grid-cols-3 gap-4'}`}>
      {badges.map((badgeId, index) => {
        const badge = badgeConfig[badgeId];
        if (!badge) return null;
        
        return (
          <motion.div
            key={badgeId}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex flex-col items-center ${compact ? 'p-2' : 'p-4'} rounded-2xl bg-gray-900/50 border border-gray-800`}
          >
            <div className={`${compact ? 'w-10 h-10' : 'w-14 h-14'} rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center mb-2`}>
              <badge.icon className={`${compact ? 'w-5 h-5' : 'w-7 h-7'} text-white`} />
            </div>
            <p className={`text-white font-medium text-center ${compact ? 'text-xs' : 'text-sm'}`}>{badge.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}