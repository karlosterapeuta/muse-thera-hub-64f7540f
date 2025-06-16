
import React from "react";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";

const BellHero = () => {
  const handleNotePlay = (frequency: number, color: string) => {
    // Usar o novo sistema de áudio real com fallback
    playNoteSound(`${frequency}Hz`, "bell");
    
    // Feedback visual adicional para sinos
    console.log(`🔔 Sino tocado: ${frequency}Hz (${color}) - real audio enabled`);
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
