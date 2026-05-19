import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eraser, Upload, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialUrl?: string | null;
  onSave: (dataUrl: string) => Promise<void> | void;
  saving?: boolean;
}

export function SignaturePad({ initialUrl, onSave, saving }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);

  useEffect(() => { setPreview(initialUrl || null); }, [initialUrl]);

  const getCtx = () => canvasRef.current?.getContext("2d");

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    const ctx = getCtx();
    if (!ctx) return;
    const r = canvasRef.current!.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - r.left, e.clientY - r.top);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const r = canvasRef.current!.getBoundingClientRect();
    ctx.lineTo(e.clientX - r.left, e.clientY - r.top);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.stroke();
  };
  const end = () => { drawing.current = false; };

  const clear = () => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveDraw = async () => {
    const c = canvasRef.current;
    if (!c) return;
    const dataUrl = c.toDataURL("image/png");
    await onSave(dataUrl);
    setPreview(dataUrl);
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
      {preview && (
        <div className="rounded-lg border border-border bg-background/50 p-3 flex items-center justify-center">
          <img src={preview} alt="Assinatura" className="h-20 object-contain" />
        </div>
      )}
      <Tabs defaultValue="draw">
        <TabsList>
          <TabsTrigger value="draw">Desenhar</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="draw" className="space-y-2">
          <div className="rounded-lg border border-border bg-white">
            <canvas
              ref={canvasRef}
              width={520}
              height={160}
              className="w-full h-40 touch-none cursor-crosshair"
              onPointerDown={start}
              onPointerMove={move}
              onPointerUp={end}
              onPointerLeave={end}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clear} type="button">
              <Eraser className="h-4 w-4 mr-1" /> Limpar
            </Button>
            <Button size="sm" onClick={saveDraw} disabled={saving} type="button"
              className="bg-gradient-to-r from-primary to-amber-500 text-white">
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
