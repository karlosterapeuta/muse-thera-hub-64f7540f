
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulse: number;
}

interface OrbitLine {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotation: number;
  speed: number;
  alpha: number;
}

export function DashboardBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const orbitsRef = useRef<OrbitLine[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!initialized.current) {
        initElements(canvas.width, canvas.height);
        initialized.current = true;
      }
    };

    function initElements(w: number, h: number) {
      // Subtle particles
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.3 + 0.05,
          pulse: Math.random() * Math.PI * 2,
        });
      }

      // Orbital grid lines
      const centerPoints = [
        { x: w * 0.15, y: h * 0.2 },
        { x: w * 0.85, y: h * 0.3 },
        { x: w * 0.5, y: h * 0.8 },
        { x: w * 0.1, y: h * 0.7 },
        { x: w * 0.9, y: h * 0.85 },
      ];
      centerPoints.forEach((cp) => {
        const count = 2 + Math.floor(Math.random() * 3);
        for (let j = 0; j < count; j++) {
          orbitsRef.current.push({
            cx: cp.x,
            cy: cp.y,
            rx: 60 + j * 50 + Math.random() * 40,
            ry: 30 + j * 25 + Math.random() * 20,
            rotation: Math.random() * Math.PI,
            speed: 0.0002 + Math.random() * 0.0004,
            alpha: 0.03 + Math.random() * 0.04,
          });
        }
      });
    }

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Deep space gradient
      const bg = ctx.createLinearGradient(0, 0, w * 0.3, h);
      bg.addColorStop(0, "#0A0F2C");
      bg.addColorStop(0.4, "#0D1233");
      bg.addColorStop(0.7, "#1A1545");
      bg.addColorStop(1, "#0A0F2C");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Subtle nebula glow
      drawNebulaGlow(ctx, w, h, t);

      // Orbital lines (organic grid)
      drawOrbits(ctx, orbitsRef.current, t);

      // Sound wave frequencies
      drawFrequencies(ctx, w, h, t);

      // Equalizer hints
      drawEqualizer(ctx, w, h, t);

      // Particles
      drawParticles(ctx, particlesRef.current, w, h, t);

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
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

function drawNebulaGlow(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.save();

  // Purple nebula - top right
  ctx.globalAlpha = 0.04 + Math.sin(t * 0.3) * 0.01;
  const n1 = ctx.createRadialGradient(w * 0.8, h * 0.15, 0, w * 0.8, h * 0.15, w * 0.35);
  n1.addColorStop(0, "#3A2D6F");
  n1.addColorStop(0.5, "#2A1D5F");
  n1.addColorStop(1, "transparent");
  ctx.fillStyle = n1;
  ctx.fillRect(0, 0, w, h);

  // Blue nebula - bottom left
  ctx.globalAlpha = 0.03 + Math.sin(t * 0.25 + 1) * 0.01;
  const n2 = ctx.createRadialGradient(w * 0.1, h * 0.85, 0, w * 0.1, h * 0.85, w * 0.3);
  n2.addColorStop(0, "#1e3a6f");
  n2.addColorStop(0.5, "#142850");
  n2.addColorStop(1, "transparent");
  ctx.fillStyle = n2;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
}

function drawOrbits(ctx: CanvasRenderingContext2D, orbits: OrbitLine[], t: number) {
  ctx.save();
  orbits.forEach((o) => {
    const rot = o.rotation + t * o.speed;
    ctx.strokeStyle = `rgba(120, 100, 200, ${o.alpha})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.ellipse(o.cx, o.cy, o.rx, o.ry, rot, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();
}

function drawFrequencies(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.save();

  // Bottom wave
  ctx.strokeStyle = "rgba(100, 120, 220, 0.04)";
  ctx.lineWidth = 1;
  for (let wave = 0; wave < 3; wave++) {
    ctx.beginPath();
    const baseY = h * (0.75 + wave * 0.06);
    for (let x = 0; x < w; x += 3) {
      const freq = 0.008 + wave * 0.003;
      const amp = 8 + wave * 4;
      const y = baseY + Math.sin(x * freq + t * (0.5 + wave * 0.2)) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Top wave (subtle)
  ctx.strokeStyle = "rgba(140, 100, 200, 0.03)";
  ctx.beginPath();
  for (let x = 0; x < w; x += 3) {
    const y = h * 0.12 + Math.sin(x * 0.005 + t * 0.3) * 6;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.restore();
}

function drawEqualizer(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.save();

  // Left edge equalizer bars (very subtle)
  const barCount = 12;
  const barWidth = 2;
  const maxHeight = 30;
  const startX = 15;
  const startY = h * 0.45;

  ctx.globalAlpha = 0.05;
  for (let i = 0; i < barCount; i++) {
    const barH = (Math.sin(t * 1.5 + i * 0.6) * 0.5 + 0.5) * maxHeight;
    const gradient = ctx.createLinearGradient(0, startY - barH, 0, startY);
    gradient.addColorStop(0, "#6366f1");
    gradient.addColorStop(1, "#3A2D6F");
    ctx.fillStyle = gradient;
    ctx.fillRect(startX + i * (barWidth + 3), startY - barH, barWidth, barH);
  }

  // Right edge equalizer (mirrored, even more subtle)
  ctx.globalAlpha = 0.03;
  const rightX = w - 60;
  const rightY = h * 0.55;
  for (let i = 0; i < barCount; i++) {
    const barH = (Math.sin(t * 1.2 + i * 0.5 + 2) * 0.5 + 0.5) * maxHeight * 0.7;
    ctx.fillStyle = "#4a3d8f";
    ctx.fillRect(rightX + i * (barWidth + 3), rightY - barH, barWidth, barH);
  }

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], w: number, h: number, t: number) {
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;

    const pulse = Math.sin(t * 1.5 + p.pulse) * 0.5 + 0.5;
    const alpha = p.alpha * (0.5 + pulse * 0.5);

    ctx.fillStyle = `rgba(180, 180, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}
