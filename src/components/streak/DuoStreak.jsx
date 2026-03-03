import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Shield, Zap } from 'lucide-react';

const STREAK_MILESTONES = [3, 7, 14, 21, 30, 60, 100];

function StreakParticle({ x, y }) {
  return (
    <motion.div
      className="absolute text-lg pointer-events-none"
      initial={{ x, y, opacity: 1, scale: 1 }}
      animate={{ x: x + (Math.random() - 0.5) * 80, y: y - 80, opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.8 }}
    >
      🔥
    </motion.div>
  );
}

export default function DuoStreak({ currentStreak = 0, longestStreak = 0, hasWorkedOutToday = false }) {
  const [showParticles, setShowParticles] = useState(false);
  const nextMilestone = STREAK_MILESTONES.find(m => m > currentStreak) || 100;
  const prevMilestone = STREAK_MILESTONES.filter(m => m <= currentStreak).pop() || 0;
  const milestoneProgress = ((currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;

  const flameSize = currentStreak === 0 ? 'scale-75 opacity-40' : currentStreak >= 30 ? 'scale-125' : 'scale-100';

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl p-6"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', border: '1px solid rgba(251,146,60,0.3)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl transition-all duration-1000 ${currentStreak > 0 ? 'bg-orange-500/20' : 'bg-gray-500/10'}`} />
      </div>

      <div className="relative flex items-center gap-5">
        {/* Flame */}
        <motion.div
          className={`relative flex-shrink-0 ${flameSize} transition-transform duration-500`}
          animate={hasWorkedOutToday ? { scale: [1, 1.15, 1], rotate: [-3, 3, -3, 0] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          onTap={() => setShowParticles(true)}
        >
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
            currentStreak === 0 ? 'bg-gray-800' :
            currentStreak >= 30 ? 'bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400' :
            'bg-gradient-to-br from-orange-500 to-red-500'
          }`}>
            <Flame className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          {currentStreak >= 7 && (
            <motion.div
              className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ⚡
            </motion.div>
          )}
          {showParticles && (
            <>
              {[...Array(5)].map((_, i) => (
                <StreakParticle key={i} x={Math.random() * 40 - 20} y={0} />
              ))}
            </>
          )}
        </motion.div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-black text-white">{currentStreak}</span>
            <span className="text-gray-400 text-lg font-medium">day streak</span>
          </div>

          {/* Milestone progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{currentStreak} days</span>
              <span>Next: {nextMilestone} days 🏆</span>
            </div>
            <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-400"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(milestoneProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-yellow-500">
              <Shield className="w-3 h-3" />
              <span>Best: {longestStreak}d</span>
            </div>
            {hasWorkedOutToday ? (
              <div className="flex items-center gap-1 text-green-400">
                <Zap className="w-3 h-3" />
                <span>Streak protected today!</span>
              </div>
            ) : (
              <div className="text-orange-400/80 text-xs">Log a workout to keep streak!</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}