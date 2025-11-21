
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Palette, Wand2, ArrowDown, MoveRight, Zap, Layers, Infinity } from 'lucide-react';

// Curated aesthetic backgrounds with metadata
const AESTHETICS = [
  {
    id: 'liquid',
    label: 'Liquid Chrome',
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
    accent: '#00C2FF',
    description: 'Fluid dynamics meeting digital surfacing.'
  },
  {
    id: 'zen',
    label: 'Kyoto Mist',
    url: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1953&auto=format&fit=crop",
    accent: '#94A3B8',
    description: 'Silence captured in grain and fog.'
  },
  {
    id: 'neon',
    label: 'Cyber Noir',
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
    accent: '#F472B6',
    description: 'High voltage dreams in rain-slicked streets.'
  },
  {
    id: 'botanica',
    label: 'Deep Roots',
    url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1973&auto=format&fit=crop",
    accent: '#4ADE80',
    description: 'Organic complexity in shadow.'
  },
  {
    id: 'fashion',
    label: 'High Contrast',
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    accent: '#F43F5E',
    description: 'Editorial elegance with a sharp edge.'
  },
  {
    id: 'abstract',
    label: 'Prism Realm',
    url: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1974&auto=format&fit=crop",
    accent: '#A78BFA',
    description: 'Light refracted through digital glass.'
  }
];

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTheme = AESTHETICS[currentIndex];

  // Auto-rotate background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % AESTHETICS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll listener
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  // Enter transition
  const handleEnter = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-leather font-sans text-white">
      {/* Fixed Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {AESTHETICS.map((theme, index) => (
          <div
            key={theme.id}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={theme.url} 
              alt={theme.label}
              className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${
                 index === currentIndex ? 'scale-110' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
            {/* Dynamic Overlay based on theme accent */}
            <div 
              className="absolute inset-0 mix-blend-overlay transition-colors duration-[1500ms]" 
              style={{ backgroundColor: `${theme.accent}40` }} 
            />
          </div>
        ))}
        
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Scrollable Content Container */}
      <div 
        ref={containerRef}
        className={`absolute inset-0 overflow-y-auto custom-scrollbar scroll-smooth transition-all duration-[1500ms] perspective-1000 ${
          isExiting ? 'opacity-0 scale-150 pointer-events-none blur-xl' : 'opacity-100 scale-100'
        }`}
        onScroll={handleScroll}
      >
        
        {/* Sticky Top Bar */}
        <div className={`fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 transition-all duration-500 ${scrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
           <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 bg-black/40 backdrop-blur-xl">
              <span className="font-display font-bold text-white tracking-widest">SOLA</span>
           </div>
           <button 
             onClick={handleEnter}
             className="px-6 py-2 bg-white text-black rounded-full font-bold font-display text-sm hover:scale-105 transition-transform shadow-lg"
             style={{ color: currentTheme.accent === '#ffffff' ? '#000' : currentTheme.accent }}
           >
             Enter Studio
           </button>
        </div>

        {/* SECTION 1: HERO / TITLE */}
        <div className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden">
          <div className="animate-fade-in mb-12 flex flex-col items-center gap-3">
              <span 
                className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold tracking-[0.3em] uppercase shadow-lg transition-colors duration-500"
                style={{ borderColor: `${currentTheme.accent}50` }}
              >
                 <Sparkles size={10} style={{ color: currentTheme.accent }} />
                 {currentTheme.label}
              </span>
          </div>

          {/* Title Container */}
          <div 
            onClick={handleEnter}
            className="group cursor-pointer relative z-10 select-none"
          >
            {/* Text */}
            <h1 
              className={`font-display font-bold text-[18vw] md:text-[16vw] leading-none text-cream tracking-tighter transition-all duration-700 ease-out drop-shadow-2xl ${isExiting ? 'scale-[20] opacity-0' : 'hover:scale-105'}`}
              style={{ 
                textShadow: `0 20px 50px ${currentTheme.accent}40`,
                color: '#F5F5DC'
              }}
            >
              SOLA
            </h1>
            
            {/* Zoom Hint on Hover */}
            <span 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-serif italic text-2xl pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100`}
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              Click to Enter
            </span>
          </div>

          <div className="absolute bottom-12 animate-bounce text-white/50 flex flex-col items-center gap-2 pointer-events-none">
            <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
            <ArrowDown size={20} />
          </div>
        </div>

        {/* SECTION 2: ART LAB */}
        <div className="min-h-[90vh] flex items-center justify-center relative py-20 px-4">
           <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/10 bg-black/40 backdrop-blur-xl text-white shadow-2xl transform transition-all hover:scale-[1.01] duration-500">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terra to-sand flex items-center justify-center mb-6 shadow-lg shadow-terra/30">
                    <Palette className="text-white" />
                 </div>
                 <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-[0.9]">
                   ART <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-terra to-sand">LAB.</span>
                 </h2>
                 <p className="text-lg text-white/80 font-light leading-relaxed mb-8">
                   Typography meets Technology. A digital atelier where you don't just generate images—you compose masterpieces. 
                   Swiss grids, Neon hazes, and Brutalist structures await your command.
                 </p>
                 <div className="flex gap-2 text-xs font-mono uppercase tracking-widest text-white/50">
                    <span className="px-3 py-1 border border-white/20 rounded-full">Swiss</span>
                    <span className="px-3 py-1 border border-white/20 rounded-full">Editorial</span>
                    <span className="px-3 py-1 border border-white/20 rounded-full">Neon</span>
                 </div>
              </div>

              {/* Visual Elements */}
              <div className="relative h-[500px] w-full hidden md:block">
                 <div className="absolute top-0 right-10 w-64 h-80 bg-cream rounded-lg transform rotate-6 shadow-2xl overflow-hidden border-8 border-white animate-float">
                    <img src="https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1909&auto=format&fit=crop" className="w-full h-full object-cover grayscale contrast-125" alt="Art 1" />
                    <div className="absolute bottom-4 left-4 bg-terra px-3 py-1 text-white font-bold font-display text-lg">ART</div>
                 </div>
                 <div className="absolute bottom-0 left-10 w-64 h-80 bg-white rounded-lg transform -rotate-3 shadow-2xl overflow-hidden border-8 border-white animate-float-delayed z-10">
                     <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-hard-light" alt="Art 2" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-4xl font-display font-bold text-white stroke-text" style={{ WebkitTextStroke: '1px white', color: 'transparent' }}>LAB</h3>
                     </div>
                 </div>
              </div>
           </div>
        </div>

        {/* SECTION 3: CURATE */}
        <div className="min-h-[90vh] flex items-center justify-center relative py-20 px-4">
           <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
              {/* Visual Elements */}
              <div className="relative h-[500px] w-full order-2 md:order-1 hidden md:block">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-80 h-80 rounded-full border border-white/10 animate-[spin_20s_linear_infinite] flex items-center justify-center">
                       <div className="w-60 h-60 rounded-full border border-white/10 animate-[spin_15s_linear_infinite_reverse]"></div>
                    </div>
                    <div 
                      className="absolute w-40 h-40 rounded-full blur-[50px] animate-pulse transition-colors duration-1000"
                      style={{ background: `linear-gradient(to top right, ${currentTheme.accent}, transparent)` }}
                    ></div>
                 </div>
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass-panel p-6 rounded-2xl flex items-center gap-4 shadow-xl animate-float bg-black/40 border-white/10 backdrop-blur-md">
                    <div className="w-12 h-12 bg-black rounded-full overflow-hidden border border-white/20">
                       <img src={currentTheme.url} className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div>
                       <div className="h-2 w-24 bg-white/20 rounded mb-2"></div>
                       <div className="h-2 w-16 bg-white/10 rounded"></div>
                    </div>
                    <Sparkles className="text-white ml-2" />
                 </div>
              </div>

              {/* Text Content */}
              <div className="order-1 md:order-2 glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/10 bg-white/5 backdrop-blur-xl text-white shadow-2xl text-right transform transition-all hover:scale-[1.01] duration-500">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 ml-auto">
                    <Wand2 className="text-white" />
                 </div>
                 <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-[0.9]">
                   INTELLIGENT <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-300 to-indigo-300">CURATION.</span>
                 </h2>
                 <p className="text-lg text-white/80 font-light leading-relaxed mb-8 ml-auto max-w-md">
                   Chaos to Cohesion. Let our visual intelligence engine weave your vague concepts into sharp, cohesive aesthetic boards.
                   From "{currentTheme.label}" to "Nomad", find your vibe instantly.
                 </p>
                 <div className="flex gap-2 justify-end text-xs font-mono uppercase tracking-widest text-white/50">
                    <span className="px-3 py-1 border border-white/20 rounded-full">Generate</span>
                    <span className="px-3 py-1 border border-white/20 rounded-full">Refine</span>
                    <span className="px-3 py-1 border border-white/20 rounded-full">Collect</span>
                 </div>
              </div>
           </div>
        </div>

        {/* SECTION 4: THE PHILOSOPHY */}
        <div className="min-h-[70vh] flex items-center justify-center relative py-20 px-4">
           <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="mb-8 flex justify-center">
                 <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
              </div>
              
              <div className="glass-panel bg-black/40 border-white/10 backdrop-blur-md p-10 md:p-16 rounded-[3rem] shadow-2xl">
                  <h2 className="text-sm font-mono uppercase tracking-[0.5em] text-sand mb-6">About Us</h2>
                  
                  <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-10 leading-tight">
                    Digital Tools for the <br/>
                    <span className="italic text-white/70 font-serif">Analog Soul</span>
                  </h3>
                  
                  <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed mb-12 mix-blend-overlay max-w-2xl mx-auto">
                    Sola was born from a simple belief: Algorithms should not replace artists; they should serve them. 
                    We built this platform to be a sanctuary for your aesthetic intuition—a place where raw ideas 
                    meet the precision of machine intelligence to create something entirely new.
                  </p>

                  <div className="relative py-8 md:py-12 border-t border-white/10">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-2 rounded-full border border-white/20">
                      <Infinity size={20} className="text-sand" />
                    </div>
                    <p className="text-2xl md:text-4xl font-display font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-terra via-sand to-cream animate-pulse-slow tracking-tight">
                      "the human creativity is beyond infinity"
                    </p>
                  </div>
              </div>
           </div>
        </div>

        {/* SECTION 5: FOOTER CTA */}
        <div className="min-h-[50vh] flex flex-col items-center justify-center relative py-20 px-4 text-center">
           <h2 className="text-4xl md:text-6xl font-display font-bold text-cream mb-8 tracking-tight mix-blend-overlay">
             READY TO CREATE?
           </h2>
           <button 
             onClick={handleEnter}
             className="group relative px-10 py-5 bg-white text-black font-display font-bold text-xl rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
           >
             <div 
                className="absolute inset-0 transition-colors duration-300 opacity-20"
                style={{ backgroundColor: currentTheme.accent }}
             ></div>
             <span className="relative z-10 flex items-center gap-3">
               ENTER STUDIO <MoveRight className="group-hover:translate-x-1 transition-transform" />
             </span>
           </button>
           
           <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16 text-white/40">
              <div className="flex flex-col items-center gap-2">
                 <Zap size={20} />
                 <span className="text-[10px] uppercase tracking-widest">Fast</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <Sparkles size={20} />
                 <span className="text-[10px] uppercase tracking-widest">Magic</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <Layers size={20} />
                 <span className="text-[10px] uppercase tracking-widest">Depth</span>
              </div>
           </div>
           
           <footer className="absolute bottom-6 text-white/20 text-[10px] uppercase tracking-[0.2em]">
             Sola Intelligence Systems
           </footer>
        </div>

      </div>
    </div>
  );
};
    