import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy } from 'lucide-react';

export default function StreakDisplay({ currentStreak, longestStreak, level, xp }) {
  const xpForNextLevel = level * 500;
  const xpProgress = (xp % 500) / 500 * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500/10 via-red-500/10 to-purple-500/10 border border-orange-500/20 p-6"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center glow-effect">
              <Flame className="w-8 h-8 text-white" />
            </div>
            {currentStreak >= 7 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-xs">🔥</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-gray-400 text-sm">Current Streak</p>
            <p className="text-4xl font-black text-white">{currentStreak} <span className="text-lg text-gray-400">days</span></p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-400 text-sm">Best: {longestStreak} days</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Level {level}</span>
          <span className="text-blue-400">{xp % 500} / 500 XP</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}