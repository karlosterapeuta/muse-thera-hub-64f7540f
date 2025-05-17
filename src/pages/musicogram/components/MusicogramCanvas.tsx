import React, { useState, useRef, useEffect } from "react";
import { MusicogramTemplate, VisualElement } from "../types";
import { fabric } from "fabric";
import { Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface MusicogramCanvasProps {
  template: MusicogramTemplate;
  activeInstrument: string | null;
  activePattern: string | null;
  isErasing: boolean;
  isDrawingMode: boolean;
  activeColor: string;
  elements: any[];
  onUpdateElement: (element: any) => void;
  onDeleteElement: (elementId: string) => void;
  onAddElement: (element: any) => void;
  patternImages: any[];
  zoom: number;
}

export function MusicogramCanvas({ 
  template, 
  activeInstrument, 
  activePattern,
  isErasing,
  isDrawingMode,
  activeColor,
  elements,
  onUpdateElement,
  onDeleteElement,
  onAddElement,
  patternImages,
  zoom 
}: MusicogramCanvasProps) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [selectedElement, setSelectedElement] = useState<fabric.Object | null>(null);

  useEffect(() => {
    const initCanvas = () => {
      const newCanvas = new fabric.Canvas('musicogram-canvas', {
        width: template.columns * 50,
        height: template.rows * 50,
        backgroundColor: '#fff',
        selection: false,
      });

      fabricRef.current = newCanvas;
      setCanvas(newCanvas);

      newCanvas.on('object:moving', (event) => {
        const obj = event.target;
        if (obj) {
          const updatedElement = {
            id: obj.data.id,
            x: obj.left || 0,
            y: obj.top || 0,
            color: obj.fill as string,
            size: obj.width || 20,
            shape: obj.type,
            type: 'element',
            position: { x: obj.left || 0, y: obj.top || 0 },
            rotation: obj.angle || 0
          };
          onUpdateElement(updatedElement);
        }
      });

      newCanvas.on('object:scaling', (event) => {
        const obj = event.target;
        if (obj) {
          const updatedElement = {
            id: obj.data.id,
            x: obj.left || 0,
            y: obj.top || 0,
            color: obj.fill as string,
            size: obj.width || 20,
            shape: obj.type,
            type: 'element',
            position: { x: obj.left || 0, y: obj.top || 0 },
            rotation: obj.angle || 0
          };
          onUpdateElement(updatedElement);
        }
      });

      newCanvas.on('object:rotating', (event) => {
        const obj = event.target;
        if (obj) {
          const updatedElement = {
            id: obj.data.id,
            x: obj.left || 0,
            y: obj.top || 0,
            color: obj.fill as string,
            size: obj.width || 20,
            shape: obj.type,
            type: 'element',
            position: { x: obj.left || 0, y: obj.top || 0 },
            rotation: obj.angle || 0
          };
          onUpdateElement(updatedElement);
        }
      });

      newCanvas.on('selection:created', (event) => {
        setSelectedElement(event.target as fabric.Object);
      });

      newCanvas.on('selection:updated', (event) => {
        setSelectedElement(event.target as fabric.Object);
      });

      newCanvas.on('selection:cleared', () => {
        setSelectedElement(null);
      });

      // Add mouse down event for adding patterns
      newCanvas.on('mouse:down', (options) => {
        if (activePattern && isDrawingMode) {
          const pointer = newCanvas.getPointer(options.e);
          const pattern = patternImages.find(p => p.id === activePattern);
          
          if (pattern) {
            addPatternImageToCanvas(pattern, pointer.x, pointer.y);
          }
        }
      });

      return newCanvas;
    };

    if (!canvas) {
      initCanvas();
    }

    return () => {
      canvas?.dispose();
    };
  }, [template]);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setZoom(zoom);
      fabricRef.current.setWidth(template.columns * 50 * zoom);
      fabricRef.current.setHeight(template.rows * 50 * zoom);
      fabricRef.current.renderAll();
    }
  }, [zoom, template]);

  useEffect(() => {
    if (canvas) {
      canvas.clear();
      elements.forEach((element) => {
        const el = createElement(element);
        if (el) {
          canvas.add(el);
        }
      });
    }
  }, [elements, canvas]);

  useEffect(() => {
    if (canvas) {
      canvas.isDrawingMode = isDrawingMode && !activePattern;
    }
  }, [isDrawingMode, activePattern, canvas]);

  const addPatternImageToCanvas = (pattern: any, x: number, y: number) => {
    if (!canvas) return;

    fabric.Image.fromURL(pattern.patternUrl, (img) => {
      const id = uuidv4();
      
      // Scale the image to a reasonable size
      const scale = 0.5;
      const imgWidth = img.width || 100;
      const imgHeight = img.height || 100;
      
      img.set({
        left: x,
        top: y,
        scaleX: scale,
        scaleY: scale,
        originX: 'center',
        originY: 'center',
        hasControls: true,
        hasBorders: true,
        cornerColor: 'rgba(0,0,255,0.5)',
        cornerSize: 10,
        transparentCorners: false
      });

      img.data = { id };

      img.on('mousedown', (e) => {
        if (isErasing) {
          onDeleteElement(id);
          canvas.remove(img);
        }
      });
      
      // Add selection handlers
      img.on('selected', () => {
        setSelectedElement(img);
      });
      
      img.on('modified', () => {
        const updatedElement = {
          id,
          type: 'pattern',
          x: img.left || 0,
          y: img.top || 0,
          patternUrl: pattern.patternUrl,
          size: (img.width || 100) * (img.scaleX || 1),
          shape: 'pattern',
          position: { x: img.left || 0, y: img.top || 0 },
          rotation: img.angle || 0
        };
        onUpdateElement(updatedElement);
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();

      // Add to elements array
      const newElement = {
        id,
        type: 'pattern',
        x,
        y,
        patternUrl: pattern.patternUrl,
        size: Math.max(imgWidth, imgHeight) * scale,
        shape: 'pattern',
        position: { x, y }
      };
      onAddElement(newElement);
    });
  };

  const createElement = (element: any) => {
    let fabricElement: fabric.Object | null = null;
    const x = element.position?.x || element.x;
    const y = element.position?.y || element.y;
    
    if (element.shape === 'pattern' && element.patternUrl) {
      return createPatternElement(element);
    }
    
    switch (element.shape) {
      case 'circle':
        fabricElement = new fabric.Circle({
          left: x,
          top: y,
          radius: element.size / 2,
          fill: element.color,
          originX: 'center',
          originY: 'center',
          hasControls: false,
          hasBorders: false,
          lockMovementX: !isDrawingMode,
          lockMovementY: !isDrawingMode,
          angle: element.rotation || 0
        });
        break;
      case 'rect':
        fabricElement = new fabric.Rect({
          left: x,
          top: y,
          width: element.size,
          height: element.size / 2,
          fill: element.color,
          originX: 'center',
          originY: 'center',
          hasControls: false,
          hasBorders: false,
          lockMovementX: !isDrawingMode,
          lockMovementY: !isDrawingMode,
          angle: element.rotation || 0
        });
        break;
      default:
        return null;
    }

    if (fabricElement) {
      fabricElement.lockScalingFlip = true;
      fabricElement.data = { id: element.id };
      fabricElement.on('mousedown', (e) => {
        if (isErasing) {
          onDeleteElement(element.id);
          canvas?.remove(fabricElement!);
        }
      });
    }

    return fabricElement;
  };

  const createPatternElement = (element: any) => {
    return new Promise<fabric.Image | null>((resolve) => {
      if (!element.patternUrl) {
        resolve(null);
        return;
      }

      fabric.Image.fromURL(element.patternUrl, (img) => {
        const scale = element.size ? element.size / Math.max(img.width || 100, img.height || 100) : 0.5;
        
        img.set({
          left: element.x,
          top: element.y,
          scaleX: scale,
          scaleY: scale,
          originX: 'center',
          originY: 'center',
          hasControls: true,
          hasBorders: true,
          cornerColor: 'rgba(0,0,255,0.5)',
          cornerSize: 10,
          transparentCorners: false,
          angle: element.rotation || 0,
          lockMovementX: !isDrawingMode,
          lockMovementY: !isDrawingMode,
        });

        img.data = { id: element.id };

        img.on('mousedown', (e) => {
          if (isErasing) {
            onDeleteElement(element.id);
            canvas?.remove(img);
          }
        });
        
        // Add selection handlers
        img.on('selected', () => {
          setSelectedElement(img);
        });
        
        img.on('modified', () => {
          const updatedElement = {
            id: element.id,
            type: 'pattern',
            x: img.left || 0,
            y: img.top || 0,
            patternUrl: element.patternUrl,
            size: (img.width || 100) * (img.scaleX || 1),
            shape: 'pattern',
            position: { x: img.left || 0, y: img.top || 0 },
            rotation: img.angle || 0
          };
          onUpdateElement(updatedElement);
        });

        resolve(img);
      });
    });
  };

  const handleDeleteSelected = () => {
    if (selectedElement) {
      onDeleteElement(selectedElement.data.id);
      canvas?.remove(selectedElement);
      setSelectedElement(null);
    }
  };

  return (
    <div className="relative">
      <canvas id="musicogram-canvas" style={{ border: '1px solid #ccc' }} />
      {selectedElement && (
        <button
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleDeleteSelected}
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}

export default MusicogramCanvas;
