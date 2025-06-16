
import React from "react";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";

const BellHero = () => {
  const handleNotePlay = (frequency: number, color: string) => {
    // Simular som de sino com uma frequência específica
    playNoteSound(`${frequency}Hz`);
    
    // Feedback visual adicional para sinos
    console.log(`🔔 Sino tocado: ${frequency}Hz (${color})`);
  };

  // Música padrão para Bell Hero
  const defaultSong = {
    id: "twinkle-bell",
    title: "Brilha, Brilha Estrelinha",
    artist: "Clássico Infantil",
    difficulty: "Fácil" as const,
    instrument: "bell" as const,
    color: "bg-red-100 border-red-200",
    category: "infantil" as const,
    therapeuticBenefits: "Estimula coordenação básica e reconhecimento de padrões simples",
    hasSequence: true
  };

  return (
    <div className="h-screen flex flex-col">
      <GuitarHeroGame 
        instrumentType="bell" 
        onNotePlay={handleNotePlay}
        selectedSong={defaultSong}
      />
    </div>
  );
};

export default BellHero;
