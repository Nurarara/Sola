import { Category, Pin } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', promptHelper: 'aesthetic mixed media', color: 'bg-terra' },
  { id: 'botanica', label: 'Botanica', promptHelper: ' lush exotic plants, greenhouse, sunbeams, macro texture, organic', color: 'text-emerald-700 bg-emerald-100' },
  { id: 'nomad', label: 'Nomad', promptHelper: 'desert dunes, moroccan architecture, warm sunset, travel photography', color: 'text-orange-700 bg-orange-100' },
  { id: 'atelier', label: 'Atelier', promptHelper: 'art studio, oil painting texture, cluttered creative space, warm lighting', color: 'text-blue-700 bg-blue-100' },
  { id: 'nostalgia', label: 'Nostalgia', promptHelper: 'vintage film grain, 90s aesthetic, polaroid style, muted colors', color: 'text-red-700 bg-red-100' },
  { id: 'minimal', label: 'Minimal', promptHelper: 'beige aesthetics, shadows on wall, clean lines, architectural', color: 'text-stone-700 bg-stone-100' },
  { id: 'mirage', label: 'Mirage', promptHelper: 'surreal collage, dreamscape, floating islands, clouds, pastel', color: 'text-purple-700 bg-purple-100' },
];

// Helper to generate initial random pins using Picsum
export const generateInitialPins = (count: number): Pin[] => {
  return Array.from({ length: count }).map((_, i) => {
    const width = 600;
    const height = Math.floor(Math.random() * (900 - 500 + 1)) + 500; // Taller aspect ratios
    const seed = Math.random().toString(36).substring(7);
    
    return {
      id: `init-${i}-${Date.now()}`,
      url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
      title: 'Visual Fragment',
      description: 'A curated moment of beauty.',
      category: 'all',
      heightRatio: height / width,
      author: 'Sola Collective',
      isGenerated: false,
    };
  });
};