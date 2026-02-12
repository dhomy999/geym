
import { supabase } from './supabaseClient';
import { WorkoutSession, WorkoutSet, UserProfile, Exercise, MuscleGroup } from './types';

// Helper to get current user ID
const getUserId = async () => {
    const { data: { user }, error } = await supabase.auth.getUser(); // Prefer getUser for security
    if (error) {
        // console.error('Sign in error:', error); // Silent fail if not signed in
        return null;
    }
    return user?.id;
};

export const api = {
    // Auth
    initializeSession: async () => {
        return await getUserId();
    },

    signInWithEmail: async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    },

    signUpWithEmail: async (email: string, password: string) => {
        return await supabase.auth.signUp({ email, password });
    },

    signInWithGoogle: async () => {
        return await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin, // e.g. http://localhost:3000
            }
        });
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error signing out:', error);
    },

    // Profile
    getProfile: async (): Promise<UserProfile | null> => {
        const userId = await getUserId();
        if (!userId) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            console.error('Error fetching profile:', error);
            return null;
        }

        return {
            name: data.name || '',
            weight: data.weight || 0,
            height: data.height || 0,
            goal: (data.goal as any) || 'بناء عضل'
        };
    },

    updateProfile: async (profile: UserProfile) => {
        const userId = await getUserId();
        if (!userId) return;

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                name: profile.name,
                weight: profile.weight,
                height: profile.height,
                goal: profile.goal
            });

        if (error) console.error('Error updating profile:', error);
    },

    // Exercises
    getExercises: async (): Promise<Exercise[]> => {
        const { data, error } = await supabase
            .from('exercises')
            .select('*');

        if (error) {
            console.error('Error fetching exercises:', error);
            return [];
        }

        return data.map(e => ({
            id: e.id,
            name: e.name,
            muscleGroup: e.muscle_group as MuscleGroup,
            equipment: e.equipment || undefined
        }));
    },

    addExercise: async (exercise: Exercise) => {
        const { error } = await supabase
            .from('exercises')
            .insert({
                // Let db generate ID if we don't care, but if we do...
                // The app generates UUIDs on client side for `exercise.id` if using `uuid` lib.
                // If we provide ID, it uses it.
                id: exercise.id,
                name: exercise.name,
                muscle_group: exercise.muscleGroup,
                equipment: exercise.equipment
            });

        if (error) console.error('Error adding exercise:', error);
    },

    // Workouts
    getHistory: async (): Promise<WorkoutSession[]> => {
        const userId = await getUserId();
        if (!userId) return [];

        const { data, error } = await supabase
            .from('workout_sessions')
            .select(`
        id,
        date,
        workout_sets (
          id,
          reps,
          weight,
          completed,
          exercise_id
        )
      `)
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching history:', error);
            return [];
        }

        // Map to App Types
        return data.map((session: any) => ({
            id: session.id,
            date: session.date,
            // Create workout sets first
            sets: session.workout_sets.map((set: any) => ({
                id: set.id,
                reps: set.reps,
                weight: set.weight,
                completed: set.completed,
                exerciseId: set.exercise_id // temporarily helper
            })),
            // Infer session exerciseId from first set
            exerciseId: session.workout_sets[0]?.exercise_id || ''
        })).filter(s => s.exerciseId);
    },

    saveSession: async (session: WorkoutSession) => {
        const userId = await getUserId();
        if (!userId) return;

        // Insert Session
        const { error: sessionError } = await supabase
            .from('workout_sessions')
            .insert({
                id: session.id,
                user_id: userId,
                date: session.date
            });

        if (sessionError) {
            console.error('Error saving session:', sessionError);
            return;
        }

        // Insert Sets
        const setsToInsert = session.sets.map(s => ({
            id: s.id,
            session_id: session.id,
            exercise_id: session.exerciseId, // Use session's exerciseId for all sets
            reps: s.reps,
            weight: s.weight,
            completed: s.completed
        }));

        const { error: setsError } = await supabase
            .from('workout_sets')
            .insert(setsToInsert);

        if (setsError) console.error('Error saving sets:', setsError);
    }
};
