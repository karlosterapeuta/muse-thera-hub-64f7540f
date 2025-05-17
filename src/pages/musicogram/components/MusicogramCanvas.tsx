
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Star } from "./Star";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { VisualElement, MusicogramTemplate } from "../types";
import { Trash, Download, ZoomIn, ZoomOut, RotateCcw, Save } from "lucide-react";

interface MusicogramCanvasProps {
  initialElements?: VisualElement[];
  template?: MusicogramTemplate;
  onSave?: (elements: VisualElement[]) => void;
  readOnly?: boolean;
}

export const MusicogramCanvas = ({
  initialElements = [],
  template,
  onSave,
  readOnly = false
}: MusicogramCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [elements, setElements] = useState<VisualElement[]>(initialElements);
  const [zoom, setZoom] = useState(1);

  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: template?.background || "#FFFFFF",
      selection: !readOnly,
      preserveObjectStacking: true
    });

    // Set canvas controls
    canvas.defaultCursor = readOnly ? "default" : "move";
    
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [template, readOnly]);

  // Load elements when canvas is ready or when initialElements change
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Clear canvas
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = template?.background || "#FFFFFF";
    
    // Load the elements to display
    const elementsToRender = initialElements.length > 0 
      ? initialElements 
      : template?.elements || [];
      
    elementsToRender.forEach(element => {
      addElementToCanvas(element, fabricCanvas);
    });

    fabricCanvas.renderAll();
    
  }, [fabricCanvas, initialElements, template]);
  
  // Function to add an element to the canvas
  const addElementToCanvas = (element: VisualElement, canvas: fabric.Canvas) => {
    let fabricObject;
    
    // Create the appropriate shape
    switch (element.shape) {
      case 'circle':
        fabricObject = new fabric.Circle({
          left: element.position.x,
          top: element.position.y,
          radius: element.size / 2,
          fill: element.color,
          originX: 'center',
          originY: 'center',
          angle: element.rotation,
          hasControls: !readOnly,
          selectable: !readOnly,
          data: { elementId: element.id }
        });
        break;
        
      case 'rect':
        fabricObject = new fabric.Rect({
          left: element.position.x,
          top: element.position.y,
          width: element.size,
          height: element.size * 0.5,
          fill: element.color,
          originX: 'center',
          originY: 'center',
          angle: element.rotation,
          hasControls: !readOnly,
          selectable: !readOnly,
          data: { elementId: element.id }
        });
        break;
        
      case 'triangle':
        fabricObject = new fabric.Triangle({
          left: element.position.x,
          top: element.position.y,
          width: element.size,
          height: element.size,
          fill: element.color,
          originX: 'center',
          originY: 'center',
          angle: element.rotation,
          hasControls: !readOnly,
          selectable: !readOnly,
          data: { elementId: element.id }
        });
        break;
        
      case 'star':
        // Using a custom polygon to create a star
        fabricObject = new Star({
          left: element.position.x,
          top: element.position.y,
          radius: element.size / 2,
          fill: element.color,
          originX: 'center',
          originY: 'center',
          angle: element.rotation,
          hasControls: !readOnly,
          selectable: !readOnly,
          data: { elementId: element.id }
        });
        break;
        
      default:
        // Default to rect if shape not recognized
        fabricObject = new fabric.Rect({
          left: element.position.x,
          top: element.position.y,
          width: element.size,
          height: element.size * 0.5,
          fill: element.color,
          originX: 'center',
          originY: 'center',
          angle: element.rotation,
          hasControls: !readOnly,
          selectable: !readOnly,
          data: { elementId: element.id }
        });
    }
    
    // Add label if present
    if (element.label) {
      canvas.add(fabricObject);
      
      // Add text below the shape
      const text = new fabric.Text(element.label, {
        left: element.position.x,
        top: element.position.y + (element.size / 2) + 10,
        fontSize: 14,
        fill: '#333',
        originX: 'center',
        textAlign: 'center',
        selectable: !readOnly,
        hasControls: false
      });
      
      canvas.add(text);
      
      // Group the shape with its label
      if (!readOnly) {
        // Event listener to update text position when shape moves
        fabricObject.on('moving', (e: fabric.IEvent) => {
          const target = e.target;
          if (!target) return;
          
          text.set({
            left: target.left,
            top: target.top + (element.size / 2) + 10
          });
          canvas.renderAll();
        });
      }
    } else {
      canvas.add(fabricObject);
    }
    
    // Add event listener to update the element's position when moved
    if (!readOnly) {
      fabricObject.on('modified', (e: fabric.IEvent) => {
        const target = e.target;
        if (!target) return;
        
        const updatedElement = elements.find(el => el.id === element.id);
        if (updatedElement) {
          updatedElement.position = { x: target.left || 0, y: target.top || 0 };
          updatedElement.rotation = target.angle || 0;
          setElements([...elements]);
        }
      });
    }
  };

  const handleZoomIn = () => {
    if (!fabricCanvas) return;
    const newZoom = Math.min(zoom + 0.1, 2);
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom);
    fabricCanvas.renderAll();
  };

  const handleZoomOut = () => {
    if (!fabricCanvas) return;
    const newZoom = Math.max(zoom - 0.1, 0.5);
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom);
    fabricCanvas.renderAll();
  };

  const handleReset = () => {
    if (!fabricCanvas) return;
    setZoom(1);
    fabricCanvas.setZoom(1);
    fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    fabricCanvas.renderAll();
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    if (confirm("Tem certeza que deseja limpar o musicograma? Esta ação não pode ser desfeita.")) {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = template?.background || "#FFFFFF";
      setElements([]);
      fabricCanvas.renderAll();
      toast.success("Musicograma limpo com sucesso!");
    }
  };

  const handleSave = () => {
    if (!fabricCanvas || !onSave) return;
    
    // Get all objects from canvas and convert them to our VisualElement format
    const updatedElements: VisualElement[] = elements.map(element => {
      const fabricObj = fabricCanvas.getObjects().find(obj => obj.data?.elementId === element.id);
      if (fabricObj) {
        return {
          ...element,
          position: { x: fabricObj.left || 0, y: fabricObj.top || 0 },
          rotation: fabricObj.angle || 0
        };
      }
      return element;
    });
    
    onSave(updatedElements);
    toast.success("Musicograma salvo com sucesso!");
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    
    // Convert canvas to data URL
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1
    });
    
    // Create a download link
    const link = document.createElement('a');
    link.download = `musicograma-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Musicograma baixado como imagem!");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="border border-gray-300 rounded-lg shadow-lg overflow-hidden bg-white">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4 mr-1" />
          Ampliar
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4 mr-1" />
          Reduzir
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Resetar
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          Baixar
        </Button>
        
        {!readOnly && (
          <>
            <Button variant="outline" size="sm" onClick={handleClear} className="text-destructive hover:bg-destructive/10">
              <Trash className="h-4 w-4 mr-1" />
              Limpar
            </Button>
            {onSave && (
              <Button variant="default" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Salvar
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
