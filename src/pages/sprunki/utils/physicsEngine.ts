
export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
  life: number;
  maxLife: number;
  trail: { x: number; y: number; alpha: number }[];
  type: 'wave' | 'spark' | 'note' | 'harmony';
  frequency?: number;
}

export interface Force {
  x: number;
  y: number;
}

export class PhysicsEngine {
  private gravity: Force = { x: 0, y: 0.1 };
  private friction = 0.99;
  private magnetism = 0.05;

  updateParticle(particle: Particle, deltaTime: number): Particle {
    // Apply gravity
    particle.vx += this.gravity.x * deltaTime;
    particle.vy += this.gravity.y * deltaTime;

    // Apply friction
    particle.vx *= this.friction;
    particle.vy *= this.friction;

    // Update position
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;

    // Update trail
    particle.trail.unshift({ 
      x: particle.x, 
      y: particle.y, 
      alpha: particle.life / particle.maxLife 
    });
    
    // Limit trail length
    if (particle.trail.length > 10) {
      particle.trail.pop();
    }

    // Update life
    particle.life -= deltaTime;

    return particle;
  }

  applyMagnetism(particles: Particle[]): Particle[] {
    return particles.map(particle1 => {
      const forces: Force = { x: 0, y: 0 };

      particles.forEach(particle2 => {
        if (particle1.id === particle2.id) return;

        const dx = particle2.x - particle1.x;
        const dy = particle2.y - particle1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100 && distance > 0) {
          // Musical magnetism - similar frequencies attract
          const freqDiff = Math.abs((particle1.frequency || 0) - (particle2.frequency || 0));
          const attraction = this.magnetism * (1 - freqDiff / 1000);
          
          const force = attraction / (distance * distance);
          forces.x += (dx / distance) * force;
          forces.y += (dy / distance) * force;
        }
      });

      particle1.vx += forces.x;
      particle1.vy += forces.y;

      return particle1;
    });
  }

  checkCollisions(particles: Particle[]): { particles: Particle[]; collisions: any[] } {
    const collisions: any[] = [];

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < p1.radius + p2.radius) {
          // Collision detected
          collisions.push({
            p1: p1.id,
            p2: p2.id,
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
            intensity: (p1.mass + p2.mass) / 2
          });

          // Simple elastic collision
          const overlap = p1.radius + p2.radius - distance;
          const separationX = (dx / distance) * overlap * 0.5;
          const separationY = (dy / distance) * overlap * 0.5;

          p1.x -= separationX;
          p1.y -= separationY;
          p2.x += separationX;
          p2.y += separationY;

          // Exchange velocities (simplified)
          const tempVx = p1.vx;
          const tempVy = p1.vy;
          p1.vx = p2.vx * 0.8;
          p1.vy = p2.vy * 0.8;
          p2.vx = tempVx * 0.8;
          p2.vy = tempVy * 0.8;
        }
      }
    }

    return { particles, collisions };
  }

  createExplosion(x: number, y: number, intensity: number): Particle[] {
    const particleCount = Math.floor(intensity * 10) + 5;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = (Math.random() * 3 + 1) * intensity;

      particles.push({
        id: `explosion-${Date.now()}-${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 5 + 2,
        mass: 1,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        life: 60,
        maxLife: 60,
        trail: [],
        type: 'spark',
        frequency: 400 + Math.random() * 800
      });
    }

    return particles;
  }
}

export const physicsEngine = new PhysicsEngine();
