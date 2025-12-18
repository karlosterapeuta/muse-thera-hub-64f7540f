import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getYouTubeId } from "@/utils/youtubeUtils";

interface MuseTeraPlayerProps {
  videoUrl: string;
  title?: string;
  onComplete?: () => void;
  autoPlay?: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function MuseTeraPlayer({ 
  videoUrl, 
  title,
  onComplete,
  autoPlay = false 
}: MuseTeraPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isApiReady, setIsApiReady] = useState(false);
  
  const videoId = getYouTubeId(videoUrl);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsApiReady(true);
    };

    return () => {
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    if (!isApiReady || !videoId) return;

    const playerId = `musetera-player-${videoId}`;
    
    // Create container for player
    const container = document.getElementById(playerId);
    if (!container) return;

    playerRef.current = new window.YT.Player(playerId, {
      videoId,
      playerVars: {
        autoplay: autoPlay ? 1 : 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: (event: any) => {
          setIsLoading(false);
          setDuration(event.target.getDuration());
          if (autoPlay) {
            event.target.playVideo();
          }
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            startProgressTracking();
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            stopProgressTracking();
          } else if (event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            stopProgressTracking();
            onComplete?.();
          }
        },
      },
    });

    return () => {
      stopProgressTracking();
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [isApiReady, videoId, autoPlay, onComplete]);

  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) return;
    
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  }, [isMuted, volume]);

  const handleVolumeChange = useCallback((value: number[]) => {
    if (!playerRef.current) return;
    
    const newVolume = value[0];
    setVolume(newVolume);
    playerRef.current.setVolume(newVolume);
    
    if (newVolume === 0) {
      playerRef.current.mute();
      setIsMuted(true);
    } else if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    }
  }, [isMuted]);

  const handleSeek = useCallback((value: number[]) => {
    if (!playerRef.current) return;
    
    const seekTime = value[0];
    playerRef.current.seekTo(seekTime, true);
    setCurrentTime(seekTime);
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    if (!playerRef.current) return;
    
    playerRef.current.setPlaybackRate(speed);
    setPlaybackSpeed(speed);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  // Prevent right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  if (!videoId) {
    return (
      <div className="relative aspect-video bg-black rounded-xl flex items-center justify-center text-white">
        <p>URL de vídeo inválida</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video bg-black rounded-xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={handleContextMenu}
    >
      {/* YouTube Player Container */}
      <div 
        id={`musetera-player-${videoId}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Invisible Overlay to capture clicks */}
      <div 
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={togglePlay}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="text-white text-sm">Carregando...</span>
          </div>
        </div>
      )}

      {/* Play/Pause Center Button */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <Button
            size="lg"
            className="w-20 h-20 rounded-full bg-primary/90 hover:bg-primary hover:scale-110 transition-all shadow-2xl"
            onClick={togglePlay}
          >
            <Play className="h-10 w-10 ml-1" />
          </Button>
        </div>
      )}

      {/* MuseTera Watermark */}
      <div className="absolute top-4 right-4 z-20 opacity-60">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
          <img 
            src="/lovable-uploads/musetera-logo-new.png" 
            alt="MuseTera" 
            className="w-6 h-6 rounded-full"
          />
          <span className="text-white text-xs font-medium">MuseTera</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity duration-300",
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between mt-1 text-xs text-white/70">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-200">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Title */}
            {title && (
              <span className="text-white text-sm font-medium ml-4 truncate max-w-[200px] hidden sm:block">
                {title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 gap-1"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-xs">{playbackSpeed}x</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
                {PLAYBACK_SPEEDS.map((speed) => (
                  <DropdownMenuItem
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={cn(
                      "text-white hover:bg-white/20 cursor-pointer",
                      playbackSpeed === speed && "bg-primary/30"
                    )}
                  >
                    {speed}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen */}
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
