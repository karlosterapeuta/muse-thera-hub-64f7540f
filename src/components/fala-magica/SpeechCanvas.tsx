
import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface SpeechCanvasProps {
  width?: number;
  height?: number;
}

export default function SpeechCanvas({ width = 300, height = 200 }: SpeechCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;
    
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#f8f8f8'
    });
    
    return () => {
      fabricRef.current?.dispose();
    };
  }, [width, height]);
  
  const addRandomShape = () => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    const colors = ['#FF9999', '#99FF99', '#9999FF', '#FFFF99', '#FF99FF', '#99FFFF'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 20 + Math.random() * 30;
    
    // Randomly choose between Circle, Rect, and Triangle
    const shapeType = Math.floor(Math.random() * 3);
    
    let shape;
    if (shapeType === 0) {
      // Circle
      shape = new fabric.Circle({
        left: Math.random() * (width - size),
        top: Math.random() * (height - size),
        fill: color,
        radius: size / 2,
        opacity: 0.7
      });
    } else if (shapeType === 1) {
      // Rectangle
      shape = new fabric.Rect({
        left: Math.random() * (width - size),
        top: Math.random() * (height - size),
        fill: color,
        width: size,
        height: size,
        opacity: 0.7
      });
    } else {
      // Triangle
      const centerX = Math.random() * (width - size) + size / 2;
      const centerY = Math.random() * (height - size) + size / 2;
      
      shape = new fabric.Triangle({
        left: centerX - size / 2,
        top: centerY - size / 2,
        fill: color,
        width: size,
        height: size,
        opacity: 0.7
      });
    }
    
    canvas.add(shape);
    canvas.renderAll();
  };
  
  // Expose the addRandomShape method
  (window as any).addShapeToCanvas = addRandomShape;
  
  return (
    <div className="relative border border-purple-200 rounded-lg overflow-hidden shadow-inner">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
}
