
import React from 'react';
import { X, Download, Share2, Heart, Sparkles } from 'lucide-react';
import { Pin } from '../types';

interface PinDetailProps {
  pin: Pin;
  onClose: () => void;
}

export const PinDetail: React.FC<PinDetailProps> = ({ pin, onClose }) => {
  // Prevent scroll on body when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleDownload = async () => {
    try {
      const response = await fetch(pin.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `sola-${pin.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback for direct opening if fetch fails (e.g. CORS)
      window.open(pin.url, '_blank');
    }
  };

  const isPoster = !!pin.posterData;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-leather/30 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-cream w-full max-w-5xl max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl shadow-leather/20 flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden z-50 p-2 bg-black/20 text-white rounded-full backdrop-blur-sm"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-[60%] bg-sand/10 relative flex items-center justify-center overflow-hidden group">
          {/* Background Blur for fill */}
          <div 
             className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl"
             style={{ backgroundImage: `url(${pin.url})` }}
          />
          
          <img 
            src={pin.url} 
            alt={pin.title}
            className={`relative z-10 max-h-[60vh] md:max-h-[90vh] w-auto object-contain shadow-xl transition-transform duration-700 ${isPoster ? '' : 'group-hover:scale-[1.02]'}`}
            style={isPoster && pin.posterData ? { filter: pin.posterData.filter } : {}}
          />

          {/* Re-render Poster Overlays for fidelity if needed, purely visual */}
          {isPoster && pin.posterData && (
             <div className="absolute z-20 bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded uppercase tracking-widest font-bold border border-white/20">
               {pin.posterData.style} Edition
             </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-[40%] flex flex-col bg-cream relative z-20">
          
          {/* Header */}
          <div className="p-6 md:p-8 flex justify-between items-start border-b border-leather/5">
            <div>
               <div className="flex items-center gap-2 mb-2">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                   pin.isGenerated ? 'bg-terra/10 text-terra' : 'bg-leather/10 text-leather/60'
                 }`}>
                   {pin.category}
                 </span>
                 {pin.isGenerated && (
                   <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                     <Sparkles size={10} /> AI Created
                   </span>
                 )}
               </div>
               <h2 className="text-3xl md:text-4xl font-display font-bold text-leather leading-tight">
                 {pin.title}
               </h2>
            </div>
            <button 
              onClick={onClose}
              className="hidden md:block p-2 rounded-full hover:bg-leather/5 text-leather/40 hover:text-leather transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
            <p className="text-leather/70 text-lg font-light leading-relaxed mb-8 font-sans">
              {pin.description}
            </p>

            {pin.posterData && (
              <div className="bg-white p-4 rounded-xl border border-leather/5 mb-8">
                <h3 className="text-xs font-bold text-leather/40 uppercase tracking-widest mb-3">Poster Specs</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                   <div className="text-leather/60">Style</div>
                   <div className="font-medium text-leather capitalize">{pin.posterData.style}</div>
                   <div className="text-leather/60">Palette</div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pin.posterData.accentColor }} />
                      <span className="font-mono text-xs">{pin.posterData.accentColor}</span>
                   </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sand to-terra p-[2px]">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${pin.author || 'Sola'}&background=random`} 
                    alt="Author" 
                    className="w-full h-full rounded-full object-cover border-2 border-cream" 
                  />
               </div>
               <div>
                 <div className="text-xs font-bold text-leather/40 uppercase tracking-widest">Curated By</div>
                 <div className="font-display font-bold text-leather">{pin.author || 'Sola Collective'}</div>
               </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 md:p-8 border-t border-leather/5 bg-white/40 flex gap-3 mt-auto">
             <button className="p-4 rounded-xl border border-leather/10 text-leather hover:bg-white hover:border-terra/30 hover:text-terra transition-all">
               <Heart size={20} />
             </button>
             <button className="p-4 rounded-xl border border-leather/10 text-leather hover:bg-white hover:border-terra/30 hover:text-terra transition-all">
               <Share2 size={20} />
             </button>
             <button 
               onClick={handleDownload}
               className="flex-1 bg-leather text-cream font-bold font-display text-lg rounded-xl hover:bg-terra transition-all shadow-lg shadow-leather/20 hover:shadow-terra/30 hover:translate-y-[-2px] flex items-center justify-center gap-3"
             >
               <Download size={20} />
               <span>Download</span>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};
