import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import EducationalKeyboard from "./components/EducationalKeyboard";
import EducationalStaff from "./components/EducationalStaff";
import TopToolbar from "./components/TopToolbar";
import ColoredNotesSystem from "./components/ColoredNotesSystem";
import LessonSystem from "./components/LessonSystem";
import VisualTimeline from "./components/VisualTimeline";
import MusicImporter from "./components/MusicImporter";
import AccessibilityPanel from "./components/AccessibilityPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Note {
  id: string;
  pitch: string;
  duration: number;
  position: { x: number; y: number };
  color: string;
  shape: string;
  timestamp: number;
}

interface Composition {
  id: string;
  name: string;
  notes: Note[];
  tempo: number;
  timeSignature: string;
}

const MusicComposer = () => {
  const { t } = useTranslation('games');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [tempo, setTempo] = useState(120);
  const [timeSignature, setTimeSignature] = useState("4/4");
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const [selectedShape, setSelectedShape] = useState("circle");
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentComposition, setCurrentComposition] = useState<Composition | null>(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [highlightedNote, setHighlightedNote] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState("compose");
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    slowAnimations: false,
    soundFeedback: true,
    vibration: false,
    voiceNarration: false,
    simplifiedInterface: false,
    colorBlindMode: "none",
    textSize: 16,
    soundVolume: 70,
    animationSpeed: 100,
    buttonSize: 48
  });
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);

  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const beatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mapeamento de cores para frequências
  const colorToFrequency: { [key: string]: { frequency: number; note: string } } = {
    "#FF0000": { frequency: 261.63, note: "C" },  // Vermelho - Dó
    "#FF9900": { frequency: 293.66, note: "D" },  // Laranja - Ré
    "#FFFF00": { frequency: 329.63, note: "E" },  // Amarelo - Mi
    "#00FF00": { frequency: 349.23, note: "F" },  // Verde - Fá
    "#0099FF": { frequency: 392.00, note: "G" },  // Azul claro - Sol
    "#0000FF": { frequency: 440.00, note: "A" },  // Azul - Lá
    "#9900FF": { frequency: 493.88, note: "B" },  // Roxo - Si
    "#FF6699": { frequency: 523.25, note: "C2" }  // Rosa - Dó agudo
  };

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Load completed lessons from localStorage
    const saved = localStorage.getItem('completedLessons');
    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }

    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    };
  }, []);

  const playNote = (frequency: number, note: string, color: string, duration: number = 0.8) => {
    if (!audioContextRef.current || isMuted) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      const filterNode = audioContextRef.current.createBiquadFilter();

      // Configurar filtro para som mais suave
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, audioContextRef.current.currentTime);

      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = 'sine';

      // Envelope ADSR mais suave
      const currentTime = audioContextRef.current.currentTime;
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.3, currentTime + 0.05); // Attack
      gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.2, currentTime + 0.2); // Decay
      gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.15, currentTime + duration - 0.2); // Sustain
      gainNode.gain.linearRampToValueAtTime(0, currentTime + duration); // Release

      oscillator.start(currentTime);
      oscillator.stop(currentTime + duration);

      // Feedback visual
      setHighlightedNote(note);
      setTimeout(() => setHighlightedNote(undefined), duration * 1000);

    } catch (error) {
      console.error("Erro ao reproduzir nota:", error);
    }
  };

  const handlePlay = () => {
    if (notes.length === 0) {
      toast({
        title: "Nenhuma nota encontrada",
        description: "Adicione algumas notas na partitura antes de reproduzir.",
        variant: "destructive"
      });
      return;
    }

    if (isPaused) {
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
      setPlaybackPosition(0);
      setCurrentBeat(1);
    }

    // Intervalo de reprodução das notas
    playIntervalRef.current = setInterval(() => {
      setPlaybackPosition(prev => {
        const nextPos = prev + 1;
        if (nextPos >= notes.length) {
          handleStop();
          
          // Se estiver em uma lição, marcar como completa
          if (currentLesson) {
            handleLessonComplete(currentLesson.id, 3);
          }
          
          return 0;
        }
        
        // Reproduzir a nota atual
        const currentNote = notes[nextPos % notes.length];
        const colorInfo = colorToFrequency[currentNote.color];
        if (colorInfo) {
          playNote(colorInfo.frequency, colorInfo.note, currentNote.color);
        }
        
        return nextPos;
      });
    }, (60 / tempo) * 1000);

    // Intervalo do metrônomo
    beatIntervalRef.current = setInterval(() => {
      setCurrentBeat(prev => {
        const beats = parseInt(timeSignature.split('/')[0]);
        return prev >= beats ? 1 : prev + 1;
      });
    }, (60 / tempo) * 1000);

    toast({
      title: "🎵 Reprodução iniciada",
      description: currentLesson ? "Acompanhe a lição na partitura colorida!" : "Acompanhe a música na partitura colorida!",
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
    setIsPaused(true);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    
    toast({
      title: "⏸️ Música pausada",
      description: "Clique em play para continuar.",
    });
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setPlaybackPosition(0);
    setCurrentBeat(1);
    setHighlightedNote(undefined);
    
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    
    toast({
      title: "⏹️ Reprodução parada",
      description: "Música reiniciada para o início.",
    });
  };

  const handlePrevious = () => {
    setPlaybackPosition(prev => Math.max(0, prev - 1));
    toast({
      title: "⏮️ Nota anterior",
      description: "Voltou uma nota na sequência.",
    });
  };

  const handleNext = () => {
    setPlaybackPosition(prev => Math.min(notes.length - 1, prev + 1));
    toast({
      title: "⏭️ Próxima nota",
      description: "Avançou uma nota na sequência.",
    });
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "🔊 Som ativado" : "🔇 Som desativado",
      description: isMuted ? "Agora você pode ouvir as notas!" : "Som silenciado.",
    });
  };

  const handleSave = () => {
    if (notes.length === 0) {
      toast({
        title: "Nada para salvar",
        description: "Adicione algumas notas antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    const composition: Composition = {
      id: Date.now().toString(),
      name: `Música Educativa ${new Date().toLocaleDateString()}`,
      notes,
      tempo,
      timeSignature
    };

    const savedCompositions = JSON.parse(localStorage.getItem('educationalCompositions') || '[]');
    savedCompositions.push(composition);
    localStorage.setItem('educationalCompositions', JSON.stringify(savedCompositions));

    setCurrentComposition(composition);

    toast({
      title: "💾 Música salva!",
      description: "Sua composição educativa foi salva com sucesso!",
    });
  };

  const handleLoad = () => {
    const savedCompositions = JSON.parse(localStorage.getItem('educationalCompositions') || '[]');
    
    if (savedCompositions.length === 0) {
      toast({
        title: "Nenhuma música salva",
        description: "Crie e salve uma música primeiro!",
        variant: "destructive"
      });
      return;
    }

    // Carregar a última composição salva
    const lastComposition = savedCompositions[savedCompositions.length - 1];
    setNotes(lastComposition.notes);
    setTempo(lastComposition.tempo);
    setTimeSignature(lastComposition.timeSignature);
    setCurrentComposition(lastComposition);

    toast({
      title: "📂 Música carregada!",
      description: `Carregada: ${lastComposition.name}`,
    });
  };

  const handleAddNote = (pitch: string, position: { x: number; y: number }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      pitch,
      duration: 1,
      position,
      color: selectedColor,
      shape: selectedShape,
      timestamp: Date.now()
    };

    setNotes(prev => [...prev, newNote]);
    
    // Reproduzir a nota adicionada
    const colorInfo = colorToFrequency[selectedColor];
    if (colorInfo) {
      playNote(colorInfo.frequency, colorInfo.note, selectedColor, 0.5);
    }

    toast({
      title: "🎵 Nota adicionada!",
      description: `Adicionada: ${pitch} (${colorInfo?.note || 'Nota'})`,
    });
  };

  const handleClearAll = () => {
    setNotes([]);
    setCurrentComposition(null);
    handleStop();
    
    toast({
      title: "🗑️ Tudo limpo!",
      description: "Todas as notas foram removidas da partitura.",
    });
  };

  const handleEraseAll = () => {
    handleClearAll();
  };

  const handleNotePlay = (frequency: number, note: string, color: string) => {
    playNote(frequency, note, color, 0.6);
  };

  const handleLessonSelect = (lesson: any) => {
    console.log("Selecionando lição:", lesson);
    
    // Carregar lição como composição atual
    const lessonNotes = lesson.pattern ? lesson.pattern.map((pitch: string, index: number) => ({
      id: `lesson-${Date.now()}-${index}`,
      pitch,
      duration: 1,
      position: { x: 150 + (index * 80), y: 140 },
      color: getColorForNote(pitch),
      shape: getShapeForNote(pitch),
      timestamp: index
    })) : lesson.notes || [];

    setNotes(lessonNotes);
    setCurrentLesson(lesson);
    setTempo(lesson.tempo || 120);
    
    toast({
      title: "🎓 Lição carregada!",
      description: `${lesson.title} está pronta para praticar.`,
    });
  };

  const handleLessonComplete = (lessonId: string, stars: number) => {
    const newCompleted = [...completedLessons];
    if (!newCompleted.includes(lessonId)) {
      newCompleted.push(lessonId);
      setCompletedLessons(newCompleted);
      localStorage.setItem('completedLessons', JSON.stringify(newCompleted));
      
      toast({
        title: "🎉 Lição Concluída!",
        description: `Parabéns! Você ganhou ${stars} estrelas!`,
      });
    }
  };

  const handleImportSong = (song: any) => {
    console.log("Importando música:", song);
    
    // Carregar as notas da música
    setNotes(song.notes || []);
    
    // Configurar o tempo se disponível
    if (song.tempo) {
      setTempo(song.tempo);
    }
    
    // Limpar lição atual se existir
    setCurrentLesson(null);
    
    // Mudar para a aba do compositor
    setActiveTab("compose");
    
    toast({
      title: "🎵 Música importada com sucesso!",
      description: `${song.name} foi carregada no compositor. Use os controles para reproduzir.`,
    });
  };

  const getColorForNote = (pitch: string) => {
    const colorMap: { [key: string]: string } = {
      'C': '#FF0000', 'D': '#FF6600', 'E': '#FFFF00', 'F': '#00CC00',
      'G': '#0099FF', 'A': '#6600FF', 'B': '#FF1493'
    };
    return colorMap[pitch] || '#888888';
  };

  const getShapeForNote = (pitch: string) => {
    const shapeMap: { [key: string]: string } = {
      'C': 'circle', 'D': 'square', 'E': 'triangle', 'F': 'diamond',
      'G': 'hexagon', 'A': 'triangle-up', 'B': 'circle-outline'
    };
    return shapeMap[pitch] || 'circle';
  };

  return (
    <div className={`h-screen flex flex-col ${
      accessibilitySettings.highContrast 
        ? 'bg-black text-white' 
        : 'bg-gray-100'
    }`} style={{ fontSize: accessibilitySettings.largeText ? '18px' : '14px' }}>
      
      {/* Top Toolbar */}
      <TopToolbar
        isPlaying={isPlaying}
        isPaused={isPaused}
        isMuted={isMuted}
        volume={volume}
        tempo={tempo}
        timeSignature={timeSignature}
        currentBeat={currentBeat}
        totalBeats={parseInt(timeSignature.split('/')[0])}
        onPlay={handlePlay}
        onPause={handlePause}
        onStop={handleStop}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onMute={handleMute}
        onVolumeChange={setVolume}
        onTempoChange={setTempo}
        onTimeSignatureChange={setTimeSignature}
        onSave={handleSave}
        onLoad={handleLoad}
        onClear={handleClearAll}
        selectedColor={selectedColor}
        selectedShape={selectedShape}
        onColorSelect={setSelectedColor}
        onShapeSelect={setSelectedShape}
      />

      {/* Hero Section with Piano */}
      <div className="bg-white shadow-lg p-4">
        <EducationalKeyboard
          onNotePlay={handleNotePlay}
          onNoteAdd={handleAddNote}
          selectedColor={selectedColor}
          isRecording={true}
          highlightedNote={highlightedNote}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur mb-2">
            <TabsTrigger 
              value="compose" 
              className="text-sm font-bold"
              style={{ minHeight: `${accessibilitySettings.buttonSize}px` }}
            >
              🎹 Compor
            </TabsTrigger>
            <TabsTrigger 
              value="lessons"
              className="text-sm font-bold"
              style={{ minHeight: `${accessibilitySettings.buttonSize}px` }}
            >
              📚 Lições
            </TabsTrigger>
            <TabsTrigger 
              value="library"
              className="text-sm font-bold" 
              style={{ minHeight: `${accessibilitySettings.buttonSize}px` }}
            >
              📁 Biblioteca
            </TabsTrigger>
            <TabsTrigger 
              value="timeline"
              className="text-sm font-bold"
              style={{ minHeight: `${accessibilitySettings.buttonSize}px` }}
            >
              ⏱️ Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="accessibility"
              className="text-sm font-bold"
              style={{ minHeight: `${accessibilitySettings.buttonSize}px` }}
            >
              ♿ Acessibilidade
            </TabsTrigger>
          </TabsList>

          {/* Compose Tab - Staff Writing Area */}
          <TabsContent value="compose" className="h-full">
            {currentLesson && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-xl border-2 border-purple-300 mb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-purple-800">🎯 Lição Ativa: {currentLesson.title}</h3>
                    <p className="text-purple-600 text-sm">{currentLesson.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentLesson(null);
                      setNotes([]);
                      toast({ title: "Lição cancelada", description: "Voltando ao modo livre." });
                    }}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    Sair da Lição
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden">
              <EducationalStaff
                notes={notes}
                onAddNote={handleAddNote}
                playbackPosition={playbackPosition}
                isPlaying={isPlaying}
                timeSignature={timeSignature}
                highlightedNote={highlightedNote}
                selectedColor={selectedColor}
                selectedShape={selectedShape}
              />
            </div>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="lessons" className="h-full">
            <LessonSystem
              onLessonSelect={handleLessonSelect}
              currentProgress={Math.floor((completedLessons.length / 6) * 100)}
              onStartLesson={() => setActiveTab("compose")}
              completedLessons={completedLessons}
              onLessonComplete={handleLessonComplete}
            />
          </TabsContent>

          <TabsContent value="library" className="h-full">
            <MusicImporter
              onImportSong={handleImportSong}
              onLoadExercise={handleLessonSelect}
            />
          </TabsContent>

          <TabsContent value="timeline" className="h-full">
            <VisualTimeline
              notes={notes}
              isPlaying={isPlaying}
              currentPosition={playbackPosition}
              duration={notes.length}
              onSeek={setPlaybackPosition}
              onPlay={handlePlay}
              onPause={handlePause}
              onStop={handleStop}
              tempo={tempo}
            />
          </TabsContent>

          <TabsContent value="accessibility" className="h-full">
            <AccessibilityPanel
              settings={accessibilitySettings}
              onSettingsChange={setAccessibilitySettings}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 p-3 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span>🎼 Piano Educativo TEA</span>
          </span>
          <span>🎵 Notas: {notes.length}</span>
          <span>⏱️ Tempo: {tempo} BPM</span>
          <span>🎼 Compasso: {timeSignature}</span>
          {currentLesson && (
            <span className="text-purple-600 font-bold">🎯 Lição: {currentLesson.title}</span>
          )}
          <span className="text-green-600 font-bold">📚 Completas: {completedLessons.length}/6</span>
          {accessibilitySettings.simplifiedInterface && (
            <span className="text-blue-600 font-bold">♿ Modo Simplificado</span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-purple-600 font-semibold">Software Educacional Musical Inclusivo</span>
          <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default MusicComposer;
