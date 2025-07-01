// types/index.ts
export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'homme' | 'femme';
  activityLevel: 'sedentaire' | 'leger' | 'modere' | 'intense' | 'extreme';
  objective: 'perte' | 'prise' | 'maintien';
  allergies: string[];
  restrictions: string[];
  preferences: string[];
}

export interface MealPlan {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  meals: Meal[];
  compatibilityScore: number;
}

export interface Meal {
  type: 'petit-dejeuner' | 'dejeuner' | 'collation' | 'diner';
  name: string;
  ingredients: string[];
  calories: number;
  preparation: string;
}

export interface UserProfileFormProps {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  onSubmit: () => void;
}

export interface RecommendationDisplayProps {
  recommendations: MealPlan[];
  selectedPlan: MealPlan | null;
  onSelectPlan: (plan: MealPlan) => void;
}