import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { playNoteSound } from "@/utils/audioUtils";

interface Note {
  note: string;
  time: number;
  color: string;
}

interface GuitarHeroGameProps {
  instrumentType: "bell" | "xylophone" | "keyboard";
  onNotePlay: (frequency: number, color: string) => void;
  songId: string;
}

const GuitarHeroGame = ({ instrumentType, onNotePlay, songId }: GuitarHeroGameProps) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNotes, setActiveNotes] = useState<Note[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [hitNotes, setHitNotes] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);
  const [perfectHits, setPerfectHits] = useState(0);
  const [goodHits, setGoodHits] = useState(0);
  const [okayHits, setOkayHits] = useState(0);
  const [lastFeedback, setLastFeedback] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("");
  const [countdownValue, setCountdownValue] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const notesRef = useRef<Note[]>([]);
  const activeNotesRef = useRef<Note[]>([]);
  const gameStartTimeRef = useRef<number>(0);

  const getSongNotes = (songId: string): Note[] => {
    const songPatterns: Record<string, Note[]> = {
      // Músicas Fáceis - Sino
      "twinkle-bell": [
        { note: "C4", time: 1000, color: "#991b1b" },
        { note: "C4", time: 2000, color: "#991b1b" },
        { note: "G4", time: 3000, color: "#22c55e" },
        { note: "G4", time: 4000, color: "#22c55e" },
        { note: "A4", time: 5000, color: "#f59e0b" },
        { note: "A4", time: 6000, color: "#f59e0b" },
        { note: "G4", time: 7000, color: "#22c55e" },
        { note: "F4", time: 8000, color: "#ef4444" },
        { note: "F4", time: 9000, color: "#ef4444" },
        { note: "E4", time: 10000, color: "#dc2626" },
        { note: "E4", time: 11000, color: "#dc2626" },
        { note: "D4", time: 12000, color: "#b91c1c" },
        { note: "D4", time: 13000, color: "#b91c1c" },
        { note: "C4", time: 14000, color: "#991b1b" }
      ],
      "mary-lamb-bell": [
        { note: "E4", time: 1000, color: "#dc2626" },
        { note: "D4", time: 2000, color: "#b91c1c" },
        { note: "C4", time: 3000, color: "#991b1b" },
        { note: "D4", time: 4000, color: "#b91c1c" },
        { note: "E4", time: 5000, color: "#dc2626" },
        { note: "E4", time: 6000, color: "#dc2626" },
        { note: "E4", time: 7000, color: "#dc2626" },
        { note: "D4", time: 8000, color: "#b91c1c" },
        { note: "D4", time: 9000, color: "#b91c1c" },
        { note: "D4", time: 10000, color: "#b91c1c" },
        { note: "E4", time: 11000, color: "#dc2626" },
        { note: "G4", time: 12000, color: "#22c55e" },
        { note: "G4", time: 13000, color: "#22c55e" }
      ],
      "old-macdonald-bell": [
        { note: "G4", time: 1000, color: "#22c55e" },
        { note: "G4", time: 2000, color: "#22c55e" },
        { note: "G4", time: 3000, color: "#22c55e" },
        { note: "D4", time: 4000, color: "#b91c1c" },
        { note: "E4", time: 5000, color: "#dc2626" },
        { note: "E4", time: 6000, color: "#dc2626" },
        { note: "D4", time: 7000, color: "#b91c1c" },
        { note: "B3", time: 8000, color: "#7f1d1d" },
        { note: "B3", time: 9000, color: "#7f1d1d" },
        { note: "A3", time: 10000, color: "#450a0a" },
        { note: "A3", time: 11000, color: "#450a0a" },
        { note: "G4", time: 12000, color: "#22c55e" }
      ],
      "row-boat-bell": [
        { note: "C4", time: 1000, color: "#991b1b" },
        { note: "D4", time: 1500, color: "#b91c1c" },
        { note: "E4", time: 2000, color: "#dc2626" },
        { note: "F4", time: 2500, color: "#ef4444" },
        { note: "G4", time: 3000, color: "#22c55e" },
        { note: "C4", time: 4000, color: "#991b1b" },
        { note: "F4", time: 4500, color: "#ef4444" },
        { note: "E4", time: 5000, color: "#dc2626" },
        { note: "D4", time: 5500, color: "#b91c1c" },
        { note: "C4", time: 6000, color: "#991b1b" }
      ],
      
      // Músicas Fáceis - Xilofone
      "happy-birthday-xylophone": [
        { note: "C4", time: 1000, color: "#991b1b" },
        { note: "C4", time: 1500, color: "#991b1b" },
        { note: "D4", time: 2000, color: "#b91c1c" },
        { note: "C4", time: 2500, color: "#991b1b" },
        { note: "F4", time: 3000, color: "#ef4444" },
        { note: "E4", time: 3500, color: "#dc2626" },
        { note: "C4", time: 4500, color: "#991b1b" },
        { note: "C4", time: 5000, color: "#991b1b" },
        { note: "D4", time: 5500, color: "#b91c1c" },
        { note: "C4", time: 6000, color: "#991b1b" },
        { note: "G4", time: 6500, color: "#22c55e" },
        { note: "F4", time: 7000, color: "#ef4444" },
        { note: "C4", time: 8000, color: "#991b1b" },
        { note: "C4", time: 8500, color: "#991b1b" },
        { note: "C5", time: 9000, color: "#3b82f6" },
        { note: "A4", time: 9500, color: "#f59e0b" },
        { note: "F4", time: 10000, color: "#ef4444" },
        { note: "E4", time: 10500, color: "#dc2626" },
        { note: "D4", time: 11000, color: "#b91c1c" },
        { note: "A4", time: 12000, color: "#f59e0b" },
        { note: "A4", time: 12500, color: "#f59e0b" },
        { note: "F4", time: 13000, color: "#ef4444" },
        { note: "G4", time: 13500, color: "#22c55e" },
        { note: "F4", time: 14000, color: "#ef4444" }
      ],
      "london-bridge-xylophone": [
        { note: "G4", time: 1000, color: "#22c55e" },
        { note: "A4", time: 1500, color: "#f59e0b" },
        { note: "G4", time: 2000, color: "#22c55e" },
        { note: "F4", time: 2500, color: "#ef4444" },
        { note: "E4", time: 3000, color: "#dc2626" },
        { note: "F4", time: 3500, color: "#ef4444" },
        { note: "G4", time: 4000, color: "#22c55e" },
        { note: "D4", time: 4500, color: "#b91c1c" },
        { note: "E4", time: 5000, color: "#dc2626" },
        { note: "F4", time: 5500, color: "#ef4444" },
        { note: "E4", time: 6000, color: "#dc2626" },
        { note: "F4", time: 6500, color: "#ef4444" },
        { note: "G4", time: 7000, color: "#22c55e" },
        { note: "G4", time: 7500, color: "#22c55e" },
        { note: "A4", time: 8000, color: "#f59e0b" },
        { note: "G4", time: 8500, color: "#22c55e" },
        { note: "F4", time: 9000, color: "#ef4444" },
        { note: "E4", time: 9500, color: "#dc2626" },
        { note: "F4", time: 10000, color: "#ef4444" },
        { note: "G4", time: 10500, color: "#22c55e" },
        { note: "D4", time: 11000, color: "#b91c1c" },
        { note: "G4", time: 11500, color: "#22c55e" },
        { note: "E4", time: 12000, color: "#dc2626" },
        { note: "C4", time: 12500, color: "#991b1b" }
      ],
      "jingle-bells-xylophone": [
        { note: "E4", time: 1000, color: "#dc2626" },
        { note: "E4", time: 1500, color: "#dc2626" },
        { note: "E4", time: 2000, color: "#dc2626" },
        { note: "E4", time: 3000, color: "#dc2626" },
        { note: "E4", time: 3500, color: "#dc2626" },
        { note: "E4", time: 4000, color: "#dc2626" },
        { note: "E4", time: 5000, color: "#dc2626" },
        { note: "G4", time: 5500, color: "#22c55e" },
        { note: "C4", time: 6000, color: "#991b1b" },
        { note: "D4", time: 6500, color: "#b91c1c" },
        { note: "E4", time: 7000, color: "#dc2626" },
        { note: "F4", time: 8000, color: "#ef4444" },
        { note: "F4", time: 8500, color: "#ef4444" },
        { note: "F4", time: 9000, color: "#ef4444" },
        { note: "F4", time: 9500, color: "#ef4444" },
        { note: "F4", time: 10000, color: "#ef4444" },
        { note: "E4", time: 10500, color: "#dc2626" },
        { note: "E4", time: 11000, color: "#dc2626" },
        { note: "E4", time: 11500, color: "#dc2626" },
        { note: "E4", time: 12000, color: "#dc2626" },
        { note: "D4", time: 12500, color: "#b91c1c" },
        { note: "D4", time: 13000, color: "#b91c1c" },
        { note: "E4", time: 13500, color: "#dc2626" },
        { note: "D4", time: 14000, color: "#b91c1c" },
        { note: "G4", time: 14500, color: "#22c55e" }
      ],
      "twinkle-xylophone": [
        { note: "C4", time: 1000, color: "#991b1b" },
        { note: "C4", time: 2000, color: "#991b1b" },
        { note: "G4", time: 3000, color: "#22c55e" },
        { note: "G4", time: 4000, color: "#22c55e" },
        { note: "A4", time: 5000, color: "#f59e0b" },
        { note: "A4", time: 6000, color: "#f59e0b" },
        { note: "G4", time: 7000, color: "#22c55e" },
        { note: "F4", time: 8000, color: "#ef4444" },
        { note: "F4", time: 9000, color: "#ef4444" },
        { note: "E4", time: 10000, color: "#dc2626" },
        { note: "E4", time: 11000, color: "#dc2626" },
        { note: "D4", time: 12000, color: "#b91c1c" },
        { note: "D4", time: 13000, color: "#b91c1c" },
        { note: "C4", time: 14000, color: "#991b1b" }
      ],

      // Músicas Fáceis - Teclado
      "scale-keyboard": [
        { note: "C4", time: 1000, color: "#991b1b" },
        { note: "D4", time: 2000, color: "#b91c1c" },
        { note: "E4", time: 3000, color: "#dc2626" },
        { note: "F4", time: 4000, color: "#ef4444" },
        { note: "G4", time: 5000, color: "#22c55e" },
        { note: "A4", time: 6000, color: "#f59e0b" },
        { note: "B4", time: 7000, color: "#6366f1" },
        { note: "C5", time: 8000, color: "#3b82f6" },
        { note: "B4", time: 9000, color: "#6366f1" },
        { note: "A4", time: 10000, color: "#f59e0b" },
        { note: "G4", time: 11000, color: "#22c55e" },
        { note: "F4", time: 12000, color: "#ef4444" },
        { note: "E4", time: 13000, color: "#dc2626" },
        { note: "D4", time: 14000, color: "#b91c1c" },
        { note: "C4", time: 15000, color: "#991b1b" }
      ],
      "chopsticks-keyboard": [
        { note: "E4", time: 1000, color: "#dc2626" },
        { note: "D4", time: 1500, color: "#b91c1c" },
        { note: "C4", time: 2000, color: "#991b1b" },
        { note: "D4", time: 2500, color: "#b91c1c" },
        { note: "E4", time: 3000, color: "#dc2626" },
        { note: "E4", time: 3500, color: "#dc2626" },
        { note: "E4", time: 4000, color: "#dc2626" },
        { note: "D4", time: 4500, color: "#b91c1c" },
        { note: "D4", time: 5000, color: "#b91c1c" },
        { note: "D4", time: 5500, color: "#b91c1c" },
        { note: "E4", time: 6000, color: "#dc2626" },
        { note: "G4", time: 6500, color: "#22c55e" },
        { note: "G4", time: 7000, color: "#22c55e" }
      ],
      "hot-cross-keyboard": [
        { note: "B4", time: 1000, color: "#6366f1" },
        { note: "A4", time: 1500, color: "#f59e0b" },
        { note: "G4", time: 2000, color: "#22c55e" },
        { note: "B4", time: 3000, color: "#6366f1" },
        { note: "A4", time: 3500, color: "#f59e0b" },
        { note: "G4", time: 4000, color: "#22c55e" },
        { note: "G4", time: 5000, color: "#22c55e" },
        { note: "G4", time: 5500, color: "#22c55e" },
        { note: "G4", time: 6000, color: "#22c55e" },
        { note: "G4", time: 6500, color: "#22c55e" },
        { note: "A4", time: 7000, color: "#f59e0b" },
        { note: "A4", time: 7500, color: "#f59e0b" },
        { note: "A4", time: 8000, color: "#f59e0b" },
        { note: "A4", time: 8500, color: "#f59e0b" },
        { note: "B4", time: 9000, color: "#6366f1" },
        { note: "A4", time: 9500, color: "#f59e0b" },
        { note: "G4", time: 10000, color: "#22c55e" }
      ],

      // Músicas Médias - Sino
      "frere-jacques-bell": [
        { note: "C4", time: 1000, color: "#991b1b" },
        { note: "D4", time: 1500, color: "#b91c1c" },
        { note: "E4", time: 2000, color: "#dc2626" },
        { note: "C4", time: 2500, color: "#991b1b" },
        { note: "C4", time: 3000, color: "#991b1b" },
        { note: "D4", time: 3500, color: "#b91c1c" },
        { note: "E4", time: 4000, color: "#dc2626" },
        { note: "C4", time: 4500, color: "#991b1b" },
        { note: "E4", time: 5000, color: "#dc2626" },
        { note: "F4", time: 5500, color: "#ef4444" },
        { note: "G4", time: 6000, color: "#22c55e" },
        { note: "E4", time: 6500, color: "#dc2626" },
        { note: "F4", time: 7000, color: "#ef4444" },
        { note: "G4", time: 7500, color: "#22c55e" },
        { note: "G4", time: 8000, color: "#22c55e" },
        { note: "A4", time: 8500, color: "#f59e0b" },
        { note: "G4", time: 9000, color: "#22c55e" },
        { note: "F4", time: 9500, color: "#ef4444" },
        { note: "E4", time: 10000, color: "#dc2626" },
        { note: "C4", time: 10500, color: "#991b1b" },
        { note: "G4", time: 11000, color: "#22c55e" },
        { note: "A4", time: 11500, color: "#f59e0b" },
        { note: "G4", time: 12000, color: "#22c55e" },
        { note: "F4", time: 12500, color: "#ef4444" },
        { note: "E4", time: 13000, color: "#dc2626" },
        { note: "C4", time: 13500, color: "#991b1b" },
        { note: "C4", time: 14000, color: "#991b1b" },
        { note: "G3", time: 14500, color: "#166534" },
        { note: "C4", time: 15000, color: "#991b1b" }
      ],
      "amazing-grace-bell": [
        { note: "G4", time: 1000, color: "#22c55e" },
        { note: "C5", time: 2000, color: "#3b82f6" },
        { note: "E5", time: 3000, color: "#ec4899" },
        { note: "C5", time: 4000, color: "#3b82f6" },
        { note: "E5", time: 5000, color: "#ec4899" },
        { note: "D5", time: 6000, color: "#8b5cf6" },
        { note: "C5", time: 7000, color: "#3b82f6" },
        { note: "A4", time: 8000, color: "#f59e0b" },
        { note: "G4", time: 9000, color: "#22c55e" },
        { note: "C5", time: 10000, color: "#3b82f6" },
        { note: "E5", time: 11000, color: "#ec4899" },
        { note: "C5", time: 12000, color: "#3b82f6" },
        { note: "D5", time: 13000, color: "#8b5cf6" },
        { note: "C5", time: 14000, color: "#3b82f6" }
      ],
      "greensleeves-bell": [
        { note: "A4", time: 1000, color: "#f59e0b" },
        { note: "C5", time: 1500, color: "#3b82f6" },
        { note: "D5", time: 2000, color: "#8b5cf6" },
        { note: "E5", time: 2500, color: "#ec4899" },
        { note: "F5", time: 3000, color: "#f97316" },
        { note: "E5", time: 3500, color: "#ec4899" },
        { note: "D5", time: 4000, color: "#8b5cf6" },
        { note: "B4", time: 4500, color: "#6366f1" },
        { note: "G4", time: 5000, color: "#22c55e" },
        { note: "A4", time: 5500, color: "#f59e0b" },
        { note: "B4", time: 6000, color: "#6366f1" },
        { note: "C5", time: 6500, color: "#3b82f6" },
        { note: "A4", time: 7000, color: "#f59e0b" },
        { note: "G4", time: 7500, color: "#22c55e" },
        { note: "E4", time: 8000, color: "#dc2626" },
        { note: "G4", time: 8500, color: "#22c55e" },
        { note: "A4", time: 9000, color: "#f59e0b" }
      ],
      "scarborough-bell": [
        { note: "D4", time: 1000, color: "#b91c1c" },
        { note: "F4", time: 1500, color: "#ef4444" },
        { note: "D4", time: 2000, color: "#b91c1c" },
        { note: "A4", time: 2500, color: "#f59e0b" },
        { note: "G4", time: 3000, color: "#22c55e" },
        { note: "A4", time: 3500, color: "#f59e0b" },
        { note: "G4", time: 4000, color: "#22c55e" },
        { note: "E4", time: 4500, color: "#dc2626" },
        { note: "D4", time: 5000, color: "#b91c1c" },
        { note: "F4", time: 5500, color: "#ef4444" },
        { note: "G4", time: 6000, color: "#22c55e" },
        { note: "A4", time: 6500, color: "#f59e0b" },
        { note: "F4", time: 7000, color: "#ef4444" },
        { note: "D4", time: 7500, color: "#b91c1c" },
        { note: "A4", time: 8000, color: "#f59e0b" },
        { note: "G4", time: 8500, color: "#22c55e" },
        { note: "F4", time: 9000, color: "#ef4444" },
        { note: "D4", time: 9500, color: "#b91c1c" },
        { note: "F4", time: 10000, color: "#ef4444" },
        { note: "E4", time: 10500, color: "#dc2626" },
        { note: "D4", time: 11000, color: "#b91c1c" }
      ],

      // Músicas Médias - Xilofone
      "ode-joy-xylophone": [
        { note: "E4", time: 1000, color: "#dc2626" },
        { note: "E4", time: 1500, color: "#dc2626" },
        { note: "F4", time: 2000, color: "#ef4444" },
        { note: "G4", time: 2500, color: "#22c55e" },
        { note: "G4", time: 3000, color: "#22c55e" },
        { note: "F4", time: 3500, color: "#ef4444" },
        { note: "E4", time: 4000, color: "#dc2626" },
        { note: "D4", time: 4500, color: "#b91c1c" },
        { note: "C4", time: 5000, color: "#991b1b" },
        { note: "C4", time: 5500, color: "#991b1b" },
        { note: "D4", time: 6000, color: "#b91c1c" },
        { note: "E4", time: 6500, color: "#dc2626" },
        { note: "E4", time: 7000, color: "#dc2626" },
        { note: "D4", time: 7500, color: "#b91c1c" },
        { note: "D4", time: 8000, color: "#b91c1c" },
        { note: "E4", time: 9000, color: "#dc2626" },
        { note: "E4", time: 9500, color: "#dc2626" },
        { note: "F4", time: 10000, color: "#ef4444" },
        { note: "G4", time: 10500, color: "#22c55e" },
        { note: "G4", time: 11000, color: "#22c55e" },
        { note: "F4", time: 11500, color: "#ef4444" },
        { note: "E4", time: 12000, color: "#dc2626" },
        { note: "D4", time: 12500, color: "#b91c1c" },
        { note: "C4", time: 13000, color: "#991b1b" },
        { note: "C4", time: 13500, color: "#991b1b" },
        { note: "D4", time: 14000, color: "#b91c1c" },
        { note: "E4", time: 14500, color: "#dc2626" },
        { note: "D4", time: 15000, color: "#b91c1c" },
        { note: "C4", time: 15500, color: "#991b1b" },
        { note: "C4", time: 16000, color: "#991b1b" }
      ],
      "danny-boy-xylophone": [
        // Verse 1: "Oh Danny boy, the pipes, the pipes are calling"
        { note: "G4", time: 1000, color: "#22c55e" },
        { note: "C5", time: 1500, color: "#3b82f6" },
        { note: "C5", time: 2000, color: "#3b82f6" },
        { note: "A4", time: 2500, color: "#f59e0b" },
        { note: "A4", time: 3000, color: "#f59e0b" },
        { note: "F4", time: 3500, color: "#ef4444" },
        { note: "G4", time: 4000, color: "#22c55e" },
        { note: "A4", time: 4500, color: "#f59e0b" },
        { note: "C5", time: 5000, color: "#3b82f6" },
        
        // "From glen to glen, and down the mountain side"
        { note: "C5", time: 6000, color: "#3b82f6" },
        { note: "A4", time: 6500, color: "#f59e0b" },
        { note: "A4", time: 7000, color: "#f59e0b" },
        { note: "F4", time: 7500, color: "#ef4444" },
        { note: "F4", time: 8000, color: "#ef4444" },
        { note: "G4", time: 8500, color: "#22c55e" },
        { note: "A4", time: 9000, color: "#f59e0b" },
        { note: "F4", time: 9500, color: "#ef4444" },
        
        // Chorus continuation
        { note: "G4", time: 10500, color: "#22c55e" },
        { note: "C5", time: 11000, color: "#3b82f6" },
        { note: "D5", time: 11500, color: "#8b5cf6" },
        { note: "C5", time: 12000, color: "#3b82f6" },
        { note: "A4", time: 12500, color: "#f59e0b" },
        { note: "F4", time: 13000, color: "#ef4444" },
        { note: "G4", time: 13500, color: "#22c55e" },
        { note: "C5", time: 14000, color: "#3b82f6" }
      ],
      "auld-lang-xylophone": [
        // "Should auld acquaintance be forgot"
        { note: "G4", time: 1000, color: "#22c55e" },
        { note: "C5", time: 1500, color: "#3b82f6" },
        { note: "C5", time: 2000, color: "#3b82f6" },
        { note: "C5", time: 2500, color: "#3b82f6" },
        { note: "E5", time: 3000, color: "#ec4899" },
        { note: "D5", time: 3500, color: "#8b5cf6" },
        { note: "C5", time: 4000, color: "#3b82f6" },
        { note: "D5", time: 4500, color: "#8b5cf6" },
        
        // "And never brought to mind"
        { note: "E5", time: 5500, color: "#ec4899" },
        { note: "E5", time: 6000, color: "#ec4899" },
        { note: "E5", time: 6500, color: "#ec4899" },
        { note: "G5", time: 7000, color: "#10b981" },
        { note: "E5", time: 7500, color: "#ec4899" },
        { note: "D5", time: 8000, color: "#8b5cf6" },
        { note: "C5", time: 8500, color: "#3b82f6" },
        
        // "Should auld acquaintance be forgot"
        { note: "G4", time: 9500, color: "#22c55e" },
        { note: "C5", time: 10000, color: "#3b82f6" },
        { note: "C5", time: 10500, color: "#3b82f6" },
        { note: "C5", time: 11000, color: "#3b82f6" },
        { note: "E5", time: 11500, color: "#ec4899" },
        { note: "D5", time: 12000, color: "#8b5cf6" },
        { note: "C5", time: 12500, color: "#3b82f6" },
        
        // "And days of auld lang syne"
        { note: "A4", time: 13500, color: "#f59e0b" },
        { note: "A4", time: 14000, color: "#f59e0b" },
        { note: "G4", time: 14500, color: "#22c55e" },
        { note: "A4", time: 15000, color: "#f59e0b" },
        { note: "C5", time: 15500, color: "#3b82f6" },
        { note: "G4", time: 16000, color: "#22c55e" }
      ],
      "swan-lake-xylophone": [
        // Iconic opening theme
        { note: "A4", time: 1000, color: "#f59e0b" },
        { note: "G4", time: 1500, color: "#22c55e" },
        { note: "F4", time: 2000, color: "#ef4444" },
        { note: "E4", time: 2500, color: "#dc2626" },
        { note: "F4", time: 3000, color: "#ef4444" },
        { note: "G4", time: 3500, color: "#22c55e" },
        { note: "A4", time: 4000, color: "#f59e0b" },
        { note: "A4", time: 5000, color: "#f59e0b" },
        
        // Second phrase
        { note: "A4", time: 6000, color: "#f59e0b" },
        { note: "G4", time: 6500, color: "#22c55e" },
        { note: "F4", time: 7000, color: "#ef4444" },
        { note: "E4", time: 7500, color: "#dc2626" },
        { note: "F4", time: 8000, color: "#ef4444" },
        { note: "G4", time: 8500, color: "#22c55e" },
        { note: "A4", time: 9000, color: "#f59e0b" },
        { note: "A4", time: 10000, color: "#f59e0b" },
        
        // Development
        { note: "C5", time: 11000, color: "#3b82f6" },
        { note: "B4", time: 11500, color: "#6366f1" },
        { note: "A4", time: 12000, color: "#f59e0b" },
        { note: "G4", time: 12500, color: "#22c55e" },
        { note: "F4", time: 13000, color: "#ef4444" },
        { note: "E4", time: 13500, color: "#dc2626" },
        { note: "D4", time: 14000, color: "#b91c1c" },
        { note: "C4", time: 14500, color: "#991b1b" },
        { note: "A4", time: 15000, color: "#f59e0b" }
      ],

      // Músicas Médias - Teclado
      "moonlight-keyboard": [
        // Opening triplet pattern
        { note: "C4", time: 1000, color: "#991b1b" },
        { note: "E4", time: 1200, color: "#dc2626" },
        { note: "G4", time: 1400, color: "#22c55e" },
        { note: "C5", time: 1600, color: "#3b82f6" },
        { note: "E4", time: 1800, color: "#dc2626" },
        { note: "G4", time: 2000, color: "#22c55e" },
        
        { note: "C4", time: 2400, color: "#991b1b" },
        { note: "E4", time: 2600, color: "#dc2626" },
        { note: "G4", time: 2800, color: "#22c55e" },
        { note: "C5", time: 3000, color: "#3b82f6" },
        { note: "E4", time: 3200, color: "#dc2626" },
        { note: "G4", time: 3400, color: "#22c55e" },
        
        // Melody enters
        { note: "B4", time: 4000, color: "#6366f1" },
        { note: "C5", time: 4800, color: "#3b82f6" },
        { note: "D5", time: 5600, color: "#8b5cf6" },
        { note: "C5", time: 6400, color: "#3b82f6" },
        { note: "B4", time: 7200, color: "#6366f1" },
        { note: "A4", time: 8000, color: "#f59e0b" },
        
        // Continuation
        { note: "G4", time: 9000, color: "#22c55e" },
        { note: "A4", time: 9800, color: "#f59e0b" },
        { note: "B4", time: 10600, color: "#6366f1" },
        { note: "C5", time: 11400, color: "#3b82f6" },
        { note: "B4", time: 12200, color: "#6366f1" },
        { note: "A4", time: 13000, color: "#f59e0b" },
        { note: "G4", time: 14000, color: "#22c55e" }
      ],
      "canon-d-keyboard": [
        // Bass line foundation
        { note: "D4", time: 1000, color: "#b91c1c" },
        { note: "A4", time: 2000, color: "#f59e0b" },
        { note: "B4", time: 3000, color: "#6366f1" },
        { note: "F4", time: 4000, color: "#ef4444" },
        { note: "G4", time: 5000, color: "#22c55e" },
        { note: "D4", time: 6000, color: "#b91c1c" },
        { note: "G4", time: 7000, color: "#22c55e" },
        { note: "A4", time: 8000, color: "#f59e0b" },
        
        // First canon voice
        { note: "D5", time: 9000, color: "#8b5cf6" },
        { note: "C5", time: 9500, color: "#3b82f6" },
        { note: "B4", time: 10000, color: "#6366f1" },
        { note: "A4", time: 10500, color: "#f59e0b" },
        { note: "B4", time: 11000, color: "#6366f1" },
        { note: "C5", time: 11500, color: "#3b82f6" },
        { note: "D5", time: 12000, color: "#8b5cf6" },
        { note: "A4", time: 12500, color: "#f59e0b" },
        
        // Development
        { note: "B4", time: 13000, color: "#6366f1" },
        { note: "G4", time: 13500, color: "#22c55e" },
        { note: "A4", time: 14000, color: "#f59e0b" },
        { note: "F4", time: 14500, color: "#ef4444" },
        { note: "G4", time: 15000, color: "#22c55e" },
        { note: "D4", time: 15500, color: "#b91c1c" },
        { note: "A4", time: 16000, color: "#f59e0b" },
        { note: "D5", time: 16500, color: "#8b5cf6" }
      ],
      "bach-minuet-keyboard": [
        { note: "G4", time: 1000, color: "#22c55e" },
        { note: "D4", time: 1500, color: "#b91c1c" },
        { note: "G4", time: 2000, color: "#22c55e" },
        { note: "A4", time: 2500, color: "#f59e0b" },
        { note: "B4", time: 3000, color: "#6366f1" },
        { note: "C5", time: 3500, color: "#3b82f6" },
        { note: "D5", time: 4000, color: "#8b5cf6" },
        { note: "G4", time: 4500, color: "#22c55e" },
        { note: "A4", time: 5000, color: "#f59e0b" },
        { note: "D4", time: 5500, color: "#b91c1c" },
        { note: "G4", time: 6000, color: "#22c55e" },
        { note: "B4", time: 6500, color: "#6366f1" },
        { note: "A4", time: 7000, color: "#f59e0b" },
        { note: "G4", time: 7500, color: "#22c55e" },
        { note: "F4", time: 8000, color: "#ef4444" },
        { note: "G4", time: 8500, color: "#22c55e" },
        { note: "A4", time: 9000, color: "#f59e0b" },
        { note: "D4", time: 9500, color: "#b91c1c" },
        { note: "E4", time: 10000, color: "#dc2626" },
        { note: "F4", time: 10500, color: "#ef4444" },
        { note: "G4", time: 11000, color: "#22c55e" },
        { note: "A4", time: 11500, color: "#f59e0b" },
        { note: "B4", time: 12000, color: "#6366f1" },
        { note: "G4", time: 12500, color: "#22c55e" },
        { note: "B4", time: 13000, color: "#6366f1" },
        { note: "A4", time: 13500, color: "#f59e0b" },
        { note: "G4", time: 14000, color: "#22c55e" }
      ],

      // Músicas Difíceis - Sino
      "william-tell-bell": [
        { note: "G4", time: 1000, color: "#22c55e" },
        { note: "G4", time: 1250, color: "#22c55e" },
        { note: "G4", time: 1500, color: "#22c55e" },
        { note: "G4", time: 1750, color: "#22c55e" },
        { note: "G4", time: 2000, color: "#22c55e" },
        { note: "E4", time: 2250, color: "#dc2626" },
        { note: "C4", time: 2500, color: "#991b1b" },
        { note: "E4", time: 2750, color: "#dc2626" },
        { note: "G4", time: 3000, color: "#22c55e" },
        { note: "G4", time: 3250, color: "#22c55e" },
        { note: "G4", time: 3500, color: "#22c55e" },
        { note: "E4", time: 3750, color: "#dc2626" },
        { note: "C4", time: 4000, color: "#991b1b" },
        { note: "E4", time: 4250, color: "#dc2626" },
        { note: "G4", time: 4500, color: "#22c55e" },
        { note: "G4", time: 4750, color: "#22c55e" },
        { note: "G4", time: 5000, color: "#22c55e" },
        { note: "A4", time: 5250, color: "#f59e0b" },
        { note: "B4", time: 5500, color: "#6366f1" },
        { note: "C5", time: 5750, color: "#3b82f6" },
        { note: "D5", time: 6000, color: "#8b5cf6" },
        { note: "C5", time: 6250, color: "#3b82f6" },
        { note: "B4", time: 6500, color: "#6366f1" },
        { note: "A4", time: 6750, color: "#f59e0b" },
        { note: "G4", time: 7000, color: "#22c55e" },
        { note: "A4", time: 7250, color: "#f59e0b" },
        { note: "B4", time: 7500, color: "#6366f1" },
        { note: "G4", time: 7750, color: "#22c55e" },
        { note: "A4", time: 8000, color: "#f59e0b" },
        { note: "G4", time: 8250, color: "#22c55e" },
        { note: "F4", time: 8500, color: "#ef4444" },
        { note: "E4", time: 8750, color: "#dc2626" },
        { note: "D4", time: 9000, color: "#b91c1c" },
        { note: "C4", time: 9250, color: "#991b1b" }
      ],
      "flight-bumblebee-bell": [
        { note: "E4", time: 500, color: "#dc2626" },
        { note: "D4", time: 600, color: "#b91c1c" },
        { note: "E4", time: 700, color: "#dc2626" },
        { note: "F4", time: 800, color: "#ef4444" },
        { note: "E4", time: 900, color: "#dc2626" },
        { note: "D4", time: 1000, color: "#b91c1c" },
        { note: "C4", time: 1100, color: "#991b1b" },
        { note: "B3", time: 1200, color: "#7f1d1d" },
        { note: "C4", time: 1300, color: "#991b1b" },
        { note: "D4", time: 1400, color: "#b91c1c" },
        { note: "C4", time: 1500, color: "#991b1b" },
        { note: "B3", time: 1600, color: "#7f1d1d" },
        { note: "A3", time: 1700, color: "#450a0a" },
        { note: "G3", time: 1800, color: "#166534" },
        { note: "A3", time: 1900, color: "#450a0a" },
        { note: "B3", time: 2000, color: "#7f1d1d" },
        { note: "A3", time: 2100, color: "#450a0a" },
        { note: "G3", time: 2200, color: "#166534" },
        { note: "F3", time: 2300, color: "#9f1239" },
        { note: "E3", time: 2400, color: "#881337" },
        { note: "F3", time: 2500, color: "#9f1239" },
        { note: "G3", time: 2600, color: "#166534" },
        { note: "F3", time: 2700, color: "#9f1239" },
        { note: "E3", time: 2800, color: "#881337" },
        { note: "D3", time: 2900, color: "#701a75" },
        { note: "C3", time: 3000, color: "#581c87" },
        { note: "D3", time: 3100, color: "#701a75" },
        { note: "E3", time: 3200, color: "#881337" },
        { note: "D3", time: 3300, color: "#701a75" },
        { note: "C3", time: 3400, color: "#581c87" },
        { note: "B2", time: 3500, color: "#4c1d95" },
        { note: "A2", time: 3600, color: "#312e81" },
        { note: "B2", time: 3700, color: "#4c1d95" },
        { note: "C3", time: 3800, color: "#581c87" },
        { note: "D3", time: 3900, color: "#701a75" },
        { note: "E3", time: 4000, color: "#881337" },
        { note: "F3", time: 4100, color: "#9f1239" },
        { note: "G3", time: 4200, color: "#166534" },
        { note: "A3", time: 4300, color: "#450a0a" },
        { note: "B3", time: 4400, color: "#7f1d1d" },
        { note: "C4", time: 4500, color: "#991b1b" },
        { note: "D4", time: 4600, color: "#b91c1c" },
        { note: "E4", time: 4700, color: "#dc2626" },
        { note: "F4", time: 4800, color: "#ef4444" },
        { note: "G4", time: 4900, color: "#22c55e" },
        { note: "A4", time: 5000, color: "#f59e0b" }
      ],

      // Músicas Difíceis - Xilofone
      "canon-xylophone": [
        { note: "D4", time: 1000, color: "#b91c1c" },
        { note: "A4", time: 1500, color: "#f59e0b" },
        { note: "B4", time: 2000, color: "#6366f1" },
        { note: "F4", time: 2500, color: "#ef4444" },
        { note: "G4", time: 3000, color: "#22c55e" },
        { note: "D4", time: 3500, color: "#b91c1c" },
        { note: "G4", time: 4000, color: "#22c55e" },
        { note: "A4", time: 4500, color: "#f59e0b" },
        { note: "D5", time: 5000, color: "#8b5cf6" },
        { note: "C5", time: 5500, color: "#3b82f6" },
        { note: "B4", time: 6000, color: "#6366f1" },
        { note: "A4", time: 6500, color: "#f59e0b" },
        { note: "B4", time: 7000, color: "#6366f1" },
        { note: "C5", time: 7500, color: "#3b82f6" },
        { note: "D5", time: 8000, color: "#8b5cf6" },
        { note: "C5", time: 8500, color: "#3b82f6" },
        { note: "B4", time: 9000, color: "#6366f1" },
        { note: "A4", time: 9500, color: "#f59e0b" },
        { note: "G4", time: 10000, color: "#22c55e" },
        { note: "F4", time: 10500, color: "#ef4444" },
        { note: "E4", time: 11000, color: "#dc2626" },
        { note: "D4", time: 11500, color: "#b91c1c" },
        { note: "E4", time: 12000, color: "#dc2626" },
        { note: "F4", time: 12500, color: "#ef4444" },
        { note: "G4", time: 13000, color: "#22c55e" },
        { note: "A4", time: 13500, color: "#f59e0b" },
        { note: "B4", time: 14000, color: "#6366f1" },
        { note: "G4", time: 14500, color: "#22c55e" },
        { note: "A4", time: 15000, color: "#f59e0b" },
        { note: "F4", time: 15500, color: "#ef4444" },
        { note: "G4", time: 16000, color: "#22c55e" },
        { note: "E4", time: 16500, color: "#dc2626" },
        { note: "F4", time: 17000, color: "#ef4444" },
        { note: "D4", time: 17500, color: "#b91c1c" },
        { note: "E4", time: 18000, color: "#dc2626" },
        { note: "C4", time: 18500, color: "#991b1b" },
        { note: "D4", time: 19000, color: "#b91c1c" }
      ],
      "turkish-march-xylophone": [
        // Opening theme - Rondo Alla Turca
        { note: "B4", time: 500, color: "#6366f1" },
        { note: "A4", time: 750, color: "#f59e0b" },
        { note: "G4", time: 1000, color: "#22c55e" },
        { note: "A4", time: 1250, color: "#f59e0b" },
        { note: "C5", time: 1500, color: "#3b82f6" },
        { note: "C5", time: 1750, color: "#3b82f6" },
        { note: "C5", time: 2000, color: "#3b82f6" },
        
        { note: "B4", time: 2500, color: "#6366f1" },
        { note: "A4", time: 2750, color: "#f59e0b" },
        { note: "G4", time: 3000, color: "#22c55e" },
        { note: "A4", time: 3250, color: "#f59e0b" },
        { note: "B4", time: 3500, color: "#6366f1" },
        { note: "B4", time: 3750, color: "#6366f1" },
        { note: "B4", time: 4000, color: "#6366f1" },
        
        // Second phrase
        { note: "B4", time: 4500, color: "#6366f1" },
        { note: "A4", time: 4750, color: "#f59e0b" },
        { note: "G4", time: 5000, color: "#22c55e" },
        { note: "A4", time: 5250, color: "#f59e0b" },
        { note: "C5", time: 5500, color: "#3b82f6" },
        { note: "C5", time: 5750, color: "#3b82f6" },
        { note: "C5", time: 6000, color: "#3b82f6" },
        
        { note: "B4", time: 6500, color: "#6366f1" },
        { note: "A4", time: 6750, color: "#f59e0b" },
        { note: "G4", time: 7000, color: "#22c55e" },
        { note: "A4", time: 7250, color: "#f59e0b" },
        { note: "A4", time: 7500, color: "#f59e0b" },
        
        // Fast section
        { note: "D5", time: 8000, color: "#8b5cf6" },
        { note: "C5", time: 8200, color: "#3b82f6" },
        { note: "B4", time: 8400, color: "#6366f1" },
        { note: "A4", time: 8600, color: "#f59e0b" },
        { note: "G4", time: 8800, color: "#22c55e" },
        { note: "F4", time: 9000, color: "#ef4444" },
        { note: "E4", time: 9200, color: "#dc2626" },
        { note: "D4", time: 9400, color: "#b91c1c" },
        
        { note: "E4", time: 9800, color: "#dc2626" },
        { note: "F4", time: 10000, color: "#ef4444" },
        { note: "G4", time: 10200, color: "#22c55e" },
        { note: "A4", time: 10400, color: "#f59e0b" },
        { note: "B4", time: 10600, color: "#6366f1" },
        { note: "C5", time: 10800, color: "#3b82f6" },
        { note: "D5", time: 11000, color: "#8b5cf6" },
        { note: "E5", time: 11200, color: "#ec4899" }
      ],
      "spring-vivaldi-xylophone": [
        // Spring opening - Allegro
        { note: "E5", time: 500, color: "#ec4899" },
        { note: "E5", time: 750, color: "#ec4899" },
        { note: "E5", time: 1000, color: "#ec4899" },
        { note: "E5", time: 1250, color: "#ec4899" },
        { note: "E5", time: 1500, color: "#ec4899" },
        { note: "D5", time: 1750, color: "#8b5cf6" },
        { note: "C5", time: 2000, color: "#3b82f6" },
        { note: "B4", time: 2250, color: "#6366f1" },
        
        // Bird song motif
        { note: "A4", time: 2750, color: "#f59e0b" },
        { note: "B4", time: 3000, color: "#6366f1" },
        { note: "C5", time: 3250, color: "#3b82f6" },
        { note: "D5", time: 3500, color: "#8b5cf6" },
        { note: "E5", time: 3750, color: "#ec4899" },
        { note: "D5", time: 4000, color: "#8b5cf6" },
        { note: "C5", time: 4250, color: "#3b82f6" },
        { note: "B4", time: 4500, color: "#6366f1" },
        
        // Spring celebration
        { note: "C5", time: 5000, color: "#3b82f6" },
        { note: "B4", time: 5200, color: "#6366f1" },
        { note: "A4", time: 5400, color: "#f59e0b" },
        { note: "G4", time: 5600, color: "#22c55e" },
        { note: "F4", time: 5800, color: "#ef4444" },
        { note: "G4", time: 6000, color: "#22c55e" },
        { note: "A4", time: 6200, color: "#f59e0b" },
        { note: "B4", time: 6400, color: "#6366f1" },
        
        // Flowing melody
        { note: "C5", time: 6800, color: "#3b82f6" },
        { note: "D5", time: 7000, color: "#8b5cf6" },
        { note: "E5", time: 7200, color: "#ec4899" },
        { note: "F5", time: 7400, color: "#f97316" },
        { note: "G5", time: 7600, color: "#10b981" },
        { note: "F5", time: 7800, color: "#f97316" },
        { note: "E5", time: 8000, color: "#ec4899" },
        { note: "D5", time: 8200, color: "#8b5cf6" },
        
        // Nature sounds
        { note: "E5", time: 8600, color: "#ec4899" },
        { note: "E5", time: 8800, color: "#ec4899" },
        { note: "D5", time: 9000, color: "#8b5cf6" },
        { note: "C5", time: 9200, color: "#3b82f6" },
        { note: "B4", time: 9400, color: "#6366f1" },
        { note: "A4", time: 9600, color: "#f59e0b" },
        { note: "G4", time: 9800, color: "#22c55e" },
        { note: "A4", time: 10000, color: "#f59e0b" },
        
        // Finale
        { note: "B4", time: 10400, color: "#6366f1" },
        { note: "C5", time: 10600, color: "#3b82f6" },
        { note: "D5", time: 10800, color: "#8b5cf6" },
        { note: "E5", time: 11000, color: "#ec4899" },
        { note: "F5", time: 11200, color: "#f97316" },
        { note: "E5", time: 11400, color: "#ec4899" },
        { note: "D5", time: 11600, color: "#8b5cf6" },
        { note: "C5", time: 11800, color: "#3b82f6" },
        { note: "E5", time: 12000, color: "#ec4899" }
      ],

      // Músicas Difíceis - Teclado
      "fur-elise-keyboard": [
        { note: "E5", time: 1000, color: "#ec4899" },
        { note: "D5", time: 1250, color: "#8b5cf6" },
        { note: "E5", time: 1500, color: "#ec4899" },
        { note: "D5", time: 1750, color: "#8b5cf6" },
        { note: "E5", time: 2000, color: "#ec4899" },
        { note: "B4", time: 2250, color: "#6366f1" },
        { note: "D5", time: 2500, color: "#8b5cf6" },
        { note: "C5", time: 2750, color: "#3b82f6" },
        { note: "A4", time: 3000, color: "#f59e0b" },
        { note: "C4", time: 3500, color: "#991b1b" },
        { note: "E4", time: 3750, color: "#dc2626" },
        { note: "A4", time: 4000, color: "#f59e0b" },
        { note: "B4", time: 4250, color: "#6366f1" },
        { note: "E4", time: 4750, color: "#dc2626" },
        { note: "G4", time: 5000, color: "#22c55e" },
        { note: "B4", time: 5250, color: "#6366f1" },
        { note: "C5", time: 5500, color: "#3b82f6" },
        { note: "E4", time: 6000, color: "#dc2626" },
        { note: "E5", time: 6250, color: "#ec4899" },
        { note: "D5", time: 6500, color: "#8b5cf6" },
        { note: "E5", time: 6750, color: "#ec4899" },
        { note: "D5", time: 7000, color: "#8b5cf6" },
        { note: "E5", time: 7250, color: "#ec4899" },
        { note: "B4", time: 7500, color: "#6366f1" },
        { note: "D5", time: 7750, color: "#8b5cf6" },
        { note: "C5", time: 8000, color: "#3b82f6" },
        { note: "A4", time: 8250, color: "#f59e0b" }
      ],
      "claire-de-lune-keyboard": [
        { note: "D4", time: 1000, color: "#b91c1c" },
        { note: "F4", time: 1500, color: "#ef4444" },
        { note: "A4", time: 2000, color: "#f59e0b" },
        { note: "C5", time: 2500, color: "#3b82f6" },
        { note: "D5", time: 3000, color: "#8b5cf6" },
        { note: "E5", time: 3500, color: "#ec4899" },
        { note: "F5", time: 4000, color: "#f97316" },
        { note: "G5", time: 4500, color: "#10b981" },
        { note: "E5", time: 5000, color: "#ec4899" },
        { note: "C5", time: 5500, color: "#3b82f6" },
        { note: "A4", time: 6000, color: "#f59e0b" },
        { note: "B4", time: 6500, color: "#6366f1" },
        { note: "C5", time: 7000, color: "#3b82f6" },
        { note: "D5", time: 7500, color: "#8b5cf6" },
        { note: "C5", time: 8000, color: "#3b82f6" },
        { note: "B4", time: 8500, color: "#6366f1" },
        { note: "A4", time: 9000, color: "#f59e0b" },
        { note: "G4", time: 9500, color: "#22c55e" },
        { note: "F4", time: 10000, color: "#ef4444" },
        { note: "E4", time: 10500, color: "#dc2626" },
        { note: "D4", time: 11000, color: "#b91c1c" },
        { note: "E4", time: 11500, color: "#dc2626" },
        { note: "F4", time: 12000, color: "#ef4444" },
        { note: "G4", time: 12500, color: "#22c55e" },
        { note: "A4", time: 13000, color: "#f59e0b" },
        { note: "B4", time: 13500, color: "#6366f1" },
        { note: "C5", time: 14000, color: "#3b82f6" },
        { note: "D5", time: 14500, color: "#8b5cf6" }
      ],
      "invention-1-keyboard": [
        { note: "C4", time: 1000, color: "#991b1b" },
        { note: "D4", time: 1250, color: "#b91c1c" },
        { note: "E4", time: 1500, color: "#dc2626" },
        { note: "F4", time: 1750, color: "#ef4444" },
        { note: "G4", time: 2000, color: "#22c55e" },
        { note: "A4", time: 2250, color: "#f59e0b" },
        { note: "G4", time: 2500, color: "#22c55e" },
        { note: "F4", time: 2750, color: "#ef4444" },
        { note: "E4", time: 3000, color: "#dc2626" },
        { note: "D4", time: 3250, color: "#b91c1c" },
        { note: "C4", time: 3500, color: "#991b1b" },
        { note: "B3", time: 3750, color: "#7f1d1d" },
        { note: "C4", time: 4000, color: "#991b1b" },
        { note: "E4", time: 4250, color: "#dc2626" },
        { note: "G4", time: 4500, color: "#22c55e" },
        { note: "C5", time: 4750, color: "#3b82f6" },
        { note: "G4", time: 5000, color: "#22c55e" },
        { note: "A4", time: 5250, color: "#f59e0b" },
        { note: "B4", time: 5500, color: "#6366f1" },
        { note: "C5", time: 5750, color: "#3b82f6" },
        { note: "D5", time: 6000, color: "#8b5cf6" },
        { note: "E5", time: 6250, color: "#ec4899" },
        { note: "D5", time: 6500, color: "#8b5cf6" },
        { note: "C5", time: 6750, color: "#3b82f6" },
        { note: "B4", time: 7000, color: "#6366f1" },
        { note: "A4", time: 7250, color: "#f59e0b" },
        { note: "G4", time: 7500, color: "#22c55e" },
        { note: "F4", time: 7750, color: "#ef4444" },
        { note: "G4", time: 8000, color: "#22c55e" },
        { note: "B4", time: 8250, color: "#6366f1" },
        { note: "D5", time: 8500, color: "#8b5cf6" },
        { note: "F5", time: 8750, color: "#f97316" },
        { note: "E5", time: 9000, color: "#ec4899" },
        { note: "D5", time: 9250, color: "#8b5cf6" },
        { note: "C5", time: 9500, color: "#3b82f6" },
        { note: "B4", time: 9750, color: "#6366f1" },
        { note: "A4", time: 10000, color: "#f59e0b" },
        { note: "G4", time: 10250, color: "#22c55e" },
        { note: "F4", time: 10500, color: "#ef4444" },
        { note: "E4", time: 10750, color: "#dc2626" },
        { note: "D4", time: 11000, color: "#b91c1c" },
        { note: "C4", time: 11250, color: "#991b1b" }
      ],
      "chopin-minute-keyboard": [
        { note: "D5", time: 1000, color: "#8b5cf6" },
        { note: "C5", time: 1200, color: "#3b82f6" },
        { note: "B4", time: 1400, color: "#6366f1" },
        { note: "A4", time: 1600, color: "#f59e0b" },
        { note: "G4", time: 1800, color: "#22c55e" },
        { note: "F4", time: 2000, color: "#ef4444" },
        { note: "E4", time: 2200, color: "#dc2626" },
        { note: "D4", time: 2400, color: "#b91c1c" },
        { note: "C4", time: 2600, color: "#991b1b" },
        { note: "D4", time: 2800, color: "#b91c1c" },
        { note: "E4", time: 3000, color: "#dc2626" },
        { note: "F4", time: 3200, color: "#ef4444" },
        { note: "G4", time: 3400, color: "#22c55e" },
        { note: "A4", time: 3600, color: "#f59e0b" },
        { note: "B4", time: 3800, color: "#6366f1" },
        { note: "C5", time: 4000, color: "#3b82f6" },
        { note: "D5", time: 4200, color: "#8b5cf6" },
        { note: "E5", time: 4400, color: "#ec4899" },
        { note: "F5", time: 4600, color: "#f97316" },
        { note: "G5", time: 4800, color: "#10b981" },
        { note: "A5", time: 5000, color: "#0ea5e9" },
        { note: "G5", time: 5200, color: "#10b981" },
        { note: "F5", time: 5400, color: "#f97316" },
        { note: "E5", time: 5600, color: "#ec4899" },
        { note: "D5", time: 5800, color: "#8b5cf6" },
        { note: "C5", time: 6000, color: "#3b82f6" },
        { note: "B4", time: 6200, color: "#6366f1" },
        { note: "A4", time: 6400, color: "#f59e0b" },
        { note: "G4", time: 6600, color: "#22c55e" },
        { note: "F4", time: 6800, color: "#ef4444" },
        { note: "E4", time: 7000, color: "#dc2626" },
        { note: "D4", time: 7200, color: "#b91c1c" }
      ],

      // Músicas Brasileiras - Mix de instrumentos
      "asa-branca-bell": [
        { note: "G4", time: 1000, color: "#22c55e" },
        { note: "A4", time: 1500, color: "#f59e0b" },
        { note: "B4", time: 2000, color: "#6366f1" },
        { note: "B4", time: 2500, color: "#6366f1" },
        { note: "A4", time: 3000, color: "#f59e0b" },
        { note: "G4", time: 3500, color: "#22c55e" },
        { note: "G4", time: 4000, color: "#22c55e" },
        { note: "E4", time: 4500, color: "#dc2626" },
        { note: "E4", time: 5000, color: "#dc2626" },
        { note: "G4", time: 5500, color: "#22c55e" },
        { note: "G4", time: 6000, color: "#22c55e" },
        { note: "F4", time: 6500, color: "#ef4444" },
        { note: "E4", time: 7000, color: "#dc2626" },
        { note: "D4", time: 7500, color: "#b91c1c" },
        { note: "C4", time: 8000, color: "#991b1b" },
        { note: "D4", time: 8500, color: "#b91c1c" },
        { note: "E4", time: 9000, color: "#dc2626" },
        { note: "F4", time: 9500, color: "#ef4444" },
        { note: "G4", time: 10000, color: "#22c55e" },
        { note: "G4", time: 10500, color: "#22c55e" },
        { note: "A4", time: 11000, color: "#f59e0b" },
        { note: "G4", time: 11500, color: "#22c55e" },
        { note: "F4", time: 12000, color: "#ef4444" },
        { note: "E4", time: 12500, color: "#dc2626" },
        { note: "D4", time: 13000, color: "#b91c1c" },
        { note: "C4", time: 13500, color: "#991b1b" }
      ],
      "aquarela-xylophone": [
        { note: "C4", time: 1000, color: "#991b1b" },
        { note: "D4", time: 1500, color: "#b91c1c" },
        { note: "E4", time: 2000, color: "#dc2626" },
        { note: "F4", time: 2500, color: "#ef4444" },
        { note: "G4", time: 3000, color: "#22c55e" },
        { note: "G4", time: 3500, color: "#22c55e" },
        { note: "G4", time: 4000, color: "#22c55e" },
        { note: "A4", time: 4500, color: "#f59e0b" },
        { note: "G4", time: 5000, color: "#22c55e" },
        { note: "F4", time: 5500, color: "#ef4444" },
        { note: "E4", time: 6000, color: "#dc2626" },
        { note: "D4", time: 6500, color: "#b91c1c" },
        { note: "C4", time: 7000, color: "#991b1b" },
        { note: "C4", time: 7500, color: "#991b1b" },
        { note: "C4", time: 8000, color: "#991b1b" },
        { note: "D4", time: 8500, color: "#b91c1c" },
        { note: "E4", time: 9000, color: "#dc2626" },
        { note: "F4", time: 9500, color: "#ef4444" },
        { note: "G4", time: 10000, color: "#22c55e" },
        { note: "G4", time: 10500, color: "#22c55e" },
        { note: "G4", time: 11000, color: "#22c55e" },
        { note: "A4", time: 11500, color: "#f59e0b" },
        { note: "G4", time: 12000, color: "#22c55e" },
        { note: "F4", time: 12500, color: "#ef4444" },
        { note: "E4", time: 13000, color: "#dc2626" },
        { note: "D4", time: 13500, color: "#b91c1c" },
        { note: "C4", time: 14000, color: "#991b1b" }
      ],
      "garota-ipanema-keyboard": [
        { note: "G4", time: 1000, color: "#22c55e" },
        { note: "F4", time: 1500, color: "#ef4444" },
        { note: "G4", time: 2000, color: "#22c55e" },
        { note: "F4", time: 2500, color: "#ef4444" },
        { note: "E4", time: 3000, color: "#dc2626" },
        { note: "D4", time: 3500, color: "#b91c1c" },
        { note: "C4", time: 4000, color: "#991b1b" },
        { note: "B3", time: 4500, color: "#7f1d1d" },
        { note: "A3", time: 5000, color: "#450a0a" },
        { note: "G3", time: 5500, color: "#166534" },
        { note: "F3", time: 6000, color: "#9f1239" },
        { note: "G3", time: 6500, color: "#166534" },
        { note: "A3", time: 7000, color: "#450a0a" },
        { note: "B3", time: 7500, color: "#7f1d1d" },
        { note: "C4", time: 8000, color: "#991b1b" },
        { note: "D4", time: 8500, color: "#b91c1c" },
        { note: "E4", time: 9000, color: "#dc2626" },
        { note: "F4", time: 9500, color: "#ef4444" },
        { note: "G4", time: 10000, color: "#22c55e" },
        { note: "A4", time: 10500, color: "#f59e0b" },
        { note: "B4", time: 11000, color: "#6366f1" },
        { note: "C5", time: 11500, color: "#3b82f6" },
        { note: "D5", time: 12000, color: "#8b5cf6" },
        { note: "C5", time: 12500, color: "#3b82f6" },
        { note: "B4", time: 13000, color: "#6366f1" },
        { note: "A4", time: 13500, color: "#f59e0b" },
        { note: "G4", time: 14000, color: "#22c55e" }
      ],
      "ciranda-cirandinha-bell": [
        { note: "C4", time: 1000, color: "#991b1b" },
        { note: "D4", time: 1500, color: "#b91c1c" },
        { note: "E4", time: 2000, color: "#dc2626" },
        { note: "F4", time: 2500, color: "#ef4444" },
        { note: "G4", time: 3000, color: "#22c55e" },
        { note: "G4", time: 3500, color: "#22c55e" },
        { note: "G4", time: 4000, color: "#22c55e" },
        { note: "C4", time: 4500, color: "#991b1b" },
        { note: "D4", time: 5000, color: "#b91c1c" },
        { note: "E4", time: 5500, color: "#dc2626" },
        { note: "F4", time: 6000, color: "#ef4444" },
        { note: "G4", time: 6500, color: "#22c55e" },
        { note: "G4", time: 7000, color: "#22c55e" },
        { note: "G4", time: 7500, color: "#22c55e" },
        { note: "C5", time: 8000, color: "#3b82f6" },
        { note: "B4", time: 8500, color: "#6366f1" },
        { note: "A4", time: 9000, color: "#f59e0b" },
        { note: "G4", time: 9500, color: "#22c55e" },
        { note: "F4", time: 10000, color: "#ef4444" },
        { note: "E4", time: 10500, color: "#dc2626" },
        { note: "D4", time: 11000, color: "#b91c1c" },
        { note: "C4", time: 11500, color: "#991b1b" }
      ]
    };

    return songPatterns[songId] || [];
  };

  const getNoteFrequency = (note: string): number => {
    const noteMap: Record<string, number> = {
      "C3": 130.81, "C#3": 138.59, "D3": 146.83, "D#3": 155.56, "E3": 164.81, "F3": 174.61,
      "F#3": 185.00, "G3": 196.00, "G#3": 207.65, "A3": 220.00, "A#3": 233.08, "B3": 246.94,
      "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63, "F4": 349.23,
      "F#4": 369.99, "G4": 392.00, "G#4": 415.30, "A4": 440.00, "A#4": 466.16, "B4": 493.88,
      "C5": 523.25, "C#5": 554.37, "D5": 587.33, "D#5": 622.25, "E5": 659.25, "F5": 698.46,
      "F#5": 739.99, "G5": 783.99, "G#5": 830.61, "A5": 880.00, "A#5": 932.33, "B5": 987.77
    };
    return noteMap[note] || 440;
  };

  const getKeyForNote = (note: string): string => {
    const noteToKey: Record<string, string> = {
      "C4": "1", "D4": "2", "E4": "3", "F4": "4", "G4": "5", "A4": "6", "B4": "7",
      "C5": "1", "D5": "2", "E5": "3", "F5": "4", "G5": "5", "A5": "6", "B5": "7",
      "C3": "1", "D3": "2", "E3": "3", "F3": "4", "G3": "5", "A3": "6", "B3": "7"
    };
    return noteToKey[note] || "";
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHitNotes(0);
    setMissedNotes(0);
    setPerfectHits(0);
    setGoodHits(0);
    setOkayHits(0);
    setAccuracy(0);
    setGameOver(false);
    setIsCountingDown(true);
    setCountdownValue(3);

    const songNotes = getSongNotes(songId);
    setTotalNotes(songNotes.length);
    setNotes(songNotes);
    notesRef.current = songNotes;
    activeNotesRef.current = [];
    setActiveNotes([]);

    const countdownInterval = setInterval(() => {
      setCountdownValue((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsCountingDown(false);
          gameStartTimeRef.current = Date.now();
          requestAnimationFrame(gameLoop);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const gameLoop = (timestamp: number) => {
    if (!gameStarted || gameOver) return;

    const currentTime = Date.now() - gameStartTimeRef.current;
    
    // Check for new notes to add
    const newActiveNotes = [...activeNotesRef.current];
    const remainingNotes = notesRef.current.filter(note => {
      if (note.time <= currentTime + 3000 && note.time > currentTime - 1000) {
        if (!newActiveNotes.some(activeNote => activeNote === note)) {
          newActiveNotes.push(note);
        }
        return false;
      }
      return true;
    });

    // Update notes that are now active
    notesRef.current = remainingNotes;
    activeNotesRef.current = newActiveNotes;
    setActiveNotes(newActiveNotes);

    // Check for missed notes
    const stillActiveNotes = newActiveNotes.filter(note => {
      const notePosition = ((currentTime - note.time) / 3000) * 100;
      if (notePosition > 100) {
        setMissedNotes(prev => prev + 1);
        setCombo(0);
        showFeedback("Errou!", "#ef4444");
        return false;
      }
      return true;
    });

    activeNotesRef.current = stillActiveNotes;
    setActiveNotes(stillActiveNotes);

    // Update accuracy
    const totalAttempted = hitNotes + missedNotes;
    if (totalAttempted > 0) {
      setAccuracy(Math.round((hitNotes / totalAttempted) * 100));
    }

    // Check if game is over
    if (remainingNotes.length === 0 && stillActiveNotes.length === 0) {
      setGameOver(true);
      return;
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  };

  const handleKeyPress = (key: string) => {
    if (!gameStarted || gameOver || isCountingDown) return;

    const currentTime = Date.now() - gameStartTimeRef.current;
    
    // Find the closest note that matches this key
    const keyNotes = activeNotesRef.current.filter(note => getKeyForNote(note.note) === key);
    
    if (keyNotes.length > 0) {
      // Sort by how close they are to the target zone (100% position)
      keyNotes.sort((a, b) => {
        const posA = Math.abs(((currentTime - a.time) / 3000) * 100 - 100);
        const posB = Math.abs(((currentTime - b.time) / 3000) * 100 - 100);
        return posA - posB;
      });
      
      const closestNote = keyNotes[0];
      const notePosition = ((currentTime - closestNote.time) / 3000) * 100;
      const accuracy = Math.abs(notePosition - 100);
      
      // Remove the note from active notes
      activeNotesRef.current = activeNotesRef.current.filter(note => note !== closestNote);
      setActiveNotes(activeNotesRef.current);
      
      // Play the note sound
      const frequency = getNoteFrequency(closestNote.note);
      onNotePlay(frequency, closestNote.color);
      
      // Score based on accuracy
      let points = 0;
      if (accuracy < 5) {
        points = 100;
        setPerfectHits(prev => prev + 1);
        showFeedback("Perfeito!", "#10b981");
      } else if (accuracy < 10) {
        points = 75;
        setGoodHits(prev => prev + 1);
        showFeedback("Ótimo!", "#3b82f6");
      } else if (accuracy < 15) {
        points = 50;
        setOkayHits(prev => prev + 1);
        showFeedback("Bom!", "#f59e0b");
      } else {
        points = 25;
        showFeedback("Ok!", "#8b5cf6");
      }
      
      setScore(prev => prev + points);
      setHitNotes(prev => prev + 1);
      setCombo(prev => prev + 1);
      setMaxCombo(prev => Math.max(prev, combo + 1));
    }
  };

  const showFeedback = (text: string, color: string) => {
    setLastFeedback(text);
    setFeedbackColor(color);
    
    setTimeout(() => {
      setLastFeedback("");
    }, 1000);
  };

  useEffect(() => {
    if (gameStarted && !isCountingDown && !gameOver) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key >= "1" && e.key <= "7") {
          handleKeyPress(e.key);
        }
      };
      
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [gameStarted, isCountingDown, gameOver]);

  useEffect(() => {
    startGame();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [songId]);

  const getInstrumentName = () => {
    switch (instrumentType) {
      case "bell": return "Sino";
      case "xylophone": return "Xilofone";
      case "keyboard": return "Teclado";
      default: return "Instrumento";
    }
  };

  const renderKeys = () => {
    const keys = [
      { key: "1", note: "C", color: "#991b1b" },
      { key: "2", note: "D", color: "#b91c1c" },
      { key: "3", note: "E", color: "#dc2626" },
      { key: "4", note: "F", color: "#ef4444" },
      { key: "5", note: "G", color: "#22c55e" },
      { key: "6", note: "A", color: "#f59e0b" },
      { key: "7", note: "B", color: "#6366f1" }
    ];

    return (
      <div className="flex justify-center space-x-1 mt-4">
        {keys.map((k) => (
          <div
            key={k.key}
            className={`w-12 h-16 flex flex-col items-center justify-center rounded-md border-2 border-gray-300 cursor-pointer`}
            style={{ backgroundColor: k.color + "33" }}
            onClick={() => handleKeyPress(k.key)}
          >
            <div className="text-lg font-bold">{k.key}</div>
            <div className="text-xs">{k.note}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {isCountingDown ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-9xl font-bold text-purple-600 animate-pulse">
            {countdownValue}
          </div>
        </div>
      ) : gameOver ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <h2 className="text-3xl font-bold mb-6">Fim de Jogo!</h2>
          
          <Card className="w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">{score}</div>
              <div className="text-gray-500">Pontuação Final</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{accuracy}%</div>
                <div className="text-gray-500">Precisão</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{maxCombo}x</div>
                <div className="text-gray-500">Combo Máximo</div>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Notas Perfeitas:</span>
                <span className="font-bold text-green-500">{perfectHits}</span>
              </div>
              <div className="flex justify-between">
                <span>Notas Ótimas:</span>
                <span className="font-bold text-blue-500">{goodHits}</span>
              </div>
              <div className="flex justify-between">
                <span>Notas Boas:</span>
                <span className="font-bold text-yellow-500">{okayHits}</span>
              </div>
              <div className="flex justify-between">
                <span>Notas Erradas:</span>
                <span className="font-bold text-red-500">{missedNotes}</span>
              </div>
              <div className="flex justify-between">
                <span>Total de Notas:</span>
                <span className="font-bold">{totalNotes}</span>
              </div>
            </div>
            
            <Button onClick={startGame} className="w-full">
              Jogar Novamente
            </Button>
          </Card>
        </div>
      ) : (
        <div className="flex-1 flex flex-col" ref={gameAreaRef}>
          <div className="bg-gray-100 p-4 flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">{getInstrumentName()}</div>
              <div className="font-bold text-xl">{score} pontos</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Combo</div>
              <div className="font-bold text-xl">{combo}x</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Precisão</div>
              <div className="font-bold text-xl">{accuracy}%</div>
            </div>
          </div>
          
          <div className="relative flex-1 bg-gray-900 overflow-hidden">
            {/* Target zone */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-yellow-500 bg-opacity-30 border-t-2 border-b-2 border-yellow-400 z-10"></div>
            
            {/* Notes */}
            {activeNotes.map((note, index) => {
              const currentTime = Date.now() - gameStartTimeRef.current;
              const notePosition = ((currentTime - note.time) / 3000) * 100;
              const key = getKeyForNote(note.note);
              
              return (
                <div
                  key={`${note.note}-${note.time}-${index}`}
                  className="absolute h-14 w-10 rounded-md flex items-center justify-center text-white font-bold border-2"
                  style={{
                    backgroundColor: note.color,
                    borderColor: note.color,
                    bottom: `${notePosition}%`,
                    left: `calc(${(parseInt(key) - 1) * (100 / 7)}% + ${(100 / 14)}% - 20px)`,
                    transform: 'translateX(-50%)',
                    transition: 'bottom 0.1s linear'
                  }}
                >
                  {key}
                </div>
              );
            })}
            
            {/* Feedback text */}
            {lastFeedback && (
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold animate-bounce"
                style={{ color: feedbackColor }}
              >
                {lastFeedback}
              </div>
            )}
            
            {/* Lane dividers */}
            <div className="absolute inset-0 flex">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="border-l border-gray-700 h-full" 
                  style={{ width: `${100 / 7}%` }}
                />
              ))}
            </div>
          </div>
          
          {renderKeys()}
        </div>
      )}
    </div>
  );
};

export default GuitarHeroGame;
