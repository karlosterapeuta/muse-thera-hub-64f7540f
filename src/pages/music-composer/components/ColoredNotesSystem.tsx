
import React from "react";

interface ColoredNotesSystemProps {
  selectedColor: string;
  selectedShape: string;
  onColorSelect: (color: string) => void;
  onShapeSelect: (shape: string) => void;
  onEraseAll: () => void;
}

const ColoredNotesSystem: React.FC<ColoredNotesSystemProps> = ({
  selectedColor,
  selectedShape,
  onColorSelect,
  onShapeSelect,
  onEraseAll
}) => {
  // Sistema educacional de cores e formas para cada nota
  const educationalNotes = [
    { note: "C", pitch: "Dó", color: "#FF0000", shape: "circle", symbol: "●" },
    { note: "D", pitch: "Ré", color: "#FF6600", shape: "square", symbol: "■" },
    { note: "E", pitch: "Mi", color: "#FFFF00", shape: "triangle", symbol: "▲" },
    { note: "F", pitch: "Fá", color: "#00CC00", shape: "diamond", symbol: "◆" },
    { note: "G", pitch: "Sol", color: "#0099FF", shape: "hexagon", symbol: "⬣" },
    { note: "A", pitch: "Lá", color: "#6600FF", shape: "triangle-up", symbol: "🔺" },
    { note: "B", pitch: "Si", color: "#FF1493", shape: "circle-outline", symbol: "◉" }
  ];

  const shapeOptions = [
    { id: "circle", symbol: "●", label: "Círculo", color: "#FF0000" },
    { id: "square", symbol: "■", label: "Quadrado", color: "#FF6600" },
    { id: "triangle", symbol: "▲", label: "Triângulo", color: "#FFFF00" },
    { id: "diamond", symbol: "◆", label: "Losango", color: "#00CC00" },
    { id: "hexagon", symbol: "⬣", label: "Hexágono", color: "#0099FF" },
    { id: "triangle-up", symbol: "🔺", label: "Triângulo ↑", color: "#6600FF" },
    { id: "circle-outline", symbol: "◉", label: "Círculo ○", color: "#FF1493" }
  ];

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 shadow-2xl">
      <div className="flex flex-wrap items-center justify-center gap-4">
        
        {/* Título e descrição */}
        <div className="w-full text-center mb-2">
          <h3 className="text-white font-bold text-lg">🎨 Sistema de Notas Educativas</h3>
          <p className="text-gray-300 text-sm">Cada nota tem sua cor e forma única!</p>
        </div>

        {/* Notas educacionais com cores fixas */}
        <div className="flex flex-wrap justify-center gap-2 bg-black/30 rounded-xl p-3">
          <div className="text-white text-xs font-bold mb-2 w-full text-center">NOTAS MUSICAIS</div>
          {educationalNotes.map((note) => (
            <div key={note.note} className="flex flex-col items-center">
              <button
                className={`w-14 h-14 rounded-full flex flex-col items-center justify-center text-white font-bold transition-all transform hover:scale-110 shadow-lg ${
                  selectedColor === note.color ? "ring-4 ring-yellow-400 scale-110" : ""
                }`}
                style={{ backgroundColor: note.color }}
                onClick={() => {
                  onColorSelect(note.color);
                  onShapeSelect(note.shape);
                }}
                title={`${note.pitch} (${note.note})`}
              >
                <span className="text-xl">{note.symbol}</span>
              </button>
              <span className="text-white text-xs mt-1 font-bold">{note.pitch}</span>
              <span className="text-gray-300 text-xs">{note.note}</span>
            </div>
          ))}
        </div>

        {/* Separador visual */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>

        {/* Formas geométricas individuais */}
        <div className="flex flex-wrap justify-center gap-2 bg-black/30 rounded-xl p-3">
          <div className="text-white text-xs font-bold mb-2 w-full text-center">FORMAS GEOMÉTRICAS</div>
          {shapeOptions.map((shape) => (
            <button
              key={shape.id}
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl font-bold transition-all transform hover:scale-110 hover:bg-opacity-80 shadow-lg ${
                selectedShape === shape.id ? "ring-3 ring-yellow-400 scale-110" : "bg-gray-700"
              }`}
              style={{ 
                backgroundColor: selectedShape === shape.id ? shape.color : undefined,
                color: selectedShape === shape.id ? 'white' : shape.color
              }}
              onClick={() => onShapeSelect(shape.id)}
              title={shape.label}
            >
              {shape.symbol}
            </button>
          ))}
        </div>

        {/* Controles de ação */}
        <div className="flex items-center gap-3 bg-black/30 rounded-xl p-3">
          <button
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            onClick={onEraseAll}
            title="Apagar Todas as Notas"
          >
            🗑️ <span className="hidden sm:inline">LIMPAR TUDO</span>
          </button>
          
          <div className="text-white text-sm bg-black/50 rounded-lg p-2 max-w-xs">
            <div className="font-bold">💡 Dica:</div>
            <div className="text-xs">Clique na nota para selecionar cor e forma juntas!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColoredNotesSystem;
