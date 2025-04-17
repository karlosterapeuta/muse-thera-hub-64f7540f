
import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface SpeechCanvasProps {
  width?: number;
  height?: number;
}

export default function SpeechCanvas({ width = 400, height = 300 }: SpeechCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;
    
    try {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#f8f8f8'
      });
      
      console.log("Canvas initialized successfully");
    } catch (error) {
      console.error("Error initializing canvas:", error);
    }
    
    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
      }
    };
  }, [width, height]);
  
  const addRandomShape = () => {
    if (!fabricRef.current) {
      console.error("Canvas not initialized");
      return;
    }
    
    const canvas = fabricRef.current;
    const colors = ['#FF9999', '#99FF99', '#9999FF', '#FFFF99', '#FF99FF', '#99FFFF'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Create a random shape at a random position
    const x = Math.random() * (width - 50);
    const y = Math.random() * (height - 50);
    const size = 20 + Math.random() * 50;
    
    const shapes = [
      () => new fabric.Circle({
        left: x,
        top: y,
        radius: size / 2,
        fill: color,
        opacity: 0.7
      }),
      () => new fabric.Rect({
        left: x,
        top: y,
        width: size,
        height: size,
        fill: color,
        opacity: 0.7
      }),
      () => new fabric.Triangle({
        left: x,
        top: y,
        width: size,
        height: size,
        fill: color,
        opacity: 0.7
      })
    ];
    
    const shape = shapes[Math.floor(Math.random() * shapes.length)]();
    canvas.add(shape);
    canvas.renderAll();
    console.log("Added shape to canvas");
  };
  
  // Expose the addRandomShape method to the window
  (window as any).addShapeToCanvas = addRandomShape;
  
  return (
    <div className="relative border border-purple-200 rounded-lg overflow-hidden shadow-inner">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
}
