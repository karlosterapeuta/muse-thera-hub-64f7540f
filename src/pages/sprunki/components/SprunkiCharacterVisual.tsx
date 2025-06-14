
import React from 'react';
import { SprunkiCharacter } from '../types';

interface SprunkiCharacterVisualProps {
  character: SprunkiCharacter;
  size?: 'small' | 'medium' | 'large';
  isPlaying?: boolean;
  className?: string;
}

const SprunkiCharacterVisual: React.FC<SprunkiCharacterVisualProps> = ({
  character,
  size = 'medium',
  isPlaying = false,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-12 h-16';
      case 'large': return 'w-20 h-24 lg:w-24 lg:h-28';
      default: return 'w-16 h-20';
    }
  };

  const getHeadComponent = () => {
    const headColor = character.bodyColor || character.color;
    const baseClasses = "absolute top-0 left-1/2 transform -translate-x-1/2";
    
    switch (character.headShape) {
      case 'spiky':
        return (
          <div 
            className={`${baseClasses} w-8 h-8 relative`}
            style={{ backgroundColor: headColor }}
          >
            {/* Spikes */}
            <div className="absolute -top-1 left-1 w-2 h-3 bg-current transform rotate-12"></div>
            <div className="absolute -top-2 left-3 w-2 h-4 bg-current"></div>
            <div className="absolute -top-1 right-1 w-2 h-3 bg-current transform -rotate-12"></div>
            {/* Eyes */}
            <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full"></div>
          </div>
        );
      
      case 'rectangular':
        return (
          <div 
            className={`${baseClasses} w-8 h-6 rounded-sm flex items-center justify-center`}
            style={{ backgroundColor: headColor }}
          >
            {/* TV screen effect */}
            <div className="w-5 h-3 bg-black/20 rounded-sm flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        );
      
      case 'hat':
        return (
          <div className={`${baseClasses} w-8 h-8 relative`}>
            {/* Hat brim */}
            <div 
              className="absolute top-4 w-10 h-2 rounded-full -left-1"
              style={{ backgroundColor: headColor }}
            ></div>
            {/* Hat top */}
            <div 
              className="absolute top-0 left-1 w-6 h-5 rounded-t-full"
              style={{ backgroundColor: headColor }}
            >
              {/* Eyes */}
              <div className="absolute top-2 left-1 w-1 h-1 bg-white rounded-full"></div>
              <div className="absolute top-2 right-1 w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        );
      
      default: // round
        return (
          <div 
            className={`${baseClasses} w-8 h-8 rounded-full flex items-center justify-center relative`}
            style={{ backgroundColor: headColor }}
          >
            {/* Eyes */}
            <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full"></div>
            {/* Mouth */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-white/60 rounded-full"></div>
          </div>
        );
    }
  };

  return (
    <div className={`${getSizeClasses()} relative ${className}`}>
      {/* Body */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-12 rounded-b-full rounded-t-lg shadow-lg"
        style={{ backgroundColor: character.bodyColor || character.color }}
      >
        {/* Body decoration */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-white/20 rounded-full"></div>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-white/20 rounded-full"></div>
      </div>
      
      {/* Head */}
      {getHeadComponent()}
      
      {/* Playing effect */}
      {isPlaying && (
        <div className="absolute -top-2 -right-1 text-sm animate-bounce">
          🎵
        </div>
      )}
      
      {/* Glow effect when playing */}
      {isPlaying && (
        <div 
          className="absolute inset-0 rounded-full opacity-30 animate-pulse"
          style={{ 
            boxShadow: `0 0 20px ${character.color}`,
            backgroundColor: `${character.color}20`
          }}
        ></div>
      )}
    </div>
  );
};

export default SprunkiCharacterVisual;
