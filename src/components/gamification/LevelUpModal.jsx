import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';

export default function LevelUpModal({ show, level, xpGained, badge, onClose }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 4000);
      return () => clearTimeout(t);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.3, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-xs text-center"
          >
            {/* Confetti-like circles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: ['#f59e0b','#3b82f6','#22c55e','#ec4899','#8b5cf6','#f97316','#06b6d4','#ef4444'][i],
                  top: '50%',
                  left: '50%',
                }}
                initial={{ x: 0, y: 0, scale: 1 }}
                animate={{
                  x: (Math.cos((i / 8) * Math.PI * 2) * 120),
                  y: (Math.sin((i / 8) * Math.PI * 2) * 120),
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            ))}

            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-yellow-500/40 rounded-3xl p-8 shadow-2xl">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: 2, duration: 0.5 }}
                className="text-6xl mb-4"
              >
                ⭐
              </motion.div>

              {badge ? (
                <>
                  <h2 className="text-white text-2xl font-black mb-2">Badge Unlocked!</h2>
                  <p className="text-yellow-400 text-5xl mb-2">{badge.emoji}</p>
                  <p className="text-white font-bold text-lg">{badge.label}</p>
                </>
              ) : (
                <>
                  <h2 className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-2">Level Up!</h2>
                  <p className="text-white text-6xl font-black mb-2">{level}</p>
                  <p className="text-gray-400">You reached a new level!</p>
                </>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-green-400">
                <Star className="w-4 h-4" />
                <span className="font-bold">+{xpGained} XP</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}