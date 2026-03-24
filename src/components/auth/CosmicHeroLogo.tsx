import { useEffect, useRef } from "react";

export function CosmicHeroLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const logoLoaded = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load logo image
    const logo = new Image();
    logo.src = "/lovable-uploads/musetera-logo-new.png";
    logo.onload = () => {
      logoRef.current = logo;
      logoLoaded.current = true;
    };

    const SIZE = 400;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    ctx.scale(DPR, DPR);

    const cx = SIZE / 2;
    const cy = SIZE / 2;

    // Mini planets data
    const miniPlanets = [
      { orbitA: 155, orbitB: 50, speed: 0.4, size: 12, color: "#c4956a", ringColor: "#d4a574aa", angle0: 0.8, hasRing: true },
      { orbitA: 140, orbitB: 65, speed: -0.25, size: 8, color: "#8899aa", ringColor: "", angle0: 2.5, hasRing: false },
      { orbitA: 170, orbitB: 55, speed: 0.18, size: 14, color: "#5599bb", ringColor: "#77bbddaa", angle0: 4.2, hasRing: true },
      { orbitA: 130, orbitB: 70, speed: -0.35, size: 7, color: "#aa8877", ringColor: "", angle0: 1.5, hasRing: false },
      { orbitA: 160, orbitB: 45, speed: 0.3, size: 10, color: "#7799aa", ringColor: "", angle0: 3.8, hasRing: false },
      { orbitA: 175, orbitB: 60, speed: -0.15, size: 9, color: "#55aacc", ringColor: "", angle0: 5.5, hasRing: false },
    ];

    // Stars
    const stars: { x: number; y: number; s: number; b: number; sp: number }[] = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * SIZE,
        y: Math.random() * SIZE,
        s: Math.random() * 1.5 + 0.3,
        b: Math.random(),
        sp: Math.random() * 2 + 1,
      });
    }

    // Light streak particles
    const streaks: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; hue: number }[] = [];
    for (let i = 0; i < 30; i++) {
      streaks.push(createStreak(SIZE));
    }

    function createStreak(s: number) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 120;
      return {
        x: s / 2 + Math.cos(angle) * dist,
        y: s / 2 + Math.sin(angle) * dist,
        vx: Math.cos(angle + Math.PI / 2) * (0.2 + Math.random() * 0.5),
        vy: Math.sin(angle + Math.PI / 2) * (0.2 + Math.random() * 0.5),
        life: 0,
        maxLife: 100 + Math.random() * 150,
        hue: 220 + Math.random() * 80,
      };
    }

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Nebula glow
      ctx.save();
      ctx.globalAlpha = 0.15 + Math.sin(t * 0.3) * 0.05;
      const neb1 = ctx.createRadialGradient(cx - 40, cy - 30, 0, cx, cy, 160);
      neb1.addColorStop(0, "#7c3aed");
      neb1.addColorStop(0.5, "#4c1d95");
      neb1.addColorStop(1, "transparent");
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, SIZE, SIZE);
      const neb2 = ctx.createRadialGradient(cx + 50, cy + 40, 0, cx, cy, 140);
      neb2.addColorStop(0, "#2563eb");
      neb2.addColorStop(0.5, "#1e3a5f");
      neb2.addColorStop(1, "transparent");
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.restore();

      // Stars
      stars.forEach((s) => {
        const twinkle = Math.sin(t * s.sp + s.b * 10) * 0.4 + 0.6;
        ctx.fillStyle = `rgba(200,210,255,${twinkle * 0.7})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
        ctx.fill();
        if (s.s > 1) {
          ctx.fillStyle = `rgba(200,210,255,${twinkle * 0.1})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.s * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Light streaks (flowing lines like in the image)
      streaks.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        if (s.life > s.maxLife) Object.assign(s, createStreak(SIZE));
        const alpha = Math.sin((s.life / s.maxLife) * Math.PI) * 0.3;
        ctx.strokeStyle = `hsla(${s.hue}, 70%, 70%, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 12, s.y - s.vy * 12);
        ctx.stroke();
      });

      // Orbital ellipse rings (tilted, like in the image)
      const orbits = [
        { a: 130, b: 40, tilt: -0.3, color: "rgba(180,160,255,0.2)", width: 1.5 },
        { a: 145, b: 50, tilt: 0.15, color: "rgba(100,180,255,0.18)", width: 1.2 },
        { a: 120, b: 35, tilt: -0.5, color: "rgba(255,200,100,0.12)", width: 1 },
        { a: 160, b: 55, tilt: 0.4, color: "rgba(160,120,255,0.15)", width: 1 },
        { a: 110, b: 60, tilt: -0.1, color: "rgba(100,200,255,0.1)", width: 0.8 },
      ];

      orbits.forEach((orb) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(orb.tilt + Math.sin(t * 0.1) * 0.02);
        ctx.strokeStyle = orb.color;
        ctx.lineWidth = orb.width;
        ctx.beginPath();
        ctx.ellipse(0, 0, orb.a, orb.b, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Glowing highlight on orbit
        const glowAngle = t * 0.5;
        const gx = Math.cos(glowAngle) * orb.a;
        const gy = Math.sin(glowAngle) * orb.b;
        const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, 8);
        glow.addColorStop(0, "rgba(255,255,255,0.3)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(gx, gy, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Central planet (large blue sphere like in the image)
      const planetR = 55 + Math.sin(t * 0.8) * 2;

      // Planet outer glow (bright ring like in the image)
      const outerGlow = ctx.createRadialGradient(cx, cy, planetR - 5, cx, cy, planetR + 25);
      outerGlow.addColorStop(0, "rgba(100,160,255,0.4)");
      outerGlow.addColorStop(0.4, "rgba(140,100,255,0.2)");
      outerGlow.addColorStop(0.7, "rgba(180,140,255,0.08)");
      outerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, planetR + 25, 0, Math.PI * 2);
      ctx.fill();

      // Bright ring around planet
      ctx.save();
      ctx.strokeStyle = "rgba(180,200,255,0.5)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(140,160,255,0.6)";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(cx, cy, planetR + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Planet body
      const planetGrad = ctx.createRadialGradient(cx - 15, cy - 15, 0, cx, cy, planetR);
      planetGrad.addColorStop(0, "#4a7acc");
      planetGrad.addColorStop(0.3, "#2a5aaa");
      planetGrad.addColorStop(0.7, "#1a3a7a");
      planetGrad.addColorStop(1, "#0a1a4a");
      ctx.fillStyle = planetGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
      ctx.fill();

      // Planet surface texture (subtle bands)
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.clip();
      for (let i = -planetR; i < planetR; i += 8) {
        const bandW = planetR * 2;
        ctx.fillStyle = i % 16 === 0 ? "rgba(100,150,220,0.3)" : "rgba(30,60,120,0.2)";
        ctx.fillRect(cx - planetR, cy + i, bandW, 4);
      }
      ctx.restore();

      // Draw mini planets orbiting
      miniPlanets.forEach((mp) => {
        const angle = mp.angle0 + t * mp.speed;
        const px = cx + Math.cos(angle) * mp.orbitA;
        const py = cy + Math.sin(angle) * mp.orbitB;

        // Planet glow
        const mpGlow = ctx.createRadialGradient(px, py, 0, px, py, mp.size * 2.5);
        mpGlow.addColorStop(0, mp.color + "60");
        mpGlow.addColorStop(1, "transparent");
        ctx.fillStyle = mpGlow;
        ctx.beginPath();
        ctx.arc(px, py, mp.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Ring if applicable
        if (mp.hasRing && mp.ringColor) {
          ctx.save();
          ctx.strokeStyle = mp.ringColor;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(px, py, mp.size * 2, mp.size * 0.5, -0.3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Planet body
        const mpGrad = ctx.createRadialGradient(px - 2, py - 2, 0, px, py, mp.size);
        mpGrad.addColorStop(0, lighten(mp.color, 50));
        mpGrad.addColorStop(0.6, mp.color);
        mpGrad.addColorStop(1, darken(mp.color, 60));
        ctx.fillStyle = mpGrad;
        ctx.beginPath();
        ctx.arc(px, py, mp.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Sound wave rings from center (pulsing outward)
      for (let i = 0; i < 4; i++) {
        const waveR = ((t * 15 + i * 30) % 120);
        const waveAlpha = (1 - waveR / 120) * 0.15;
        if (waveAlpha > 0) {
          ctx.strokeStyle = `rgba(140,120,255,${waveAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(cx, cy, planetR + waveR, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Draw logo image on top of planet
      if (logoLoaded.current && logoRef.current) {
        const logoSize = planetR * 1.5;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, planetR - 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
          logoRef.current,
          cx - logoSize / 2,
          cy - logoSize / 2,
          logoSize,
          logoSize
        );
        ctx.restore();
      }

      // Golden "Musetera" text glow
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 22px 'Poppins', sans-serif";
      ctx.shadowColor = "rgba(200,160,50,0.8)";
      ctx.shadowBlur = 20;
      // Gold gradient text
      const textGrad = ctx.createLinearGradient(cx - 50, cy + 5, cx + 50, cy + 5);
      textGrad.addColorStop(0, "#d4a030");
      textGrad.addColorStop(0.5, "#f0d060");
      textGrad.addColorStop(1, "#c49020");
      ctx.fillStyle = textGrad;
      ctx.fillText("Musetera", cx, cy + planetR + 22);
      ctx.shadowBlur = 0;
      ctx.restore();

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="flex justify-center animate-[float-cosmic_6s_ease-in-out_infinite]">
      <canvas
        ref={canvasRef}
        className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px]"
        style={{ imageRendering: "auto" }}
      />
    </div>
  );
}

function lighten(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `rgb(${r},${g},${b})`;
}

function darken(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - amt);
  const g = Math.max(0, ((n >> 8) & 0xff) - amt);
  const b = Math.max(0, (n & 0xff) - amt);
  return `rgb(${r},${g},${b})`;
}
