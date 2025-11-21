
import React, { useState } from 'react';
import { Pin, PosterData } from '../types';

interface PinCardProps {
  pin: Pin;
  onClick: (pin: Pin) => void;
}

export const PinCard: React.FC<PinCardProps> = ({ pin, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isPoster = !!pin.posterData;
  
  // Helper to safely get styles
  const pData = pin.posterData || {} as PosterData;
  const titleSize = pData.titleSize || 1;
  const textColor = pData.textColor || '#ffffff';
  const filter = pData.filter || 'none';

  return (
    <div 
      className="relative group mb-8 break-inside-avoid rounded-2xl overflow-hidden cursor-zoom-in bg-cream shadow-sm hover:shadow-xl transition-all duration-500"
      onClick={() => onClick(pin)}
    >
      {/* Loading Skeleton */}
      <div className={`absolute inset-0 bg-sand/20 animate-pulse ${isLoaded ? 'hidden' : 'block'}`} />
      
      {/* Poster Layout Wrapper */}
      <div className={`relative ${isPoster ? 'bg-cream' : ''}`}>
        <img 
          src={pin.url} 
          alt={pin.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-auto object-cover transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${isPoster ? '' : 'group-hover:scale-105'}`}
          style={{ 
            aspectRatio: `1 / ${pin.heightRatio}`,
            filter: isPoster ? filter : 'none'
          }}
        />

        {/* Special Poster Overlays */}
        {isPoster && pin.posterData && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Swiss Style */}
            {pin.posterData.style === 'swiss' && (
              <div className="h-full flex flex-col justify-between p-4">
                <div className="flex justify-between items-start mix-blend-difference text-white">
                  <span className="text-xs font-bold tracking-widest uppercase">SOLA ART LAB</span>
                  <span className="text-xs font-mono">NO. {pin.id.slice(-4)}</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-4 -mx-4 -mb-4 border-t border-leather/10">
                   <h2 
                    className="font-display font-bold leading-none mb-1" 
                    style={{
                      color: pin.posterData.accentColor,
                      fontSize: `${1.8 * titleSize}rem`
                    }}
                   >
                     {pin.posterData.title}
                   </h2>
                   <p 
                    className="text-xs font-sans tracking-wide uppercase"
                    style={{ color: textColor !== '#ffffff' ? textColor : 'rgba(160, 82, 45, 0.6)' }}
                   >
                     {pin.posterData.subtitle}
                   </p>
                </div>
              </div>
            )}

            {/* Editorial Style */}
            {pin.posterData.style === 'editorial' && (
               <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 via-black/30 to-transparent text-center">
                  <h2 
                    className="font-display italic font-light mb-2 tracking-tight"
                    style={{ color: textColor, fontSize: `${2.2 * titleSize}rem` }}
                  >
                    {pin.posterData.title}
                  </h2>
                  <div className="w-12 h-[1px] bg-cream/50 mx-auto mb-2" />
                  <p 
                    className="text-xs text-cream/80 font-sans uppercase tracking-[0.2em]"
                    style={{ color: textColor }}
                  >
                    {pin.posterData.subtitle}
                  </p>
               </div>
            )}

            {/* Brutalist Style */}
            {pin.posterData.style === 'brutalist' && (
               <div className="h-full relative p-4 border-2 border-white/20">
                 <h2 
                   className="absolute top-4 left-4 font-display font-bold text-transparent stroke-text tracking-tighter leading-none opacity-80 mix-blend-overlay"
                   style={{ 
                     WebkitTextStroke: `1px ${textColor}`, 
                     fontSize: `${3 * titleSize}rem` 
                   }}
                 >
                    {pin.posterData.title}
                 </h2>
                 <div 
                   className="absolute bottom-4 right-4 px-3 py-1 font-mono text-xs font-bold rotate-[-5deg] shadow-lg"
                   style={{ backgroundColor: pin.posterData.accentColor, color: 'white' }}
                 >
                    {pin.posterData.subtitle}
                 </div>
               </div>
            )}

            {/* Vintage Style */}
            {pin.posterData.style === 'vintage' && (
              <div className="absolute inset-4 border-[1px] border-white/40 flex flex-col items-center justify-center text-center p-4 bg-black/10 backdrop-blur-[1px]">
                 <div className="absolute top-2 text-[10px] tracking-[0.5em] text-white uppercase">Sola Visuals</div>
                 <h2 
                  className="font-serif italic mb-2 drop-shadow-md"
                  style={{ color: textColor, fontSize: `${2.5 * titleSize}rem` }}
                 >
                    {pin.posterData.title}
                 </h2>
                 <span className="w-full h-[1px] bg-white/50 max-w-[60px] mb-2"></span>
                 <p 
                  className="font-sans text-[10px] tracking-widest text-white/90 uppercase"
                  style={{ color: textColor }}
                 >
                   {pin.posterData.subtitle}
                 </p>
              </div>
            )}

            {/* Neon Style */}
            {pin.posterData.style === 'neon' && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 flex flex-col justify-end p-6">
                 <h2 
                   className="font-display font-bold mb-1 tracking-tighter"
                   style={{ 
                     color: textColor,
                     textShadow: `0 0 10px ${pin.posterData.accentColor}, 0 0 20px ${pin.posterData.accentColor}`,
                     fontSize: `${2.5 * titleSize}rem`
                   }}
                 >
                    {pin.posterData.title}
                 </h2>
                 <p className="text-xs font-mono text-white/80 border-l-2 pl-2" style={{ borderColor: pin.posterData.accentColor, color: textColor }}>
                    {`>>> ${pin.posterData.subtitle}`}
                 </p>
              </div>
            )}

            {/* Bauhaus Style */}
            {pin.posterData.style === 'bauhaus' && (
              <div className="h-full w-full relative">
                 <div 
                  className="absolute top-8 left-0 bg-white/90 px-4 py-1 font-bold font-display mix-blend-screen"
                  style={{ 
                    color: textColor === '#ffffff' ? '#000' : textColor,
                    fontSize: `${1.25 * titleSize}rem`
                  }}
                 >
                    {pin.posterData.title}
                 </div>
                 <div 
                   className="absolute bottom-0 right-0 w-2/3 h-16 p-4 flex items-center justify-end"
                   style={{ backgroundColor: pin.posterData.accentColor }}
                 >
                    <span className="font-bold font-mono text-sm uppercase tracking-tighter" style={{ color: textColor }}>
                      {pin.posterData.subtitle}
                    </span>
                 </div>
                 <div className="absolute top-0 right-0 w-12 h-12 bg-leather rounded-bl-full mix-blend-multiply opacity-80"></div>
              </div>
            )}
          </div>
        )}

        {/* Standard Overlay (Only for non-posters) */}
        {!isPoster && (
          <div className="absolute inset-0 bg-gradient-to-t from-leather/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
            <h3 className="text-cream font-display font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
              {pin.title}
            </h3>
            <p className="text-cream/80 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
              {pin.description}
            </p>
          </div>
        )}
      </div>

      {/* Aesthetic Border on Hover */}
      <div className="absolute inset-0 border-4 border-terra/0 group-hover:border-terra/100 transition-colors duration-500 rounded-2xl pointer-events-none z-20" />
    </div>
  );
};
