
import { Category, Pin } from './types';

export const CATEGORIES: Category[] = [
  { 
    id: 'all', 
    label: 'All', 
    promptHelper: 'aesthetic mixed media', 
    theme: {
      background: '#F5F5DC', // Cream
      text: '#A0522D', // Leather
      accent: '#E35336', // Terra
      secondary: '#F4A460', // Sand
      heroGradient1: 'bg-terra/10',
      heroGradient2: 'bg-sand/20',
      titleFont: 'font-display',
      titleStyle: { letterSpacing: '-0.05em' }
    }
  },
  { 
    id: 'botanica', 
    label: 'Botanica', 
    promptHelper: 'lush exotic plants, greenhouse, sunbeams, macro texture, organic', 
    theme: {
      background: '#F1F8F4', // Pale Sage
      text: '#1B4D3E', // Deep Jungle Green
      accent: '#4A7c59', // Leaf Green
      secondary: '#A8C6B3', // Soft Green
      heroGradient1: 'bg-emerald-500/10',
      heroGradient2: 'bg-green-300/20',
      titleFont: 'font-serif', // Elegant serif for organic feel
      titleStyle: { fontStyle: 'italic', fontWeight: '400' }
    }
  },
  { 
    id: 'nomad', 
    label: 'Nomad', 
    promptHelper: 'desert dunes, moroccan architecture, warm sunset, travel photography', 
    theme: {
      background: '#FFF8F0', // Warm Sand
      text: '#8B4513', // Saddle Brown
      accent: '#D2691E', // Chocolate
      secondary: '#DEB887', // Burlywood
      heroGradient1: 'bg-orange-500/10',
      heroGradient2: 'bg-yellow-500/10',
      titleFont: 'font-display',
      titleStyle: { letterSpacing: '0.1em', textTransform: 'uppercase' }
    }
  },
  { 
    id: 'atelier', 
    label: 'Atelier', 
    promptHelper: 'art studio, oil painting texture, cluttered creative space, warm lighting', 
    theme: {
      background: '#F5F5F7', // Studio White/Grey
      text: '#1a1a1a', // Charcoal
      accent: '#3B82F6', // Cobalt Blue
      secondary: '#94A3B8', // Slate
      heroGradient1: 'bg-blue-500/10',
      heroGradient2: 'bg-slate-400/10',
      titleFont: 'font-sans',
      titleStyle: { fontWeight: '800', letterSpacing: '-0.08em' }
    }
  },
  { 
    id: 'nostalgia', 
    label: 'Nostalgia', 
    promptHelper: 'vintage film grain, 90s aesthetic, polaroid style, muted colors', 
    theme: {
      background: '#FFFDF5', // Aged Paper
      text: '#9F1239', // Faded Rose
      accent: '#B45309', // Amber
      secondary: '#FCD34D', // Yellow
      heroGradient1: 'bg-rose-500/10',
      heroGradient2: 'bg-amber-500/10',
      titleFont: 'font-serif',
      titleStyle: { letterSpacing: '0.05em', fontWeight: '300' }
    }
  },
  { 
    id: 'minimal', 
    label: 'Minimal', 
    promptHelper: 'beige aesthetics, shadows on wall, clean lines, architectural', 
    theme: {
      background: '#FAFAFA', // Pure Grey/White
      text: '#262626', // Neutral Black
      accent: '#525252', // Neutral Grey
      secondary: '#D4D4D4', // Light Grey
      heroGradient1: 'bg-gray-900/5',
      heroGradient2: 'bg-gray-400/10',
      titleFont: 'font-sans',
      titleStyle: { fontWeight: '300', letterSpacing: '0.2em' }
    }
  },
  { 
    id: 'mirage', 
    label: 'Mirage', 
    promptHelper: 'surreal collage, dreamscape, floating islands, clouds, pastel', 
    theme: {
      background: '#FDFAFF', // Pale Lilac
      text: '#5B21B6', // Deep Violet
      accent: '#8B5CF6', // Violet
      secondary: '#C4B5FD', // Lavender
      heroGradient1: 'bg-violet-500/10',
      heroGradient2: 'bg-fuchsia-400/10',
      titleFont: 'font-display',
      titleStyle: { filter: 'blur(1px)', letterSpacing: '0.05em' }
    }
  },
];

const AESTHETIC_TITLES = [
  "Ethereal Silence", "Neon Dreamscape", "Velvet Horizon", "Concrete Poetry",
  "Liquid Time", "Silent Botanical", "Urban Solitude", "Desert Whisper",
  "Chrome Reflection", "Glass Garden", "Midnight Prism", "Solar Flare",
  "Rustic Echo", "Paper Memories", "Azure Void", "Lost Frequency",
  "Golden Hour", "Static Bloom", "Digital Haze", "Analog Soul"
];

const AESTHETIC_DESCRIPTIONS = [
  "A fleeting moment captured in digital amber.",
  "Where light meets shadow in perfect harmony.",
  "The quiet space between thoughts.",
  "Textures of reality, reimagined.",
  "A visual symphony of color and form.",
  "Nostalgia for a place never visited.",
  "Nature's chaotic geometry.",
  "The architecture of dreams.",
  "Soft whispers of a forgotten future.",
  "Echoes of light dancing on the surface."
];

// Helper to generate initial random pins using Picsum with curated metadata
export const generateInitialPins = (count: number): Pin[] => {
  // Get category IDs excluding 'all' to distribute initial pins across specific vibes
  const categoryIds = CATEGORIES.filter(c => c.id !== 'all').map(c => c.id);

  return Array.from({ length: count }).map((_, i) => {
    const width = 600;
    const height = Math.floor(Math.random() * (900 - 500 + 1)) + 500; // Taller aspect ratios
    const seed = Math.random().toString(36).substring(7);
    
    // Select random curated metadata
    const randomTitle = AESTHETIC_TITLES[Math.floor(Math.random() * AESTHETIC_TITLES.length)];
    const randomDesc = AESTHETIC_DESCRIPTIONS[Math.floor(Math.random() * AESTHETIC_DESCRIPTIONS.length)];
    const randomCategory = categoryIds[Math.floor(Math.random() * categoryIds.length)];

    return {
      id: `init-${i}-${Date.now()}`,
      url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
      title: randomTitle,
      description: randomDesc,
      category: randomCategory,
      heightRatio: height / width,
      author: 'Sola Collective',
      isGenerated: false,
    };
  });
};
