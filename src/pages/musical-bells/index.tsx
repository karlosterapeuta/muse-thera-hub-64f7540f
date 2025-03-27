
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SongPDF } from "@/components/SongPDF";
import html2pdf from "html2pdf.js";
import { playNoteSound, stopAllAudio } from "@/utils/audioUtils";
import { notes } from "./data/notes-data";
import { songs, Song } from "./data/songs-data";
import SongList from "./components/SongList";
import ControlButtons from "./components/ControlButtons";
import SongDisplay from "./components/SongDisplay";

// Musical Bells Component
export default function MusicalBells() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState(-1);
  const { toast } = useToast();
  const pdfRef = useRef<HTMLDivElement>(null);
  const playbackRef = useRef<NodeJS.Timeout | null>(null);

  // Play selected song
  const playSong = () => {
    if (!selectedSong || isPlaying) return;
    
    setIsPlaying(true);
    setActiveNoteIndex(-1);
    
    // Clear any existing timeout
    if (playbackRef.current) {
      clearTimeout(playbackRef.current);
    }
    
    const playNotes = (index = 0) => {
      if (index < selectedSong.notes.length) {
        setActiveNoteIndex(index);
        
        if (!isMuted) {
          playNoteSound(selectedSong.notes[index]);
        }
        
        // Store the timeout reference
        playbackRef.current = setTimeout(() => {
          playNotes(index + 1);
        }, 700);
      } else {
        setIsPlaying(false);
        setActiveNoteIndex(-1);
      }
    };
    
    playNotes();
  };

  // Stop playback
  const stopPlayback = () => {
    if (playbackRef.current) {
      clearTimeout(playbackRef.current);
      playbackRef.current = null;
    }
    stopAllAudio();
    setIsPlaying(false);
    setActiveNoteIndex(-1);
    
    toast({
      title: "Reprodução interrompida",
      description: "A música foi parada."
    });
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopAllAudio();
    }
  };

  // Download PDF
  const downloadPDF = () => {
    if (!selectedSong || !pdfRef.current) return;
    
    const filename = `${selectedSong.title.replace(/\s+/g, '_')}.pdf`;
    const element = pdfRef.current;
    
    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
    
    toast({
      title: "PDF Gerado",
      description: `${filename} baixado com sucesso.`
    });
  };

  // Handle song selection
  const handleSelectSong = (song: Song) => {
    if (isPlaying) stopPlayback();
    setSelectedSong(song);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (playbackRef.current) {
        clearTimeout(playbackRef.current);
      }
      stopAllAudio();
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music2 className="mr-2" />
            Sinos Musicais
          </CardTitle>
          <CardDescription>
            Selecione uma música e visualize a combinação de notas coloridas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-3">Selecione uma música</h3>
              <SongList 
                songs={songs}
                selectedSong={selectedSong}
                isPlaying={isPlaying}
                onSelectSong={handleSelectSong}
              />
              
              <ControlButtons 
                selectedSong={selectedSong}
                isPlaying={isPlaying}
                isMuted={isMuted}
                onPlay={playSong}
                onStop={stopPlayback}
                onToggleMute={toggleMute}
                onDownloadPDF={downloadPDF}
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <SongDisplay 
                selectedSong={selectedSong}
                notes={notes}
                activeNoteIndex={activeNoteIndex}
              />
              
              <div className="hidden">
                <div ref={pdfRef}>
                  {selectedSong && <SongPDF song={selectedSong} notes={notes} />}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
