
import React, { useState, useEffect } from "react";

interface EducationalKeyboardProps {
  onNotePlay: (frequency: number, note: string, color: string) => void;
  onNoteAdd: (pitch: string, position: { x: number; y: number }) => void;
  selectedColor: string;
  isRecording: boolean;
  highlightedNote?: string;
}

const EducationalKeyboard: React.FC<EducationalKeyboardProps> = ({
  onNotePlay,
  onNoteAdd,
  selectedColor,
  isRecording,
  highlightedNote
}) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const keys = [
    { note: "C", frequency: 261.63, color: "#FF0000", isBlack: false },
    { note: "C#", frequency: 277.18, color: "#800000", isBlack: true },
    { note: "D", frequency: 293.66, color: "#FF9900", isBlack: false },
    { note: "D#", frequency: 311.13, color: "#804C00", isBlack: true },
    { note: "E", frequency: 329.63, color: "#FFFF00", isBlack: false },
    { note: "F", frequency: 349.23, color: "#00FF00", isBlack: false },
    { note: "F#", frequency: 369.99, color: "#008000", isBlack: true },
    { note: "G", frequency: 392.00, color: "#0099FF", isBlack: false },
    { note: "G#", frequency: 415.30, color: "#004C80", isBlack: true },
    { note: "A", frequency: 440.00, color: "#0000FF", isBlack: false },
    { note: "A#", frequency: 466.16, color: "#000080", isBlack: true },
    { note: "B", frequency: 493.88, color: "#9900FF", isBlack: false },
    { note: "C2", frequency: 523.25, color: "#FF6699", isBlack: false }
  ];

  const whiteKeys = keys.filter(key => !key.isBlack);
  const blackKeys = keys.filter(key => key.isBlack);

  const handleKeyPress = (key: any) => {
    setPressedKey(key.note);
    onNotePlay(key.frequency, key.note, key.color);
    
    // Feedback visual por 200ms
    setTimeout(() => setPressedKey(null), 200);
    
    if (isRecording) {
      const position = {
        x: Math.random() * 800 + 100,
        y: Math.random() * 200 + 150
      };
      onNoteAdd(key.note, position);
    }
  };

  // Suporte a teclado físico
  useEffect(() => {
    const keyMap: { [key: string]: any } = {
      'a': whiteKeys[0], // C
      's': whiteKeys[1], // D
      'd': whiteKeys[2], // E
      'f': whiteKeys[3], // F
      'g': whiteKeys[4], // G
      'h': whiteKeys[5], // A
      'j': whiteKeys[6], // B
      'k': whiteKeys[7], // C2
      'w': blackKeys[0], // C#
      'e': blackKeys[1], // D#
      't': blackKeys[2], // F#
      'y': blackKeys[3], // G#
      'u': blackKeys[4], // A#
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = keyMap[event.key.toLowerCase()];
      if (key && pressedKey !== key.note) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pressedKey]);

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl">
      {/* Indicadores de notas coloridas */}
      <div className="flex justify-center mb-4 space-x-2">
        {whiteKeys.map((key, index) => (
          <div
            key={key.note}
            className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-sm font-bold shadow-lg transition-all ${
              highlightedNote === key.note ? "animate-pulse scale-110 ring-4 ring-yellow-400" : ""
            }`}
            style={{ backgroundColor: key.color, color: 'white' }}
          >
            {key.note}
          </div>
        ))}
      </div>

      {/* Piano */}
      <div className="relative">
        {/* Teclas brancas */}
        <div className="flex">
          {whiteKeys.map((key, index) => (
            <button
              key={key.note}
              className={`w-16 h-40 border-2 border-gray-400 flex flex-col items-center justify-end pb-4 font-bold text-lg transition-all transform ${
                pressedKey === key.note || highlightedNote === key.note
                  ? "scale-95 shadow-inner" 
                  : "hover:scale-105 shadow-lg"
              } ${
                index === 0 ? "rounded-l-lg" : 
                index === whiteKeys.length - 1 ? "rounded-r-lg" : ""
              }`}
              style={{
                backgroundColor: pressedKey === key.note || highlightedNote === key.note ? key.color : 'white',
                color: pressedKey === key.note || highlightedNote === key.note ? 'white' : key.color,
                borderColor: key.color
              }}
              onMouseDown={() => handleKeyPress(key)}
              onTouchStart={() => handleKeyPress(key)}
            >
              <div className="text-xs mb-1">●</div>
              {key.note}
            </button>
          ))}
        </div>

        {/* Teclas pretas */}
        <div className="absolute top-0 left-0 flex">
          {blackKeys.map((key, index) => {
            const positions = ['8%', '24%', '56%', '72%', '88%'];
            return (
              <button
                key={key.note}
                className={`w-10 h-24 rounded-b-lg text-white text-sm font-bold flex flex-col items-center justify-end pb-2 transition-all transform ${
                  pressedKey === key.note || highlightedNote === key.note
                    ? "scale-95 shadow-inner" 
                    : "hover:scale-105 shadow-lg"
                }`}
                style={{
                  backgroundColor: pressedKey === key.note || highlightedNote === key.note ? key.color : '#2D3748',
                  left: positions[index],
                  position: 'absolute'
                }}
                onMouseDown={() => handleKeyPress(key)}
                onTouchStart={() => handleKeyPress(key)}
              >
                <div className="text-xs mb-1">●</div>
                {key.note}
              </button>
            );
          })}
        </div>
      </div>

      {/* Instruções */}
      <div className="mt-4 text-center text-white text-sm">
        <p>🎹 Clique nas teclas ou use o teclado: A S D F G H J K (brancas) | W E T Y U (pretas)</p>
      </div>
    </div>
  );
};

export default EducationalKeyboard;
