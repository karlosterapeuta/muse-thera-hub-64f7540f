
import React from 'react';

const notes = [
  { note: "C↓", label: "Dó↓", color: "#FF0000", colorName: "VERMELHO" },    // Red - Low Dó (confirmed correct)
  { note: "D", label: "Ré", color: "#FF9933", colorName: "LARANJA" },      // Orange
  { note: "E", label: "Mi", color: "#FFFF00", colorName: "AMARELO" },      // Yellow
  { note: "F", label: "Fá", color: "#33CC33", colorName: "VERDE" },        // Green
  { note: "G", label: "Sol", color: "#33CCFF", colorName: "AZUL CLARO" },  // Light Blue
  { note: "A", label: "Lá", color: "#0000FF", colorName: "AZUL" },         // Blue
  { note: "B", label: "Si", color: "#9933CC", colorName: "ROXO" },         // Purple
  { note: "C↑", label: "Dó↑", color: "#FF0000", colorName: "VERMELHO" },   // Red - High Dó
  { note: "C", label: "Dó", color: "#FF0000", colorName: "VERMELHO" }      // Dó with red color
];

const MusicalBells = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sinos Musicais</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {notes.map((note, index) => (
          <div 
            key={index}
            className="p-6 rounded-lg shadow-md flex flex-col items-center justify-center"
            style={{ backgroundColor: note.color, minHeight: '200px' }}
          >
            <span className="text-white text-3xl font-bold mb-2">{note.label}</span>
            <span className="text-white text-xl">{note.note}</span>
            <span className="text-white text-lg mt-4">{note.colorName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicalBells;
