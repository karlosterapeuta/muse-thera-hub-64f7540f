
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Volume2, Play, Pause, RotateCcw, Trophy, Music, Target } from 'lucide-react';

// Boomwhacker color/note mapping baseado na imagem
const BOOMWHACKER_NOTES = [
  { note: 'C', color: '#FF0000', name: 'Dó', frequency: 261.63 },
  { note: 'D', color: '#FF7F00', name: 'Ré', frequency: 293.66 },
  { note: 'E', color: '#FFFF00', name: 'Mi', frequency: 329.63 },
  { note: 'F', color: '#00FF00', name: 'Fá', frequency: 349.23 },
  { note: 'G', color: '#0000FF', name: 'Sol', frequency: 392.00 },
  { note: 'A', color: '#8B00FF', name: 'Lá', frequency: 440.00 },
  { note: 'B', color: '#FF69B4', name: 'Si', frequency: 493.88 },
  { note: 'C2', color: '#8B0000', name: 'Dó²', frequency: 523.25 }
];

// Layout das fileiras baseado na imagem
const TUBE_LAYOUT = [
  [1, 2, 5, 0], // Fileira superior: D, E, G, C
  [0, 2, 5, 0], // Segunda fileira: C, E, G, C  
  [0, 4, 6, 0], // Terceira fileira: C, F, A, C
  [0, 1, 2, 4, 5, 6, 7, 0] // Fileira inferior: C, D, E, F, G, A, B, C
];

interface GameStats {
  notesPlayed: number;
  correctSequence: number;
  sessionTime: number;
  score: number;
}

interface TubeAnimation {
  id: string;
  noteIndex: number;
  startTime: number;
}

const BoomwhackerHero: React.FC = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameMode, setGameMode] = useState<'free' | 'sequence' | 'challenge'>('free');
  const [currentSequence, setCurrentSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    notesPlayed: 0,
    correctSequence: 0,
    sessionTime: 0,
    score: 0
  });
  const [tubeAnimations, setTubeAnimations] = useState<TubeAnimation[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Initialize audio context
  const initializeAudio = useCallback(async () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      setAudioContext(ctx);
      
      toast({
        title: "🎵 Boomwhacker Hero Ativo!",
        description: "Toque nos tubos coloridos para criar música!",
      });
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
    }
  }, [toast]);

  // Play boomwhacker sound
  const playBoomwhackerNote = useCallback((noteIndex: number) => {
    if (!audioContext || noteIndex < 0 || noteIndex >= BOOMWHACKER_NOTES.length) return;

    const note = BOOMWHACKER_NOTES[noteIndex];
    
    try {
      // Create oscillator for the tube sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Boomwhacker sound characteristics
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note.frequency, audioContext.currentTime);
      
      // Envelope for tube-like sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1.2);
      
      // Add tube animation
      const animationId = `tube-${Date.now()}-${noteIndex}`;
      setTubeAnimations(prev => [...prev, {
        id: animationId,
        noteIndex,
        startTime: Date.now()
      }]);
      
      // Remove animation after duration
      setTimeout(() => {
        setTubeAnimations(prev => prev.filter(anim => anim.id !== animationId));
      }, 800);
      
    } catch (error) {
      console.error('Erro ao tocar nota:', error);
    }
  }, [audioContext]);

  // Handle tube click
  const handleTubeClick = useCallback((noteIndex: number) => {
    playBoomwhackerNote(noteIndex);
    
    setGameStats(prev => ({
      ...prev,
      notesPlayed: prev.notesPlayed + 1,
      score: prev.score + 10
    }));

    if (gameMode === 'sequence') {
      const newUserSequence = [...userSequence, noteIndex];
      setUserSequence(newUserSequence);
      
      // Check if sequence matches
      if (newUserSequence.length === currentSequence.length) {
        const isCorrect = newUserSequence.every((note, index) => note === currentSequence[index]);
        if (isCorrect) {
          setGameStats(prev => ({
            ...prev,
            correctSequence: prev.correctSequence + 1,
            score: prev.score + 100
          }));
          toast({
            title: "🎉 Sequência Correta!",
            description: "Excelente! Continue tocando!",
          });
          generateNewSequence();
        } else {
          toast({
            title: "❌ Sequência Incorreta",
            description: "Tente novamente! Ouça a sequência primeiro.",
          });
          setUserSequence([]);
        }
      }
    }
  }, [gameMode, userSequence, currentSequence, playBoomwhackerNote, toast]);

  // Generate new sequence for sequence mode
  const generateNewSequence = useCallback(() => {
    const length = Math.min(3 + Math.floor(gameStats.correctSequence / 2), 8);
    const sequence = Array.from({ length }, () => Math.floor(Math.random() * BOOMWHACKER_NOTES.length));
    setCurrentSequence(sequence);
    setUserSequence([]);
  }, [gameStats.correctSequence]);

  // Play current sequence
  const playSequence = useCallback(() => {
    if (currentSequence.length === 0) return;
    
    currentSequence.forEach((noteIndex, index) => {
      setTimeout(() => {
        playBoomwhackerNote(noteIndex);
      }, index * 600);
    });
  }, [currentSequence, playBoomwhackerNote]);

  // Canvas drawing with multiple rows layout
  const drawTubes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const tubeWidth = 80;
    const tubeHeight = 120;
    const spacingX = 100;
    const spacingY = 140;
    const startY = 50;
    
    TUBE_LAYOUT.forEach((row, rowIndex) => {
      const startX = (canvas.width - (row.length * spacingX - (spacingX - tubeWidth))) / 2;
      const y = startY + rowIndex * spacingY;
      
      row.forEach((noteIndex, colIndex) => {
        const x = startX + colIndex * spacingX;
        const note = BOOMWHACKER_NOTES[noteIndex];
        
        // Check if tube is being animated
        const isAnimated = tubeAnimations.some(anim => anim.noteIndex === noteIndex);
        const animationOffset = isAnimated ? 
          Math.sin((Date.now() % 400) / 400 * Math.PI * 6) * 8 : 0;
        
        // Draw tube shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(x + 4, y + 4 + animationOffset, tubeWidth, tubeHeight);
        
        // Draw tube body
        ctx.fillStyle = note.color;
        ctx.fillRect(x, y + animationOffset, tubeWidth, tubeHeight);
        
        // Draw tube highlight
        const gradient = ctx.createLinearGradient(x, y, x + tubeWidth * 0.4, y);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y + animationOffset, tubeWidth * 0.4, tubeHeight);
        
        // Draw tube rim (top)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(x, y + animationOffset, tubeWidth, 8);
        
        // Draw note label background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x + 10, y + tubeHeight + animationOffset + 10, tubeWidth - 20, 30);
        
        // Draw note label
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(note.note, x + tubeWidth/2, y + tubeHeight + animationOffset + 30);
        
        // Draw glow effect if animated
        if (isAnimated) {
          ctx.shadowColor = note.color;
          ctx.shadowBlur = 25;
          ctx.strokeStyle = note.color;
          ctx.lineWidth = 4;
          ctx.strokeRect(x - 2, y + animationOffset - 2, tubeWidth + 4, tubeHeight + 4);
          ctx.shadowBlur = 0;
        }
      });
    });
  }, [tubeAnimations]);

  // Animation loop
  const animate = useCallback(() => {
    drawTubes();
    animationRef.current = requestAnimationFrame(animate);
  }, [drawTubes]);

  // Handle canvas click
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const tubeWidth = 80;
    const tubeHeight = 120;
    const spacingX = 100;
    const spacingY = 140;
    const startY = 50;
    
    // Check which tube was clicked in each row
    TUBE_LAYOUT.forEach((row, rowIndex) => {
      const startX = (canvas.width - (row.length * spacingX - (spacingX - tubeWidth))) / 2;
      const tubeY = startY + rowIndex * spacingY;
      
      row.forEach((noteIndex, colIndex) => {
        const tubeX = startX + colIndex * spacingX;
        if (x >= tubeX && x <= tubeX + tubeWidth && y >= tubeY && y <= tubeY + tubeHeight) {
          handleTubeClick(noteIndex);
        }
      });
    });
  }, [handleTubeClick]);

  // Start new game
  const startNewGame = useCallback(() => {
    setIsPlaying(true);
    setGameStats({
      notesPlayed: 0,
      correctSequence: 0,
      sessionTime: 0,
      score: 0
    });
    
    if (gameMode === 'sequence') {
      generateNewSequence();
    }
  }, [gameMode, generateNewSequence]);

  // Initialize
  useEffect(() => {
    initializeAudio();
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeAudio, animate]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 900;
      canvas.height = 650;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-red-900/20 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white p-6 rounded-xl shadow-xl mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">🎵 BOOMWHACKER HERO</h1>
          <p className="text-lg opacity-90">
            Toque nos tubos coloridos organizados em fileiras! Cada cor é uma nota diferente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                Controles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Modo de Jogo:</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'free', label: 'Livre', desc: 'Toque livremente' },
                    { id: 'sequence', label: 'Sequência', desc: 'Repita a sequência' },
                    { id: 'challenge', label: 'Desafio', desc: 'Modo avançado' }
                  ].map((mode) => (
                    <Button
                      key={mode.id}
                      variant={gameMode === mode.id ? "default" : "outline"}
                      onClick={() => setGameMode(mode.id as any)}
                      className="justify-start h-auto p-3"
                    >
                      <div className="text-left">
                        <div className="font-medium">{mode.label}</div>
                        <div className="text-xs opacity-70">{mode.desc}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={startNewGame} className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  {isPlaying ? 'Reiniciar' : 'Iniciar'}
                </Button>
                
                {gameMode === 'sequence' && currentSequence.length > 0 && (
                  <Button onClick={playSequence} variant="outline">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Notas Tocadas:</span>
                <Badge>{gameStats.notesPlayed}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Sequências Corretas:</span>
                <Badge>{gameStats.correctSequence}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Pontuação:</span>
                <Badge variant="secondary">{gameStats.score}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Sequence Progress */}
          {gameMode === 'sequence' && currentSequence.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Sequência Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso:</span>
                    <span>{userSequence.length}/{currentSequence.length}</span>
                  </div>
                  <Progress value={(userSequence.length / currentSequence.length) * 100} />
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {currentSequence.map((noteIndex, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: BOOMWHACKER_NOTES[noteIndex]?.color }}
                        title={BOOMWHACKER_NOTES[noteIndex]?.name}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Legenda das Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {BOOMWHACKER_NOTES.map((note) => (
                  <div key={note.note} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: note.color }}
                    />
                    <span>{note.note} - {note.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Boomwhackers Organizados em Fileiras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="w-full max-w-4xl mx-auto border rounded-lg cursor-pointer"
                  style={{ backgroundColor: '#1a1a1a' }}
                />
                
                <div className="mt-4 text-center text-sm text-gray-600">
                  Clique nos tubos coloridos organizados em fileiras para tocar as notas!
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BoomwhackerHero;
