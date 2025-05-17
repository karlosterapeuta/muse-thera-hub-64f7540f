
import { fabric } from "fabric";

export class Star extends fabric.Polygon {
  constructor(options: fabric.IPolylineOptions) {
    const numPoints = options.numPoints || 5;
    const outerRadius = options.radius || 25;
    const innerRadius = options.innerRadius || outerRadius / 2;
    
    // Create points for the star
    const points = [];
    const angleStep = (Math.PI * 2) / (numPoints * 2);
    
    for (let i = 0; i < numPoints * 2; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push({ x, y });
    }
    
    // Call the parent Polygon constructor
    super(points, options);
  }
}

// Add Star to fabric namespace for consistency with the rest of fabric objects
fabric.Star = Star;

// Register the class for fabric deserialization
fabric.util.classRegistry.addSVGParser("star", Star);

// Extend the fabric namespace through interface merging instead of module augmentation
declare global {
  namespace fabric {
    var Star: typeof Star;
    
    interface IPolylineOptions {
      numPoints?: number;
      innerRadius?: number;
    }
  }
}

// @ts-ignore
fabric.Star = Star;
