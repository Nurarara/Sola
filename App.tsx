
import React, { useState, useEffect, useMemo } from 'react';
import { NavBar } from './components/NavBar';
import { PinCard } from './components/PinCard';
import { VibeGenerator } from './components/VibeGenerator';
import { PosterGenerator } from './components/PosterGenerator';
import { LandingPage } from './components/LandingPage';
import { PinDetail } from './components/PinDetail';
import { ProfileDrawer } from './components/ProfileDrawer';
import { CATEGORIES, generateInitialPins } from './constants';
import { Pin } from './types';
import { Filter, Shuffle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Landing State
  const [showLanding, setShowLanding] = useState(true);

  // Get current theme based on active category
  const currentCategory = useMemo(() => CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0], [activeCategory]);
  const theme = currentCategory.theme;

  // Initialize with random aesthetic pins
  useEffect(() => {
    setPins(generateInitialPins(25));
    setHeroLoaded(true);
  }, []);

  // Now accepts an array of pins
  const handleNewPins = (newPins: Pin[]) => {
    setPins(prev => [...newPins, ...prev]);
    setIsGeneratorOpen(false);
    setIsPosterOpen(false);
    
    if (newPins.length > 0) {
      if(newPins[0].posterData) {
        setActiveCategory('all'); 
      } else {
        setActiveCategory(newPins[0].category);
      }
    }
  };

  // Filter logic (Category + Search)
  const filteredPins = useMemo(() => {
    let result = pins;
    
    // 1. Filter by Category
    if (activeCategory !== 'all') {
      result = result.filter(pin => pin.category === activeCategory || pin.category === 'all');
    }

    // 2. Filter by Search
    if (searchQuery.trim()) {
       const q = searchQuery.toLowerCase();
       result = result.filter(pin => 
          pin.title.toLowerCase().includes(q) || 
          pin.description.toLowerCase().includes(q) ||
          (pin.posterData && pin.posterData.title.toLowerCase().includes(q))
       );
    }

    return result;
  }, [pins, activeCategory, searchQuery]);

  return (
    <>
      {showLanding && (
        <LandingPage onEnter={() => setShowLanding(false)} />
      )}

      <div 
        className={`min-h-screen font-sans pb-20 transition-all duration-1000 ease-in-out ${showLanding ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}
        style={{ backgroundColor: theme.background, color: theme.text }}
      >
        <NavBar 
          onOpenGenerator={() => setIsGeneratorOpen(true)} 
          onOpenPoster={() => setIsPosterOpen(true)}
          onLogoClick={() => setShowLanding(true)}
          onProfileClick={() => setIsProfileOpen(true)}
          theme={theme}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Hero Section */}
        <div className={`relative pt-44 pb-24 px-6 overflow-hidden transition-all duration-1000 ${searchQuery ? 'hidden md:block opacity-50' : 'opacity-100'}`}>
          {/* Dynamic Background Gradients */}
          <div 
            className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] animate-float pointer-events-none mix-blend-multiply transition-all duration-1000 ${theme.heroGradient1} ${heroLoaded ? 'opacity-100' : 'opacity-0'}`} 
          />
          <div 
            className={`absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] animate-float-delayed pointer-events-none mix-blend-multiply transition-all duration-1000 ${theme.heroGradient2} ${heroLoaded ? 'opacity-100' : 'opacity-0'}`} 
          />

          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
            
            <div className="mb-8 animate-fade-in">
              <span 
                className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/40 border border-white/60 backdrop-blur-sm text-xs font-bold tracking-[0.2em] uppercase shadow-sm transition-colors duration-1000"
                style={{ color: theme.accent }}
              >
                <Sparkles size={12} />
                Visual Intelligence Engine
              </span>
            </div>

            {/* Dynamic Title */}
            <h1 
              className={`text-7xl md:text-9xl mb-6 leading-[0.9] transition-all duration-1000 ${theme.titleFont}`}
              style={{ color: theme.text, ...theme.titleStyle }}
            >
              SOLA
            </h1>
            
            <p 
              className="text-xl md:text-2xl max-w-xl mx-auto mb-16 font-light leading-relaxed font-display transition-colors duration-1000"
              style={{ color: `${theme.text}90` }} // 90 hex opacity
            >
              {currentCategory.id === 'all' ? 'Curate the unwritten. A digital canvas for your aesthetic soul.' : `Curating the essence of ${currentCategory.label}.`}
            </p>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 relative z-20">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchQuery(''); // Clear search when changing category
                  }}
                  className={`px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-500 border ${
                    activeCategory === cat.id
                      ? `scale-105 shadow-xl`
                      : `bg-white/50 border-white/50 hover:bg-white hover:shadow-md opacity-70 hover:opacity-100`
                  }`}
                  style={{ 
                    backgroundColor: activeCategory === cat.id ? theme.text : undefined, 
                    color: activeCategory === cat.id ? theme.background : theme.text,
                    borderColor: activeCategory === cat.id ? theme.text : undefined
                  }}
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
          <div className="flex items-center justify-between mb-10 sticky top-24 z-30 py-4 bg-white/10 backdrop-blur-xl border-b -mx-4 px-4 md:-mx-8 md:px-8 transition-all duration-1000" style={{ borderColor: `${theme.text}10` }}>
            <h2 
              className="text-3xl font-display font-bold flex items-center gap-3 tracking-tighter transition-colors duration-1000"
              style={{ color: theme.text }}
            >
              {searchQuery ? 'SEARCH RESULTS' : (activeCategory === 'all' ? 'DISCOVER' : currentCategory.label.toUpperCase())}
              <span className="text-lg font-normal font-sans opacity-50">/</span>
              <span className="text-base font-medium font-sans opacity-50">
                {filteredPins.length} Frames
              </span>
            </h2>
            <div className="flex gap-3">
              <button 
                className="p-3 rounded-full bg-white/80 border transition-all shadow-sm hover:text-white" 
                style={{ borderColor: `${theme.text}10`, color: `${theme.text}80` }}
                title="Shuffle"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.accent; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'; e.currentTarget.style.color = `${theme.text}80`; }}
              >
                <Shuffle size={20} onClick={() => setPins(prev => [...prev].sort(() => Math.random() - 0.5))} />
              </button>
              <button 
                className="p-3 rounded-full bg-white/80 border transition-all shadow-sm hover:text-white" 
                style={{ borderColor: `${theme.text}10`, color: `${theme.text}80` }}
                title="Filter"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.accent; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)'; e.currentTarget.style.color = `${theme.text}80`; }}
              >
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
                onClick={setSelectedPin} 
              />
            ))}
          </div>

          {filteredPins.length === 0 && (
            <div className="text-center py-32 border-2 border-dashed rounded-3xl bg-white/20 transition-colors duration-1000" style={{ borderColor: `${theme.text}20` }}>
                <p className="text-xl font-display mb-4 opacity-40" style={{ color: theme.text }}>
                   {searchQuery ? `No results for "${searchQuery}"` : 'Canvas Empty'}
                </p>
                <button 
                  onClick={() => setIsGeneratorOpen(true)}
                  className="px-8 py-3 text-white font-bold rounded-full hover:shadow-lg transition-all"
                  style={{ backgroundColor: theme.accent }}
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
            onCreated={handleNewPins}
          />
        )}

        {isPosterOpen && (
          <PosterGenerator
            onClose={() => setIsPosterOpen(false)}
            onCreated={handleNewPins}
          />
        )}

        {/* Side Drawers */}
        <ProfileDrawer 
           isOpen={isProfileOpen}
           onClose={() => setIsProfileOpen(false)}
           theme={theme}
        />

        {/* Pin Detail Modal */}
        {selectedPin && (
          <PinDetail 
            pin={selectedPin}
            onClose={() => setSelectedPin(null)}
          />
        )}
        
        {/* Global Gradient Footer */}
        <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-10 transition-colors duration-1000" style={{ background: `linear-gradient(to top, ${theme.background}, transparent)` }} />
      </div>
    </>
  );
};

export default App;
