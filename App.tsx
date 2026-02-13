import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomeView } from './components/HomeView';
import { LoggerView } from './components/LoggerView';
import { StatsView } from './components/StatsView';
import { ProfileView } from './components/ProfileView';
import { ViewState, WorkoutSession, UserProfile, MuscleGroup, Exercise } from './types';
import { MOCK_EXERCISES } from './constants';
import { api } from './api';
import { AuthView } from './components/AuthView';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');

  // App State
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'مستخدم زائر',
    weight: 75,
    height: 180,
    goal: 'بناء عضل'
  });

  // Initialize with mock data
  const [exercises, setExercises] = useState<Exercise[]>(MOCK_EXERCISES);

  // Navigation State
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);


  const [loading, setLoading] = useState(true);

  // Initialize from Supabase
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    const init = async () => {
      // Load Profile
      const profile = await api.getProfile();
      if (profile) setUserProfile(profile);

      // Load History
      const historyData = await api.getHistory();
      setHistory(historyData);

      // Load Exercises
      const dbExercises = await api.getExercises();
      if (dbExercises.length > 0) {
        setExercises(dbExercises);
      } else {
        setExercises(MOCK_EXERCISES);
      }
    };
    init();
  }, [session]);


  // Save data effects
  // We can keep a useEffect for that BUT we should debounce it or just save on "Save" button in Profile view.
  // ProfileView has `onUpdate`. `onUpdate` updates state.
  // Let's add an effect to save profile when it changes.
  useEffect(() => {
    // Avoid saving on initial load?
    // We can just upsert.
    if (userProfile.name) { // Simple check to avoid saving empty if not ready
      api.updateProfile(userProfile);
    }
  }, [userProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
        جاري التحميل...
      </div>
    );
  }

  if (!session) {
    return <AuthView />;
  }

  const handleSaveSession = async (session: WorkoutSession) => {
    // Optimistic update
    setHistory(prev => [session, ...prev]);

    // Save to DB
    await api.saveSession(session);

    setCurrentView('STATS');
    setSelectedExercise(null);
    setSelectedMuscle(null);
  };

  const handleAddExercise = async (newExercise: Exercise) => {
    // Optimistic update
    setExercises(prev => [...prev, newExercise]);

    // Save to DB
    await api.addExercise(newExercise);
  };

  const navigateToLogger = (muscle: MuscleGroup, exercise?: Exercise) => {
    setSelectedMuscle(muscle);
    if (exercise) setSelectedExercise(exercise);
    setCurrentView('LOGGER');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <HomeView
            onSelectMuscle={(m) => navigateToLogger(m)}
            recentWorkouts={history.slice(0, 3)}
            exercises={exercises}
          />
        );
      case 'LOGGER':
        return (
          <LoggerView
            initialMuscle={selectedMuscle}
            initialExercise={selectedExercise}
            availableExercises={exercises}
            onSave={handleSaveSession}
            onCancel={() => setCurrentView('HOME')}
            onAddExercise={handleAddExercise}
          />
        );
      case 'STATS':
        return <StatsView history={history} exercises={exercises} />;
      case 'PROFILE':
        return <ProfileView profile={userProfile} onUpdate={setUserProfile} />;
      default:
        return (
          <HomeView
            onSelectMuscle={(m) => navigateToLogger(m)}
            recentWorkouts={history}
            exercises={exercises}
          />
        );
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;