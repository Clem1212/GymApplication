import React from 'react';
import { motion } from 'framer-motion';

export default function NutritionDisplay({ calories, protein, carbs, fat, items }) {
  const macros = [
    { label: 'Protein', value: protein, color: 'bg-blue-500', unit: 'g' },
    { label: 'Carbs', value: carbs, color: 'bg-green-500', unit: 'g' },
    { label: 'Fat', value: fat, color: 'bg-orange-500', unit: 'g' },
  ];

  const total = protein + carbs + fat;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Calories Display */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 p-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-green-500/20 rounded-full blur-3xl" />
        <p className="text-gray-400 text-sm mb-1">Total Calories</p>
        <p className="text-5xl font-black text-white">{calories}</p>
        <p className="text-green-400 text-sm mt-1">kcal</p>
      </div>

      {/* Macros */}
      <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5">
        <h4 className="text-white font-semibold mb-4">Macronutrients</h4>
        
        {/* Macro Bar */}
        <div className="h-4 rounded-full bg-gray-800 overflow-hidden flex mb-4">
          {macros.map((macro) => (
            <motion.div
              key={macro.label}
              initial={{ width: 0 }}
              animate={{ width: total > 0 ? `${(macro.value / total) * 100}%` : '0%' }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={`${macro.color} h-full`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {macros.map((macro, index) => (
            <motion.div
              key={macro.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`w-3 h-3 rounded-full ${macro.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-white">{macro.value}<span className="text-sm text-gray-400">{macro.unit}</span></p>
              <p className="text-xs text-gray-400">{macro.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Food Items */}
      {items && items.length > 0 && (
        <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5">
          <h4 className="text-white font-semibold mb-4">Detected Items</h4>
          <div className="space-y-2">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50"
              >
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-gray-400 text-xs">{item.portion}</p>
                </div>
                <p className="text-green-400 font-semibold">{item.calories} kcal</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}