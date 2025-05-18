
import React from 'react';

interface ChordGridProps {
  rows?: number;
  columns?: number;
  className?: string;
  color?: string;
  labels?: { [key: string]: string }; // Format: "row-col": "ChordName"
}

/**
 * Renders a guitar fretboard grid with customizable rows and columns and chord labels
 */
export const ChordGrid: React.FC<ChordGridProps> = ({ 
  rows = 5, 
  columns = 4, 
  className = '',
  color = "#222222",
  labels = {}
}) => {
  // Create thicker horizontal lines for frets and thinner vertical lines for strings
  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      {/* Main background */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: color }}
      />

      {/* Horizontal lines (frets) */}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <div 
          key={`fret-${i}`} 
          className="absolute left-0 right-0"
          style={{ 
            height: i === 0 ? '3px' : '2px',  // Thicker line for the nut (top fret)
            backgroundColor: i === 0 ? '#FFFFFF' : '#9F9EA1',  // White for nut, silver for other frets
            top: `${(i / rows) * 100}%`,
            boxShadow: i === 0 ? 'none' : '0 1px 3px rgba(0,0,0,0.3)' // Shadow for metal frets
          }}
        />
      ))}

      {/* Vertical lines (strings) */}
      {Array.from({ length: columns }).map((_, i) => (
        <div 
          key={`string-${i}`} 
          className="absolute top-0 bottom-0"
          style={{ 
            width: `${1 + (i * 0.1)}px`,  // Strings get gradually thicker (bass to treble)
            backgroundColor: '#D8D8D8',  // Light silver color for strings
            left: `${((i + 0.5) / columns) * 100}%`,
            transform: 'translateX(-50%)'
          }}
        />
      ))}

      {/* Chord Labels */}
      {Object.entries(labels).map(([position, label]) => {
        const [rowStr, colStr] = position.split('-');
        const row = parseInt(rowStr, 10);
        const col = parseInt(colStr, 10);
        
        // Position the label in the center of each cell
        const top = ((row + 0.5) / rows) * 100;
        const left = ((col + 0.5) / columns) * 100;
        
        return (
          <div 
            key={`label-${position}`} 
            className="absolute flex items-center justify-center font-bold text-white text-xs sm:text-sm"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              transform: 'translate(-50%, -50%)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              padding: '2px 4px',
              borderRadius: '4px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 10
            }}
          >
            {label}
          </div>
        );
      })}
      
      {/* Position markers (dots) */}
      {[2, 4].map((position) => (
        <div 
          key={`marker-${position}`}
          className="absolute rounded-full bg-white opacity-50"
          style={{
            width: '12px',
            height: '12px',
            top: `${((position + 0.5) / rows) * 100}%`,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5
          }}
        />
      ))}
    </div>
  );
};

export default ChordGrid;
