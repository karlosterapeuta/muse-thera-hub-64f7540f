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

  // Configuração das lanes (faixas) baseada no instrumento
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

  // Função para gerar as notas da música específica
  const generateSpecificSongNotes = useCallback((songId: string) => {
    const newNotes: Note[] = [];
    let noteId = 0;

    // Notas para "Brilha, Brilha Estrelinha" (Twinkle, Twinkle, Little Star)
    if (songId === "twinkle-bell" || songId === "twinkle-xylophone") {
      const twinkleMelody = [
        // "Brilha, brilha estrelinha"
        { note: 0, time: 0 },     // Dó - "Bri"
        { note: 0, time: 800 },   // Dó - "lha"
        { note: 4, time: 1600 },  // Sol - "bri"
        { note: 4, time: 2400 },  // Sol - "lha"
        { note: 5, time: 3200 },  // Lá - "es"
        { note: 5, time: 4000 },  // Lá - "tre"
        { note: 4, time: 4800 },  // Sol - "li" (pausa mais longa)
        
        // "Como eu quero saber"
        { note: 3, time: 6000 },  // Fá - "Co"
        { note: 3, time: 6800 },  // Fá - "mo"
        { note: 2, time: 7600 },  // Mi - "eu"
        { note: 2, time: 8400 },  // Mi - "que"
        { note: 1, time: 9200 },  // Ré - "ro"
        { note: 1, time: 10000 }, // Ré - "sa"
        { note: 0, time: 10800 }, // Dó - "ber" (pausa mais longa)
        
        // "O que você é de verdade"
        { note: 4, time: 12400 }, // Sol - "O"
        { note: 4, time: 13200 }, // Sol - "que"
        { note: 3, time: 14000 }, // Fá - "vo"
        { note: 3, time: 14800 }, // Fá - "cê"
        { note: 2, time: 15600 }, // Mi - "é"
        { note: 2, time: 16400 }, // Mi - "de"
        { note: 1, time: 17200 }, // Ré - "ver"
        { note: 1, time: 18000 }, // Ré - "da" 
        { note: 0, time: 18800 }, // Dó - "de" (final)
        
        // "Brilha, brilha estrelinha" (repetição)
        { note: 0, time: 20400 }, // Dó - "Bri"
        { note: 0, time: 21200 }, // Dó - "lha"
        { note: 4, time: 22000 }, // Sol - "bri"
        { note: 4, time: 22800 }, // Sol - "lha"
        { note: 5, time: 23600 }, // Lá - "es"
        { note: 5, time: 24400 }, // Lá - "tre"
        { note: 4, time: 25200 }, // Sol - "li" (final)
      ];

      twinkleMelody.forEach((noteData, index) => {
        if (noteData.note < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: noteData.note,
            color: lanes[noteData.note].color,
            frequency: lanes[noteData.note].frequency,
            startTime: noteData.time,
            duration: 600,
            y: -100,
            hasPlayed: false,
            isHit: false
          });
        }
      });
    } else if (songId === "mary-lamb-bell") {
      // Melodia completa e corrigida de "Mary Had a Little Lamb"
      const maryLambMelody = [
        // Verso 1: "Mary had a little lamb" (mais devagar)
        { note: 2, time: 0 },     // Mi - "Ma"
        { note: 1, time: 500 },   // Ré - "ry"
        { note: 0, time: 1000 },  // Dó - "had"
        { note: 1, time: 1500 },  // Ré - "a"
        { note: 2, time: 2000 },  // Mi - "lit"
        { note: 2, time: 2500 },  // Mi - "tle"
        { note: 2, time: 3000 },  // Mi - "lamb"
        
        // Pausa
        { note: 1, time: 4000 },  // Ré - "lit"
        { note: 1, time: 4500 },  // Ré - "tle"
        { note: 1, time: 5000 },  // Ré - "lamb"
        
        // Pausa
        { note: 2, time: 6000 },  // Mi - "lit"
        { note: 4, time: 6500 },  // Sol - "tle"
        { note: 4, time: 7000 },  // Sol - "lamb"
        
        // "Mary had a little lamb" (repetição)
        { note: 2, time: 8000 },  // Mi - "Ma"
        { note: 1, time: 8500 },  // Ré - "ry"
        { note: 0, time: 9000 },  // Dó - "had"
        { note: 1, time: 9500 },  // Ré - "a"
        { note: 2, time: 10000 }, // Mi - "lit"
        { note: 2, time: 10500 }, // Mi - "tle"
        { note: 2, time: 11000 }, // Mi - "lamb"
        
        // "Its fleece was white as snow"
        { note: 2, time: 12000 }, // Mi - "Its"
        { note: 1, time: 12500 }, // Ré - "fleece"
        { note: 1, time: 13000 }, // Ré - "was"
        { note: 2, time: 13500 }, // Mi - "white"
        { note: 1, time: 14000 }, // Ré - "as"
        { note: 0, time: 14500 }, // Dó - "snow"
        
        // Verso 2: "And everywhere that Mary went"
        { note: 2, time: 16000 }, // Mi - "And"
        { note: 1, time: 16500 }, // Ré - "ev"
        { note: 0, time: 17000 }, // Dó - "ery"
        { note: 1, time: 17500 }, // Ré - "where"
        { note: 2, time: 18000 }, // Mi - "that"
        { note: 2, time: 18500 }, // Mi - "Ma"
        { note: 2, time: 19000 }, // Mi - "ry"
        
        // "Mary went, Mary went"
        { note: 1, time: 20000 }, // Ré - "Ma"
        { note: 1, time: 20500 }, // Ré - "ry"
        { note: 1, time: 21000 }, // Ré - "went"
        
        { note: 2, time: 22000 }, // Mi - "Ma"
        { note: 4, time: 22500 }, // Sol - "ry"
        { note: 4, time: 23000 }, // Sol - "went"
        
        // "Everywhere that Mary went"
        { note: 2, time: 24000 }, // Mi - "Ev"
        { note: 1, time: 24500 }, // Ré - "ery"
        { note: 0, time: 25000 }, // Dó - "where"
        { note: 1, time: 25500 }, // Ré - "that"
        { note: 2, time: 26000 }, // Mi - "Ma"
        { note: 2, time: 26500 }, // Mi - "ry"
        { note: 2, time: 27000 }, // Mi - "went"
        
        // "The lamb was sure to go"
        { note: 2, time: 28000 }, // Mi - "The"
        { note: 1, time: 28500 }, // Ré - "lamb"
        { note: 1, time: 29000 }, // Ré - "was"
        { note: 2, time: 29500 }, // Mi - "sure"
        { note: 1, time: 30000 }, // Ré - "to"
        { note: 0, time: 30500 }, // Dó - "go"
        
        // Verso 3: "It followed her to school one day"
        { note: 2, time: 32000 }, // Mi - "It"
        { note: 1, time: 32500 }, // Ré - "fol"
        { note: 0, time: 33000 }, // Dó - "lowed"
        { note: 1, time: 33500 }, // Ré - "her"
        { note: 2, time: 34000 }, // Mi - "to"
        { note: 2, time: 34500 }, // Mi - "school"
        { note: 2, time: 35000 }, // Mi - "one"
        { note: 1, time: 35500 }, // Ré - "day"
        
        // "school one day, school one day"
        { note: 1, time: 36500 }, // Ré - "school"
        { note: 1, time: 37000 }, // Ré - "one"
        { note: 1, time: 37500 }, // Ré - "day"
        
        { note: 2, time: 38500 }, // Mi - "school"
        { note: 4, time: 39000 }, // Sol - "one"
        { note: 4, time: 39500 }, // Sol - "day"
        
        // "It followed her to school one day"
        { note: 2, time: 40500 }, // Mi - "It"
        { note: 1, time: 41000 }, // Ré - "fol"
        { note: 0, time: 41500 }, // Dó - "lowed"
        { note: 1, time: 42000 }, // Ré - "her"
        { note: 2, time: 42500 }, // Mi - "to"
        { note: 2, time: 43000 }, // Mi - "school"
        { note: 2, time: 43500 }, // Mi - "one"
        { note: 1, time: 44000 }, // Ré - "day"
        
        // "Which was against the rule"
        { note: 2, time: 45000 }, // Mi - "Which"
        { note: 1, time: 45500 }, // Ré - "was"
        { note: 1, time: 46000 }, // Ré - "a"
        { note: 2, time: 46500 }, // Mi - "gainst"
        { note: 1, time: 47000 }, // Ré - "the"
        { note: 0, time: 47500 }, // Dó - "rule"
        
        // Verso final: "It made the children laugh and play"
        { note: 2, time: 49000 }, // Mi - "It"
        { note: 1, time: 49500 }, // Ré - "made"
        { note: 0, time: 50000 }, // Dó - "the"
        { note: 1, time: 50500 }, // Ré - "chil"
        { note: 2, time: 51000 }, // Mi - "dren"
        { note: 2, time: 51500 }, // Mi - "laugh"
        { note: 2, time: 52000 }, // Mi - "and"
        { note: 1, time: 52500 }, // Ré - "play"
        
        // "laugh and play, laugh and play"
        { note: 1, time: 53500 }, // Ré - "laugh"
        { note: 1, time: 54000 }, // Ré - "and"
        { note: 1, time: 54500 }, // Ré - "play"
        
        { note: 2, time: 55500 }, // Mi - "laugh"
        { note: 4, time: 56000 }, // Sol - "and"
        { note: 4, time: 56500 }, // Sol - "play"
        
        // "It made the children laugh and play"
        { note: 2, time: 57500 }, // Mi - "It"
        { note: 1, time: 58000 }, // Ré - "made"
        { note: 0, time: 58500 }, // Dó - "the"
        { note: 1, time: 59000 }, // Ré - "chil"
        { note: 2, time: 59500 }, // Mi - "dren"
        { note: 2, time: 60000 }, // Mi - "laugh"
        { note: 2, time: 60500 }, // Mi - "and"
        { note: 1, time: 61000 }, // Ré - "play"
        
        // "To see a lamb at school"
        { note: 2, time: 62000 }, // Mi - "To"
        { note: 1, time: 62500 }, // Ré - "see"
        { note: 1, time: 63000 }, // Ré - "a"
        { note: 2, time: 63500 }, // Mi - "lamb"
        { note: 1, time: 64000 }, // Ré - "at"
        { note: 0, time: 64500 }, // Dó - "school"
        
        // Final instrumental com escala descendente
        { note: 4, time: 66000 }, // Sol
        { note: 3, time: 66500 }, // Fá
        { note: 2, time: 67000 }, // Mi
        { note: 1, time: 67500 }, // Ré
        { note: 0, time: 68000 }, // Dó (final)
      ];

      maryLambMelody.forEach((noteData, index) => {
        if (noteData.note < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: noteData.note,
            color: lanes[noteData.note].color,
            frequency: lanes[noteData.note].frequency,
            startTime: noteData.time,
            duration: 400,
            y: -100,
            hasPlayed: false,
            isHit: false
          });
        }
      });
    } else if (songId === "old-macdonald-bell") {
      // Melodia completa e corrigida de "Old MacDonald Had a Farm"
      const oldMacDonaldMelody = [
        // "Old MacDonald had a farm"
        { note: 4, time: 0 },     // Sol - "Old"
        { note: 4, time: 500 },   // Sol - "Mac"
        { note: 4, time: 1000 },  // Sol - "Don"
        { note: 1, time: 1500 },  // Ré - "ald"
        { note: 2, time: 2000 },  // Mi - "had"
        { note: 2, time: 2500 },  // Mi - "a"
        { note: 1, time: 3000 },  // Ré - "farm"
        
        // "E-I-E-I-O"
        { note: 6, time: 4000 },  // Si - "E"
        { note: 6, time: 4500 },  // Si - "I"
        { note: 6, time: 5000 },  // Si - "E"
        { note: 6, time: 5500 },  // Si - "I"
        { note: 4, time: 6000 },  // Sol - "O"
        
        // "And on his farm he had some cows"
        { note: 4, time: 7000 },  // Sol - "And"
        { note: 4, time: 7500 },  // Sol - "on"
        { note: 4, time: 8000 },  // Sol - "his"
        { note: 1, time: 8500 },  // Ré - "farm"
        { note: 2, time: 9000 },  // Mi - "he"
        { note: 2, time: 9500 },  // Mi - "had"
        { note: 1, time: 10000 }, // Ré - "some"
        { note: 0, time: 10500 }, // Dó - "cows"
        
        // "E-I-E-I-O"
        { note: 6, time: 11500 }, // Si - "E"
        { note: 6, time: 12000 }, // Si - "I"
        { note: 6, time: 12500 }, // Si - "E"
        { note: 6, time: 13000 }, // Si - "I"
        { note: 4, time: 13500 }, // Sol - "O"
        
        // "With a moo-moo here"
        { note: 0, time: 14500 }, // Dó - "With"
        { note: 0, time: 15000 }, // Dó - "a"
        { note: 4, time: 15500 }, // Sol - "moo"
        { note: 4, time: 16000 }, // Sol - "moo"
        { note: 0, time: 16500 }, // Dó - "here"
        
        // "And a moo-moo there"
        { note: 2, time: 17000 }, // Mi - "And"
        { note: 2, time: 17500 }, // Mi - "a"
        { note: 4, time: 18000 }, // Sol - "moo"
        { note: 4, time: 18500 }, // Sol - "moo"
        { note: 2, time: 19000 }, // Mi - "there"
        
        // "Here a moo, there a moo"
        { note: 0, time: 19500 }, // Dó - "Here"
        { note: 0, time: 20000 }, // Dó - "a"
        { note: 4, time: 20300 }, // Sol - "moo"
        { note: 2, time: 20600 }, // Mi - "there"
        { note: 2, time: 20900 }, // Mi - "a"
        { note: 4, time: 21200 }, // Sol - "moo"
        
        // "Everywhere a moo-moo"
        { note: 0, time: 21700 }, // Dó - "Ev"
        { note: 2, time: 22000 }, // Mi - "ery"
        { note: 4, time: 22300 }, // Sol - "where"
        { note: 2, time: 22600 }, // Mi - "a"
        { note: 4, time: 22900 }, // Sol - "moo"
        { note: 4, time: 23200 }, // Sol - "moo"
        
        // "Old MacDonald had a farm"
        { note: 4, time: 24000 }, // Sol - "Old"
        { note: 4, time: 24500 }, // Sol - "Mac"
        { note: 4, time: 25000 }, // Sol - "Don"
        { note: 1, time: 25500 }, // Ré - "ald"
        { note: 2, time: 26000 }, // Mi - "had"
        { note: 2, time: 26500 }, // Mi - "a"
        { note: 1, time: 27000 }, // Ré - "farm"
        
        // "E-I-E-I-O"
        { note: 6, time: 28000 }, // Si - "E"
        { note: 6, time: 28500 }, // Si - "I"
        { note: 6, time: 29000 }, // Si - "E"
        { note: 6, time: 29500 }, // Si - "I"
        { note: 4, time: 30000 }, // Sol - "O"
        
        // SEGUNDO VERSO - "And on his farm he had some pigs"
        { note: 4, time: 31000 }, // Sol - "And"
        { note: 4, time: 31500 }, // Sol - "on"
        { note: 4, time: 32000 }, // Sol - "his"
        { note: 1, time: 32500 }, // Ré - "farm"
        { note: 2, time: 33000 }, // Mi - "he"
        { note: 2, time: 33500 }, // Mi - "had"
        { note: 1, time: 34000 }, // Ré - "some"
        { note: 0, time: 34500 }, // Dó - "pigs"
        
        // "E-I-E-I-O"
        { note: 6, time: 35500 }, // Si - "E"
        { note: 6, time: 36000 }, // Si - "I"
        { note: 6, time: 36500 }, // Si - "E"
        { note: 6, time: 37000 }, // Si - "I"
        { note: 4, time: 37500 }, // Sol - "O"
        
        // "With an oink-oink here"
        { note: 0, time: 38500 }, // Dó - "With"
        { note: 0, time: 39000 }, // Dó - "an"
        { note: 3, time: 39500 }, // Fá - "oink"
        { note: 3, time: 40000 }, // Fá - "oink"
        { note: 0, time: 40500 }, // Dó - "here"
        
        // "And an oink-oink there"
        { note: 2, time: 41000 }, // Mi - "And"
        { note: 2, time: 41500 }, // Mi - "an"
        { note: 3, time: 42000 }, // Fá - "oink"
        { note: 3, time: 42500 }, // Fá - "oink"
        { note: 2, time: 43000 }, // Mi - "there"
        
        // "Here an oink, there an oink"
        { note: 0, time: 43500 }, // Dó - "Here"
        { note: 0, time: 44000 }, // Dó - "an"
        { note: 3, time: 44300 }, // Fá - "oink"
        { note: 2, time: 44600 }, // Mi - "there"
        { note: 2, time: 44900 }, // Mi - "an"
        { note: 3, time: 45200 }, // Fá - "oink"
        
        // "Everywhere an oink-oink"
        { note: 0, time: 45700 }, // Dó - "Ev"
        { note: 2, time: 46000 }, // Mi - "ery"
        { note: 4, time: 46300 }, // Sol - "where"
        { note: 2, time: 46600 }, // Mi - "an"
        { note: 3, time: 46900 }, // Fá - "oink"
        { note: 3, time: 47200 }, // Fá - "oink"
        
        // "Old MacDonald had a farm"
        { note: 4, time: 48000 }, // Sol - "Old"
        { note: 4, time: 48500 }, // Sol - "Mac"
        { note: 4, time: 49000 }, // Sol - "Don"
        { note: 1, time: 49500 }, // Ré - "ald"
        { note: 2, time: 50000 }, // Mi - "had"
        { note: 2, time: 50500 }, // Mi - "a"
        { note: 1, time: 51000 }, // Ré - "farm"
        
        // "E-I-E-I-O"
        { note: 6, time: 52000 }, // Si - "E"
        { note: 6, time: 52500 }, // Si - "I"
        { note: 6, time: 53000 }, // Si - "E"
        { note: 6, time: 53500 }, // Si - "I"
        { note: 4, time: 54000 }, // Sol - "O"
        
        // TERCEIRO VERSO - "And on his farm he had some ducks"
        { note: 4, time: 55000 }, // Sol - "And"
        { note: 4, time: 55500 }, // Sol - "on"
        { note: 4, time: 56000 }, // Sol - "his"
        { note: 1, time: 56500 }, // Ré - "farm"
        { note: 2, time: 57000 }, // Mi - "he"
        { note: 2, time: 57500 }, // Mi - "had"
        { note: 1, time: 58000 }, // Ré - "some"
        { note: 0, time: 58500 }, // Dó - "ducks"
        
        // "E-I-E-I-O"
        { note: 6, time: 59500 }, // Si - "E"
        { note: 6, time: 60000 }, // Si - "I"
        { note: 6, time: 60500 }, // Si - "E"
        { note: 6, time: 61000 }, // Si - "I"
        { note: 4, time: 61500 }, // Sol - "O"
        
        // "With a quack-quack here"
        { note: 0, time: 62500 }, // Dó - "With"
        { note: 0, time: 63000 }, // Dó - "a"
        { note: 5, time: 63500 }, // Lá - "quack"
        { note: 5, time: 64000 }, // Lá - "quack"
        { note: 0, time: 64500 }, // Dó - "here"
        
        // "And a quack-quack there"
        { note: 2, time: 65000 }, // Mi - "And"
        { note: 2, time: 65500 }, // Mi - "a"
        { note: 5, time: 66000 }, // Lá - "quack"
        { note: 5, time: 66500 }, // Lá - "quack"
        { note: 2, time: 67000 }, // Mi - "there"
        
        // "Here a quack, there a quack"
        { note: 0, time: 67500 }, // Dó - "Here"
        { note: 0, time: 68000 }, // Dó - "a"
        { note: 5, time: 68300 }, // Lá - "quack"
        { note: 2, time: 68600 }, // Mi - "there"
        { note: 2, time: 68900 }, // Mi - "a"
        { note: 5, time: 69200 }, // Lá - "quack"
        
        // "Everywhere a quack-quack"
        { note: 0, time: 69700 }, // Dó - "Ev"
        { note: 2, time: 70000 }, // Mi - "ery"
        { note: 4, time: 70300 }, // Sol - "where"
        { note: 2, time: 70600 }, // Mi - "a"
        { note: 5, time: 70900 }, // Lá - "quack"
        { note: 5, time: 71200 }, // Lá - "quack"
        
        // "Old MacDonald had a farm" (final)
        { note: 4, time: 72000 }, // Sol - "Old"
        { note: 4, time: 72500 }, // Sol - "Mac"
        { note: 4, time: 73000 }, // Sol - "Don"
        { note: 1, time: 73500 }, // Ré - "ald"
        { note: 2, time: 74000 }, // Mi - "had"
        { note: 2, time: 74500 }, // Mi - "a"
        { note: 1, time: 75000 }, // Ré - "farm"
        
        // "E-I-E-I-O" (final)
        { note: 6, time: 76000 }, // Si - "E"
        { note: 6, time: 76500 }, // Si - "I"
        { note: 6, time: 77000 }, // Si - "E"
        { note: 6, time: 77500 }, // Si - "I"
        { note: 4, time: 78000 }, // Sol - "O"
        
        // Final instrumental
        { note: 4, time: 79000 }, // Sol
        { note: 2, time: 79500 }, // Mi
        { note: 1, time: 80000 }, // Ré
        { note: 0, time: 80500 }, // Dó (final)
      ];

      oldMacDonaldMelody.forEach((noteData, index) => {
        if (noteData.note < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: noteData.note,
            color: lanes[noteData.note].color,
            frequency: lanes[noteData.note].frequency,
            startTime: noteData.time,
            duration: 400,
            y: -100,
            hasPlayed: false,
            isHit: false
          });
        }
      });
    } else {
      // Gerar padrão genérico para outras músicas
      const patterns = [
        [0, 2, 4], // Dó, Mi, Sol
        [1, 3, 5], // Ré, Fá, Lá
        [0, 1, 2], // Sequência simples
        [4, 5, 6], // Notas agudas
        [2, 4, 6], // Saltos
        [0, 3, 6], // Acordes
      ];

      for (let i = 0; i < 20; i++) {
        const pattern = patterns[i % patterns.length];
        const baseTime = i * 4000;
        
        pattern.forEach((laneIndex, noteIndex) => {
          if (laneIndex < lanes.length) {
            newNotes.push({
              id: `note-${noteId++}`,
              lane: laneIndex,
              color: lanes[laneIndex].color,
              frequency: lanes[laneIndex].frequency,
              startTime: baseTime + noteIndex * 1000,
              duration: 600,
              y: -100,
              hasPlayed: false,
              isHit: false
            });
          }
        });
      }
    }

    console.log(`Generated ${newNotes.length} notes for song: ${songId || 'generic'}`);
    setTotalNotes(newNotes.length);
    setNotes(newNotes);
  }, [lanes]);

  // Gerar padrão de notas
  const generateNotes = useCallback(() => {
    if (songId) {
      generateSpecificSongNotes(songId);
    } else {
      generateSpecificSongNotes('generic');
    }
  }, [songId, generateSpecificSongNotes]);

  // Função para clicar em uma nota
  const handleNoteClick = useCallback((noteId: string) => {
    if (!isPlaying) return;

    const noteToHit = notes.find(note => note.id === noteId);
    if (!noteToHit || noteToHit.isHit) return;

    const hitZoneTop = 350;
    const hitZoneBottom = hitZoneTop + hitZoneHeight;

    // Verificar se a nota está na zona de acerto
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

      // Tocar o som da nota
      onNotePlay(noteToHit.frequency, noteToHit.color);

      toast(`${feedback} +${finalPoints} pontos`, {
        duration: 1000,
      });

      // Marcar a nota como acertada
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? { ...note, isHit: true } : note
        )
      );

      console.log(`Hit note! Score: ${finalPoints}, Combo: ${combo + 1}`);
    } else {
      // Nota clicada fora da zona de acerto
      if (combo > 0) {
        setCombo(0);
        toast("Miss! Combo perdido", {
          duration: 1000,
        });
      }
      
      // Ainda tocar o som da nota mesmo que seja miss
      onNotePlay(noteToHit.frequency, noteToHit.color);
      console.log(`Missed note: clicked outside hit zone`);
    }
  }, [isPlaying, notes, combo, hitZoneHeight, onNotePlay]);

  // Atualizar posição das notas
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

      // Verificar notas perdidas (que passaram da tela sem serem acertadas)
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

      // Verificar se todas as notas terminaram (fim da música)
      const visibleNotes = updatedNotes.filter(note => note.y <= 500);
      if (visibleNotes.length === 0 && updatedNotes.length > 0 && !gameEnded) {
        setGameEnded(true);
        setIsPlaying(false);
        
        // Mostrar pontuação final
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

  // Detectar teclas pressionadas
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

  // Gerenciar eventos de teclado
  useEffect(() => {
    if (isPlaying) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isPlaying, handleKeyPress]);

  // Iniciar/pausar o jogo
  const togglePlay = () => {
    if (!isPlaying) {
      // Iniciar o jogo
      if (notes.length === 0) {
        generateNotes();
      }
      
      const now = Date.now();
      if (gameStartTimeRef.current === 0) {
        // Primeiro início do jogo
        gameStartTimeRef.current = now;
        totalPausedTimeRef.current = 0;
      } else {
        // Retomando do pause
        const pausedDuration = now - pauseTimeRef.current;
        totalPausedTimeRef.current += pausedDuration;
      }
      
      lastUpdateTimeRef.current = now;
      console.log(`Starting/Resuming ${instrumentType} game`);
      setIsPlaying(true);
      setGameEnded(false);
    } else {
      // Pausar o jogo
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      pauseTimeRef.current = Date.now();
      setIsPlaying(false);
      console.log(`Pausing ${instrumentType} game`);
    }
  };

  // Iniciar animação quando o jogo começar
  useEffect(() => {
    if (isPlaying) {
      updateNotes();
    }
  }, [isPlaying, updateNotes]);

  // Resetar o jogo
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

  // Cleanup
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
      {/* Header com controles e pontuação */}
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

        {/* Stats grid */}
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

      {/* Instruções */}
      <div className="bg-blue-600 p-3 text-center text-white">
        <p className="text-sm">
          Use as teclas <strong>1-7</strong> ou <strong>clique nas notas</strong> quando elas passarem pela zona dourada!
        </p>
      </div>

      {/* Game Area */}
      <div 
        ref={gameRef}
        className="flex-1 relative bg-gradient-to-b from-gray-900 to-black overflow-hidden"
        style={{ height: "500px" }}
      >
        {/* Lanes (faixas) */}
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
            {/* Indicador da nota na parte inferior */}
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

        {/* Zona de acerto */}
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

        {/* Notas em queda */}
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

        {/* Linha de referência */}
        <div
          className="absolute w-full border-t-4 border-yellow-400 opacity-50"
          style={{ top: "380px" }}
        />

        {/* Mensagem de fim de jogo */}
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
