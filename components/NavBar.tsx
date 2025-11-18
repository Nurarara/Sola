import React from 'react';
import { Search, Plus, SunMedium } from 'lucide-react';

interface NavBarProps {
  onOpenGenerator: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ onOpenGenerator }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between pointer-events-auto">
        {/* Logo */}
        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 transition-all hover:bg-white/60 group cursor-pointer shadow-sm hover:shadow-md">
          <SunMedium className="text-terra group-hover:rotate-90 transition-transform duration-700" size={26} strokeWidth={2} />
          <span className="font-display font-bold text-2xl tracking-tight text-leather">
            SOLA
          </span>
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenGenerator}
            className="group relative px-6 py-3 rounded-full bg-terra text-cream font-bold font-display transition-all hover:-translate-y-1 overflow-hidden shadow-lg shadow-terra/20 hover:shadow-terra/40"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="flex items-center gap-2 relative z-10">
              <Plus size={18} strokeWidth={3} />
              <span className="tracking-wide uppercase text-sm">Curate</span>
            </div>
          </button>
          
          <div className="hidden md:flex glass-panel p-3 rounded-full cursor-pointer hover:bg-white/60 transition-colors text-leather/70 hover:text-terra">
             <Search size={22} />
          </div>
           <div className="hidden md:flex glass-panel p-2 rounded-full cursor-pointer hover:bg-white/60 transition-colors">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sand to-terra p-[2px]">
                <img src="https://picsum.photos/seed/sola_user/100/100" alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-white" />
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};