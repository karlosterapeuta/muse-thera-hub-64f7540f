import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2, Download, FileText, Volume2, VolumeX, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SongPDF } from "@/components/SongPDF";
import html2pdf from "html2pdf.js";
import { playNoteSound, stopAllAudio } from "@/utils/audioUtils";

const notes = [
  { note: "C1", color: "#EA384C", colorName: "VERMELHO" },
  { note: "D", color: "#F97316", colorName: "LARANJA" },
  { note: "E", color: "#FEF08A", colorName: "AMARELA" },
  { note: "F", color: "#4ADE80", colorName: "VERDE" },
  { note: "G", color: "#33C3F0", colorName: "AZUL CLARO" },
  { note: "A", color: "#9B87F5", colorName: "AZUL ESCURO" },
  { note: "B", color: "#9B87F5", colorName: "ROXO" },
  { note: "C8", color: "#FFFFFF", colorName: "BRANCO" },
];

const songs = [
  // ... keep existing song data
];

export default function MusicalBells() {
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null);
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState<number | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const playNote = (note: string) => {
    const noteIndex = notes.findIndex(n => n.note === note);
    if (noteIndex >= 0) {
      setCurrentNoteIndex(noteIndex);
      
      if (audioEnabled) {
        playNoteSound(note);
      }
      
      setTimeout(() => setCurrentNoteIndex(null), 500);
    }
  };

  const playSong = (songIndex: number) => {
    if (isPlaying) {
      toast({
        title: "Uma música já está tocando",
        description: "Aguarde a música terminar antes de iniciar outra.",
        variant: "destructive",
      });
      return;
    }

    setCurrentSong(songIndex);
    setIsPlaying(true);
    
    const songNotes = songs[songIndex].notes;
    let noteIndex = 0;

    const playNextNote = () => {
      if (noteIndex < songNotes.length) {
        playNote(songNotes[noteIndex]);
        noteIndex++;
        setTimeout(playNextNote, 800);
      } else {
        setCurrentSong(null);
        setIsPlaying(false);
        
        toast({
          title: "Música concluída",
          description: `A música "${songs[songIndex].title}" foi reproduzida com sucesso.`,
        });
      }
    };

    playNextNote();
  };

  const stopCurrentSong = () => {
    if (isPlaying) {
      stopAllAudio();
      setCurrentSong(null);
      setIsPlaying(false);
      
      toast({
        title: "Música interrompida",
        description: "A reprodução da música foi interrompida.",
      });
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    toast({
      title: audioEnabled ? "Áudio desativado" : "Áudio ativado",
      description: audioEnabled 
        ? "O som das notas foi desativado." 
        : "Agora você ouvirá o som das notas musicais.",
    });
    
    if (audioEnabled) {
      stopAllAudio();
    }
  };

  const downloadSongPDF = (songIndex: number) => {
    setSelectedSong(songIndex);
    
    setTimeout(() => {
      const pdfContent = document.getElementById('song-pdf-content');
      
      if (pdfContent) {
        const options = {
          margin: [10, 10, 10, 10],
          filename: `${songs[songIndex].title}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(pdfContent).set(options).save();
        
        toast({
          title: "PDF gerado com sucesso",
          description: `O arquivo ${songs[songIndex].title}.pdf foi baixado.`,
        });
      }
      
      setSelectedSong(null);
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-primary">
        Sinos Musicais
      </h1>
      
      <div className="flex justify-end mb-4 gap-2">
        {isPlaying && (
          <Button
            variant="destructive"
            size="sm"
            onClick={stopCurrentSong}
            className="flex items-center gap-2"
          >
            <Square className="h-4 w-4" />
            Parar Música
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAudio}
          className="flex items-center gap-2"
        >
          {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {audioEnabled ? "Desativar Som" : "Ativar Som"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="h-6 w-6 text-primary" />
              Notas Musicais
            </CardTitle>
            <CardDescription>
              Clique nas notas para ouvir o som de cada sino musical
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {notes.map((note, index) => (
                <Button
                  key={note.note}
                  onClick={() => playNote(note.note)}
                  className={`transition-all h-16 w-16 rounded-full text-white font-bold ${
                    currentNoteIndex === index ? "scale-110 ring-4 ring-white" : ""
                  }`}
                  style={{ 
                    backgroundColor: note.color,
                    boxShadow: `0 0 ${currentNoteIndex === index ? '20px' : '10px'} rgba(0,0,0,0.3)`,
                    color: ["C8", "E"].includes(note.note) ? "#333" : "white"
                  }}
                >
                  {note.note}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-sm border border-gray-200 rounded-lg p-3 bg-gray-50">
              {notes.map((note) => (
                <div key={note.note} className="flex flex-col items-center">
                  <div
                    className="w-4 h-4 rounded-full mb-1"
                    style={{ backgroundColor: note.color }}
                  ></div>
                  <span className="font-semibold">{note.note}</span>
                  <span className="text-xs text-gray-600">{note.colorName}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="h-6 w-6 text-primary" />
              Músicas Simples
            </CardTitle>
            <CardDescription>
              Selecione uma música para tocar nos sinos musicais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                {songs.map((song, index) => (
                  <Card 
                    key={song.title}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${currentSong === index ? "border-primary bg-primary/10" : "border-gray-200"}`}
                  >
                    <div className="font-semibold text-lg mb-2">{song.title}</div>
                    <p className="text-sm text-gray-600 mb-3">{song.description}</p>
                    
                    <div className="mb-4 flex flex-wrap">
                      {song.notes.map((note, noteIndex) => {
                        const noteData = notes.find(n => n.note === note);
                        return (
                          <div key={`${note}-${noteIndex}`} className="inline-block text-center mr-2 mb-2">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mx-auto"
                              style={{ 
                                backgroundColor: noteData?.color,
                                color: ["C8", "E"].includes(note) ? "#333" : "white"
                              }}
                            >
                              {note}
                            </div>
                            <div className="text-xs mt-1 font-medium">
                              {song.lyrics[noteIndex] || ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadSongPDF(index);
                        }}
                      >
                        <FileText className="mr-1 h-4 w-4" />
                        PDF
                      </Button>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          playSong(index);
                        }}
                        disabled={isPlaying}
                      >
                        <Music2 className="mr-1 h-4 w-4" />
                        Tocar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden">
        {selectedSong !== null && (
          <div id="song-pdf-content">
            <SongPDF 
              song={songs[selectedSong]} 
              notes={notes} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
