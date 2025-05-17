import { useState, useEffect, useRef } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { fabric } from "fabric";
import { 
  Play, Pause, Save, Download, RotateCcw, Plus, Square, Circle, Triangle,
  Volume, VolumeX, Hand, Footprints, MicOff
} from "lucide-react";
import { MusicPlaylist, Song, songLibrary } from "./components/MusicPlaylist";

type InstrumentType = {
  id: string;
  name: string;
  shape: "circle" | "square" | "triangle" | "star" | "diamond" | "hand" | "footprints" | "silence"; 
  color: string;
};

type TimelineEvent = {
  id: string;
  instrumentId: string;
  position: number; // Position in timeline (0-100)
};

const defaultInstruments: InstrumentType[] = [
  { id: "ukulele", name: "Ukulele", shape: "square", color: "#FF5252" },
  { id: "triangle", name: "Triângulo", shape: "triangle", color: "#7E69AB" },
  { id: "drum", name: "Tambor", shape: "circle", color: "#1E88E5" },
  { id: "tambourine", name: "Pandeiro", shape: "circle", color: "#FFFFFF" },
  { id: "rattle", name: "Chocalho", shape: "square", color: "#FFC107" },
  { id: "hands", name: "Palmas", shape: "hand", color: "#FF9800" },
  { id: "feet", name: "Pés", shape: "footprints", color: "#4CAF50" },
  { id: "silence", name: "Silêncio", shape: "silence", color: "#E91E63" }
];

// Ultimate fallback URL that should work in most browsers
const ULTIMATE_FALLBACK_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3";

export default function MusicogramPage() {
  const [instruments, setInstruments] = useState<InstrumentType[]>(defaultInstruments);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const [tempo, setTempo] = useState(60); // BPM
  
  // Audio Player State
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const animationRef = useRef<number | null>(null);
  const canvasInitializedRef = useRef(false);
  
  // Initialize the canvas
  useEffect(() => {
    // Only initialize the canvas if it hasn't been initialized yet and the ref exists
    if (!canvasInitializedRef.current && canvasRef.current) {
      try {
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 800,
          height: 180,
          backgroundColor: "#F4F4F8",
          selection: false
        });
        
        // Draw timeline base
        const timeline = new fabric.Rect({
          left: 0,
          top: 90,
          width: 800,
          height: 2,
          fill: "#CCCCCC",
          selectable: false
        });
        
        canvas.add(timeline);
        
        // Draw playhead
        const playhead = new fabric.Line([0, 40, 0, 140], {
          stroke: '#FF0000',
          strokeWidth: 2,
          selectable: false,
          name: 'playhead'
        });
        canvas.add(playhead);
        
        setFabricCanvas(canvas);
        canvasInitializedRef.current = true;
      } catch (error) {
        console.error("Error initializing canvas:", error);
        toast.error("Erro ao inicializar o canvas. Por favor, recarregue a página.");
      }
    }
    
    return () => {
      if (fabricCanvas) {
        try {
          fabricCanvas.dispose();
        } catch (error) {
          console.error("Error disposing canvas:", error);
        }
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Update canvas when timeline events change
  useEffect(() => {
    if (!fabricCanvas) return;
    
    try {
      // Clear canvas except timeline and playhead
      const objects = fabricCanvas.getObjects();
      const timeline = objects.find(obj => obj.type === 'rect');
      const playhead = objects.find(obj => obj.name === 'playhead');
      
      fabricCanvas.clear();
      
      if (timeline) fabricCanvas.add(timeline);
      if (playhead) fabricCanvas.add(playhead);
      
      // Add timeline events
      timelineEvents.forEach(event => {
        const instrument = instruments.find(i => i.id === event.instrumentId);
        if (!instrument) return;
        
        const x = (event.position / 100) * 800;
        let shape;
        
        switch (instrument.shape) {
          case 'circle':
            shape = new fabric.Circle({
              left: x,
              top: 90,
              radius: 20,
              fill: instrument.color,
              stroke: '#333333',
              strokeWidth: 2,
              originX: 'center',
              originY: 'center',
              selectable: false,
              data: { eventId: event.id }
            });
            break;
            
          case 'square':
            shape = new fabric.Rect({
              left: x,
              top: 90,
              width: 40,
              height: 40,
              fill: instrument.color,
              stroke: '#333333',
              strokeWidth: 2,
              originX: 'center',
              originY: 'center',
              selectable: false,
              data: { eventId: event.id }
            });
            break;
            
          case 'triangle':
            shape = new fabric.Triangle({
              left: x,
              top: 90,
              width: 40,
              height: 40,
              fill: instrument.color,
              stroke: '#333333',
              strokeWidth: 2,
              originX: 'center',
              originY: 'center',
              selectable: false,
              data: { eventId: event.id }
            });
            break;
            
          case 'hand':
            // For hand, we still use a rect but will show an icon in the UI
            shape = new fabric.Rect({
              left: x,
              top: 90,
              width: 40,
              height: 40,
              fill: instrument.color,
              stroke: '#333333',
              strokeWidth: 2,
              originX: 'center',
              originY: 'center',
              selectable: false,
              data: { eventId: event.id }
            });
            break;
            
          case 'footprints':
            // For footprints, we still use a rect but will show an icon in the UI
            shape = new fabric.Rect({
              left: x,
              top: 90,
              width: 40,
              height: 40,
              fill: instrument.color,
              stroke: '#333333',
              strokeWidth: 2,
              originX: 'center',
              originY: 'center',
              selectable: false,
              data: { eventId: event.id }
            });
            break;
            
          case 'silence':
            // For silence, we still use a rect but will show an icon in the UI
            shape = new fabric.Rect({
              left: x,
              top: 90,
              width: 40,
              height: 40,
              fill: instrument.color,
              stroke: '#333333',
              strokeWidth: 2,
              originX: 'center',
              originY: 'center',
              selectable: false,
              data: { eventId: event.id }
            });
            break;
            
          default:
            shape = new fabric.Rect({
              left: x,
              top: 90,
              width: 40,
              height: 40,
              fill: instrument.color,
              stroke: '#333333',
              strokeWidth: 2,
              originX: 'center',
              originY: 'center',
              selectable: false,
              data: { eventId: event.id }
            });
        }
        
        fabricCanvas.add(shape);
        
        // Add label
        const text = new fabric.Text(instrument.name, {
          left: x,
          top: 140,
          fontSize: 12,
          fill: '#333',
          originX: 'center',
          textAlign: 'center',
          selectable: false
        });
        
        fabricCanvas.add(text);
      });
      
      fabricCanvas.renderAll();
    } catch (error) {
      console.error("Error updating canvas:", error);
    }
  }, [timelineEvents, instruments, fabricCanvas]);
  
  // Create Audio Element with better error handling
  useEffect(() => {
    // Create a new audio element
    const audio = new Audio();
    audio.volume = volume / 100;
    
    audio.onended = () => {
      setAudioPlaying(false);
    };
    
    // Better error handler with precise logging and type checking
    audio.onerror = (event) => {
      console.error("Audio error:", event);
      
      let errorMessage = "Erro ao reproduzir áudio";
      
      // Type guard to ensure we can access properties safely
      if (event instanceof Event && event.target instanceof HTMLAudioElement) {
        const audioElement = event.target;
        
        if (audioElement.error) {
          switch (audioElement.error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMessage = "Reprodução interrompida pelo usuário";
              break;
            case MediaError.MEDIA_ERR_NETWORK:
              errorMessage = "Erro de rede ao carregar o áudio";
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorMessage = "Erro ao decodificar o áudio";
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = "Formato de áudio não suportado";
              break;
            default:
              errorMessage = `Erro ao reproduzir: ${audioElement.error.message || 'Erro desconhecido'}`;
          }
        }
      }
      
      toast.error(errorMessage);
      setAudioPlaying(false);
    };
    
    audioRef.current = audio;
    
    // Pre-load the fallback audio to ensure it's in cache
    const preloadFallback = new Audio(ULTIMATE_FALLBACK_URL);
    preloadFallback.preload = "metadata";
    preloadFallback.load();
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Handle song play with improved reliability
  const handlePlaySong = (songUrl: string) => {
    // Check if it's a YouTube URL
    if (songUrl.includes("youtube.com") || songUrl.includes("youtu.be")) {
      // YouTube URLs are handled by the MusicPlaylist component directly
      // We don't need to do anything here as the iframe is managed in the component
      return;
    }
    
    const song = songLibrary.find(s => s.url === songUrl);
    if (!song) return;
    
    if (audioRef.current) {
      try {
        // Reset any previous sources and errors
        audioRef.current.pause();
        audioRef.current.src = '';
        
        // Set new source and play
        audioRef.current.src = songUrl;
        
        // When setting up playing, make sure to handle potential promise rejection
        audioRef.current.play()
          .then(() => {
            setCurrentSong(song);
            setAudioPlaying(true);
            setIsPlaying(true);
            toast.success(`Reproduzindo: ${song.title}`);
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            toast.error("Erro ao reproduzir áudio. Tentando solução alternativa...");
            
            // Try with our ultimate fallback URL
            audioRef.current!.src = ULTIMATE_FALLBACK_URL;
            audioRef.current!.play()
              .then(() => {
                // Create a fallback song object
                const fallbackSong: Song = {
                  id: "fallback",
                  title: "Música Alternativa",
                  artist: "Sistema",
                  url: ULTIMATE_FALLBACK_URL,
                  source: "default"
                };
                
                setCurrentSong(fallbackSong);
                setAudioPlaying(true);
                setIsPlaying(true);
                toast.success(`Reproduzindo música alternativa`);
              })
              .catch(secondError => {
                console.error("Failed even with fallback:", secondError);
                toast.error("Não foi possível reproduzir áudio. Verifique as configurações do navegador.");
                
                // Try to generate a simple tone using Web Audio API as last resort
                try {
                  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                  if (AudioContext) {
                    const audioCtx = new AudioContext();
                    const oscillator = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.value = 440; // A4 note
                    gainNode.gain.value = 0.1;
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    
                    oscillator.start();
                    setTimeout(() => {
                      oscillator.stop();
                      toast.info("Gerado um tom simples como alternativa");
                    }, 1000);
                  }
                } catch (finalError) {
                  console.error("Failed to generate tone:", finalError);
                }
              });
          });
      } catch (error) {
        console.error("Error setting audio source:", error);
        toast.error("Erro ao configurar áudio. Tente novamente mais tarde.");
      }
    }
  };
  
  // Handle song pause
  const handlePauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioPlaying(false);
      
      // Also pause musicogram animation
      setIsPlaying(false);
    }
  };
  
  // Animation loop
  useEffect(() => {
    if (!isPlaying || !fabricCanvas) return;
    
    let lastTime = 0;
    const duration = 10000; // 10 seconds for full timeline
    
    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      
      // Calculate elapsed time
      const elapsed = timestamp - lastTime;
      
      // Calculate new position (0-100)
      const newPosition = playbackPosition + (elapsed / duration * 100);
      
      // Reset if reached the end
      if (newPosition >= 100) {
        setPlaybackPosition(0);
        lastTime = timestamp;
      } else {
        setPlaybackPosition(newPosition);
        lastTime = timestamp;
      }
      
      // Update playhead position
      const playhead = fabricCanvas.getObjects().find(obj => obj.name === 'playhead');
      if (playhead) {
        const x = (newPosition / 100) * 800;
        playhead.set({ left: x, x1: x, x2: x });
        fabricCanvas.renderAll();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, playbackPosition, fabricCanvas]);
  
  // Handle adding instrument to timeline
  const handleAddInstrumentToTimeline = () => {
    if (!selectedInstrument) {
      toast.error("Selecione um instrumento primeiro");
      return;
    }
    
    const newEvent: TimelineEvent = {
      id: uuidv4(),
      instrumentId: selectedInstrument,
      position: playbackPosition
    };
    
    setTimelineEvents(prev => [...prev, newEvent]);
    toast.success("Instrumento adicionado à linha do tempo");
  };
  
  // Play/pause control
  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Also pause audio
      if (audioPlaying) {
        handlePauseSong();
      }
    } else {
      setIsPlaying(true);
      
      // Also start audio
      if (currentSong && !audioPlaying && audioRef.current) {
        audioRef.current.play();
        setAudioPlaying(true);
      }
    }
  };
  
  // Reset timeline
  const resetTimeline = () => {
    setPlaybackPosition(0);
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Update playhead position
    if (fabricCanvas) {
      const playhead = fabricCanvas.getObjects().find(obj => obj.name === 'playhead');
      if (playhead) {
        playhead.set({ left: 0, x1: 0, x2: 0 });
        fabricCanvas.renderAll();
      }
    }
    
    // Also reset audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (audioPlaying) {
        handlePauseSong();
      }
    }
  };
  
  // Clear all events
  const clearEvents = () => {
    setTimelineEvents([]);
    resetTimeline();
    toast.success("Linha do tempo limpa");
  };
  
  // Export as image
  const exportAsImage = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1
    });
    
    const link = document.createElement('a');
    link.download = `musicograma-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Musicograma baixado como imagem!");
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Musicograma</h1>
        </div>
        
        <p className="text-muted-foreground">
          Musicograma com Formas e Cores - Uma ferramenta visual para representar sons e música,
          especialmente útil para crianças pequenas e pessoas com autismo não verbal.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Canvas Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="border border-gray-300 rounded-lg shadow-lg overflow-hidden bg-white">
                  <canvas ref={canvasRef} />
                </div>
              </CardContent>
            </Card>
            
            {/* Timeline Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant={isPlaying ? "outline" : "default"} 
                  size="icon" 
                  onClick={togglePlayback}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={resetTimeline} 
                  title="Reiniciar"
                >
                  <RotateCcw size={18} />
                </Button>
                
                <div className="text-sm">
                  Posição: {playbackPosition.toFixed(0)}%
                </div>
                
                {/* Volume control */}
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setVolume(volume === 0 ? 50 : 0)}
                    className="h-8 w-8"
                  >
                    {volume === 0 ? <VolumeX size={16} /> : <Volume size={16} />}
                  </Button>
                  <Slider 
                    value={[volume]} 
                    min={0} 
                    max={100} 
                    step={1} 
                    className="w-24"
                    onValueChange={(vals) => setVolume(vals[0])}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearEvents}>
                  Limpar
                </Button>
                
                <Button variant="outline" size="sm" onClick={exportAsImage}>
                  <Download size={16} className="mr-1" />
                  Exportar
                </Button>
              </div>
            </div>
            
            {/* Instruments moved up from below */}
            <Card>
              <CardHeader>
                <CardTitle>Instrumentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {instruments.map(instrument => (
                    <Toggle
                      key={instrument.id}
                      pressed={selectedInstrument === instrument.id}
                      onPressedChange={() => setSelectedInstrument(instrument.id)}
                      className="flex flex-col items-center gap-1 h-auto p-4 data-[state=on]:bg-primary/10"
                    >
                      <div 
                        className="w-12 h-12 flex items-center justify-center rounded-md border-2 border-gray-800"
                        style={{ backgroundColor: instrument.color }}
                      >
                        {instrument.shape === 'circle' && <Circle className="h-8 w-8" />}
                        {instrument.shape === 'square' && <Square className="h-8 w-8" />}
                        {instrument.shape === 'triangle' && <Triangle className="h-8 w-8" />}
                        {instrument.shape === 'hand' && <Hand className="h-8 w-8" />}
                        {instrument.shape === 'footprints' && <Footprints className="h-8 w-8" />}
                        {instrument.shape === 'silence' && <MicOff className="h-8 w-8" />}
                      </div>
                      <span className="text-xs font-medium">{instrument.name}</span>
                    </Toggle>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button onClick={handleAddInstrumentToTimeline} className="gap-2">
                    <Plus size={16} />
                    Adicionar na Linha do Tempo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Music playlist and settings */}
          <div className="space-y-6">
            {/* Music playlist */}
            <MusicPlaylist
              onPlay={handlePlaySong}
              onPause={handlePauseSong}
              currentSong={currentSong}
              isPlaying={audioPlaying}
            />
            
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Velocidade (BPM)</span>
                    <span className="font-mono">{tempo}</span>
                  </div>
                  <Slider 
                    value={[tempo]} 
                    min={30} 
                    max={120} 
                    step={1} 
                    onValueChange={(vals) => setTempo(vals[0])}
                  />
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Dicas para Uso</h3>
                  <ul className="text-sm space-y-1 list-disc pl-4 text-muted-foreground">
                    <li>Escolha um instrumento clicando em seu ícone</li>
                    <li>Adicione à linha do tempo usando o botão "Adicionar"</li>
                    <li>Selecione uma música da playlist para tocar junto</li>
                    <li>Use o botão Play para animar as formas</li>
                    <li>Ajuste a velocidade e volume conforme necessário</li>
                    <li>Exporte a imagem para usar em sessões offline</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
