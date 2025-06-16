
import React from 'react';

interface Enhanced3DCylindersProps {
  notes: Array<{
    note: string;
    color: string;
    name: string;
  }>;
  activeNotes: Set<number>;
  onNoteClick: (index: number) => void;
  gameMode: 'playing' | 'freeplay';
}

const Enhanced3DCylinders: React.FC<Enhanced3DCylindersProps> = ({ 
  notes, 
  activeNotes, 
  onNoteClick,
  gameMode 
}) => {
  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center mb-6">
      {notes.map((note, index) => (
        <div
          key={note.note}
          className="mx-2 cursor-pointer transform transition-all duration-200 hover:scale-110"
          style={{ perspective: '500px' }}
          onClick={() => onNoteClick(index)}
        >
          <div
            className={`relative transition-all duration-200 ${
              activeNotes.has(index) ? 'animate-bounce' : ''
            }`}
            style={{
              width: '80px',
              height: '80px',
              transformStyle: 'preserve-3d',
              transform: `rotateX(60deg) ${activeNotes.has(index) ? 'translateY(-10px)' : ''}`
            }}
          >
            {/* Cilindro principal */}
            <div
              className={`absolute w-full h-full rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg transition-all duration-200 ${
                activeNotes.has(index) ? 'shadow-2xl' : 'shadow-lg'
              }`}
              style={{ 
                backgroundColor: note.color,
                boxShadow: activeNotes.has(index) 
                  ? `0 0 30px ${note.color}, 0 10px 20px rgba(0,0,0,0.3)` 
                  : `0 0 10px ${note.color}, 0 5px 15px rgba(0,0,0,0.2)`
              }}
            >
              {note.note}
            </div>
            
            {/* Parte lateral do cilindro */}
            <div
              className="absolute w-full rounded-full opacity-70 transition-all duration-200"
              style={{
                height: '40px',
                backgroundColor: note.color,
                top: '0',
                transform: 'translateY(20px) rotateX(90deg)',
                transformOrigin: 'top center',
                filter: 'brightness(0.8)'
              }}
            />
            
            {/* Brilho quando ativo */}
            {activeNotes.has(index) && (
              <div
                className="absolute w-full h-full rounded-full animate-ping"
                style={{
                  backgroundColor: note.color,
                  opacity: 0.4,
                  top: 0,
                  left: 0
                }}
              />
            )}
            
            {/* Label da nota */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium">
              {note.name}
            </div>
          </div>
        </div>
      ))}
      
      {/* Modo indicador */}
      {gameMode === 'freeplay' && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
          🎵 Modo Livre - Toque à vontade!
        </div>
      )}
    </div>
  );
};

export default Enhanced3DCylinders;
