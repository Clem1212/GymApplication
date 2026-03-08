// JavaScript Example: Reading Entities
// Filterable fields: exercise_name, video_url, form_analysis, form_score, improvements, sets, reps, weight, duration_minutes, workout_date, calories_burned
async function fetchWorkoutSessionEntities() {
    const response = await fetch(`${process.env.VITE_BASE44_APP_BASE_URL}/api/apps/${process.env.VITE_BASE44_APP_ID}/entities/WorkoutSession`, {
        headers: {
            'api_key': process.env.VITE_BASE44_API_KEY, // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: exercise_name, video_url, form_analysis, form_score, improvements, sets, reps, weight, duration_minutes, workout_date, calories_burned
async function updateWorkoutSessionEntity(entityId, updateData) {
    const response = await fetch(`${process.env.VITE_BASE44_APP_BASE_URL}/api/apps/${process.env.VITE_BASE44_APP_ID}/entities/WorkoutSession/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': process.env.VITE_BASE44_API_KEY, // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}