
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, Triangle } from 'fabric';

interface SpeechCanvasProps {
  width?: number;
  height?: number;
}

export default function SpeechCanvas({ width = 300, height = 200 }: SpeechCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;
    
    fabricRef.current = new FabricCanvas(canvasRef.current, {
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
    const shapes = [Circle, Rect, Triangle];
    const colors = ['#FF9999', '#99FF99', '#9999FF', '#FFFF99', '#FF99FF', '#99FFFF'];
    
    const ShapeClass = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 20 + Math.random() * 30;
    
    const shape = new ShapeClass({
      left: Math.random() * (width - size),
      top: Math.random() * (height - size),
      fill: color,
      width: size,
      height: size,
      radius: size / 2,
      opacity: 0.7
    });
    
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
