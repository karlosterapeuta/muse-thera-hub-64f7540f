import { useEffect, useRef } from "react";

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

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

    // Generate stars
    const stars: { x: number; y: number; size: number; speed: number; brightness: number }[] = [];
    for (let i = 0; i < 250; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.3,
        speed: Math.random() * 2 + 0.5,
        brightness: Math.random(),
      });
    }

    // Shooting stars
    interface ShootingStar {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; size: number; active: boolean;
    }
    const shootingStars: ShootingStar[] = [];
    const createShootingStar = (): ShootingStar => {
      const angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.3;
      const speed = 4 + Math.random() * 6;
      return {
        x: Math.random() * canvas.width * 1.2 - canvas.width * 0.1,
        y: -10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 40 + Math.random() * 40,
        size: 1 + Math.random() * 1.5,
        active: true,
      };
    };

    let time = 0;
    let nextShootingAt = 60 + Math.random() * 120;
    let frameCount = 0;

    const animate = () => {
      time += 0.016;
      frameCount++;
      const w = canvas.width;
      const h = canvas.height;

      // Deep space gradient
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
      bg.addColorStop(0, "#0f1040");
      bg.addColorStop(0.3, "#0a0d35");
      bg.addColorStop(0.6, "#08082a");
      bg.addColorStop(1, "#040418");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Subtle nebula
      ctx.save();
      ctx.globalAlpha = 0.08 + Math.sin(time * 0.2) * 0.02;
      const n1 = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, w * 0.4);
      n1.addColorStop(0, "#7c3aed");
      n1.addColorStop(0.5, "#4c1d95");
      n1.addColorStop(1, "transparent");
      ctx.fillStyle = n1;
      ctx.fillRect(0, 0, w, h);

      ctx.globalAlpha = 0.06;
      const n2 = ctx.createRadialGradient(w * 0.7, h * 0.7, 0, w * 0.7, h * 0.7, w * 0.35);
      n2.addColorStop(0, "#2563eb");
      n2.addColorStop(0.5, "#1e3a5f");
      n2.addColorStop(1, "transparent");
      ctx.fillStyle = n2;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Stars with twinkling
      stars.forEach((s) => {
        const twinkle = Math.sin(time * s.speed + s.brightness * 10) * 0.4 + 0.6;
        const hue = 220 + (s.brightness * 40);

        ctx.fillStyle = `hsla(${hue}, 70%, 85%, ${twinkle * 0.8})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        if (s.size > 1.2) {
          ctx.fillStyle = `hsla(${hue}, 70%, 85%, ${twinkle * 0.12})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Spawn shooting stars
      if (frameCount >= nextShootingAt) {
        shootingStars.push(createShootingStar());
        nextShootingAt = frameCount + 80 + Math.random() * 200;
      }

      // Draw shooting stars
      shootingStars.forEach((ss) => {
        if (!ss.active) return;
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;

        if (ss.life > ss.maxLife || ss.x > w + 50 || ss.y > h + 50) {
          ss.active = false;
          return;
        }

        const alpha = Math.sin((ss.life / ss.maxLife) * Math.PI);
        const tailLen = 25 + ss.size * 10;

        // Tail gradient
        const tailX = ss.x - (ss.vx / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * tailLen;
        const tailY = ss.y - (ss.vy / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * tailLen;
        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.6, `rgba(200,210,255,${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(255,255,255,${alpha * 0.9})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = ss.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        // Head glow
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Cleanup inactive
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        if (!shootingStars[i].active) shootingStars.splice(i, 1);
      }

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
