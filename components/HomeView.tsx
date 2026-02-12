import React from 'react';
import { MuscleGroup, WorkoutSession, Exercise } from '../types';
import { MUSCLE_GROUPS } from '../constants';
import { ChevronLeft, Calendar, Mic } from 'lucide-react';

interface HomeViewProps {
  onSelectMuscle: (muscle: MuscleGroup) => void;
  recentWorkouts: WorkoutSession[];
  exercises: Exercise[];
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectMuscle, recentWorkouts, exercises }) => {
  
  const getExerciseName = (id: string) => exercises.find(e => e.id === id)?.name || 'تمرين غير معروف';

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-white">ابحث عن <span className="text-primary">تمرين</span></h1>
        <p className="text-zinc-400 text-sm">اختر عضلة للبدء في التدريب.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {MUSCLE_GROUPS.map((muscle) => (
          <button
            key={muscle.id}
            onClick={() => onSelectMuscle(muscle.id)}
            className="group relative flex flex-col items-center justify-center p-6 bg-surface border border-zinc-800 rounded-3xl hover:border-primary/50 hover:bg-surfaceHighlight transition-all duration-300 active:scale-95"
          >
            <div className="text-zinc-400 group-hover:text-primary transition-colors duration-300 mb-3">
              {muscle.icon}
            </div>
            <span className="text-lg font-bold text-zinc-100">{muscle.name}</span>
            {/* Decorative accent */}
            <div className="absolute top-3 end-3 w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-primary transition-colors" />
          </button>
        ))}
      </div>

      {/* Quick Record CTA */}
      <div className="bg-surfaceHighlight rounded-3xl p-5 border border-zinc-700/50 flex flex-col items-center text-center space-y-4 shadow-lg">
        <div>
          <h3 className="text-white font-bold text-lg">سجل نشاطك</h3>
          <p className="text-zinc-400 text-xs">اضغط للتسجيل السريع</p>
        </div>
        <div className="flex gap-4 w-full">
           <button className="flex-1 bg-primary text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primaryDark transition-colors">
              <Mic size={18} /> صوتي
           </button>
           <button className="flex-1 bg-surface border border-zinc-600 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors">
              يدوي
           </button>
        </div>
      </div>

      {/* Recent Activity */}
      {recentWorkouts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">مؤخرًا</h2>
            <button className="text-xs text-primary font-medium">عرض الكل</button>
          </div>
          
          <div className="space-y-3">
            {recentWorkouts.map((session) => (
              <div key={session.id} className="bg-surface rounded-2xl p-4 flex items-center border border-zinc-800/50">
                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-primary ms-0 me-4">
                  <Calendar size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-zinc-100">{getExerciseName(session.exerciseId)}</h4>
                  <p className="text-xs text-zinc-500">
                    {new Date(session.date).toLocaleDateString('ar-EG')} • {session.sets.length} جولات
                  </p>
                </div>
                {/* ChevronLeft points 'in' (to the left) in RTL, which is usually correct for drilling down */}
                <ChevronLeft size={16} className="text-zinc-600" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};