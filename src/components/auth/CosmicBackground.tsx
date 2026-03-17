
import { useEffect, useRef } from "react";

interface Planet {
  name: string;
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
  glow: string;
  size: number;
  hasRing?: boolean;
}

const planets: Planet[] = [
  { name: "Mercury", radius: 3, orbitRadius: 80, speed: 0.008, color: "#a0a0c0", glow: "rgba(160,160,192,0.4)", size: 4 },
  { name: "Venus", radius: 5, orbitRadius: 120, speed: 0.006, color: "#e8c47a", glow: "rgba(232,196,122,0.3)", size: 6 },
  { name: "Earth", radius: 6, orbitRadius: 170, speed: 0.004, color: "#4a9eff", glow: "rgba(74,158,255,0.5)", size: 7 },
  { name: "Mars", radius: 4, orbitRadius: 220, speed: 0.003, color: "#e07050", glow: "rgba(224,112,80,0.3)", size: 5 },
  { name: "Jupiter", radius: 14, orbitRadius: 300, speed: 0.0015, color: "#d4a574", glow: "rgba(212,165,116,0.3)", size: 14 },
  { name: "Saturn", radius: 12, orbitRadius: 390, speed: 0.001, color: "#e8d5a0", glow: "rgba(232,213,160,0.3)", size: 12, hasRing: true },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    for (let i = 0; i < 60; i++) {
      particlesRef.current.push(createParticle(canvas.width, canvas.height));
    }

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.72;
      const cy = h * 0.5;

      // Clear with deep space gradient
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.8);
      bg.addColorStop(0, "#0a0a2e");
      bg.addColorStop(0.3, "#070720");
      bg.addColorStop(0.6, "#050518");
      bg.addColorStop(1, "#020210");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Draw subtle nebula clouds
      drawNebula(ctx, w, h, t);

      // Draw stars
      drawStars(ctx, w, h, t);

      // Draw orbital wave paths and planets
      planets.forEach((planet) => {
        const angle = t * planet.speed * 60;
        const scale = Math.min(w, h) / 900;
        const orbitR = planet.orbitRadius * scale;

        // Orbital path as sound wave
        drawOrbitalWave(ctx, cx, cy, orbitR, t, planet);

        // Planet position
        const px = cx + Math.cos(angle) * orbitR;
        const py = cy + Math.sin(angle) * orbitR * 0.35; // elliptical

        // Frequency vibration lines emanating from planet
        drawFrequencyLines(ctx, px, py, planet, t);

        // Planet glow
        const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, planet.size * scale * 3);
        glowGrad.addColorStop(0, planet.glow);
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(px, py, planet.size * scale * 3, 0, Math.PI * 2);
        ctx.fill();

        // Saturn ring
        if (planet.hasRing) {
          ctx.save();
          ctx.strokeStyle = `${planet.color}66`;
          ctx.lineWidth = 2 * scale;
          ctx.beginPath();
          ctx.ellipse(px, py, planet.size * scale * 2.2, planet.size * scale * 0.5, -0.3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Planet body
        const planetGrad = ctx.createRadialGradient(px - 2, py - 2, 0, px, py, planet.size * scale);
        planetGrad.addColorStop(0, lightenColor(planet.color, 40));
        planetGrad.addColorStop(0.7, planet.color);
        planetGrad.addColorStop(1, darkenColor(planet.color, 40));
        ctx.fillStyle = planetGrad;
        ctx.beginPath();
        ctx.arc(px, py, planet.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connection lines between planets (harmonic connections)
      drawHarmonicConnections(ctx, cx, cy, t, w, h);

      // Draw and update particles
      updateParticles(ctx, particlesRef.current, w, h);

      // Central "sun" / source of harmony
      drawCentralStar(ctx, cx, cy, t, w, h);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    life: Math.random() * 200,
    maxLife: 200 + Math.random() * 200,
    size: Math.random() * 2 + 0.5,
    hue: 220 + Math.random() * 60,
  };
}

function drawNebula(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.save();
  ctx.globalAlpha = 0.08;

  // Purple nebula
  const n1 = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, w * 0.4);
  n1.addColorStop(0, "#6b21a8");
  n1.addColorStop(0.5, "#4c1d95");
  n1.addColorStop(1, "transparent");
  ctx.fillStyle = n1;
  ctx.fillRect(0, 0, w, h);

  // Blue nebula
  ctx.globalAlpha = 0.06;
  const n2 = ctx.createRadialGradient(w * 0.7, h * 0.7, 0, w * 0.7, h * 0.7, w * 0.35);
  n2.addColorStop(0, "#1e40af");
  n2.addColorStop(0.5, "#1e3a5f");
  n2.addColorStop(1, "transparent");
  ctx.fillStyle = n2;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
}

function drawStars(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Use deterministic "random" based on position
  for (let i = 0; i < 120; i++) {
    const seed = i * 7919;
    const x = (seed * 13) % w;
    const y = (seed * 17) % h;
    const twinkle = Math.sin(t * 2 + i * 0.5) * 0.3 + 0.7;
    const size = ((seed % 3) + 1) * 0.5;

    ctx.fillStyle = `rgba(200, 210, 255, ${twinkle * 0.6})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawOrbitalWave(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  orbitR: number,
  t: number,
  planet: Planet
) {
  ctx.save();
  ctx.strokeStyle = `${planet.color}18`;
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let a = 0; a < Math.PI * 2; a += 0.02) {
    const waveAmp = Math.sin(a * 8 + t * planet.speed * 100) * 3;
    const r = orbitR + waveAmp;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * 0.35;
    if (a === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawFrequencyLines(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  planet: Planet,
  t: number
) {
  ctx.save();
  const numLines = 3;
  for (let i = 0; i < numLines; i++) {
    const angle = (Math.PI * 2 * i) / numLines + t * 0.5;
    const len = 15 + Math.sin(t * 3 + i) * 8;
    ctx.strokeStyle = `${planet.color}30`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + Math.cos(angle) * len, py + Math.sin(angle) * len);
    ctx.stroke();
  }
  ctx.restore();
}

function drawHarmonicConnections(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  w: number,
  h: number
) {
  const scale = Math.min(w, h) / 900;

  // Connect every other planet with subtle lines
  for (let i = 0; i < planets.length - 2; i += 2) {
    const p1 = planets[i];
    const p2 = planets[i + 1];
    const a1 = t * p1.speed * 60;
    const a2 = t * p2.speed * 60;
    const x1 = cx + Math.cos(a1) * p1.orbitRadius * scale;
    const y1 = cy + Math.sin(a1) * p1.orbitRadius * scale * 0.35;
    const x2 = cx + Math.cos(a2) * p2.orbitRadius * scale;
    const y2 = cy + Math.sin(a2) * p2.orbitRadius * scale * 0.35;

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, `${p1.color}15`);
    grad.addColorStop(0.5, `rgba(139,92,246,0.08)`);
    grad.addColorStop(1, `${p2.color}15`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - 20;
    ctx.quadraticCurveTo(midX, midY, x2, y2);
    ctx.stroke();
  }
}

function updateParticles(ctx: CanvasRenderingContext2D, particles: Particle[], w: number, h: number) {
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life++;

    if (p.life > p.maxLife || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
      Object.assign(p, createParticle(w, h));
    }

    const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.5;
    ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawCentralStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  t: number,
  w: number,
  h: number
) {
  const pulse = Math.sin(t * 1.5) * 0.15 + 1;
  const scale = Math.min(w, h) / 900;
  const r = 18 * scale * pulse;

  // Outer glow
  const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 4);
  g1.addColorStop(0, "rgba(139,92,246,0.15)");
  g1.addColorStop(0.3, "rgba(99,102,241,0.08)");
  g1.addColorStop(1, "transparent");
  ctx.fillStyle = g1;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 4, 0, Math.PI * 2);
  ctx.fill();

  // Core
  const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g2.addColorStop(0, "#ffffff");
  g2.addColorStop(0.3, "#c4b5fd");
  g2.addColorStop(0.7, "#8b5cf6");
  g2.addColorStop(1, "#6d28d9");
  ctx.fillStyle = g2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Sound wave rings from center
  for (let i = 0; i < 3; i++) {
    const waveR = ((t * 20 + i * 40) % 120) * scale;
    const waveAlpha = 1 - waveR / (120 * scale);
    if (waveAlpha > 0) {
      ctx.strokeStyle = `rgba(139,92,246,${waveAlpha * 0.12})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r + waveR, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}
