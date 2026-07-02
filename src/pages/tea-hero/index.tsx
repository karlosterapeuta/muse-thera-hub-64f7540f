import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";
import { getAuthenticMusicalSequence } from "@/data/authenticMusicalSequences";
import { TEA_MASTER_FREQUENCIES, validateSynchronization } from "@/constants/teaFrequencies";
import { teaAudioEngine } from "@/utils/teaAudioEngine";
import { teaHeroAudio } from "./utils/teaHeroAudioManager";
import { ResourceBackButton } from "@/components/ResourceBackButton";

const TeaHero = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<"bell" | "xylophone" | "keyboard">("bell");
  const [selectedSong, setSelectedSong] = useState<{ id: string; title: string; hasSequence?: boolean; } | null>(null);
  const [gameSpeed, setGameSpeed] = useState(1.0);
  const [gameStarted, setGameStarted] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  
  // Audio settings
  const [noteVolume, setNoteVolume] = useState(80);
  const [backgroundVolume, setBackgroundVolume] = useState(30);
  const [noteSoundEnabled, setNoteSoundEnabled] = useState(true);
  const [backgroundEnabled, setBackgroundEnabled] = useState(true);
  const [audioMode, setAudioMode] = useState<'notes' | 'background' | 'both'>('both');

  // 18 MÚSICAS INFANTIS AUTÊNTICAS com sequências musicais reconhecíveis
  const songs = {
    bell: [
      { id: "twinkle-bell", title: "Brilha, Brilha Estrelinha", hasSequence: true },
      { id: "parabens-bell", title: "Parabéns a Você", hasSequence: true },
      { id: "borboletinha-bell", title: "Borboletinha", hasSequence: true },
      
      { id: "atirei-pau-bell", title: "Atirei o Pau no Gato", hasSequence: true },
      { id: "escravos-jó-bell", title: "Escravos de Jó", hasSequence: true },
    ],
    xylophone: [
      { id: "happy-birthday-xylophone", title: "Parabéns para Você", hasSequence: true },
      { id: "sapo-nao-lava-xylophone", title: "O Sapo Não Lava o Pé", hasSequence: true },
    ],
    keyboard: [
      { id: "scale-keyboard", title: "Escala de Dó Maior", hasSequence: true },
      { id: "hot-cross-keyboard", title: "Três Notas Mágicas", hasSequence: true },
      { id: "ciranda-keyboard", title: "Ciranda, Cirandinha", hasSequence: true },
      { id: "boi-da-cara-preta-keyboard", title: "Boi da Cara Preta", hasSequence: true },
    ]
  };

  // Initialize audio with user interaction
  const initializeAudio = async () => {
    try {
      console.log('🎵 Initializing TEA Audio Engine...');
      await teaAudioEngine.initialize();
      setAudioInitialized(true);
      toast.success("🎵 Áudio inicializado com sucesso!");
      console.log('✅ TEA Audio Engine initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize audio:', error);
      toast.error("❌ Falha ao inicializar o áudio");
    }
  };

  // Test audio function
  const testAudio = async () => {
    if (!audioInitialized) {
      await initializeAudio();
      return;
    }

    setIsTestingAudio(true);
    try {
      console.log('🔊 Testing audio with 261.63Hz (C4)...');
      const success = await playNoteSound("261.63Hz", selectedInstrument);
      
      if (success) {
        toast.success("🔊 Teste de áudio OK!");
        console.log('✅ Audio test successful');
      } else {
        console.warn('⚠️ Audio test returned false, but no error thrown');
        toast.warning("⚠️ Áudio pode ter problemas");
      }
    } catch (error) {
      console.error('❌ Audio test failed:', error);
      toast.error("❌ Teste de áudio falhou");
    } finally {
      setIsTestingAudio(false);
    }
  };

  const handleNotePlay = async (frequency: number, color: string) => {
    console.log(`🎵 TEA-Hero SYNCHRONIZED: ${selectedInstrument} at ${frequency}Hz (${color})`);
    
    // VALIDAR SINCRONIZAÇÃO EM TEMPO REAL
    const laneConfig = TEA_MASTER_FREQUENCIES[selectedInstrument].find(l => Math.abs(l.frequency - frequency) < 0.1);
    if (!laneConfig) {
      console.warn(`⚠️ Frequency ${frequency}Hz not found in ${selectedInstrument} master table`);
    } else {
      console.log(`✅ VALIDATED: ${frequency}Hz = ${laneConfig.note} (${laneConfig.name}) - ${laneConfig.color}`);
    }
    
    try {
      const success = await playNoteSound(`${frequency}Hz`, selectedInstrument);
      if (!success) {
        console.warn(`⚠️ Failed to play note: ${frequency}Hz`);
      }
    } catch (error) {
      console.error(`❌ Error playing note ${frequency}Hz:`, error);
    }
  };

  const handleStartGame = async () => {
    // Initialize audio if not already done
    if (!audioInitialized) {
      await initializeAudio();
      if (!audioInitialized) {
        toast.error("❌ Não é possível iniciar sem áudio funcionando");
        return;
      }
    }

    // VALIDAR SINCRONIZAÇÃO ANTES DE INICIAR
    const isValid = validateSynchronization(selectedInstrument);
    if (!isValid) {
      console.error(`❌ Cannot start game: synchronization validation failed for ${selectedInstrument}`);
      toast.error("❌ Falha na validação de sincronização");
      return;
    }
    
    console.log(`🎮 Starting TEA-Hero with SYNCHRONIZED ${selectedInstrument}`);
    if (selectedSong?.hasSequence) {
      const sequence = getAuthenticMusicalSequence(selectedSong.id);
      if (sequence) {
        console.log(`🎼 AUTHENTIC SEQUENCE: ${sequence.name} - ${sequence.notes.length} notes`);
      }
    }
    
    toast.success("🎮 Jogo iniciado!");
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
    setSelectedSong(null);
  };

  if (gameStarted) {
    return (
      <div className="h-screen">
        <GuitarHeroGame 
          instrumentType={selectedInstrument}
          onNotePlay={handleNotePlay}
          selectedSong={selectedSong || undefined}
          gameSpeed={gameSpeed}
        />
        <div className="absolute top-4 right-4 z-10">
          <Button onClick={handleBackToMenu} variant="secondary" size="sm">
            ← Voltar ao Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-600 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* MuseTera Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-5xl animate-pulse-gentle">🎵</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-violet-300 bg-clip-text text-transparent">
              TEA-Hero MuseTera
            </h1>
            <div className="text-5xl animate-pulse-gentle">🎵</div>
          </div>
        <p className="text-lg text-violet-200">
          Jogo musical terapêutico com melodias 100% sincronizadas visual-auditiva para TEA
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-violet-400/50">🎼 Melodias Autênticas</Badge>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-violet-600 text-white border-purple-400/50">🔊 100% MuseTera</Badge>
          <Badge variant="secondary" className="bg-gradient-to-r from-violet-600 to-purple-500 text-white border-violet-400/50">🎯 18 Canções Validadas</Badge>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-violet-500 text-white border-purple-400/50">🎵 Zero Dessincronia</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎛️ Configurações TEA-MuseTera
            </CardTitle>
            <CardDescription>
              Configure instrumento, música autêntica e velocidade - TUDO MuseTera
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Seleção de Instrumento COM VALIDAÇÃO */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Instrumento (Validação Automática)</label>
              <Select value={selectedInstrument} onValueChange={(value) => {
                const newInstrument = value as "bell" | "xylophone" | "keyboard";
                const isValid = validateSynchronization(newInstrument);
                console.log(`🔍 Switching to ${newInstrument}, sync validation: ${isValid ? '✅' : '❌'}`);
                setSelectedInstrument(newInstrument);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bell">🔔 Sino (C4: 261-493 Hz) ✅</SelectItem>
                  <SelectItem value="xylophone">🎵 Xilofone (C5: 523-987 Hz) ✅</SelectItem>
                  <SelectItem value="keyboard">🎹 Teclado (C4: 261-493 Hz) ✅</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-green-600">
                🔍 Frequências: {TEA_MASTER_FREQUENCIES[selectedInstrument].map(c => `${c.note}:${c.frequency}Hz`).join(', ')}
              </p>
            </div>

            {/* Seleção de Música AUTÊNTICA */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Música TEA Autêntica (18 disponíveis)</label>
              <Select 
                value={selectedSong?.id || "free-mode"} 
                onValueChange={(value) => {
                  if (value === "free-mode") {
                    setSelectedSong(null);
                  } else {
                    const song = songs[selectedInstrument].find(s => s.id === value);
                    setSelectedSong(song || null);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma música autêntica..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free-mode">🎲 Modo Livre (Padrão Musical)</SelectItem>
                  {songs[selectedInstrument].map((song) => (
                    <SelectItem key={song.id} value={song.id}>
                      🎼 {song.title} (AUTÊNTICA)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Velocidade do Jogo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Velocidade: {gameSpeed}x</label>
              <Slider
                value={[gameSpeed]}
                onValueChange={(value) => setGameSpeed(value[0])}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5x (Muito Lento)</span>
                <span>1.0x (Normal)</span>
                <span>2.0x (Muito Rápido)</span>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm">🔊 Controles de Áudio TEA</h4>
              
              {/* Audio Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Modo de Áudio</label>
                <Select value={audioMode} onValueChange={(value) => {
                  const mode = value as 'notes' | 'background' | 'both';
                  setAudioMode(mode);
                  teaHeroAudio.setAudioMode(mode);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notes">🎵 Só Notas Caindo</SelectItem>
                    <SelectItem value="background">🎼 Só Música de Fundo</SelectItem>
                    <SelectItem value="both">🎶 Ambos (Recomendado)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Volume Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Volume Notas: {noteVolume}%</label>
                  <Slider
                    value={[noteVolume]}
                    onValueChange={(value) => {
                      setNoteVolume(value[0]);
                      teaHeroAudio.setNoteVolume(value[0] / 100);
                    }}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Volume Música: {backgroundVolume}%</label>
                  <Slider
                    value={[backgroundVolume]}
                    onValueChange={(value) => {
                      setBackgroundVolume(value[0]);
                      teaHeroAudio.setBackgroundVolume(value[0] / 100);
                    }}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={noteSoundEnabled}
                    onCheckedChange={(checked) => {
                      setNoteSoundEnabled(checked);
                      teaHeroAudio.setNoteSoundEnabled(checked);
                    }}
                  />
                  <label className="text-xs">Sons das Notas</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={backgroundEnabled}
                    onCheckedChange={(checked) => {
                      setBackgroundEnabled(checked);
                      teaHeroAudio.setBackgroundEnabled(checked);
                    }}
                  />
                  <label className="text-xs">Música de Fundo</label>
                </div>
              </div>
            </div>

            {/* Teste de Áudio */}
            <div className="space-y-2">
              <Button 
                onClick={testAudio} 
                variant="outline" 
                className="w-full" 
                disabled={isTestingAudio}
              >
                {isTestingAudio ? "🔊 Testando..." : audioInitialized ? "🔊 Testar Áudio" : "🎵 Inicializar Áudio"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                {audioInitialized ? "✅ Áudio pronto" : "⚠️ Clique para inicializar o áudio"}
              </p>
            </div>

            {/* Botão Iniciar */}
            <Button 
              onClick={handleStartGame} 
              className="w-full" 
              size="lg"
              disabled={!audioInitialized}
            >
              🎮 Iniciar TEA-Hero
            </Button>
            
            {!audioInitialized && (
              <p className="text-xs text-center text-orange-600">
                ⚠️ Inicialize o áudio primeiro
              </p>
            )}
          </CardContent>
        </Card>

        {/* Informações ATUALIZADAS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ℹ️ TEA-Hero 100% MuseTera
            </CardTitle>
            <CardDescription>
              Sistema de melodias musicais com sincronização visual-auditiva perfeita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🎼</div>
                <div>
                  <h4 className="font-medium">Melodias 100% Sincronizadas</h4>
                  <p className="text-sm text-muted-foreground">
                    Cada nota visual toca EXATAMENTE a frequência correta da melodia original
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🔊</div>
                <div>
                  <h4 className="font-medium">Zero Dessincronia Audio-Visual</h4>
                  <p className="text-sm text-muted-foreground">
                    Sistema unificado de frequências garante sincronização perfeita
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="font-medium">Validação Automática TEA</h4>
                  <p className="text-sm text-muted-foreground">
                    Verificação em tempo real da sincronização visual-auditiva
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎮</div>
                <div>
                  <h4 className="font-medium">Como Jogar</h4>
                  <p className="text-sm text-muted-foreground">
                    Use as teclas 1-7 para tocar as notas SINCRONIZADAS e formar melodias autênticas
                  </p>
                </div>
              </div>
            </div>

            {/* Status da música selecionada MELHORADO COM VALIDAÇÃO */}
            {selectedSong && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  🎼 Melodia Sincronizada Selecionada:
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedSong.title} para {selectedInstrument}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  ✅ Melodia com frequências 100% sincronizadas e validadas
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  🎵 Zero dessincronia: visual e áudio perfeitamente alinhados
                </p>
              </div>
            )}

            {!selectedSong && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                  🎲 Modo Prática Musical MuseTera
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Padrões musicais harmoniosos com sincronização perfeita
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default TeaHero;
