
import React, { useRef } from "react";
import MusicogramCanvas from "./MusicogramCanvas";
import { MusicogramTemplate, StudyTemplate } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";

interface MusicogramEditorProps {
  template: MusicogramTemplate | StudyTemplate;
  activeInstrument: string | null;
  isErasing: boolean;
  isDrawingMode: boolean;
  activeColor: string;
  elements: any[];
  onUpdateElement: (element: any) => void;
  onDeleteElement: (elementId: string) => void;
  zoom: number;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  guitarGridLabels?: { [key: string]: string };
  onGridCellClick?: (row: number, col: number) => void;
  nextPosition?: { row: number, col: number } | null;
}

const MusicogramEditor: React.FC<MusicogramEditorProps> = ({
  template,
  activeInstrument,
  isErasing,
  isDrawingMode,
  activeColor,
  elements,
  onUpdateElement,
  onDeleteElement,
  zoom,
  onDrop,
  onDragOver,
  guitarGridLabels = {},
  onGridCellClick,
  nextPosition
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Make sure template is defined before rendering
  if (!template) {
    console.error("Template is undefined in MusicogramEditor");
    return <div className="p-4">Erro ao carregar template</div>;
  }

  return (
    <div 
      ref={canvasRef} 
      className={`flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-auto rounded-lg shadow p-1 ${isMobile ? 'p-0' : 'sm:p-2'} relative`}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="w-full h-full relative">
        {/* Optional study template name display */}
        {'previewContent' in template && (
          <div className="absolute top-2 left-2 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-md z-10">
            <span className="text-sm font-medium">{template.name}</span>
          </div>
        )}
        
        <MusicogramCanvas 
          template={template}
          activeInstrument={activeInstrument}
          isErasing={isErasing}
          isDrawingMode={isDrawingMode}
          activeColor={activeColor}
          elements={elements}
          onUpdateElement={onUpdateElement}
          onDeleteElement={onDeleteElement}
          zoom={zoom}
          onDrop={onDrop}
          onDragOver={onDragOver}
          showGuitarGrid={false} // No guitar grid for study templates
          guitarGridLabels={guitarGridLabels}
          onGridCellClick={onGridCellClick}
          nextGridPosition={nextPosition}
        />
      </div>
    </div>
  );
};

export default MusicogramEditor;
