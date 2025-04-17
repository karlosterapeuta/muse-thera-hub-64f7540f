
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
      
      // Add some initial friendly shapes to engage children
      addInitialShapes();
      
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
  
  const addInitialShapes = () => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    
    // Add a sun in the top corner
    const sun = new fabric.Circle({
      left: 30,
      top: 30,
      radius: 20,
      fill: '#FFD700',
      opacity: 0.8
    });
    
    // Add a simple house
    const house = new fabric.Rect({
      left: width / 2 - 30,
      top: height - 70,
      width: 60,
      height: 40,
      fill: '#8B4513',
      opacity: 0.7
    });
    
    const roof = new fabric.Triangle({
      left: width / 2 - 40,
      top: height - 80,
      width: 80,
      height: 40,
      fill: '#A52A2A',
      opacity: 0.7
    });
    
    // Add a tree
    const trunk = new fabric.Rect({
      left: width - 60,
      top: height - 60,
      width: 10,
      height: 30,
      fill: '#8B4513',
      opacity: 0.7
    });
    
    const foliage = new fabric.Circle({
      left: width - 75,
      top: height - 85,
      radius: 25,
      fill: '#228B22',
      opacity: 0.7
    });
    
    canvas.add(sun, house, roof, trunk, foliage);
    canvas.renderAll();
  };
  
  const addRandomShape = () => {
    if (!fabricRef.current) {
      console.error("Canvas not initialized");
      return;
    }
    
    const canvas = fabricRef.current;
    const colors = ['#FF9999', '#99FF99', '#9999FF', '#FFFF99', '#FF99FF', '#99FFFF', '#FFD700', '#FF6347', '#7FFFD4', '#DDA0DD'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Create a random shape at a random position
    const x = Math.random() * (width - 50);
    const y = Math.random() * (height - 50);
    const size = 20 + Math.random() * 50;
    
    const shapes = [
      // Circle (balloon)
      () => {
        const circle = new fabric.Circle({
          left: x,
          top: y,
          radius: size / 2,
          fill: color,
          opacity: 0.7
        });
        
        // Add string to make it look like a balloon
        if (Math.random() > 0.5) {
          const string = new fabric.Line([
            x + size / 2,
            y + size,
            x + size / 2,
            y + size + 30
          ], {
            stroke: '#000',
            strokeWidth: 1,
            opacity: 0.5
          });
          canvas.add(string);
        }
        
        return circle;
      },
      // Square (block)
      () => new fabric.Rect({
        left: x,
        top: y,
        width: size,
        height: size,
        fill: color,
        opacity: 0.7
      }),
      // Triangle (party hat)
      () => new fabric.Triangle({
        left: x,
        top: y,
        width: size,
        height: size,
        fill: color,
        opacity: 0.7
      }),
      // Heart
      () => {
        const heart = new fabric.Path('M 0 0 C 0 -5 -10 -10 -15 -10 S -25 -5 -25 0 S -20 10 0 20 C 20 10 25 5 25 0 S 20 -10 15 -10 S 0 -5 0 0', {
          left: x + 25,
          top: y + 10,
          fill: color,
          scaleX: size / 50,
          scaleY: size / 50,
          opacity: 0.7
        });
        return heart;
      },
      // Star
      () => {
        const star = new fabric.Path('M 0 -10 L 2 -2 L 10 -2 L 4 2 L 6 10 L 0 5 L -6 10 L -4 2 L -10 -2 L -2 -2 Z', {
          left: x + 15,
          top: y + 15,
          fill: color,
          scaleX: size / 20,
          scaleY: size / 20,
          opacity: 0.7
        });
        return star;
      }
    ];
    
    const shapeFunction = shapes[Math.floor(Math.random() * shapes.length)];
    const shape = shapeFunction();
    
    // Add animation to make it more engaging
    canvas.add(shape);
    
    // Animate the shape
    animateShape(shape);
    
    canvas.renderAll();
    console.log("Added shape to canvas");
  };
  
  const animateShape = (shape: fabric.Object) => {
    // Random animation
    const animations = [
      // Bounce
      () => {
        let direction = 1;
        let count = 0;
        const animate = () => {
          if (count > 10) return; // Stop after 10 steps
          
          shape.set('top', shape.top! + (5 * direction));
          fabricRef.current?.renderAll();
          
          direction *= -1;
          count++;
          
          setTimeout(animate, 100);
        };
        animate();
      },
      // Spin
      () => {
        let angle = 0;
        const animate = () => {
          if (angle > 359) return; // Stop after full rotation
          
          angle += 10;
          shape.set('angle', angle);
          fabricRef.current?.renderAll();
          
          setTimeout(animate, 50);
        };
        animate();
      },
      // Fade
      () => {
        let opacity = 0.7;
        let direction = -0.05;
        let count = 0;
        const animate = () => {
          if (count > 10) return; // Stop after 10 steps
          
          opacity += direction;
          if (opacity <= 0.2 || opacity >= 0.8) {
            direction *= -1;
          }
          
          shape.set('opacity', opacity);
          fabricRef.current?.renderAll();
          
          count++;
          setTimeout(animate, 100);
        };
        animate();
      }
    ];
    
    const animation = animations[Math.floor(Math.random() * animations.length)];
    animation();
  };
  
  // Expose the addRandomShape method to the window
  (window as any).addShapeToCanvas = addRandomShape;
  
  return (
    <div className="relative border border-purple-200 rounded-lg overflow-hidden shadow-inner bg-gradient-to-b from-blue-50 to-white">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
}
