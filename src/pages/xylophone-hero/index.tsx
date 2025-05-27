
import React from "react";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";

const XylophoneHero = () => {
  const handleNotePlay = (frequency: number, color: string) => {
    // Simular som de xilofone com uma frequência específica
    playNoteSound(`${frequency}Hz`);
    
    // Feedback visual adicional para xilofone
    console.log(`🎵 Xilofone tocado: ${frequency}Hz (${color})`);
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
