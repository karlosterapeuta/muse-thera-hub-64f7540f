
import React from "react";

interface PianoKeyboardProps {
  onNotePlay: (frequency: number, duration?: number) => void;
  onNoteAdd: (pitch: string, position: { x: number; y: number }) => void;
  selectedColor: string;
  isRecording: boolean;
}

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  onNotePlay,
  onNoteAdd,
  selectedColor,
  isRecording
}) => {
  const whiteKeys = [
    { note: "C", frequency: 261.63, color: "#FF0000" },
    { note: "D", frequency: 293.66, color: "#FF9933" },
    { note: "E", frequency: 329.63, color: "#FFFF00" },
    { note: "F", frequency: 349.23, color: "#33CC33" },
    { note: "G", frequency: 392.00, color: "#33CCFF" },
    { note: "A", frequency: 440.00, color: "#0000FF" },
    { note: "B", frequency: 493.88, color: "#9933CC" },
    { note: "C2", frequency: 523.25, color: "#FF0000" }
  ];

  const blackKeys = [
    { note: "C#", frequency: 277.18, position: "12.5%" },
    { note: "D#", frequency: 311.13, position: "25%" },
    { note: "F#", frequency: 369.99, position: "50%" },
    { note: "G#", frequency: 415.30, position: "62.5%" },
    { note: "A#", frequency: 466.16, position: "75%" }
  ];

  const handleKeyPress = (note: string, frequency: number, color: string) => {
    onNotePlay(frequency);
    
    if (isRecording) {
      // Generate a position for the staff
      const position = {
        x: Math.random() * 800 + 100,
        y: Math.random() * 200 + 150
      };
      onNoteAdd(note, position);
    }
  };

  return (
    <div className="relative bg-black p-4 rounded-lg">
      {/* Colored note indicators */}
      <div className="flex justify-center mb-4 space-x-1">
        {whiteKeys.map((key, index) => (
          <div
            key={key.note}
            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: key.color }}
          >
            {key.note}
          </div>
        ))}
      </div>

      {/* Piano Keys */}
      <div className="relative">
        {/* White Keys */}
        <div className="flex">
          {whiteKeys.map((key, index) => (
            <button
              key={key.note}
              className="w-12 h-32 bg-white border border-gray-300 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-end justify-center pb-4 text-black font-semibold"
              onMouseDown={() => handleKeyPress(key.note, key.frequency, key.color)}
              style={{
                borderRadius: index === 0 ? "8px 0 0 8px" : index === whiteKeys.length - 1 ? "0 8px 8px 0" : "0"
              }}
            >
              {key.note}
            </button>
          ))}
        </div>

        {/* Black Keys */}
        <div className="absolute top-0 left-0 flex">
          {blackKeys.map((key, index) => (
            <button
              key={key.note}
              className="w-8 h-20 bg-gray-900 hover:bg-gray-700 active:bg-gray-600 transition-colors text-white text-xs font-semibold flex items-end justify-center pb-2 rounded-b"
              style={{
                marginLeft: index === 0 ? "32px" : index === 2 ? "48px" : "16px"
              }}
              onMouseDown={() => handleKeyPress(key.note, key.frequency, "#000000")}
            >
              {key.note}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PianoKeyboard;
