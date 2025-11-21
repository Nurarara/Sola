
import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, SunMedium, Palette, X } from 'lucide-react';
import { ThemeConfig } from '../types';

interface NavBarProps {
  onOpenGenerator: () => void;
  onOpenPoster: () => void;
  onLogoClick: () => void;
  onProfileClick: () => void;
  theme: ThemeConfig;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ 
  onOpenGenerator, 
  onOpenPoster, 
  onLogoClick, 
  onProfileClick,
  theme,
  searchQuery,
  onSearchChange
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleCloseSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearchExpanded(false);
    onSearchChange('');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none transition-colors duration-1000">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between pointer-events-auto">
        {/* Logo */}
        <div 
          onClick={onLogoClick}
          className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 transition-all hover:bg-white/60 group cursor-pointer shadow-sm hover:shadow-md"
        >
          <SunMedium 
            className="group-hover:rotate-90 transition-transform duration-700" 
            size={26} 
            strokeWidth={2} 
            style={{ color: theme.accent }}
          />
          <span 
            className="font-display font-bold text-2xl tracking-tight transition-colors duration-700"
            style={{ color: theme.text }}
          >
            SOLA
          </span>
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenPoster}
            className="hidden md:flex px-5 py-3 rounded-full bg-white border border-transparent transition-all shadow-sm items-center gap-2 hover:shadow-md"
            style={{ color: theme.text, borderColor: `${theme.text}10` }}
            title="Create Art Poster"
          >
            <Palette size={18} />
            <span className="text-sm font-bold font-display">Art Lab</span>
          </button>

          <button 
            onClick={onOpenGenerator}
            className="hidden md:flex group relative px-6 py-3 rounded-full transition-all hover:-translate-y-1 overflow-hidden shadow-lg"
            style={{ backgroundColor: theme.accent, color: theme.background, boxShadow: `0 10px 25px -5px ${theme.accent}40` }}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="flex items-center gap-2 relative z-10">
              <Plus size={18} strokeWidth={3} />
              <span className="tracking-wide uppercase text-sm font-bold font-display">Curate</span>
            </div>
          </button>
          
          {/* Mobile-Only Curate (Simplified) */}
          <button 
            onClick={onOpenGenerator}
            className="md:hidden p-3 rounded-full shadow-lg"
            style={{ backgroundColor: theme.accent, color: theme.background }}
          >
             <Plus size={22} strokeWidth={3} />
          </button>

          {/* Search Bar */}
          <div 
            className={`flex glass-panel rounded-full cursor-pointer hover:bg-white/60 transition-all duration-500 overflow-hidden relative ${
              isSearchExpanded ? 'w-64 px-4' : 'w-12 px-0 justify-center'
            }`}
            onClick={!isSearchExpanded ? handleSearchClick : undefined}
          >
             <div className={`h-12 flex items-center justify-center shrink-0 ${!isSearchExpanded ? 'w-12' : ''}`}>
                <Search size={22} style={{ color: theme.text }} />
             </div>
             
             <input 
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search aesthetics..."
                className={`bg-transparent border-none outline-none h-12 font-sans text-sm w-full placeholder-leather/40 transition-opacity duration-300 ${
                   isSearchExpanded ? 'opacity-100 pl-2 pr-8' : 'opacity-0 w-0 p-0'
                }`}
                style={{ color: theme.text }}
                onBlur={() => {
                   if(!searchQuery) setIsSearchExpanded(false);
                }}
             />
             
             {isSearchExpanded && (
               <button 
                 onClick={handleCloseSearch}
                 className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5 transition-colors"
                 style={{ color: theme.text }}
               >
                 <X size={14} />
               </button>
             )}
          </div>

           {/* Profile */}
           <div 
             onClick={onProfileClick}
             className="flex glass-panel p-2 rounded-full cursor-pointer hover:bg-white/60 transition-colors hover:scale-105 active:scale-95"
           >
             <div className="w-8 h-8 rounded-full p-[2px]" style={{ background: `linear-gradient(to top right, ${theme.secondary}, ${theme.accent})` }}>
                <img src="https://picsum.photos/seed/sola_user/100/100" alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-white" />
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
