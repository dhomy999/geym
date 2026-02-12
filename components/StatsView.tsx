import React, { useMemo } from 'react';
import { WorkoutSession, Exercise } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Award, CalendarClock } from 'lucide-react';

interface StatsViewProps {
  history: WorkoutSession[];
  exercises: Exercise[];
}

export const StatsView: React.FC<StatsViewProps> = ({ history, exercises }) => {
  
  // Calculate total volume (weight * reps) per workout
  const chartData = useMemo(() => {
    // Group by day (last 7 sessions for simplicity)
    const data = history.slice(0, 7).map((session, index) => {
      const exerciseName = exercises.find(e => e.id === session.exerciseId)?.name || 'تمرين';
      const volume = session.sets.reduce((acc, set) => acc + (set.weight * set.reps), 0);
      return {
        name: exerciseName.split(' ').slice(0, 2).join(' '), // First 2 words of arabic name
        volume: volume,
        fullDate: new Date(session.date).toLocaleDateString('ar-EG')
      };
    }).reverse();
    return data;
  }, [history, exercises]);

  const totalWorkouts = history.length;
  const totalVolume = history.reduce((acc, s) => acc + s.sets.reduce((a, set) => a + (set.weight * set.reps), 0), 0);
  
  // Calculate consistency (dummy metric for demo)
  const consistency = totalWorkouts > 0 ? 85 : 0; 

  const StatCard = ({ icon, label, value, sub }: any) => (
    <div className="bg-surface p-5 rounded-2xl border border-zinc-800 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-2">
        <div className="text-zinc-400">{icon}</div>
        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">{sub}</span>
      </div>
      <div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-xs text-zinc-500 font-medium">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-white">تقدمك <span className="text-primary">الرياضي</span></h1>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Award size={24} />} 
          label="مجموع التمارين" 
          value={totalWorkouts} 
          sub="الكل" 
        />
        <StatCard 
          icon={<TrendingUp size={24} />} 
          label="الحجم الكلي" 
          value={`${(totalVolume / 1000).toFixed(1)}k`} 
          sub="كجم" 
        />
        <StatCard 
          icon={<CalendarClock size={24} />} 
          label="الالتزام" 
          value={`${consistency}%`} 
          sub="هذا الشهر" 
        />
      </div>

      {/* Chart Section */}
      <div className="bg-surface rounded-3xl p-6 border border-zinc-800 shadow-xl">
        <h3 className="text-white font-bold mb-6">تاريخ الأحمال (آخر 7)</h3>
        <div className="h-48 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #3f3f46', color: '#fff', textAlign: 'right' }}
                  cursor={{fill: '#27272a'}}
                />
                <Bar dataKey="volume" radius={[4, 4, 4, 4]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#bef264' : '#3f3f46'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
              لا توجد بيانات بعد
            </div>
          )}
        </div>
      </div>
    </div>
  );
};