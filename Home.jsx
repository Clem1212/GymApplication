import { db } from '@/api/base44Client';

import React, { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Flame, Utensils, Target, ChevronRight, Dumbbell, Play, Settings } from 'lucide-react';
import DuoStreak from '@/components/streak/DuoStreak';
import XPBar from '@/components/streak/XPBar';
import StreakCalendar from '@/components/streak/StreakCalendar';
import { getLocalStorage } from '@/components/hooks/useLocalStorage';

const GOAL_BANNERS = {
  weight_loss: { emoji: '🔥', label: 'Cutting', color: 'from-orange-500/20 to-red-500/10 border-orange-500/30', tip: 'Stay in a calorie deficit. Hit your protein target!' },
  muscle_gain: { emoji: '💪', label: 'Bulking', color: 'from-blue-500/20 to-purple-500/10 border-blue-500/30', tip: 'Eat above maintenance. Progressive overload every week.' },
  maintenance: { emoji: '⚖️', label: 'Maintenance', color: 'from-green-500/20 to-teal-500/10 border-green-500/30', tip: 'Consistency is the key. Show up every day.' },
  endurance: { emoji: '⚡', label: 'Endurance', color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30', tip: 'Cardio + strength. Build your engine.' },
};

export default function Home() {
  const [user, setUser] = useState(null);
  const profile = getLocalStorage('gymiq_profile', {});
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    db.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const list = await db.entities.UserProgress.list();
      return list[0] || null;
    },
  });

  const { data: todayWorkouts = [] } = useQuery({
    queryKey: ['todayWorkouts'],
    queryFn: () => db.entities.WorkoutSession.filter({ workout_date: today }),
  });

  const { data: todayMeals = [] } = useQuery({
    queryKey: ['todayMeals'],
    queryFn: () => db.entities.MealLog.filter({ meal_date: today }),
  });

  const { data: allWorkouts = [] } = useQuery({
    queryKey: ['allWorkoutsCalendar'],
    queryFn: () => db.entities.WorkoutSession.list('-workout_date', 60),
  });

  const { data: activePlan } = useQuery({
    queryKey: ['activePlan'],
    queryFn: async () => {
      const list = await db.entities.WorkoutPlan.filter({ is_active: true });
      return list[0] || null;
    },
  });

  const hasWorkedOutToday = todayWorkouts.length > 0;
  const todayCalories = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const dailyTarget = progress?.daily_calorie_target || 2000;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const todayPlanDay = activePlan?.schedule?.[((activePlan.current_day || 1) - 1) % activePlan.schedule.length];

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-gray-400 text-sm">{getGreeting()},</p>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-white mt-0.5">
              {profile?.nickname || user?.full_name?.split(' ')[0] || 'Athlete'} 💪
            </h1>
            <Link to={createPageUrl('Goals')}>
              <Settings className="w-5 h-5 text-gray-500 mt-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="px-5 space-y-5">
        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4"
        >
          <XPBar level={progress?.level || 1} xp={progress?.xp_points || 0} />
        </motion.div>

        {/* Duo Streak */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <DuoStreak
            currentStreak={progress?.current_streak || 0}
            longestStreak={progress?.longest_streak || 0}
            hasWorkedOutToday={hasWorkedOutToday}
          />
        </motion.div>

        {/* Today's Plan Card */}
        {activePlan && todayPlanDay ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to={createPageUrl('Plans')}>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-blue-500/30 p-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-xs font-medium uppercase tracking-widest mb-1">Today's Plan</p>
                    <p className="text-white font-bold text-lg">{activePlan.name}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{todayPlanDay.day}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl font-bold flex items-center gap-2 text-sm">
                      <Play className="w-4 h-4" />
                      Start
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to={createPageUrl('Plans')}>
              <div className="rounded-3xl border-2 border-dashed border-gray-700 p-5 flex items-center justify-between hover:border-blue-500/50 transition-colors">
                <div>
                  <p className="text-white font-semibold">Start a Workout Plan</p>
                  <p className="text-gray-500 text-sm">Choose calisthenics or weights</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Today's Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { icon: Dumbbell, label: 'Workouts', value: todayWorkouts.length, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-500/5 border-blue-500/20' },
            { icon: Utensils, label: 'Calories', value: todayCalories, color: 'text-green-400', bg: 'from-green-500/15 to-green-500/5 border-green-500/20', sub: `/${dailyTarget}` },
            { icon: Flame, label: 'Goal', value: progress?.fitness_goal?.replace('_', ' ') || 'Set goal', color: 'text-orange-400', bg: 'from-orange-500/15 to-orange-500/5 border-orange-500/20' },
          ].map((stat, i) => (
            <div key={i} className={`rounded-2xl bg-gradient-to-br ${stat.bg} border p-4`}>
              <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
              <p className="text-white font-bold text-lg leading-none">{stat.value}</p>
              {stat.sub && <p className="text-gray-500 text-xs">{stat.sub}</p>}
              <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <Link to={createPageUrl('WorkoutAnalysis')}>
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-5 flex items-center gap-3">
              <Dumbbell className="w-7 h-7 text-white" />
              <div>
                <p className="text-white font-bold">Analyze Form</p>
                <p className="text-blue-200 text-xs">AI critique</p>
              </div>
            </div>
          </Link>
          <Link to={createPageUrl('FoodScanner')}>
            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 p-5 flex items-center gap-3">
              <Utensils className="w-7 h-7 text-white" />
              <div>
                <p className="text-white font-bold">Scan Food</p>
                <p className="text-green-200 text-xs">Track calories</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Goal Banner */}
        {profile?.goal && (() => {
          const banner = GOAL_BANNERS[profile.goal];
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className={`rounded-2xl bg-gradient-to-br ${banner.color} border p-4 flex items-center gap-3`}
            >
              <span className="text-2xl">{banner.emoji}</span>
              <div>
                <p className="text-white font-bold text-sm">Goal: {banner.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{banner.tip}</p>
              </div>
            </motion.div>
          );
        })()}

        {/* Activity Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl bg-gray-900/50 border border-gray-800 p-5"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            🗓️ Activity Calendar
          </h3>
          <StreakCalendar workouts={allWorkouts} />
        </motion.div>
      </div>
    </div>
  );
}