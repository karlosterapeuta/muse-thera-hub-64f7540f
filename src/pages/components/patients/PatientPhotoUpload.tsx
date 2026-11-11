import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { usePatientPhotoUrl } from "@/hooks/usePatientPhotoUrl";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

interface PatientPhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  currentPhotoUrl?: string | null;
  onUploadingChange?: (uploading: boolean) => void;
}

export function PatientPhotoUpload({ onPhotoUploaded, currentPhotoUrl, onUploadingChange }: PatientPhotoUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const previewUrl = usePatientPhotoUrl(currentPhotoUrl);

  const uploadPhoto = async (file: Blob | File) => {
    try {
      if (!PHOTO_TYPES.includes(file.type as typeof PHOTO_TYPES[number])) throw new Error("Envie uma foto JPEG, PNG ou WebP.");
      if (file.size > MAX_PHOTO_BYTES) throw new Error("A imagem deve ter no máximo 5 MB.");
      setIsUploading(true);
      onUploadingChange?.(true);

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) throw new Error("Sessão expirada. Faça login novamente.");

      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const contentType = file.type || "image/jpeg";
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
      // Store inside the owner's folder so storage RLS scopes access per user
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("patients")
        .upload(filePath, file, { contentType, upsert: false });

      if (uploadError) throw uploadError;

      // Store the storage path; display uses short-lived signed URLs
      onPhotoUploaded(filePath);
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
      onUploadingChange?.(false);
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
    <div className="flex flex-col items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-xl sm:rounded-2xl bg-muted/30">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-primary/20">
        {previewUrl ? (
          <img src={previewUrl} alt="Paciente" className="w-full h-full object-cover" />
        ) : (
          <div className="text-muted-foreground text-xs sm:text-sm text-center px-2">Sem foto</div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => cameraInputRef.current?.click()}
          disabled={isUploading}
          className="w-full sm:w-auto min-h-11 text-sm rounded-lg"
        >
          <Camera className="h-4 w-4 mr-2" /> Tirar Foto
        </Button>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full sm:w-auto min-h-11 text-sm rounded-lg"
        >
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
