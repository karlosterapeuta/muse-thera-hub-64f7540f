
import React from "react";
import GuitarHeroGame from "../guitar-hero/components/GuitarHeroGame";
import { playNoteSound } from "@/utils/audioUtils";

const XylophoneHero = () => {
  const handleNotePlay = (frequency: number, color: string) => {
    // Usar o novo sistema de áudio real com fallback
    playNoteSound(`${frequency}Hz`, "xylophone");
    
    // Feedback visual adicional para xilofone
    console.log(`🎵 Xilofone tocado: ${frequency}Hz (${color}) - real audio enabled`);
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
