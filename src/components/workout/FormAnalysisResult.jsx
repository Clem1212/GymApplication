import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function FormAnalysisResult({ analysis, score, improvements }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Score Display */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-800"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "251.2", strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * score / 100) }}
                transition={{ duration: 1, delay: 0.3 }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#f97316'} />
                  <stop offset="100%" stopColor={score >= 80 ? '#10b981' : score >= 60 ? '#f97316' : '#ef4444'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Form Score</h3>
            <p className="text-gray-400 text-sm">
              {score >= 80 ? 'Excellent technique!' : score >= 60 ? 'Good, with room for improvement' : 'Needs work on form'}
            </p>
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5">
        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          AI Analysis
        </h4>
        <p className="text-gray-300 text-sm leading-relaxed">{analysis}</p>
      </div>

      {/* Improvements */}
      {improvements && improvements.length > 0 && (
        <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5">
          <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            Areas to Improve
          </h4>
          <div className="space-y-3">
            {improvements.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20"
              >
                <span className="text-orange-400 font-bold">{index + 1}</span>
                <p className="text-gray-300 text-sm">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}