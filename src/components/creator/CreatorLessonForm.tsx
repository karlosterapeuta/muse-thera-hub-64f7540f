import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, AlertCircle, Video, Eye } from "lucide-react";
import { getYouTubeId, getYouTubeThumbnail } from "@/utils/youtubeUtils";
import { cn } from "@/lib/utils";

interface CreatorLessonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: {
    id: string;
    title: string;
    description: string | null;
    youtube_url: string;
    duration_minutes: number | null;
    is_free_preview: boolean;
  } | null;
  onSubmit: (data: {
    title: string;
    youtube_url: string;
    description?: string;
    duration_minutes?: number;
    is_free_preview?: boolean;
  }) => void;
}

export function CreatorLessonForm({
  open,
  onOpenChange,
  lesson,
  onSubmit,
}: CreatorLessonFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    youtube_url: "",
    description: "",
    duration_minutes: 0,
    is_free_preview: false,
  });
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  // Reset form when dialog opens/closes or lesson changes
  useEffect(() => {
    if (open && lesson) {
      setFormData({
        title: lesson.title,
        youtube_url: lesson.youtube_url,
        description: lesson.description || "",
        duration_minutes: lesson.duration_minutes || 0,
        is_free_preview: lesson.is_free_preview,
      });
      validateUrl(lesson.youtube_url);
    } else if (open && !lesson) {
      setFormData({
        title: "",
        youtube_url: "",
        description: "",
        duration_minutes: 0,
        is_free_preview: false,
      });
      setIsValid(null);
      setThumbnail(null);
    }
  }, [open, lesson]);

  const validateUrl = async (url: string) => {
    if (!url) {
      setIsValid(null);
      setThumbnail(null);
      return;
    }

    setIsValidating(true);
    const videoId = getYouTubeId(url);

    if (videoId) {
      setIsValid(true);
      setThumbnail(getYouTubeThumbnail(videoId));
      
      // Try to get video info via oEmbed (duration not available this way, but title is)
      try {
        const response = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );
        if (response.ok) {
          const data = await response.json();
          // Only update title if empty
          if (!formData.title && data.title) {
            setFormData((prev) => ({ ...prev, title: data.title }));
          }
        }
      } catch (error) {
        // Ignore - just means we can't get metadata
      }
    } else {
      setIsValid(false);
      setThumbnail(null);
    }

    setIsValidating(false);
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, youtube_url: url });
    validateUrl(url);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !isValid) return;

    onSubmit({
      title: formData.title,
      youtube_url: formData.youtube_url,
      description: formData.description || undefined,
      duration_minutes: formData.duration_minutes || undefined,
      is_free_preview: formData.is_free_preview,
    });
  };

  const isEditing = !!lesson;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {isEditing ? "Editar Aula" : "Nova Aula"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da aula"
              : "Adicione uma nova aula com vídeo do YouTube"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* YouTube URL */}
          <div className="space-y-2">
            <Label>Link do YouTube (não listado) *</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.youtube_url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className={cn(
                  isValid === true && "border-emerald-500 focus-visible:ring-emerald-500",
                  isValid === false && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {isValidating && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
              {!isValidating && isValid === true && (
                <Check className="h-5 w-5 text-emerald-500" />
              )}
              {!isValidating && isValid === false && (
                <AlertCircle className="h-5 w-5 text-destructive" />
              )}
            </div>
            {isValid === false && (
              <p className="text-sm text-destructive">URL inválida do YouTube</p>
            )}
            {isValid === true && (
              <p className="text-sm text-emerald-600">✓ Vídeo encontrado</p>
            )}
          </div>

          {/* Thumbnail Preview */}
          {thumbnail && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={thumbnail}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                  <Video className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label>Título da Aula *</Label>
            <Input
              placeholder="Ex: Introdução à Musicoterapia"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Descrição (opcional)</Label>
            <Textarea
              placeholder="Descreva o conteúdo desta aula..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Duração (minutos)</Label>
            <Input
              type="number"
              placeholder="Ex: 15"
              value={formData.duration_minutes || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration_minutes: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          {/* Free Preview Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview Gratuito
              </Label>
              <p className="text-sm text-muted-foreground">
                Permitir que não-compradores assistam esta aula
              </p>
            </div>
            <Switch
              checked={formData.is_free_preview}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_free_preview: checked })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.title.trim() || !isValid}
          >
            {isEditing ? "Salvar Alterações" : "Adicionar Aula"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
