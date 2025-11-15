import { Music, Music2, Disc3 } from "lucide-react";

export function AnimatedParticles() {
  const particles = [
    { Icon: Music, delay: 0, duration: 8, x: '10%', y: '20%' },
    { Icon: Music2, delay: 1, duration: 10, x: '80%', y: '30%' },
    { Icon: Disc3, delay: 2, duration: 12, x: '15%', y: '70%' },
    { Icon: Music, delay: 3, duration: 9, x: '85%', y: '80%' },
    { Icon: Music2, delay: 4, duration: 11, x: '50%', y: '15%' },
    { Icon: Disc3, delay: 5, duration: 13, x: '40%', y: '85%' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => {
        const Icon = particle.Icon;
        return (
          <div
            key={index}
            className="absolute text-primary/10"
            style={{
              left: particle.x,
              top: particle.y,
              animation: `float-slow ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            <Icon className="w-8 h-8 md:w-12 md:h-12" />
          </div>
        );
      })}
      
      {/* Glowing orbs */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full blur-3xl animate-pulse-slow"
          style={{
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            left: `${20 + i * 25}%`,
            top: `${15 + i * 20}%`,
            background: i % 2 === 0 
              ? 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, hsl(var(--secondary) / 0.15) 0%, transparent 70%)',
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${6 + i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
