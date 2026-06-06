
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PatientPhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  currentPhotoUrl?: string | null;
}

export function PatientPhotoUpload({ onPhotoUploaded, currentPhotoUrl }: PatientPhotoUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({
        variant: "destructive",
        title: "Câmera indisponível",
        description: "Seu navegador não suporta acesso à câmera. Use o botão Upload.",
      });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      let description = "Não foi possível acessar a câmera.";
      if (err?.name === "NotAllowedError") {
        description = "Permissão negada. Autorize o acesso à câmera nas configurações do navegador.";
      } else if (err?.name === "NotFoundError") {
        description = "Nenhuma câmera foi encontrada neste dispositivo.";
      } else if (err?.name === "NotReadableError") {
        description = "A câmera está sendo usada por outro aplicativo.";
      }
      toast({ variant: "destructive", title: "Erro", description });
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        
        // Convert dataUrl to Blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        uploadPhoto(blob);
        stopCamera();
      }
    }
  };

  const uploadPhoto = async (file: Blob | File) => {
    try {
      setIsUploading(true);
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.jpg`;
      const filePath = `patient-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("patients")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("patients")
        .getPublicUrl(filePath);

      onPhotoUploaded(publicUrl);
      toast({
        title: "Sucesso",
        description: "Foto enviada com sucesso.",
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao enviar a foto.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadPhoto(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-xl bg-muted/30">
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-primary/20">
        {currentPhotoUrl ? (
          <img src={currentPhotoUrl} alt="Paciente" className="w-full h-full object-cover" />
        ) : (
          <div className="text-muted-foreground text-xs text-center px-2">Sem foto</div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {isCameraActive ? (
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-64 aspect-video bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={capturePhoto} className="bg-primary hover:bg-primary/90">
              <Check className="h-4 w-4 mr-2" /> Capturar
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={stopCamera}>
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={startCamera}>
            <Camera className="h-4 w-4 mr-2" /> Tirar Foto
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
