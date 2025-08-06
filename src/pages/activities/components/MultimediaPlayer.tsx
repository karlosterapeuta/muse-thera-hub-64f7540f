import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MultimediaResource, TherapyPlaylist } from '../types/user-data';

interface MultimediaPlayerProps {
  resources: MultimediaResource[];
  playlist?: TherapyPlaylist;
  autoPlay?: boolean;
  showControls?: boolean;
}

export const MultimediaPlayer: React.FC<MultimediaPlayerProps> = ({
  resources,
  playlist,
  autoPlay = false,
  showControls = true
}) => {
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState([0]);
  const [isLooping, setIsLooping] = useState(false);

  const currentResource = resources[currentResourceIndex];

  const playNext = () => {
    if (currentResourceIndex < resources.length - 1) {
      setCurrentResourceIndex(currentResourceIndex + 1);
    } else if (isLooping) {
      setCurrentResourceIndex(0);
    }
  };

  const playPrevious = () => {
    if (currentResourceIndex > 0) {
      setCurrentResourceIndex(currentResourceIndex - 1);
    } else if (isLooping) {
      setCurrentResourceIndex(resources.length - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentResource) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Nenhum recurso multimídia disponível</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{currentResource.title}</CardTitle>
          <Badge variant="secondary">
            {currentResource.category}
          </Badge>
        </div>
        {currentResource.description && (
          <p className="text-sm text-muted-foreground">{currentResource.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Media Display */}
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {currentResource.type === 'audio' && (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-purple-600">
              <div className="text-center text-white">
                <Volume2 className="h-16 w-16 mx-auto mb-2" />
                <p className="text-lg font-medium">{currentResource.title}</p>
                {currentResource.duration && (
                  <p className="text-sm opacity-80">
                    Duração: {formatTime(currentResource.duration)}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {currentResource.type === 'video' && (
            <video
              src={currentResource.url}
              poster={currentResource.thumbnail}
              controls={showControls}
              className="w-full h-full object-cover"
            />
          )}
          
          {currentResource.type === 'image' && (
            <img
              src={currentResource.url}
              alt={currentResource.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Progress Bar */}
        {(currentResource.type === 'audio' || currentResource.type === 'video') && (
          <div className="space-y-2">
            <Slider
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime((progress[0] / 100) * (currentResource.duration || 0))}</span>
              <span>{formatTime(currentResource.duration || 0)}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        {showControls && (currentResource.type === 'audio' || currentResource.type === 'video') && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={playPrevious}
              disabled={currentResourceIndex === 0 && !isLooping}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={playNext}
              disabled={currentResourceIndex === resources.length - 1 && !isLooping}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-20"
              />
            </div>
            
            <Button
              variant={isLooping ? "default" : "outline"}
              size="sm"
              onClick={toggleLoop}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Playlist */}
        {resources.length > 1 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Playlist ({resources.length} itens)</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {resources.map((resource, index) => (
                <button
                  key={resource.id}
                  onClick={() => setCurrentResourceIndex(index)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    index === currentResourceIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{resource.title}</span>
                    <Badge variant="outline" className="ml-2 flex-shrink-0">
                      {resource.type}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {currentResource.tags && currentResource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {currentResource.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};