import { useState, useRef } from "react";
import { InstrumentType } from "./types";
import { UkuleleIcon } from "./components/UkuleleIcon";
import MusicogramCanvas from "./components/MusicogramCanvas";
import { defaultTemplates } from "./data/musicogramData";
import { 
  Brush, 
  Eraser, 
  Trash2, 
  Save, 
  Hand, 
  Download, 
  ZoomIn, 
  ZoomOut,
  Circle,
  MusicIcon,
  Piano,
  Star,
  CupSoda,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const defaultInstruments: InstrumentType[] = [
  { id: "ukulele", name: "Violão", shape: "square", color: "#FF5252" },
  { id: "triangle", name: "Triângulo", shape: "triangle", color: "#7E69AB" },
  { id: "drum", name: "Tambor", shape: "circle", color: "#1E88E5" },
  { id: "tambourine", name: "Pandeiro", shape: "circle", color: "#FFFFFF" },
  { id: "rattle", name: "Chocalho", shape: "square", color: "#FFC107" },
  { id: "hands", name: "Palmas", shape: "hand", color: "#FF9800" },
  { id: "feet", name: "Pés", shape: "footprints", color: "#4CAF50" },
  { id: "silence", name: "Silêncio", shape: "silence", color: "#E91E63" }
];

// Define our musical symbols with increased size
const musicalSymbols: InstrumentType[] = [
  { id: "circle-black", name: "Círculo", shape: "symbol", color: "#000000", iconType: "symbol", iconContent: "●", size: 36 },
  { id: "circle-red", name: "Círculo Vermelho", shape: "symbol", color: "#FF0000", iconType: "symbol", iconContent: "●", size: 36 },
  { id: "circle-blue", name: "Círculo Azul", shape: "symbol", color: "#0000FF", iconType: "symbol", iconContent: "●", size: 36 },
  { id: "circle-group", name: "Grupo de Círculos", shape: "symbol", color: "#000000", iconType: "symbol", iconContent: "○○○", size: 36 },
  { id: "note", name: "Nota N", shape: "symbol", color: "#0000FF", iconType: "symbol", iconContent: "N", size: 36 },
  { id: "waves", name: "Ondas", shape: "symbol", color: "#0000FF", iconType: "symbol", iconContent: "~", size: 36 },
  { id: "hand", name: "Mão", shape: "symbol", color: "#000000", iconType: "symbol", iconContent: "✋", size: 36 },
  { id: "tree", name: "Árvore", shape: "symbol", color: "#000000", iconType: "symbol", iconContent: "🌳", size: 36 },
  { id: "face", name: "Rosto", shape: "symbol", color: "#000000", iconType: "symbol", iconContent: "☺", size: 36 },
  { id: "cup", name: "Copo", shape: "symbol", color: "#6B4226", iconType: "symbol", iconContent: "☕", size: 36 },
  { id: "plastic-cup", name: "Copo de Plástico", shape: "symbol", color: "#1E88E5", iconType: "symbol", iconContent: "🥤", size: 36 },
  { id: "no-symbol", name: "Proibido", shape: "symbol", color: "#FF0000", iconType: "symbol", iconContent: "⊘", size: 36 },
  { id: "chord-grid", name: "Grade de Acordes", shape: "grid", color: "#333333", iconType: "grid", iconContent: "", size: 60 }
];

// Default chord labels configuration based on the provided image
const defaultChordLabels = {
  "0-0": "BbM7", 
  "1-0": "BM7", 
  "2-0": "C#M7", 
  "3-0": "BM7", 
  "4-0": "BbM7"
};

// Add this new component for the chord grid
const ChordGrid = ({ className }: { className?: string }) => {
  return (
    <div className={`grid grid-cols-4 gap-[2px] ${className}`}>
      {Array.from({ length: 24 }).map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const cellKey = `${row}-${col}`;
        const label = defaultChordLabels[cellKey];
        
        return (
          <div key={i} className="aspect-square bg-[#333333] border border-black relative">
            {label && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                {label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function MusicogramPage() {
  const [activeInstrument, setActiveInstrument] = useState<string | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [activeColor, setActiveColor] = useState<string>("#FF5252");
  const [activeSymbol, setActiveSymbol] = useState<InstrumentType | null>(null);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Canvas ref and elements state would be here
  const [canvasElements, setCanvasElements] = useState<any[]>([]);

  const handleInstrumentSelect = (instrumentId: string) => {
    setActiveInstrument(instrumentId);
    setIsErasing(false);
    setActiveSymbol(null);
    
    // Find selected instrument and use its color
    const instrument = defaultInstruments.find(i => i.id === instrumentId);
    if (instrument) {
      setActiveColor(instrument.color);
    }
    
    setIsDrawingMode(true);
  };

  // Add a special case for the chord grid
  const handleSymbolSelect = (symbol: InstrumentType) => {
    setActiveSymbol(symbol);
    setActiveInstrument(null);
    setIsErasing(false);
    setActiveColor(symbol.color);
    setIsDrawingMode(true);
  };

  // Função para lidar com o início do arrasto (para símbolos e instrumentos)
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: InstrumentType, type: 'symbol' | 'instrument') => {
    const dragData = {
      ...item,
      type
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Função para gerenciar o drop no canvas
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    try {
      const dropData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (!canvasRef.current) return;
      
      // Calcular a posição relativa dentro do canvas
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      
      let newElement;
      
      if (dropData.type === 'symbol') {
        // Criar novo elemento simbólico no canvas na posição do drop
        newElement = {
          id: uuidv4(),
          type: 'element',
          x: x,
          y: y,
          color: dropData.color,
          size: dropData.size || 36,
          shape: dropData.shape,
          iconType: dropData.iconType,
          iconContent: dropData.iconContent,
          position: { x, y },
          rotation: 0
        };
        
        toast.success("Símbolo adicionado com sucesso!");
      } else if (dropData.type === 'instrument') {
        // Criar novo elemento de instrumento no canvas na posição do drop
        let iconContent = "▪"; // Default square shape
        
        // Adaptar o ícone conforme o tipo de instrumento
        if (dropData.shape === 'circle') {
          iconContent = "●";
        } else if (dropData.shape === 'triangle') {
          iconContent = "▲";
        } else if (dropData.shape === 'hand') {
          iconContent = "✋";
        } else if (dropData.shape === 'footprints') {
          iconContent = "👣";
        } else if (dropData.shape === 'silence') {
          iconContent = "🤫";
        } else if (dropData.id === 'ukulele') {
          iconContent = "🎸";
        }
        
        newElement = {
          id: uuidv4(),
          type: 'element',
          x: x,
          y: y,
          color: dropData.color,
          size: dropData.size || 40,
          shape: dropData.shape,
          iconType: 'instrument',
          iconContent: iconContent,
          instrumentId: dropData.id,
          position: { x, y },
          rotation: 0
        };
        
        toast.success("Instrumento adicionado com sucesso!");
      } else if (dropData.type === 'grid' || dropData.iconType === 'grid') {
        // Create a new chord grid element at the drop position
        newElement = {
          id: uuidv4(),
          type: 'element',
          x: x,
          y: y,
          color: "#333333",
          size: 60,
          shape: "grid",
          iconType: "grid",
          iconContent: "",
          position: { x, y },
          rotation: 0,
          gridLabels: defaultChordLabels // Add the chord labels
        };
        
        toast.success("Grade de acordes adicionada com sucesso!");
      }
      
      if (newElement) {
        setCanvasElements(prev => [...prev, newElement]);
      }
    } catch (error) {
      console.error("Erro ao soltar o elemento:", error);
      toast.error("Erro ao adicionar elemento");
    }
  };

  // Funções para permitir o drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    setActiveInstrument(null);
    setActiveSymbol(null);
    setIsDrawingMode(true);
  };

  const clearCanvas = () => {
    if (window.confirm("Tem certeza que deseja limpar o musicograma?")) {
      setCanvasElements([]);
    }
  };

  const toggleMode = () => {
    setIsDrawingMode(!isDrawingMode);
    setIsErasing(false);
    
    // Mostrar dica ao mudar para modo de manipulação
    if (isDrawingMode) {
      toast.info("Modo de movimentação livre ativado! Arraste as figuras livremente pelo quadro.");
    }
  };

  const saveCanvas = () => {
    // Save functionality would be implemented here
    // This would likely involve saving to a database
    alert("Musicograma salvo com sucesso!");
  };

  const exportAsImage = async () => {
    const canvasElement = document.getElementById('musicogram-canvas');
    if (canvasElement) {
      try {
        const canvas = await html2canvas(canvasElement, {
          backgroundColor: null,
          scale: 2
        });
        
        const image = canvas.toDataURL("image/png", 1.0);
        const downloadLink = document.createElement("a");
        downloadLink.href = image;
        downloadLink.download = `musicograma_${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (error) {
        console.error("Erro ao exportar imagem:", error);
        alert("Ocorreu um erro ao exportar a imagem");
      }
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  // Function to render the instrument shape with drag and drop support
  const renderInstrumentShape = (instrument: InstrumentType, index: number) => {
    const isActive = activeInstrument === instrument.id;
    
    return (
      <div 
        key={index} 
        className={`flex flex-col items-center justify-center p-1 sm:p-2 transition-all cursor-grab rounded-lg ${
          isActive ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        onClick={() => handleInstrumentSelect(instrument.id)}
        draggable
        onDragStart={(e) => handleDragStart(e, instrument, 'instrument')}
      >
        <div 
          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md transition-transform duration-200 hover:scale-110"
          style={{ color: instrument.color }}
        >
          {instrument.id === "ukulele" ? (
            <UkuleleIcon className="w-8 h-8 sm:w-10 sm:h-10" />
          ) : instrument.shape === "circle" ? (
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" style={{ backgroundColor: instrument.color }}></div>
          ) : instrument.shape === "triangle" ? (
            <div style={{ 
              width: '0', 
              height: '0', 
              borderLeft: isMobile ? '12px solid transparent' : '15px solid transparent',
              borderRight: isMobile ? '12px solid transparent' : '15px solid transparent',
              borderBottom: `${isMobile ? '24px' : '30px'} solid ${instrument.color}`
            }}></div>
          ) : instrument.shape === "square" ? (
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md" style={{ backgroundColor: instrument.color }}></div>
          ) : instrument.shape === "hand" ? (
            <Hand size={isMobile ? 24 : 32} fill={instrument.color} color={instrument.color} />
          ) : instrument.shape === "footprints" ? (
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width={isMobile ? "24" : "32"} height={isMobile ? "24" : "32"} fill={instrument.color}>
                <path d="M9 1c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3zm1.75 7l-2.5 2l1.5 1l-4.75 4.75l2 2l7-7l1.5 1l-2-5l-2.75 1.25z" />
              </svg>
            </div>
          ) : instrument.shape === "silence" ? (
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center opacity-80">
              <svg viewBox="0 0 24 24" width={isMobile ? "24" : "32"} height={isMobile ? "24" : "32"} fill={instrument.color}>
                <path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10s10-4.5 10-10s-4.5-10-10-10zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" />
              </svg>
            </div>
          ) : null}
        </div>
        <span className="text-[10px] sm:text-xs mt-1 text-center">{instrument.name}</span>
      </div>
    );
  };

  // Function to render musical symbols with drag and drop
  const renderMusicalSymbol = (symbol: InstrumentType, index: number) => {
    const isActive = activeSymbol?.id === symbol.id;
    
    return (
      <div 
        key={index} 
        className={`flex flex-col items-center justify-center p-1 sm:p-2 transition-all cursor-grab rounded-lg ${
          isActive ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        onClick={() => handleSymbolSelect(symbol)}
        draggable
        onDragStart={(e) => handleDragStart(e, symbol, symbol.iconType === 'grid' ? 'grid' : 'symbol')}
      >
        <div 
          className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-md transition-transform duration-200 hover:scale-110 text-xl sm:text-2xl font-bold"
          style={{ color: symbol.color }}
        >
          {symbol.id === 'chord-grid' ? (
            <ChordGrid className="w-10 h-10" />
          ) : (
            symbol.iconContent
          )}
        </div>
        <span className="text-[10px] sm:text-xs mt-1 text-center">{symbol.name}</span>
      </div>
    );
  };

  const handleDeleteElement = (elementId: string) => {
    setCanvasElements(prev => prev.filter(el => el.id !== elementId));
  };

  const handleUpdateElement = (updatedElement: any) => {
    setCanvasElements(prev => 
      prev.map(el => el.id === updatedElement.id ? updatedElement : el)
    );
  };

  const getTemplateById = (id: string) => {
    return defaultTemplates.find(template => template.id === id) || defaultTemplates[0];
  };

  // Modified the Star component rendering to pass it as a React component
  const renderStarIcon = () => {
    return <div className="hidden md:flex flex-grow items-end justify-center pb-4">
      <div className="w-20 h-20 md:w-32 md:h-32 opacity-10">
        <Star />
      </div>
    </div>;
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Musicograma</h1>
      </div>

      <div className="flex flex-wrap gap-1 sm:gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg shadow overflow-x-auto">
        <Button
          variant={isDrawingMode ? "default" : "outline"}
          size={isMobile ? "sm" : "icon"}
          onClick={() => {
            setIsDrawingMode(true);
            setIsErasing(false);
          }}
          title="Modo Desenho"
        >
          <Brush size={isMobile ? 16 : 18} />
        </Button>
        <Button
          variant={!isDrawingMode ? "default" : "outline"}
          size={isMobile ? "sm" : "icon"}
          onClick={toggleMode}
          title="Modo Movimentação Livre"
          className={!isDrawingMode ? "bg-green-500 hover:bg-green-600" : ""}
        >
          <Hand size={isMobile ? 16 : 18} />
        </Button>
        <Button 
          variant={isErasing ? "destructive" : "outline"} 
          size={isMobile ? "sm" : "icon"}
          onClick={toggleEraser}
          title="Borracha"
          disabled={!isDrawingMode}
        >
          <Eraser size={isMobile ? 16 : 18} />
        </Button>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "icon"}
          onClick={clearCanvas}
          title="Limpar Tudo"
        >
          <Trash2 size={isMobile ? 16 : 18} />
        </Button>
        <div className="h-6 border-r border-gray-200 mx-1 hidden sm:block"></div>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "icon"}
          onClick={handleZoomIn}
          title="Ampliar"
        >
          <ZoomIn size={isMobile ? 16 : 18} />
        </Button>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "icon"}
          onClick={handleZoomOut}
          title="Reduzir"
        >
          <ZoomOut size={isMobile ? 16 : 18} />
        </Button>
        <div className="h-6 border-r border-gray-200 mx-1 hidden sm:block"></div>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "icon"}
          onClick={saveCanvas}
          title="Salvar Musicograma"
        >
          <Save size={isMobile ? 16 : 18} />
        </Button>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "icon"}
          onClick={exportAsImage}
          title="Baixar como Imagem"
        >
          <Download size={isMobile ? 16 : 18} />
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-1 min-h-[500px]">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-2 sm:p-3 flex flex-col md:w-48 overflow-auto">
          <h3 className="font-medium mb-2 sm:mb-3 text-center">Instrumentos</h3>
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-2 gap-1 sm:gap-2">
            {defaultInstruments.map((instrument, index) => renderInstrumentShape(instrument, index))}
          </div>
          
          <div className="mt-4 sm:mt-6">
            <h3 className="font-medium mb-2 sm:mb-3 text-center">Símbolos Musicais</h3>
            <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-2 gap-1 sm:gap-2">
              {musicalSymbols.map((symbol, index) => renderMusicalSymbol(symbol, index))}
            </div>
          </div>
          
          {/* Status message */}
          <div className="mt-4 p-2 rounded text-center">
            <div className={`text-sm font-medium ${isDrawingMode ? "text-blue-600" : "text-green-600"}`}>
              {isDrawingMode 
                ? "Modo Desenho: Arraste símbolos para o quadro" 
                : "Modo Movimentação Livre: Arraste e gire as figuras livremente"}
            </div>
            {!isDrawingMode && (
              <div className="text-xs text-gray-600 mt-1">
                Clique e arraste para mover. Use os controles para redimensionar e girar.
              </div>
            )}
            <div className="text-xs bg-blue-100 text-blue-800 p-2 rounded mt-2">
              Arraste os ícones diretamente para o quadro - agora com movimentação livre!
            </div>
          </div>
          
          {renderStarIcon()}
        </div>
        
        <div 
          ref={canvasRef} 
          className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-auto rounded-lg shadow p-1 sm:p-2 relative"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <MusicogramCanvas 
            template={getTemplateById(defaultTemplates[0].id)}
            activeInstrument={activeInstrument}
            isErasing={isErasing}
            isDrawingMode={isDrawingMode}
            activeColor={activeColor}
            elements={canvasElements}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            zoom={zoom}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
        </div>
      </div>
    </div>
  );
}
