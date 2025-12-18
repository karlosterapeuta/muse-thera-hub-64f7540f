import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Slider } from "./slider";
import { getCroppedImg } from "@/utils/cropImage";
import { Loader2 } from "lucide-react";

interface ImageCropperProps {
  image: string;
  aspectRatio?: number;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export function ImageCropper({
  image,
  aspectRatio = 16 / 9,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Recortar Imagem</DialogTitle>
        </DialogHeader>

        <div className="relative h-80 bg-black rounded-lg overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Zoom</label>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={([v]) => setZoom(v)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
