
import React from "react";

interface ColoredNotesProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColoredNotes: React.FC<ColoredNotesProps> = ({
  selectedColor,
  onColorSelect
}) => {
  const coloredNotes = [
    { note: "Dó", color: "#FF0000", pitch: "C" },
    { note: "Ré", color: "#FF9933", pitch: "D" },
    { note: "Mi", color: "#FFFF00", pitch: "E" },
    { note: "Fá", color: "#33CC33", pitch: "F" },
    { note: "Sol", color: "#33CCFF", pitch: "G" },
    { note: "Lá", color: "#0000FF", pitch: "A" },
    { note: "Si", color: "#9933CC", pitch: "B" },
    { note: "Dó", color: "#FF69B4", pitch: "C2" }
  ];

  const shapes = [
    { shape: "●", color: "#FF0000" },
    { shape: "▲", color: "#FF9933" },
    { shape: "■", color: "#FFFF00" },
    { shape: "♦", color: "#33CC33" },
    { shape: "▼", color: "#33CCFF" },
    { shape: "▲", color: "#0000FF" },
    { shape: "●", color: "#9933CC" },
    { shape: "♠", color: "#FF69B4" }
  ];

  return (
    <div className="bg-black rounded-lg p-2 flex items-center space-x-1">
      {/* White and black keys representation */}
      <div className="flex">
        {coloredNotes.slice(0, 8).map((note, index) => (
          <button
            key={`${note.pitch}-${index}`}
            className={`w-6 h-12 border border-gray-400 flex flex-col items-center justify-center text-xs font-bold transition-all ${
              index === 1 || index === 3 || index === 6 
                ? "bg-gray-800 text-white -mx-1 z-10 h-8 mt-0" 
                : "bg-white text-black"
            } ${selectedColor === note.color ? "ring-2 ring-yellow-400" : ""}`}
            style={{
              backgroundColor: index === 1 || index === 3 || index === 6 ? '#333' : note.color,
              color: index === 1 || index === 3 || index === 6 ? 'white' : 'black'
            }}
            onClick={() => onColorSelect(note.color)}
            title={`${note.note} - ${note.pitch}`}
          >
            {note.note}
          </button>
        ))}
      </div>

      {/* X button */}
      <button className="w-8 h-8 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors">
        X
      </button>

      {/* Colored shapes */}
      <div className="flex space-x-1 ml-4">
        {shapes.map((item, index) => (
          <button
            key={index}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              selectedColor === item.color ? "ring-2 ring-yellow-400" : ""
            }`}
            style={{ backgroundColor: item.color, color: "white" }}
            onClick={() => onColorSelect(item.color)}
          >
            {item.shape}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColoredNotes;
