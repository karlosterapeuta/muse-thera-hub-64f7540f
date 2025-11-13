
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2, Volume2, VolumeX } from "lucide-react";
import { playNoteSound } from "@/utils/audioUtils";

const bellNotes = [
  { note: "C4", label: "Dó", color: "#FF0000", frequency: 261.63 },
  { note: "D4", label: "Ré", color: "#FF9933", frequency: 293.66 },
  { note: "E4", label: "Mi", color: "#FFFF00", frequency: 329.63 },
  { note: "F4", label: "Fá", color: "#33CC33", frequency: 349.23 },
  { note: "G4", label: "Sol", color: "#33CCFF", frequency: 392.00 },
  { note: "A4", label: "Lá", color: "#0000FF", frequency: 440.00 },
  { note: "B4", label: "Si", color: "#9933CC", frequency: 493.88 },
  { note: "C5", label: "Dó", color: "#FF0000", frequency: 523.25 },
];

const BellHero = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const handleNotePlay = (note: string, frequency: number, color: string) => {
    if (!isMuted) {
      playNoteSound(note);
      setActiveNote(note);
      console.log(`🔔 Sino tocado: ${note} (${frequency}Hz) - ${color}`);
      
      // Remove active state after animation
      setTimeout(() => setActiveNote(null), 200);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                  🔔 Bell Hero
                </CardTitle>
                <CardDescription className="text-lg">
                  Toque os sinos coloridos e crie suas próprias melodias
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
                className="h-12 w-12"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Sinos Musicais</h2>
              <p className="text-muted-foreground">Clique nos sinos para ouvir as notas</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
              {bellNotes.map((bell) => (
                <div
                  key={bell.note}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => handleNotePlay(bell.note, bell.frequency, bell.color)}
                >
                  <div
                    className={`
                      relative w-20 h-24 rounded-b-full border-4 border-gray-800 dark:border-gray-300 
                      flex items-end justify-center pb-2 shadow-lg
                      transition-all duration-200 transform group-hover:scale-110
                      ${activeNote === bell.note ? 'scale-110 shadow-xl' : ''}
                      ${isMuted ? 'opacity-50' : ''}
                    `}
                    style={{ 
                      backgroundColor: bell.color,
                      boxShadow: activeNote === bell.note 
                        ? `0 0 20px ${bell.color}80` 
                        : '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {/* Bell striker */}
                    <div className="w-3 h-3 bg-gray-800 dark:bg-gray-300 rounded-full mb-1"></div>
                    
                    {/* Bell top */}
                    <div 
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-4 rounded-t-full border-2 border-gray-800 dark:border-gray-300"
                      style={{ backgroundColor: bell.color }}
                    ></div>
                  </div>
                  
                  <div className="mt-3 text-center">
                    <div className="font-bold text-lg">{bell.label}</div>
                    <div className="text-sm text-gray-500">{bell.note}</div>
                    <div className="text-xs text-gray-400">{bell.frequency.toFixed(0)}Hz</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-3 flex items-center justify-center gap-2">
                  <Music2 className="text-blue-600" />
                  Como usar o Bell Hero
                </h3>
                <div className="text-gray-600 space-y-2">
                  <p>🎵 Clique nos sinos para ouvir as diferentes notas musicais</p>
                  <p>🎨 Cada sino tem uma cor única que representa sua nota</p>
                  <p>🔊 Use o botão de som para ativar/desativar o áudio</p>
                  <p>🎼 Experimente criar suas próprias melodias tocando em sequência</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BellHero;
