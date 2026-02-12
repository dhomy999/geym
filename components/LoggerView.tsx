import React, { useState } from 'react';
import { MuscleGroup, Exercise, WorkoutSet, WorkoutSession } from '../types';
import { MUSCLE_GROUPS } from '../constants';
import { ChevronRight, Plus, Trash2, Check, Timer, X } from 'lucide-react';

// Simple UUID fallback
const generateId = () => Math.random().toString(36).substr(2, 9);

interface LoggerViewProps {
  initialMuscle: MuscleGroup | null;
  initialExercise: Exercise | null;
  availableExercises: Exercise[];
  onSave: (session: WorkoutSession) => void;
  onCancel: () => void;
  onAddExercise: (exercise: Exercise) => void;
}

export const LoggerView: React.FC<LoggerViewProps> = ({ 
  initialMuscle, 
  initialExercise, 
  availableExercises,
  onSave, 
  onCancel,
  onAddExercise
}) => {
  const [step, setStep] = useState<'SELECT_EXERCISE' | 'LOGGING'>(initialExercise ? 'LOGGING' : 'SELECT_EXERCISE');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(initialExercise);
  const [sets, setSets] = useState<WorkoutSet[]>([
    { id: generateId(), reps: 10, weight: 20, completed: false }
  ]);

  // Create Exercise State
  const [isCreating, setIsCreating] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseEquipment, setNewExerciseEquipment] = useState('');

  const filteredExercises = initialMuscle 
    ? availableExercises.filter(e => e.muscleGroup === initialMuscle)
    : availableExercises;
  
  const muscleName = initialMuscle ? MUSCLE_GROUPS.find(m => m.id === initialMuscle)?.name : '';

  const handleExerciseSelect = (ex: Exercise) => {
    setSelectedExercise(ex);
    setStep('LOGGING');
  };

  const handleCreateExercise = () => {
    if (!newExerciseName.trim() || !initialMuscle) return;
    
    const newExercise: Exercise = {
      id: generateId(),
      name: newExerciseName.trim(),
      muscleGroup: initialMuscle,
      equipment: newExerciseEquipment.trim() || 'عام'
    };

    onAddExercise(newExercise);
    setSelectedExercise(newExercise);
    setStep('LOGGING');
    
    // Reset form
    setIsCreating(false);
    setNewExerciseName('');
    setNewExerciseEquipment('');
  };

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    setSets([...sets, { 
      id: generateId(), 
      reps: lastSet ? lastSet.reps : 10, 
      weight: lastSet ? lastSet.weight : 0, 
      completed: false 
    }]);
  };

  const updateSet = (id: string, field: keyof WorkoutSet, value: number | boolean) => {
    setSets(sets.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSet = (id: string) => {
    if (sets.length > 1) {
      setSets(sets.filter(s => s.id !== id));
    }
  };

  const finishWorkout = () => {
    if (!selectedExercise) return;
    const session: WorkoutSession = {
      id: generateId(),
      date: new Date().toISOString(),
      exerciseId: selectedExercise.id,
      sets: sets.filter(s => s.completed) 
    };
    onSave(session);
  };

  if (step === 'SELECT_EXERCISE') {
    return (
      <div className="p-6 h-full flex flex-col relative">
        <button onClick={onCancel} className="flex items-center text-zinc-400 mb-6 hover:text-white">
          <ChevronRight size={20} className="ms-1" /> عودة
        </button>
        <h2 className="text-2xl font-bold mb-1">اختر تمرين</h2>
        <p className="text-zinc-500 mb-6 text-sm">العضلة المستهدفة: <span className="text-primary">{muscleName}</span></p>
        
        <div className="flex-1 overflow-y-auto space-y-3 pb-20">
          
          <button 
             onClick={() => setIsCreating(true)}
             className="w-full py-4 mb-2 rounded-xl border border-dashed border-zinc-700 text-primary font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
          >
             <Plus size={20} /> إضافة تمرين جديد
          </button>

          {filteredExercises.map(ex => (
            <button
              key={ex.id}
              onClick={() => handleExerciseSelect(ex)}
              className="w-full text-start bg-surface p-4 rounded-xl border border-zinc-800 hover:border-primary transition-colors flex justify-between items-center group"
            >
              <div>
                <span className="font-bold block text-zinc-200">{ex.name}</span>
                <span className="text-xs text-zinc-500">{ex.equipment}</span>
              </div>
              <Plus size={20} className="text-zinc-600 group-hover:text-primary" />
            </button>
          ))}
        </div>

        {/* Create Exercise Modal */}
        {isCreating && (
         <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-surface border border-zinc-700 w-full rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-white">تمرين جديد: {muscleName}</h3>
                 <button onClick={() => setIsCreating(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
               </div>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-zinc-500 mb-1">اسم التمرين</label>
                   <input 
                     autoFocus
                     className="w-full bg-background border border-zinc-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none placeholder-zinc-700"
                     placeholder="مثال: تمرين ظهر"
                     value={newExerciseName}
                     onChange={e => setNewExerciseName(e.target.value)}
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-zinc-500 mb-1">الأداة (اختياري)</label>
                   <input 
                     className="w-full bg-background border border-zinc-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none placeholder-zinc-700"
                     placeholder="مثال: جهاز، دمبل"
                     value={newExerciseEquipment}
                     onChange={e => setNewExerciseEquipment(e.target.value)}
                   />
                 </div>
               </div>

               <div className="flex gap-3 mt-6">
                 <button 
                   onClick={() => setIsCreating(false)}
                   className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700"
                 >
                   إلغاء
                 </button>
                 <button 
                   onClick={handleCreateExercise}
                   disabled={!newExerciseName.trim()}
                   className="flex-1 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primaryDark disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   حفظ
                 </button>
               </div>
            </div>
         </div>
       )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 bg-surface/50 backdrop-blur-sm sticky top-0 z-10 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setStep('SELECT_EXERCISE')} className="p-2 -me-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800">
            <ChevronRight size={24} />
          </button>
          <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-full">
            <Timer size={14} />
            <span className="text-xs font-mono font-bold">00:00</span>
          </div>
        </div>
        <h1 className="text-2xl font-black text-white">{selectedExercise?.name}</h1>
        <p className="text-zinc-400 text-sm">{muscleName} • {sets.length} جولات</p>
      </div>

      {/* Sets List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="grid grid-cols-10 gap-2 mb-2 px-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <div className="col-span-1 text-center">جولة</div>
          <div className="col-span-3 text-center">كجم</div>
          <div className="col-span-3 text-center">عدات</div>
          <div className="col-span-3 text-center">إتمام</div>
        </div>

        {sets.map((set, index) => (
          <div 
            key={set.id} 
            className={`grid grid-cols-10 gap-2 items-center p-3 rounded-xl transition-all duration-300 border ${
              set.completed 
                ? 'bg-primary/5 border-primary/20' 
                : 'bg-surface border-zinc-800'
            }`}
          >
            <div className="col-span-1 text-center font-mono font-bold text-zinc-400">{index + 1}</div>
            
            <div className="col-span-3">
              <input
                type="number"
                value={set.weight}
                onChange={(e) => updateSet(set.id, 'weight', parseFloat(e.target.value) || 0)}
                className={`w-full bg-background text-center p-2 rounded-lg font-bold text-lg focus:outline-none focus:ring-1 ${set.completed ? 'text-primary' : 'text-white'}`}
              />
            </div>
            
            <div className="col-span-3">
              <input
                type="number"
                value={set.reps}
                onChange={(e) => updateSet(set.id, 'reps', parseFloat(e.target.value) || 0)}
                className={`w-full bg-background text-center p-2 rounded-lg font-bold text-lg focus:outline-none focus:ring-1 ${set.completed ? 'text-primary' : 'text-white'}`}
              />
            </div>
            
            <div className="col-span-3 flex justify-center gap-2">
               <button
                  onClick={() => updateSet(set.id, 'completed', !set.completed)}
                  className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
                    set.completed 
                      ? 'bg-primary text-black' 
                      : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                  }`}
                >
                  <Check size={20} strokeWidth={3} />
               </button>
               {!set.completed && sets.length > 1 && (
                 <button onClick={() => removeSet(set.id)} className="text-zinc-600 hover:text-red-500 px-1">
                   <Trash2 size={16} />
                 </button>
               )}
            </div>
          </div>
        ))}

        <button 
          onClick={addSet}
          className="w-full py-4 mt-2 rounded-xl border border-dashed border-zinc-700 text-zinc-400 font-bold hover:bg-zinc-800 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} /> إضافة جولة
        </button>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-surface border-t border-zinc-800">
        <button 
          onClick={finishWorkout}
          className="w-full bg-primary text-black font-black text-lg py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          إنهاء التمرين
        </button>
      </div>
    </div>
  );
};