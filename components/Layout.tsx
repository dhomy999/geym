import React from 'react';
import { ViewState } from '../types';
import { Home, BarChart2, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background text-zinc-100 overflow-hidden shadow-2xl relative">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-6 left-4 right-4 bg-surface/90 backdrop-blur-md border border-zinc-800 rounded-2xl h-16 flex items-center justify-around px-2 shadow-lg z-50">
        <NavButton 
          active={currentView === 'HOME' || currentView === 'LOGGER'} 
          onClick={() => onNavigate('HOME')}
          icon={<Home size={24} />}
          label="الرئيسية"
        />
        
        <NavButton 
          active={currentView === 'STATS'} 
          onClick={() => onNavigate('STATS')}
          icon={<BarChart2 size={24} />}
          label="إحصائيات"
        />

        <NavButton 
          active={currentView === 'PROFILE'} 
          onClick={() => onNavigate('PROFILE')}
          icon={<User size={24} />}
          label="الملف"
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-200 ${
      active ? 'text-primary scale-110' : 'text-zinc-500 hover:text-zinc-300'
    }`}
  >
    {icon}
    <span className="text-[12px] font-medium mt-1">{label}</span>
  </button>
);
