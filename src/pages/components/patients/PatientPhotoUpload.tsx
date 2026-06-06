import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PatientPhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  currentPhotoUrl?: string | null;
}

export function PatientPhotoUpload({ onPhotoUploaded, currentPhotoUrl }: PatientPhotoUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const uploadPhoto = async (file: Blob | File) => {
    try {
      setIsUploading(true);
      const ext = file.type === "image/png" ? "png" : "jpg";
      const contentType = file.type || "image/jpeg";
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
      const filePath = `patient-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("patients")
        .upload(filePath, file, { contentType, upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("patients")
        .getPublicUrl(filePath);

      onPhotoUploaded(publicUrl);
      toast({
        title: "Sucesso",
        description: "Foto enviada com sucesso.",
      });
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar a foto",
        description: error?.message || "Verifique sua conexão e tente novamente.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadPhoto(file);
      // Reset input value to allow selecting same file again
      event.target.value = '';
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

      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => cameraInputRef.current?.click()}>
          <Camera className="h-4 w-4 mr-2" /> Tirar Foto
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" /> Upload
        </Button>
        
        {/* Hidden input for Camera capture */}
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
          className="hidden"
        />

        {/* Hidden input for File upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
}
