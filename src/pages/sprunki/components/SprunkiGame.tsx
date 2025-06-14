
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SprunkiSlot, SprunkiSettings } from '../types';
import { sprunkiCharacters } from '../data/sprunkiCharacters';
import { sprunkiAudio } from '../utils/sprunkiAudioService';
import SprunkiCharacters from './SprunkiCharacters';
import SprunkiStage from './SprunkiStage';
import SprunkiControls from './SprunkiControls';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';

const STAGE_SLOTS = 8;

const SprunkiGame: React.FC = () => {
  const { toast } = useToast();
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(-1);
  const [bpm, setBpm] = useState(120);
  const [masterVolume, setMasterVolume] = useState(0.6);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [settings, setSettings] = useState<SprunkiSettings>({
    sensoryMode: false,
    individualVolumes: true,
    showAnimations: true,
    autoSave: true,
    visualFeedbackOnly: false
  });

  // Initialize stage slots
  const [stage, setStage] = useState<SprunkiSlot[]>(() => {
    const initialStage: SprunkiSlot[] = [];
    for (let i = 0; i < STAGE_SLOTS; i++) {
      initialStage.push({
        id: `slot-${i}`,
        characterId: null,
        position: i,
        isActive: false,
        volume: 0.8
      });
    }
    return initialStage;
  });

  const initializeAudio = useCallback(async () => {
    setIsInitializing(true);
    try {
      const success = await sprunkiAudio.initialize();
      setAudioInitialized(success);
      setShowAudioPrompt(false);
      
      if (success) {
        toast({
          title: "🎵 Sprunki Pronto!",
          description: "Agora você pode criar música arrastando os personagens!",
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
      setShowAudioPrompt(false);
    } finally {
      setIsInitializing(false);
    }
  }, [toast]);

  const handleSlotClick = useCallback((slotIndex: number) => {
    setStage(prevStage => {
      const newStage = [...prevStage];
      const slot = newStage[slotIndex];
      
      if (slot.characterId === selectedCharacter) {
        // Remove character
        slot.characterId = null;
        sprunkiAudio.stopCharacterSound(`slot-${slotIndex}`);
      } else if (selectedCharacter) {
        // Add character
        slot.characterId = selectedCharacter;
        
        // Play sound preview
        if (audioInitialized) {
          const character = sprunkiCharacters.find(c => c.id === selectedCharacter);
          if (character) {
            sprunkiAudio.playCharacterSound(`slot-${slotIndex}`, character.frequency, character.type);
            
            // Stop preview after 1 second
            setTimeout(() => {
              sprunkiAudio.stopCharacterSound(`slot-${slotIndex}`);
            }, 1000);
          }
        }
      }
      
      return newStage;
    });
  }, [selectedCharacter, audioInitialized]);

  const playComposition = useCallback(async () => {
    if (isPlaying) return;
    
    if (!audioInitialized) {
      await initializeAudio();
    }
    
    setIsPlaying(true);
    setCurrentSlot(0);
    
    const beatDuration = (60 / bpm) * 1000;
    let currentSlotIndex = 0;
    
    const playNextSlot = async () => {
      if (currentSlotIndex >= STAGE_SLOTS) {
        setIsPlaying(false);
        setCurrentSlot(-1);
        sprunkiAudio.stopAllSounds();
        toast({
          title: "🎉 Apresentação Finalizada!",
          description: "Que música incrível você criou!",
        });
        return;
      }
      
      setCurrentSlot(currentSlotIndex);
      
      // Play all active characters in current slot
      if (!settings.visualFeedbackOnly && audioInitialized) {
        const slot = stage[currentSlotIndex];
        if (slot.characterId) {
          const character = sprunkiCharacters.find(c => c.id === slot.characterId);
          if (character) {
            sprunkiAudio.playCharacterSound(
              `playing-${slot.id}`, 
              character.frequency, 
              character.type
            );
          }
        }
      }
      
      currentSlotIndex++;
      
      if (isPlaying) {
        intervalRef.current = setTimeout(playNextSlot, beatDuration);
      }
    };
    
    playNextSlot();
  }, [stage, bpm, isPlaying, audioInitialized, settings.visualFeedbackOnly, toast, initializeAudio]);

  const stopComposition = useCallback(() => {
    setIsPlaying(false);
    setCurrentSlot(-1);
    sprunkiAudio.stopAllSounds();
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearStage = useCallback(() => {
    if (isPlaying) stopComposition();
    
    setStage(prevStage => 
      prevStage.map(slot => ({ ...slot, characterId: null }))
    );
    
    sprunkiAudio.stopAllSounds();
    
    toast({
      title: "🧹 Palco Limpo!",
      description: "Todos os personagens voltaram para casa",
    });
  }, [isPlaying, stopComposition, toast]);

  const saveComposition = useCallback(() => {
    const hasCharacters = stage.some(slot => slot.characterId);
    
    if (!hasCharacters) {
      toast({
        title: "🎭 Palco Vazio",
        description: "Coloque alguns personagens no palco primeiro!",
        variant: "destructive"
      });
      return;
    }
    
    const composition = {
      id: `sprunki-comp-${Date.now()}`,
      name: `🎵 Música Sprunki ${new Date().toLocaleTimeString()}`,
      slots: stage,
      bpm,
      volume: masterVolume,
      createdAt: new Date().toISOString()
    };
    
    try {
      const saved = localStorage.getItem('sprunki-compositions') || '[]';
      const compositions = JSON.parse(saved);
      compositions.push(composition);
      localStorage.setItem('sprunki-compositions', JSON.stringify(compositions));
      
      toast({
        title: "🎉 Música Salva!",
        description: `"${composition.name}" foi salva com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao salvar",
        description: "Tente novamente em alguns segundos",
        variant: "destructive"
      });
    }
  }, [stage, bpm, masterVolume, toast]);

  const updateSettings = useCallback((newSettings: Partial<SprunkiSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Apply audio settings
      if (newSettings.sensoryMode !== undefined) {
        sprunkiAudio.setSensoryMode(newSettings.sensoryMode);
      }
      if (newSettings.visualFeedbackOnly !== undefined) {
        sprunkiAudio.setVisualFeedbackOnly(newSettings.visualFeedbackOnly);
      }
      
      return updated;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      sprunkiAudio.cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-800 dark:via-pink-800 dark:to-blue-800 text-white p-4 sm:p-6 shadow-xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            🎵 SPRUNKI: O JOGO MUSICAL
          </h1>
          <p className="text-sm sm:text-lg opacity-90 mb-2">
            Crie música arrastando personagens para o palco!
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm">
            <span className={`w-2 h-2 rounded-full animate-pulse ${audioInitialized ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
            {audioInitialized ? 'Áudio Ativo' : 'Clique para ativar áudio'} • Adaptado para TEA • Interface intuitiva
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
                  Clique no botão para ativar os sons dos personagens!
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm">
                  (Funciona sem som também)
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
                    Ativando...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Ativar Sons
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <SprunkiControls
        isPlaying={isPlaying}
        onPlay={playComposition}
        onStop={stopComposition}
        onClear={clearStage}
        onSave={saveComposition}
        bpm={bpm}
        onBpmChange={setBpm}
        volume={masterVolume}
        onVolumeChange={setMasterVolume}
        settings={settings}
        onSettingsChange={updateSettings}
      />

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        <SprunkiCharacters
          characters={sprunkiCharacters}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
          settings={settings}
        />
        
        <SprunkiStage
          stage={stage}
          characters={sprunkiCharacters}
          selectedCharacter={selectedCharacter}
          onSlotClick={handleSlotClick}
          isPlaying={isPlaying}
          currentSlot={currentSlot}
          settings={settings}
        />
      </div>
    </div>
  );
};

export default SprunkiGame;
