
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
  color = "#333333",
  labels = {}
}) => {
  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      {/* Create grid of cells */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex w-full" style={{ height: `${100 / rows}%` }}>
          {Array.from({ length: columns }).map((_, colIndex) => {
            // Get label for this cell if it exists
            const cellKey = `${rowIndex}-${colIndex}`;
            const label = labels[cellKey];
            
            return (
              <div 
                key={`cell-${rowIndex}-${colIndex}`} 
                className="relative border border-black flex items-center justify-center"
                style={{ 
                  width: `${100 / columns}%`,
                  height: '100%',
                  backgroundColor: color,
                }}
              >
                {label && (
                  <span 
                    className="text-white font-bold text-lg sm:text-xl"
                    style={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                    }}
                  >
                    {label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ChordGrid;
