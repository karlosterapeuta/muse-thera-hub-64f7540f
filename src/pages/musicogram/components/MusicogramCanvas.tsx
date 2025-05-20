import React, { useState, useRef, useEffect } from "react";
import { MusicogramTemplate, VisualElement } from "../types";
import { fabric } from "fabric";
import { Trash2, Grab } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useIsMobile } from "@/hooks/use-mobile";
import ChordGrid from "./ChordGrid";

interface MusicogramCanvasProps {
  template: MusicogramTemplate;
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
  showGuitarGrid?: boolean;
  guitarGridLabels?: { [key: string]: string };
  onGridCellClick?: (row: number, col: number) => void;
  nextGridPosition?: { row: number, col: number } | null;
}

export function MusicogramCanvas({ 
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
  showGuitarGrid = true,
  guitarGridLabels = {},
  onGridCellClick,
  nextGridPosition = null
}: MusicogramCanvasProps) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [selectedElement, setSelectedElement] = useState<fabric.Object | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const gridRef = useRef<HTMLDivElement>(null);
  const canvasInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    const initCanvas = () => {
      // Adjust cell size based on screen size
      const cellSize = isMobile ? 60 : 80;
      const canvasWidth = template.columns * cellSize;
      const canvasHeight = template.rows * cellSize;
      
      // Check if canvas element exists
      const canvasEl = document.getElementById('musicogram-canvas');
      if (!canvasEl) {
        console.error("Canvas element not found");
        return null;
      }
      
      try {
        const newCanvas = new fabric.Canvas('musicogram-canvas', {
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: '#fff',
          selection: true, // Enable selection of multiple objects
          preserveObjectStacking: true, // Keep object stacking order
        });

        fabricRef.current = newCanvas;
        canvasInitializedRef.current = true;
        
        // Set up object moving event with COMPLETELY UNRESTRICTED MOVEMENT
        newCanvas.on('object:moving', (event) => {
          const obj = event.target;
          if (obj) {
            setIsDragging(true);
            
            // Allow completely free movement - no restrictions at all
            // Objects can be moved anywhere, even outside canvas boundaries
            const updatedElement = {
              id: obj.data?.id,
              x: obj.left || 0,
              y: obj.top || 0,
              color: obj.fill as string,
              size: obj.width || 20,
              shape: obj.type,
              type: 'element',
              position: { x: obj.left || 0, y: obj.top || 0 },
              rotation: obj.angle || 0,
              iconType: obj.data?.iconType,
              iconContent: obj.data?.iconContent,
            };
            onUpdateElement(updatedElement);
          }
        });

        // Add mouse up handler to reset dragging state
        newCanvas.on('mouse:up', () => {
          if (isDragging) {
            setIsDragging(false);
          }
        });

        // Handle object scaling
        newCanvas.on('object:scaling', (event) => {
          const obj = event.target;
          if (obj) {
            const scaledWidth = obj.getScaledWidth() || 0;
            const scaledHeight = obj.getScaledHeight() || 0;
            const objLeft = obj.left || 0;
            const objTop = obj.top || 0;
            
            const updatedElement = {
              id: obj.data?.id,
              x: objLeft,
              y: objTop,
              color: obj.fill as string,
              size: Math.max(scaledWidth, scaledHeight),
              shape: obj.type,
              type: 'element',
              position: { x: objLeft, y: objTop },
              rotation: obj.angle || 0,
              iconType: obj.data?.iconType,
              iconContent: obj.data?.iconContent,
            };
            onUpdateElement(updatedElement);
          }
        });

        // Handle object rotating with improved interaction
        newCanvas.on('object:rotating', (event) => {
          const obj = event.target;
          if (obj) {
            const updatedElement = {
              id: obj.data?.id,
              x: obj.left || 0,
              y: obj.top || 0,
              color: obj.fill as string,
              size: obj.width || 20,
              shape: obj.type,
              type: 'element',
              position: { x: obj.left || 0, y: obj.top || 0 },
              rotation: obj.angle || 0,
              iconType: obj.data?.iconType,
              iconContent: obj.data?.iconContent,
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
        
        return newCanvas;
      } catch (error) {
        console.error("Error initializing canvas:", error);
        return null;
      }
    };

    // Only initialize if not already done
    if (!canvas && !fabricRef.current) {
      const newCanvas = initCanvas();
      if (newCanvas) {
        setCanvas(newCanvas);
      }
    }

    return () => {
      if (fabricRef.current) {
        // Use try-catch to prevent errors during cleanup
        try {
          fabricRef.current.dispose();
          fabricRef.current = null;
          canvasInitializedRef.current = false;
        } catch (error) {
          console.error("Error disposing canvas:", error);
        }
      }
    };
  }, [template, isMobile]);

  useEffect(() => {
    if (fabricRef.current && canvasInitializedRef.current) {
      try {
        // Adapt cell size for mobile
        const cellSize = isMobile ? 60 : 80;
        fabricRef.current.setZoom(zoom);
        fabricRef.current.setWidth(template.columns * cellSize * zoom);
        fabricRef.current.setHeight(template.rows * cellSize * zoom);
        fabricRef.current.renderAll();
      } catch (error) {
        console.error("Error updating canvas dimensions:", error);
      }
    }
  }, [zoom, template, isMobile]);

  useEffect(() => {
    if (canvas && canvasInitializedRef.current) {
      try {
        canvas.clear();
        elements.forEach((element) => {
          const el = createElement(element);
          if (el) {
            canvas.add(el);
          }
        });
      } catch (error) {
        console.error("Error updating canvas elements:", error);
      }
    }
  }, [elements, canvas]);

  useEffect(() => {
    if (canvas && canvasInitializedRef.current) {
      try {
        canvas.isDrawingMode = isDrawingMode;
        
        // Set free movement properties for all objects
        canvas.getObjects().forEach(obj => {
          // In drawing mode: disable object manipulation
          // In manipulation mode: enable object manipulation
          obj.selectable = !isDrawingMode;
          obj.lockMovementX = isDrawingMode;
          obj.lockMovementY = isDrawingMode;
          obj.hasControls = !isDrawingMode; // Controls for resizing/rotating
          obj.hasBorders = !isDrawingMode;
        });
        
        canvas.renderAll();
      } catch (error) {
        console.error("Error updating drawing mode:", error);
      }
    }
  }, [isDrawingMode, canvas]);

  const createElement = (element: any) => {
    let fabricElement: fabric.Object | null = null;
    const x = element.position?.x || element.x;
    const y = element.position?.y || element.y;
    
    // Create different element types based on their properties
    if (element.iconType === 'symbol' || element.iconType === 'instrument') {
      if (element.iconContent) {
        // Adjust size based on device to improve visibility on smaller screens
        const fontSize = isMobile ? Math.min(element.size || 36, 60) : element.size || 72;
        
        const textObj = new fabric.Text(element.iconContent, {
          left: x,
          top: y,
          fontSize: fontSize,
          fill: element.color,
          originX: 'center',
          originY: 'center',
          hasControls: !isDrawingMode,
          hasBorders: !isDrawingMode,
          lockMovementX: isDrawingMode,
          lockMovementY: isDrawingMode,
          angle: element.rotation || 0,
          selectable: !isDrawingMode,
          // Enable controls for better interaction
          cornerColor: '#5186EC',
          cornerSize: isMobile ? 24 : 28, // Larger corners for better touch
          cornerStyle: 'circle',
          transparentCorners: false,
          borderColor: '#5186EC',
          borderScaleFactor: 2,
          // Add smooth animation for dragging
          padding: 10,
          snapAngle: 45, // Snap rotation to 45-degree increments for better usability
          snapThreshold: 10,
          centeredScaling: true,
        });
        fabricElement = textObj;
      }
    } else if (element.shape === 'circle') {
      // Adjust size based on device
      const radius = isMobile ? Math.min((element.size || 40) / 2, 30) : element.size / 2;
      
      fabricElement = new fabric.Circle({
        left: x,
        top: y,
        radius: radius,
        fill: element.color,
        originX: 'center',
        originY: 'center',
        hasControls: !isDrawingMode,
        hasBorders: !isDrawingMode,
        lockMovementX: isDrawingMode,
        lockMovementY: isDrawingMode,
        selectable: !isDrawingMode,
        angle: element.rotation || 0,
        // Enable controls for better interaction
        cornerColor: '#5186EC',
        cornerSize: isMobile ? 24 : 28,
        cornerStyle: 'circle',
        transparentCorners: false,
        borderColor: '#5186EC',
        borderScaleFactor: 2
      });
    } else if (element.shape === 'rect' || element.shape === 'square') {
      // Adjust size based on device
      const size = isMobile ? Math.min(element.size || 40, 60) : element.size || 80;
      
      fabricElement = new fabric.Rect({
        left: x,
        top: y,
        width: size,
        height: element.shape === 'rect' ? (size / 2) : size,
        fill: element.color,
        originX: 'center',
        originY: 'center',
        hasControls: !isDrawingMode,
        hasBorders: !isDrawingMode,
        lockMovementX: isDrawingMode,
        lockMovementY: isDrawingMode,
        selectable: !isDrawingMode,
        angle: element.rotation || 0,
        // Enable controls for better interaction
        cornerColor: '#5186EC',
        cornerSize: isMobile ? 24 : 28,
        cornerStyle: 'circle',
        transparentCorners: false,
        borderColor: '#5186EC',
        borderScaleFactor: 2
      });
    } else if (element.shape === 'triangle') {
      // Adjust size based on device
      const size = isMobile ? Math.min(element.size || 40, 60) : element.size || 80;
      
      fabricElement = new fabric.Triangle({
        left: x,
        top: y,
        width: size,
        height: size,
        fill: element.color,
        originX: 'center',
        originY: 'center',
        hasControls: !isDrawingMode,
        hasBorders: !isDrawingMode,
        lockMovementX: isDrawingMode,
        lockMovementY: isDrawingMode,
        selectable: !isDrawingMode,
        angle: element.rotation || 0,
        // Enable controls for better interaction
        cornerColor: '#5186EC',
        cornerSize: isMobile ? 24 : 28,
        cornerStyle: 'circle',
        transparentCorners: false,
        borderColor: '#5186EC',
        borderScaleFactor: 2
      });
    }

    if (fabricElement) {
      // Enable all movement controls for free movement
      fabricElement.setControlsVisibility({
        mt: true,  // top-middle control point
        mb: true,  // bottom-middle control point
        ml: true,  // middle-left control point
        mr: true,  // middle-right control point
        tl: true,  // top-left control point
        tr: true,  // top-right control point
        bl: true,  // bottom-left control point
        br: true,  // bottom-right control point
        mtr: true, // middle-top-rotation control point
      });
      
      // IMPORTANT: Remove all boundary checking to allow objects to be moved freely
      // This ensures objects can be placed anywhere, even outside the grid/canvas
      fabricElement.setCoords();
      
      // Store element data for reference
      fabricElement.data = { 
        id: element.id,
        iconType: element.iconType,
        iconContent: element.iconContent,
        instrumentId: element.instrumentId,
      };
      
      // Enhanced cursor feedback for drag operations
      fabricElement.hoverCursor = 'move';
      fabricElement.moveCursor = 'grabbing';
      
      // Add deletion through click when in erase mode
      fabricElement.on('mousedown', (e) => {
        if (isErasing) {
          onDeleteElement(element.id);
          canvas?.remove(fabricElement!);
        }
      });

      // Add touch-friendly double-tap event to show delete button on element
      fabricElement.on('mousedblclick', () => {
        if (!isDrawingMode && fabricElement) {
          showDeleteButton(fabricElement);
        }
      });
    }

    return fabricElement;
  };

  // Function to show a delete button directly on the element
  const showDeleteButton = (element: fabric.Object) => {
    if (canvas && element && element.data) {
      setSelectedElement(element);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedElement) {
      onDeleteElement(selectedElement.data.id);
      canvas?.remove(selectedElement);
      setSelectedElement(null);
    }
  };

  // Function to handle grid cell click - This is now important for updating the next position
  const handleGridCellClick = (row: number, col: number) => {
    if (onGridCellClick) {
      onGridCellClick(row, col);
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-auto touch-manipulation"
      ref={canvasContainerRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Render guitar fretboard with clickable cells and highlight for next position */}
      {showGuitarGrid && (
        <div 
          ref={gridRef}
          className="absolute inset-0 z-0" 
          style={{ transform: `scale(${zoom})` }}
        >
          <ChordGrid 
            rows={5} 
            columns={4} 
            color="#222222" 
            labels={guitarGridLabels || {}} 
            onCellClick={handleGridCellClick}
            isClickable={true}
            highlightCell={nextGridPosition}
          />
        </div>
      )}
      
      <canvas id="musicogram-canvas" style={{ 
        border: '1px solid #ccc',
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'transparent' 
      }} />
      
      {/* Delete button for selected element - improved for touch */}
      {selectedElement && (
        <div className={`absolute ${isMobile ? 'top-1 right-1' : 'top-2 right-2'} z-10 flex flex-col gap-2`}>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-full flex items-center justify-center touch-manipulation"
            onClick={handleDeleteSelected}
            title="Excluir figura selecionada"
            style={{ minWidth: isMobile ? '40px' : 'auto', minHeight: isMobile ? '40px' : 'auto' }}
          >
            <Trash2 size={isMobile ? 20 : 18} />
            <span className={`${isMobile ? 'hidden' : 'inline ml-1'}`}>Excluir</span>
          </button>
        </div>
      )}
      
      {/* Enhanced mode indicator */}
      {!isDrawingMode && (
        <div className="absolute bottom-2 right-2 bg-green-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 opacity-80 z-10">
          <Grab size={isMobile ? 16 : 18} />
          <span className="text-xs sm:text-sm">Modo Movimentação Livre</span>
        </div>
      )}
    </div>
  );
}

export default MusicogramCanvas;
