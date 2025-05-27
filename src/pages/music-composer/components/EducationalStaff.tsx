
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
      case 'square': return '■';
      case 'triangle': return '▲';
      case 'diamond': return '◆';
      case 'hexagon': return '⬣';
      case 'triangle-up': return '🔺';
      case 'circle-outline': return '◉';
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

    // Background with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FAFAFA');
    gradient.addColorStop(1, '#F0F8FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Staff configuration
    const staffY = 120;
    const staffSpacing = 20;
    const leftMargin = 100;
    const rightMargin = 80;
    const staffWidth = canvas.width - leftMargin - rightMargin;

    // Draw staff lines with better styling
    ctx.strokeStyle = '#2E3A59';
    ctx.lineWidth = 2;

    // Main staff (treble clef)
    for (let i = 0; i < 5; i++) {
      const y = staffY + (i * staffSpacing);
      ctx.beginPath();
      ctx.moveTo(leftMargin, y);
      ctx.lineTo(canvas.width - rightMargin, y);
      ctx.stroke();
    }

    // Draw treble clef
    ctx.font = 'bold 48px serif';
    ctx.fillStyle = '#2E3A59';
    ctx.fillText('𝄞', leftMargin - 80, staffY + 65);

    // Draw time signature with better styling
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#2E3A59';
    const timeParts = timeSignature.split('/');
    ctx.fillText(timeParts[0], leftMargin - 35, staffY + 25);
    ctx.fillText(timeParts[1], leftMargin - 35, staffY + 55);

    // Draw measure lines with rhythm grid
    const measureWidth = 160;
    const measures = Math.floor(staffWidth / measureWidth);
    
    // Main measure lines
    ctx.strokeStyle = '#4A5568';
    ctx.lineWidth = 2;
    
    for (let i = 1; i <= measures; i++) {
      const x = leftMargin + (i * measureWidth);
      ctx.beginPath();
      ctx.moveTo(x, staffY - 15);
      ctx.lineTo(x, staffY + 95);
      ctx.stroke();
    }

    // Rhythm grid (quarter notes subdivisions)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= measures; i++) {
      for (let j = 1; j < 4; j++) {
        const x = leftMargin + (i * measureWidth) + (j * measureWidth / 4);
        ctx.beginPath();
        ctx.moveTo(x, staffY);
        ctx.lineTo(x, staffY + 80);
        ctx.stroke();
      }
    }

    // Draw helper lines above and below staff
    ctx.strokeStyle = '#CBD5E0';
    ctx.lineWidth = 1;
    
    // Lines above staff
    for (let i = 1; i <= 3; i++) {
      const y = staffY - (i * staffSpacing);
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(leftMargin, y);
      ctx.lineTo(canvas.width - rightMargin, y);
      ctx.stroke();
    }
    
    // Lines below staff
    for (let i = 1; i <= 3; i++) {
      const y = staffY + 80 + (i * staffSpacing);
      ctx.beginPath();
      ctx.moveTo(leftMargin, y);
      ctx.lineTo(canvas.width - rightMargin, y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]); // Reset line dash

    // Draw notes as educational shapes
    notes.forEach((note, index) => {
      const x = note.position.x;
      const y = note.position.y;

      // Draw shadow for depth
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(getShapeSymbol(note.shape), x + 2, y + 10);

      // Draw main note shape
      ctx.fillStyle = note.color;
      ctx.font = 'bold 30px Arial';
      ctx.fillText(getShapeSymbol(note.shape), x, y + 8);

      // Add white outline for better visibility
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeText(getShapeSymbol(note.shape), x, y + 8);

      // Highlight if currently playing
      if (isPlaying && index === playbackPosition % notes.length) {
        // Glowing effect
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(getShapeSymbol(note.shape), x, y + 8);
        ctx.shadowBlur = 0;
        
        // Pulsing ring
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Highlight specific note
      if (highlightedNote && note.pitch === highlightedNote) {
        ctx.strokeStyle = '#00FF88';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    // Draw hover preview
    if (hoveredPosition) {
      ctx.fillStyle = 'rgba(255, 100, 100, 0.7)';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(getShapeSymbol(selectedShape), hoveredPosition.x, hoveredPosition.y + 6);
      
      // Show note name with beautiful styling
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#2E3A59';
      ctx.lineWidth = 2;
      ctx.font = 'bold 14px Arial';
      ctx.strokeText(hoveredPosition.pitch, hoveredPosition.x, hoveredPosition.y - 30);
      ctx.fillText(hoveredPosition.pitch, hoveredPosition.x, hoveredPosition.y - 30);
    }

    // Draw playback cursor with enhanced styling
    if (isPlaying) {
      const cursorX = leftMargin + 20 + (playbackPosition * 40) % (canvas.width - leftMargin - rightMargin - 40);
      
      // Gradient cursor
      const cursorGradient = ctx.createLinearGradient(cursorX, 40, cursorX, canvas.height - 40);
      cursorGradient.addColorStop(0, '#FF4444');
      cursorGradient.addColorStop(1, '#FF0000');
      
      ctx.strokeStyle = cursorGradient;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cursorX, 40);
      ctx.lineTo(cursorX, canvas.height - 40);
      ctx.stroke();
      
      // Cursor top indicator (arrow)
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(cursorX - 8, 40);
      ctx.lineTo(cursorX + 8, 40);
      ctx.lineTo(cursorX, 52);
      ctx.fill();
    }

    ctx.textAlign = 'left'; // Reset text alignment
  };

  const getPitchFromPosition = (x: number, y: number): string => {
    const staffY = 120;
    const staffSpacing = 20;

    // Calculate which line/space we're on
    const relativeY = y - staffY;
    const lineIndex = Math.round(relativeY / staffSpacing);
    
    // Map to pitch names (including ledger lines)
    const pitchMap: { [key: number]: string } = {
      -3: 'C2',  // Above staff
      -2: 'B1',
      -1: 'A1',
      0: 'G1',   // Top line
      1: 'F1',
      2: 'E1',   // Second line
      3: 'D1',
      4: 'C1',   // Third line
      5: 'B',
      6: 'A',    // Fourth line
      7: 'G',
      8: 'F',    // Bottom line
      9: 'E',
      10: 'D',   // Below staff
      11: 'C'
    };

    return pitchMap[lineIndex] || 'C';
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
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 border-4 border-blue-200 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
        <h2 className="text-2xl font-bold">🎼 Pauta Musical Educativa 🎵</h2>
        <p className="text-sm opacity-90">Clique para adicionar notas coloridas • Arraste do teclado para criar música!</p>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        style={{ minHeight: '400px' }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

export default EducationalStaff;
