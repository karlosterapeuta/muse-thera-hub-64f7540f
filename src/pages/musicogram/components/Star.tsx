
import { Polygon } from "fabric";

// Create a Star class that extends Polygon for use in the MusicogramCanvas
export class Star extends Polygon {
  constructor(options: any) {
    const points = Star.createStarPoints(options.radius || 50, 5);
    super(points, {
      ...options,
      objectCaching: false,
    });
  }

  static createStarPoints(outerRadius: number, points: number = 5) {
    const innerRadius = outerRadius * 0.4;
    const angleIncrement = Math.PI * 2 / (points * 2);
    const coordinates = [];

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * angleIncrement;
      
      coordinates.push({
        x: radius * Math.sin(angle),
        y: -radius * Math.cos(angle)
      });
    }

    return coordinates;
  }
}
