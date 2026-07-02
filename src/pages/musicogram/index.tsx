import React from "react";
import TEAMusicogram from "./components/TEAMusicogram";
import { ResourceBackButton } from "@/components/ResourceBackButton";

const Musicogram: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-50">
        <ResourceBackButton />
      </div>
      <TEAMusicogram />
    </div>
  );
};

export default Musicogram;
