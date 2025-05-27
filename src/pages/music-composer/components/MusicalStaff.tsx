
import React, { useRef, useEffect, useState } from "react";

interface Note {
  id: string;
  pitch: string;
  duration: number;
  position: { x: number; y: number };
  color: string;
  timestamp: number;
}

interface MusicalStaffProps {
  notes: Note[];
  onAddNote: (pitch: string, position: { x: number; y: number }) => void;
  playbackPosition: number;
  isPlaying: boolean;
  timeSignature: string;
}

const MusicalStaff: React.FC<MusicalStaffProps> = ({
  notes,
  onAddNote,
  playbackPosition,
  isPlaying,
  timeSignature
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    drawStaff();
  }, [notes, playbackPosition, isPlaying, hoveredPosition]);

  const drawStaff = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw treble clef staff lines
    const staffY = 80;
    const staffSpacing = 20;
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    // Draw 5 staff lines for treble clef
    for (let i = 0; i < 5; i++) {
      const y = staffY + (i * staffSpacing);
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(canvas.width - 50, y);
      ctx.stroke();
    }

    // Draw bass clef staff lines
    const bassStaffY = 250;
    for (let i = 0; i < 5; i++) {
      const y = bassStaffY + (i * staffSpacing);
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(canvas.width - 50, y);
      ctx.stroke();
    }

    // Draw treble clef symbol
    ctx.font = '40px serif';
    ctx.fillStyle = '#000';
    ctx.fillText('𝄞', 60, staffY + 60);

    // Draw bass clef symbol
    ctx.fillText('𝄢', 60, bassStaffY + 40);

    // Draw time signature
    ctx.font = '24px serif';
    ctx.fillText(timeSignature.split('/')[0], 120, staffY + 30);
    ctx.fillText(timeSignature.split('/')[1], 120, staffY + 70);
    ctx.fillText(timeSignature.split('/')[0], 120, bassStaffY + 20);
    ctx.fillText(timeSignature.split('/')[1], 120, bassStaffY + 60);

    // Draw measure lines
    const measureWidth = 200;
    for (let i = 1; i <= 6; i++) {
      const x = 150 + (i * measureWidth);
      ctx.beginPath();
      ctx.moveTo(x, staffY - 10);
      ctx.lineTo(x, staffY + 90);
      ctx.moveTo(x, bassStaffY - 10);
      ctx.lineTo(x, bassStaffY + 90);
      ctx.stroke();
    }

    // Draw notes
    notes.forEach((note, index) => {
      const x = note.position.x;
      const y = note.position.y;

      // Draw note
      ctx.fillStyle = note.color;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw note stem
      ctx.strokeStyle = note.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 8, y);
      ctx.lineTo(x + 8, y - 30);
      ctx.stroke();

      // Highlight if currently playing
      if (isPlaying && index === playbackPosition % notes.length) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    // Draw hover preview
    if (hoveredPosition) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(hoveredPosition.x, hoveredPosition.y, 8, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw playback cursor
    if (isPlaying) {
      const cursorX = 200 + (playbackPosition * 20) % (canvas.width - 250);
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cursorX, staffY - 20);
      ctx.lineTo(cursorX, bassStaffY + 90);
      ctx.stroke();
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Determine which staff line is closest
    const staffY = 80;
    const bassStaffY = 250;
    const staffSpacing = 20;

    let closestStaff = 'treble';
    let pitch = 'C';

    if (y < (staffY + bassStaffY) / 2) {
      // Treble clef
      const lineIndex = Math.round((y - staffY) / staffSpacing);
      const treblePitches = ['F', 'D', 'B', 'G', 'E'];
      pitch = treblePitches[Math.max(0, Math.min(4, lineIndex))] || 'C';
    } else {
      // Bass clef
      const lineIndex = Math.round((y - bassStaffY) / staffSpacing);
      const bassPitches = ['A', 'F', 'D', 'B', 'G'];
      pitch = bassPitches[Math.max(0, Math.min(4, lineIndex))] || 'C';
    }

    onAddNote(pitch, { x, y });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setHoveredPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredPosition(null);
  };

  return (
    <div className="w-full h-full bg-white p-4">
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

export default MusicalStaff;
