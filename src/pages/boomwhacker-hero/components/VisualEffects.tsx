
import React from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  life: number;
  velocity: { x: number; y: number };
}

interface VisualEffectsProps {
  particles: Particle[];
  trackWidth: number;
  trackHeight: number;
}

const VisualEffects: React.FC<VisualEffectsProps> = ({ particles, trackWidth, trackHeight }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-pulse"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            opacity: particle.life,
            boxShadow: `0 0 10px ${particle.color}`,
            transform: `scale(${particle.life})`,
            transition: 'all 0.1s ease-out'
          }}
        />
      ))}
    </div>
  );
};

export default VisualEffects;
