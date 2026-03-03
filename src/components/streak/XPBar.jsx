import React from 'react';
import { motion } from 'framer-motion';

const LEVEL_TITLES = [
  '', 'Rookie', 'Hustler', 'Grinder', 'Athlete', 'Beast',
  'Warrior', 'Champion', 'Elite', 'Legend', 'GOD MODE'
];

export default function XPBar({ level, xp }) {
  const xpPerLevel = 500;
  const currentLevelXp = xp % xpPerLevel;
  const progress = (currentLevelXp / xpPerLevel) * 100;
  const title = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)];

  return (
    <div className="flex items-center gap-3">
      {/* Level badge */}
      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center shadow-lg">
        <span className="text-white text-xs font-bold leading-none">LVL</span>
        <span className="text-white text-lg font-black leading-none">{level}</span>
      </div>

      {/* XP bar */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-white font-semibold text-sm">{title}</span>
          <span className="text-blue-400 text-xs">{currentLevelXp} / {xpPerLevel} XP</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}