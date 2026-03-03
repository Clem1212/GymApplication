export const CALISTHENICS = {
  push: [
    { name: "Standard Push-Up", muscles: "Chest, Shoulders, Triceps", difficulty: "beginner", tips: "Keep body straight, hands shoulder-width apart, chest to floor." },
    { name: "Diamond Push-Up", muscles: "Triceps, Inner Chest", difficulty: "intermediate", tips: "Form a diamond shape with index fingers and thumbs. Keep elbows close." },
    { name: "Archer Push-Up", muscles: "Chest, Shoulders (unilateral)", difficulty: "advanced", tips: "Extend one arm to the side as you lower. Builds toward one-arm push-up." },
    { name: "Decline Push-Up", muscles: "Upper Chest, Shoulders", difficulty: "intermediate", tips: "Feet elevated on a box or bench. Keep core tight throughout." },
    { name: "Pike Push-Up", muscles: "Shoulders, Upper Chest", difficulty: "intermediate", tips: "Hips high, form an inverted V. Lower head toward floor." },
    { name: "Handstand Push-Up", muscles: "Shoulders, Triceps", difficulty: "advanced", tips: "Use wall for support. Keep abs braced and lower slowly." },
  ],
  pull: [
    { name: "Wide Grip Pull-Up", muscles: "Lats, Upper Back", difficulty: "intermediate", tips: "Grip wider than shoulders. Drive elbows down and back. Full hang at bottom." },
    { name: "Chin-Up", muscles: "Biceps, Lats", difficulty: "beginner", tips: "Supinated (palms facing you) grip. Great for bicep development." },
    { name: "Archer Pull-Up", muscles: "Lats (unilateral)", difficulty: "advanced", tips: "Extend one arm straight as you pull to the other side. Works toward one-arm." },
    { name: "Australian Pull-Up", muscles: "Back, Biceps, Rear Delts", difficulty: "beginner", tips: "Body at an angle under a bar, heels on floor. Great for beginners." },
    { name: "Muscle-Up", muscles: "Full Upper Body", difficulty: "advanced", tips: "Explosive pull above the bar transitioning into a dip. Requires strong pull and false grip." },
  ],
  legs: [
    { name: "Bodyweight Squat", muscles: "Quads, Glutes, Hamstrings", difficulty: "beginner", tips: "Feet shoulder-width, toes slightly out. Sit back into hips, chest up." },
    { name: "Pistol Squat", muscles: "Quads, Glutes, Balance", difficulty: "advanced", tips: "Single leg squat to full depth. Keep extended leg straight. Use counter weight to start." },
    { name: "Lunge", muscles: "Quads, Glutes, Hamstrings", difficulty: "beginner", tips: "Step forward, lower back knee toward floor. Keep front shin vertical." },
    { name: "Jump Squat", muscles: "Quads, Glutes, Calves (explosive)", difficulty: "intermediate", tips: "Squat to parallel, explode upward. Land softly, absorbing through hips." },
  ],
  core: [
    { name: "Plank", muscles: "Core, Shoulders", difficulty: "beginner", tips: "Straight line from head to heels. Squeeze glutes and abs. Breathe steadily." },
    { name: "Side Plank", muscles: "Obliques, Core", difficulty: "intermediate", tips: "Stack feet or stagger. Keep hips raised. Don't let them sag." },
    { name: "Hollow Body Hold", muscles: "Core, Hip Flexors", difficulty: "intermediate", tips: "Press lower back into floor, arms overhead, legs raised. Classic gymnastic core move." },
    { name: "L-Sit", muscles: "Core, Hip Flexors, Triceps", difficulty: "advanced", tips: "Support weight on hands, legs parallel to floor. Build with tuck L-sit first." },
  ],
  full: [
    { name: "Burpee", muscles: "Full Body", difficulty: "intermediate", tips: "Squat thrust, push-up, jump up. Keep pace smooth. Great for conditioning." },
    { name: "Handstand Hold", muscles: "Shoulders, Core, Balance", difficulty: "advanced", tips: "Kick up against wall. Stack wrists, shoulders, hips, heels. Gaze at floor." },
    { name: "Dip", muscles: "Chest, Triceps, Shoulders", difficulty: "intermediate", tips: "Parallel bars. Lower until elbows at 90°. Lean forward for chest, upright for triceps." },
  ],
};

export const WEIGHTED = {
  legs: [
    { name: "Barbell Squat", muscles: "Quads, Glutes, Hamstrings", difficulty: "intermediate", tips: "Bar on upper traps, feet shoulder-width. Break at hips and knees simultaneously. Keep chest up." },
    { name: "Romanian Deadlift", muscles: "Hamstrings, Glutes, Lower Back", difficulty: "intermediate", tips: "Hinge at hips, slight bend in knees. Feel stretch in hamstrings. Bar stays close to legs." },
    { name: "Leg Press", muscles: "Quads, Glutes, Hamstrings", difficulty: "beginner", tips: "Feet high and wide for glutes, low and narrow for quads. Don't lock knees." },
    { name: "Dumbbell Lunge", muscles: "Quads, Glutes, Hamstrings", difficulty: "beginner", tips: "Hold dumbbells at sides. Step forward and lower. Keep torso upright." },
    { name: "Deadlift", muscles: "Full Posterior Chain", difficulty: "intermediate", tips: "Hips back, chest up, bar over mid-foot. Drive through floor. Lock out hips at top." },
  ],
  push: [
    { name: "Bench Press", muscles: "Chest, Shoulders, Triceps", difficulty: "intermediate", tips: "Arch back slightly, feet flat. Touch bar to chest, drive up. Maintain shoulder retraction." },
    { name: "Overhead Press", muscles: "Shoulders, Triceps, Upper Back", difficulty: "intermediate", tips: "Bar at collarbone. Press overhead, slightly back. Lock out fully at top." },
  ],
  pull: [
    { name: "Barbell Row", muscles: "Back, Biceps, Rear Delts", difficulty: "intermediate", tips: "Hinge forward ~45°. Pull bar to lower chest. Squeeze scapula at top." },
    { name: "Cable Row", muscles: "Mid Back, Biceps", difficulty: "beginner", tips: "Sit tall, drive elbows back. Squeeze at peak contraction. Control the return." },
    { name: "Weighted Pull-Up", muscles: "Lats, Biceps, Upper Back", difficulty: "advanced", tips: "Add weight via belt or vest. Same form as bodyweight. Full range of motion." },
    { name: "Lat Pulldown", muscles: "Lats, Biceps", difficulty: "beginner", tips: "Lean slightly back, pull bar to chest. Drive elbows down. Control the eccentric." },
  ],
};

export const ALL_EXERCISES = [
  ...Object.values(CALISTHENICS).flat().map(e => ({ ...e, category: "calisthenics" })),
  ...Object.values(WEIGHTED).flat().map(e => ({ ...e, category: "weighted" })),
];

export const WORKOUT_PLANS = [
  {
    name: "Calisthenics Fundamentals",
    type: "calisthenics",
    difficulty: "beginner",
    goal: "muscle_gain",
    days_per_week: 3,
    weeks_duration: 8,
    emoji: "🤸",
    description: "Master the basics of bodyweight training",
    schedule: [
      {
        day: "Day 1 — Push",
        focus: "Push",
        exercises: [
          { name: "Standard Push-Up", category: "calisthenics", sets: 3, reps: "8-12", rest_seconds: 60, notes: "Keep body tight" },
          { name: "Diamond Push-Up", category: "calisthenics", sets: 3, reps: "6-10", rest_seconds: 60, notes: "Focus on triceps" },
          { name: "Pike Push-Up", category: "calisthenics", sets: 3, reps: "8-10", rest_seconds: 90, notes: "Shoulder builder" },
          { name: "Dip", category: "calisthenics", sets: 3, reps: "8-12", rest_seconds: 90, notes: "Use chair or bars" },
          { name: "Plank", category: "calisthenics", sets: 3, reps: "30-60s", rest_seconds: 60, notes: "Rock solid core" },
        ]
      },
      {
        day: "Day 2 — Pull",
        focus: "Pull",
        exercises: [
          { name: "Australian Pull-Up", category: "calisthenics", sets: 3, reps: "8-12", rest_seconds: 90, notes: "Great for beginners" },
          { name: "Chin-Up", category: "calisthenics", sets: 3, reps: "5-8", rest_seconds: 120, notes: "Use bands if needed" },
          { name: "Wide Grip Pull-Up", category: "calisthenics", sets: 3, reps: "4-6", rest_seconds: 120, notes: "Full hang at bottom" },
          { name: "Hollow Body Hold", category: "calisthenics", sets: 3, reps: "20-40s", rest_seconds: 60, notes: "Press lower back down" },
        ]
      },
      {
        day: "Day 3 — Legs & Core",
        focus: "Legs",
        exercises: [
          { name: "Bodyweight Squat", category: "calisthenics", sets: 4, reps: "15-20", rest_seconds: 60, notes: "Full depth" },
          { name: "Lunge", category: "calisthenics", sets: 3, reps: "10 each", rest_seconds: 60, notes: "Alternate legs" },
          { name: "Jump Squat", category: "calisthenics", sets: 3, reps: "10", rest_seconds: 90, notes: "Land softly" },
          { name: "Side Plank", category: "calisthenics", sets: 3, reps: "20-30s each", rest_seconds: 45, notes: "Each side" },
          { name: "Burpee", category: "calisthenics", sets: 3, reps: "8-10", rest_seconds: 90, notes: "Smooth and steady" },
        ]
      }
    ]
  },
  {
    name: "Calisthenics Advanced",
    type: "calisthenics",
    difficulty: "advanced",
    goal: "strength",
    days_per_week: 4,
    weeks_duration: 10,
    emoji: "💪",
    description: "Unlock muscle-ups, pistol squats & handstands",
    schedule: [
      {
        day: "Day 1 — Push Power",
        focus: "Push",
        exercises: [
          { name: "Archer Push-Up", category: "calisthenics", sets: 4, reps: "6 each", rest_seconds: 90, notes: "Slow and controlled" },
          { name: "Decline Push-Up", category: "calisthenics", sets: 4, reps: "10-15", rest_seconds: 60 },
          { name: "Handstand Push-Up", category: "calisthenics", sets: 3, reps: "4-6", rest_seconds: 120, notes: "Use wall for support" },
          { name: "Dip", category: "calisthenics", sets: 4, reps: "12-15", rest_seconds: 90 },
          { name: "L-Sit", category: "calisthenics", sets: 4, reps: "10-20s", rest_seconds: 60 },
        ]
      },
      {
        day: "Day 2 — Pull Power",
        focus: "Pull",
        exercises: [
          { name: "Muscle-Up", category: "calisthenics", sets: 3, reps: "3-5", rest_seconds: 180, notes: "Explosive pull" },
          { name: "Archer Pull-Up", category: "calisthenics", sets: 3, reps: "4 each", rest_seconds: 120 },
          { name: "Wide Grip Pull-Up", category: "calisthenics", sets: 4, reps: "8-10", rest_seconds: 90 },
          { name: "Chin-Up", category: "calisthenics", sets: 3, reps: "10-12", rest_seconds: 90 },
        ]
      },
      {
        day: "Day 3 — Legs & Balance",
        focus: "Legs",
        exercises: [
          { name: "Pistol Squat", category: "calisthenics", sets: 4, reps: "5 each", rest_seconds: 120, notes: "Use support if needed" },
          { name: "Jump Squat", category: "calisthenics", sets: 3, reps: "12", rest_seconds: 90 },
          { name: "Lunge", category: "calisthenics", sets: 3, reps: "12 each", rest_seconds: 60 },
          { name: "Handstand Hold", category: "calisthenics", sets: 4, reps: "20-45s", rest_seconds: 90 },
        ]
      },
      {
        day: "Day 4 — Full Body Conditioning",
        focus: "Full Body",
        exercises: [
          { name: "Burpee", category: "calisthenics", sets: 4, reps: "12-15", rest_seconds: 90 },
          { name: "Standard Push-Up", category: "calisthenics", sets: 3, reps: "20", rest_seconds: 60 },
          { name: "Australian Pull-Up", category: "calisthenics", sets: 3, reps: "15", rest_seconds: 60 },
          { name: "Hollow Body Hold", category: "calisthenics", sets: 3, reps: "30-45s", rest_seconds: 60 },
        ]
      }
    ]
  },
  {
    name: "Powerlifting Starter",
    type: "weighted",
    difficulty: "beginner",
    goal: "strength",
    days_per_week: 3,
    weeks_duration: 8,
    emoji: "🏋️",
    description: "Build a strong foundation with the big lifts",
    schedule: [
      {
        day: "Day 1 — Squat Focus",
        focus: "Legs",
        exercises: [
          { name: "Barbell Squat", category: "weighted", sets: 4, reps: "5", rest_seconds: 180, notes: "Add 2.5–5 lbs each week" },
          { name: "Romanian Deadlift", category: "weighted", sets: 3, reps: "8-10", rest_seconds: 120 },
          { name: "Leg Press", category: "weighted", sets: 3, reps: "10-12", rest_seconds: 90 },
          { name: "Dumbbell Lunge", category: "weighted", sets: 3, reps: "10 each", rest_seconds: 90 },
        ]
      },
      {
        day: "Day 2 — Bench Focus",
        focus: "Push",
        exercises: [
          { name: "Bench Press", category: "weighted", sets: 4, reps: "5", rest_seconds: 180, notes: "Add 2.5 lbs each week" },
          { name: "Overhead Press", category: "weighted", sets: 3, reps: "8", rest_seconds: 120 },
          { name: "Cable Row", category: "weighted", sets: 3, reps: "10-12", rest_seconds: 90, notes: "Balance pushing with rowing" },
          { name: "Lat Pulldown", category: "weighted", sets: 3, reps: "10-12", rest_seconds: 90 },
        ]
      },
      {
        day: "Day 3 — Deadlift Focus",
        focus: "Pull",
        exercises: [
          { name: "Deadlift", category: "weighted", sets: 3, reps: "5", rest_seconds: 240, notes: "The king of all lifts" },
          { name: "Barbell Row", category: "weighted", sets: 4, reps: "8", rest_seconds: 120 },
          { name: "Weighted Pull-Up", category: "weighted", sets: 3, reps: "5-8", rest_seconds: 120, notes: "Use belt or vest" },
          { name: "Cable Row", category: "weighted", sets: 3, reps: "12", rest_seconds: 90 },
        ]
      }
    ]
  },
  {
    name: "Hypertrophy Builder",
    type: "weighted",
    difficulty: "intermediate",
    goal: "muscle_gain",
    days_per_week: 4,
    weeks_duration: 12,
    emoji: "🔥",
    description: "Maximize muscle growth with volume training",
    schedule: [
      {
        day: "Day 1 — Chest & Triceps",
        focus: "Push",
        exercises: [
          { name: "Bench Press", category: "weighted", sets: 4, reps: "8-10", rest_seconds: 90 },
          { name: "Overhead Press", category: "weighted", sets: 3, reps: "10-12", rest_seconds: 90 },
          { name: "Dip", category: "calisthenics", sets: 3, reps: "12-15", rest_seconds: 60 },
          { name: "Diamond Push-Up", category: "calisthenics", sets: 3, reps: "12-15", rest_seconds: 60 },
        ]
      },
      {
        day: "Day 2 — Back & Biceps",
        focus: "Pull",
        exercises: [
          { name: "Deadlift", category: "weighted", sets: 3, reps: "6-8", rest_seconds: 180 },
          { name: "Barbell Row", category: "weighted", sets: 4, reps: "8-10", rest_seconds: 90 },
          { name: "Weighted Pull-Up", category: "weighted", sets: 3, reps: "8-10", rest_seconds: 90 },
          { name: "Cable Row", category: "weighted", sets: 3, reps: "12-15", rest_seconds: 60 },
        ]
      },
      {
        day: "Day 3 — Legs",
        focus: "Legs",
        exercises: [
          { name: "Barbell Squat", category: "weighted", sets: 4, reps: "8-10", rest_seconds: 120 },
          { name: "Romanian Deadlift", category: "weighted", sets: 3, reps: "10-12", rest_seconds: 90 },
          { name: "Leg Press", category: "weighted", sets: 3, reps: "12-15", rest_seconds: 90 },
          { name: "Dumbbell Lunge", category: "weighted", sets: 3, reps: "12 each", rest_seconds: 60 },
          { name: "Pistol Squat", category: "calisthenics", sets: 2, reps: "8 each", rest_seconds: 90, notes: "Finisher" },
        ]
      },
      {
        day: "Day 4 — Shoulders & Core",
        focus: "Shoulders",
        exercises: [
          { name: "Overhead Press", category: "weighted", sets: 4, reps: "8-10", rest_seconds: 90 },
          { name: "Pike Push-Up", category: "calisthenics", sets: 3, reps: "12", rest_seconds: 60 },
          { name: "Lat Pulldown", category: "weighted", sets: 3, reps: "12", rest_seconds: 60 },
          { name: "Plank", category: "calisthenics", sets: 4, reps: "45-60s", rest_seconds: 45 },
          { name: "L-Sit", category: "calisthenics", sets: 3, reps: "15s", rest_seconds: 45 },
        ]
      }
    ]
  },
  {
    name: "Mixed Athlete",
    type: "mixed",
    difficulty: "intermediate",
    goal: "endurance",
    days_per_week: 5,
    weeks_duration: 8,
    emoji: "⚡",
    description: "Best of both worlds — strength meets calisthenics",
    schedule: [
      {
        day: "Day 1 — Push (Mixed)",
        focus: "Push",
        exercises: [
          { name: "Bench Press", category: "weighted", sets: 3, reps: "8", rest_seconds: 90 },
          { name: "Decline Push-Up", category: "calisthenics", sets: 3, reps: "12", rest_seconds: 60 },
          { name: "Overhead Press", category: "weighted", sets: 3, reps: "8", rest_seconds: 90 },
          { name: "Handstand Hold", category: "calisthenics", sets: 3, reps: "30s", rest_seconds: 60 },
        ]
      },
      {
        day: "Day 2 — Pull (Mixed)",
        focus: "Pull",
        exercises: [
          { name: "Deadlift", category: "weighted", sets: 3, reps: "5", rest_seconds: 180 },
          { name: "Wide Grip Pull-Up", category: "calisthenics", sets: 3, reps: "8", rest_seconds: 90 },
          { name: "Barbell Row", category: "weighted", sets: 3, reps: "10", rest_seconds: 90 },
          { name: "Australian Pull-Up", category: "calisthenics", sets: 3, reps: "12", rest_seconds: 60 },
        ]
      },
      {
        day: "Day 3 — Legs (Mixed)",
        focus: "Legs",
        exercises: [
          { name: "Barbell Squat", category: "weighted", sets: 3, reps: "8", rest_seconds: 120 },
          { name: "Pistol Squat", category: "calisthenics", sets: 3, reps: "5 each", rest_seconds: 90 },
          { name: "Romanian Deadlift", category: "weighted", sets: 3, reps: "10", rest_seconds: 90 },
          { name: "Jump Squat", category: "calisthenics", sets: 3, reps: "12", rest_seconds: 60 },
        ]
      },
      {
        day: "Day 4 — Skill & Conditioning",
        focus: "Full Body",
        exercises: [
          { name: "Muscle-Up", category: "calisthenics", sets: 3, reps: "3", rest_seconds: 180 },
          { name: "Burpee", category: "calisthenics", sets: 4, reps: "12", rest_seconds: 60 },
          { name: "Plank", category: "calisthenics", sets: 3, reps: "60s", rest_seconds: 45 },
          { name: "Hollow Body Hold", category: "calisthenics", sets: 3, reps: "30s", rest_seconds: 45 },
        ]
      },
      {
        day: "Day 5 — Active Recovery",
        focus: "Mobility",
        exercises: [
          { name: "Bodyweight Squat", category: "calisthenics", sets: 2, reps: "20", rest_seconds: 60, notes: "Slow and controlled" },
          { name: "Lunge", category: "calisthenics", sets: 2, reps: "10 each", rest_seconds: 45 },
          { name: "Side Plank", category: "calisthenics", sets: 2, reps: "30s each", rest_seconds: 30 },
        ]
      }
    ]
  }
];