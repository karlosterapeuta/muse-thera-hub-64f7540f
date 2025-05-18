
import React, { useState } from "react";
import { InstrumentType } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Star, Smile, Fingerprint } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [symbolCategory, setSymbolCategory] = useState<string>("all");

  // Group symbols into categories
  const categories = {
    all: symbols,
    shapes: symbols.filter(s => ["circle-black", "circle-red", "circle-blue", "circle-group", "waves"].includes(s.id)),
    hands: symbols.filter(s => ["clapping", "fist", "hand-head", "hand-shoulder", "pointing", "knock", "hand"].includes(s.id)),
    emotions: symbols.filter(s => ["happy", "sad", "angry", "surprised", "thinking", "love", "face"].includes(s.id)),
    objects: symbols.filter(s => ["tree", "cup", "plastic-cup", "no-symbol", "note"].includes(s.id))
  };

  const renderStarIcon = () => {
    return (
      <div className="hidden md:flex flex-grow items-end justify-center pb-4">
        <div className="w-32 h-32 md:w-40 md:h-40 opacity-10">
          <Star className="w-full h-full" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1">
      <h3 className="font-medium mb-2 sm:mb-3 text-center">Símbolos Musicais</h3>
      
      <Tabs defaultValue="all" value={symbolCategory} onValueChange={setSymbolCategory} className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-2">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="shapes">Formas</TabsTrigger>
          <TabsTrigger value="hands">Gestos</TabsTrigger>
          <TabsTrigger value="emotions">Emoções</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-2 gap-1 sm:gap-2">
            {categories.all.map((symbol, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center justify-center p-1 sm:p-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`}
                onClick={() => onSymbolSelect(symbol)}
                draggable
                onDragStart={(e) => onDragStart(e, symbol, 'symbol')}
              >
                <div 
                  className="flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-md transition-transform duration-200 hover:scale-110 text-3xl sm:text-4xl font-bold"
                  style={{ color: symbol.color }}
                >
                  {symbol.iconContent}
                </div>
                <span className="text-xs sm:text-sm mt-1 text-center">{symbol.name}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="shapes" className="mt-0">
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-2 gap-1 sm:gap-2">
            {categories.shapes.map((symbol, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center justify-center p-1 sm:p-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`}
                onClick={() => onSymbolSelect(symbol)}
                draggable
                onDragStart={(e) => onDragStart(e, symbol, 'symbol')}
              >
                <div 
                  className="flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-md transition-transform duration-200 hover:scale-110 text-3xl sm:text-4xl font-bold"
                  style={{ color: symbol.color }}
                >
                  {symbol.iconContent}
                </div>
                <span className="text-xs sm:text-sm mt-1 text-center">{symbol.name}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="hands" className="mt-0">
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-2 gap-1 sm:gap-2">
            {categories.hands.map((symbol, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center justify-center p-1 sm:p-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`}
                onClick={() => onSymbolSelect(symbol)}
                draggable
                onDragStart={(e) => onDragStart(e, symbol, 'symbol')}
              >
                <div 
                  className="flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-md transition-transform duration-200 hover:scale-110 text-3xl sm:text-4xl font-bold"
                  style={{ color: symbol.color }}
                >
                  {symbol.iconContent}
                </div>
                <span className="text-xs sm:text-sm mt-1 text-center">{symbol.name}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="emotions" className="mt-0">
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-2 gap-1 sm:gap-2">
            {categories.emotions.map((symbol, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center justify-center p-1 sm:p-2 transition-all cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`}
                onClick={() => onSymbolSelect(symbol)}
                draggable
                onDragStart={(e) => onDragStart(e, symbol, 'symbol')}
              >
                <div 
                  className="flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-md transition-transform duration-200 hover:scale-110 text-3xl sm:text-4xl font-bold"
                  style={{ color: symbol.color }}
                >
                  {symbol.iconContent}
                </div>
                <span className="text-xs sm:text-sm mt-1 text-center">{symbol.name}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

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
