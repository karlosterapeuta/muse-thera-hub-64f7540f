
import { useState, useRef } from "react";
import { InstrumentType } from "./types";
import { defaultTemplates } from "./data/musicogramData";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import html2canvas from "html2canvas";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our components
import MusicogramToolbar from "./components/MusicogramToolbar";
import InstrumentPalette from "./components/InstrumentPalette";
import SymbolPalette from "./components/SymbolPalette";
import MusicogramEditor from "./components/MusicogramEditor";

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

// Define our musical symbols with increased size and new hand gestures, body touches, and emotions
const musicalSymbols: InstrumentType[] = [
  // Original symbols
  { id: "circle-black", name: "Círculo", shape: "symbol", color: "#000000", iconType: "symbol", iconContent: "●", size: 72 },
  { id: "circle-red", name: "Círculo Vermelho", shape: "symbol", color: "#FF0000", iconType: "symbol", iconContent: "●", size: 72 },
  { id: "circle-blue", name: "Círculo Azul", shape: "symbol", color: "#0000FF", iconType: "symbol", iconContent: "●", size: 72 },
  { id: "circle-group", name: "Grupo de Círculos", shape: "symbol", color: "#000000", iconType: "symbol", iconContent: "○○○", size: 72 },
  { id: "note", name: "Nota N", shape: "symbol", color: "#0000FF", iconType: "symbol", iconContent: "N", size: 72 },
  { id: "waves", name: "Ondas", shape: "symbol", color: "#0000FF", iconType: "symbol", iconContent: "~", size: 72 },
  
  // Hand gestures
  { id: "clapping", name: "Palmas", shape: "symbol", color: "#FF9800", iconType: "symbol", iconContent: "👏", size: 72 },
  { id: "fist", name: "Soco/Punho", shape: "symbol", color: "#E53935", iconType: "symbol", iconContent: "👊", size: 72 },
  { id: "hand-head", name: "Mão na Cabeça", shape: "symbol", color: "#5D4037", iconType: "symbol", iconContent: "🤦", size: 72 },
  { id: "hand-shoulder", name: "Mão no Ombro", shape: "symbol", color: "#5D4037", iconType: "symbol", iconContent: "💁", size: 72 },
  { id: "pointing", name: "Apontando", shape: "symbol", color: "#FFC107", iconType: "symbol", iconContent: "👆", size: 72 },
  { id: "knock", name: "Toc Toc", shape: "symbol", color: "#795548", iconType: "symbol", iconContent: "🚪👊", size: 72 },
  { id: "hand", name: "Mão", shape: "symbol", color: "#000000", iconType: "symbol", iconContent: "✋", size: 72 },
  
  // Emotions
  { id: "happy", name: "Feliz", shape: "symbol", color: "#FFD54F", iconType: "symbol", iconContent: "😊", size: 72 },
  { id: "sad", name: "Triste", shape: "symbol", color: "#90CAF9", iconType: "symbol", iconContent: "😢", size: 72 },
  { id: "angry", name: "Bravo", shape: "symbol", color: "#EF5350", iconType: "symbol", iconContent: "😠", size: 72 },
  { id: "surprised", name: "Surpreso", shape: "symbol", color: "#66BB6A", iconType: "symbol", iconContent: "😲", size: 72 },
  { id: "thinking", name: "Pensativo", shape: "symbol", color: "#78909C", iconType: "symbol", iconContent: "🤔", size: 72 },
  { id: "love", name: "Amor", shape: "symbol", color: "#EC407A", iconType: "symbol", iconContent: "❤️", size: 72 },
  
  // Other symbols (keep existing ones)
  { id: "tree", name: "Árvore", shape: "symbol", color: "#000000", iconType: "symbol", iconContent: "🌳", size: 72 },
  { id: "face", name: "Rosto", shape: "symbol", color: "#000000", iconType: "symbol", iconContent: "☺", size: 72 },
  { id: "cup", name: "Copo", shape: "symbol", color: "#6B4226", iconType: "symbol", iconContent: "☕", size: 72 },
  { id: "plastic-cup", name: "Copo de Plástico", shape: "symbol", color: "#1E88E5", iconType: "symbol", iconContent: "🥤", size: 72 },
  { id: "no-symbol", name: "Proibido", shape: "symbol", color: "#FF0000", iconType: "symbol", iconContent: "⊘", size: 72 }
];

// Empty guitar grid labels - no chord labels
const guitarGridLabels = {};

export default function MusicogramPage() {
  const [activeInstrument, setActiveInstrument] = useState<string | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false); // Set to false by default to enable free movement
  const [activeColor, setActiveColor] = useState<string>("#FF5252");
  const [activeSymbol, setActiveSymbol] = useState<InstrumentType | null>(null);
  const [zoom, setZoom] = useState(1);
  const isMobile = useIsMobile();

  // Canvas elements state
  const [canvasElements, setCanvasElements] = useState<any[]>([]);
  
  // Track the next position for organized grid placement
  const [nextPosition, setNextPosition] = useState<{ row: number, col: number }>({ row: 0, col: 0 });

  // Modified to directly place instrument in grid when clicked
  const handleInstrumentSelect = (instrumentId: string) => {
    // Find selected instrument
    const instrument = defaultInstruments.find(i => i.id === instrumentId);
    if (instrument) {
      addElementToGrid(instrument, 'instrument');
    }
  };

  // Modified to directly place symbol in grid when clicked
  const handleSymbolSelect = (symbol: InstrumentType) => {
    addElementToGrid(symbol, 'symbol');
  };

  // Common function to add element to grid
  const addElementToGrid = (item: InstrumentType, itemType: 'symbol' | 'instrument') => {
    // Adjust cell size based on device
    const cellSize = isMobile ? 60 : 80;
    
    // Calculate position based on nextPosition
    const { row, col } = nextPosition;
    const x = col * cellSize + cellSize / 2;
    const y = row * cellSize + cellSize / 2;
    
    let newElement;
    
    if (itemType === 'symbol') {
      newElement = {
        id: uuidv4(),
        type: 'element',
        x: x,
        y: y,
        color: item.color,
        size: item.size || 72, // Double the size from 36 to 72
        shape: item.shape,
        iconType: item.iconType || 'symbol',
        iconContent: item.iconContent,
        position: { x, y },
        rotation: 0
      };
      
      toast.success("Símbolo adicionado com sucesso!");
    } else if (itemType === 'instrument') {
      let iconContent = "▪"; // Default square shape
      
      // Adaptar o ícone conforme o tipo de instrumento
      if (item.shape === 'circle') {
        iconContent = "●";
      } else if (item.shape === 'triangle') {
        iconContent = "▲";
      } else if (item.shape === 'hand') {
        iconContent = "✋";
      } else if (item.shape === 'footprints') {
        iconContent = "👣";
      } else if (item.shape === 'silence') {
        iconContent = "🤫";
      } else if (item.id === 'ukulele') {
        iconContent = "🎸";
      }
      
      newElement = {
        id: uuidv4(),
        type: 'element',
        x: x,
        y: y,
        color: item.color,
        size: 80, // Double the size from 40 to 80
        shape: item.shape,
        iconType: 'instrument',
        iconContent: iconContent,
        instrumentId: item.id,
        position: { x, y },
        rotation: 0
      };
      
      toast.success("Instrumento adicionado com sucesso!");
    }
    
    if (newElement) {
      setCanvasElements(prev => [...prev, newElement]);
      
      // Update next position for organized flow with 5 columns
      let nextCol = col + 1;
      let nextRow = row;
      
      const maxCols = 5; // Changed to 5 icons per row
      
      if (nextCol >= maxCols) { // If we reach the end of a row
        nextCol = 0;
        nextRow = (nextRow + 1) % 5; // Move to next row, wrap around if needed
      }
      
      setNextPosition({ row: nextRow, col: nextCol });
    }
  };

  // Function to handle drag start (for symbols and instruments)
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: InstrumentType, type: 'symbol' | 'instrument') => {
    const dragData = {
      ...item,
      type
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Function to manage drop on canvas with responsive positioning
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    try {
      const dropData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // Calculate the relative position within the canvas
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      
      let newElement;
      
      if (dropData.type === 'symbol') {
        // Create new symbol element in canvas at drop position
        newElement = {
          id: uuidv4(),
          type: 'element',
          x: x,
          y: y,
          color: dropData.color,
          size: dropData.size || 72, // Double the size
          shape: dropData.shape,
          iconType: dropData.iconType,
          iconContent: dropData.iconContent,
          position: { x, y },
          rotation: 0
        };
        
        toast.success("Símbolo adicionado com sucesso!");
      } else if (dropData.type === 'instrument') {
        // Create new instrument element in canvas at drop position - adapted for responsive
        let iconContent = "▪"; // Default square shape
        
        // Adapt icon according to instrument type
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
          size: 80, // Double the size
          shape: dropData.shape,
          iconType: 'instrument',
          iconContent: iconContent,
          instrumentId: dropData.id,
          position: { x, y },
          rotation: 0
        };
        
        toast.success("Instrumento adicionado com sucesso!");
      }
      
      if (newElement) {
        setCanvasElements(prev => [...prev, newElement]);
      }
    } catch (error) {
      console.error("Erro ao soltar o elemento:", error);
      toast.error("Erro ao adicionar elemento");
    }
  };

  // Handle grid cell click for organized placement
  const handleGridCellClick = (row: number, col: number) => {
    // Update the next position to the clicked cell
    setNextPosition({ row, col });
  };

  // Functions to allow drop
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
      setNextPosition({ row: 0, col: 0 }); // Reset position tracking
    }
  };

  const toggleMode = () => {
    setIsDrawingMode(!isDrawingMode);
    setIsErasing(false);
    
    // Show tip when switching to manipulation mode
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

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Musicograma</h1>
      </div>

      {/* Toolbar Component */}
      <MusicogramToolbar 
        isDrawingMode={isDrawingMode}
        isErasing={isErasing}
        onDrawModeToggle={toggleMode}
        onEraserToggle={toggleEraser}
        onClearCanvas={clearCanvas}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onSaveCanvas={saveCanvas}
        onExportImage={exportAsImage}
      />
      
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 flex-1 min-h-[500px]">
        {/* Sidebar with Instruments and Symbols - now with better responsive sizing */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-2 sm:p-3 flex flex-col md:w-48 lg:w-56 overflow-auto">
          {/* Instrument Palette Component */}
          <InstrumentPalette 
            instruments={defaultInstruments}
            onInstrumentSelect={handleInstrumentSelect}
            onDragStart={handleDragStart}
          />
          
          <div className="mt-4 sm:mt-6">
            {/* Symbol Palette Component */}
            <SymbolPalette 
              symbols={musicalSymbols}
              onSymbolSelect={handleSymbolSelect}
              onDragStart={handleDragStart}
              isDrawingMode={isDrawingMode}
            />
          </div>
        </div>
        
        {/* Musicogram Editor Component */}
        <MusicogramEditor
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
          guitarGridLabels={guitarGridLabels}
          onGridCellClick={handleGridCellClick}
          nextPosition={nextPosition}
        />
      </div>
    </div>
  );
}
