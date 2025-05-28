import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  lane: number;
  color: string;
  frequency: number;
  startTime: number;
  duration: number;
  y: number;
  hasPlayed?: boolean;
  isHit?: boolean;
}

interface GuitarHeroGameProps {
  instrumentType: "bell" | "xylophone" | "keyboard";
  onNotePlay: (frequency: number, color: string) => void;
  songId?: string;
}

const GuitarHeroGame: React.FC<GuitarHeroGameProps> = ({ instrumentType, onNotePlay, songId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [speed, setSpeed] = useState(2);
  const [hitZoneHeight] = useState(80);
  const [gameEnded, setGameEnded] = useState(false);
  const [totalNotes, setTotalNotes] = useState(0);
  const [hitNotes, setHitNotes] = useState(0);
  
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const gameStartTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const totalPausedTimeRef = useRef<number>(0);

  const lanes = instrumentType === "bell" ? [
    { color: "#FF0000", frequency: 261.63, name: "Dó", key: "1", symbol: "🔔" },
    { color: "#FF6600", frequency: 293.66, name: "Ré", key: "2", symbol: "🔔" },
    { color: "#FFFF00", frequency: 329.63, name: "Mi", key: "3", symbol: "🔔" },
    { color: "#00CC00", frequency: 349.23, name: "Fá", key: "4", symbol: "🔔" },
    { color: "#0099FF", frequency: 392.00, name: "Sol", key: "5", symbol: "🔔" },
    { color: "#000080", frequency: 440.00, name: "Lá", key: "6", symbol: "🔔" },
    { color: "#800080", frequency: 493.88, name: "Si", key: "7", symbol: "🔔" },
  ] : instrumentType === "xylophone" ? [
    { color: "#E53935", frequency: 523.25, name: "Dó", key: "1", symbol: "🎵" },
    { color: "#FF9800", frequency: 587.33, name: "Ré", key: "2", symbol: "🎵" },
    { color: "#FFEB3B", frequency: 659.25, name: "Mi", key: "3", symbol: "🎵" },
    { color: "#4CAF50", frequency: 698.46, name: "Fá", key: "4", symbol: "🎵" },
    { color: "#2196F3", frequency: 783.99, name: "Sol", key: "5", symbol: "🎵" },
    { color: "#000080", frequency: 880.00, name: "Lá", key: "6", symbol: "🎵" },
    { color: "#800080", frequency: 987.77, name: "Si", key: "7", symbol: "🎵" },
  ] : [
    { color: "#FF0000", frequency: 261.63, name: "Dó", key: "1", symbol: "♩" },
    { color: "#FF9933", frequency: 293.66, name: "Ré", key: "2", symbol: "♪" },
    { color: "#FFFF00", frequency: 329.63, name: "Mi", key: "3", symbol: "♫" },
    { color: "#33CC33", frequency: 349.23, name: "Fá", key: "4", symbol: "♬" },
    { color: "#33CCFF", frequency: 392.00, name: "Sol", key: "5", symbol: "♩" },
    { color: "#000080", frequency: 440.00, name: "Lá", key: "6", symbol: "♪" },
    { color: "#800080", frequency: 493.88, name: "Si", key: "7", symbol: "♫" },
  ];

  const generateSpecificSongNotes = useCallback((songId: string) => {
    const newNotes: Note[] = [];
    let noteId = 0;

    // Função auxiliar para adicionar nota
    const addNote = (note: number, time: number, duration: number = 500) => {
      if (note < lanes.length) {
        newNotes.push({
          id: `note-${noteId++}`,
          lane: note,
          color: lanes[note].color,
          frequency: lanes[note].frequency,
          startTime: time,
          duration,
          y: -100,
          hasPlayed: false,
          isHit: false
        });
      }
    };

    if (songId === "twinkle-bell" || songId === "twinkle-xylophone") {
      // Brilha, Brilha Estrelinha - Dó Dó Sol Sol Lá Lá Sol Fá Fá Mi Mi Ré Ré Dó
      const twinkleMelody = [
        { note: 0, time: 0 },     // Dó
        { note: 0, time: 500 },   // Dó
        { note: 4, time: 1000 },  // Sol
        { note: 4, time: 1500 },  // Sol
        { note: 5, time: 2000 },  // Lá
        { note: 5, time: 2500 },  // Lá
        { note: 4, time: 3000 },  // Sol
        { note: 3, time: 4000 },  // Fá
        { note: 3, time: 4500 },  // Fá
        { note: 2, time: 5000 },  // Mi
        { note: 2, time: 5500 },  // Mi
        { note: 1, time: 6000 },  // Ré
        { note: 1, time: 6500 },  // Ré
        { note: 0, time: 7000 },  // Dó
      ];
      twinkleMelody.forEach(({ note, time }) => addNote(note, time, 400));
    }

    else if (songId === "mary-lamb-bell") {
      // Mary Had a Little Lamb - Mi Ré Dó Ré Mi Mi Mi Ré Ré Ré Mi Sol Sol
      const maryMelody = [
        { note: 2, time: 0 },     // Mi
        { note: 1, time: 500 },   // Ré
        { note: 0, time: 1000 },  // Dó
        { note: 1, time: 1500 },  // Ré
        { note: 2, time: 2000 },  // Mi
        { note: 2, time: 2500 },  // Mi
        { note: 2, time: 3000 },  // Mi
        { note: 1, time: 4000 },  // Ré
        { note: 1, time: 4500 },  // Ré
        { note: 1, time: 5000 },  // Ré
        { note: 2, time: 5500 },  // Mi
        { note: 4, time: 6000 },  // Sol
        { note: 4, time: 6500 },  // Sol
      ];
      maryMelody.forEach(({ note, time }) => addNote(note, time, 400));
    }

    else if (songId === "old-macdonald-bell") {
      // Old MacDonald - Sol Sol Sol Ré Mi Mi Ré
      const macdonaldMelody = [
        { note: 4, time: 0 },     // Sol
        { note: 4, time: 500 },   // Sol
        { note: 4, time: 1000 },  // Sol
        { note: 1, time: 1500 },  // Ré
        { note: 2, time: 2000 },  // Mi
        { note: 2, time: 2500 },  // Mi
        { note: 1, time: 3000 },  // Ré
        { note: 4, time: 4000 },  // Sol
        { note: 4, time: 4500 },  // Sol
        { note: 4, time: 5000 },  // Sol
        { note: 1, time: 5500 },  // Ré
        { note: 2, time: 6000 },  // Mi
        { note: 2, time: 6500 },  // Mi
        { note: 1, time: 7000 },  // Ré
      ];
      macdonaldMelody.forEach(({ note, time }) => addNote(note, time, 400));
    }

    else if (songId === "row-boat-bell") {
      // Row Your Boat - Dó Dó Dó Ré Mi Mi Ré Mi Fá Sol
      const rowBoatMelody = [
        { note: 0, time: 0 },     // Dó
        { note: 0, time: 500 },   // Dó
        { note: 0, time: 1000 },  // Dó
        { note: 1, time: 1500 },  // Ré
        { note: 2, time: 2000 },  // Mi
        { note: 2, time: 3000 },  // Mi
        { note: 1, time: 3500 },  // Ré
        { note: 2, time: 4000 },  // Mi
        { note: 3, time: 4500 },  // Fá
        { note: 4, time: 5000 },  // Sol
      ];
      rowBoatMelody.forEach(({ note, time }) => addNote(note, time, 400));
    }

    else if (songId === "happy-birthday-xylophone") {
      // Parabéns para Você - Dó Dó Ré Dó Fá Mi Dó Dó Ré Dó Sol Fá
      const birthdayMelody = [
        { note: 0, time: 0 },     // Dó
        { note: 0, time: 300 },   // Dó
        { note: 1, time: 600 },   // Ré
        { note: 0, time: 1200 },  // Dó
        { note: 3, time: 1800 },  // Fá
        { note: 2, time: 2400 },  // Mi
        { note: 0, time: 3600 },  // Dó
        { note: 0, time: 3900 },  // Dó
        { note: 1, time: 4200 },  // Ré
        { note: 0, time: 4800 },  // Dó
        { note: 4, time: 5400 },  // Sol
        { note: 3, time: 6000 },  // Fá
      ];
      birthdayMelody.forEach(({ note, time }) => addNote(note, time, 500));
    }

    else if (songId === "london-bridge-xylophone") {
      // London Bridge - Sol Lá Sol Fá Mi Fá Sol
      const londonMelody = [
        { note: 4, time: 0 },     // Sol
        { note: 5, time: 500 },   // Lá
        { note: 4, time: 1000 },  // Sol
        { note: 3, time: 1500 },  // Fá
        { note: 2, time: 2000 },  // Mi
        { note: 3, time: 2500 },  // Fá
        { note: 4, time: 3000 },  // Sol
        { note: 1, time: 3500 },  // Ré
        { note: 2, time: 4000 },  // Mi
        { note: 3, time: 4500 },  // Fá
        { note: 4, time: 5000 },  // Sol
        { note: 5, time: 5500 },  // Lá
        { note: 4, time: 6000 },  // Sol
        { note: 3, time: 6500 },  // Fá
        { note: 2, time: 7000 },  // Mi
        { note: 3, time: 7500 },  // Fá
        { note: 4, time: 8000 },  // Sol
      ];
      londonMelody.forEach(({ note, time }) => addNote(note, time, 400));
    }

    else if (songId === "jingle-bells-xylophone") {
      // Jingle Bells - Mi Mi Mi Mi Mi Mi Mi Sol Dó Ré Mi
      const jingleMelody = [
        { note: 2, time: 0 },     // Mi
        { note: 2, time: 500 },   // Mi
        { note: 2, time: 1000 },  // Mi
        { note: 2, time: 2000 },  // Mi
        { note: 2, time: 2500 },  // Mi
        { note: 2, time: 3000 },  // Mi
        { note: 2, time: 4000 },  // Mi
        { note: 4, time: 4500 },  // Sol
        { note: 0, time: 5000 },  // Dó
        { note: 1, time: 5500 },  // Ré
        { note: 2, time: 6000 },  // Mi
        { note: 3, time: 7000 },  // Fá
        { note: 3, time: 7500 },  // Fá
        { note: 3, time: 8000 },  // Fá
        { note: 3, time: 8500 },  // Fá
        { note: 3, time: 9000 },  // Fá
        { note: 2, time: 9500 },  // Mi
        { note: 2, time: 10000 }, // Mi
        { note: 2, time: 10500 }, // Mi
        { note: 2, time: 11000 }, // Mi
        { note: 1, time: 11500 }, // Ré
        { note: 1, time: 12000 }, // Ré
        { note: 2, time: 12500 }, // Mi
        { note: 1, time: 13000 }, // Ré
        { note: 4, time: 14000 }, // Sol
      ];
      jingleMelody.forEach(({ note, time }) => addNote(note, time, 400));
    }

    else if (songId === "chopsticks-keyboard") {
      // Chopsticks - Fá Sol Lá Sol Fá Mi Ré Dó
      const chopsticksMelody = [
        { note: 3, time: 0 },     // Fá
        { note: 4, time: 500 },   // Sol
        { note: 5, time: 1000 },  // Lá
        { note: 4, time: 1500 },  // Sol
        { note: 3, time: 2000 },  // Fá
        { note: 2, time: 2500 },  // Mi
        { note: 1, time: 3000 },  // Ré
        { note: 0, time: 3500 },  // Dó
        { note: 3, time: 4000 },  // Fá
        { note: 4, time: 4500 },  // Sol
        { note: 5, time: 5000 },  // Lá
        { note: 4, time: 5500 },  // Sol
        { note: 3, time: 6000 },  // Fá
        { note: 2, time: 6500 },  // Mi
        { note: 1, time: 7000 },  // Ré
        { note: 0, time: 7500 },  // Dó
      ];
      chopsticksMelody.forEach(({ note, time }) => addNote(note, time, 400));
    }

    else if (songId === "hot-cross-keyboard") {
      // Hot Cross Buns - Mi Ré Dó Mi Ré Dó Dó Dó Dó Dó Ré Ré Ré Ré Mi Ré Dó
      const hotCrossMelody = [
        { note: 2, time: 0 },     // Mi
        { note: 1, time: 500 },   // Ré
        { note: 0, time: 1000 },  // Dó
        { note: 2, time: 2000 },  // Mi
        { note: 1, time: 2500 },  // Ré
        { note: 0, time: 3000 },  // Dó
        { note: 0, time: 4000 },  // Dó
        { note: 0, time: 4250 },  // Dó
        { note: 0, time: 4500 },  // Dó
        { note: 0, time: 4750 },  // Dó
        { note: 1, time: 5000 },  // Ré
        { note: 1, time: 5250 },  // Ré
        { note: 1, time: 5500 },  // Ré
        { note: 1, time: 5750 },  // Ré
        { note: 2, time: 6000 },  // Mi
        { note: 1, time: 6500 },  // Ré
        { note: 0, time: 7000 },  // Dó
      ];
      hotCrossMelody.forEach(({ note, time }) => addNote(note, time, 200));
    }

    else if (songId === "frere-jacques-bell") {
      // Frère Jacques - Dó Ré Mi Dó Dó Ré Mi Dó Mi Fá Sol Mi Fá Sol
      const frereMelody = [
        { note: 0, time: 0 },     // Dó
        { note: 1, time: 500 },   // Ré
        { note: 2, time: 1000 },  // Mi
        { note: 0, time: 1500 },  // Dó
        { note: 0, time: 2000 },  // Dó
        { note: 1, time: 2500 },  // Ré
        { note: 2, time: 3000 },  // Mi
        { note: 0, time: 3500 },  // Dó
        { note: 2, time: 4000 },  // Mi
        { note: 3, time: 4500 },  // Fá
        { note: 4, time: 5000 },  // Sol
        { note: 2, time: 6000 },  // Mi
        { note: 3, time: 6500 },  // Fá
        { note: 4, time: 7000 },  // Sol
        { note: 4, time: 8000 },  // Sol
        { note: 5, time: 8250 },  // Lá
        { note: 4, time: 8500 },  // Sol
        { note: 3, time: 8750 },  // Fá
        { note: 2, time: 9000 },  // Mi
        { note: 0, time: 9500 },  // Dó
        { note: 4, time: 10000 }, // Sol
        { note: 5, time: 10250 }, // Lá
        { note: 4, time: 10500 }, // Sol
        { note: 3, time: 10750 }, // Fá
        { note: 2, time: 11000 }, // Mi
        { note: 0, time: 11500 }, // Dó
      ];
      frereMelody.forEach(({ note, time }) => addNote(note, time, 400));
    }

    else if (songId === "amazing-grace-bell") {
      // Amazing Grace - Sol Dó Mi Dó Mi Ré Dó Lá Sol
      const amazingMelody = [
        { note: 4, time: 0 },     // Sol
        { note: 0, time: 1000 },  // Dó
        { note: 2, time: 2000 },  // Mi
        { note: 0, time: 3000 },  // Dó
        { note: 2, time: 4000 },  // Mi
        { note: 1, time: 5000 },  // Ré
        { note: 0, time: 6000 },  // Dó
        { note: 5, time: 7000 },  // Lá
        { note: 4, time: 8000 },  // Sol
        { note: 0, time: 10000 }, // Dó
        { note: 2, time: 11000 }, // Mi
        { note: 4, time: 12000 }, // Sol
        { note: 2, time: 13000 }, // Mi
        { note: 1, time: 14000 }, // Ré
        { note: 0, time: 15000 }, // Dó
      ];
      amazingMelody.forEach(({ note, time }) => addNote(note, time, 800));
    }

    else if (songId === "greensleeves-bell") {
      // Greensleeves - Lá Dó Ré Mi Fá Mi Ré Dó
      const greenslevesMelody = [
        { note: 5, time: 0 },     // Lá
        { note: 0, time: 800 },   // Dó
        { note: 1, time: 1600 },  // Ré
        { note: 2, time: 2400 },  // Mi
        { note: 3, time: 3200 },  // Fá
        { note: 2, time: 4000 },  // Mi
        { note: 1, time: 4800 },  // Ré
        { note: 0, time: 5600 },  // Dó
        { note: 5, time: 6400 },  // Lá
        { note: 4, time: 7200 },  // Sol
        { note: 3, time: 8000 },  // Fá
        { note: 2, time: 8800 },  // Mi
        { note: 1, time: 9600 },  // Ré
        { note: 0, time: 10400 }, // Dó
        { note: 5, time: 11200 }, // Lá
      ];
      greenslevesMelody.forEach(({ note, time }) => addNote(note, time, 600));
    }

    else if (songId === "scarborough-bell") {
      // Scarborough Fair - Ré Mi Fá Sol Lá Sol Fá Mi Ré
      const scarboroughMelody = [
        { note: 1, time: 0 },     // Ré
        { note: 2, time: 800 },   // Mi
        { note: 3, time: 1600 },  // Fá
        { note: 4, time: 2400 },  // Sol
        { note: 5, time: 3200 },  // Lá
        { note: 4, time: 4000 },  // Sol
        { note: 3, time: 4800 },  // Fá
        { note: 2, time: 5600 },  // Mi
        { note: 1, time: 6400 },  // Ré
        { note: 0, time: 7200 },  // Dó
        { note: 1, time: 8000 },  // Ré
        { note: 2, time: 8800 },  // Mi
        { note: 3, time: 9600 },  // Fá
        { note: 2, time: 10400 }, // Mi
        { note: 1, time: 11200 }, // Ré
      ];
      scarboroughMelody.forEach(({ note, time }) => addNote(note, time, 700));
    }

    else if (songId === "ode-joy-xylophone") {
      // Ode à Alegria - Mi Mi Fá Sol Sol Fá Mi Ré Dó Dó Ré Mi Mi Ré Ré
      const odeMelody = [
        { note: 2, time: 0 },     // Mi
        { note: 2, time: 500 },   // Mi
        { note: 3, time: 1000 },  // Fá
        { note: 4, time: 1500 },  // Sol
        { note: 4, time: 2000 },  // Sol
        { note: 3, time: 2500 },  // Fá
        { note: 2, time: 3000 },  // Mi
        { note: 1, time: 3500 },  // Ré
        { note: 0, time: 4000 },  // Dó
        { note: 0, time: 4500 },  // Dó
        { note: 1, time: 5000 },  // Ré
        { note: 2, time: 5500 },  // Mi
        { note: 2, time: 6000 },  // Mi
        { note: 1, time: 6750 },  // Ré
        { note: 1, time: 7500 },  // Ré
        { note: 2, time: 8500 },  // Mi
        { note: 2, time: 9000 },  // Mi
        { note: 3, time: 9500 },  // Fá
        { note: 4, time: 10000 }, // Sol
        { note: 4, time: 10500 }, // Sol
        { note: 3, time: 11000 }, // Fá
        { note: 2, time: 11500 }, // Mi
        { note: 1, time: 12000 }, // Ré
        { note: 0, time: 12500 }, // Dó
        { note: 0, time: 13000 }, // Dó
        { note: 1, time: 13500 }, // Ré
        { note: 2, time: 14000 }, // Mi
        { note: 1, time: 14500 }, // Ré
        { note: 0, time: 15250 }, // Dó
        { note: 0, time: 16000 }, // Dó
      ];
      odeMelody.forEach(({ note, time }) => addNote(note, time, 400));
    }

    else if (songId === "danny-boy-xylophone") {
      // Danny Boy - Sol Dó Mi Sol Lá Sol Mi Dó
      const dannyMelody = [
        { note: 4, time: 0 },     // Sol
        { note: 0, time: 1000 },  // Dó
        { note: 2, time: 2000 },  // Mi
        { note: 4, time: 3000 },  // Sol
        { note: 5, time: 4000 },  // Lá
        { note: 4, time: 5000 },  // Sol
        { note: 2, time: 6000 },  // Mi
        { note: 0, time: 7000 },  // Dó
        { note: 1, time: 8000 },  // Ré
        { note: 2, time: 9000 },  // Mi
        { note: 3, time: 10000 }, // Fá
        { note: 4, time: 11000 }, // Sol
        { note: 5, time: 12000 }, // Lá
        { note: 6, time: 13000 }, // Si
        { note: 5, time: 14000 }, // Lá
        { note: 4, time: 15000 }, // Sol
        { note: 2, time: 16000 }, // Mi
        { note: 0, time: 17000 }, // Dó
      ];
      dannyMelody.forEach(({ note, time }) => addNote(note, time, 800));
    }

    else if (songId === "auld-lang-xylophone") {
      // Auld Lang Syne - Dó Fá Fá Fá Sol Lá Fá Sol Mi Mi
      const auldMelody = [
        { note: 0, time: 0 },     // Dó
        { note: 3, time: 1000 },  // Fá
        { note: 3, time: 2000 },  // Fá
        { note: 3, time: 3000 },  // Fá
        { note: 4, time: 4000 },  // Sol
        { note: 5, time: 5000 },  // Lá
        { note: 3, time: 6000 },  // Fá
        { note: 4, time: 7000 },  // Sol
        { note: 2, time: 8000 },  // Mi
        { note: 2, time: 9000 },  // Mi
        { note: 3, time: 10000 }, // Fá
        { note: 2, time: 11000 }, // Mi
        { note: 1, time: 12000 }, // Ré
        { note: 0, time: 13000 }, // Dó
        { note: 3, time: 14000 }, // Fá
        { note: 4, time: 15000 }, // Sol
        { note: 5, time: 16000 }, // Lá
      ];
      auldMelody.forEach(({ note, time }) => addNote(note, time, 800));
    }

    else if (songId === "swan-lake-xylophone") {
      // Tema do Lago dos Cisnes - Mi Ré Dó Ré Mi Fá Sol Lá
      const swanMelody = [
        { note: 2, time: 0 },     // Mi
        { note: 1, time: 800 },   // Ré
        { note: 0, time: 1600 },  // Dó
        { note: 1, time: 2400 },  // Ré
        { note: 2, time: 3200 },  // Mi
        { note: 3, time: 4000 },  // Fá
        { note: 4, time: 4800 },  // Sol
        { note: 5, time: 5600 },  // Lá
        { note: 6, time: 6400 },  // Si
        { note: 5, time: 7200 },  // Lá
        { note: 4, time: 8000 },  // Sol
        { note: 3, time: 8800 },  // Fá
        { note: 2, time: 9600 },  // Mi
        { note: 1, time: 10400 }, // Ré
        { note: 0, time: 11200 }, // Dó
        { note: 2, time: 12000 }, // Mi
        { note: 4, time: 12800 }, // Sol
        { note: 2, time: 13600 }, // Mi
        { note: 0, time: 14400 }, // Dó
      ];
      swanMelody.forEach(({ note, time }) => addNote(note, time, 600));
    }

    else if (songId === "moonlight-keyboard") {
      // Sonata ao Luar (Tema) - Dó# Ré# Mi Fá# Sol# Lá# Si
      const moonlightMelody = [
        { note: 0, time: 0 },     // Dó
        { note: 1, time: 1500 },  // Ré
        { note: 2, time: 3000 },  // Mi
        { note: 0, time: 4500 },  // Dó
        { note: 3, time: 6000 },  // Fá
        { note: 2, time: 7500 },  // Mi
        { note: 1, time: 9000 },  // Ré
        { note: 0, time: 10500 }, // Dó
        { note: 4, time: 12000 }, // Sol
        { note: 3, time: 13500 }, // Fá
        { note: 2, time: 15000 }, // Mi
        { note: 1, time: 16500 }, // Ré
        { note: 0, time: 18000 }, // Dó
      ];
      moonlightMelody.forEach(({ note, time }) => addNote(note, time, 1200));
    }

    else if (songId === "canon-d-keyboard" || songId === "canon-xylophone") {
      // Cânone em Ré - Ré Lá Si Fá# Sol Ré Sol Lá
      const canonMelody = [
        { note: 1, time: 0 },     // Ré
        { note: 5, time: 1000 },  // Lá
        { note: 6, time: 2000 },  // Si
        { note: 3, time: 3000 },  // Fá
        { note: 4, time: 4000 },  // Sol
        { note: 1, time: 5000 },  // Ré
        { note: 4, time: 6000 },  // Sol
        { note: 5, time: 7000 },  // Lá
        { note: 1, time: 8000 },  // Ré
        { note: 3, time: 9000 },  // Fá
        { note: 4, time: 10000 }, // Sol
        { note: 1, time: 11000 }, // Ré
        { note: 4, time: 12000 }, // Sol
        { note: 3, time: 13000 }, // Fá
        { note: 2, time: 14000 }, // Mi
        { note: 1, time: 15000 }, // Ré
      ];
      canonMelody.forEach(({ note, time }) => addNote(note, time, 800));
    }

    else if (songId === "turkish-march-xylophone") {
      // Marcha Turca - Si Lá Sol# Lá Dó Si Lá
      const turkishMelody = [
        { note: 6, time: 0 },     // Si
        { note: 5, time: 300 },   // Lá
        { note: 4, time: 600 },   // Sol
        { note: 5, time: 900 },   // Lá
        { note: 0, time: 1200 },  // Dó
        { note: 6, time: 1500 },  // Si
        { note: 5, time: 1800 },  // Lá
        { note: 4, time: 2100 },  // Sol
        { note: 3, time: 2400 },  // Fá
        { note: 2, time: 2700 },  // Mi
        { note: 1, time: 3000 },  // Ré
        { note: 0, time: 3300 },  // Dó
        { note: 6, time: 3600 },  // Si
        { note: 5, time: 3900 },  // Lá
        { note: 4, time: 4200 },  // Sol
        { note: 5, time: 4500 },  // Lá
        { note: 6, time: 4800 },  // Si
        { note: 0, time: 5100 },  // Dó
        { note: 1, time: 5400 },  // Ré
        { note: 2, time: 5700 },  // Mi
        { note: 3, time: 6000 },  // Fá
        { note: 4, time: 6300 },  // Sol
        { note: 5, time: 6600 },  // Lá
      ];
      turkishMelody.forEach(({ note, time }) => addNote(note, time, 250));
    }

    else if (songId === "spring-vivaldi-xylophone") {
      // Primavera (As Quatro Estações) - Mi Sol# Si Mi Sol# Si Mi
      const springMelody = [
        { note: 2, time: 0 },     // Mi
        { note: 4, time: 500 },   // Sol
        { note: 6, time: 1000 },  // Si
        { note: 2, time: 1500 },  // Mi
        { note: 4, time: 2000 },  // Sol
        { note: 6, time: 2500 },  // Si
        { note: 2, time: 3000 },  // Mi
        { note: 3, time: 3500 },  // Fá
        { note: 4, time: 4000 },  // Sol
        { note: 5, time: 4500 },  // Lá
        { note: 6, time: 5000 },  // Si
        { note: 5, time: 5500 },  // Lá
        { note: 4, time: 6000 },  // Sol
        { note: 3, time: 6500 },  // Fá
        { note: 2, time: 7000 },  // Mi
        { note: 1, time: 7500 },  // Ré
        { note: 0, time: 8000 },  // Dó
        { note: 2, time: 8500 },  // Mi
        { note: 4, time: 9000 },  // Sol
        { note: 6, time: 9500 },  // Si
        { note: 2, time: 10000 }, // Mi
      ];
      springMelody.forEach(({ note, time }) => addNote(note, time, 400));
    }

    else if (songId === "fur-elise-keyboard") {
      const furEliseMelody = [
        { note: 2, time: 0 },     // Mi
        { note: 1, time: 500 },   // Ré#
        { note: 2, time: 1000 },  // Mi
        { note: 1, time: 1500 },  // Ré#
        { note: 2, time: 2000 },  // Mi
        { note: 6, time: 2500 },  // Si
        { note: 1, time: 3000 },  // Ré
        { note: 0, time: 3500 },  // Dó
        { note: 5, time: 4000 },  // Lá
        { note: 0, time: 6000 },  // Dó
        { note: 2, time: 6500 },  // Mi
        { note: 5, time: 7000 },  // Lá
        { note: 6, time: 7500 },  // Si
        { note: 0, time: 9000 },  // Dó
        { note: 1, time: 9500 },  // Ré#
        { note: 2, time: 10000 }, // Mi
        { note: 1, time: 10500 }, // Ré#
        { note: 2, time: 11000 }, // Mi
        { note: 6, time: 11500 }, // Si
        { note: 1, time: 12000 }, // Ré
        { note: 0, time: 12500 }, // Dó
        { note: 5, time: 13000 }, // Lá
      ];
      furEliseMelody.forEach((noteData) => {
        if (noteData.note < lanes.length) {
          addNote(noteData.note, noteData.time, 400);
        }
      });
    } else if (songId === "claire-de-lune-keyboard") {
      const claireDeLuneMelody = [
        { note: 1, time: 0 },     // Ré
        { note: 3, time: 1200 },  // Fá
        { note: 5, time: 2400 },  // Lá
        { note: 4, time: 3600 },  // Sol
        { note: 3, time: 4800 },  // Fá
        { note: 2, time: 6000 },  // Mi
        { note: 1, time: 7200 },  // Ré
        { note: 0, time: 8400 },  // Dó
        { note: 2, time: 9600 },  // Mi
        { note: 4, time: 10800 }, // Sol
        { note: 6, time: 12000 }, // Si
        { note: 5, time: 13200 }, // Lá
        { note: 4, time: 14400 }, // Sol
        { note: 3, time: 15600 }, // Fá
        { note: 2, time: 16800 }, // Mi
        { note: 1, time: 18000 }, // Ré
        { note: 0, time: 19200 }, // Dó
      ];
      claireDeLuneMelody.forEach((noteData) => {
        if (noteData.note < lanes.length) {
          addNote(noteData.note, noteData.time, 1000);
        }
      });
    } else if (songId === "invention-1-keyboard") {
      const invention1Melody = [
        { note: 0, time: 0 },     // Dó
        { note: 1, time: 300 },   // Ré
        { note: 2, time: 600 },   // Mi
        { note: 3, time: 900 },   // Fá
        { note: 4, time: 1200 },  // Sol
        { note: 5, time: 1500 },  // Lá
        { note: 6, time: 1800 },  // Si
        { note: 0, time: 2100 },  // Dó
        { note: 6, time: 2400 },  // Si
        { note: 5, time: 2700 },  // Lá
        { note: 4, time: 3000 },  // Sol
        { note: 3, time: 3300 },  // Fá
        { note: 2, time: 3600 },  // Mi
        { note: 1, time: 3900 },  // Ré
        { note: 0, time: 4200 },  // Dó
        { note: 2, time: 4500 },  // Mi
        { note: 3, time: 4800 },  // Fá
        { note: 4, time: 5100 },  // Sol
        { note: 5, time: 5400 },  // Lá
        { note: 6, time: 5700 },  // Si
        { note: 0, time: 6000 },  // Dó
      ];
      invention1Melody.forEach((noteData) => {
        if (noteData.note < lanes.length) {
          addNote(noteData.note, noteData.time, 250);
        }
      });
    } else if (songId === "chopin-minute-keyboard") {
      const minuteWaltzMelody = [
        { note: 4, time: 0 },     // Sol
        { note: 5, time: 200 },   // Lá
        { note: 6, time: 400 },   // Si
        { note: 0, time: 600 },   // Dó
        { note: 1, time: 800 },   // Ré
        { note: 2, time: 1000 },  // Mi
        { note: 3, time: 1200 },  // Fá
        { note: 4, time: 1400 },  // Sol
        { note: 6, time: 1600 },  // Si
        { note: 5, time: 1800 },  // Lá
        { note: 4, time: 2000 },  // Sol
        { note: 3, time: 2200 },  // Fá
        { note: 2, time: 2400 },  // Mi
        { note: 1, time: 2600 },  // Ré
        { note: 0, time: 2800 },  // Dó
        { note: 2, time: 3000 },  // Mi
        { note: 4, time: 3200 },  // Sol
        { note: 5, time: 3400 },  // Lá
        { note: 6, time: 3600 },  // Si
        { note: 0, time: 3800 },  // Dó
        { note: 1, time: 4000 },  // Ré
        { note: 2, time: 4200 },  // Mi
      ];
      minuteWaltzMelody.forEach((noteData) => {
        if (noteData.note < lanes.length) {
          addNote(noteData.note, noteData.time, 150);
        }
      });
    } else if (songId === "asa-branca-bell") {
      const asaBrancaMelody = [
        { note: 4, time: 0 },     // Sol
        { note: 4, time: 800 },   // Sol
        { note: 4, time: 1600 },  // Sol
        { note: 3, time: 2400 },  // Fá
        { note: 2, time: 3200 },  // Mi
        { note: 3, time: 4000 },  // Fá
        { note: 4, time: 4800 },  // Sol
        { note: 5, time: 5600 },  // Lá
        { note: 4, time: 6400 },  // Sol
        { note: 2, time: 7200 },  // Mi
        { note: 3, time: 8000 },  // Fá
        { note: 4, time: 8800 },  // Sol
        { note: 4, time: 9600 },  // Sol
        { note: 3, time: 10400 }, // Fá
        { note: 2, time: 11200 }, // Mi
        { note: 1, time: 12000 }, // Ré
        { note: 0, time: 12800 }, // Dó
      ];
      asaBrancaMelody.forEach((noteData) => {
        if (noteData.note < lanes.length) {
          addNote(noteData.note, noteData.time, 600);
        }
      });
    } else if (songId === "aquarela-xylophone") {
      const aquarelaMelody = [
        { note: 0, time: 0 },     // Dó
        { note: 2, time: 600 },   // Mi
        { note: 4, time: 1200 },  // Sol
        { note: 2, time: 1800 },  // Mi
        { note: 3, time: 2400 },  // Fá
        { note: 4, time: 3000 },  // Sol
        { note: 5, time: 3600 },  // Lá
        { note: 4, time: 4200 },  // Sol
        { note: 3, time: 4800 },  // Fá
        { note: 2, time: 5400 },  // Mi
        { note: 1, time: 6000 },  // Ré
        { note: 2, time: 6600 },  // Mi
        { note: 4, time: 7200 },  // Sol
        { note: 3, time: 7800 },  // Fá
        { note: 2, time: 8400 },  // Mi
        { note: 0, time: 9000 },  // Dó
      ];
      aquarelaMelody.forEach((noteData) => {
        if (noteData.note < lanes.length) {
          addNote(noteData.note, noteData.time, 500);
        }
      });
    } else if (songId === "ciranda-cirandinha-bell") {
      const cirandaMelody = [
        { note: 0, time: 0 },     // Dó
        { note: 2, time: 600 },   // Mi
        { note: 4, time: 1200 },  // Sol
        { note: 0, time: 1800 },  // Dó
        { note: 2, time: 2400 },  // Mi
        { note: 4, time: 3000 },  // Sol
        { note: 4, time: 3600 },  // Sol
        { note: 5, time: 4200 },  // Lá
        { note: 4, time: 4800 },  // Sol
        { note: 3, time: 5400 },  // Fá
        { note: 2, time: 6000 },  // Mi
        { note: 1, time: 6600 },  // Ré
        { note: 2, time: 7200 },  // Mi
        { note: 0, time: 7800 },  // Dó
      ];
      cirandaMelody.forEach((noteData) => {
        if (noteData.note < lanes.length) {
          addNote(noteData.note, noteData.time, 500);
        }
      });
    } else {
      // Padrão genérico para músicas não específicas
      const patterns = [
        [0, 2, 4],
        [1, 3, 5],
        [0, 1, 2],
        [4, 5, 6],
        [2, 4, 6],
        [0, 3, 6],
      ];

      for (let i = 0; i < 20; i++) {
        const pattern = patterns[i % patterns.length];
        const baseTime = i * 4000;
        
        pattern.forEach((laneIndex, noteIndex) => {
          if (laneIndex < lanes.length) {
            addNote(laneIndex, baseTime + noteIndex * 1000, 600);
          }
        });
      }
    }

    console.log(`Generated ${newNotes.length} notes for song: ${songId || 'generic'}`);
    setTotalNotes(newNotes.length);
    setNotes(newNotes);
  }, [lanes]);

  const generateNotes = useCallback(() => {
    if (songId) {
      generateSpecificSongNotes(songId);
    } else {
      generateSpecificSongNotes('generic');
    }
  }, [songId, generateSpecificSongNotes]);

  const handleNoteClick = useCallback((noteId: string) => {
    if (!isPlaying) return;

    const noteToHit = notes.find(note => note.id === noteId);
    if (!noteToHit || noteToHit.isHit) return;

    const hitZoneTop = 350;
    const hitZoneBottom = hitZoneTop + hitZoneHeight;

    if (noteToHit.y >= hitZoneTop - 50 && noteToHit.y <= hitZoneBottom + 50) {
      const precision = Math.abs(noteToHit.y - (hitZoneTop + hitZoneHeight / 2));
      let points = 100;
      let feedback = "Good!";

      if (precision < 15) {
        points = 300;
        feedback = "Perfect!";
      } else if (precision < 30) {
        points = 200;
        feedback = "Great!";
      }

      const finalPoints = points * Math.max(1, combo + 1);
      setScore(prev => prev + finalPoints);
      setCombo(prev => prev + 1);
      setMaxCombo(prev => Math.max(prev, combo + 1));
      setHitNotes(prev => prev + 1);

      onNotePlay(noteToHit.frequency, noteToHit.color);

      toast(`${feedback} +${finalPoints} pontos`, {
        duration: 1000,
      });

      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? { ...note, isHit: true } : note
        )
      );

      console.log(`Hit note! Score: ${finalPoints}, Combo: ${combo + 1}`);
    } else {
      if (combo > 0) {
        setCombo(0);
        toast("Miss! Combo perdido", {
          duration: 1000,
        });
      }
      
      onNotePlay(noteToHit.frequency, noteToHit.color);
      console.log(`Missed note: clicked outside hit zone`);
    }
  }, [isPlaying, notes, combo, hitZoneHeight, onNotePlay]);

  const updateNotes = useCallback(() => {
    if (!isPlaying) return;

    const now = Date.now();
    const currentGameTime = now - gameStartTimeRef.current - totalPausedTimeRef.current;
    const hitZoneTop = 350;
    const hitZoneBottom = hitZoneTop + hitZoneHeight;
    
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.map(note => {
        const noteAge = currentGameTime - note.startTime;
        const newY = noteAge * speed * 0.1;
        
        return {
          ...note,
          y: newY
        };
      });

      const missedNotes = updatedNotes.filter(note => 
        note.y > 500 && !note.isHit && !note.hasPlayed
      );
      
      if (missedNotes.length > 0) {
        missedNotes.forEach(note => {
          note.hasPlayed = true;
        });
        
        if (combo > 0) {
          setCombo(0);
          toast("Notas perdidas! Combo resetado", { duration: 1000 });
        }
      }

      const visibleNotes = updatedNotes.filter(note => note.y <= 500);
      if (visibleNotes.length === 0 && updatedNotes.length > 0 && !gameEnded) {
        setGameEnded(true);
        setIsPlaying(false);
        
        const accuracy = totalNotes > 0 ? Math.round((hitNotes / totalNotes) * 100) : 0;
        toast(`🎉 Música concluída! Pontuação: ${score} | Precisão: ${accuracy}% | Max Combo: ${maxCombo}x`, {
          duration: 5000,
        });
        
        console.log(`Game ended! Final score: ${score}, Accuracy: ${accuracy}%, Max combo: ${maxCombo}`);
      }

      return updatedNotes.filter(note => note.y <= 500);
    });

    lastUpdateTimeRef.current = now;
    animationRef.current = requestAnimationFrame(updateNotes);
  }, [isPlaying, speed, combo, hitZoneHeight, gameEnded, score, totalNotes, hitNotes, maxCombo]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isPlaying) return;

    const keyPressed = event.key;
    const lane = lanes.find(l => l.key === keyPressed);
    if (!lane) return;

    event.preventDefault();

    const laneIndex = lanes.indexOf(lane);
    const hitZoneTop = 350;
    const hitZoneBottom = hitZoneTop + hitZoneHeight;

    const hitNote = notes.find(note => 
      note.lane === laneIndex && 
      note.y >= hitZoneTop - 50 && 
      note.y <= hitZoneBottom + 50 &&
      !note.isHit
    );

    if (hitNote) {
      handleNoteClick(hitNote.id);
    } else {
      if (combo > 0) {
        setCombo(0);
        toast("Miss! Combo perdido", {
          duration: 1000,
        });
      }
      
      onNotePlay(lane.frequency, lane.color);
      console.log(`Missed note in lane ${laneIndex}`);
    }
  }, [lanes, isPlaying, notes, combo, hitZoneHeight, handleNoteClick, onNotePlay]);

  useEffect(() => {
    if (isPlaying) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isPlaying, handleKeyPress]);

  const togglePlay = () => {
    if (!isPlaying) {
      if (notes.length === 0) {
        generateNotes();
      }
      
      const now = Date.now();
      if (gameStartTimeRef.current === 0) {
        gameStartTimeRef.current = now;
        totalPausedTimeRef.current = 0;
      } else {
        const pausedDuration = now - pauseTimeRef.current;
        totalPausedTimeRef.current += pausedDuration;
      }
      
      lastUpdateTimeRef.current = now;
      console.log(`Starting/Resuming ${instrumentType} game`);
      setIsPlaying(true);
      setGameEnded(false);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      pauseTimeRef.current = Date.now();
      setIsPlaying(false);
      console.log(`Pausing ${instrumentType} game`);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      updateNotes();
    }
  }, [isPlaying, updateNotes]);

  const resetGame = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsPlaying(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHitNotes(0);
    setTotalNotes(0);
    setGameEnded(false);
    setNotes([]);
    gameStartTimeRef.current = 0;
    lastUpdateTimeRef.current = 0;
    pauseTimeRef.current = 0;
    totalPausedTimeRef.current = 0;
    console.log(`Game reset for ${instrumentType}`);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getInstrumentTitle = () => {
    switch (instrumentType) {
      case "bell": return "🔔 Sino-Hero";
      case "xylophone": return "🎵 Xilofone-Hero";
      case "keyboard": return "🎹 Teclado-Hero";
      default: return "TEA-Hero";
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {getInstrumentTitle()}
          </h1>
          <div className="flex gap-2">
            <Button onClick={togglePlay} variant="secondary" size="sm">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? "Pausar" : "Jogar"}
            </Button>
            <Button onClick={resetGame} variant="secondary" size="sm">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-sm opacity-80">Pontuação</div>
            <div className="text-xl font-bold">{score.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Combo</div>
            <div className="text-xl font-bold text-yellow-300">{combo}x</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Max Combo</div>
            <div className="text-xl font-bold text-orange-300">{maxCombo}x</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Acertos</div>
            <div className="text-xl font-bold text-green-300">{hitNotes}/{totalNotes}</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Velocidade</div>
            <div className="text-xl font-bold">{speed}x</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 p-3 text-center text-white">
        <p className="text-sm">
          Use as teclas <strong>1-7</strong> ou <strong>clique nas notas</strong> quando elas passarem pela zona dourada!
        </p>
      </div>

      <div 
        ref={gameRef}
        className="flex-1 relative bg-gradient-to-b from-gray-900 to-black overflow-hidden"
        style={{ height: "500px" }}
      >
        {lanes.map((lane, index) => (
          <div
            key={index}
            className="absolute border-r border-gray-600"
            style={{
              left: `${(index / lanes.length) * 100}%`,
              width: `${100 / lanes.length}%`,
              height: "100%",
              backgroundColor: `${lane.color}15`
            }}
          >
            <div
              className="absolute bottom-0 w-full flex items-center justify-center text-white font-bold border-2 border-white/50 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                height: "70px",
                backgroundColor: lane.color,
              }}
              onClick={() => onNotePlay(lane.frequency, lane.color)}
            >
              <div className="text-center">
                <div className="text-xs font-bold">{lane.key}</div>
                <div className="text-2xl">{lane.symbol}</div>
                <div className="text-xs font-bold">{lane.name}</div>
              </div>
            </div>
          </div>
        ))}

        <div
          className="absolute w-full border-4 border-yellow-400 bg-yellow-400/30 shadow-lg"
          style={{
            top: "350px",
            height: `${hitZoneHeight}px`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-yellow-400 font-bold text-lg animate-pulse">ZONA DE ACERTO</div>
          </div>
        </div>

        {notes.map((note) => (
          <div
            key={note.id}
            className={`absolute rounded-lg border-2 border-white shadow-xl flex items-center justify-center text-white font-bold transition-all cursor-pointer hover:scale-110 ${
              note.isHit ? 'opacity-50 bg-green-500' : ''
            }`}
            style={{
              left: `${(note.lane / lanes.length) * 100 + 1}%`,
              width: `${100 / lanes.length - 2}%`,
              top: `${note.y}px`,
              height: "50px",
              backgroundColor: note.isHit ? '#22c55e' : note.color,
              boxShadow: `0 0 20px ${note.isHit ? '#22c55e50' : note.color + '50'}`,
            }}
            onClick={() => handleNoteClick(note.id)}
          >
            <div className="text-center">
              <div className="text-lg">{note.isHit ? '✓' : lanes[note.lane].symbol}</div>
            </div>
          </div>
        ))}

        <div
          className="absolute w-full border-t-4 border-yellow-400 opacity-50"
          style={{ top: "380px" }}
        />

        {gameEnded && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🎉 Parabéns!</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>Pontuação Final:</strong> {score.toLocaleString()}</p>
                <p><strong>Precisão:</strong> {totalNotes > 0 ? Math.round((hitNotes / totalNotes) * 100) : 0}%</p>
                <p><strong>Acertos:</strong> {hitNotes}/{totalNotes}</p>
                <p><strong>Combo Máximo:</strong> {maxCombo}x</p>
              </div>
              <Button onClick={resetGame} className="mt-4">
                Jogar Novamente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuitarHeroGame;
