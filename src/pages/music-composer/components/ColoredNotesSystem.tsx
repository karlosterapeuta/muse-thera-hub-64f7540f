
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
  const coloredNotes = [
    { note: "C", color: "#FF0000", shape: "●" }, // Vermelho - Círculo
    { note: "D", color: "#FF9900", shape: "●" }, // Laranja - Círculo
    { note: "E", color: "#FFFF00", shape: "●" }, // Amarelo - Círculo
    { note: "F", color: "#00FF00", shape: "●" }, // Verde - Círculo
    { note: "G", color: "#0099FF", shape: "●" }, // Azul claro - Círculo
    { note: "A", color: "#0000FF", shape: "●" }, // Azul - Círculo
    { note: "B", color: "#9900FF", shape: "●" }, // Roxo - Círculo
    { note: "C2", color: "#FF6699", shape: "●" } // Rosa - Círculo
  ];

  const shapes = [
    { id: "circle", symbol: "●", label: "Círculo" },
    { id: "triangle", symbol: "▲", label: "Triângulo" },
    { id: "square", symbol: "■", label: "Quadrado" },
    { id: "diamond", symbol: "♦", label: "Losango" }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-3 flex items-center space-x-3">
      {/* Paleta de cores das notas */}
      <div className="flex space-x-1">
        {coloredNotes.map((note, index) => (
          <button
            key={note.note}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all transform hover:scale-110 ${
              selectedColor === note.color ? "ring-4 ring-yellow-400 scale-110" : ""
            }`}
            style={{ backgroundColor: note.color }}
            onClick={() => onColorSelect(note.color)}
            title={`Nota ${note.note}`}
          >
            {note.shape}
          </button>
        ))}
      </div>

      {/* Separador */}
      <div className="w-px h-8 bg-gray-600"></div>

      {/* Formas geométricas */}
      <div className="flex space-x-1">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            className={`w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white text-lg font-bold transition-all transform hover:scale-110 hover:bg-gray-600 ${
              selectedShape === shape.id ? "ring-2 ring-yellow-400 bg-gray-600 scale-110" : ""
            }`}
            onClick={() => onShapeSelect(shape.id)}
            title={shape.label}
          >
            {shape.symbol}
          </button>
        ))}
      </div>

      {/* Separador */}
      <div className="w-px h-8 bg-gray-600"></div>

      {/* Botão de apagar tudo */}
      <button
        className="w-12 h-10 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all transform hover:scale-110 flex items-center justify-center"
        onClick={onEraseAll}
        title="Apagar Tudo"
      >
        X
      </button>
    </div>
  );
};

export default ColoredNotesSystem;
