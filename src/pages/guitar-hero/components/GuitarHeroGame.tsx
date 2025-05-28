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
        { note: 0, time: 0 },     // Dó - "Bri"
        { note: 0, time: 800 },   // Dó - "lha"
        { note: 4, time: 1600 },  // Sol - "bri"
        { note: 4, time: 2400 },  // Sol - "lha"
        { note: 5, time: 3200 },  // Lá - "es"
        { note: 5, time: 4000 },  // Lá - "tre"
        { note: 4, time: 4800 },  // Sol - "li" (pausa mais longa)
        
        { note: 3, time: 6000 },  // Fá - "Co"
        { note: 3, time: 6800 },  // Fá - "mo"
        { note: 2, time: 7600 },  // Mi - "eu"
        { note: 2, time: 8400 },  // Mi - "que"
        { note: 1, time: 9200 },  // Ré - "ro"
        { note: 1, time: 10000 }, // Ré - "sa"
        { note: 0, time: 10800 }, // Dó - "ber" (pausa mais longa)
        
        { note: 4, time: 12400 }, // Sol - "O"
        { note: 4, time: 13200 }, // Sol - "que"
        { note: 3, time: 14000 }, // Fá - "vo"
        { note: 3, time: 14800 }, // Fá - "cê"
        { note: 2, time: 15600 }, // Mi - "é"
        { note: 2, time: 16400 }, // Mi - "de"
        { note: 1, time: 17200 }, // Ré - "ver"
        { note: 1, time: 18000 }, // Ré - "da" 
        { note: 0, time: 18800 }, // Dó - "de" (final)
        
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
    } else if (songId === "london-bridge-xylophone") {
      // Melodia completa e corrigida de "London Bridge Is Falling Down"
      const londonBridgeMelody = [
        // Primeira estrofe: "London Bridge is falling down"
        { note: 4, time: 0 },     // Sol - "Lon"
        { note: 5, time: 500 },   // Lá - "don"
        { note: 4, time: 1000 },  // Sol - "Bridge"
        { note: 3, time: 1500 },  // Fá - "is"
        { note: 4, time: 2000 },  // Sol - "fall"
        { note: 3, time: 2500 },  // Fá - "ing"
        { note: 2, time: 3000 },  // Mi - "down"
        
        // Repetição: "falling down, falling down"
        { note: 3, time: 4000 },  // Fá - "fall"
        { note: 2, time: 4500 },  // Mi - "ing"
        { note: 1, time: 5000 },  // Ré - "down"
        
        { note: 3, time: 6000 },  // Fá - "fall"
        { note: 2, time: 6500 },  // Mi - "ing"
        { note: 1, time: 7000 },  // Ré - "down"
        
        // Final da primeira estrofe: "London Bridge is falling down"
        { note: 4, time: 8000 },  // Sol - "Lon"
        { note: 5, time: 8500 },  // Lá - "don"
        { note: 4, time: 9000 },  // Sol - "Bridge"
        { note: 3, time: 9500 },  // Fá - "is"
        { note: 4, time: 10000 }, // Sol - "fall"
        { note: 3, time: 10500 }, // Fá - "ing"
        { note: 2, time: 11000 }, // Mi - "down"
        
        // "My fair lady"
        { note: 1, time: 12000 }, // Ré - "My"
        { note: 0, time: 12500 }, // Dó - "fair"
        { note: 1, time: 13000 }, // Ré - "la"
        { note: 2, time: 13500 }, // Mi - "dy"
        
        // Segunda estrofe: "Take the key and lock her up"
        { note: 4, time: 15000 }, // Sol - "Take"
        { note: 5, time: 15500 }, // Lá - "the"
        { note: 4, time: 16000 }, // Sol - "key"
        { note: 3, time: 16500 }, // Fá - "and"
        { note: 4, time: 17000 }, // Sol - "lock"
        { note: 3, time: 17500 }, // Fá - "her"
        { note: 2, time: 18000 }, // Mi - "up"
        
        // Repetição: "lock her up, lock her up"
        { note: 3, time: 19000 }, // Fá - "lock"
        { note: 2, time: 19500 }, // Mi - "her"
        { note: 1, time: 20000 }, // Ré - "up"
        
        { note: 3, time: 21000 }, // Fá - "lock"
        { note: 2, time: 21500 }, // Mi - "her"
        { note: 1, time: 22000 }, // Ré - "up"
        
        // Final da segunda estrofe: "Take the key and lock her up"
        { note: 4, time: 23000 }, // Sol - "Take"
        { note: 5, time: 23500 }, // Lá - "the"
        { note: 4, time: 24000 }, // Sol - "key"
        { note: 3, time: 24500 }, // Fá - "and"
        { note: 4, time: 25000 }, // Sol - "lock"
        { note: 3, time: 25500 }, // Fá - "her"
        { note: 2, time: 26000 }, // Mi - "up"
        
        // "My fair lady"
        { note: 1, time: 27000 }, // Ré - "My"
        { note: 0, time: 27500 }, // Dó - "fair"
        { note: 1, time: 28000 }, // Ré - "la"
        { note: 2, time: 28500 }, // Mi - "dy"
        
        // Terceira estrofe: "Build it up with wood and clay"
        { note: 4, time: 30000 }, // Sol - "Build"
        { note: 5, time: 30500 }, // Lá - "it"
        { note: 4, time: 31000 }, // Sol - "up"
        { note: 3, time: 31500 }, // Fá - "with"
        { note: 4, time: 32000 }, // Sol - "wood"
        { note: 3, time: 32500 }, // Fá - "and"
        { note: 2, time: 33000 }, // Mi - "clay"
        
        // Repetição: "wood and clay, wood and clay"
        { note: 3, time: 34000 }, // Fá - "wood"
        { note: 2, time: 34500 }, // Mi - "and"
        { note: 1, time: 35000 }, // Ré - "clay"
        
        { note: 3, time: 36000 }, // Fá - "wood"
        { note: 2, time: 36500 }, // Mi - "and"
        { note: 1, time: 37000 }, // Ré - "clay"
        
        // Final da terceira estrofe: "Build it up with wood and clay"
        { note: 4, time: 38000 }, // Sol - "Build"
        { note: 5, time: 38500 }, // Lá - "it"
        { note: 4, time: 39000 }, // Sol - "up"
        { note: 3, time: 39500 }, // Fá - "with"
        { note: 4, time: 40000 }, // Sol - "wood"
        { note: 3, time: 40500 }, // Fá - "and"
        { note: 2, time: 41000 }, // Mi - "clay"
        
        // "My fair lady"
        { note: 1, time: 42000 }, // Ré - "My"
        { note: 0, time: 42500 }, // Dó - "fair"
        { note: 1, time: 43000 }, // Ré - "la"
        { note: 2, time: 43500 }, // Mi - "dy"
        
        // Quarta estrofe: "Wood and clay will wash away"
        { note: 4, time: 45000 }, // Sol - "Wood"
        { note: 5, time: 45500 }, // Lá - "and"
        { note: 4, time: 46000 }, // Sol - "clay"
        { note: 3, time: 46500 }, // Fá - "will"
        { note: 4, time: 47000 }, // Sol - "wash"
        { note: 3, time: 47500 }, // Fá - "a"
        { note: 2, time: 48000 }, // Mi - "way"
        
        // Repetição: "wash away, wash away"
        { note: 3, time: 49000 }, // Fá - "wash"
        { note: 2, time: 49500 }, // Mi - "a"
        { note: 1, time: 50000 }, // Ré - "way"
        
        { note: 3, time: 51000 }, // Fá - "wash"
        { note: 2, time: 51500 }, // Mi - "a"
        { note: 1, time: 52000 }, // Ré - "way"
        
        // Final da quarta estrofe: "Wood and clay will wash away"
        { note: 4, time: 53000 }, // Sol - "Wood"
        { note: 5, time: 53500 }, // Lá - "and"
        { note: 4, time: 54000 }, // Sol - "clay"
        { note: 3, time: 54500 }, // Fá - "will"
        { note: 4, time: 55000 }, // Sol - "wash"
        { note: 3, time: 55500 }, // Fá - "a"
        { note: 2, time: 56000 }, // Mi - "way"
        
        // "My fair lady"
        { note: 1, time: 57000 }, // Ré - "My"
        { note: 0, time: 57500 }, // Dó - "fair"
        { note: 1, time: 58000 }, // Ré - "la"
        { note: 2, time: 58500 }, // Mi - "dy"
        
        // Quinta estrofe: "Build it up with bricks and mortar"
        { note: 4, time: 60000 }, // Sol - "Build"
        { note: 5, time: 60500 }, // Lá - "it"
        { note: 4, time: 61000 }, // Sol - "up"
        { note: 3, time: 61500 }, // Fá - "with"
        { note: 4, time: 62000 }, // Sol - "bricks"
        { note: 3, time: 62500 }, // Fá - "and"
        { note: 2, time: 63000 }, // Mi - "mor"
        { note: 1, time: 63500 }, // Ré - "tar"
        
        // Repetição: "bricks and mortar, bricks and mortar"
        { note: 3, time: 64500 }, // Fá - "bricks"
        { note: 2, time: 65000 }, // Mi - "and"
        { note: 1, time: 65500 }, // Ré - "mor"
        { note: 0, time: 66000 }, // Dó - "tar"
        
        { note: 3, time: 67000 }, // Fá - "bricks"
        { note: 2, time: 67500 }, // Mi - "and"
        { note: 1, time: 68000 }, // Ré - "mor"
        { note: 0, time: 68500 }, // Dó - "tar"
        
        // Final da quinta estrofe: "Build it up with bricks and mortar"
        { note: 4, time: 69500 }, // Sol - "Build"
        { note: 5, time: 70000 }, // Lá - "it"
        { note: 4, time: 70500 }, // Sol - "up"
        { note: 3, time: 71000 }, // Fá - "with"
        { note: 4, time: 71500 }, // Sol - "bricks"
        { note: 3, time: 72000 }, // Fá - "and"
        { note: 2, time: 72500 }, // Mi - "mor"
        { note: 1, time: 73000 }, // Ré - "tar"
        
        // "My fair lady" (final)
        { note: 1, time: 74000 }, // Ré - "My"
        { note: 0, time: 74500 }, // Dó - "fair"
        { note: 1, time: 75000 }, // Ré - "la"
        { note: 2, time: 75500 }, // Mi - "dy"
        
        // Final instrumental
        { note: 4, time: 77000 }, // Sol
        { note: 3, time: 77500 }, // Fá
        { note: 2, time: 78000 }, // Mi
        { note: 1, time: 78500 }, // Ré
        { note: 0, time: 79000 }, // Dó (final)
      ];

      londonBridgeMelody.forEach((noteData, index) => {
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
    } else if (songId === "row-boat-bell") {
      // Melodia completa e corrigida de "Row, Row, Row Your Boat"
      const rowBoatMelody = [
        { note: 0, time: 0 },     // Dó - "Row"
        { note: 0, time: 600 },   // Dó - "row"
        { note: 0, time: 1200 },  // Dó - "row"
        { note: 1, time: 1800 },  // Ré - "your"
        { note: 2, time: 2400 },  // Mi - "boat"
        
        { note: 2, time: 3200 },  // Mi - "Gent"
        { note: 1, time: 3800 },  // Ré - "ly"
        { note: 2, time: 4400 },  // Mi - "down"
        { note: 3, time: 5000 },  // Fá - "the"
        { note: 4, time: 5600 },  // Sol - "stream"
        
        { note: 4, time: 6800 },  // Sol - "Mer"
        { note: 3, time: 7100 },  // Fá - "ri"
        { note: 2, time: 7400 },  // Mi - "ly"
        { note: 1, time: 7700 },  // Ré - "mer"
        { note: 4, time: 8000 },  // Sol - "ri"
        { note: 3, time: 8300 },  // Fá - "ly"
        { note: 2, time: 8600 },  // Mi - "mer"
        { note: 1, time: 8900 },  // Ré - "ri"
        { note: 4, time: 9200 },  // Sol - "ly"
        { note: 3, time: 9500 },  // Fá - "mer"
        { note: 2, time: 9800 },  // Mi - "ri"
        { note: 1, time: 10100 }, // Ré - "ly"
        
        { note: 0, time: 11000 }, // Dó - "Life"
        { note: 1, time: 11600 }, // Ré - "is"
        { note: 2, time: 12200 }, // Mi - "but"
        { note: 1, time: 12800 }, // Ré - "a"
        { note: 0, time: 13400 }, // Dó - "dream"
        
        { note: 0, time: 15000 }, // Dó - "Row"
        { note: 0, time: 15600 }, // Dó - "row"
        { note: 0, time: 16200 }, // Dó - "row"
        { note: 1, time: 16800 }, // Ré - "your"
        { note: 2, time: 17400 }, // Mi - "boat"
        
        { note: 2, time: 18200 }, // Mi - "Gent"
        { note: 1, time: 18800 }, // Ré - "ly"
        { note: 2, time: 19400 }, // Mi - "down"
        { note: 3, time: 20000 }, // Fá - "the"
        { note: 4, time: 20600 }, // Sol - "stream"
        
        { note: 4, time: 21800 }, // Sol - "If"
        { note: 4, time: 22200 }, // Sol - "you"
        { note: 3, time: 22600 }, // Fá - "see"
        { note: 2, time: 23000 }, // Mi - "a"
        { note: 1, time: 23400 }, // Ré - "cro"
        { note: 2, time: 23800 }, // Mi - "co"
        { note: 3, time: 24200 }, // Fá - "dile"
        
        { note: 4, time: 25000 }, // Sol - "Don't"
        { note: 3, time: 25400 }, // Fá - "for"
        { note: 2, time: 25800 }, // Mi - "get"
        { note: 1, time: 26200 }, // Ré - "to"
        { note: 0, time: 26600 }, // Dó - "scream!"
        
        { note: 0, time: 28200 }, // Dó - "Row"
        { note: 0, time: 28800 }, // Dó - "row"
        { note: 0, time: 29400 }, // Dó - "row"
        { note: 1, time: 30000 }, // Ré - "your"
        { note: 2, time: 30600 }, // Mi - "boat"
        
        { note: 2, time: 31400 }, // Mi - "Gent"
        { note: 1, time: 32000 }, // Ré - "ly"
        { note: 2, time: 32600 }, // Mi - "to"
        { note: 3, time: 33200 }, // Fá - "and"
        { note: 4, time: 33800 }, // Sol - "fro"
        
        { note: 4, time: 35000 }, // Sol - "If"
        { note: 4, time: 35400 }, // Sol - "you"
        { note: 3, time: 35800 }, // Fá - "see"
        { note: 2, time: 36200 }, // Mi - "a"
        { note: 1, time: 36600 }, // Ré - "po"
        { note: 2, time: 37000 }, // Mi - "lar"
        { note: 3, time: 37400 }, // Fá - "bear"
        
        { note: 4, time: 38200 }, // Sol - "Don't"
        { note: 3, time: 38600 }, // Fá - "for"
        { note: 2, time: 39000 }, // Mi - "get"
        { note: 1, time: 39400 }, // Ré - "to"
        { note: 0, time: 39800 }, // Dó - "go!"
        
        { note: 0, time: 41400 }, // Dó - "Row"
        { note: 0, time: 42200 }, // Dó - "row"
        { note: 0, time: 43000 }, // Dó - "row"
        { note: 1, time: 43800 }, // Ré - "your"
        { note: 2, time: 44600 }, // Mi - "boat"
        
        { note: 2, time: 45800 }, // Mi - "Gent"
        { note: 1, time: 46600 }, // Ré - "ly"
        { note: 2, time: 47400 }, // Mi - "down"
        { note: 3, time: 48200 }, // Fá - "the"
        { note: 4, time: 49000 }, // Sol - "stream"
        
        { note: 4, time: 50500 }, // Sol - "Mer"
        { note: 3, time: 50900 }, // Fá - "ri"
        { note: 2, time: 51300 }, // Mi - "ly"
        { note: 1, time: 51700 }, // Ré - "mer"
        { note: 4, time: 52100 }, // Sol - "ri"
        { note: 3, time: 52500 }, // Fá - "ly"
        { note: 2, time: 52900 }, // Mi - "mer"
        { note: 1, time: 53300 }, // Ré - "ri"
        { note: 4, time: 53700 }, // Sol - "ly"
        { note: 3, time: 54100 }, // Fá - "mer"
        { note: 2, time: 54500 }, // Mi - "ri"
        { note: 1, time: 54900 }, // Ré - "ly"
        
        { note: 0, time: 56000 }, // Dó - "Life"
        { note: 1, time: 56800 }, // Ré - "is"
        { note: 2, time: 57600 }, // Mi - "but"
        { note: 1, time: 58400 }, // Ré - "a"
        { note: 0, time: 59200 }, // Dó - "dream"
        
        { note: 2, time: 60500 }, // Mi
        { note: 1, time: 61000 }, // Ré
        { note: 0, time: 61500 }, // Dó (final)
      ];

      rowBoatMelody.forEach((noteData, index) => {
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
    } else if (songId === "happy-birthday-xylophone") {
      // Melodia completa e corrigida de "Parabéns para Você"
      const happyBirthdayMelody = [
        { note: 0, time: 0 },     // Dó - "Pa"
        { note: 0, time: 500 },   // Dó - "ra"
        { note: 1, time: 1000 },  // Ré - "béns"
        { note: 0, time: 1500 },  // Dó - "pra"
        { note: 3, time: 2000 },  // Fá - "vo"
        { note: 2, time: 2500 },  // Mi - "cê"
        
        { note: 0, time: 4000 },  // Dó - "Pa"
        { note: 0, time: 4500 },  // Dó - "ra"
        { note: 1, time: 5000 },  // Ré - "béns"
        { note: 0, time: 5500 },  // Dó - "pra"
        { note: 4, time: 6000 },  // Sol - "vo"
        { note: 3, time: 6500 },  // Fá - "cê"
        
        { note: 0, time: 8000 },  // Dó - "Pa"
        { note: 0, time: 8500 },  // Dó - "ra"
        { note: 0, time: 9000 },  // Dó - "béns"
        { note: 5, time: 9500 },  // Lá - "que"
        { note: 3, time: 10000 }, // Fá - "ri"
        { note: 2, time: 10500 }, // Mi - "do"
        { note: 1, time: 11000 }, // Ré - "a"
        { note: 0, time: 11500 }, // Dó - "migo"
        
        { note: 6, time: 13000 }, // Si - "Pa"
        { note: 6, time: 13500 }, // Si - "ra"
        { note: 5, time: 14000 }, // Lá - "béns"
        { note: 3, time: 14500 }, // Fá - "pra"
        { note: 4, time: 15000 }, // Sol - "vo"
        { note: 3, time: 15500 }, // Fá - "cê"
        
        { note: 0, time: 17000 }, // Dó - "Pa"
        { note: 0, time: 17500 }, // Dó - "ra"
        { note: 1, time: 18000 }, // Ré - "béns"
        { note: 0, time: 18500 }, // Dó - "pra"
        { note: 3, time: 19000 }, // Fá - "vo"
        { note: 2, time: 19500 }, // Mi - "cê"
        
        { note: 0, time: 21000 }, // Dó - "Pa"
        { note: 0, time: 21500 }, // Dó - "ra"
        { note: 1, time: 22000 }, // Ré - "béns"
        { note: 0, time: 22500 }, // Dó - "pra"
        { note: 4, time: 23000 }, // Sol - "vo"
        { note: 3, time: 23500 }, // Fá - "cê"
        
        { note: 0, time: 25000 }, // Dó - "Pa"
        { note: 0, time: 25500 }, // Dó - "ra"
        { note: 0, time: 26000 }, // Dó - "béns"
        { note: 5, time: 26500 }, // Lá - "que"
        { note: 3, time: 27000 }, // Fá - "ri"
        { note: 2, time: 27500 }, // Mi - "do"
        { note: 1, time: 28000 }, // Ré - "a"
        { note: 0, time: 28500 }, // Dó - "migo"
        
        { note: 6, time: 30000 }, // Si - "Pa"
        { note: 6, time: 30500 }, // Si - "ra"
        { note: 5, time: 31000 }, // Lá - "béns"
        { note: 3, time: 31500 }, // Fá - "pra"
        { note: 4, time: 32000 }, // Sol - "vo"
        { note: 3, time: 32500 }, // Fá - "cê"
        
        { note: 0, time: 34000 }, // Dó - "Mui"
        { note: 1, time: 34500 }, // Ré - "tas"
        { note: 2, time: 35000 }, // Mi - "fe"
        { note: 3, time: 35500 }, // Fá - "li"
        { note: 4, time: 36000 }, // Sol - "ci"
        { note: 5, time: 36500 }, // Lá - "da"
        { note: 6, time: 37000 }, // Si - "des"
        
        { note: 5, time: 38000 }, // Lá - "Mui"
        { note: 4, time: 38500 }, // Sol - "tos"
        { note: 3, time: 39000 }, // Fá - "a"
        { note: 2, time: 39500 }, // Mi - "nos"
        { note: 1, time: 40000 }, // Ré - "de"
        { note: 0, time: 40500 }, // Dó - "vi"
        { note: 4, time: 41000 }, // Sol - "da"
        
        { note: 0, time: 42500 }, // Dó - "Que"
        { note: 0, time: 43000 }, // Dó - "Deus"
        { note: 1, time: 43500 }, // Ré - "te"
        { note: 2, time: 44000 }, // Mi - "a"
        { note: 3, time: 44500 }, // Fá - "ben"
        { note: 4, time: 45000 }, // Sol - "ço"
        { note: 5, time: 45500 }, // Lá - "e"
        
        { note: 6, time: 46500 }, // Si - "E"
        { note: 5, time: 47000 }, // Lá - "te"
        { note: 4, time: 47500 }, // Sol - "guar"
        { note: 3, time: 48000 }, // Fá - "de"
        { note: 2, time: 48500 }, // Mi - "sem"
        { note: 1, time: 49000 }, // Ré - "pre"
        { note: 0, time: 49500 }, // Dó - "!!"
        
        { note: 4, time: 51000 }, // Sol
        { note: 3, time: 51500 }, // Fá
        { note: 2, time: 52000 }, // Mi
        { note: 1, time: 52500 }, // Ré
        { note: 0, time: 53000 }, // Dó (final)
      ];

      happyBirthdayMelody.forEach((noteData, index) => {
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
    } else if (songId === "jingle-bells-xylophone") {
      // Melodia completa de "Jingle Bells"
      const jingleBellsMelody = [
        // "Jingle bells, jingle bells"
        { note: 2, time: 0 },     // Mi - "Jin"
        { note: 2, time: 400 },   // Mi - "gle"
        { note: 2, time: 800 },   // Mi - "bells"
        
        { note: 2, time: 1600 },  // Mi - "jin"
        { note: 2, time: 2000 },  // Mi - "gle"
        { note: 2, time: 2400 },  // Mi - "bells"
        
        // "Jingle all the way"
        { note: 2, time: 3200 },  // Mi - "jin"
        { note: 4, time: 3600 },  // Sol - "gle"
        { note: 0, time: 4000 },  // Dó - "all"
        { note: 1, time: 4400 },  // Ré - "the"
        { note: 2, time: 4800 },  // Mi - "way"
        
        // "Oh what fun it is to ride"
        { note: 3, time: 6000 },  // Fá - "Oh"
        { note: 3, time: 6400 },  // Fá - "what"
        { note: 3, time: 6800 },  // Fá - "fun"
        { note: 3, time: 7200 },  // Fá - "it"
        { note: 3, time: 7600 },  // Fá - "is"
        { note: 2, time: 8000 },  // Mi - "to"
        { note: 2, time: 8400 },  // Mi - "ride"
        
        // "In a one-horse open sleigh"
        { note: 2, time: 9200 },  // Mi - "in"
        { note: 1, time: 9600 },  // Ré - "a"
        { note: 1, time: 10000 }, // Ré - "one"
        { note: 2, time: 10400 }, // Mi - "horse"
        { note: 1, time: 10800 }, // Ré - "o"
        { note: 4, time: 11200 }, // Sol - "pen"
        { note: 0, time: 11600 }, // Dó - "sleigh"
        
        // Segunda parte: "Jingle bells, jingle bells"
        { note: 2, time: 13000 }, // Mi - "Jin"
        { note: 2, time: 13400 }, // Mi - "gle"
        { note: 2, time: 13800 }, // Mi - "bells"
        
        { note: 2, time: 14600 }, // Mi - "jin"
        { note: 2, time: 15000 }, // Mi - "gle"
        { note: 2, time: 15400 }, // Mi - "bells"
        
        // "Jingle all the way"
        { note: 2, time: 16200 }, // Mi - "jin"
        { note: 4, time: 16600 }, // Sol - "gle"
        { note: 0, time: 17000 }, // Dó - "all"
        { note: 1, time: 17400 }, // Ré - "the"
        { note: 2, time: 17800 }, // Mi - "way"
        
        // "Oh what fun it is to ride"
        { note: 3, time: 19000 }, // Fá - "Oh"
        { note: 3, time: 19400 }, // Fá - "what"
        { note: 3, time: 19800 }, // Fá - "fun"
        { note: 3, time: 20200 }, // Fá - "it"
        { note: 3, time: 20600 }, // Fá - "is"
        { note: 2, time: 21000 }, // Mi - "to"
        { note: 2, time: 21400 }, // Mi - "ride"
        
        // "In a one-horse open sleigh"
        { note: 2, time: 22200 }, // Mi - "in"
        { note: 1, time: 22600 }, // Ré - "a"
        { note: 1, time: 23000 }, // Ré - "one"
        { note: 2, time: 23400 }, // Mi - "horse"
        { note: 1, time: 23800 }, // Ré - "o"
        { note: 4, time: 24200 }, // Sol - "pen"
        { note: 0, time: 24600 }, // Dó - "sleigh"
        
        // Final instrumental
        { note: 4, time: 26000 }, // Sol
        { note: 3, time: 26400 }, // Fá
        { note: 2, time: 26800 }, // Mi
        { note: 1, time: 27200 }, // Ré
        { note: 0, time: 27600 }, // Dó (final)
      ];

      jingleBellsMelody.forEach((noteData, index) => {
        if (noteData.note < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: noteData.note,
            color: lanes[noteData.note].color,
            frequency: lanes[noteData.note].frequency,
            startTime: noteData.time,
            duration: 350,
            y: -100,
            hasPlayed: false,
            isHit: false
          });
        }
      });
    } else if (songId === "chopsticks-keyboard") {
      // Melodia completa de "Chopsticks"
      const chopsticksMelody = [
        // Primeira parte - Mão direita alternando
        { note: 3, time: 0 },     // Fá
        { note: 4, time: 500 },   // Sol
        { note: 5, time: 1000 },  // Lá
        { note: 4, time: 1500 },  // Sol
        { note: 3, time: 2000 },  // Fá
        { note: 4, time: 2500 },  // Sol
        { note: 5, time: 3000 },  // Lá
        { note: 4, time: 3500 },  // Sol
        
        // Segunda parte - Variação
        { note: 3, time: 4000 },  // Fá
        { note: 5, time: 4500 },  // Lá
        { note: 3, time: 5000 },  // Fá
        { note: 5, time: 5500 },  // Lá
        { note: 3, time: 6000 },  // Fá
        { note: 5, time: 6500 },  // Lá
        { note: 3, time: 7000 },  // Fá
        { note: 5, time: 7500 },  // Lá
        
        // Terceira parte - Descida
        { note: 6, time: 8000 },  // Si
        { note: 5, time: 8500 },  // Lá
        { note: 4, time: 9000 },  // Sol
        { note: 3, time: 9500 },  // Fá
        { note: 2, time: 10000 }, // Mi
        { note: 1, time: 10500 }, // Ré
        { note: 0, time: 11000 }, // Dó
        
        // Quarta parte - Subida
        { note: 0, time: 12000 }, // Dó
        { note: 1, time: 12500 }, // Ré
        { note: 2, time: 13000 }, // Mi
        { note: 3, time: 13500 }, // Fá
        { note: 4, time: 14000 }, // Sol
        { note: 5, time: 14500 }, // Lá
        { note: 6, time: 15000 }, // Si
        
        // Repetição da primeira parte
        { note: 3, time: 16000 }, // Fá
        { note: 4, time: 16500 }, // Sol
        { note: 5, time: 17000 }, // Lá
        { note: 4, time: 17500 }, // Sol
        { note: 3, time: 18000 }, // Fá
        { note: 4, time: 18500 }, // Sol
        { note: 5, time: 19000 }, // Lá
        { note: 4, time: 19500 }, // Sol
        
        // Final
        { note: 3, time: 20000 }, // Fá
        { note: 2, time: 20500 }, // Mi
        { note: 1, time: 21000 }, // Ré
        { note: 0, time: 21500 }, // Dó (final)
      ];

      chopsticksMelody.forEach((noteData, index) => {
        if (noteData.note < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: noteData.note,
            color: lanes[noteData.note].color,
            frequency: lanes[noteData.note].frequency,
            startTime: noteData.time,
            duration: 450,
            y: -100,
            hasPlayed: false,
            isHit: false
          });
        }
      });
    } else if (songId === "hot-cross-keyboard") {
      // Melodia completa e corrigida de "Hot Cross Buns"
      const hotCrossBunsMelody = [
        // Primeira frase: "Hot cross buns"
        { note: 2, time: 0 },     // Mi - "Hot"
        { note: 1, time: 600 },   // Ré - "cross"
        { note: 0, time: 1200 },  // Dó - "buns"
        
        // Segunda frase: "Hot cross buns"
        { note: 2, time: 2000 },  // Mi - "Hot"
        { note: 1, time: 2600 },  // Ré - "cross"
        { note: 0, time: 3200 },  // Dó - "buns"
        
        // Terceira frase: "One a penny, two a penny"
        { note: 0, time: 4200 },  // Dó - "One"
        { note: 0, time: 4500 },  // Dó - "a"
        { note: 0, time: 4800 },  // Dó - "pen"
        { note: 0, time: 5100 },  // Dó - "ny"
        
        { note: 1, time: 5600 },  // Ré - "two"
        { note: 1, time: 5900 },  // Ré - "a"
        { note: 1, time: 6200 },  // Ré - "pen"
        { note: 1, time: 6500 },  // Ré - "ny"
        
        // Quarta frase: "Hot cross buns"
        { note: 2, time: 7400 },  // Mi - "Hot"
        { note: 1, time: 8000 },  // Ré - "cross"
        { note: 0, time: 8600 },  // Dó - "buns"
        
        // Repetição completa
        { note: 2, time: 10000 }, // Mi - "Hot"
        { note: 1, time: 10600 }, // Ré - "cross"
        { note: 0, time: 11200 }, // Dó - "buns"
        
        { note: 2, time: 12000 }, // Mi - "Hot"
        { note: 1, time: 12600 }, // Ré - "cross"
        { note: 0, time: 13200 }, // Dó - "buns"
        
        { note: 0, time: 14200 }, // Dó - "One"
        { note: 0, time: 14500 }, // Dó - "a"
        { note: 0, time: 14800 }, // Dó - "pen"
        { note: 0, time: 15100 }, // Dó - "ny"
        
        { note: 1, time: 15600 }, // Ré - "two"
        { note: 1, time: 15900 }, // Ré - "a"
        { note: 1, time: 16200 }, // Ré - "pen"
        { note: 1, time: 16500 }, // Ré - "ny"
        
        { note: 2, time: 17400 }, // Mi - "Hot"
        { note: 1, time: 18000 }, // Ré - "cross"
        { note: 0, time: 18600 }, // Dó - "buns" (final)
      ];

      hotCrossBunsMelody.forEach((noteData, index) => {
        if (noteData.note < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: noteData.note,
            color: lanes[noteData.note].color,
            frequency: lanes[noteData.note].frequency,
            startTime: noteData.time,
            duration: 500,
            y: -100,
            hasPlayed: false,
            isHit: false
          });
        }
      });
    } else if (songId === "frere-jacques-bell") {
      // Melodia completa e corrigida de "Frère Jacques"
      const frereJacquesMelody = [
        // Primeira frase: "Frère Jacques, Frère Jacques"
        { note: 0, time: 0 },     // Dó - "Frè"
        { note: 1, time: 500 },   // Ré - "re"
        { note: 2, time: 1000 },  // Mi - "Jac"
        { note: 0, time: 1500 },  // Dó - "ques"
        
        { note: 0, time: 2200 },  // Dó - "Frè"
        { note: 1, time: 2700 },  // Ré - "re"
        { note: 2, time: 3200 },  // Mi - "Jac"
        { note: 0, time: 3700 },  // Dó - "ques"
        
        // Segunda frase: "Dormez-vous? Dormez-vous?"
        { note: 2, time: 4400 },  // Mi - "Dor"
        { note: 3, time: 4900 },  // Fá - "mez"
        { note: 4, time: 5400 },  // Sol - "vous?"
        
        { note: 2, time: 6300 },  // Mi - "Dor"
        { note: 3, time: 6800 },  // Fá - "mez"
        { note: 4, time: 7300 },  // Sol - "vous?"
        
        // Terceira frase: "Sonnez les matines, sonnez les matines"
        { note: 4, time: 8200 },  // Sol - "Son"
        { note: 5, time: 8500 },  // Lá - "nez"
        { note: 4, time: 8800 },  // Sol - "les"
        { note: 3, time: 9100 },  // Fá - "ma"
        { note: 2, time: 9400 },  // Mi - "ti"
        { note: 0, time: 9700 },  // Dó - "nes"
        
        { note: 4, time: 10600 }, // Sol - "Son"
        { note: 5, time: 10900 }, // Lá - "nez"
        { note: 4, time: 11200 }, // Sol - "les"
        { note: 3, time: 11500 }, // Fá - "ma"
        { note: 2, time: 11800 }, // Mi - "ti"
        { note: 0, time: 12100 }, // Dó - "nes"
        
        // Quarta frase: "Ding dong ding, ding dong ding"
        { note: 0, time: 13000 }, // Dó - "Ding"
        { note: 4, time: 13400 }, // Sol - "dong"
        { note: 0, time: 13800 }, // Dó - "ding"
        
        { note: 0, time: 14700 }, // Dó - "Ding"
        { note: 4, time: 15100 }, // Sol - "dong"
        { note: 0, time: 15500 }, // Dó - "ding"
        
        // Repetição instrumental
        { note: 0, time: 16500 }, // Dó
        { note: 1, time: 17000 }, // Ré
        { note: 2, time: 17500 }, // Mi
        { note: 3, time: 18000 }, // Fá
        { note: 4, time: 18500 }, // Sol
        { note: 0, time: 19000 }, // Dó (final)
      ];

      frereJacquesMelody.forEach((noteData, index) => {
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
    } else if (songId === "amazing-grace-bell") {
      // Melodia completa e corrigida de "Amazing Grace"
      const amazingGraceMelody = [
        // Primeira frase: "Amazing grace, how sweet the sound"
        { note: 0, time: 0 },     // Dó - "A"
        { note: 3, time: 800 },   // Fá - "ma"
        { note: 4, time: 1600 },  // Sol - "zing"
        { note: 2, time: 2400 },  // Mi - "grace"
        
        { note: 4, time: 3600 },  // Sol - "how"
        { note: 4, time: 4200 },  // Sol - "sweet"
        { note: 3, time: 4800 },  // Fá - "the"
        { note: 1, time: 5400 },  // Ré - "sound"
        
        // Segunda frase: "That saved a wretch like me"
        { note: 0, time: 6800 },  // Dó - "That"
        { note: 3, time: 7600 },  // Fá - "saved"
        { note: 4, time: 8400 },  // Sol - "a"
        { note: 2, time: 9200 },  // Mi - "wretch"
        
        { note: 4, time: 10400 }, // Sol - "like"
        { note: 3, time: 11200 }, // Fá - "me"
        
        // Terceira frase: "I once was lost, but now am found"
        { note: 5, time: 12800 }, // Lá - "I"
        { note: 4, time: 13400 }, // Sol - "once"
        { note: 3, time: 14000 }, // Fá - "was"
        { note: 1, time: 14600 }, // Ré - "lost"
        
        { note: 0, time: 16000 }, // Dó - "but"
        { note: 3, time: 16800 }, // Fá - "now"
        { note: 4, time: 17600 }, // Sol - "am"
        { note: 2, time: 18400 }, // Mi - "found"
        
        // Quarta frase: "Was blind but now I see"
        { note: 4, time: 19800 }, // Sol - "Was"
        { note: 3, time: 20600 }, // Fá - "blind"
        { note: 1, time: 21400 }, // Ré - "but"
        { note: 0, time: 22200 }, // Dó - "now"
        
        { note: 3, time: 23600 }, // Fá - "I"
        { note: 2, time: 24400 }, // Mi - "see"
        { note: 0, time: 25200 }, // Dó (final)
        
        // Segunda estrofe: "'Twas grace that taught my heart to fear"
        { note: 0, time: 27000 }, // Dó - "'Twas"
        { note: 3, time: 27800 }, // Fá - "grace"
        { note: 4, time: 28600 }, // Sol - "that"
        { note: 2, time: 29400 }, // Mi - "taught"
        
        { note: 4, time: 30600 }, // Sol - "my"
        { note: 4, time: 31200 }, // Sol - "heart"
        { note: 3, time: 31800 }, // Fá - "to"
        { note: 1, time: 32400 }, // Ré - "fear"
        
        // "And grace my fears relieved"
        { note: 0, time: 33800 }, // Dó - "And"
        { note: 3, time: 34600 }, // Fá - "grace"
        { note: 4, time: 35400 }, // Sol - "my"
        { note: 2, time: 36200 }, // Mi - "fears"
        
        { note: 4, time: 37400 }, // Sol - "re"
        { note: 3, time: 38200 }, // Fá - "lieved"
        
        // "How precious did that grace appear"
        { note: 5, time: 39800 }, // Lá - "How"
        { note: 4, time: 40400 }, // Sol - "pre"
        { note: 3, time: 41000 }, // Fá - "cious"
        { note: 1, time: 41600 }, // Ré - "did"
        
        { note: 0, time: 43000 }, // Dó - "that"
        { note: 3, time: 43800 }, // Fá - "grace"
        { note: 4, time: 44600 }, // Sol - "ap"
        { note: 2, time: 45400 }, // Mi - "pear"
        
        // "The hour I first believed"
        { note: 4, time: 46800 }, // Sol - "The"
        { note: 3, time: 47600 }, // Fá - "hour"
        { note: 1, time: 48400 }, // Ré - "I"
        { note: 0, time: 49200 }, // Dó - "first"
        
        { note: 3, time: 50600 }, // Fá - "be"
        { note: 2, time: 51400 }, // Mi - "lieved"
        { note: 0, time: 52200 }, // Dó (final)
      ];

      amazingGraceMelody.forEach((noteData, index) => {
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
    } else if (songId === "greensleeves-bell") {
      // Melodia completa e corrigida de "Greensleeves"
      const greenslevesMelody = [
        // Primeira frase: "Alas, my love, you do me wrong"
        { note: 5, time: 0 },     // Lá - "A"
        { note: 0, time: 1200 },  // Dó - "las"
        { note: 1, time: 1800 },  // Ré - "my"
        { note: 2, time: 2400 },  // Mi - "love"
        { note: 3, time: 3600 },  // Fá - "you"
        { note: 2, time: 4400 },  // Mi - "do"
        { note: 1, time: 5200 },  // Ré - "me"
        { note: 6, time: 6400 },  // Si - "wrong"
        
        // Segunda frase: "To cast me off discourteously"
        { note: 4, time: 8000 },  // Sol - "To"
        { note: 5, time: 9200 },  // Lá - "cast"
        { note: 6, time: 10000 }, // Si - "me"
        { note: 0, time: 10800 }, // Dó - "off"
        { note: 6, time: 12000 }, // Si - "dis"
        { note: 5, time: 12800 }, // Lá - "cour"
        { note: 4, time: 13600 }, // Sol - "te"
        { note: 3, time: 14800 }, // Fá - "ous"
        { note: 2, time: 15600 }, // Mi - "ly"
        
        // Terceira frase: "And I have loved you oh so long"
        { note: 5, time: 17200 }, // Lá - "And"
        { note: 0, time: 18400 }, // Dó - "I"
        { note: 1, time: 19000 }, // Ré - "have"
        { note: 2, time: 19600 }, // Mi - "loved"
        { note: 3, time: 20800 }, // Fá - "you"
        { note: 2, time: 21600 }, // Mi - "oh"
        { note: 1, time: 22400 }, // Ré - "so"
        { note: 6, time: 23600 }, // Si - "long"
        
        // Quarta frase: "Delighting in your company"
        { note: 4, time: 25200 }, // Sol - "De"
        { note: 5, time: 26400 }, // Lá - "light"
        { note: 6, time: 27200 }, // Si - "ing"
        { note: 0, time: 28000 }, // Dó - "in"
        { note: 6, time: 29200 }, // Si - "your"
        { note: 5, time: 30000 }, // Lá - "com"
        { note: 4, time: 30800 }, // Sol - "pa"
        { note: 2, time: 32400 }, // Mi - "ny"
        
        // Refrão: "Greensleeves was all my joy"
        { note: 4, time: 34000 }, // Sol - "Green"
        { note: 2, time: 35200 }, // Mi - "sleeves"
        { note: 3, time: 36000 }, // Fá - "was"
        { note: 4, time: 36800 }, // Sol - "all"
        { note: 5, time: 37600 }, // Lá - "my"
        { note: 3, time: 38800 }, // Fá - "joy"
        
        // "Greensleeves was my delight"
        { note: 4, time: 40400 }, // Sol - "Green"
        { note: 2, time: 41600 }, // Mi - "sleeves"
        { note: 3, time: 42400 }, // Fá - "was"
        { note: 4, time: 43200 }, // Sol - "my"
        { note: 5, time: 44000 }, // Lá - "de"
        { note: 1, time: 45200 }, // Ré - "light"
        
        // "Greensleeves was my heart of gold"
        { note: 4, time: 46800 }, // Sol - "Green"
        { note: 2, time: 48000 }, // Mi - "sleeves"
        { note: 3, time: 48800 }, // Fá - "was"
        { note: 4, time: 49600 }, // Sol - "my"
        { note: 5, time: 50400 }, // Lá - "heart"
        { note: 6, time: 51200 }, // Si - "of"
        { note: 0, time: 52000 }, // Dó - "gold"
        
        // "And who but my lady Greensleeves"
        { note: 6, time: 53600 }, // Si - "And"
        { note: 5, time: 54400 }, // Lá - "who"
        { note: 4, time: 55200 }, // Sol - "but"
        { note: 3, time: 56000 }, // Fá - "my"
        { note: 2, time: 56800 }, // Mi - "la"
        { note: 1, time: 57600 }, // Ré - "dy"
        { note: 0, time: 58400 }, // Dó - "Green"
        { note: 2, time: 59600 }, // Mi - "sleeves" (final)
      ];

      greenslevesMelody.forEach((noteData, index) => {
        if (noteData.note < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: noteData.note,
            color: lanes[noteData.note].color,
            frequency: lanes[noteData.note].frequency,
            startTime: noteData.time,
            duration: 500,
            y: -100,
            hasPlayed: false,
            isHit: false
          });
        }
      });
    } else if (songId === "scarborough-bell") {
      // Melodia completa e corrigida de "Scarborough Fair"
      const scarboroughFairMelody = [
        // Primeira frase: "Are you going to Scarborough Fair?"
        { note: 1, time: 0 },     // Ré - "Are"
        { note: 1, time: 800 },   // Ré - "you"
        { note: 5, time: 1600 },  // Lá - "go"
        { note: 5, time: 2400 },  // Lá - "ing"
        { note: 4, time: 3200 },  // Sol - "to"
        { note: 2, time: 4000 },  // Mi - "Scar"
        { note: 1, time: 4800 },  // Ré - "bo"
        { note: 0, time: 5600 },  // Dó - "rough"
        { note: 1, time: 6400 },  // Ré - "Fair?"
        
        // Segunda frase: "Parsley, sage, rosemary, and thyme"
        { note: 5, time: 8000 },  // Lá - "Pars"
        { note: 4, time: 8800 },  // Sol - "ley"
        { note: 2, time: 9600 },  // Mi - "sage"
        { note: 1, time: 10400 }, // Ré - "rose"
        { note: 4, time: 11200 }, // Sol - "ma"
        { note: 3, time: 12000 }, // Fá - "ry"
        { note: 2, time: 12800 }, // Mi - "and"
        { note: 1, time: 13600 }, // Ré - "thyme"
        
        // Terceira frase: "Remember me to one who lives there"
        { note: 1, time: 15200 }, // Ré - "Re"
        { note: 5, time: 16000 }, // Lá - "mem"
        { note: 5, time: 16800 }, // Lá - "ber"
        { note: 4, time: 17600 }, // Sol - "me"
        { note: 2, time: 18400 }, // Mi - "to"
        { note: 1, time: 19200 }, // Ré - "one"
        { note: 0, time: 20000 }, // Dó - "who"
        { note: 1, time: 20800 }, // Ré - "lives"
        { note: 2, time: 21600 }, // Mi - "there"
        
        // Quarta frase: "She once was a true love of mine"
        { note: 4, time: 23200 }, // Sol - "She"
        { note: 2, time: 24000 }, // Mi - "once"
        { note: 1, time: 24800 }, // Ré - "was"
        { note: 5, time: 25600 }, // Lá - "a"
        { note: 4, time: 26400 }, // Sol - "true"
        { note: 2, time: 27200 }, // Mi - "love"
        { note: 1, time: 28000 }, // Ré - "of"
        { note: 1, time: 28800 }, // Ré - "mine"
        
        // Segunda estrofe: "Tell her to make me a cambric shirt"
        { note: 1, time: 30400 }, // Ré - "Tell"
        { note: 1, time: 31200 }, // Ré - "her"
        { note: 5, time: 32000 }, // Lá - "to"
        { note: 5, time: 32800 }, // Lá - "make"
        { note: 4, time: 33600 }, // Sol - "me"
        { note: 2, time: 34400 }, // Mi - "a"
        { note: 1, time: 35200 }, // Ré - "cam"
        { note: 0, time: 36000 }, // Dó - "bric"
        { note: 1, time: 36800 }, // Ré - "shirt"
        
        // Refrão: "Parsley, sage, rosemary, and thyme"
        { note: 5, time: 38400 }, // Lá - "Pars"
        { note: 4, time: 39200 }, // Sol - "ley"
        { note: 2, time: 40000 }, // Mi - "sage"
        { note: 1, time: 40800 }, // Ré - "rose"
        { note: 4, time: 41600 }, // Sol - "ma"
        { note: 3, time: 42400 }, // Fá - "ry"
        { note: 2, time: 43200 }, // Mi - "and"
        { note: 1, time: 44000 }, // Ré - "thyme"
        
        // "Without no seams nor needle work"
        { note: 1, time: 45600 }, // Ré - "With"
        { note: 5, time: 46400 }, // Lá - "out"
        { note: 5, time: 47200 }, // Lá - "no"
        { note: 4, time: 48000 }, // Sol - "seams"
        { note: 2, time: 48800 }, // Mi - "nor"
        { note: 1, time: 49600 }, // Ré - "nee"
        { note: 0, time: 50400 }, // Dó - "dle"
        { note: 1, time: 51200 }, // Ré - "work"
        
        // "Then she'll be a true love of mine"
        { note: 4, time: 52800 }, // Sol - "Then"
        { note: 2, time: 53600 }, // Mi - "she'll"
        { note: 1, time: 54400 }, // Ré - "be"
        { note: 5, time: 55200 }, // Lá - "a"
        { note: 4, time: 56000 }, // Sol - "true"
        { note: 2, time: 56800 }, // Mi - "love"
        { note: 1, time: 57600 }, // Ré - "of"
        { note: 1, time: 58400 }, // Ré - "mine"
        
        // Final instrumental
        { note: 5, time: 60000 }, // Lá
        { note: 4, time: 60800 }, // Sol
        { note: 2, time: 61600 }, // Mi
        { note: 1, time: 62400 }, // Ré (final)
      ];

      scarboroughFairMelody.forEach((noteData, index) => {
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
    } else if (songId === "ode-joy-xylophone") {
      // Melodia completa e corrigida de "Ode à Alegria" (Beethoven)
      const odeToJoyMelody = [
        // Primeira frase: tema principal
        { note: 2, time: 0 },     // Mi - 
        { note: 2, time: 600 },   // Mi - 
        { note: 3, time: 1200 },  // Fá - 
        { note: 4, time: 1800 },  // Sol - 
        { note: 4, time: 2400 },  // Sol - 
        { note: 3, time: 3000 },  // Fá - 
        { note: 2, time: 3600 },  // Mi - 
        { note: 1, time: 4200 },  // Ré - 
        
        // Segunda frase
        { note: 0, time: 4800 },  // Dó - 
        { note: 0, time: 5400 },  // Dó - 
        { note: 1, time: 6000 },  // Ré - 
        { note: 2, time: 6600 },  // Mi - 
        { note: 2, time: 7200 },  // Mi - (sustentado)
        { note: 1, time: 7800 },  // Ré - 
        { note: 1, time: 8400 },  // Ré - (sustentado)
        
        // Repetição da primeira frase
        { note: 2, time: 9600 },  // Mi - 
        { note: 2, time: 10200 }, // Mi - 
        { note: 3, time: 10800 }, // Fá - 
        { note: 4, time: 11400 }, // Sol - 
        { note: 4, time: 12000 }, // Sol - 
        { note: 3, time: 12600 }, // Fá - 
        { note: 2, time: 13200 }, // Mi - 
        { note: 1, time: 13800 }, // Ré - 
        
        // Quarta frase (resolução)
        { note: 0, time: 14400 }, // Dó - 
        { note: 0, time: 15000 }, // Dó - 
        { note: 1, time: 15600 }, // Ré - 
        { note: 2, time: 16200 }, // Mi - 
        { note: 1, time: 16800 }, // Ré - (sustentado)
        { note: 0, time: 17400 }, // Dó - 
        { note: 0, time: 18000 }, // Dó - (sustentado)
        
        // Segunda seção - desenvolvimento
        { note: 1, time: 19200 }, // Ré - 
        { note: 1, time: 19800 }, // Ré - 
        { note: 2, time: 20400 }, // Mi - 
        { note: 0, time: 21000 }, // Dó - 
        { note: 1, time: 21600 }, // Ré - 
        { note: 2, time: 22200 }, // Mi - 
        { note: 3, time: 22800 }, // Fá - 
        { note: 2, time: 23400 }, // Mi - 
        
        // Continuação do desenvolvimento
        { note: 0, time: 24000 }, // Dó - 
        { note: 1, time: 24600 }, // Ré - 
        { note: 2, time: 25200 }, // Mi - 
        { note: 3, time: 25800 }, // Fá - 
        { note: 2, time: 26400 }, // Mi - 
        { note: 1, time: 27000 }, // Ré - 
        { note: 0, time: 27600 }, // Dó - 
        { note: 1, time: 28200 }, // Ré - 
        
        // Retorno ao tema principal (terceira vez)
        { note: 2, time: 28800 }, // Mi - 
        { note: 2, time: 29400 }, // Mi - 
        { note: 3, time: 30000 }, // Fá - 
        { note: 4, time: 30600 }, // Sol - 
        { note: 4, time: 31200 }, // Sol - 
        { note: 3, time: 31800 }, // Fá - 
        { note: 2, time: 32400 }, // Mi - 
        { note: 1, time: 33000 }, // Ré - 
        
        // Final grandioso
        { note: 0, time: 33600 }, // Dó - 
        { note: 0, time: 34200 }, // Dó - 
        { note: 1, time: 34800 }, // Ré - 
        { note: 2, time: 35400 }, // Mi - 
        { note: 1, time: 36000 }, // Ré - 
        { note: 0, time: 36600 }, // Dó - 
        { note: 0, time: 37200 }, // Dó - 
        
        // Coda (final extendido)
        { note: 2, time: 38400 }, // Mi - 
        { note: 3, time: 39000 }, // Fá - 
        { note: 4, time: 39600 }, // Sol - 
        { note: 2, time: 40200 }, // Mi - 
        { note: 0, time: 40800 }, // Dó - 
        { note: 4, time: 41400 }, // Sol - 
        { note: 2, time: 42000 }, // Mi - 
        { note: 0, time: 42600 }, // Dó (final majestoso)
      ];

      odeToJoyMelody.forEach((noteData, index) => {
        if (noteData.note < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: noteData.note,
            color: lanes[noteData.note].color,
            frequency: lanes[noteData.note].frequency,
            startTime: noteData.time,
            duration: 500,
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
