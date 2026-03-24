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

    let time = 0;
    const animate = () => {
      time += 0.016;
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

        // Glow for bigger stars
        if (s.size > 1.2) {
          ctx.fillStyle = `hsla(${hue}, 70%, 85%, ${twinkle * 0.12})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

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
