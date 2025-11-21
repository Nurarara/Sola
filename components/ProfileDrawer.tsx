
import React from 'react';
import { X, Settings, LogOut, Heart, Grid, User, Bell, Shield, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose, theme }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-cream shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: theme.background }}
      >
        {/* Header / Cover */}
        <div className="relative h-48 shrink-0 overflow-hidden">
           <div className={`absolute inset-0 ${theme.heroGradient1} mix-blend-multiply opacity-50`} />
           <div className={`absolute inset-0 ${theme.heroGradient2} mix-blend-multiply opacity-50`} />
           
           <button 
             onClick={onClose}
             className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors z-10"
           >
             <X size={20} />
           </button>

           <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full p-1 bg-cream shadow-xl" style={{ backgroundColor: theme.background }}>
                 <img 
                   src="https://picsum.photos/seed/sola_user/200/200" 
                   alt="Profile" 
                   className="w-full h-full rounded-full object-cover" 
                 />
              </div>
           </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pt-16 pb-8">
           
           {/* User Info */}
           <div className="mb-8">
             <h2 className="text-3xl font-display font-bold" style={{ color: theme.text }}>Sola User</h2>
             <p className="font-sans text-sm opacity-60 tracking-wider uppercase font-medium" style={{ color: theme.text }}>Visual Architect</p>
           </div>

           {/* Stats Row */}
           <div className="flex gap-6 mb-10 pb-8 border-b" style={{ borderColor: `${theme.text}10` }}>
              <div>
                 <div className="text-2xl font-display font-bold" style={{ color: theme.accent }}>142</div>
                 <div className="text-xs opacity-50 uppercase tracking-widest" style={{ color: theme.text }}>Pins</div>
              </div>
              <div>
                 <div className="text-2xl font-display font-bold" style={{ color: theme.accent }}>12</div>
                 <div className="text-xs opacity-50 uppercase tracking-widest" style={{ color: theme.text }}>Boards</div>
              </div>
              <div>
                 <div className="text-2xl font-display font-bold" style={{ color: theme.accent }}>3.4k</div>
                 <div className="text-xs opacity-50 uppercase tracking-widest" style={{ color: theme.text }}>Followers</div>
              </div>
           </div>

           {/* Menu Items */}
           <div className="space-y-2">
              <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors group">
                 <div className="p-2 rounded-lg bg-black/5 group-hover:bg-white" style={{ color: theme.text }}>
                    <Grid size={20} />
                 </div>
                 <div className="text-left">
                    <h3 className="font-bold text-sm" style={{ color: theme.text }}>My Collections</h3>
                    <p className="text-xs opacity-50" style={{ color: theme.text }}>Organized vibes & moods</p>
                 </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors group">
                 <div className="p-2 rounded-lg bg-black/5 group-hover:bg-white" style={{ color: theme.text }}>
                    <Heart size={20} />
                 </div>
                 <div className="text-left">
                    <h3 className="font-bold text-sm" style={{ color: theme.text }}>Liked Aesthetics</h3>
                    <p className="text-xs opacity-50" style={{ color: theme.text }}>24 new items this week</p>
                 </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors group">
                 <div className="p-2 rounded-lg bg-black/5 group-hover:bg-white" style={{ color: theme.text }}>
                    <Sparkles size={20} />
                 </div>
                 <div className="text-left">
                    <h3 className="font-bold text-sm" style={{ color: theme.text }}>Generated Art</h3>
                    <p className="text-xs opacity-50" style={{ color: theme.text }}>History of your creations</p>
                 </div>
              </button>

              <div className="h-px w-full my-4 bg-black/5"></div>

              <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors group">
                 <div className="p-2 rounded-lg bg-black/5 group-hover:bg-white" style={{ color: theme.text }}>
                    <Bell size={20} />
                 </div>
                 <div className="text-left">
                    <h3 className="font-bold text-sm" style={{ color: theme.text }}>Notifications</h3>
                 </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors group">
                 <div className="p-2 rounded-lg bg-black/5 group-hover:bg-white" style={{ color: theme.text }}>
                    <Settings size={20} />
                 </div>
                 <div className="text-left">
                    <h3 className="font-bold text-sm" style={{ color: theme.text }}>Settings</h3>
                 </div>
              </button>
           </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t" style={{ borderColor: `${theme.text}10` }}>
           <button 
             className="w-full py-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-widest hover:bg-black/5 transition-colors"
             style={{ borderColor: `${theme.text}20`, color: theme.text }}
           >
             <LogOut size={16} />
             Log Out
           </button>
           <p className="text-center text-[10px] mt-6 opacity-40 uppercase tracking-[0.2em]" style={{ color: theme.text }}>
             Sola v2.4 • Visual Intelligence
           </p>
        </div>

      </div>
    </>
  );
};
