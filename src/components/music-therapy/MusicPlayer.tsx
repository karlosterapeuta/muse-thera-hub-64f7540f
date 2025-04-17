import { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, 
  VolumeX, Repeat, Heart, Upload, Music, Share2,
  Plus, ListMusic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Howl } from "howler";
import WaveSurfer from "wavesurfer.js";
import { useToast } from "@/hooks/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Song, Playlist } from "./types";

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  playlists: Playlist[];
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  toggleFavorite: (song: Song) => void;
}

export default function MusicPlayer({
  currentSong,
  isPlaying,
  setIsPlaying,
  playlists,
  addSongToPlaylist,
  toggleFavorite
}: MusicPlayerProps) {
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const howlRef = useRef<Howl | null>(null);
  const waveformRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  // Initialize WaveSurfer
  useEffect(() => {
    if (waveformContainerRef.current && !waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformContainerRef.current,
        waveColor: '#9ca3af',
        progressColor: '#8b5cf6',
        cursorColor: 'transparent',
        barWidth: 3,
        barRadius: 3,
        barGap: 2,
        height: 80,
      });
      
      waveformRef.current = wavesurfer;
    }
    
    return () => {
      if (waveformRef.current) {
        waveformRef.current.destroy();
        waveformRef.current = null;
      }
    };
  }, []);

  // Load and play song when currentSong changes
  useEffect(() => {
    if (!currentSong) return;
    
    setIsLoading(true);
    
    // Stop and unload previous song
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
    }
    
    // Create new Howl instance for the current song
    const sound = new Howl({
      src: [currentSong.audioUrl],
      html5: true,
      volume: isMuted ? 0 : volume,
      onload: () => {
        setDuration(sound.duration());
        setIsLoading(false);
        
        // Load waveform
        if (waveformRef.current) {
          waveformRef.current.load(currentSong.audioUrl);
        }
      },
      onplay: () => {
        setIsPlaying(true);
        
        // Start updating current time
        requestAnimationFrame(updateTime);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
      onend: () => {
        if (isRepeat) {
          sound.play();
        } else {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      },
      onloaderror: () => {
        setIsLoading(false);
        toast({
          title: "Erro ao carregar música",
          description: "Não foi possível carregar esta música. Tente outra.",
          variant: "destructive"
        });
      },
      onplayerror: () => {
        setIsLoading(false);
        toast({
          title: "Erro ao reproduzir música",
          description: "Não foi possível reproduzir esta música. Tente outra.",
          variant: "destructive"
        });
      }
    });
    
    howlRef.current = sound;
    
    // Play the song if isPlaying is true
    if (isPlaying) {
      sound.play();
    }
    
    return () => {
      sound.unload();
    };
  }, [currentSong, isPlaying, setIsPlaying, volume, isMuted, toast, isRepeat]);

  // Update time function for animation frame
  const updateTime = () => {
    if (howlRef.current && isPlaying) {
      const time = howlRef.current.seek();
      setCurrentTime(typeof time === 'number' ? time : 0);
      
      // Update waveform progress
      if (waveformRef.current) {
        waveformRef.current.seekTo(currentTime / duration);
      }
      
      requestAnimationFrame(updateTime);
    }
  };

  // Update volume when volume or mute state changes
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    if (!currentSong) return;
    
    if (!howlRef.current) return;
    
    if (isPlaying) {
      howlRef.current.pause();
    } else {
      howlRef.current.play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleRepeatMode = () => {
    setIsRepeat(!isRepeat);
    
    toast({
      title: isRepeat ? "Repetição desativada" : "Repetição ativada",
      description: isRepeat ? "A música não será repetida" : "A música será repetida automaticamente",
      variant: "default"
    });
  };

  const handleSeek = (value: number[]) => {
    if (!howlRef.current || !duration) return;
    
    const seekTime = value[0];
    howlRef.current.seek(seekTime);
    setCurrentTime(seekTime);
    
    // Update waveform position
    if (waveformRef.current) {
      waveformRef.current.seekTo(seekTime / duration);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      // Create object URL for the file
      const url = URL.createObjectURL(file);
      
      // Create a new song object
      const newSong: Song = {
        id: `local-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        artist: "Arquivo Local",
        audioUrl: url,
        source: 'local',
        isFavorite: false
      };
      
      // Add to library playlist
      addSongToPlaylist('library', newSong);
      
      toast({
        title: "Arquivo carregado",
        description: `"${newSong.title}" foi adicionado à biblioteca",
        variant: "default"
      });
    };
    input.click();
  };

  const formatTime = (time: number) => {
    if (!time) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {currentSong ? (
          <>
            <div className="w-full max-w-sm bg-white p-4 rounded-xl shadow-lg text-center mb-4">
              {currentSong.thumbnailUrl ? (
                <img 
                  src={currentSong.thumbnailUrl} 
                  alt={currentSong.title} 
                  className="w-48 h-48 mx-auto mb-4 rounded-lg object-cover shadow-md"
                  aria-label={`Capa do álbum: ${currentSong.title} por ${currentSong.artist}`}
                />
              ) : (
                <div className="w-48 h-48 mx-auto mb-4 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                  <Music size={64} className="text-white" />
                </div>
              )}
              
              <h2 
                className="text-2xl font-bold text-purple-700 truncate"
                aria-label={`Título da música: ${currentSong.title}`}
              >
                {currentSong.title}
              </h2>
              <p 
                className="text-lg text-gray-600 mb-2"
                aria-label={`Artista: ${currentSong.artist}`}
              >
                {currentSong.artist}
              </p>
              
              <div className="flex justify-center space-x-2 mt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`rounded-full ${currentSong.isFavorite ? 'bg-red-100 text-red-500' : 'text-gray-500'}`}
                        onClick={() => toggleFavorite(currentSong)}
                        aria-label={currentSong.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <Heart fill={currentSong.isFavorite ? "currentColor" : "none"} size={20} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {currentSong.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full text-gray-500"
                            aria-label="Adicionar à playlist"
                          >
                            <Plus size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {playlists.map((playlist) => (
                            <DropdownMenuItem 
                              key={playlist.id} 
                              onClick={() => addSongToPlaylist(playlist.id, currentSong)}
                            >
                              <ListMusic className="mr-2 h-4 w-4" />
                              <span>{playlist.name}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent>
                      Adicionar à playlist
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full text-gray-500"
                        onClick={toggleRepeatMode}
                        aria-label={isRepeat ? "Desativar repetição" : "Ativar repetição"}
                      >
                        <Repeat size={20} className={isRepeat ? "text-purple-500" : ""} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isRepeat ? "Desativar repetição" : "Ativar repetição"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full text-gray-500"
                        onClick={handleUpload}
                        aria-label="Fazer upload de música"
                      >
                        <Upload size={20} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Fazer upload de música
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div 
              ref={waveformContainerRef} 
              className="w-full bg-white p-4 rounded-lg shadow-sm mb-2"
              aria-label="Visualização da onda sonora"
            ></div>
            
            <div className="flex items-center w-full space-x-2 mb-2">
              <span className="text-sm w-10 text-right text-gray-500" aria-label={`Tempo decorrido: ${formatTime(currentTime)}`}>
                {formatTime(currentTime)}
              </span>
              <div className="flex-1">
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="cursor-pointer"
                  aria-label="Barra de progresso"
                />
              </div>
              <span className="text-sm w-10 text-gray-500" aria-label={`Duração total: ${formatTime(duration)}`}>
                {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex justify-center items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white shadow-md text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                      onClick={toggleMute}
                      aria-label={isMuted ? "Ativar som" : "Silenciar"}
                    >
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isMuted ? "Ativar som" : "Silenciar"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white shadow-md text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                      aria-label="Música anterior"
                      disabled={true} // Will be implemented with queue functionality
                    >
                      <SkipBack size={24} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Música anterior
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="icon"
                      onClick={togglePlayPause}
                      className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg hover:from-purple-600 hover:to-indigo-700"
                      disabled={isLoading}
                      aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                    >
                      {isLoading ? (
                        <div className="animate-spin h-6 w-6 border-4 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                      ) : isPlaying ? (
                        <Pause size={30} className="text-white" />
                      ) : (
                        <Play size={30} className="text-white ml-1" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPlaying ? "Pausar" : "Reproduzir"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-white shadow-md text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                      aria-label="Próxima música"
                      disabled={true} // Will be implemented with queue functionality
                    >
                      <SkipForward size={24} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Próxima música
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="w-24 hidden md:block">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                  aria-label="Controle de volume"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-8 bg-white rounded-xl shadow-md">
            <Music size={64} className="mx-auto text-purple-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Nenhuma música selecionada</h2>
            <p className="text-gray-500 mb-4">Escolha uma música da biblioteca ou faça upload</p>
            <Button 
              onClick={handleUpload}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              <Upload className="mr-2" size={18} />
              Fazer upload de música
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
