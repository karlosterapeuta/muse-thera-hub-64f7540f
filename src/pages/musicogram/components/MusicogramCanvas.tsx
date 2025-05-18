import React, { useState, useRef, useEffect } from "react";
import { MusicogramTemplate, VisualElement } from "../types";
import { fabric } from "fabric";
import { Trash2, Grab } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useIsMobile } from "@/hooks/use-mobile";

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
  onDragOver
}: MusicogramCanvasProps) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [selectedElement, setSelectedElement] = useState<fabric.Object | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const initCanvas = () => {
      // Adjust cell size based on screen size
      const cellSize = isMobile ? 60 : 80;
      const newCanvas = new fabric.Canvas('musicogram-canvas', {
        width: template.columns * cellSize,
        height: template.rows * cellSize,
        backgroundColor: '#fff',
        selection: true, // Enable selection of multiple objects
        preserveObjectStacking: true, // Keep object stacking order
      });

      fabricRef.current = newCanvas;
      setCanvas(newCanvas);

      // Handle object moving
      newCanvas.on('object:moving', (event) => {
        const obj = event.target;
        if (obj) {
          setIsDragging(true);
          const updatedElement = {
            id: obj.data.id,
            x: obj.left || 0,
            y: obj.top || 0,
            color: obj.fill as string,
            size: obj.width || 20,
            shape: obj.type,
            type: 'element',
            position: { x: obj.left || 0, y: obj.top || 0 },
            rotation: obj.angle || 0,
            iconType: obj.data.iconType,
            iconContent: obj.data.iconContent,
            gridLabels: obj.data.gridLabels
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
          const updatedElement = {
            id: obj.data.id,
            x: obj.left || 0,
            y: obj.top || 0,
            color: obj.fill as string,
            size: Math.max(obj.getScaledWidth(), obj.getScaledHeight()) || 20, // Use max dimension for size
            shape: obj.type,
            type: 'element',
            position: { x: obj.left || 0, y: obj.top || 0 },
            rotation: obj.angle || 0,
            iconType: obj.data.iconType,
            iconContent: obj.data.iconContent,
            gridLabels: obj.data.gridLabels
          };
          onUpdateElement(updatedElement);
        }
      });

      // Handle object rotating
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
            rotation: obj.angle || 0,
            iconType: obj.data.iconType,
            iconContent: obj.data.iconContent,
            gridLabels: obj.data.gridLabels
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
    };

    if (!canvas) {
      initCanvas();
    }

    return () => {
      canvas?.dispose();
    };
  }, [template, isMobile]);

  useEffect(() => {
    if (fabricRef.current) {
      // Adapt cell size for mobile
      const cellSize = isMobile ? 60 : 80;
      fabricRef.current.setZoom(zoom);
      fabricRef.current.setWidth(template.columns * cellSize * zoom);
      fabricRef.current.setHeight(template.rows * cellSize * zoom);
      fabricRef.current.renderAll();
    }
  }, [zoom, template, isMobile]);

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
      canvas.isDrawingMode = isDrawingMode;
      
      // Update object interaction based on drawing mode
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
    }
  }, [isDrawingMode, canvas]);

  const createElement = (element: any) => {
    let fabricElement: fabric.Object | null = null;
    const x = element.position?.x || element.x;
    const y = element.position?.y || element.y;
    
    // Handle different element types
    if (element.iconType === 'symbol' || element.iconType === 'instrument') {
      if (element.iconContent) {
        const textObj = new fabric.Text(element.iconContent, {
          left: x,
          top: y,
          fontSize: element.size || 36,
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
          cornerSize: isMobile ? 8 : 10, // Smaller corners on mobile
          cornerStyle: 'circle',
          transparentCorners: false,
          borderColor: '#5186EC',
          borderScaleFactor: 1.5
        });
        fabricElement = textObj;
      }
    } else if (element.iconType === 'grid') {
      // Create a guitar fretboard grid with labels
      const gridSize = element.size || 120;
      const cols = 4;
      const rows = 5;
      
      // Get chord grid labels from element or use defaults
      const gridLabels = element.gridLabels || {};
      
      // Create a group to hold all grid cells
      const fretboard = new fabric.Group([], {
        left: x,
        top: y,
        originX: 'center',
        originY: 'center',
        hasControls: !isDrawingMode,
        hasBorders: !isDrawingMode,
        lockMovementX: isDrawingMode,
        lockMovementY: isDrawingMode,
        angle: element.rotation || 0,
        selectable: !isDrawingMode,
        cornerColor: '#5186EC',
        cornerSize: isMobile ? 8 : 10,
        cornerStyle: 'circle',
        transparentCorners: false,
        borderColor: '#5186EC',
        borderScaleFactor: 1.5
      });
      
      // Cell dimensions
      const cellWidth = gridSize / cols;
      const cellHeight = (gridSize * (rows / cols)) / rows;
      
      // Create all cells as in the image
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Calculate position for this cell
          const cellX = (col * cellWidth) - (gridSize / 2) + (cellWidth / 2);
          const cellY = (row * cellHeight) - (gridSize * (rows / cols) / 2) + (cellHeight / 2);
          
          // Create cell rectangle
          const cell = new fabric.Rect({
            left: cellX,
            top: cellY,
            width: cellWidth,
            height: cellHeight,
            fill: element.color || '#333333',
            stroke: '#000000',
            strokeWidth: 1,
            originX: 'center',
            originY: 'center'
          });
          
          fretboard.addWithUpdate(cell);
          
          // Add chord label if it exists for this cell
          const cellKey = `${row}-${col}`;
          if (gridLabels[cellKey]) {
            const labelText = new fabric.Text(gridLabels[cellKey], {
              left: cellX,
              top: cellY,
              fontSize: cellWidth * 0.35,
              fill: '#FFFFFF',
              fontWeight: 'bold',
              originX: 'center',
              originY: 'center',
              textAlign: 'center',
              shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.7)', offsetX: 1, offsetY: 1, blur: 2 }),
            });
            fretboard.addWithUpdate(labelText);
          }
        }
      }
      
      fabricElement = fretboard;
    } else if (element.shape === 'circle') {
      fabricElement = new fabric.Circle({
        left: x,
        top: y,
        radius: element.size / 2,
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
        cornerSize: isMobile ? 8 : 10,
        cornerStyle: 'circle',
        transparentCorners: false,
        borderColor: '#5186EC',
        borderScaleFactor: 1.5
      });
    } else if (element.shape === 'rect' || element.shape === 'square') {
      fabricElement = new fabric.Rect({
        left: x,
        top: y,
        width: element.size || 40,
        height: element.shape === 'rect' ? (element.size / 2 || 20) : (element.size || 40),
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
        cornerSize: isMobile ? 8 : 10,
        cornerStyle: 'circle',
        transparentCorners: false,
        borderColor: '#5186EC',
        borderScaleFactor: 1.5
      });
    } else if (element.shape === 'triangle') {
      fabricElement = new fabric.Triangle({
        left: x,
        top: y,
        width: element.size || 40,
        height: element.size || 40,
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
        cornerSize: isMobile ? 8 : 10,
        cornerStyle: 'circle',
        transparentCorners: false,
        borderColor: '#5186EC',
        borderScaleFactor: 1.5
      });
    }

    if (fabricElement) {
      // Ensure elements can be freely transformed
      fabricElement.setControlsVisibility({
        mt: true, // top-middle control point
        mb: true, // bottom-middle control point
        ml: true, // middle-left control point
        mr: true, // middle-right control point
        tl: true, // top-left control point
        tr: true, // top-right control point
        bl: true, // bottom-left control point
        br: true, // bottom-right control point
        mtr: true, // middle-top-rotation control point
      });
      
      // No flip scaling to prevent confusion
      fabricElement.lockScalingFlip = true;
      
      // Allow free movement of the elements
      fabricElement.data = { 
        id: element.id,
        iconType: element.iconType,
        iconContent: element.iconContent,
        instrumentId: element.instrumentId,
        gridLabels: element.gridLabels
      };
      
      // Add right-click or long press context menu for mobile
      fabricElement.on('mousedown', (e) => {
        if (isErasing) {
          onDeleteElement(element.id);
          canvas?.remove(fabricElement!);
        }
      });

      // Add double-click event to show delete button on element
      fabricElement.on('mousedblclick', () => {
        if (!isDrawingMode && fabricElement) {
          showDeleteButton(fabricElement);
        }
      });

      // Set cursor style to move/grab
      fabricElement.hoverCursor = 'move';
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

  return (
    <div 
      className="relative w-full h-full overflow-auto"
      ref={canvasContainerRef}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <canvas id="musicogram-canvas" style={{ border: '1px solid #ccc' }} />
      
      {/* Delete button for selected element */}
      {selectedElement && (
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center gap-1"
            onClick={handleDeleteSelected}
            title="Excluir figura selecionada"
          >
            <Trash2 size={isMobile ? 16 : 18} />
            <span className={`${isMobile ? 'hidden' : 'inline'}`}>Excluir</span>
          </button>
        </div>
      )}
      
      {!isDrawingMode && (
        <div className="absolute bottom-2 right-2 bg-green-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 opacity-80 z-10">
          <Grab size={isMobile ? 16 : 18} />
          <span className="text-xs">Modo Movimentação Livre</span>
        </div>
      )}
    </div>
  );
}

export default MusicogramCanvas;
