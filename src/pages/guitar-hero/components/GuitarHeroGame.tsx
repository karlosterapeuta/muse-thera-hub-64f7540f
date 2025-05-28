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

    if (songId === "fur-elise-keyboard") {
      const furEliseMelody = [
        // Tema principal famoso - "ta ta ta ta ta..."
        { note: 2, time: 0 },     // Mi
        { note: 1, time: 400 },   // Ré#
        { note: 2, time: 800 },   // Mi
        { note: 1, time: 1200 },  // Ré#
        { note: 2, time: 1600 },  // Mi
        { note: 6, time: 2000 },  // Si
        { note: 1, time: 2400 },  // Ré
        { note: 0, time: 2800 },  // Dó
        
        // Continuação da primeira frase
        { note: 5, time: 3600 },  // Lá
        { note: 0, time: 4800 },  // Dó
        { note: 2, time: 5200 },  // Mi
        { note: 5, time: 5600 },  // Lá
        { note: 6, time: 6000 },  // Si
        
        // Repetição do tema
        { note: 2, time: 7200 },  // Mi
        { note: 4, time: 7600 },  // Sol#
        { note: 6, time: 8000 },  // Si
        { note: 0, time: 8400 },  // Dó
        
        // Segunda parte
        { note: 2, time: 9600 },  // Mi
        { note: 1, time: 10000 }, // Ré#
        { note: 2, time: 10400 }, // Mi
        { note: 1, time: 10800 }, // Ré#
        { note: 2, time: 11200 }, // Mi
        { note: 6, time: 11600 }, // Si
        { note: 1, time: 12000 }, // Ré
        { note: 0, time: 12400 }, // Dó
        
        // Final da melodia principal
        { note: 5, time: 13200 }, // Lá
        { note: 0, time: 14400 }, // Dó
        { note: 2, time: 14800 }, // Mi
        { note: 5, time: 15200 }, // Lá
        { note: 6, time: 15600 }, // Si
        { note: 0, time: 16800 }, // Dó
        { note: 1, time: 17200 }, // Ré
        { note: 4, time: 18400 }, // Sol
        { note: 3, time: 18800 }, // Fá
        { note: 2, time: 19200 }, // Mi
        { note: 1, time: 19600 }, // Ré
        { note: 0, time: 20000 }, // Dó
        { note: 5, time: 20400 }, // Lá (final)
      ];

      furEliseMelody.forEach((noteData) => {
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
    } else if (songId === "claire-de-lune-keyboard") {
      const claireDeLuneMelody = [
        // Início suave e contemplativo
        { note: 1, time: 0 },     // Ré
        { note: 3, time: 1000 },  // Fá
        { note: 5, time: 2000 },  // Lá
        { note: 4, time: 3000 },  // Sol
        { note: 3, time: 4000 },  // Fá
        { note: 2, time: 5000 },  // Mi
        { note: 1, time: 6000 },  // Ré
        { note: 0, time: 7000 },  // Dó
        
        // Desenvolvimento melódico
        { note: 2, time: 8000 },  // Mi
        { note: 4, time: 9000 },  // Sol
        { note: 6, time: 10000 }, // Si
        { note: 5, time: 11000 }, // Lá
        { note: 4, time: 12000 }, // Sol
        { note: 3, time: 13000 }, // Fá
        { note: 2, time: 14000 }, // Mi
        { note: 1, time: 15000 }, // Ré
        
        // Clímax suave
        { note: 0, time: 16000 }, // Dó
        { note: 2, time: 17000 }, // Mi
        { note: 4, time: 18000 }, // Sol
        { note: 6, time: 19000 }, // Si
        { note: 5, time: 20000 }, // Lá
        { note: 4, time: 21000 }, // Sol
        { note: 3, time: 22000 }, // Fá
        { note: 2, time: 23000 }, // Mi
        
        // Resolução tranquila
        { note: 1, time: 24000 }, // Ré
        { note: 0, time: 25000 }, // Dó
        { note: 2, time: 26000 }, // Mi
        { note: 4, time: 27000 }, // Sol
        { note: 3, time: 28000 }, // Fá
        { note: 2, time: 29000 }, // Mi
        { note: 1, time: 30000 }, // Ré
        { note: 0, time: 31000 }, // Dó (final)
      ];

      claireDeLuneMelody.forEach((noteData) => {
        if (noteData.note < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: noteData.note,
            color: lanes[noteData.note].color,
            frequency: lanes[noteData.note].frequency,
            startTime: noteData.time,
            duration: 900,
            y: -100,
            hasPlayed: false,
            isHit: false
          });
        }
      });
    } else if (songId === "invention-1-keyboard") {
      const invention1Melody = [
        // Tema principal de Bach - contraponto
        { note: 0, time: 0 },     // Dó
        { note: 1, time: 250 },   // Ré
        { note: 2, time: 500 },   // Mi
        { note: 3, time: 750 },   // Fá
        { note: 4, time: 1000 },  // Sol
        { note: 5, time: 1250 },  // Lá
        { note: 6, time: 1500 },  // Si
        { note: 0, time: 1750 },  // Dó
        
        // Inversão do tema
        { note: 4, time: 2000 },  // Sol
        { note: 5, time: 2250 },  // Lá
        { note: 6, time: 2500 },  // Si
        { note: 0, time: 2750 },  // Dó
        { note: 1, time: 3000 },  // Ré
        { note: 2, time: 3250 },  // Mi
        { note: 3, time: 3500 },  // Fá
        { note: 4, time: 3750 },  // Sol
        
        // Desenvolvimento polifônico
        { note: 2, time: 4000 },  // Mi
        { note: 3, time: 4250 },  // Fá
        { note: 4, time: 4500 },  // Sol
        { note: 5, time: 4750 },  // Lá
        { note: 6, time: 5000 },  // Si
        { note: 0, time: 5250 },  // Dó
        { note: 1, time: 5500 },  // Ré
        { note: 2, time: 5750 },  // Mi
        
        // Sequência descendente
        { note: 6, time: 6000 },  // Si
        { note: 5, time: 6250 },  // Lá
        { note: 4, time: 6500 },  // Sol
        { note: 3, time: 6750 },  // Fá
        { note: 2, time: 7000 },  // Mi
        { note: 1, time: 7250 },  // Ré
        { note: 0, time: 7500 },  // Dó
        
        // Episódio de desenvolvimento
        { note: 0, time: 8000 },  // Dó
        { note: 2, time: 8250 },  // Mi
        { note: 4, time: 8500 },  // Sol
        { note: 6, time: 8750 },  // Si
        { note: 1, time: 9000 },  // Ré
        { note: 3, time: 9250 },  // Fá
        { note: 5, time: 9500 },  // Lá
        { note: 0, time: 9750 },  // Dó
        
        // Final virtuosístico
        { note: 4, time: 10000 }, // Sol
        { note: 3, time: 10250 }, // Fá
        { note: 2, time: 10500 }, // Mi
        { note: 1, time: 10750 }, // Ré
        { note: 0, time: 11000 }, // Dó (final)
      ];

      invention1Melody.forEach((noteData) => {
        if (noteData.note < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: noteData.note,
            color: lanes[noteData.note].color,
            frequency: lanes[noteData.note].frequency,
            startTime: noteData.time,
            duration: 200,
            y: -100,
            hasPlayed: false,
            isHit: false
          });
        }
      });
    } else if (songId === "chopin-minute-keyboard") {
      const minuteWaltzMelody = [
        // Tema principal da Valsa do Minuto - rápido e elegante
        { note: 4, time: 0 },     // Sol
        { note: 5, time: 150 },   // Lá
        { note: 6, time: 300 },   // Si
        { note: 0, time: 450 },   // Dó
        { note: 1, time: 600 },   // Ré
        { note: 2, time: 750 },   // Mi
        { note: 3, time: 900 },   // Fá
        { note: 4, time: 1050 },  // Sol
        
        // Continuação virtuosística
        { note: 6, time: 1200 },  // Si
        { note: 5, time: 1350 },  // Lá
        { note: 4, time: 1500 },  // Sol
        { note: 3, time: 1650 },  // Fá
        { note: 2, time: 1800 },  // Mi
        { note: 1, time: 1950 },  // Ré
        { note: 0, time: 2100 },  // Dó
        { note: 6, time: 2250 },  // Si
        
        // Desenvolvimento brilhante
        { note: 5, time: 2400 },  // Lá
        { note: 4, time: 2550 },  // Sol
        { note: 3, time: 2700 },  // Fá
        { note: 2, time: 2850 },  // Mi
        { note: 1, time: 3000 },  // Ré
        { note: 0, time: 3150 },  // Dó
        { note: 4, time: 3300 },  // Sol
        { note: 5, time: 3450 },  // Lá
        
        // Sequência ascendente
        { note: 6, time: 3600 },  // Si
        { note: 0, time: 3750 },  // Dó
        { note: 1, time: 3900 },  // Ré
        { note: 2, time: 4050 },  // Mi
        { note: 3, time: 4200 },  // Fá
        { note: 4, time: 4350 },  // Sol
        { note: 5, time: 4500 },  // Lá
        { note: 6, time: 4650 },  // Si
        
        // Clímax velocíssimo
        { note: 0, time: 4800 },  // Dó
        { note: 1, time: 4950 },  // Ré
        { note: 2, time: 5100 },  // Mi
        { note: 3, time: 5250 },  // Fá
        { note: 4, time: 5400 },  // Sol
        { note: 5, time: 5550 },  // Lá
        { note: 6, time: 5700 },  // Si
        { note: 0, time: 5850 },  // Dó
        
        // Variação melódica
        { note: 1, time: 6000 },  // Ré
        { note: 2, time: 6150 },  // Mi
        { note: 3, time: 6300 },  // Fá
        { note: 4, time: 6450 },  // Sol
        { note: 5, time: 6600 },  // Lá
        { note: 6, time: 6750 },  // Si
        { note: 0, time: 6900 },  // Dó
        { note: 1, time: 7050 },  // Ré
        
        // Resolução elegante
        { note: 2, time: 7200 },  // Mi
        { note: 3, time: 7350 },  // Fá
        { note: 4, time: 7500 },  // Sol
        { note: 5, time: 7650 },  // Lá
        { note: 6, time: 7800 },  // Si
        { note: 0, time: 7950 },  // Dó
        { note: 4, time: 8100 },  // Sol (final)
      ];

      minuteWaltzMelody.forEach((noteData) => {
        if (noteData.note < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: noteData.note,
            color: lanes[noteData.note].color,
            frequency: lanes[noteData.note].frequency,
            startTime: noteData.time,
            duration: 120,
            y: -100,
            hasPlayed: false,
            isHit: false
          });
        }
      });
    } else if (songId === "asa-branca-bell") {
      const asaBrancaMelody = [
        // "Quando olhei a terra ardendo"
        { note: 4, time: 0 },     // Sol - "Quan"
        { note: 4, time: 600 },   // Sol - "do"
        { note: 4, time: 1200 },  // Sol - "o"
        { note: 3, time: 1800 },  // Fá - "lhei"
        { note: 2, time: 2400 },  // Mi - "a"
        { note: 3, time: 3000 },  // Fá - "ter"
        { note: 4, time: 3600 },  // Sol - "ra"
        { note: 5, time: 4200 },  // Lá - "ar"
        { note: 4, time: 4800 },  // Sol - "den"
        { note: 3, time: 5400 },  // Fá - "do"
        
        // "Qual fogueira de São João"
        { note: 2, time: 6600 },  // Mi - "Qual"
        { note: 3, time: 7200 },  // Fá - "fo"
        { note: 4, time: 7800 },  // Sol - "guei"
        { note: 4, time: 8400 },  // Sol - "ra"
        { note: 4, time: 9000 },  // Sol - "de"
        { note: 3, time: 9600 },  // Fá - "São"
        { note: 2, time: 10200 }, // Mi - "Jo"
        { note: 1, time: 10800 }, // Ré - "ão"
        { note: 0, time: 11400 }, // Dó
        
        // "Eu perguntei a Deus do céu"
        { note: 4, time: 12600 }, // Sol - "Eu"
        { note: 4, time: 13200 }, // Sol - "per"
        { note: 4, time: 13800 }, // Sol - "gun"
        { note: 3, time: 14400 }, // Fá - "tei"
        { note: 2, time: 15000 }, // Mi - "a"
        { note: 1, time: 15600 }, // Ré - "Deus"
        { note: 0, time: 16200 }, // Dó - "do"
        { note: 4, time: 16800 }, // Sol - "céu"
        
        // "Ai por que tamanha judiação"
        { note: 4, time: 18000 }, // Sol - "Ai"
        { note: 4, time: 18600 }, // Sol - "por"
        { note: 4, time: 19200 }, // Sol - "que"
        { note: 3, time: 19800 }, // Fá - "ta"
        { note: 2, time: 20400 }, // Mi - "ma"
        { note: 1, time: 21000 }, // Ré - "nha"
        { note: 0, time: 21600 }, // Dó - "ju"
        { note: 4, time: 22200 }, // Sol - "di"
        { note: 4, time: 22800 }, // Sol - "a"
        { note: 3, time: 23400 }, // Fá - "ção"
        
        // Refrão: "Até mesmo a asa branca"
        { note: 5, time: 24600 }, // Lá - "A"
        { note: 4, time: 25200 }, // Sol - "té"
        { note: 3, time: 25800 }, // Fá - "mes"
        { note: 2, time: 26400 }, // Mi - "mo"
        { note: 1, time: 27000 }, // Ré - "a"
        { note: 0, time: 27600 }, // Dó - "a"
        { note: 2, time: 28200 }, // Mi - "sa"
        { note: 3, time: 28800 }, // Fá - "bran"
        { note: 4, time: 29400 }, // Sol - "ca"
        
        // "Bateu asas do sertão"
        { note: 2, time: 30600 }, // Mi - "Ba"
        { note: 1, time: 31200 }, // Ré - "teu"
        { note: 0, time: 31800 }, // Dó - "a"
        { note: 1, time: 32400 }, // Ré - "sas"
        { note: 2, time: 33000 }, // Mi - "do"
        { note: 1, time: 33600 }, // Ré - "ser"
        { note: 0, time: 34200 }, // Dó - "tão"
      ];

      asaBrancaMelody.forEach((noteData) => {
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
    } else if (songId === "aquarela-xylophone") {
      const aquarelaMelody = [
        // "Numa folha qualquer eu desenho um sol amarelo"
        { note: 0, time: 0 },     // Dó - "Nu"
        { note: 2, time: 500 },   // Mi - "ma"
        { note: 4, time: 1000 },  // Sol - "fo"
        { note: 2, time: 1500 },  // Mi - "lha"
        { note: 3, time: 2000 },  // Fá - "qual"
        { note: 4, time: 2500 },  // Sol - "quer"
        { note: 5, time: 3000 },  // Lá - "eu"
        { note: 4, time: 3500 },  // Sol - "de"
        { note: 3, time: 4000 },  // Fá - "se"
        { note: 2, time: 4500 },  // Mi - "nho"
        { note: 1, time: 5000 },  // Ré - "um"
        { note: 2, time: 5500 },  // Mi - "sol"
        { note: 4, time: 6000 },  // Sol - "a"
        { note: 3, time: 6500 },  // Fá - "ma"
        { note: 2, time: 7000 },  // Mi - "re"
        { note: 0, time: 7500 },  // Dó - "lo"
        
        // "E com cinco ou seis retas é fácil fazer um castelo"
        { note: 2, time: 8500 },  // Mi - "E"
        { note: 4, time: 9000 },  // Sol - "com"
        { note: 5, time: 9500 },  // Lá - "cin"
        { note: 4, time: 10000 }, // Sol - "co"
        { note: 3, time: 10500 }, // Fá - "ou"
        { note: 4, time: 11000 }, // Sol - "seis"
        { note: 5, time: 11500 }, // Lá - "re"
        { note: 6, time: 12000 }, // Si - "tas"
        { note: 5, time: 12500 }, // Lá - "é"
        { note: 4, time: 13000 }, // Sol - "fá"
        { note: 3, time: 13500 }, // Fá - "cil"
        { note: 2, time: 14000 }, // Mi - "fa"
        { note: 1, time: 14500 }, // Ré - "zer"
        { note: 0, time: 15000 }, // Dó - "um"
        { note: 2, time: 15500 }, // Mi - "cas"
        { note: 1, time: 16000 }, // Ré - "te"
        { note: 0, time: 16500 }, // Dó - "lo"
        
        // "Corro o lápis em torno da mão e me dou uma luva"
        { note: 0, time: 18000 }, // Dó - "Cor"
        { note: 2, time: 18500 }, // Mi - "ro"
        { note: 4, time: 19000 }, // Sol - "o"
        { note: 3, time: 19500 }, // Fá - "lá"
        { note: 2, time: 20000 }, // Mi - "pis"
        { note: 4, time: 20500 }, // Sol - "em"
        { note: 5, time: 21000 }, // Lá - "tor"
        { note: 4, time: 21500 }, // Sol - "no"
        { note: 3, time: 22000 }, // Fá - "da"
        { note: 2, time: 22500 }, // Mi - "mão"
        { note: 1, time: 23000 }, // Ré - "e"
        { note: 2, time: 23500 }, // Mi - "me"
        { note: 4, time: 24000 }, // Sol - "dou"
        { note: 3, time: 24500 }, // Fá - "u"
        { note: 2, time: 25000 }, // Mi - "ma"
        { note: 1, time: 25500 }, // Ré - "lu"
        { note: 0, time: 26000 }, // Dó - "va"
        
        // "E se faço chover, com dois riscos tenho um guarda-chuva"
        { note: 2, time: 27500 }, // Mi - "E"
        { note: 4, time: 28000 }, // Sol - "se"
        { note: 6, time: 28500 }, // Si - "fa"
        { note: 5, time: 29000 }, // Lá - "ço"
        { note: 4, time: 29500 }, // Sol - "cho"
        { note: 3, time: 30000 }, // Fá - "ver"
        { note: 2, time: 30500 }, // Mi - "com"
        { note: 1, time: 31000 }, // Ré - "dois"
        { note: 0, time: 31500 }, // Dó - "ris"
        { note: 2, time: 32000 }, // Mi - "cos"
        { note: 4, time: 32500 }, // Sol - "te"
        { note: 3, time: 33000 }, // Fá - "nho"
        { note: 2, time: 33500 }, // Mi - "um"
        { note: 1, time: 34000 }, // Ré - "guar"
        { note: 0, time: 34500 }, // Dó - "da"
        { note: 2, time: 35000 }, // Mi - "chu"
        { note: 0, time: 35500 }, // Dó - "va"
      ];

      aquarelaMelody.forEach((noteData) => {
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
    } else if (songId === "ciranda-cirandinha-bell") {
      const cirandaMelody = [
        // "Ciranda, cirandinha, vamos todos cirandar"
        { note: 0, time: 0 },     // Dó - "Ci"
        { note: 2, time: 500 },   // Mi - "ran"
        { note: 4, time: 1000 },  // Sol - "da"
        { note: 0, time: 1500 },  // Dó - "ci"
        { note: 2, time: 2000 },  // Mi - "ran"
        { note: 4, time: 2500 },  // Sol - "di"
        { note: 4, time: 3000 },  // Sol - "nha"
        { note: 5, time: 3500 },  // Lá - "va"
        { note: 4, time: 4000 },  // Sol - "mos"
        { note: 3, time: 4500 },  // Fá - "to"
        { note: 2, time: 5000 },  // Mi - "dos"
        { note: 1, time: 5500 },  // Ré - "ci"
        { note: 2, time: 6000 },  // Mi - "ran"
        { note: 0, time: 6500 },  // Dó - "dar"
        
        // "Vamos dar a meia volta, volta e meia vamos dar"
        { note: 0, time: 7500 },  // Dó - "Va"
        { note: 2, time: 8000 },  // Mi - "mos"
        { note: 4, time: 8500 },  // Sol - "dar"
        { note: 5, time: 9000 },  // Lá - "a"
        { note: 4, time: 9500 },  // Sol - "mei"
        { note: 3, time: 10000 }, // Fá - "a"
        { note: 2, time: 10500 }, // Mi - "vol"
        { note: 1, time: 11000 }, // Ré - "ta"
        { note: 0, time: 11500 }, // Dó - "vol"
        { note: 4, time: 12000 }, // Sol - "ta"
        { note: 5, time: 12500 }, // Lá - "e"
        { note: 4, time: 13000 }, // Sol - "mei"
        { note: 3, time: 13500 }, // Fá - "a"
        { note: 2, time: 14000 }, // Mi - "va"
        { note: 1, time: 14500 }, // Ré - "mos"
        { note: 0, time: 15000 }, // Dó - "dar"
        
        // "O anel que tu me deste era vidro e se quebrou"
        { note: 2, time: 16500 }, // Mi - "O"
        { note: 4, time: 17000 }, // Sol - "a"
        { note: 6, time: 17500 }, // Si - "nel"
        { note: 5, time: 18000 }, // Lá - "que"
        { note: 4, time: 18500 }, // Sol - "tu"
        { note: 3, time: 19000 }, // Fá - "me"
        { note: 2, time: 19500 }, // Mi - "des"
        { note: 1, time: 20000 }, // Ré - "te"
        { note: 0, time: 20500 }, // Dó - "e"
        { note: 2, time: 21000 }, // Mi - "ra"
        { note: 4, time: 21500 }, // Sol - "vi"
        { note: 3, time: 22000 }, // Fá - "dro"
        { note: 2, time: 22500 }, // Mi - "e"
        { note: 1, time: 23000 }, // Ré - "se"
        { note: 0, time: 23500 }, // Dó - "que"
        { note: 2, time: 24000 }, // Mi - "brou"
        
        // "O amor que tu me tinhas era pouco e se acabou"
        { note: 0, time: 25500 }, // Dó - "O"
        { note: 2, time: 26000 }, // Mi - "a"
        { note: 4, time: 26500 }, // Sol - "mor"
        { note: 5, time: 27000 }, // Lá - "que"
        { note: 4, time: 27500 }, // Sol - "tu"
        { note: 3, time: 28000 }, // Fá - "me"
        { note: 2, time: 28500 }, // Mi - "ti"
        { note: 1, time: 29000 }, // Ré - "nhas"
        { note: 0, time: 29500 }, // Dó - "e"
        { note: 2, time: 30000 }, // Mi - "ra"
        { note: 4, time: 30500 }, // Sol - "pou"
        { note: 3, time: 31000 }, // Fá - "co"
        { note: 2, time: 31500 }, // Mi - "e"
        { note: 1, time: 32000 }, // Ré - "se"
        { note: 0, time: 32500 }, // Dó - "a"
        { note: 2, time: 33000 }, // Mi - "ca"
        { note: 0, time: 33500 }, // Dó - "bou"
      ];

      cirandaMelody.forEach((noteData) => {
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
