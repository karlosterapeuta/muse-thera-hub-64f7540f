
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Music } from "lucide-react";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";

type InstrumentType = "bell" | "xylophone" | "keyboard";

interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  instrument: InstrumentType;
  color: string;
}

const TeaHero = () => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Lista de músicas disponíveis
  const songs: Song[] = [
    {
      id: "twinkle-bell",
      title: "Brilha, Brilha Estrelinha",
      artist: "Clássico Infantil",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200"
    },
    {
      id: "happy-birthday-xylophone",
      title: "Parabéns para Você",
      artist: "Tradicional",
      difficulty: "Fácil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200"
    },
    {
      id: "scale-keyboard",
      title: "Escala de Dó Maior",
      artist: "Exercício Musical",
      difficulty: "Fácil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200"
    },
    {
      id: "mary-lamb-bell",
      title: "Mary Had a Little Lamb",
      artist: "Infantil",
      difficulty: "Fácil",
      instrument: "bell",
      color: "bg-red-100 border-red-200"
    },
    {
      id: "ode-joy-xylophone",
      title: "Ode à Alegria",
      artist: "Beethoven",
      difficulty: "Médio",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200"
    },
    {
      id: "fur-elise-keyboard",
      title: "Para Elisa",
      artist: "Beethoven",
      difficulty: "Difícil",
      instrument: "keyboard",
      color: "bg-green-100 border-green-200"
    },
    {
      id: "frere-jacques-bell",
      title: "Frère Jacques",
      artist: "Tradicional Francesa",
      difficulty: "Médio",
      instrument: "bell",
      color: "bg-red-100 border-red-200"
    },
    {
      id: "canon-xylophone",
      title: "Cânone em Ré",
      artist: "Pachelbel",
      difficulty: "Difícil",
      instrument: "xylophone",
      color: "bg-blue-100 border-blue-200"
    }
  ];

  const handleNotePlay = (frequency: number, color: string) => {
    playNoteSound(`${frequency}Hz`);
    
    const instrumentEmoji = selectedSong?.instrument === "bell" ? "🔔" : 
                           selectedSong?.instrument === "xylophone" ? "🎵" : "🎹";
    
    console.log(`${instrumentEmoji} ${selectedSong?.instrument} tocado: ${frequency}Hz (${color})`);
  };

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
    setGameStarted(false);
  };

  const handleStartGame = () => {
    if (selectedSong) {
      setGameStarted(true);
    }
  };

  const handleBackToSelection = () => {
    setSelectedSong(null);
    setGameStarted(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-800";
      case "Médio": return "bg-yellow-100 text-yellow-800";
      case "Difícil": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getInstrumentIcon = (instrument: InstrumentType) => {
    switch (instrument) {
      case "bell": return "🔔";
      case "xylophone": return "🎵";
      case "keyboard": return "🎹";
      default: return "🎵";
    }
  };

  if (gameStarted && selectedSong) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            TEA-Hero - {selectedSong.title} {getInstrumentIcon(selectedSong.instrument)}
          </h1>
          <Button onClick={handleBackToSelection} variant="secondary" size="sm">
            Voltar ao Menu
          </Button>
        </div>
        <GuitarHeroGame 
          instrumentType={selectedSong.instrument} 
          onNotePlay={handleNotePlay}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            TEA-Hero 🎵
          </h1>
          <p className="text-lg text-gray-600">
            Escolha uma música para começar a jogar!
          </p>
        </div>

        {!selectedSong ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
              <Card 
                key={song.id}
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${song.color}`}
                onClick={() => handleSongSelect(song)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-3 text-4xl">
                    {getInstrumentIcon(song.instrument)}
                  </div>
                  <CardTitle className="text-lg">{song.title}</CardTitle>
                  <p className="text-sm text-gray-600">{song.artist}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex justify-center items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(song.difficulty)}`}>
                      {song.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {song.instrument === "bell" ? "Sino" : 
                       song.instrument === "xylophone" ? "Xilofone" : "Teclado"}
                    </span>
                  </div>
                  <Button size="sm" className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Selecionar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="mb-6">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 text-6xl">
                  {getInstrumentIcon(selectedSong.instrument)}
                </div>
                <CardTitle className="text-2xl">{selectedSong.title}</CardTitle>
                <p className="text-lg text-gray-600">{selectedSong.artist}</p>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex justify-center items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedSong.difficulty)}`}>
                    Dificuldade: {selectedSong.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                    {selectedSong.instrument === "bell" ? "Sino" : 
                     selectedSong.instrument === "xylophone" ? "Xilofone" : "Teclado"}
                  </span>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Como jogar:</strong>
                  </p>
                  <p className="text-sm text-blue-700">
                    Use as teclas <strong>1-7</strong> para tocar as notas quando elas passarem pela zona dourada!
                  </p>
                </div>

                <div className="flex space-x-3 justify-center">
                  <Button onClick={handleBackToSelection} variant="outline">
                    Escolher Outra Música
                  </Button>
                  <Button onClick={handleStartGame} size="lg">
                    <Play className="w-5 h-5 mr-2" />
                    Começar a Jogar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Cada música foi especialmente adaptada para diferentes instrumentos e níveis de dificuldade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeaHero;
