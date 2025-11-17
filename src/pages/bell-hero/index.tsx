
import React from "react";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";

const BellHero = () => {
  const handleNotePlay = (frequency: number, color: string) => {
    // TEA-OPTIMIZED bell audio with real samples + enhanced synthesis fallback
    playNoteSound(`${frequency}Hz`, "bell");
    
    // Enhanced feedback for TEA
    console.log(`🔔 TEA-OPTIMIZED Sino: ${frequency}Hz (${color}) - amplificado para TEA`);
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
