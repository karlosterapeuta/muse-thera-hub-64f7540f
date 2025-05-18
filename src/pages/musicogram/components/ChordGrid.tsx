
import React from 'react';

interface ChordGridProps {
  rows?: number;
  columns?: number;
  className?: string;
  color?: string;
}

/**
 * Renders a chord grid with customizable rows and columns
 */
export const ChordGrid: React.FC<ChordGridProps> = ({ 
  rows = 6, 
  columns = 4, 
  className = '',
  color = "#333333"
}) => {
  return (
    <div 
      className={`grid gap-[2px] ${className}`}
      style={{ 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`
      }}
    >
      {Array.from({ length: rows * columns }).map((_, i) => (
        <div 
          key={i} 
          className="aspect-square border border-black"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export default ChordGrid;
