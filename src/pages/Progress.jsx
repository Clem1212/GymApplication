const db = globalThis.__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } }
};

import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format, subDays, startOfWeek, eachDayOfInterval } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, Flame, Dumbbell, Trophy, Calendar } from 'lucide-react';
import BadgeDisplay from '@/components/common/BadgeDisplay';
import { getLocalStorage } from '@/components/hooks/useLocalStorage';

export default function Progress() {
  const profile = getLocalStorage('gymiq_profile', {});

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const list = await db.entities.UserProgress.list();
      return list[0] || null;
    },
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ['allWorkouts'],
    queryFn: () => db.entities.WorkoutSession.list('-workout_date', 100),
  });

  const { data: meals = [] } = useQuery({
    queryKey: ['allMeals'],
    queryFn: () => db.entities.MealLog.list('-meal_date', 100),
  });

  // Generate weekly data
  const getLast7DaysData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const dayWorkouts = workouts.filter(w => w.workout_date === date);
      const dayMeals = meals.filter(m => m.meal_date === date);
      
      days.push({
        day: format(subDays(new Date(), i), 'EEE'),
        workouts: dayWorkouts.length,
        calories: dayMeals.reduce((sum, m) => sum + (m.calories || 0), 0),
        burned: dayWorkouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0),
      });
    }
    return days;
  };

  const weeklyData = getLast7DaysData();
  const totalWeeklyWorkouts = weeklyData.reduce((sum, d) => sum + d.workouts, 0);
  const avgDailyCalories = Math.round(weeklyData.reduce((sum, d) => sum + d.calories, 0) / 7);

  // Activity calendar data
  const getActivityCalendar = () => {
    const today = new Date();
    const start = startOfWeek(subDays(today, 28));
    const days = eachDayOfInterval({ start, end: today });
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const hasWorkout = workouts.some(w => w.workout_date === dateStr);
      return {
        date: day,
        active: hasWorkout,
      };
    });
  };

  const calendarData = getActivityCalendar();

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-white">Your Progress</h1>
        <p className="text-gray-400 text-sm mt-1">Track your fitness journey</p>
      </div>

      <div className="px-5 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/30 p-4"
          >
            <Dumbbell className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">{progress?.total_workouts || 0}</p>
            <p className="text-xs text-gray-400">Total Workouts</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-orange-500/30 p-4"
          >
            <Flame className="w-5 h-5 text-orange-400 mb-2" />
            <p className="text-2xl font-bold text-white">{(progress?.total_calories_burned || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-400">Calories Burned</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/30 p-4"
          >
            <Trophy className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">{progress?.longest_streak || 0}</p>
            <p className="text-xs text-gray-400">Best Streak</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/30 p-4"
          >
            <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">{totalWeeklyWorkouts}</p>
            <p className="text-xs text-gray-400">This Week</p>
          </motion.div>
        </div>

        {/* Activity Calendar */}
        <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-medium">Activity Calendar</h3>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-gray-500 text-xs py-1">{day}</div>
            ))}
            {calendarData.map((day, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`aspect-square rounded-lg ${
                  day.active
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gray-800/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5">
          <h3 className="text-white font-medium mb-4">Weekly Calories</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCalories)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <span className="text-gray-400">Avg: {avgDailyCalories} kcal/day</span>
          </div>
        </div>

        {/* Profile Summary */}
        {profile?.nickname && (
          <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5">
            <h3 className="text-white font-medium mb-3">Your Profile</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Goal', value: profile.goal?.replace('_', ' ') || '—' },
                { label: 'Experience', value: profile.experience || '—' },
                { label: 'Training', value: profile.training_type || '—' },
                { label: 'Days/week', value: `${profile.days_per_week || '—'} days` },
                { label: 'Calorie target', value: `${profile.daily_calorie_target || '—'} kcal` },
                { label: 'Protein target', value: `${profile.daily_protein_target || '—'}g` },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-800/50">
                  <p className="text-gray-500 text-xs">{item.label}</p>
                  <p className="text-white font-semibold text-sm mt-0.5 capitalize">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-5">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Achievements
          </h3>
          <BadgeDisplay badges={progress?.badges || []} />
        </div>
      </div>
    </div>
  );
}