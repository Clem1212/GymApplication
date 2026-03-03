import React from 'react';
import { motion } from 'framer-motion';
import { format, subDays, startOfWeek, eachDayOfInterval } from 'date-fns';

export default function StreakCalendar({ workouts = [] }) {
  const today = new Date();
  const start = startOfWeek(subDays(today, 20));
  const days = eachDayOfInterval({ start, end: today });

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
        <div key={i} className="text-center text-gray-600 text-[10px] font-medium pb-1">{d}</div>
      ))}
      {days.map((day, index) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const isActive = workouts.some(w => w.workout_date === dateStr);
        const isToday = dateStr === format(today, 'yyyy-MM-dd');
        return (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.015, type: 'spring' }}
            className={`
              aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold
              ${isActive ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30' : 'bg-gray-800/60 text-gray-600'}
              ${isToday ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-gray-900' : ''}
            `}
          >
            {isActive ? '✓' : format(day, 'd')}
          </motion.div>
        );
      })}
    </div>
  );
}