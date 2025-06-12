
import React from "react";
import { InstrumentType } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";

interface SymbolPaletteProps {
  symbols: InstrumentType[];
  onSymbolSelect: (symbol: InstrumentType) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, symbol: InstrumentType, type: 'symbol') => void;
  isDrawingMode: boolean;
}

const SymbolPalette: React.FC<SymbolPaletteProps> = ({
  symbols,
  onSymbolSelect,
  onDragStart,
  isDrawingMode
}) => {
  const isMobile = useIsMobile();

  // Organizar símbolos por categorias para melhor navegação
  const symbolCategories = {
    "Básicos": symbols.filter(s => ["circle-black", "circle-red", "circle-blue", "vertical-bar", "spiral", "square", "repeat-end"].includes(s.id)),
    "Gestos": symbols.filter(s => ["clapping", "fist", "hand-head", "hand-shoulder", "pointing"].includes(s.id)),
    "Emoções": [
      { id: "happy", name: "Feliz", shape: "symbol", color: "#FFD54F", iconType: "symbol", iconContent: "😊", size: 72 },
      { id: "sad", name: "Triste", shape: "symbol", color: "#9E9E9E", iconType: "symbol", iconContent: "😢", size: 72 },
      { id: "excited", name: "Animado", shape: "symbol", color: "#FF5722", iconType: "symbol", iconContent: "🤩", size: 72 },
      { id: "calm", name: "Calmo", shape: "symbol", color: "#4CAF50", iconType: "symbol", iconContent: "😌", size: 72 },
      { id: "surprised", name: "Surpreso", shape: "symbol", color: "#FF9800", iconType: "symbol", iconContent: "😮", size: 72 }
    ],
    "Dinâmica": [
      { id: "forte", name: "Forte", shape: "symbol", color: "#F44336", iconType: "symbol", iconContent: "💥", size: 72 },
      { id: "piano", name: "Piano", shape: "symbol", color: "#E1BEE7", iconType: "symbol", iconContent: "🤫", size: 72 },
      { id: "crescendo", name: "Crescendo", shape: "symbol", color: "#FF9800", iconType: "symbol", iconContent: "📈", size: 72 },
      { id: "diminuendo", name: "Diminuendo", shape: "symbol", color: "#2196F3", iconType: "symbol", iconContent: "📉", size: 72 }
    ],
    "Movimento": [
      { id: "walk", name: "Andar", shape: "symbol", color: "#795548", iconType: "symbol", iconContent: "🚶", size: 72 },
      { id: "run", name: "Correr", shape: "symbol", color: "#FF5722", iconType: "symbol", iconContent: "🏃", size: 72 },
      { id: "jump", name: "Pular", shape: "symbol", color: "#4CAF50", iconType: "symbol", iconContent: "🤸", size: 72 },
      { id: "dance", name: "Dançar", shape: "symbol", color: "#E91E63", iconType: "symbol", iconContent: "💃", size: 72 },
      { id: "spin", name: "Girar", shape: "symbol", color: "#9C27B0", iconType: "symbol", iconContent: "🌀", size: 72 }
    ],
    "Natureza": [
      { id: "water", name: "Água", shape: "symbol", color: "#00BCD4", iconType: "symbol", iconContent: "🌊", size: 72 },
      { id: "wind", name: "Vento", shape: "symbol", color: "#607D8B", iconType: "symbol", iconContent: "🍃", size: 72 },
      { id: "fire", name: "Fogo", shape: "symbol", color: "#FF5722", iconType: "symbol", iconContent: "🔥", size: 72 },
      { id: "earth", name: "Terra", shape: "symbol", color: "#795548", iconType: "symbol", iconContent: "🌍", size: 72 }
    ]
  };

  const allSymbols = [
    ...symbolCategories.Básicos,
    ...symbolCategories.Gestos,
    ...symbolCategories.Emoções,
    ...symbolCategories.Dinâmica,
    ...symbolCategories.Movimento,
    ...symbolCategories.Natureza
  ].filter(Boolean) as InstrumentType[];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
          Símbolos
        </h3>
      </div>
      
      <div className="space-y-3">
        {Object.entries(symbolCategories).map(([categoryName, categorySymbols]) => (
          <div key={categoryName} className="space-y-2">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              {categoryName}
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-2 gap-1 sm:gap-2">
              {categorySymbols.map((symbol) => (
                <div
                  key={symbol.id}
                  draggable={!isMobile}
                  onDragStart={(e) => !isMobile && onDragStart(e, symbol, 'symbol')}
                  onClick={() => onSymbolSelect(symbol)}
                  className={`
                    aspect-square rounded-lg border-2 border-gray-200 dark:border-gray-700 
                    flex items-center justify-center cursor-pointer
                    transition-all duration-200 hover:scale-105 hover:shadow-md
                    ${isMobile ? 'active:scale-95' : 'hover:border-gray-400'}
                    group relative overflow-hidden
                  `}
                  style={{ 
                    backgroundColor: `${symbol.color}15`,
                    borderColor: symbol.color 
                  }}
                >
                  <div 
                    className="text-xl sm:text-2xl transition-transform group-hover:scale-110"
                    style={{ color: symbol.color }}
                  >
                    {symbol.iconContent}
                  </div>
                  
                  {/* Tooltip com nome do símbolo */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                  bg-black text-white text-xs px-2 py-1 rounded 
                                  opacity-0 group-hover:opacity-100 transition-opacity
                                  pointer-events-none z-10 whitespace-nowrap">
                    {symbol.name}
                  </div>
                  
                  {/* Indicador visual para modo de desenho */}
                  {isDrawingMode && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 
                                    flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {isMobile && (
        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
            💡 Toque nos símbolos para adicioná-los ao musicograma
          </p>
        </div>
      )}
    </div>
  );
};

export default SymbolPalette;
