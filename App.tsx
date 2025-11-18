import React, { useState, useEffect, useMemo } from 'react';
import { NavBar } from './components/NavBar';
import { PinCard } from './components/PinCard';
import { VibeGenerator } from './components/VibeGenerator';
import { CATEGORIES, generateInitialPins } from './constants';
import { Pin } from './types';
import { Filter, Shuffle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Initialize with random aesthetic pins
  useEffect(() => {
    setPins(generateInitialPins(25));
    setHeroLoaded(true);
  }, []);

  const handleNewPin = (newPin: Pin) => {
    setPins(prev => [newPin, ...prev]);
    setIsGeneratorOpen(false);
    setActiveCategory(newPin.category);
  };

  // Filter logic
  const filteredPins = useMemo(() => {
    if (activeCategory === 'all') return pins;
    return pins.filter(pin => pin.category === activeCategory || pin.category === 'all'); 
  }, [pins, activeCategory]);

  return (
    <div className="min-h-screen bg-cream text-leather font-sans selection:bg-terra/30 selection:text-leather pb-20 transition-colors duration-500">
      <NavBar onOpenGenerator={() => setIsGeneratorOpen(true)} />

      {/* Hero Section */}
      <div className="relative pt-44 pb-24 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-terra/10 rounded-full blur-[120px] animate-float pointer-events-none mix-blend-multiply transition-opacity duration-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] bg-sand/20 rounded-full blur-[100px] animate-float-delayed pointer-events-none mix-blend-multiply transition-opacity duration-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`} />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          
          <div className="mb-8 animate-fade-in">
             <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/40 border border-white/60 backdrop-blur-sm text-terra text-xs font-bold tracking-[0.2em] uppercase shadow-sm">
               <Sparkles size={12} />
               Visual Intelligence Engine
             </span>
          </div>

          <h1 className="text-7xl md:text-9xl font-display font-bold text-leather mb-6 tracking-tighter leading-[0.9]">
            SOLA
          </h1>
          
          <p className="text-xl md:text-2xl text-leather/70 max-w-xl mx-auto mb-16 font-light leading-relaxed font-display">
            Curate the unwritten. A digital canvas for your aesthetic soul.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 relative z-20">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? `bg-leather text-cream border-leather shadow-xl shadow-leather/10 scale-105`
                    : `bg-white/50 border-white/50 text-leather/60 hover:bg-white hover:text-leather hover:shadow-md`
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <main className="max-w-[1800px] mx-auto px-4 md:px-8">
        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-10 sticky top-24 z-30 py-4 bg-cream/90 backdrop-blur-xl border-b border-leather/5 -mx-4 px-4 md:-mx-8 md:px-8 transition-all">
           <h2 className="text-3xl font-display font-bold text-leather flex items-center gap-3 tracking-tighter">
             {activeCategory === 'all' ? 'DISCOVER' : CATEGORIES.find(c => c.id === activeCategory)?.label}
             <span className="text-sand text-lg font-normal font-sans">/</span>
             <span className="text-leather/40 text-base font-medium font-sans">
               {filteredPins.length} Frames
             </span>
           </h2>
           <div className="flex gap-3">
             <button className="p-3 rounded-full bg-white border border-leather/10 hover:bg-terra hover:border-terra hover:text-white text-leather/50 transition-all shadow-sm" title="Shuffle">
               <Shuffle size={20} onClick={() => setPins(prev => [...prev].sort(() => Math.random() - 0.5))} />
             </button>
             <button className="p-3 rounded-full bg-white border border-leather/10 hover:bg-terra hover:border-terra hover:text-white text-leather/50 transition-all shadow-sm" title="Filter">
               <Filter size={20} />
             </button>
           </div>
        </div>

        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-8 space-y-8 pb-32">
           {filteredPins.map((pin) => (
             <PinCard 
               key={pin.id} 
               pin={pin} 
               onClick={(p) => console.log('Clicked', p)} 
             />
           ))}
        </div>

        {filteredPins.length === 0 && (
           <div className="text-center py-32 border-2 border-dashed border-leather/10 rounded-3xl bg-white/20">
              <p className="text-leather/40 text-xl font-display mb-4">Canvas Empty</p>
              <button 
                onClick={() => setIsGeneratorOpen(true)}
                className="px-8 py-3 bg-terra text-cream font-bold rounded-full hover:shadow-lg hover:shadow-terra/30 transition-all"
              >
                Paint Reality
              </button>
           </div>
        )}
      </main>

      {/* Modals */}
      {isGeneratorOpen && (
        <VibeGenerator 
          onClose={() => setIsGeneratorOpen(false)} 
          onCreated={handleNewPin}
        />
      )}
      
      {/* Global Gradient Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream via-cream/80 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default App;