
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

  // Música padrão para Xylophone Hero
  const defaultSong = {
    id: "happy-birthday-xylophone",
    title: "Parabéns para Você",
    artist: "Tradicional",
    difficulty: "Fácil" as const,
    instrument: "xylophone" as const,
    color: "bg-blue-100 border-blue-200",
    category: "infantil" as const,
    therapeuticBenefits: "Conecta música com eventos sociais importantes",
    hasSequence: true
  };

  return (
    <div className="h-screen flex flex-col">
      <GuitarHeroGame 
        instrumentType="xylophone" 
        onNotePlay={handleNotePlay}
        selectedSong={defaultSong}
      />
    </div>
  );
};

export default XylophoneHero;
