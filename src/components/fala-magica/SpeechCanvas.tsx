
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
    // Expanded vibrant color palette for more impactful visuals
    const colors = [
      '#FF5555', '#55FF55', '#5555FF', '#FFFF55', 
      '#FF55FF', '#55FFFF', '#FFD700', '#FF6347', 
      '#00FFFF', '#FF00FF', '#FFFF00', '#FF1493',
      '#FF8C00', '#8A2BE2', '#32CD32', '#FF4500',
      '#9933FF', '#FF3377', '#33FF77', '#77FF33'
    ];
    
    // Create multiple shapes at once for a more dynamic effect
    // Scale the number based on intensity
    const numberOfShapes = Math.floor(Math.random() * 5 * intensity) + 5; // More shapes with higher intensity
    
    console.log(`Adding ${numberOfShapes} shapes with intensity ${intensity}`);
    
    for (let i = 0; i < numberOfShapes; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random position with more variance based on intensity
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      // Larger shapes with higher intensity
      const size = (20 + Math.random() * 80) * Math.min(intensity, 6.0);
      
      // Randomize between circle and star shapes
      if (Math.random() > 0.5) { // Increase probability of stars
        // Create a star (for variety)
        const starPoints = [];
        const spikes = 5 + Math.floor(Math.random() * 4); // More variety in star points
        const outerRadius = size / 2;
        const innerRadius = outerRadius * 0.4;
        
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI / spikes) * i;
          starPoints.push({
            x: x + radius * Math.sin(angle),
            y: y + radius * Math.cos(angle)
          });
        }
        
        const star = new fabric.Polygon(starPoints, {
          fill: color,
          opacity: 0.8,
          stroke: 'rgba(255, 255, 255, 0.6)', // Brighter outline
          strokeWidth: 2
        });
        
        canvas.add(star);
        animateShape(star, intensity);
      } else {
        // Create bubble/circle (main effect)
        const circle = new fabric.Circle({
          left: x,
          top: y,
          radius: size / 2,
          fill: color,
          opacity: 0.9,
          strokeWidth: 2,
          stroke: 'rgba(255, 255, 255, 0.6)' // Brighter outline
        });
        
        canvas.add(circle);
        animateShape(circle, intensity);
      }
    }
    
    canvas.renderAll();
  };
  
  const animateShape = (shape: fabric.Object, intensity: number) => {
    // Random movement direction with greater spread for higher intensity
    const spreadFactor = Math.min(intensity * 6, 12); // Increased spread factor for more dynamic movement
    const dx = (Math.random() - 0.5) * 25 * spreadFactor;
    const dy = (Math.random() - 0.5) * 25 * spreadFactor;
    
    // Random rotation
    const rotation = Math.random() * 360;
    
    // Animate with random movement
    fabric.util.animate({
      startValue: { left: shape.left, top: shape.top, opacity: 1.0, scale: 0.5 },
      endValue: { 
        left: shape.left! + dx * 20, // Increased movement distance
        top: shape.top! + dy * 20,
        opacity: 0, 
        scale: Math.min(3.5, 1 + intensity * 0.7) // Grow while fading
      },
      duration: 800 + Math.random() * 1000, // Slightly faster animation for better responsiveness
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
