
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
      // Initialize the canvas with a transparent background
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: 'transparent'
      });
      
      console.log("Canvas initialized successfully with dimensions:", width, "x", height);
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
      console.log("Canvas not initialized");
      return;
    }
    
    const canvas = fabricRef.current;
    // Expanded color palette for more vibrant visuals
    const colors = [
      '#FF9999', '#99FF99', '#9999FF', '#FFFF99', 
      '#FF99FF', '#99FFFF', '#FFD700', '#FF6347', 
      '#7FFFD4', '#DDA0DD', '#FFB6C1', '#98FB98',
      '#FF4500', '#00FFFF', '#FF00FF', '#FFFF00',
      '#FF8C00', '#8A2BE2', '#32CD32', '#FF1493'
    ];
    
    // Create multiple shapes at once for a more dynamic effect
    // Scale the number based on intensity
    const numberOfShapes = Math.floor(Math.random() * 4 * intensity) + 2; // More shapes with higher intensity
    
    console.log(`Adding ${numberOfShapes} shapes with intensity ${intensity}`);
    
    for (let i = 0; i < numberOfShapes; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random position with more variance based on intensity
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      // Larger circles with higher intensity
      const size = (10 + Math.random() * 40) * Math.min(intensity, 3.0);
      
      // Create circle (bubble effect)
      const circle = new fabric.Circle({
        left: x,
        top: y,
        radius: size / 2,
        fill: color,
        opacity: 0.8,
        strokeWidth: 1,
        stroke: 'rgba(255, 255, 255, 0.3)'
      });
      
      canvas.add(circle);
      
      // Animate each circle with more spread for higher intensity
      animateShape(circle, intensity);
    }
    
    canvas.renderAll();
  };
  
  const animateShape = (shape: fabric.Object, intensity: number) => {
    // Random movement direction with greater spread for higher intensity
    const spreadFactor = Math.min(intensity * 3, 6); // Increased spread factor
    const dx = (Math.random() - 0.5) * 15 * spreadFactor;
    const dy = (Math.random() - 0.5) * 15 * spreadFactor;
    
    // Random rotation
    const rotation = Math.random() * 360;
    
    // Animate with random movement
    fabric.util.animate({
      startValue: { left: shape.left, top: shape.top, opacity: 0.9, scale: 0.8 },
      endValue: { 
        left: shape.left! + dx * 15, // Increased movement distance
        top: shape.top! + dy * 15,
        opacity: 0, 
        scale: Math.min(2.0, 1 + intensity * 0.3) // Grow while fading
      },
      duration: 1200 + Math.random() * 800, // Varied duration
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
  
  // Expose the addRandomShape method to the window so it can be called from SpeechDetector
  (window as any).addShapeToCanvas = addRandomShape;
  
  return (
    <div className="relative border border-purple-200 rounded-lg overflow-hidden shadow-inner bg-gradient-to-b from-blue-50 to-white">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
}
