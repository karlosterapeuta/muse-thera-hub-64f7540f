
import React from "react";
import MusicogramWorkspace from "./components/MusicogramWorkspace";
import { therapyTemplates } from "./data/therapyTemplates";

const Musicogram: React.FC = () => {
  return (
    <MusicogramWorkspace 
      templates={therapyTemplates}
      patientId="demo-patient" // Em produção, isso viria do contexto/rota
    />
  );
};

export default Musicogram;
