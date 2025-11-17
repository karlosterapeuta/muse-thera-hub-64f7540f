
import React from "react";
import { useTranslation } from "react-i18next";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";

const XylophoneHero = () => {
  const { t } = useTranslation('games');
  
  const handleNotePlay = (frequency: number, color: string) => {
    // TEA-OPTIMIZED xylophone audio with real samples + enhanced synthesis fallback
    playNoteSound(`${frequency}Hz`, "xylophone");
    
    // Enhanced feedback for TEA
    console.log(`🎵 TEA-OPTIMIZED Xylophone: ${frequency}Hz (${color}) - amplified for ASD`);
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
