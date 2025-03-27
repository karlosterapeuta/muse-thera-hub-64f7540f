
import React from "react";
import { Button } from "@/components/ui/button";
import { Music2, Download, StopCircle, Volume2, VolumeX } from "lucide-react";
import { Song } from "../data/songs-data";

interface ControlButtonsProps {
  selectedSong: Song | null;
  isPlaying: boolean;
  isMuted: boolean;
  onPlay: () => void;
  onStop: () => void;
  onToggleMute: () => void;
  onDownloadPDF: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  selectedSong,
  isPlaying,
  isMuted,
  onPlay,
  onStop,
  onToggleMute,
  onDownloadPDF,
}) => {
  return (
    <div>
      <div className="flex space-x-2 mt-4">
        <Button
          onClick={onPlay}
          disabled={!selectedSong || isPlaying}
          className="flex-1"
        >
          <Music2 className="mr-2 h-4 w-4" />
          Tocar Música
        </Button>
        
        <Button
          onClick={onStop}
          disabled={!isPlaying}
          variant="destructive"
          className="flex-1"
        >
          <StopCircle className="mr-2 h-4 w-4" />
          Parar Música
        </Button>
      </div>
      
      <div className="flex space-x-2 mt-2">
        <Button
          onClick={onToggleMute}
          variant="outline"
          className="flex-1"
        >
          {isMuted ? (
            <>
              <VolumeX className="mr-2 h-4 w-4" />
              Ativar Som
            </>
          ) : (
            <>
              <Volume2 className="mr-2 h-4 w-4" />
              Silenciar
            </>
          )}
        </Button>
        
        <Button
          onClick={onDownloadPDF}
          disabled={!selectedSong}
          variant="outline"
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar PDF
        </Button>
      </div>
    </div>
  );
};

export default ControlButtons;
