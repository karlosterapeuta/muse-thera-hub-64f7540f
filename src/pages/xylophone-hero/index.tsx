
import React from "react";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";

const XylophoneHero = () => {
  const handleNotePlay = (frequency: number, color: string) => {
    // TEA-OPTIMIZED xylophone audio with real samples + enhanced synthesis fallback
    playNoteSound(`${frequency}Hz`, "xylophone");
    
    // Enhanced feedback for TEA
    console.log(`🎵 TEA-OPTIMIZED Xilofone: ${frequency}Hz (${color}) - amplificado para TEA`);
  };

  return (
    <div className="h-screen flex flex-col">
      <GuitarHeroGame 
        instrumentType="xylophone" 
        onNotePlay={handleNotePlay}
      />
    </div>
  );
};

export default XylophoneHero;
