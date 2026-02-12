import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, UserCircle, Settings, LogOut } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-500">
      
      {/* Header Profile Card */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-4 border-surface shadow-2xl flex items-center justify-center mb-4 relative">
          <UserCircle size={64} className="text-zinc-600" />
          <button className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-black shadow-lg">
            <Settings size={16} />
          </button>
        </div>
        <h2 className="text-2xl font-black text-white">{formData.name}</h2>
        <span className="text-primary text-sm font-medium tracking-wide bg-primary/10 px-3 py-1 rounded-full mt-2">
          {formData.goal}
        </span>
      </div>

      {/* Metrics Form */}
      <div className="bg-surface rounded-3xl p-6 space-y-6 border border-zinc-800">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white">قياسات الجسم</h3>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-xs text-primary font-bold">تعديل</button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">الاسم المعروض</label>
            <input 
              type="text" 
              value={formData.name}
              disabled={!isEditing}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-background border border-zinc-800 rounded-xl p-3 text-white focus:border-primary focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">الوزن (كجم)</label>
              <input 
                type="number" 
                value={formData.weight}
                disabled={!isEditing}
                onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                className="w-full bg-background border border-zinc-800 rounded-xl p-3 text-white focus:border-primary focus:outline-none disabled:opacity-50 font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">الطول (سم)</label>
              <input 
                type="number" 
                value={formData.height}
                disabled={!isEditing}
                onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                className="w-full bg-background border border-zinc-800 rounded-xl p-3 text-white focus:border-primary focus:outline-none disabled:opacity-50 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">الهدف الحالي</label>
            <select 
              value={formData.goal}
              disabled={!isEditing}
              onChange={(e) => handleChange('goal', e.target.value)}
              className="w-full bg-background border border-zinc-800 rounded-xl p-3 text-white focus:border-primary focus:outline-none disabled:opacity-50 appearance-none"
            >
              <option value="بناء عضل">بناء عضل</option>
              <option value="خسارة وزن">خسارة وزن</option>
              <option value="لياقة">لياقة</option>
            </select>
          </div>
        </div>

        {isEditing && (
          <button 
            onClick={handleSave}
            className="w-full bg-primary text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4 hover:bg-primaryDark transition-colors"
          >
            <Save size={18} /> حفظ التغييرات
          </button>
        )}
      </div>

      <button className="w-full text-zinc-500 flex items-center justify-center gap-2 py-4 text-sm font-medium hover:text-red-500 transition-colors">
        <LogOut size={16} /> تسجيل خروج
      </button>
    </div>
  );
};
