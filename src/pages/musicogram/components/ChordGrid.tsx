
import React from 'react';

interface ChordGridProps {
  rows?: number;
  columns?: number;
  className?: string;
  color?: string;
  labels?: { [key: string]: string }; // Format: "row-col": "ChordName"
  isClickable?: boolean;
  onCellClick?: (row: number, col: number) => void;
  highlightCell?: { row: number, col: number } | null;
}

/**
 * Renders a guitar fretboard grid with customizable rows and columns and chord labels
 */
export const ChordGrid: React.FC<ChordGridProps> = ({ 
  rows = 5, 
  columns = 4, 
  className = '',
  color = "#222222", // Fundo escuro por padrão
  labels = {},
  isClickable = false,
  onCellClick,
  highlightCell = null
}) => {
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (isClickable && onCellClick) {
      onCellClick(rowIndex, colIndex);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      {/* Create grid of cells */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex w-full" style={{ height: `${100 / rows}%` }}>
          {Array.from({ length: columns }).map((_, colIndex) => {
            // Get label for this cell if it exists
            const cellKey = `${rowIndex}-${colIndex}`;
            const label = labels[cellKey];
            
            // Check if this cell should be highlighted
            const isHighlighted = highlightCell && 
                                  highlightCell.row === rowIndex && 
                                  highlightCell.col === colIndex;
            
            return (
              <div 
                key={`cell-${rowIndex}-${colIndex}`} 
                className={`relative border border-gray-600 flex items-center justify-center ${isClickable ? 'cursor-pointer' : ''} ${
                  isHighlighted ? 'ring-2 ring-primary ring-opacity-70' : ''
                }`}
                style={{ 
                  width: `${100 / columns}%`,
                  height: '100%',
                  backgroundColor: color,
                }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                data-row={rowIndex}
                data-col={colIndex}
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
