import { createClient } from '@base44/sdk';

const createAnonymousClient = () => ({
  auth: { 
    isAuthenticated: async () => false, 
    me: async () => null,
    redirectToLogin: () => {},
    logout: () => {}
  },
  entities: new Proxy({}, { 
    get: () => ({ 
      filter: async () => [], 
      get: async () => null, 
      create: async () => ({}), 
      update: async () => ({}), 
      delete: async () => ({}) 
    }) 
  }),
  integrations: { 
    Core: { 
      UploadFile: async () => ({ file_url: 'https://example.com/placeholder-image.jpg' }),
      InvokeLLM: async ({ prompt, file_urls, response_json_schema }) => {
        // Mock LLM response for food analysis
        if (prompt.includes('nutritionist analyzing a photo of food')) {
          return {
            meal_name: "Sample Meal",
            total_calories: 450,
            total_protein: 25,
            total_carbs: 45,
            total_fat: 18,
            food_items: [
              { name: "Grilled Chicken Breast", portion: "6oz", calories: 180 },
              { name: "Brown Rice", portion: "1 cup cooked", calories: 215 },
              { name: "Broccoli", portion: "1 cup", calories: 55 }
            ]
          };
        }
        // Mock LLM response for workout analysis
        if (prompt.includes('expert coach') && prompt.includes('video')) {
          return {
            exercise_name: "Push-up",
            form_analysis: "Good overall form with room for improvement",
            form_score: 7.5,
            improvements: "Keep your core tight and elbows at 45 degrees",
            tips: "Focus on controlled movement and full range of motion"
          };
        }
        return { response: "This is a mock response for anonymous users. Please log in for full AI functionality." };
      }
    } 
  }
});

const db = globalThis.__B44_DB__ || 
  (import.meta.env.VITE_BASE44_ACCESS_TOKEN ? createClient({
    appId: import.meta.env.VITE_BASE44_APP_ID,
    baseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL,
    token: import.meta.env.VITE_BASE44_ACCESS_TOKEN
  }) : createAnonymousClient()) || createAnonymousClient();

export { db };
export const base44 = db;
export default db;
