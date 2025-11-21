import React, { useState } from 'react';
import { X, Sparkles, Loader2, Wand2, Check, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { generateCreativePrompt, generateAestheticImages, analyzeVibe } from '../services/geminiService';
import { Pin } from '../types';

interface VibeGeneratorProps {
  onClose: () => void;
  onCreated: (pins: Pin[]) => void;
}

export const VibeGenerator: React.FC<VibeGeneratorProps> = ({ onClose, onCreated }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  
  // State for the image selection phase
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndices, setSelectedImageIndices] = useState<number[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedImages([]);
    setSelectedImageIndices([]);
    
    try {
      setStatus('Consulting the Muse...');
      const optimizedPrompt = await generateCreativePrompt(selectedCategory.label, prompt);
      
      setStatus('Dreaming up variations...');
      // Generate 4 variations using Gemini 2.5 Flash Image
      const images = await generateAestheticImages(optimizedPrompt, 4);
      
      if (images.length > 0) {
        setGeneratedImages(images);
        setStatus('Select your favorites');
      } else {
        throw new Error("No images generated");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate vibe. Try again later.");
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  const toggleImageSelection = (index: number) => {
    setSelectedImageIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  };

  const handleSave = async () => {
    if (selectedImageIndices.length === 0) return;

    setIsGenerating(true);
    setStatus('Reading the Soul...');
    
    try {
      const newPins: Pin[] = [];

      for (const index of selectedImageIndices) {
        const url = generatedImages[index];
        // Analyze each selected image for metadata
        const analysis = await analyzeVibe(url);
        
        newPins.push({
          id: `${Date.now()}-${index}`,
          url: url,
          title: analysis.title,
          description: analysis.description,
          category: selectedCategory.id,
          heightRatio: 1, // Flash image usually generates square/1:1 by default
          isGenerated: true,
          author: 'You + Sola',
        });
      }

      onCreated(newPins);
    } catch (error) {
      console.error("Error saving pins", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isResultPhase = generatedImages.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-leather/20 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-cream border border-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-leather/10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-leather/5 shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-terra/10 p-3 rounded-2xl">
              <Wand2 size={24} className="text-terra" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-leather">
                {isResultPhase ? 'Curate Selection' : 'New Creation'}
              </h2>
              <p className="text-leather/50 text-sm font-medium">
                {isResultPhase ? 'Select the vibes that resonate' : 'Weave words into vision'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-leather/5 text-leather/40 hover:text-leather transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow">
          
          {!isResultPhase ? (
            <div className="space-y-8">
              {/* Category Selector */}
              <div>
                <label className="block text-sm font-bold text-leather/60 mb-4 uppercase tracking-wider">Choose Palette</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                        selectedCategory.id === cat.id 
                        ? 'bg-leather text-cream border-leather shadow-lg shadow-leather/20 scale-105' 
                        : 'bg-white text-leather/60 border-transparent hover:border-leather/20 hover:text-leather'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div>
                <label className="block text-sm font-bold text-leather/60 mb-4 uppercase tracking-wider">Vision</label>
                <div className="relative group">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`Describe a ${selectedCategory.label.toLowerCase()} scene...`}
                    className="w-full h-32 bg-white border border-leather/10 rounded-2xl p-5 text-leather placeholder-leather/30 focus:outline-none focus:ring-2 focus:ring-terra/20 focus:border-terra/50 resize-none transition-all shadow-sm group-hover:shadow-md"
                  />
                  <Sparkles className="absolute bottom-4 right-4 text-terra/30 pointer-events-none" size={20} />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => toggleImageSelection(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${
                    selectedImageIndices.includes(idx) 
                      ? 'ring-4 ring-terra ring-offset-2 ring-offset-cream scale-[0.98]' 
                      : 'hover:shadow-lg'
                  }`}
                >
                  <img src={img} alt={`Generated ${idx}`} className="w-full h-full object-cover" />
                  
                  {/* Selection Indicator */}
                  <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    selectedImageIndices.includes(idx) ? 'bg-terra text-white' : 'bg-black/30 text-white/50 backdrop-blur-sm group-hover:bg-black/50'
                  }`}>
                    {selectedImageIndices.includes(idx) && <Check size={16} strokeWidth={3} />}
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-terra/20 transition-opacity duration-300 ${selectedImageIndices.includes(idx) ? 'opacity-100' : 'opacity-0 group-hover:opacity-10'}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 border-t border-leather/5 bg-white/30 shrink-0">
          {!isResultPhase ? (
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className={`w-full py-4 rounded-2xl font-display font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                isGenerating 
                  ? 'bg-leather/10 text-leather/40 cursor-not-allowed' 
                  : 'bg-terra hover:bg-terra/90 text-cream shadow-xl shadow-terra/20 hover:shadow-terra/30 scale-100 hover:scale-[1.01]'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>{status}</span>
                </>
              ) : (
                <>
                  <Sparkles />
                  <span>Manifest Variations</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex gap-4">
               <button
                onClick={() => {
                  setGeneratedImages([]);
                  setSelectedImageIndices([]);
                }}
                className="px-6 py-4 rounded-2xl font-display font-bold text-leather bg-white hover:bg-leather/5 border border-leather/10 transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={selectedImageIndices.length === 0 || isGenerating}
                className={`flex-1 py-4 rounded-2xl font-display font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  selectedImageIndices.length === 0 || isGenerating
                    ? 'bg-leather/10 text-leather/40 cursor-not-allowed' 
                    : 'bg-terra hover:bg-terra/90 text-cream shadow-xl shadow-terra/20 hover:shadow-terra/30 scale-100 hover:scale-[1.01]'
                }`}
              >
                 {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>Adding to Board...</span>
                  </>
                ) : (
                  <>
                    <span>Save {selectedImageIndices.length} Selected</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};