export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Abs' | 'Cardio';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment?: string;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO string
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  goal: 'بناء عضل' | 'خسارة وزن' | 'لياقة';
}

export type ViewState = 'HOME' | 'LOGGER' | 'STATS' | 'PROFILE';
