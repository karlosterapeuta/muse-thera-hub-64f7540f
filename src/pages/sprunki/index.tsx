import React, { useState, useEffect, useCallback } from 'react';
import type { SensorSyncSettings, TherapyMetrics, GameMode } from './types/sensorSync';
import { gameModes } from './utils/colorTheory';
import { enhancedAudio } from './utils/enhancedAudioSynthesis';
import SensorCanvas from './components/SensorCanvas';
import ModeSelector from './components/ModeSelector';
import AdaptiveControls from './components/AdaptiveControls';
import TherapyMetricsComponent from './components/TherapyMetrics';
import GamificationSystem from './components/GamificationSystem';
import InstrumentSelector from './components/InstrumentSelector';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2, Play, Pause, Music2, Trophy } from 'lucide-react';

const SensorSyncGame: React.FC = () => {
  const { toast } = useToast();
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentMode, setCurrentMode] = useState<GameMode>(gameModes.calm);
  const [settings, setSettings] = useState<SensorSyncSettings>({
    sensitivity: 1.0,
    visualIntensity: 0.7,
    audioVolume: 0.6,
    showTrails: true,
    enableVibration: false,
    autoAdaptive: true,
    currentMode: 'calm'
  });

  const [metrics, setMetrics] = useState<TherapyMetrics>({
    sessionDuration: 0,
    movementCount: 0,
    averageIntensity: 0,
    modeChanges: 0,
    creativePatterns: 0
  });

  const [selectedInstrument, setSelectedInstrument] = useState('piano');
  const [showGamification, setShowGamification] = useState(true);

  const initializeAudio = useCallback(async () => {
    setIsInitializing(true);
    try {
      const success = await enhancedAudio.initialize();
      setAudioInitialized(success);
      setShowAudioPrompt(false);
      
      if (success) {
        enhancedAudio.setInstrument(selectedInstrument);
        toast({
          title: "🎵 SensorSync Aprimorado Pronto!",
          description: "Agora com física avançada, múltiplos instrumentos e gamificação!",
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
      setShowAudioPrompt(false);
      setAudioInitialized(true);
    } finally {
      setIsInitializing(false);
    }
  }, [toast, selectedInstrument]);

  const handleModeChange = useCallback((mode: GameMode) => {
    setCurrentMode(mode);
    setSettings(prev => ({ ...prev, currentMode: mode.id }));
    setMetrics(prev => ({ ...prev, modeChanges: prev.modeChanges + 1 }));
    
    toast({
      title: `🎮 Modo ${mode.name}`,
      description: mode.description,
    });
  }, [toast]);

  const handleSettingsChange = useCallback((newSettings: Partial<SensorSyncSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Apply audio volume
      if (newSettings.audioVolume !== undefined) {
        enhancedAudio.setMasterVolume(newSettings.audioVolume);
      }
      
      return updated;
    });
  }, []);

  const handleMetricsUpdate = useCallback((newMetrics: Partial<TherapyMetrics>) => {
    setMetrics(prev => ({ ...prev, ...newMetrics }));
  }, []);

  const togglePlayback = useCallback(async () => {
    if (!audioInitialized) {
      await initializeAudio();
    }
    setIsPlaying(prev => !prev);
  }, [audioInitialized, initializeAudio]);

  const clearCanvas = useCallback(() => {
    enhancedAudio.stopAll();
    setMetrics(prev => ({
      ...prev,
      movementCount: 0,
      averageIntensity: 0,
      creativePatterns: 0
    }));
    
    toast({
      title: "🧹 Canvas Limpo!",
      description: "Nova sessão iniciada - continue criando!",
    });
  }, [toast]);

  const handleInstrumentChange = useCallback((instrument: string) => {
    setSelectedInstrument(instrument);
    enhancedAudio.setInstrument(instrument);
    
    toast({
      title: `🎼 ${instrument.charAt(0).toUpperCase() + instrument.slice(1)}`,
      description: "Instrumento selecionado! Toque na tela para ouvir.",
    });
  }, [toast]);

  const handleLevelUp = useCallback((newLevel: number) => {
    toast({
      title: `🎉 Nível ${newLevel}!`,
      description: "Parabéns! Você evoluiu em sua jornada musical!",
    });
  }, [toast]);

  const handleAchievementUnlocked = useCallback((achievement: any) => {
    toast({
      title: `🏆 Conquista Desbloqueada!`,
      description: achievement.name,
    });
  }, [toast]);

  // Apply volume changes
  useEffect(() => {
    enhancedAudio.setMasterVolume(settings.audioVolume);
  }, [settings.audioVolume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      enhancedAudio.cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-800 dark:via-pink-800 dark:to-blue-800 text-white p-4 sm:p-6 shadow-xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            🎵 SENSORSYNC PRO
          </h1>
          <p className="text-sm sm:text-lg opacity-90 mb-2">
            Música Visual Interativa com IA • Física Avançada • Gamificação Terapêutica
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm">
            <span className={`w-2 h-2 rounded-full animate-pulse ${audioInitialized ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
            {audioInitialized ? 'Sistema Avançado Ativo' : 'Clique para ativar'} • TEA Revolution
          </div>
        </div>
      </div>

      {/* Audio Initialization Prompt */}
      {showAudioPrompt && !audioInitialized && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 border-b-2 border-yellow-300 p-3 sm:p-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <div className="text-xl sm:text-2xl">🎵</div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium text-sm sm:text-base">
                  Ative o sistema aprimorado para experiência completa com física e múltiplos instrumentos!
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm">
                  (Também funciona apenas com visual)
                </p>
              </div>
              <Button 
                onClick={initializeAudio}
                disabled={isInitializing}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ativando Sistema...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Ativar SensorSync Pro
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Controls */}
      <div className="p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4">
          <Button
            onClick={togglePlayback}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pausar' : 'Iniciar'}
          </Button>
          
          <Button
            onClick={clearCanvas}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            🧹 Limpar Canvas
          </Button>

          <Button
            onClick={() => setShowGamification(!showGamification)}
            variant="outline"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          >
            <Trophy className="w-4 h-4 mr-2" />
            {showGamification ? 'Ocultar' : 'Mostrar'} Conquistas
          </Button>
          
          <div className="text-sm text-purple-700 dark:text-purple-300">
            Modo: <span className="font-bold">{currentMode.name}</span> • 
            Instrumento: <span className="font-bold capitalize">{selectedInstrument}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-6 min-h-0">
        {/* Left Panel - Controls */}
        <div className="lg:w-80 space-y-6">
          {/* Mode Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300 mb-4">
              🎮 Modos de Jogo
            </h3>
            <ModeSelector
              currentMode={currentMode}
              onModeChange={handleModeChange}
            />
          </div>

          {/* Instrument Selector */}
          <InstrumentSelector
            selectedInstrument={selectedInstrument}
            onInstrumentChange={handleInstrumentChange}
          />

          {/* Adaptive Controls */}
          <AdaptiveControls
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 min-h-[400px] lg:min-h-0">
          <EnhancedSensorCanvas
            currentMode={currentMode}
            settings={settings}
            onMetricsUpdate={handleMetricsUpdate}
            selectedInstrument={selectedInstrument}
          />
        </div>

        {/* Right Panel - Metrics & Gamification */}
        <div className="lg:w-80 space-y-6">
          {/* Therapy Metrics */}
          <TherapyMetricsComponent metrics={metrics} />

          {/* Gamification System */}
          {showGamification && (
            <GamificationSystem
              metrics={metrics}
              currentMode={currentMode.id}
              onLevelUp={handleLevelUp}
              onAchievementUnlocked={handleAchievementUnlocked}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SensorSyncGame;
