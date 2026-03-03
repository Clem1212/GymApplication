const db = globalThis.__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } }
};

import React, { useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ChevronLeft, Dumbbell, Zap, Filter, CheckCircle2, Star, Trophy } from 'lucide-react';
import { WORKOUT_PLANS } from '@/components/data/exercises';
import { getLocalStorage } from '@/components/hooks/useLocalStorage';
import PlanCard from '@/components/plans/PlanCard';
import TodayWorkout from '@/components/plans/TodayWorkout';
import LevelUpModal from '@/components/gamification/LevelUpModal';

export default function Plans() {
  const profile = getLocalStorage('gymiq_profile', {});
  const [filter, setFilter] = useState(profile?.training_type || 'all');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [levelUpData, setLevelUpData] = useState(null);
  const queryClient = useQueryClient();

  const { data: activePlan, refetch: refetchPlan } = useQuery({
    queryKey: ['activePlan'],
    queryFn: async () => {
      const list = await db.entities.WorkoutPlan.filter({ is_active: true });
      return list[0] || null;
    },
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const list = await db.entities.UserProgress.list();
      return list[0] || null;
    },
  });

  const today = format(new Date(), 'yyyy-MM-dd');
  const hasWorkedOutToday = activePlan?.completed_days?.includes(today);

  const currentDayIndex = activePlan ? ((activePlan.current_day || 1) - 1) % (activePlan.schedule?.length || 1) : 0;
  const todaySchedule = activePlan?.schedule?.[currentDayIndex];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'calisthenics', label: '🤸 Bodyweight' },
    { id: 'weighted', label: '🏋️ Weighted' },
    { id: 'mixed', label: '⚡ Mixed' },
  ];

  const filtered = filter === 'all' ? WORKOUT_PLANS : WORKOUT_PLANS.filter(p => p.type === filter);

  const startPlan = async (plan) => {
    // Deactivate current plans
    const existing = await db.entities.WorkoutPlan.list();
    for (const p of existing) {
      if (p.is_active) await db.entities.WorkoutPlan.update(p.id, { is_active: false });
    }
    // Create new active plan
    await db.entities.WorkoutPlan.create({
      ...plan,
      is_active: true,
      current_week: 1,
      current_day: 1,
      completed_days: [],
    });
    refetchPlan();
    queryClient.invalidateQueries(['activePlan']);
    setSelectedPlan(null);
  };

  const completeWorkout = async () => {
    if (!activePlan || hasWorkedOutToday) return;

    const completedDays = [...(activePlan.completed_days || []), today];
    const nextDay = (activePlan.current_day || 1) + 1;
    const nextWeek = nextDay > (activePlan.days_per_week || 3) * (activePlan.current_week || 1)
      ? (activePlan.current_week || 1) + 1 : activePlan.current_week;

    await db.entities.WorkoutPlan.update(activePlan.id, {
      completed_days: completedDays,
      current_day: nextDay,
      current_week: nextWeek,
    });

    // Save workout session
    await db.entities.WorkoutSession.create({
      exercise_name: todaySchedule?.focus || 'Workout',
      workout_date: today,
      calories_burned: 200,
    });

    // Update progress
    const XP_GAINED = 150;
    const progressList = await db.entities.UserProgress.list();
    let p = progressList[0];
    if (p) {
      const lastDate = p.last_workout_date;
      let streak = p.current_streak || 0;
      if (lastDate !== today) {
        const diff = lastDate ? (new Date(today) - new Date(lastDate)) / 86400000 : 999;
        streak = diff <= 1 ? streak + 1 : 1;
      }
      const newXp = (p.xp_points || 0) + XP_GAINED;
      const newLevel = Math.floor(newXp / 500) + 1;
      const oldLevel = p.level || 1;
      const newBadges = [...(p.badges || [])];
      if (streak >= 7 && !newBadges.includes('streak_7')) newBadges.push('streak_7');
      if (streak >= 30 && !newBadges.includes('streak_30')) newBadges.push('streak_30');
      if (newLevel >= 5 && !newBadges.includes('level_5')) newBadges.push('level_5');

      await db.entities.UserProgress.update(p.id, {
        current_streak: streak,
        longest_streak: Math.max(streak, p.longest_streak || 0),
        total_workouts: (p.total_workouts || 0) + 1,
        xp_points: newXp,
        level: newLevel,
        badges: newBadges,
        last_workout_date: today,
      });

      if (newLevel > oldLevel) {
        setLevelUpData({ level: newLevel, xpGained: XP_GAINED });
      } else {
        setLevelUpData({ level: null, xpGained: XP_GAINED });
      }
    }

    queryClient.invalidateQueries(['activePlan', 'userProgress', 'todayWorkouts', 'allWorkoutsCalendar']);
    refetchPlan();
  };

  return (
    <div className="min-h-screen pb-28">
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-black text-white">Workout Plans</h1>
        <p className="text-gray-400 text-sm mt-1">Choose your training path</p>
      </div>

      <div className="px-5 space-y-5">
        {/* Active plan today workout */}
        {activePlan && todaySchedule && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {hasWorkedOutToday ? (
              <div className="rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 p-5 flex items-center gap-4">
                <CheckCircle2 className="w-10 h-10 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-bold text-lg">Today's workout done!</p>
                  <p className="text-gray-400 text-sm">Come back tomorrow for the next session</p>
                </div>
              </div>
            ) : (
              <TodayWorkout
                daySchedule={todaySchedule}
                onComplete={completeWorkout}
              />
            )}
          </motion.div>
        )}

        {/* Active plan info */}
        {activePlan && (
          <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest">Active Plan</p>
              <p className="text-white font-bold">{activePlan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-400 font-bold">Day {activePlan.current_day}</p>
              <p className="text-gray-500 text-xs">Week {activePlan.current_week}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                filter === f.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Recommended tag */}
        {profile?.experience && profile?.goal && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-gray-400 text-sm">
              Recommended for <span className="text-white font-medium">{profile.experience}</span> • {profile.goal?.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Plan list */}
        <div className="space-y-3">
          {filtered.map((plan, i) => {
            const isRecommended = profile?.experience && plan.difficulty === profile.experience && profile?.training_type && (plan.type === profile.training_type || profile.training_type === 'mixed');
            return (
              <div key={plan.name} className="relative">
                {isRecommended && (
                  <div className="absolute -top-1 left-4 z-10 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                    ⭐ RECOMMENDED
                  </div>
                )}
                <PlanCard
                  plan={plan}
                  isActive={activePlan?.name === plan.name}
                  onStart={() => setSelectedPlan(plan)}
                  delay={i * 0.08}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan Preview Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="w-full bg-gray-950 border-t border-gray-800 rounded-t-3xl p-6 pb-10 max-h-[80vh] overflow-y-auto"
            >
              <div className="text-center mb-6">
                <p className="text-5xl mb-2">{selectedPlan.emoji}</p>
                <h2 className="text-white text-2xl font-black">{selectedPlan.name}</h2>
                <p className="text-gray-400 mt-1">{selectedPlan.description}</p>
              </div>

              {/* Schedule preview */}
              <div className="space-y-3 mb-6">
                {selectedPlan.schedule?.map((day, i) => (
                  <div key={i} className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
                    <p className="text-white font-semibold mb-2">{day.day}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {day.exercises.map((ex, j) => (
                        <span key={j} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                          {ex.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => startPlan(selectedPlan)}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-lg"
              >
                Start This Plan 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LevelUpModal
        show={!!levelUpData}
        level={levelUpData?.level}
        xpGained={levelUpData?.xpGained || 0}
        onClose={() => setLevelUpData(null)}
      />
    </div>
  );
}