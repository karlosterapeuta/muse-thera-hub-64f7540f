import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ActivitySymbol, TherapyActivity } from "../types";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Howl } from "howler";

interface InteractiveCanvasProps {
  activity: TherapyActivity;
  onActivityComplete: (success: boolean, timeElapsed: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

// Frequências sintéticas melhoradas por categoria
const categoryFrequencies: { [key: string]: number } = {
  instrument: 440, // Lá
  emotion: 523,    // Dó
  action: 659,     // Mi
  dynamic: 392,    // Sol
  nature: 294      // Ré
};

// Tipos de onda específicos para cada categoria
const categoryWaveTypes: { [key: string]: OscillatorType } = {
  instrument: 'sine',
  emotion: 'triangle',
  action: 'square',
  dynamic: 'sawtooth',
  nature: 'sine'
};

const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  activity,
  onActivityComplete,
  soundEnabled,
  onToggleSound
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedSymbols, setSelectedSymbols] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (activity) {
      resetActivity();
    }
  }, [activity]);

  const resetActivity = () => {
    setSelectedSymbols([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setStartTime(null);
    setShowFeedback(null);
  };

  const startActivity = () => {
    setStartTime(Date.now());
    setIsPlaying(true);
    if (activity.type === 'sequence' && activity.correctOrder) {
      playSequence();
    }
  };

  // Função melhorada para reproduzir som dos símbolos
  const playSymbolSound = async (symbol: ActivitySymbol) => {
    if (!soundEnabled) {
      console.log('[AUDIO] Som desabilitado pelo usuário');
      return;
    }

    console.log(`[AUDIO] Tentando reproduzir som para: ${symbol.name} (${symbol.category})`);

    // Tentar reproduzir som específico do símbolo primeiro
    if (symbol.sound) {
      try {
        console.log(`[AUDIO] Carregando arquivo: ${symbol.sound}`);
        const howl = new Howl({
          src: [symbol.sound],
          volume: 0.7,
          onload: () => console.log(`[AUDIO] ✅ Arquivo carregado: ${symbol.sound}`),
          onloaderror: (id, error) => {
            console.warn(`[AUDIO] ❌ Erro ao carregar: ${symbol.sound}`, error);
            playSynthenticSound(symbol);
          },
          onplayerror: (id, error) => {
            console.warn(`[AUDIO] ❌ Erro ao reproduzir: ${symbol.sound}`, error);
            playSynthenticSound(symbol);
          }
        });
        
        howl.play();
        console.log(`[AUDIO] ✅ Reproduzindo: ${symbol.sound}`);
        return;
      } catch (error) {
        console.warn(`[AUDIO] ❌ Howler falhou para ${symbol.sound}:`, error);
      }
    }

    // Fallback para som sintético
    playSynthenticSound(symbol);
  };

  // Função para gerar som sintético melhorado
  const playSynthenticSound = (symbol: ActivitySymbol) => {
    try {
      console.log(`[AUDIO] 🎵 Gerando som sintético para: ${symbol.name} (${symbol.category})`);
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();

      // Garantir que o AudioContext está ativo
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const frequency = categoryFrequencies[symbol.category] || 440;
      const waveType = categoryWaveTypes[symbol.category] || 'sine';
      
      // Criar oscilador
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = waveType;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      // Envelope ADSR para som mais natural
      const now = audioContext.currentTime;
      const attackTime = 0.05;
      const decayTime = 0.1;
      const sustainLevel = 0.4;
      const releaseTime = 0.3;
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.6, now + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime);
      
      // Adicionar filtro para tom mais agradável
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, now);
      
      // Conectar os nós
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Reproduzir
      oscillator.start(now);
      oscillator.stop(now + attackTime + decayTime + releaseTime);
      
      console.log(`[AUDIO] ✅ Som sintético: ${symbol.category} - ${frequency}Hz (${waveType})`);
      
      // Limpar recursos
      oscillator.onended = () => {
        try {
          oscillator.disconnect();
          gainNode.disconnect();
          filter.disconnect();
          audioContext.close();
        } catch (error) {
          console.warn('[AUDIO] Erro ao limpar recursos:', error);
        }
      };
      
    } catch (error) {
      console.error('[AUDIO] ❌ Falha completa no áudio:', error);
      // Último fallback: beep simples do sistema
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.connect(gain);
        gain.connect(context.destination);
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
        osc.start();
        osc.stop(context.currentTime + 0.2);
        console.log('[AUDIO] 🔔 Beep de fallback reproduzido');
      } catch (fallbackError) {
        console.error('[AUDIO] ❌ Até o fallback falhou:', fallbackError);
      }
    }
  };

  const handleSymbolClick = (symbolIndex: number) => {
    if (isPlaying) return;
    if (!startTime) setStartTime(Date.now());

    // Som imediato
    playSymbolSound(activity.symbols[symbolIndex]);

    let newSelected = [...selectedSymbols, symbolIndex];
    setSelectedSymbols(newSelected);

    if (activity.type === 'sequence' && activity.correctOrder) {
      if (newSelected.length === activity.correctOrder.length) {
        const isCorrect = newSelected.every((sel, idx) => sel === activity.correctOrder![idx]);
        const timeElapsed = Date.now() - (startTime || Date.now());
        setShowFeedback(isCorrect ? 'success' : 'error');
        setTimeout(() => {
          onActivityComplete(isCorrect, timeElapsed);
          setShowFeedback(null);
        }, 1500);
      }
    } else if (activity.type === 'selection') {
      const timeElapsed = Date.now() - (startTime || Date.now());
      setShowFeedback('success');
      setTimeout(() => {
        onActivityComplete(true, timeElapsed);
        setShowFeedback(null);
      }, 1000);
    } else if (activity.type === 'response') {
      if (newSelected.length >= 1) {
        const timeElapsed = Date.now() - (startTime || Date.now());
        setShowFeedback('success');
        setTimeout(() => {
          onActivityComplete(true, timeElapsed);
          setShowFeedback(null);
        }, 1200);
      }
    } else {
      const timeElapsed = Date.now() - (startTime || Date.now());
      setShowFeedback('success');
      setTimeout(() => {
        onActivityComplete(true, timeElapsed);
        setShowFeedback(null);
      }, 1000);
    }
  };

  const playSequence = async () => {
    if (!activity.correctOrder) return;

    for (let i = 0; i < activity.correctOrder.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (soundEnabled) {
        playSymbolSound(activity.symbols[activity.correctOrder[i]]);
      }

      await new Promise(resolve => setTimeout(resolve, 400));
    }

    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const getSymbolStyle = (symbolIndex: number) => {
    const isSelected = selectedSymbols.includes(symbolIndex);
    const isCurrentStep = currentStep === symbolIndex && isPlaying;
    const symbol = activity.symbols[symbolIndex];
    
    return {
      backgroundColor: isSelected ? symbol.color : `${symbol.color}20`,
      borderColor: symbol.color,
      transform: isCurrentStep ? 'scale(1.2)' : isSelected ? 'scale(1.1)' : 'scale(1)',
      boxShadow: isCurrentStep ? `0 0 20px ${symbol.color}` : isSelected ? `0 4px 12px ${symbol.color}40` : 'none'
    };
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{activity.title}</h3>
          {activity.timeLimit && (
            <span className="text-sm text-gray-500">
              ⏱️ {activity.timeLimit}s
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleSound}
            className="p-2"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          
          {activity.type === 'sequence' && (
            <Button
              variant="outline"
              size="sm"
              onClick={startActivity}
              disabled={isPlaying}
              className="flex items-center gap-1"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Reproduzindo...' : 'Mostrar Sequência'}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetActivity}
            className="p-2"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Instruction */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/30">
        <p className="text-center text-sm font-medium text-blue-800 dark:text-blue-200">
          {activity.instruction}
        </p>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="flex-1 p-8 bg-white dark:bg-gray-900 relative overflow-hidden"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {activity.symbols.map((symbol, index) => (
            <div
              key={symbol.id}
              className="aspect-square border-4 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
              style={getSymbolStyle(index)}
              onClick={() => handleSymbolClick(index)}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{symbol.emoji}</div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {symbol.name}
                </div>
              </div>
              
              {/* Selection indicator */}
              {selectedSymbols.includes(index) && (
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {selectedSymbols.indexOf(index) + 1}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`
              text-6xl animate-bounce
              ${showFeedback === 'success' ? 'text-green-500' : 'text-red-500'}
            `}>
              {showFeedback === 'success' ? '🎉' : '❌'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveCanvas;
