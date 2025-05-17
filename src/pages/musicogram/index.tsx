
import { useState } from "react";
import { InstrumentType } from "./types";
import { UkuleleIcon } from "./components/UkuleleIcon";
import MusicogramCanvas from "./components/MusicogramCanvas";
import ElementPalette from "./components/ElementPalette";
import { Star } from "./components/Star";
import MusicPlaylist from "./components/MusicPlaylist";
import PatientSelector from "./components/PatientSelector";
import TemplateSelector from "./components/TemplateSelector";
import { defaultTemplates } from "./data/musicogramData";
import { Brush, Eraser, Trash2, Save, Music, Image, Hand, Download, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

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

export default function MusicogramPage() {
  const [activeInstrument, setActiveInstrument] = useState<string | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [activeColor, setActiveColor] = useState<string>("#FF5252");
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplates[0].id);
  const [currentPatient, setCurrentPatient] = useState<string | null>(null);
  const [currentMusic, setCurrentMusic] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  // Canvas ref and elements state would be here
  const [canvasElements, setCanvasElements] = useState<any[]>([]);

  const handleInstrumentSelect = (instrumentId: string) => {
    setActiveInstrument(instrumentId);
    setIsErasing(false);
    
    // Find selected instrument and use its color
    const instrument = defaultInstruments.find(i => i.id === instrumentId);
    if (instrument) {
      setActiveColor(instrument.color);
    }
    
    setIsDrawingMode(true);
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    setActiveInstrument(null);
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
        downloadLink.download = `musicograma_${currentPatient || 'paciente'}_${new Date().toISOString().split('T')[0]}.png`;
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

  // Function to render the instrument shape
  const renderInstrumentShape = (instrument: InstrumentType, index: number) => {
    const isActive = activeInstrument === instrument.id;
    
    return (
      <div 
        key={index} 
        className={`flex flex-col items-center justify-center p-2 transition-all cursor-pointer rounded-lg ${
          isActive ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        onClick={() => handleInstrumentSelect(instrument.id)}
      >
        <div 
          className="flex items-center justify-center w-10 h-10 rounded-md transition-transform duration-200 hover:scale-110"
          style={{ color: instrument.color }}
        >
          {instrument.id === "ukulele" ? (
            <UkuleleIcon className="w-10 h-10" />
          ) : instrument.shape === "circle" ? (
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: instrument.color }}></div>
          ) : instrument.shape === "triangle" ? (
            <div style={{ 
              width: '0', 
              height: '0', 
              borderLeft: '15px solid transparent',
              borderRight: '15px solid transparent',
              borderBottom: `30px solid ${instrument.color}`
            }}></div>
          ) : instrument.shape === "square" ? (
            <div className="w-8 h-8 rounded-md" style={{ backgroundColor: instrument.color }}></div>
          ) : instrument.shape === "hand" ? (
            <Hand size={32} fill={instrument.color} color={instrument.color} />
          ) : instrument.shape === "footprints" ? (
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="32" height="32" fill={instrument.color}>
                <path d="M9 1c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3zm1.75 7l-2.5 2l1.5 1l-4.75 4.75l2 2l7-7l1.5 1l-2-5l-2.75 1.25z" />
              </svg>
            </div>
          ) : instrument.shape === "silence" ? (
            <div className="w-8 h-8 flex items-center justify-center opacity-80">
              <svg viewBox="0 0 24 24" width="32" height="32" fill={instrument.color}>
                <path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10s10-4.5 10-10s-4.5-10-10-10zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" />
              </svg>
            </div>
          ) : null}
        </div>
        <span className="text-xs mt-1 text-center">{instrument.name}</span>
      </div>
    );
  };

  const handleAddElement = (element: any) => {
    setCanvasElements(prev => [...prev, element]);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Musicograma</h1>
        <div className="flex items-center space-x-2">
          <PatientSelector 
            onPatientSelect={setCurrentPatient} 
            currentPatient={currentPatient}
          />
          <MusicPlaylist 
            onMusicSelect={setCurrentMusic} 
            currentMusic={currentMusic}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg shadow">
        <Button
          variant={isDrawingMode ? "default" : "outline"}
          size="icon"
          onClick={() => setIsDrawingMode(true)}
          title="Modo Desenho"
        >
          <Brush size={18} />
        </Button>
        <Button
          variant={!isDrawingMode ? "default" : "outline"}
          size="icon"
          onClick={() => setIsDrawingMode(false)}
          title="Modo Manipulação"
        >
          <Hand size={18} />
        </Button>
        <Button 
          variant={isErasing ? "destructive" : "outline"} 
          size="icon" 
          onClick={toggleEraser}
          title="Borracha"
        >
          <Eraser size={18} />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={clearCanvas}
          title="Limpar Tudo"
        >
          <Trash2 size={18} />
        </Button>
        <div className="h-6 border-r border-gray-200 mx-1"></div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleZoomIn}
          title="Ampliar"
        >
          <ZoomIn size={18} />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleZoomOut}
          title="Reduzir"
        >
          <ZoomOut size={18} />
        </Button>
        <div className="h-6 border-r border-gray-200 mx-1"></div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={saveCanvas}
          title="Salvar Musicograma"
        >
          <Save size={18} />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={exportAsImage}
          title="Baixar como Imagem"
        >
          <Download size={18} />
        </Button>
        <div className="h-6 border-r border-gray-200 mx-1"></div>
        <TemplateSelector 
          templates={defaultTemplates}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-3 flex flex-col md:w-48">
          <h3 className="font-medium mb-3 text-center">Instrumentos</h3>
          <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
            {defaultInstruments.map((instrument, index) => renderInstrumentShape(instrument, index))}
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-3 text-center">Elementos</h3>
            <ElementPalette onAddElement={handleAddElement} />
          </div>
          
          <div className="flex-grow flex items-end justify-center pb-4">
            <Star className="w-32 h-32 opacity-10" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-auto rounded-lg shadow p-2 relative">
          <MusicogramCanvas 
            template={getTemplateById(selectedTemplate)}
            activeInstrument={activeInstrument}
            isErasing={isErasing}
            isDrawingMode={isDrawingMode}
            activeColor={activeColor}
            elements={canvasElements}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            zoom={zoom}
          />
        </div>
      </div>
    </div>
  );
}
