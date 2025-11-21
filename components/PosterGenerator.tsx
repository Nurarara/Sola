
import React, { useState } from 'react';
import { X, Sparkles, Loader2, Palette, Type as TypeIcon, ArrowRight, PenTool, Image as ImageIcon, Droplet, Sliders } from 'lucide-react';
import { generatePosterMetadata, generateAestheticImages } from '../services/geminiService';
import { Pin, PosterData } from '../types';

interface PosterGeneratorProps {
  onClose: () => void;
  onCreated: (pins: Pin[]) => void;
}

// Available Styles
const STYLES: { id: PosterData['style']; label: string }[] = [
  { id: 'swiss', label: 'Swiss' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'brutalist', label: 'Brutalist' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'neon', label: 'Neon' },
  { id: 'bauhaus', label: 'Bauhaus' },
];

// Filters
const FILTERS = [
  { label: 'None', value: 'none' },
  { label: 'Noir', value: 'grayscale(100%) contrast(120%)' },
  { label: 'Sepia', value: 'sepia(80%) contrast(90%)' },
  { label: 'Muted', value: 'saturate(60%) brightness(110%)' },
  { label: 'Vivid', value: 'saturate(150%) contrast(110%)' },
  { label: 'Warm', value: 'sepia(30%) saturate(140%)' },
];

export const PosterGenerator: React.FC<PosterGeneratorProps> = ({ onClose, onCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<PosterData['style']>('swiss');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'style' | 'text' | 'image'>('style');
  
  // Editor State
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [accentColor, setAccentColor] = useState('#E35336');
  const [textColor, setTextColor] = useState('#ffffff');
  const [filter, setFilter] = useState('none');
  const [titleSize, setTitleSize] = useState(1.0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setImage(null);
    setErrorMsg(null);
    
    try {
      setStatus('Conceptualizing...');
      // Use current prompt to generate metadata
      const metadata = await generatePosterMetadata(prompt);
      
      // Auto-fill the editor fields with AI suggestions
      setTitle(metadata.title);
      setSubtitle(metadata.subtitle);
      setAccentColor(metadata.accentColor);
      // Reset defaults
      setFilter('none');
      setTitleSize(1.0);
      setTextColor(style === 'swiss' ? '#A0522D' : '#ffffff'); // Smart default based on style

      setStatus('Rendering Artwork...');
      // Generate using the upgraded model service (handles fallback internally)
      // Use the artPrompt if valid, otherwise fallback to user prompt
      const promptToUse = metadata.artPrompt && metadata.artPrompt.length > 5 ? metadata.artPrompt : prompt + ", artistic, 8k, poster art";
      
      const images = await generateAestheticImages(promptToUse, 1);
      
      if (images.length > 0) {
        setImage(images[0]);
      } else {
        throw new Error("The AI canvas remained blank. Please try again.");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setErrorMsg("Could not generate artwork. Please try a different prompt.");
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  const handleSave = () => {
    if (!image) return;

    const posterData: PosterData = {
      style: style,
      title: title,
      subtitle: subtitle,
      accentColor: accentColor,
      overlayText: true,
      filter: filter,
      textColor: textColor,
      titleSize: titleSize
    };

    const newPin: Pin = {
      id: `poster-${Date.now()}`,
      url: image,
      title: title,
      description: "Sola Art Lab Original",
      category: 'atelier',
      heightRatio: 1.2, 
      isGenerated: true,
      author: 'Art Lab',
      posterData: posterData
    };

    onCreated([newPin]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-leather/30 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-cream border border-white rounded-[2rem] w-full max-w-6xl max-h-[90vh] flex shadow-2xl shadow-leather/20 overflow-hidden">
        
        {/* Left Panel - Controls */}
        <div className="w-full md:w-[40%] p-6 flex flex-col border-r border-leather/5 bg-white/50">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-terra/10 p-2 rounded-xl">
                <Palette className="text-terra" size={24} />
              </div>
              <h2 className="font-display font-bold text-2xl text-leather">Art Lab</h2>
            </div>
            <button onClick={onClose} className="md:hidden p-2 text-leather/50"><X /></button>
          </div>

          {/* Scrollable Settings */}
          <div className="space-y-6 flex-grow overflow-y-auto custom-scrollbar pr-2">
            
            {/* Phase 1: Concept (Only if no image) */}
            {!image && (
              <div className="animate-in slide-in-from-left duration-300">
                <label className="block text-xs font-bold text-leather/40 mb-3 uppercase tracking-widest">Concept</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your vision (e.g., Cyberpunk bonsai tree, oil painting)..."
                  className="w-full h-32 bg-white border-2 border-transparent focus:border-terra/20 rounded-2xl p-4 text-lg font-display text-leather placeholder-leather/20 focus:outline-none resize-none transition-all shadow-sm"
                />
                
                <div className="mt-4">
                  <label className="block text-xs font-bold text-leather/40 mb-3 uppercase tracking-widest">Base Layout</label>
                  <div className="grid grid-cols-3 gap-2">
                    {STYLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          style === s.id 
                          ? 'bg-leather text-cream border-leather shadow-md transform scale-[1.02]' 
                          : 'bg-white border-transparent hover:border-leather/10 text-leather/60'
                        }`}
                      >
                        <span className="text-xs font-bold">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Phase 2: Editor (Visible after generation) */}
            {image && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Editor Tabs */}
                <div className="flex gap-1 bg-leather/5 p-1 rounded-xl mb-6">
                  <button 
                    onClick={() => setActiveTab('style')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'style' ? 'bg-white text-terra shadow-sm' : 'text-leather/50 hover:bg-white/50'}`}
                  >
                    <Sliders size={14} /> Style
                  </button>
                   <button 
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'text' ? 'bg-white text-terra shadow-sm' : 'text-leather/50 hover:bg-white/50'}`}
                  >
                    <TypeIcon size={14} /> Text
                  </button>
                  <button 
                    onClick={() => setActiveTab('image')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'image' ? 'bg-white text-terra shadow-sm' : 'text-leather/50 hover:bg-white/50'}`}
                  >
                    <ImageIcon size={14} /> Image
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-leather/5">
                  
                  {/* TAB: STYLE */}
                  {activeTab === 'style' && (
                     <div className="space-y-4">
                       <div>
                        <label className="block text-[10px] text-leather/40 uppercase mb-2 font-bold">Layout Presets</label>
                        <div className="grid grid-cols-2 gap-2">
                          {STYLES.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => setStyle(s.id)}
                              className={`px-3 py-2 text-left rounded-lg text-xs font-bold transition-all border ${style === s.id ? 'bg-terra/10 border-terra/20 text-terra' : 'bg-cream/30 border-transparent text-leather/60 hover:bg-cream'}`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                       </div>
                     </div>
                  )}

                  {/* TAB: TEXT */}
                  {activeTab === 'text' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-leather/40 uppercase mb-1 font-bold">Title Content</label>
                        <input 
                          type="text" 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-cream/50 border border-leather/10 rounded-lg p-2 text-leather font-display font-bold focus:outline-none focus:border-terra/50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] text-leather/40 uppercase mb-1 font-bold">Subtitle</label>
                        <input 
                          type="text" 
                          value={subtitle} 
                          onChange={(e) => setSubtitle(e.target.value)}
                          className="w-full bg-cream/50 border border-leather/10 rounded-lg p-2 text-leather/80 text-sm focus:outline-none focus:border-terra/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-leather/40 uppercase mb-2 font-bold">Text Color</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-2 border-leather/10"
                            />
                            <span className="text-xs font-mono text-leather/60">{textColor}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-leather/40 uppercase mb-2 font-bold">Title Size ({titleSize}x)</label>
                          <input 
                            type="range" 
                            min="0.5" 
                            max="2.0" 
                            step="0.1"
                            value={titleSize}
                            onChange={(e) => setTitleSize(parseFloat(e.target.value))}
                            className="w-full accent-terra"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-leather/40 uppercase mb-2 font-bold">Accent Color</label>
                        <div className="flex gap-2 flex-wrap">
                            {['#E35336', '#F4A460', '#A0522D', '#2F4F4F', '#FF00FF', '#00FFFF', '#F5F5DC'].map(c => (
                              <button 
                                key={c}
                                onClick={() => setAccentColor(c)}
                                className={`w-6 h-6 rounded-full border-2 shadow-sm transition-transform ${accentColor === c ? 'border-leather scale-110' : 'border-white'}`}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                            <input 
                              type="color" 
                              value={accentColor}
                              onChange={(e) => setAccentColor(e.target.value)}
                              className="w-6 h-6 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
                            />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: IMAGE */}
                  {activeTab === 'image' && (
                    <div className="space-y-4">
                       <div>
                         <label className="block text-[10px] text-leather/40 uppercase mb-2 font-bold">Filters</label>
                         <div className="grid grid-cols-3 gap-2">
                           {FILTERS.map(f => (
                             <button 
                               key={f.label}
                               onClick={() => setFilter(f.value)}
                               className={`p-2 rounded-lg text-xs font-medium transition-all border ${filter === f.value ? 'bg-terra text-white border-terra' : 'bg-cream/50 border-transparent text-leather/60 hover:bg-cream'}`}
                             >
                               {f.label}
                             </button>
                           ))}
                         </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-6 border-t border-leather/5">
             {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs text-center">
                  {errorMsg}
                </div>
             )}

            {!image ? (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className={`w-full py-4 rounded-xl font-display font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  isGenerating 
                    ? 'bg-leather/5 text-leather/40 cursor-not-allowed' 
                    : 'bg-leather text-cream hover:bg-terra shadow-xl shadow-leather/10 hover:shadow-terra/20'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span className="text-sm">{status}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Artwork</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex gap-3">
                 <button 
                   onClick={() => setImage(null)} 
                   className="px-4 py-4 rounded-xl font-bold text-leather/60 hover:bg-black/5 border border-transparent hover:border-leather/10 transition-all"
                 >
                   Reset
                 </button>
                 <button 
                   onClick={handleSave} 
                   className="flex-1 py-4 bg-terra text-cream rounded-xl font-bold shadow-lg shadow-terra/20 hover:translate-y-[-2px] transition-all flex justify-center items-center gap-2"
                 >
                   <span>Save to Gallery</span>
                   <ArrowRight size={18} />
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="hidden md:flex w-[60%] bg-sand/10 items-center justify-center p-12 relative overflow-hidden">
           {/* Background pattern */}
           <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#A0522D_1px,transparent_1px)] [background-size:16px_16px]" />
           
           <button onClick={onClose} className="absolute top-6 right-6 p-3 rounded-full bg-white/50 hover:bg-white text-leather/50 hover:text-leather transition-all z-10 shadow-sm">
            <X size={20} />
          </button>

          {image ? (
             <div className="flex flex-col items-center w-full max-w-md animate-in zoom-in-95 duration-500 relative z-10">
                <div className="text-xs font-bold text-leather/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Live Preview
                </div>
                
                {/* PREVIEW RENDERING LOGIC - Matches PinCard */}
                <div className="relative w-full aspect-[1/1.3] bg-cream shadow-2xl rounded-lg overflow-hidden border-[8px] border-white">
                   <img 
                      src={image} 
                      alt="Preview" 
                      className="w-full h-full object-cover transition-all duration-300" 
                      style={{ filter: filter }}
                   />
                   
                   {/* Overlay Logic */}
                   <div className="absolute inset-0 pointer-events-none">
                      {style === 'swiss' && (
                        <div className="h-full flex flex-col justify-between p-5">
                          <div className="flex justify-between text-white mix-blend-difference">
                            <span className="text-[10px] font-bold tracking-widest uppercase">PREVIEW</span>
                            <span className="text-[10px]">SOLA LAB</span>
                          </div>
                          <div className="bg-white/95 backdrop-blur-md p-6 -mx-5 -mb-5 border-t border-leather/5">
                             <h2 
                              className="font-display font-bold leading-none mb-2 transition-all" 
                              style={{ color: accentColor, fontSize: `${2.5 * titleSize}rem` }}
                             >
                               {title}
                             </h2>
                             <p className="text-[10px] text-leather/60 font-sans tracking-widest uppercase" style={{ color: textColor !== '#ffffff' ? textColor : undefined }}>
                               {subtitle}
                             </p>
                          </div>
                        </div>
                      )}
                      {style === 'editorial' && (
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-center">
                            <h2 
                              className="font-display italic font-light mb-3 transition-all"
                              style={{ color: textColor, fontSize: `${3 * titleSize}rem` }}
                            >
                              {title}
                            </h2>
                            <div className="w-8 h-[1px] bg-cream/50 mx-auto mb-3" />
                            <p className="text-[10px] font-sans uppercase tracking-[0.3em] opacity-80" style={{ color: textColor }}>{subtitle}</p>
                        </div>
                      )}
                      {style === 'brutalist' && (
                        <div className="h-full relative p-4 border-[3px] border-white/10">
                          <h2 
                            className="font-display font-bold text-transparent stroke-text opacity-90 mix-blend-overlay transition-all" 
                            style={{ WebkitTextStroke: `1px ${textColor}`, fontSize: `${3.5 * titleSize}rem` }}
                          >
                              {title}
                          </h2>
                           <div 
                             className="absolute bottom-8 right-8 bg-terra px-4 py-2 font-mono text-sm font-bold rotate-[-3deg] shadow-xl"
                             style={{ backgroundColor: accentColor, color: textColor === '#000000' ? 'white' : 'white' }} // Brutalist tag usually looks best with white text
                           >
                              {subtitle}
                           </div>
                        </div>
                      )}
                      {style === 'vintage' && (
                        <div className="absolute inset-4 border-[1px] border-white/40 flex flex-col items-center justify-center text-center p-4 bg-black/10 backdrop-blur-[1px]">
                           <div className="absolute top-2 text-[10px] tracking-[0.5em] text-white uppercase">Sola Visuals</div>
                           <h2 
                            className="font-serif italic mb-2 drop-shadow-md transition-all"
                            style={{ color: textColor, fontSize: `${3 * titleSize}rem` }}
                           >
                              {title}
                           </h2>
                           <span className="w-full h-[1px] bg-white/50 max-w-[60px] mb-2"></span>
                           <p className="font-sans text-[10px] tracking-widest opacity-90 uppercase" style={{ color: textColor }}>{subtitle}</p>
                        </div>
                      )}
                      {style === 'neon' && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 flex flex-col justify-end p-6">
                           <h2 
                             className="font-display font-bold mb-1 tracking-tighter transition-all"
                             style={{ 
                               color: textColor, 
                               textShadow: `0 0 10px ${accentColor}, 0 0 20px ${accentColor}`,
                               fontSize: `${3 * titleSize}rem`
                             }}
                           >
                              {title}
                           </h2>
                           <p className="text-xs font-mono opacity-80 border-l-2 pl-2" style={{ borderColor: accentColor, color: textColor }}>
                              {`>>> ${subtitle}`}
                           </p>
                        </div>
                      )}
                      {style === 'bauhaus' && (
                        <div className="h-full w-full relative">
                           <div 
                            className="absolute top-8 left-0 bg-white/90 px-4 py-1 font-bold font-display mix-blend-screen transition-all"
                            style={{ color: textColor === '#ffffff' ? '#000' : textColor, fontSize: `${1.5 * titleSize}rem` }}
                           >
                              {title}
                           </div>
                           <div 
                             className="absolute bottom-0 right-0 w-2/3 h-16 p-4 flex items-center justify-end"
                             style={{ backgroundColor: accentColor }}
                           >
                              <span className="font-bold font-mono text-sm uppercase tracking-tighter" style={{ color: textColor }}>
                                {subtitle}
                              </span>
                           </div>
                           <div className="absolute top-0 right-0 w-12 h-12 bg-leather rounded-bl-full mix-blend-multiply opacity-80"></div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          ) : (
            <div className="text-center text-leather/30 animate-pulse">
               <div className="w-32 h-40 border-2 border-dashed border-leather/10 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-white/20">
                 <Sparkles size={32} />
               </div>
               <p className="font-display text-lg font-medium">Your masterpiece awaits</p>
               <p className="text-sm opacity-60 mt-2">Describe a vision to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
