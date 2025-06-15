
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Volume2, Play, Pause, RotateCcw, Trophy, Music, Target } from 'lucide-react';

// Boomwhacker color/note mapping
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
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1.5);
      
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
      }, 1000);
      
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

  // Canvas drawing
  const drawTubes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const tubeWidth = 60;
    const tubeHeight = 200;
    const spacing = 80;
    const startX = (canvas.width - (BOOMWHACKER_NOTES.length * spacing - (spacing - tubeWidth))) / 2;
    
    BOOMWHACKER_NOTES.forEach((note, index) => {
      const x = startX + index * spacing;
      const y = canvas.height - tubeHeight - 50;
      
      // Check if tube is being animated
      const isAnimated = tubeAnimations.some(anim => anim.noteIndex === index);
      const animationProgress = isAnimated ? 
        Math.sin((Date.now() % 500) / 500 * Math.PI * 4) * 10 : 0;
      
      // Draw tube
      ctx.fillStyle = note.color;
      ctx.fillRect(x, y + animationProgress, tubeWidth, tubeHeight);
      
      // Draw tube highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x, y + animationProgress, tubeWidth * 0.3, tubeHeight);
      
      // Draw note label
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(note.note, x + tubeWidth/2, y + tubeHeight + 25);
      ctx.fillText(note.name, x + tubeWidth/2, y + tubeHeight + 45);
      
      // Draw glow effect if animated
      if (isAnimated) {
        ctx.shadowColor = note.color;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = note.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 3, y + animationProgress - 3, tubeWidth + 6, tubeHeight + 6);
        ctx.shadowBlur = 0;
      }
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
    
    const tubeWidth = 60;
    const spacing = 80;
    const startX = (canvas.width - (BOOMWHACKER_NOTES.length * spacing - (spacing - tubeWidth))) / 2;
    const tubeHeight = 200;
    const tubeY = canvas.height - tubeHeight - 50;
    
    // Check which tube was clicked
    BOOMWHACKER_NOTES.forEach((_, index) => {
      const tubeX = startX + index * spacing;
      if (x >= tubeX && x <= tubeX + tubeWidth && y >= tubeY && y <= tubeY + tubeHeight) {
        handleTubeClick(index);
      }
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
      canvas.width = 800;
      canvas.height = 400;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-red-900/20 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white p-6 rounded-xl shadow-xl mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">🎵 BOOMWHACKER HERO</h1>
          <p className="text-lg opacity-90">
            Toque os tubos coloridos para criar música! Cada cor é uma nota diferente.
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
        </div>

        {/* Game Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Boomwhackers Interativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="w-full max-w-4xl mx-auto border rounded-lg cursor-pointer"
                  style={{ backgroundColor: '#f8f9fa' }}
                />
                
                <div className="mt-4 text-center text-sm text-gray-600">
                  Clique nos tubos coloridos para tocar as notas!
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
