
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
  const [draggedNote, setDraggedNote] = useState<string | null>(null);

  // Sistema educacional de notas com cores e formas específicas
  const keys = [
    { note: "C", pitch: "Dó", frequency: 261.63, color: "#FF0000", shape: "●", isBlack: false },
    { note: "C#", pitch: "Dó#", frequency: 277.18, color: "#800000", shape: "●", isBlack: true },
    { note: "D", pitch: "Ré", frequency: 293.66, color: "#FF6600", shape: "■", isBlack: false },
    { note: "D#", pitch: "Ré#", frequency: 311.13, color: "#CC4400", shape: "■", isBlack: true },
    { note: "E", pitch: "Mi", frequency: 329.63, color: "#FFFF00", shape: "▲", isBlack: false },
    { note: "F", pitch: "Fá", frequency: 349.23, color: "#00CC00", shape: "◆", isBlack: false },
    { note: "F#", pitch: "Fá#", frequency: 369.99, color: "#008800", shape: "◆", isBlack: true },
    { note: "G", pitch: "Sol", frequency: 392.00, color: "#0099FF", shape: "⬣", isBlack: false },
    { note: "G#", pitch: "Sol#", frequency: 415.30, color: "#0066CC", shape: "⬣", isBlack: true },
    { note: "A", pitch: "Lá", frequency: 440.00, color: "#6600FF", shape: "🔺", isBlack: false },
    { note: "A#", pitch: "Lá#", frequency: 466.16, color: "#4400CC", shape: "🔺", isBlack: true },
    { note: "B", pitch: "Si", frequency: 493.88, color: "#FF1493", shape: "◉", isBlack: false },
    { note: "C2", pitch: "Dó⁸", frequency: 523.25, color: "#FF0000", shape: "●", isBlack: false }
  ];

  const whiteKeys = keys.filter(key => !key.isBlack);
  const blackKeys = keys.filter(key => key.isBlack);

  const handleKeyPress = (key: any) => {
    setPressedKey(key.note);
    onNotePlay(key.frequency, key.note, key.color);
    
    // Feedback visual por 300ms
    setTimeout(() => setPressedKey(null), 300);
    
    if (isRecording) {
      const position = {
        x: Math.random() * 600 + 150,
        y: Math.random() * 120 + 140
      };
      onNoteAdd(key.note, position);
    }
  };

  const handleDragStart = (key: any, event: React.DragEvent) => {
    setDraggedNote(key.note);
    event.dataTransfer.setData('note', JSON.stringify({
      note: key.note,
      pitch: key.pitch,
      color: key.color,
      shape: key.shape
    }));
  };

  const handleDragEnd = () => {
    setDraggedNote(null);
  };

  // Suporte a teclado físico melhorado
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
        event.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pressedKey]);

  return (
    <div className="bg-gradient-to-b from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-2xl border-4 border-gray-600">
      
      {/* Header educativo */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-white mb-2">🎹 Piano Educativo Colorido</h3>
        <p className="text-gray-300 text-sm">Cada nota tem sua cor e forma • Arraste para a partitura!</p>
      </div>

      {/* Indicadores de notas coloridas com formas */}
      <div className="flex justify-center mb-6 flex-wrap gap-2">
        {whiteKeys.map((key, index) => (
          <div
            key={key.note}
            className={`flex flex-col items-center p-2 rounded-xl border-3 border-white transition-all transform ${
              highlightedNote === key.note || pressedKey === key.note
                ? "animate-pulse scale-110 shadow-lg shadow-yellow-400/50" 
                : "hover:scale-105"
            }`}
            style={{ 
              backgroundColor: key.color,
              boxShadow: highlightedNote === key.note ? `0 0 20px ${key.color}` : undefined
            }}
          >
            <div className="text-2xl text-white font-bold drop-shadow-lg">{key.shape}</div>
            <div className="text-white text-sm font-bold">{key.pitch}</div>
            <div className="text-white text-xs opacity-80">{key.note}</div>
          </div>
        ))}
      </div>

      {/* Piano Visual */}
      <div className="relative bg-black rounded-xl p-4 shadow-inner">
        
        {/* Teclas brancas */}
        <div className="flex justify-center">
          {whiteKeys.map((key, index) => (
            <button
              key={key.note}
              draggable
              className={`relative w-16 h-48 border-2 border-gray-400 flex flex-col items-center justify-end pb-4 font-bold text-lg transition-all transform cursor-pointer ${
                pressedKey === key.note || highlightedNote === key.note
                  ? "scale-95 shadow-inner" 
                  : "hover:scale-105 shadow-xl"
              } ${
                index === 0 ? "rounded-l-xl" : 
                index === whiteKeys.length - 1 ? "rounded-r-xl" : ""
              }`}
              style={{
                backgroundColor: pressedKey === key.note || highlightedNote === key.note 
                  ? key.color 
                  : '#FFFFFF',
                borderColor: key.color,
                borderWidth: highlightedNote === key.note ? '4px' : '2px',
                color: pressedKey === key.note || highlightedNote === key.note ? 'white' : key.color,
                boxShadow: highlightedNote === key.note 
                  ? `0 0 15px ${key.color}, inset 0 0 15px rgba(255,255,255,0.2)` 
                  : undefined
              }}
              onMouseDown={() => handleKeyPress(key)}
              onTouchStart={() => handleKeyPress(key)}
              onDragStart={(e) => handleDragStart(key, e)}
              onDragEnd={handleDragEnd}
              title={`${key.pitch} (${key.note}) - Arraste para a partitura!`}
            >
              <div className="text-3xl mb-2 drop-shadow-lg">{key.shape}</div>
              <div className="text-sm font-bold">{key.pitch}</div>
              <div className="text-xs opacity-70">{key.note}</div>
              
              {/* Indicador de drag */}
              {draggedNote === key.note && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                  📌
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Teclas pretas */}
        <div className="absolute top-4 left-4 flex justify-center w-full">
          {blackKeys.map((key, index) => {
            const positions = ['12%', '20%', '36%', '44%', '52%'];
            return (
              <button
                key={key.note}
                draggable
                className={`absolute w-12 h-32 rounded-b-xl text-white text-sm font-bold flex flex-col items-center justify-end pb-3 transition-all transform cursor-pointer ${
                  pressedKey === key.note || highlightedNote === key.note
                    ? "scale-95 shadow-inner" 
                    : "hover:scale-105 shadow-xl"
                }`}
                style={{
                  backgroundColor: pressedKey === key.note || highlightedNote === key.note 
                    ? key.color 
                    : '#1A1A1A',
                  left: positions[index],
                  border: highlightedNote === key.note 
                    ? `3px solid ${key.color}` 
                    : '1px solid #333',
                  boxShadow: highlightedNote === key.note 
                    ? `0 0 12px ${key.color}` 
                    : undefined
                }}
                onMouseDown={() => handleKeyPress(key)}
                onTouchStart={() => handleKeyPress(key)}
                onDragStart={(e) => handleDragStart(key, e)}
                onDragEnd={handleDragEnd}
                title={`${key.pitch} (${key.note}) - Arraste para a partitura!`}
              >
                <div className="text-lg mb-1">{key.shape}</div>
                <div className="text-xs">{key.pitch}</div>
                
                {/* Indicador de drag */}
                {draggedNote === key.note && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-1 py-0.5 rounded-full font-bold animate-bounce">
                    📌
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Instruções melhoradas */}
      <div className="mt-6 text-center space-y-2">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold">
          🎹 COMO USAR
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div className="bg-green-600 text-white px-3 py-2 rounded-lg">
            🖱️ <strong>CLIQUE:</strong> Toque a nota
          </div>
          <div className="bg-purple-600 text-white px-3 py-2 rounded-lg">
            🔤 <strong>TECLADO:</strong> A-S-D-F-G-H-J-K
          </div>
          <div className="bg-orange-600 text-white px-3 py-2 rounded-lg">
            📌 <strong>ARRASTE:</strong> Para a partitura
          </div>
        </div>
        <div className="text-gray-300 text-xs">
          ⚫ Teclas pretas: W-E-T-Y-U | 🎵 Modo gravação: {isRecording ? 'ATIVO' : 'INATIVO'}
        </div>
      </div>
    </div>
  );
};

export default EducationalKeyboard;
