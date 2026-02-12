import { Exercise, MuscleGroup } from './types';
import { 
  Dumbbell, 
  Activity, 
  Footprints, 
  User, 
  BicepsFlexed, 
  HeartPulse, 
  Minimize2
} from 'lucide-react';
import React from 'react';

export const MUSCLE_GROUPS: { id: MuscleGroup; name: string; icon: React.ReactNode }[] = [
  { id: 'Chest', name: 'صدر', icon: <Minimize2 size={32} /> },
  { id: 'Back', name: 'ظهر', icon: <User size={32} /> },
  { id: 'Arms', name: 'ذراعين', icon: <BicepsFlexed size={32} /> },
  { id: 'Legs', name: 'أرجل', icon: <Footprints size={32} /> },
  { id: 'Shoulders', name: 'أكتاف', icon: <Dumbbell size={32} /> },
  { id: 'Abs', name: 'بطن', icon: <Activity size={32} /> },
  { id: 'Cardio', name: 'كارديو', icon: <HeartPulse size={32} /> },
];

export const MOCK_EXERCISES: Exercise[] = [
  { id: '1', name: 'بنش برس (بار)', muscleGroup: 'Chest', equipment: 'بار' },
  { id: '2', name: 'ضغط صدر علوي (دمبل)', muscleGroup: 'Chest', equipment: 'دمبل' },
  { id: '3', name: 'عقلة', muscleGroup: 'Back', equipment: 'وزن الجسم' },
  { id: '4', name: 'سحب بار منحني', muscleGroup: 'Back', equipment: 'بار' },
  { id: '5', name: 'سكوات', muscleGroup: 'Legs', equipment: 'بار' },
  { id: '6', name: 'رفرفة أرجل أمامي', muscleGroup: 'Legs', equipment: 'جهاز' },
  { id: '7', name: 'ضغط أكتاف (بار)', muscleGroup: 'Shoulders', equipment: 'بار' },
  { id: '8', name: 'رفرفة جانبي', muscleGroup: 'Shoulders', equipment: 'دمبل' },
  { id: '9', name: 'باي سيبس كيرل', muscleGroup: 'Arms', equipment: 'دمبل' },
  { id: '10', name: 'تراي سيبس (كيبل)', muscleGroup: 'Arms', equipment: 'كيبل' },
  { id: '11', name: 'جري', muscleGroup: 'Cardio', equipment: 'بدون' },
];
