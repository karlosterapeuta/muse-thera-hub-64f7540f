
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SoundWave, SensorPosition, GameMode } from '../types/sensorSync';
import { audioSynthesis } from '../utils/audioSynthesis';
import { getColorFromPosition, generateParticleColor } from '../utils/colorTheory';

interface SensorCanvasProps {
  currentMode: GameMode;
  settings: {
    sensitivity: number;
    visualIntensity: number;
    showTrails: boolean;
  };
  onMetricsUpdate: (metrics: any) => void;
}

const SensorCanvas: React.FC<SensorCanvasProps> = ({
  currentMode,
  settings,
  onMetricsUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [soundWaves, setSoundWaves] = useState<SoundWave[]>([]);
  const [particles, setParticles] = useState<any[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [metrics, setMetrics] = useState({
    movementCount: 0,
    totalInteractions: 0,
    sessionStart: Date.now()
  });

  const createSoundWave = useCallback((position: SensorPosition) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const soundId = audioSynthesis.createSoundWave(
      position.x,
      position.y,
      canvas.width,
      canvas.height
    );

    if (soundId) {
      const color = getColorFromPosition(
        position.x,
        position.y,
        canvas.width,
        canvas.height,
        currentMode.colorPalette
      );

      const newWave: SoundWave = {
        id: soundId,
        x: position.x,
        y: position.y,
        radius: 10,
        frequency: currentMode.baseFrequency + (position.x / canvas.width) * 1000,
        amplitude: position.pressure || 0.5,
        color,
        decay: currentMode.waveDecay,
        timestamp: Date.now()
      };

      setSoundWaves(prev => {
        const updated = [...prev, newWave];
        return updated.length > currentMode.maxWaves 
          ? updated.slice(-currentMode.maxWaves)
          : updated;
      });

      // Create particles
      const newParticles = Array.from({ length: 5 }, (_, i) => ({
        id: `particle-${Date.now()}-${i}`,
        x: position.x + (Math.random() - 0.5) * 20,
        y: position.y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color,
        life: 1.0,
        decay: 0.02
      }));

      setParticles(prev => [...prev, ...newParticles]);

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        movementCount: prev.movementCount + 1,
        totalInteractions: prev.totalInteractions + 1
      }));
    }
  }, [currentMode]);

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

    createSoundWave(position);
  }, [isMouseDown, createSoundWave]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsMouseDown(true);
    handleMouseMove(e);
  }, [handleMouseMove]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    Array.from(e.touches).forEach(touch => {
      const position: SensorPosition = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        pressure: touch.force || 0.8,
        velocity: 1.0
      };
      createSoundWave(position);
    });
  }, [createSoundWave]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      if (!settings.showTrails) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw sound waves
      setSoundWaves(prev => {
        const updated = prev.map(wave => ({
          ...wave,
          radius: wave.radius + 2,
          decay: wave.decay * 0.98
        })).filter(wave => wave.decay > 0.1);

        updated.forEach(wave => {
          ctx.strokeStyle = generateParticleColor(wave.color, wave.decay);
          ctx.lineWidth = wave.amplitude * 3;
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
          ctx.stroke();
        });

        return updated;
      });

      // Draw particles
      setParticles(prev => {
        const updated = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - particle.decay
        })).filter(particle => particle.life > 0);

        updated.forEach(particle => {
          ctx.fillStyle = generateParticleColor(particle.color, particle.life);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });

        return updated;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

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
        averageIntensity: soundWaves.length > 0 
          ? soundWaves.reduce((sum, wave) => sum + wave.amplitude, 0) / soundWaves.length
          : 0
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [metrics, soundWaves, onMetricsUpdate]);

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
        onTouchStart={handleMouseDown}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        style={{
          background: `linear-gradient(135deg, ${currentMode.colorPalette[0]}20, ${currentMode.colorPalette[1]}20)`
        }}
      />
      
      {/* Mode indicator */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        <div className="font-bold text-sm" style={{ color: currentMode.colorPalette[0] }}>
          {currentMode.name}
        </div>
        <div className="text-xs text-gray-600">
          {currentMode.description}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
        <div className="text-sm text-center text-gray-700">
          🎨 Mova o mouse ou toque na tela para criar música visual!
        </div>
      </div>
    </div>
  );
};

export default SensorCanvas;
