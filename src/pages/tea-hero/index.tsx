
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Piano, Music } from "lucide-react";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";

type InstrumentType = "bell" | "xylophone" | "keyboard";

const TeaHero = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType | null>(null);

  const handleNotePlay = (frequency: number, color: string) => {
    playNoteSound(`${frequency}Hz`);
    
    const instrumentEmoji = selectedInstrument === "bell" ? "🔔" : 
                           selectedInstrument === "xylophone" ? "🎵" : "🎹";
    
    console.log(`${instrumentEmoji} ${selectedInstrument} tocado: ${frequency}Hz (${color})`);
  };

  const handleBackToSelection = () => {
    setSelectedInstrument(null);
  };

  if (selectedInstrument) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            TEA-Hero - {selectedInstrument === "bell" ? "🔔 Sino" : 
                       selectedInstrument === "xylophone" ? "🎵 Xilofone" : "🎹 Teclado"}
          </h1>
          <Button onClick={handleBackToSelection} variant="secondary" size="sm">
            Voltar à Seleção
          </Button>
        </div>
        <GuitarHeroGame 
          instrumentType={selectedInstrument} 
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
            Escolha seu instrumento musical favorito e comece a jogar!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sino */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-red-50 to-red-100 border-red-200"
            onClick={() => setSelectedInstrument("bell")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-red-500 rounded-full w-20 h-20 flex items-center justify-center">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-red-700">🔔 Sino</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 mb-4">
                Sons suaves e relaxantes para terapia musical com sinos coloridos.
              </p>
              <div className="flex justify-center space-x-2">
                {["#FF0000", "#FF6600", "#FFFF00", "#00CC00", "#0099FF", "#6600FF", "#FF1493"].map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Xilofone */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
            onClick={() => setSelectedInstrument("xylophone")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-blue-500 rounded-full w-20 h-20 flex items-center justify-center">
                <Music className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-blue-700">🎵 Xilofone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 mb-4">
                Sons cristalinos e alegres do xilofone com cores vibrantes.
              </p>
              <div className="flex justify-center space-x-2">
                {["#E53935", "#FF9800", "#FFEB3B", "#4CAF50", "#2196F3", "#9C27B0", "#E91E63"].map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Teclado */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 border-green-200"
            onClick={() => setSelectedInstrument("keyboard")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-green-500 rounded-full w-20 h-20 flex items-center justify-center">
                <Piano className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-700">🎹 Teclado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 mb-4">
                Piano virtual com figuras musicais educativas e notas coloridas.
              </p>
              <div className="flex justify-center space-x-2">
                {["#FF0000", "#FF9933", "#FFFF00", "#33CC33", "#33CCFF", "#0000FF", "#9933CC"].map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Use as teclas <strong>1-7</strong> para tocar as notas quando elas passarem pela zona de acerto!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeaHero;
