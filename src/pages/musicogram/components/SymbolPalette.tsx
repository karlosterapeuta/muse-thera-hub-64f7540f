
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

  const renderSymbolGrid = (symbolList: InstrumentType[]) => {
    // Display consistently 5 icons per row on all device sizes
    return (
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {symbolList.map((symbol, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center justify-center p-1 transition-all cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`}
            onClick={() => onSymbolSelect(symbol)}
            draggable="true" 
            onDragStart={(e) => {
              // Set cursor style to grabbing when dragging starts
              e.currentTarget.style.cursor = 'grabbing';
              onDragStart(e, symbol, 'symbol');
            }}
            onDragEnd={(e) => {
              // Reset cursor style when drag ends
              e.currentTarget.style.cursor = 'pointer';
            }}
          >
            <div 
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-md transition-transform duration-200 hover:scale-110 text-2xl sm:text-3xl md:text-4xl font-bold cursor-grab" 
              style={{ color: symbol.color }}
            >
              {symbol.iconContent}
            </div>
            <span className="text-xs mt-1 text-center truncate w-full">{symbol.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1">
      <h3 className="font-medium mb-2 sm:mb-3 text-center">Símbolos Musicais</h3>
      
      <Tabs defaultValue="all" value={symbolCategory} onValueChange={setSymbolCategory} className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-2">
          <TabsTrigger value="all" className="text-xs sm:text-sm px-1 py-1 sm:px-3 sm:py-2">Todos</TabsTrigger>
          <TabsTrigger value="shapes" className="text-xs sm:text-sm px-1 py-1 sm:px-3 sm:py-2">Formas</TabsTrigger>
          <TabsTrigger value="hands" className="text-xs sm:text-sm px-1 py-1 sm:px-3 sm:py-2">Gestos</TabsTrigger>
          <TabsTrigger value="emotions" className="text-xs sm:text-sm px-1 py-1 sm:px-3 sm:py-2">Emoções</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {renderSymbolGrid(categories.all)}
        </TabsContent>
        
        <TabsContent value="shapes" className="mt-0">
          {renderSymbolGrid(categories.shapes)}
        </TabsContent>
        
        <TabsContent value="hands" className="mt-0">
          {renderSymbolGrid(categories.hands)}
        </TabsContent>
        
        <TabsContent value="emotions" className="mt-0">
          {renderSymbolGrid(categories.emotions)}
        </TabsContent>
      </Tabs>

      <div className="mt-4 p-2 rounded text-center">
        <div className={`text-xs sm:text-sm font-medium ${isDrawingMode ? "text-blue-600" : "text-green-600"}`}>
          {isDrawingMode 
            ? "Modo Desenho: Clique nos símbolos para adicionar ao grid" 
            : "Modo Movimentação Livre: Arraste e gire as figuras livremente"}
        </div>
        {!isDrawingMode && (
          <div className="text-xs text-gray-600 mt-1">
            Clique e arraste os símbolos para qualquer lugar! Movimente livremente sem restrições de posição.
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
