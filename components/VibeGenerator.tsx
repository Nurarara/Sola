import React, { useState } from 'react';
import { X, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { generateCreativePrompt, generateAestheticImage, analyzeVibe } from '../services/geminiService';
import { Pin } from '../types';

interface VibeGeneratorProps {
  onClose: () => void;
  onCreated: (pin: Pin) => void;
}

export const VibeGenerator: React.FC<VibeGeneratorProps> = ({ onClose, onCreated }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState(''); 

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      setStatus('Consulting the Muse...');
      const optimizedPrompt = await generateCreativePrompt(selectedCategory.label, prompt);
      
      setStatus('Painting on Canvas...');
      const result = await generateAestheticImage(optimizedPrompt);
      
      if (result) {
        setStatus('Reading the Soul...');
        const analysis = await analyzeVibe(result.url);
        
        const newPin: Pin = {
          id: Date.now().toString(),
          url: result.url,
          title: analysis.title,
          description: analysis.description,
          category: selectedCategory.id,
          heightRatio: 4/3,
          isGenerated: true,
          author: 'You + Sola',
        };
        
        onCreated(newPin);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate vibe. Try again later.");
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-leather/20 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-cream border border-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl shadow-leather/10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-leather/5">
          <div className="flex items-center gap-4">
            <div className="bg-terra/10 p-3 rounded-2xl">
              <Wand2 size={24} className="text-terra" />
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-leather">New Creation</h2>
              <p className="text-leather/50 text-sm font-medium">Weave words into vision</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-leather/5 text-leather/40 hover:text-leather transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
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

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className={`w-full py-5 rounded-2xl font-display font-bold text-lg transition-all flex items-center justify-center gap-3 ${
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
                <span>Manifest</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};