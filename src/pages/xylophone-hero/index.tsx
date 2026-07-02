import React from "react";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";
import { ResourceBackButton } from "@/components/ResourceBackButton";

const XylophoneHero = () => {
  const handleNotePlay = (frequency: number, color: string) => {
    playNoteSound(`${frequency}Hz`, "xylophone");
    console.log(`🎵 TEA-OPTIMIZED Xilofone: ${frequency}Hz (${color}) - amplificado para TEA`);
  };

  return (
    <div className="h-screen flex flex-col relative">
      <div className="absolute top-4 left-4 z-50">
        <ResourceBackButton />
      </div>
      <GuitarHeroGame 
        instrumentType="xylophone" 
        onNotePlay={handleNotePlay}
      />
    </div>
  );
};

export default XylophoneHero;
