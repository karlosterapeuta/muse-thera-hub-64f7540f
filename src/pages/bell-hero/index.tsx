
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

  return (
    <div className="h-screen flex flex-col">
      <GuitarHeroGame 
        instrumentType="bell" 
        onNotePlay={handleNotePlay}
      />
    </div>
  );
};

export default BellHero;
