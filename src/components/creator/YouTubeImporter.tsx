import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Youtube,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  GripVertical,
} from "lucide-react";
import { getYouTubeId, getYouTubeThumbnail } from "@/utils/youtubeUtils";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableVideoItem } from "./SortableVideoItem";

export interface ImportedVideo {
  url: string;
  videoId: string;
  title: string;
  thumbnail: string;
  isValid: boolean;
  isLoading: boolean;
}

interface YouTubeImporterProps {
  videos: ImportedVideo[];
  onVideosChange: (videos: ImportedVideo[]) => void;
  createModule: boolean;
  onCreateModuleChange: (value: boolean) => void;
  moduleName: string;
  onModuleNameChange: (value: string) => void;
}

export function YouTubeImporter({
  videos,
  onVideosChange,
  createModule,
  onCreateModuleChange,
  moduleName,
  onModuleNameChange,
}: YouTubeImporterProps) {
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = videos.findIndex((v) => v.videoId === active.id);
      const newIndex = videos.findIndex((v) => v.videoId === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onVideosChange(arrayMove(videos, oldIndex, newIndex));
      }
    }
  };

  const fetchVideoTitle = async (videoId: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (response.ok) {
        const data = await response.json();
        return data.title || `Aula ${videos.length + 1}`;
      }
    } catch (error) {
      console.log("Could not fetch video title");
    }
    return `Aula ${videos.length + 1}`;
  };

  const processLinks = useCallback(async () => {
    if (!inputValue.trim()) return;

    setIsProcessing(true);
    const lines = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const newVideos: ImportedVideo[] = [];

    for (const url of lines) {
      const videoId = getYouTubeId(url);

      if (videoId) {
        // Check if already exists
        const exists = videos.some((v) => v.videoId === videoId);
        if (exists) continue;

        const tempVideo: ImportedVideo = {
          url,
          videoId,
          title: "",
          thumbnail: getYouTubeThumbnail(videoId, "high"),
          isValid: true,
          isLoading: true,
        };

        newVideos.push(tempVideo);
      } else {
        newVideos.push({
          url,
          videoId: "",
          title: "URL inválida",
          thumbnail: "",
          isValid: false,
          isLoading: false,
        });
      }
    }

    // Add to list immediately
    const combinedVideos = [...videos, ...newVideos];
    onVideosChange(combinedVideos);
    setInputValue("");

    // Fetch titles asynchronously
    const updatedCombined = [...combinedVideos];
    for (let i = 0; i < newVideos.length; i++) {
      const video = newVideos[i];
      if (video.isValid && video.videoId) {
        const title = await fetchVideoTitle(video.videoId);
        const index = videos.length + i;
        
        if (updatedCombined[index]) {
          updatedCombined[index] = {
            ...updatedCombined[index],
            title,
            isLoading: false,
          };
          onVideosChange([...updatedCombined]);
        }
      }
    }

    setIsProcessing(false);
  }, [inputValue, videos, onVideosChange]);

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    onVideosChange(newVideos);
  };

  const updateVideoTitle = (index: number, title: string) => {
    const newVideos = [...videos];
    newVideos[index] = { ...newVideos[index], title };
    onVideosChange(newVideos);
  };

  const validVideos = videos.filter((v) => v.isValid);
  const invalidVideos = videos.filter((v) => !v.isValid);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Youtube className="h-4 w-4 text-red-500" />
        Importar Vídeos do YouTube
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Cole os links dos vídeos do YouTube (um por linha)&#10;&#10;Exemplo:&#10;https://youtube.com/watch?v=xxx&#10;https://youtu.be/yyy"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          rows={4}
          className="font-mono text-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={processLinks}
          disabled={!inputValue.trim() || isProcessing}
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Youtube className="h-4 w-4" />
              Adicionar Vídeos
            </>
          )}
        </Button>
      </div>

      {/* Status */}
      {videos.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {validVideos.length > 0 && (
            <Badge variant="default" className="gap-1 bg-green-600">
              <CheckCircle2 className="h-3 w-3" />
              {validVideos.length} válido{validVideos.length > 1 ? "s" : ""}
            </Badge>
          )}
          {invalidVideos.length > 0 && (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" />
              {invalidVideos.length} inválido{invalidVideos.length > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      )}

      {/* Video List with Drag and Drop */}
      {validVideos.length > 0 && (
        <div className="space-y-2">
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Vídeos para importar:</div>
            <span className="text-xs text-muted-foreground">
              Arraste para reordenar
            </span>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={validVideos.map((v) => v.videoId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {validVideos.map((video, index) => {
                  const realIndex = videos.findIndex((v) => v.videoId === video.videoId);
                  return (
                    <SortableVideoItem key={video.videoId} id={video.videoId}>
                      {({ listeners, isDragging }) => (
                        <div
                          className={cn(
                            "flex items-start gap-3 p-2 rounded-lg border bg-card transition-colors",
                            isDragging && "border-primary shadow-lg"
                          )}
                        >
                          {/* Drag Handle */}
                          <div
                            {...listeners}
                            className="flex items-center gap-1 text-muted-foreground pt-1 cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4" />
                            <span className="text-xs font-mono w-4">{index + 1}</span>
                          </div>
                          
                          {/* Thumbnail */}
                          <div className="w-24 h-14 rounded overflow-hidden flex-shrink-0 bg-muted">
                            {video.thumbnail && (
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-1">
                            {video.isLoading ? (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Carregando título...
                              </div>
                            ) : (
                              <Input
                                value={video.title}
                                onChange={(e) => updateVideoTitle(realIndex, e.target.value)}
                                className="h-7 text-sm"
                                placeholder="Título da aula"
                              />
                            )}
                            <p className="text-xs text-muted-foreground truncate">
                              {video.url}
                            </p>
                          </div>

                          {/* Remove */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVideo(realIndex)}
                            className="text-destructive hover:text-destructive h-7 w-7 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </SortableVideoItem>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Create Module Option */}
      {validVideos.length > 0 && (
        <div className="space-y-3 pt-2">
          <Separator />
          <div className="flex items-start space-x-3">
            <Checkbox
              id="create-module"
              checked={createModule}
              onCheckedChange={(checked) => onCreateModuleChange(checked === true)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <label
                htmlFor="create-module"
                className="text-sm font-medium cursor-pointer"
              >
                Criar módulo com as aulas importadas
              </label>
              <p className="text-xs text-muted-foreground">
                Um módulo será criado automaticamente contendo todas as aulas
              </p>
            </div>
          </div>

          {createModule && (
            <div className="pl-6 space-y-2">
              <label className="text-sm font-medium">Nome do Módulo</label>
              <Input
                value={moduleName}
                onChange={(e) => onModuleNameChange(e.target.value)}
                placeholder="Ex: Módulo 1 - Introdução"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
