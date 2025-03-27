
import React from "react";
import { Song } from "../data/songs-data";
import { FileText } from "lucide-react";

interface Note {
  note: string;
  color: string;
  colorName: string;
}

interface SongDisplayProps {
  selectedSong: Song | null;
  notes: Note[];
  activeNoteIndex: number;
}

const SongDisplay: React.FC<SongDisplayProps> = ({
  selectedSong,
  notes,
  activeNoteIndex,
}) => {
  if (!selectedSong) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Selecione uma música para visualizar as notas</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{selectedSong.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {selectedSong.description}
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-6">
        {selectedSong.notes.map((noteKey, index) => {
          const noteData = notes.find(n => n.note === noteKey);
          return (
            <div 
              key={`${noteKey}-${index}`} 
              className={`relative aspect-square flex flex-col items-center justify-center rounded-full transition-transform ${
                index === activeNoteIndex ? "scale-110 ring-4 ring-primary" : ""
              }`}
              style={{ 
                backgroundColor: noteData?.color,
                color: ["C8", "E"].includes(noteKey) ? '#333' : '#fff'
              }}
            >
              <span className="font-bold text-xs md:text-lg">
                {noteKey}
              </span>
              <span className="text-[10px] md:text-xs mt-1">
                {selectedSong.lyrics[index]}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-4 bg-muted rounded-md">
        <h4 className="font-medium mb-2">Legenda das cores</h4>
        <div className="flex flex-wrap gap-2">
          {notes.map((note) => (
            <div 
              key={note.note} 
              className="flex items-center space-x-1"
            >
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: note.color }}
              ></div>
              <span className="text-xs">
                {note.note} - {note.colorName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SongDisplay;
