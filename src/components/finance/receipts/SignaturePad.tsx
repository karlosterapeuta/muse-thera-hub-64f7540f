import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eraser, Upload, Check, Undo2, PenLine } from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialUrl?: string | null;
  onSave: (dataUrl: string) => Promise<void> | void;
  saving?: boolean;
}

type Stroke = { x: number; y: number; p: number }[];

export function SignaturePad({ initialUrl, onSave, saving }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number; t: number } | null>(null);
  const lastWidth = useRef<number>(2.2);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStroke = useRef<Stroke>([]);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);
  const [hasInk, setHasInk] = useState(false);
  const [penColor, setPenColor] = useState<string>("#0f172a");
  const [penSize, setPenSize] = useState<number>(2.6);

  useEffect(() => { setPreview(initialUrl || null); }, [initialUrl]);

  const paintWhite = useCallback(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.restore();
  }, []);

  // Setup high-DPI canvas + responsive resize
  const setupCanvas = useCallback(() => {
    const c = canvasRef.current;
    const wrap = wrapRef.current;
    if (!c || !wrap) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(280, Math.floor(rect.width));
    const h = 200;
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = `${w}px`;
    c.style.height = `${h}px`;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintWhite();
    // redraw strokes
    redrawAll();
  }, [paintWhite]);

  useEffect(() => {
    setupCanvas();
    const onResize = () => setupCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.length === 0) return;
    ctx.strokeStyle = penColor;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (stroke.length === 1) {
      const p = stroke[0];
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, p.p / 2), 0, Math.PI * 2);
      ctx.fillStyle = penColor;
      ctx.fill();
      return;
    }
    for (let i = 1; i < stroke.length; i++) {
      const a = stroke[i - 1];
      const b = stroke[i];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      ctx.lineWidth = (a.p + b.p) / 2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(a.x, a.y, mid.x, mid.y);
      ctx.stroke();
    }
  };

  const redrawAll = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    paintWhite();
    for (const s of strokesRef.current) drawStroke(ctx, s);
  };

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    drawing.current = true;
    const { x, y } = getPos(e);
    lastPoint.current = { x, y, t: performance.now() };
    lastWidth.current = penSize;
    currentStroke.current = [{ x, y, p: penSize }];
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    const now = performance.now();
    const prev = lastPoint.current!;
    const dx = x - prev.x;
    const dy = y - prev.y;
    const dist = Math.hypot(dx, dy);
    const dt = Math.max(1, now - prev.t);
    const speed = dist / dt; // px/ms
    // Pressure: stylus uses real pressure, otherwise derive from speed
    const rawPressure = e.pressure && e.pressure > 0 && e.pointerType === "pen"
      ? e.pressure
      : Math.max(0.25, Math.min(1, 1 - speed * 0.6));
    const target = penSize * (0.55 + rawPressure * 0.9);
    // smooth width changes
    const width = lastWidth.current + (target - lastWidth.current) * 0.35;
    lastWidth.current = width;

    const point = { x, y, p: width };
    currentStroke.current.push(point);

    // incremental draw of the last segment
    const stroke = currentStroke.current;
    if (stroke.length >= 2) {
      const a = stroke[stroke.length - 2];
      const b = stroke[stroke.length - 1];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      ctx.strokeStyle = penColor;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = (a.p + b.p) / 2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(a.x, a.y, mid.x, mid.y);
      ctx.stroke();
    }

    lastPoint.current = { x, y, t: now };
    if (!hasInk) setHasInk(true);
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (currentStroke.current.length > 0) {
      strokesRef.current.push(currentStroke.current);
      currentStroke.current = [];
    }
  };

  const clear = () => {
    strokesRef.current = [];
    currentStroke.current = [];
    paintWhite();
    setHasInk(false);
  };

  const undo = () => {
    if (strokesRef.current.length === 0) return;
    strokesRef.current.pop();
    redrawAll();
    if (strokesRef.current.length === 0) setHasInk(false);
  };

  // Export trimmed PNG (crop to ink bounds + padding) for crisp preview
  const exportPng = (): string | null => {
    const c = canvasRef.current;
    if (!c) return null;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    const dpr = window.devicePixelRatio || 1;
    const w = c.width, h = c.height;
    const img = ctx.getImageData(0, 0, w, h).data;
    let minX = w, minY = h, maxX = 0, maxY = 0, found = false;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const r = img[i], g = img[i + 1], b = img[i + 2];
        // anything darker than near-white counts as ink
        if (r < 245 || g < 245 || b < 245) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
          found = true;
        }
      }
    }
    if (!found) return c.toDataURL("image/png");
    const pad = Math.round(12 * dpr);
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(w - 1, maxX + pad);
    maxY = Math.min(h - 1, maxY + pad);
    const cw = maxX - minX + 1;
    const ch = maxY - minY + 1;
    const out = document.createElement("canvas");
    out.width = cw;
    out.height = ch;
    const octx = out.getContext("2d")!;
    octx.fillStyle = "#ffffff";
    octx.fillRect(0, 0, cw, ch);
    octx.drawImage(c, minX, minY, cw, ch, 0, 0, cw, ch);
    return out.toDataURL("image/png");
  };

  const saveDraw = async () => {
    if (!hasInk) { toast.error("Desenhe sua assinatura antes de salvar"); return; }
    const dataUrl = exportPng();
    if (!dataUrl) return;
    setPreview(dataUrl);
    await onSave(dataUrl);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Envie uma imagem PNG/JPG"); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result);
      await onSave(dataUrl);
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-white p-3 flex items-center justify-center min-h-[110px]">
        {preview ? (
          <img src={preview} alt="Assinatura" className="h-20 object-contain" />
        ) : (
          <span className="text-xs text-muted-foreground">Sua assinatura salva aparecerá aqui</span>
        )}
      </div>
      <Tabs defaultValue="draw">
        <TabsList>
          <TabsTrigger value="draw"><PenLine className="h-4 w-4 mr-1" /> Desenhar</TabsTrigger>
          <TabsTrigger value="upload"><Upload className="h-4 w-4 mr-1" /> Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="draw" className="space-y-2">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Cor</span>
              {[
                { v: "#0f172a", label: "Preto" },
                { v: "#1d4ed8", label: "Azul" },
                { v: "#b91c1c", label: "Vermelho" },
              ].map((c) => (
                <button
                  key={c.v}
                  type="button"
                  aria-label={c.label}
                  onClick={() => setPenColor(c.v)}
                  className={`h-6 w-6 rounded-full border-2 transition ${penColor === c.v ? "border-primary ring-2 ring-primary/30 scale-110" : "border-border"}`}
                  style={{ backgroundColor: c.v }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Espessura</span>
              <input
                type="range"
                min={1.5}
                max={5}
                step={0.1}
                value={penSize}
                onChange={(e) => setPenSize(parseFloat(e.target.value))}
                className="w-28 accent-primary"
              />
            </div>
          </div>

          <div
            ref={wrapRef}
            className="relative rounded-lg border-2 border-dashed border-border bg-white overflow-hidden shadow-inner"
            style={{ backgroundImage: "linear-gradient(to right, transparent 0, transparent calc(100% - 1px), hsl(var(--border) / 0.5) 100%)" }}
          >
            <canvas
              ref={canvasRef}
              className="block w-full touch-none cursor-crosshair select-none"
              style={{ height: 200 }}
              onPointerDown={start}
              onPointerMove={move}
              onPointerUp={end}
              onPointerCancel={end}
              onPointerLeave={end}
            />
            {/* Baseline + "x" mark */}
            <div className="pointer-events-none absolute left-0 right-0 bottom-10 border-t border-dashed border-muted-foreground/30" />
            <div className="pointer-events-none absolute left-4 bottom-9 text-muted-foreground/60 text-lg font-serif">×</div>
            {!hasInk && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-muted-foreground/70">Assine aqui usando o mouse, dedo ou caneta</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={undo} type="button" disabled={strokesRef.current.length === 0}>
              <Undo2 className="h-4 w-4 mr-1" /> Desfazer
            </Button>
            <Button variant="outline" size="sm" onClick={clear} type="button">
              <Eraser className="h-4 w-4 mr-1" /> Limpar
            </Button>
            <Button size="sm" onClick={saveDraw} disabled={saving} type="button"
              className="bg-gradient-to-r from-primary to-amber-500 text-white ml-auto">
              <Check className="h-4 w-4 mr-1" /> Salvar assinatura
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="upload">
          <label className="flex flex-col items-center justify-center h-40 rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary/50 transition">
            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Clique para enviar PNG/JPG</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </TabsContent>
      </Tabs>
    </div>
  );
}
