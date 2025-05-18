
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Brush, 
  Eraser, 
  Trash2, 
  Save, 
  Hand, 
  Download, 
  ZoomIn, 
  ZoomOut,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MusicogramToolbarProps {
  isDrawingMode: boolean;
  isErasing: boolean;
  onDrawModeToggle: () => void;
  onEraserToggle: () => void;
  onClearCanvas: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSaveCanvas: () => void;
  onExportImage: () => void;
}

const MusicogramToolbar: React.FC<MusicogramToolbarProps> = ({
  isDrawingMode,
  isErasing,
  onDrawModeToggle,
  onEraserToggle,
  onClearCanvas,
  onZoomIn,
  onZoomOut,
  onSaveCanvas,
  onExportImage
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 p-2 bg-white dark:bg-gray-900 rounded-lg shadow overflow-x-auto">
      <Button
        variant={isDrawingMode ? "default" : "outline"}
        size={isMobile ? "sm" : "icon"}
        onClick={() => {
          onDrawModeToggle();
        }}
        title="Modo Desenho"
      >
        <Brush size={isMobile ? 16 : 20} />
        {isMobile && <span className="ml-1">Desenhar</span>}
      </Button>
      <Button
        variant={!isDrawingMode ? "default" : "outline"}
        size={isMobile ? "sm" : "icon"}
        onClick={() => onDrawModeToggle()}
        title="Modo Movimentação Livre"
        className={!isDrawingMode ? "bg-green-500 hover:bg-green-600" : ""}
      >
        <Hand size={isMobile ? 16 : 20} />
        {isMobile && <span className="ml-1">Mover</span>}
      </Button>
      <Button 
        variant={isErasing ? "destructive" : "outline"} 
        size={isMobile ? "sm" : "icon"}
        onClick={onEraserToggle}
        title="Borracha"
        disabled={!isDrawingMode}
      >
        <Eraser size={isMobile ? 16 : 20} />
        {isMobile && <span className="ml-1">Apagar</span>}
      </Button>
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "icon"}
        onClick={onClearCanvas}
        title="Limpar Tudo"
      >
        <Trash2 size={isMobile ? 16 : 20} />
        {isMobile && <span className="ml-1">Limpar</span>}
      </Button>
      <div className="h-6 border-r border-gray-200 mx-1 hidden sm:block"></div>
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "icon"}
        onClick={onZoomIn}
        title="Ampliar"
      >
        <ZoomIn size={isMobile ? 16 : 20} />
        {isMobile && <span className="ml-1">Zoom+</span>}
      </Button>
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "icon"}
        onClick={onZoomOut}
        title="Reduzir"
      >
        <ZoomOut size={isMobile ? 16 : 20} />
        {isMobile && <span className="ml-1">Zoom-</span>}
      </Button>
      <div className="h-6 border-r border-gray-200 mx-1 hidden sm:block"></div>
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "icon"}
        onClick={onSaveCanvas}
        title="Salvar Musicograma"
      >
        <Save size={isMobile ? 16 : 20} />
        {isMobile && <span className="ml-1">Salvar</span>}
      </Button>
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "icon"}
        onClick={onExportImage}
        title="Baixar como Imagem"
      >
        <Download size={isMobile ? 16 : 20} />
        {isMobile && <span className="ml-1">Baixar</span>}
      </Button>
    </div>
  );
};

export default MusicogramToolbar;
