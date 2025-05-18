
import React from 'react';

interface ChordGridProps {
  rows?: number;
  columns?: number;
  className?: string;
  color?: string;
  labels?: { [key: string]: string }; // Format: "row-col": "ChordName"
}

/**
 * Renders a chord grid representing a guitar fretboard with customizable rows and columns and chord labels
 */
export const ChordGrid: React.FC<ChordGridProps> = ({ 
  rows = 5, 
  columns = 4, 
  className = '',
  color = "#222222",
  labels = {}
}) => {
  return (
    <div 
      className={`grid gap-[2px] ${className}`}
      style={{ 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`
      }}
    >
      {Array.from({ length: rows * columns }).map((_, i) => {
        const row = Math.floor(i / columns);
        const col = i % columns;
        const cellKey = `${row}-${col}`;
        const label = labels[cellKey];
        
        return (
          <div 
            key={i} 
            className="aspect-square border border-black relative"
            style={{ backgroundColor: color }}
          >
            {label && (
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                {label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChordGrid;
