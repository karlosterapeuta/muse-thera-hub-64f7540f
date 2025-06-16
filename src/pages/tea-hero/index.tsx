import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";

const TeaHero = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<"bell" | "xylophone" | "keyboard">("bell");
  const [selectedSong, setSelectedSong] = useState<{ id: string; title: string; hasSequence?: boolean; } | null>(null);
  const [gameSpeed, setGameSpeed] = useState(1.0);
  const [gameStarted, setGameStarted] = useState(false);

  // 18 MÚSICAS INFANTIS COMPLETAS com sequências sincronizadas
  const songs = {
    bell: [
      { id: "twinkle-bell", title: "Brilha, Brilha Estrelinha", hasSequence: true },
      { id: "mary-lamb-bell", title: "Maria, Maria", hasSequence: true },
      { id: "borboletinha-bell", title: "Borboletinha", hasSequence: true },
      { id: "galinha-pintadinha-bell", title: "Galinha Pintadinha", hasSequence: true },
      { id: "atirei-pau-bell", title: "Atirei o Pau no Gato", hasSequence: true },
      { id: "escravos-jó-bell", title: "Escravos de Jó", hasSequence: true },
    ],
    xylophone: [
      { id: "happy-birthday-xylophone", title: "Parabéns para Você", hasSequence: true },
      { id: "xuxa-xylophone", title: "Ilariê (Xuxa)", hasSequence: true },
      { id: "sapo-nao-lava-xylophone", title: "O Sapo Não Lava o Pé", hasSequence: true },
      { id: "frozen-let-it-go-xylophone", title: "Let It Go (Frozen)", hasSequence: true },
      { id: "peppa-pig-xylophone", title: "Peppa Pig Theme", hasSequence: true },
      { id: "patrulha-canina-xylophone", title: "Patrulha Canina", hasSequence: true },
    ],
    keyboard: [
      { id: "scale-keyboard", title: "Escala de Dó Maior", hasSequence: true },
      { id: "hot-cross-keyboard", title: "Três Notas Mágicas", hasSequence: true },
      { id: "aquarela-keyboard", title: "Aquarela", hasSequence: true },
      { id: "caranguejo-keyboard", title: "Caranguejo", hasSequence: true },
      { id: "ciranda-keyboard", title: "Ciranda, Cirandinha", hasSequence: true },
      { id: "boi-da-cara-preta-keyboard", title: "Boi da Cara Preta", hasSequence: true },
    ]
  };

  const handleNotePlay = (frequency: number, color: string) => {
    console.log(`🎵 TEA-Hero: ${selectedInstrument} at ${frequency}Hz (${color})`);
    playNoteSound(`${frequency}Hz`, selectedInstrument);
  };

  const handleStartGame = () => {
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
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🎵 TEA-Hero
        </h1>
        <p className="text-lg text-muted-foreground">
          Jogo musical terapêutico com áudio 100% sincronizado para TEA
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">🔊 Áudio TEA-Optimizado</Badge>
          <Badge variant="secondary">🎼 18 Melodias Infantis</Badge>
          <Badge variant="secondary">🎯 Frequências Sincronizadas</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎛️ Configurações TEA
            </CardTitle>
            <CardDescription>
              Configure instrumento, música e velocidade para a experiência TEA ideal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Seleção de Instrumento */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Instrumento</label>
              <Select value={selectedInstrument} onValueChange={(value) => setSelectedInstrument(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bell">🔔 Sino (C4: 261-493 Hz)</SelectItem>
                  <SelectItem value="xylophone">🎵 Xilofone (C5: 523-987 Hz)</SelectItem>
                  <SelectItem value="keyboard">🎹 Teclado (C4: 261-493 Hz)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Seleção de Música */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Música TEA (18 disponíveis)</label>
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
                  <SelectValue placeholder="Selecione uma música..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free-mode">🎲 Modo Livre (Padrão Aleatório)</SelectItem>
                  {songs[selectedInstrument].map((song) => (
                    <SelectItem key={song.id} value={song.id}>
                      🎼 {song.title}
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

            {/* Botão Iniciar */}
            <Button onClick={handleStartGame} className="w-full" size="lg">
              🎮 Iniciar TEA-Hero
            </Button>
          </CardContent>
        </Card>

        {/* Informações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ℹ️ Sobre o TEA-Hero
            </CardTitle>
            <CardDescription>
              Sistema de áudio musical terapêutico otimizado para TEA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔊</div>
                <div>
                  <h4 className="font-medium">Áudio TEA-Optimizado</h4>
                  <p className="text-sm text-muted-foreground">
                    Volume 60% amplificado, compressão dinâmica e frequências sincronizadas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎼</div>
                <div>
                  <h4 className="font-medium">18 Melodias Infantis</h4>
                  <p className="text-sm text-muted-foreground">
                    Sequências musicais autênticas e reconhecíveis para cada instrumento
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="font-medium">Sincronização Perfeita</h4>
                  <p className="text-sm text-muted-foreground">
                    Cada nota visual toca exatamente a frequência correspondente
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎮</div>
                <div>
                  <h4 className="font-medium">Como Jogar</h4>
                  <p className="text-sm text-muted-foreground">
                    Use as teclas 1-7 para tocar as notas quando passarem pela zona dourada
                  </p>
                </div>
              </div>
            </div>

            {/* Status da música selecionada */}
            {selectedSong && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  🎼 Música Selecionada:
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedSong.title} para {selectedInstrument}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  ✅ Sequência musical autêntica com frequências sincronizadas
                </p>
              </div>
            )}

            {!selectedSong && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                  🎲 Modo Livre Ativo
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Padrão de notas aleatório para prática livre
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeaHero;
