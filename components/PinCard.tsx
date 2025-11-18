import React, { useState } from 'react';
import { Pin } from '../types';

interface PinCardProps {
  pin: Pin;
  onClick: (pin: Pin) => void;
}

export const PinCard: React.FC<PinCardProps> = ({ pin, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className="relative group mb-8 break-inside-avoid rounded-2xl overflow-hidden cursor-zoom-in"
      onClick={() => onClick(pin)}
    >
      {/* Loading Skeleton */}
      <div className={`absolute inset-0 bg-sand/20 animate-pulse ${isLoaded ? 'hidden' : 'block'}`} />
      
      <img 
        src={pin.url} 
        alt={pin.title}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-auto object-cover transition-all duration-1000 ease-out group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ aspectRatio: `1 / ${pin.heightRatio}` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-leather/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
        <h3 className="text-cream font-display font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
          {pin.title}
        </h3>
        <p className="text-cream/80 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
          {pin.description}
        </p>
      </div>

      {/* Aesthetic Border on Hover */}
      <div className="absolute inset-0 border-4 border-terra/0 group-hover:border-terra/100 transition-colors duration-500 rounded-2xl pointer-events-none z-20" />
    </div>
  );
};