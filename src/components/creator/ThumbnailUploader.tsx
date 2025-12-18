import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { ImageCropper } from "@/components/ui/ImageCropper";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Loader2, Image as ImageIcon, X } from "lucide-react";

interface ThumbnailUploaderProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  courseId: string;
}

export function ThumbnailUploader({
  currentUrl,
  onUpload,
  courseId,
}: ThumbnailUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagem deve ter no máximo 5MB");
        return;
      }
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      setShowCropper(true);
    }
    // Reset input for same file selection
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setShowCropper(false);
    setIsUploading(true);

    try {
      const fileName = `${courseId}/${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from("course-thumbnails")
        .upload(fileName, croppedBlob, { 
          contentType: "image/jpeg",
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("course-thumbnails")
        .getPublicUrl(data.path);

      onUpload(urlData.publicUrl);
      toast.success("Thumbnail atualizada!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
      }
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }
  };

  const handleRemoveThumbnail = () => {
    onUpload("");
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
        {currentUrl ? (
          <>
            <img
              src={currentUrl}
              alt="Thumbnail do curso"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRemoveThumbnail}
              >
                <X className="h-4 w-4 mr-1" />
                Remover
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-2 opacity-30" />
            <p className="text-sm">Nenhuma imagem selecionada</p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Enviando...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {currentUrl ? "Trocar Imagem" : "Fazer Upload"}
          </>
        )}
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Cropper Modal */}
      {showCropper && previewImage && (
        <ImageCropper
          image={previewImage}
          aspectRatio={16 / 9}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}
    </div>
  );
}
