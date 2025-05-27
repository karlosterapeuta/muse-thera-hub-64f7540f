
import React, { useRef, useEffect, useState } from "react";

interface Note {
  id: string;
  pitch: string;
  duration: number;
  position: { x: number; y: number };
  color: string;
  shape: string;
  timestamp: number;
}

interface EducationalStaffProps {
  notes: Note[];
  onAddNote: (pitch: string, position: { x: number; y: number }) => void;
  playbackPosition: number;
  isPlaying: boolean;
  timeSignature: string;
  highlightedNote?: string;
  selectedColor: string;
  selectedShape: string;
}

const EducationalStaff: React.FC<EducationalStaffProps> = ({
  notes,
  onAddNote,
  playbackPosition,
  isPlaying,
  timeSignature,
  highlightedNote,
  selectedColor,
  selectedShape
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number; pitch: string } | null>(null);

  useEffect(() => {
    drawStaff();
  }, [notes, playbackPosition, isPlaying, hoveredPosition, highlightedNote]);

  const getShapeSymbol = (shape: string): string => {
    switch (shape) {
      case 'circle': return '●';
      case 'triangle': return '▲';
      case 'square': return '■';
      case 'diamond': return '♦';
      default: return '●';
    }
  };

  const drawStaff = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and resize
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Staff configuration
    const staffY1 = 80; // Primeira pauta (aguda)
    const staffY2 = 200; // Segunda pauta (média)
    const staffY3 = 320; // Terceira pauta (grave)
    const staffSpacing = 15;
    const leftMargin = 80;
    const rightMargin = 50;

    // Draw staff lines
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    // Primeira pauta (Clave de Sol)
    for (let i = 0; i < 5; i++) {
      const y = staffY1 + (i * staffSpacing);
      ctx.beginPath();
      ctx.moveTo(leftMargin, y);
      ctx.lineTo(canvas.width - rightMargin, y);
      ctx.stroke();
    }

    // Segunda pauta (Clave de Sol oitava abaixo)
    for (let i = 0; i < 5; i++) {
      const y = staffY2 + (i * staffSpacing);
      ctx.beginPath();
      ctx.moveTo(leftMargin, y);
      ctx.lineTo(canvas.width - rightMargin, y);
      ctx.stroke();
    }

    // Terceira pauta (Clave de Fá)
    for (let i = 0; i < 5; i++) {
      const y = staffY3 + (i * staffSpacing);
      ctx.beginPath();
      ctx.moveTo(leftMargin, y);
      ctx.lineTo(canvas.width - rightMargin, y);
      ctx.stroke();
    }

    // Draw clefs
    ctx.font = 'bold 32px serif';
    ctx.fillStyle = '#000';
    ctx.fillText('𝄞', leftMargin - 60, staffY1 + 45); // Clave de Sol (primeira)
    ctx.fillText('𝄞', leftMargin - 60, staffY2 + 45); // Clave de Sol (segunda)
    ctx.fillText('𝄢', leftMargin - 60, staffY3 + 25); // Clave de Fá

    // Draw time signatures
    ctx.font = '18px serif';
    const timeParts = timeSignature.split('/');
    
    // Para cada pauta
    [staffY1, staffY2, staffY3].forEach(staffY => {
      ctx.fillText(timeParts[0], leftMargin - 20, staffY + 20);
      ctx.fillText(timeParts[1], leftMargin - 20, staffY + 50);
    });

    // Draw measure lines
    const measureWidth = 150;
    const measures = Math.floor((canvas.width - leftMargin - rightMargin) / measureWidth);
    
    for (let i = 1; i <= measures; i++) {
      const x = leftMargin + (i * measureWidth);
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // Linhas de compasso para todas as pautas
      ctx.moveTo(x, staffY1 - 10);
      ctx.lineTo(x, staffY1 + 70);
      ctx.moveTo(x, staffY2 - 10);
      ctx.lineTo(x, staffY2 + 70);
      ctx.moveTo(x, staffY3 - 10);
      ctx.lineTo(x, staffY3 + 70);
      ctx.stroke();
    }

    // Draw grid lines (more visual guides)
    ctx.strokeStyle = '#F0F0F0';
    ctx.lineWidth = 0.5;
    for (let x = leftMargin; x < canvas.width - rightMargin; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw notes
    notes.forEach((note, index) => {
      const x = note.position.x;
      const y = note.position.y;

      // Draw note with shape
      ctx.fillStyle = note.color;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(getShapeSymbol(note.shape), x, y + 8);

      // Draw note stem
      ctx.strokeStyle = note.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 12, y);
      ctx.lineTo(x + 12, y - 35);
      ctx.stroke();

      // Highlight if currently playing
      if (isPlaying && index === playbackPosition % notes.length) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Adicionar efeito de brilho
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        ctx.fillStyle = note.color;
        ctx.fillText(getShapeSymbol(note.shape), x, y + 8);
        ctx.shadowBlur = 0;
      }

      // Highlight specific note
      if (highlightedNote && note.pitch === highlightedNote) {
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    // Draw hover preview
    if (hoveredPosition) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(getShapeSymbol(selectedShape), hoveredPosition.x, hoveredPosition.y + 6);
      
      // Show note name
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText(hoveredPosition.pitch, hoveredPosition.x, hoveredPosition.y - 25);
    }

    // Draw playback cursor
    if (isPlaying) {
      const cursorX = leftMargin + 20 + (playbackPosition * 30) % (canvas.width - leftMargin - rightMargin - 40);
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cursorX, 20);
      ctx.lineTo(cursorX, canvas.height - 20);
      ctx.stroke();
      
      // Cursor top indicator
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(cursorX - 5, 20);
      ctx.lineTo(cursorX + 5, 20);
      ctx.lineTo(cursorX, 30);
      ctx.fill();
    }

    ctx.textAlign = 'left'; // Reset text alignment
  };

  const getPitchFromPosition = (x: number, y: number): string => {
    const staffY1 = 80;
    const staffY2 = 200;
    const staffY3 = 320;
    const staffSpacing = 15;

    let pitch = 'C';
    
    if (y >= staffY1 - 20 && y <= staffY1 + 80) {
      // Primeira pauta (aguda)
      const lineIndex = Math.round((y - staffY1) / staffSpacing);
      const treblePitches = ['F2', 'D2', 'B1', 'G1', 'E1', 'C1', 'A', 'F', 'D'];
      pitch = treblePitches[Math.max(0, Math.min(8, lineIndex + 2))] || 'C2';
    } else if (y >= staffY2 - 20 && y <= staffY2 + 80) {
      // Segunda pauta (média)
      const lineIndex = Math.round((y - staffY2) / staffSpacing);
      const midPitches = ['F1', 'D1', 'B', 'G', 'E', 'C', 'A', 'F', 'D'];
      pitch = midPitches[Math.max(0, Math.min(8, lineIndex + 2))] || 'C1';
    } else if (y >= staffY3 - 20 && y <= staffY3 + 80) {
      // Terceira pauta (grave)
      const lineIndex = Math.round((y - staffY3) / staffSpacing);
      const bassPitches = ['A', 'F', 'D', 'B', 'G', 'E', 'C', 'A', 'F'];
      pitch = bassPitches[Math.max(0, Math.min(8, lineIndex + 2))] || 'C';
    }

    return pitch;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pitch = getPitchFromPosition(x, y);
    onAddNote(pitch, { x, y });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pitch = getPitchFromPosition(x, y);

    setHoveredPosition({ x, y, pitch });
  };

  const handleMouseLeave = () => {
    setHoveredPosition(null);
  };

  return (
    <div className="w-full h-full bg-white border-2 border-gray-300 rounded-lg shadow-lg">
      <div className="p-2 bg-gray-100 border-b border-gray-300 text-center">
        <h3 className="text-lg font-bold text-gray-800">Pauta Musical Educativa</h3>
        <p className="text-sm text-gray-600">Clique para adicionar notas coloridas com formas</p>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        style={{ minHeight: '500px' }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

export default EducationalStaff;
