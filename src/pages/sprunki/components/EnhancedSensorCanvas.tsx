
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SoundWave, SensorPosition, GameMode } from '../types/sensorSync';
import { enhancedAudio } from '../utils/enhancedAudioSynthesis';
import { physicsEngine, Particle } from '../utils/physicsEngine';
import { visualEffects, VisualEffect } from '../utils/visualEffects';
import { getColorFromPosition } from '../utils/colorTheory';

interface EnhancedSensorCanvasProps {
  currentMode: GameMode;
  settings: {
    sensitivity: number;
    visualIntensity: number;
    showTrails: boolean;
  };
  onMetricsUpdate: (metrics: any) => void;
  selectedInstrument?: string;
}

const EnhancedSensorCanvas: React.FC<EnhancedSensorCanvasProps> = ({
  currentMode,
  settings,
  onMetricsUpdate,
  selectedInstrument = 'piano'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  const [particles, setParticles] = useState<Particle[]>([]);
  const [soundWaves, setSoundWaves] = useState<SoundWave[]>([]);
  const [effects, setEffects] = useState<VisualEffect[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [harmoniesCreated, setHarmoniesCreated] = useState(0);
  
  const [metrics, setMetrics] = useState({
    movementCount: 0,
    totalInteractions: 0,
    sessionStart: Date.now(),
    harmoniesCreated: 0
  });

  // Set instrument when prop changes
  useEffect(() => {
    enhancedAudio.setInstrument(selectedInstrument);
  }, [selectedInstrument]);

  const createAdvancedSoundWave = useCallback((position: SensorPosition) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const frequency = 200 + (position.x / canvas.width) * 1000;
    
    // Create enhanced audio note
    const noteId = enhancedAudio.createNote(
      frequency,
      position.x,
      position.y,
      canvas.width,
      canvas.height
    );

    if (noteId) {
      const color = getColorFromPosition(
        position.x,
        position.y,
        canvas.width,
        canvas.height,
        currentMode.colorPalette
      );

      // Create physics particle
      const newParticle: Particle = {
        id: `particle-${Date.now()}-${Math.random()}`,
        x: position.x,
        y: position.y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: 15 + Math.random() * 10,
        mass: 1 + Math.random(),
        color,
        life: 120,
        maxLife: 120,
        trail: [],
        type: 'wave',
        frequency
      };

      setParticles(prev => [...prev, newParticle]);

      // Create visual effects
      visualEffects.createRipple(position.x, position.y, color, settings.visualIntensity);
      
      if (Math.random() < 0.3) {
        visualEffects.createGeometryMorph(position.x, position.y, color, frequency);
      }

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        movementCount: prev.movementCount + 1,
        totalInteractions: prev.totalInteractions + 1
      }));

      // Check for harmonies (multiple particles close together)
      const nearbyParticles = particles.filter(p => {
        const dx = p.x - position.x;
        const dy = p.y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 80 && p.id !== newParticle.id;
      });

      if (nearbyParticles.length >= 2) {
        // Create harmony effect
        visualEffects.createBurst(position.x, position.y, color, 1.5);
        setHarmoniesCreated(prev => prev + 1);
        
        // Create chord based on nearby frequencies
        const frequencies = nearbyParticles.slice(0, 3).map(p => p.frequency || 440);
        enhancedAudio.createChord(frequencies, position.x, position.y, canvas.width, canvas.height);
      }
    }
  }, [currentMode, settings.visualIntensity, particles]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const position: SensorPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: 0.8,
      velocity: 1.0
    };

    createAdvancedSoundWave(position);
  }, [isMouseDown, createAdvancedSoundWave]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsMouseDown(true);
    handleMouseMove(e);
  }, [handleMouseMove]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    Array.from(e.touches).forEach(touch => {
      const position: SensorPosition = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        pressure: 0.8,
        velocity: 1.0
      };
      createAdvancedSoundWave(position);
    });
  }, [createAdvancedSoundWave]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    Array.from(e.touches).forEach(touch => {
      const position: SensorPosition = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        pressure: 0.8,
        velocity: 1.0
      };
      createAdvancedSoundWave(position);
    });
  }, [createAdvancedSoundWave]);

  const handleTouchEnd = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  // Enhanced animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Clear canvas with trail effect
      if (!settings.showTrails) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update and render particles with physics
      setParticles(prev => {
        let updated = prev.map(particle => physicsEngine.updateParticle(particle, deltaTime * 0.016));
        
        // Apply magnetism
        updated = physicsEngine.applyMagnetism(updated);
        
        // Check collisions and create explosions
        const { particles: collisionUpdated, collisions } = physicsEngine.checkCollisions(updated);
        
        // Create explosion effects for collisions
        collisions.forEach(collision => {
          const explosionParticles = physicsEngine.createExplosion(
            collision.x, 
            collision.y, 
            collision.intensity
          );
          updated = [...collisionUpdated, ...explosionParticles];
        });

        // Render particles
        updated.forEach(particle => {
          // Render trail
          if (particle.trail.length > 1) {
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = particle.radius * 0.3;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            particle.trail.forEach((point, index) => {
              if (index === 0) {
                ctx.moveTo(point.x, point.y);
              } else {
                ctx.lineTo(point.x, point.y);
              }
            });
            ctx.stroke();
          }

          // Render particle
          ctx.globalAlpha = particle.life / particle.maxLife;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();

          // Add glow effect
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius * 2
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.globalAlpha = 0.3;
          ctx.fill();
        });

        ctx.globalAlpha = 1;

        // Filter out dead particles
        return updated.filter(particle => particle.life > 0);
      });

      // Update and render visual effects
      const currentEffects = visualEffects.update(deltaTime);
      setEffects(currentEffects);
      
      currentEffects.forEach(effect => {
        visualEffects.renderEffect(ctx, effect);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [settings.showTrails]);

  // Update metrics
  useEffect(() => {
    const interval = setInterval(() => {
      onMetricsUpdate({
        ...metrics,
        sessionDuration: Date.now() - metrics.sessionStart,
        averageIntensity: particles.length > 0 
          ? particles.reduce((sum, particle) => sum + (particle.life / particle.maxLife), 0) / particles.length
          : 0,
        harmoniesCreated
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [metrics, particles, harmoniesCreated, onMetricsUpdate]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          background: `linear-gradient(135deg, ${currentMode.colorPalette[0]}15, ${currentMode.colorPalette[1]}15, ${currentMode.colorPalette[2] || currentMode.colorPalette[0]}15)`
        }}
      />
      
      {/* Enhanced mode indicator */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-white/20">
        <div className="font-bold text-lg mb-1" style={{ color: currentMode.colorPalette[0] }}>
          {currentMode.name}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {currentMode.description}
        </div>
        <div className="text-xs text-gray-500">
          Instrumento: <span className="font-medium capitalize">{selectedInstrument}</span>
        </div>
      </div>

      {/* Enhanced instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border border-white/20">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-700 mb-1">
            🎨 Toque, arraste e crie música visual!
          </div>
          <div className="text-xs text-gray-500">
            💫 Toque próximo a outras ondas para criar harmonias
          </div>
        </div>
      </div>

      {/* Particle count indicator */}
      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
        ✨ {particles.length} partículas ativas
      </div>
    </div>
  );
};

export default EnhancedSensorCanvas;
