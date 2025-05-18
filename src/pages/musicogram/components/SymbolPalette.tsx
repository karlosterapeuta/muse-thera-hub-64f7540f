
import React from "react";
import { InstrumentType } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Star } from "lucide-react";

interface SymbolPaletteProps {
  symbols: InstrumentType[];
  onSymbolSelect: (symbol: InstrumentType) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, symbol: InstrumentType, type: 'symbol' | 'instrument') => void;
  isDrawingMode: boolean;
}

const SymbolPalette: React.FC<SymbolPaletteProps> = ({
  symbols,
  onSymbolSelect,
  onDragStart,
  isDrawingMode
}) => {
  const isMobile = useIsMobile();

  const renderStarIcon = () => {
    return (
      <div className="hidden md:flex flex-grow items-end justify-center pb-4">
        <div className="w-20 h-20 md:w-32 md:h-32 opacity-10">
          <Star />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1">
      <h3 className="font-medium mb-2 sm:mb-3 text-center">Símbolos Musicais</h3>
      <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-2 gap-1 sm:gap-2">
        {symbols.map((symbol, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center justify-center p-1 sm:p-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`}
            onClick={() => onSymbolSelect(symbol)}
            draggable
            onDragStart={(e) => onDragStart(e, symbol, 'symbol')}
          >
            <div 
              className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-md transition-transform duration-200 hover:scale-110 text-xl sm:text-2xl font-bold"
              style={{ color: symbol.color }}
            >
              {symbol.iconContent}
            </div>
            <span className="text-[10px] sm:text-xs mt-1 text-center">{symbol.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2 rounded text-center">
        <div className={`text-sm font-medium ${isDrawingMode ? "text-blue-600" : "text-green-600"}`}>
          {isDrawingMode 
            ? "Modo Desenho: Clique nos símbolos para adicionar ao grid" 
            : "Modo Movimentação Livre: Arraste e gire as figuras livremente"}
        </div>
        {!isDrawingMode && (
          <div className="text-xs text-gray-600 mt-1">
            Clique e arraste para mover. Use os controles para redimensionar e girar.
          </div>
        )}
        <div className="text-xs bg-blue-100 text-blue-800 p-2 rounded mt-2">
          Clique em um instrumento ou símbolo para adicionar ao grid automaticamente
        </div>
      </div>

      {renderStarIcon()}
    </div>
  );
};

export default SymbolPalette;
