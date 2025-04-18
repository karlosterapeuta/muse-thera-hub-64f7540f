
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
        backgroundColor: 'transparent'
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
  
  const addRandomShape = (intensity = 1) => {
    if (!fabricRef.current) {
      console.error("Canvas not initialized");
      return;
    }
    
    const canvas = fabricRef.current;
    const colors = [
      '#FF9999', '#99FF99', '#9999FF', '#FFFF99', 
      '#FF99FF', '#99FFFF', '#FFD700', '#FF6347', 
      '#7FFFD4', '#DDA0DD', '#FFB6C1', '#98FB98'
    ];
    
    // Create multiple shapes at once for a more dynamic effect
    // Scale the number based on intensity
    const numberOfShapes = Math.floor(Math.random() * 3 * intensity) + 3; // More shapes with higher intensity
    
    for (let i = 0; i < numberOfShapes; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random position spreading across the canvas with more variance for higher intensity
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = (10 + Math.random() * 30) * Math.min(intensity, 2.5); // Slightly larger with high intensity
      
      // Create circle (bubble effect)
      const circle = new fabric.Circle({
        left: x,
        top: y,
        radius: size / 2,
        fill: color,
        opacity: 0.8
      });
      
      canvas.add(circle);
      
      // Animate each circle with more spread for higher intensity
      animateShape(circle, intensity);
    }
    
    canvas.renderAll();
  };
  
  const animateShape = (shape: fabric.Object, intensity: number) => {
    // Random movement direction with greater spread for higher intensity
    const spreadFactor = Math.min(intensity * 2, 4); // Increased spread factor
    const dx = (Math.random() - 0.5) * 10 * spreadFactor;
    const dy = (Math.random() - 0.5) * 10 * spreadFactor;
    
    // Random rotation
    const rotation = Math.random() * 360;
    
    // Animate with random movement
    fabric.util.animate({
      startValue: { left: shape.left, top: shape.top, opacity: 0.8, scale: 0.8 },
      endValue: { 
        left: shape.left! + dx * 12, // Increased movement distance
        top: shape.top! + dy * 12,
        opacity: 0, 
        scale: Math.min(1.5, 1 + intensity * 0.2) // Grow while fading
      },
      duration: 1500 + Math.random() * 500, // Varied duration
      onChange: (value: any) => {
        shape.set({
          left: value.left,
          top: value.top,
          opacity: value.opacity,
          angle: rotation,
          scaleX: value.scale,
          scaleY: value.scale
        });
        fabricRef.current?.renderAll();
      },
      onComplete: () => {
        fabricRef.current?.remove(shape);
      }
    });
  };
  
  // Expose the addRandomShape method to the window
  (window as any).addShapeToCanvas = addRandomShape;
  
  return (
    <div className="relative border border-purple-200 rounded-lg overflow-hidden shadow-inner bg-gradient-to-b from-blue-50 to-white">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
}
