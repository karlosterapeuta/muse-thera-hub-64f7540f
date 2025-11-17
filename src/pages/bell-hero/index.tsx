
import React from "react";
import { useTranslation } from "react-i18next";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";

const BellHero = () => {
  const { t } = useTranslation('games');
  
  const handleNotePlay = (frequency: number, color: string) => {
    // TEA-OPTIMIZED bell audio with real samples + enhanced synthesis fallback
    playNoteSound(`${frequency}Hz`, "bell");
    
    // Enhanced feedback for TEA
    console.log(`🔔 TEA-OPTIMIZED Bell: ${frequency}Hz (${color}) - amplified for ASD`);
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
