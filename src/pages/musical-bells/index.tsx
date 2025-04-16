import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2, Download, FileText, Volume2, VolumeX, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SongPDF } from "@/components/SongPDF";
import html2pdf from "html2pdf.js";
import { playNoteSound, stopAllAudio } from "@/utils/audioUtils";

const notes = [
  { note: "C↓", label: "Dó↓", color: "#FF0000", colorName: "VERMELHO" },    // Red - Low Dó
  { note: "D", label: "Ré", color: "#FF9933", colorName: "LARANJA" },      // Orange
  { note: "E", label: "Mi", color: "#FFFF00", colorName: "AMARELO" },      // Yellow
  { note: "F", label: "Fá", color: "#33CC33", colorName: "VERDE" },        // Green
  { note: "G", label: "Sol", color: "#33CCFF", colorName: "AZUL CLARO" },  // Light Blue
  { note: "A", label: "Lá", color: "#0000FF", colorName: "AZUL" },         // Blue
  { note: "B", label: "Si", color: "#9933CC", colorName: "ROXO" },         // Purple
  { note: "C↑", label: "Dó↑", color: "#FF0000", colorName: "VERMELHO" },   // Red - High Dó
];

const songs = [
  {
    title: "Brilha, Brilha Estrelinha",
    notes: ["C↓", "C↓", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C↓", "G", "G", "F", "F", "E", "E", "D", "G", "G", "F", "F", "E", "E", "D", "C↓", "C↓", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C↓"],
    lyrics: ["Bri", "lha", "bri", "lha", "es", "tre", "li", "nha", "quero", "ver", "você", "bri", "lhar", "lá", "no", "céu", "tão", "al", "ti", "nho", "faz", "pa", "re", "cer", "um", "dia", "man", "ti", "nho", "bri", "lha", "bri", "lha", "es", "tre", "li", "nha", "quero", "ver", "você", "bri", "lhar"],
    description: "Uma canção infantil clássica, também conhecida como 'Twinkle Twinkle Little Star', com todas as estrofes completas."
  },
  {
    title: "Ciranda, Cirandinha",
    notes: ["C↓", "D", "E", "F", "G", "G", "A", "G", "F", "E", "D", "C↓"],
    lyrics: ["Ci", "ran", "da", "ci", "ran", "di", "nha", "va", "mos", "to", "dos", "já"],
    description: "Uma das cantigas de roda mais populares do Brasil."
  },
  {
    title: "O Sapo Não Lava o Pé",
    notes: ["C↓", "G", "E", "A", "F", "D", "G", "C↓"],
    lyrics: ["O", "sa", "po", "não", "la", "va", "o", "pé"],
    description: "Uma divertida cantiga infantil brasileira."
  },
  {
    title: "Marcha Soldado",
    notes: ["C↓", "C↓", "G", "G", "E", "E", "C↓"],
    lyrics: ["Mar", "cha", "sol", "da", "di", "nho"],
    description: "Uma tradicional cantiga de marcha infantil."
  },
  {
    title: "Atirei o Pau no Gato",
    notes: ["C↓", "D", "E", "F", "G", "G", "A", "G", "F", "E", "D", "C↓"],
    lyrics: ["A", "ti", "rei", "o", "pau", "no", "ga", "to", "to", "mas", "o", "ga"],
    description: "Uma cantiga de roda tradicional brasileira."
  },
  {
    title: "Parabéns a Você",
    notes: ["C↓", "C↓", "D", "C↓", "F", "E", "C↓", "C↓", "D", "C↓", "G", "F", "C↓", "C↓", "C↑", "A", "F", "E", "D", "C↓", "D", "E", "F", "F", "E", "D", "C↓"],
    lyrics: ["Pa", "ra", "béns", "a", "vo", "cê", "nes", "ta", "da", "ta", "que", "ri", "da", "mui", "tas", "fe", "li", "ci", "da", "des", "mui", "tos", "a", "nos", "de", "vi", "da"],
    description: "A tradicional canção de aniversário brasileira, com letra e melodia completas."
  },
  {
    title: "Dó-Ré-Mi",
    notes: ["C↓", "D", "E", "F", "G", "A", "B", "C↑", "C↓", "D", "E", "F", "G", "A", "B", "C↑"],
    lyrics: ["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si", "Dó", "es", "ca", "la", "mu", "si", "cal", "com", "ple", "ta"],
    description: "A famosa escala musical completa, ascendente e descendente."
  },
  {
    title: "Ode à Alegria",
    notes: [
      "E", "E", "F", "G", "G", "F", "E", "D", 
      "C↓", "C↓", "D", "E", "E", "D", "D",
      "E", "E", "F", "G", "G", "F", "E", "D", 
      "C↓", "C↓", "D", "E", "D", "C↓", "C↓",
      "D", "D", "E", "C↓", "D", "E", "F", "E", "C↓",
      "D", "E", "F", "E", "D", "C↓", "D", "G",
      "E", "E", "F", "G", "G", "F", "E", "D",
      "C↓", "C↓", "D", "E", "D", "C↓", "C↓"
    ],
    lyrics: [
      "A", "le", "gri", "a", "be", "la", 
      "cen", "te", "lha", "di", "vi", "na", 
      "fi", "lha", "do", "E", "lí", "sio", 
      "e", "bri", "os", "pe", "ne", "tra", "mos", 
      "no", "teu", "san", "tu", "á", "rio", 
      "ce", "les", "te", "tua", "ma", "gi", "a", 
      "vol", "ta", "a", "u", "nir", "o", "que", 
      "a", "mo", "da", "se", "pa", "rou"
    ],
    description: "Tema principal do 4º movimento da Nona Sinfonia de Beethoven, 'Ode à Alegria', com notas e letra em português."
  },
  {
    title: "Escala Cromática",
    notes: ["C↓", "D", "E", "F", "G", "A", "B", "C↑", "B", "A", "G", "F", "E", "D", "C↓"],
    lyrics: ["Su", "bin", "do", "a", "es", "ca", "la", "mú", "si", "cal", "des", "cen", "do", "a", "gora"],
    description: "Uma escala que percorre todas as notas em sequência, subindo e descendo."
  },
  {
    title: "Caranguejo",
    notes: ["C↓", "D", "E", "F", "G", "A", "G", "F", "E", "D", "C↓"],
    lyrics: ["Ca", "ran", "gue", "jo", "não", "é", "pei", "xe", "xe", "xe"],
    description: "Uma divertida cantiga de roda sobre um caranguejo."
  },
  {
    title: "A Barata Diz Que Tem",
    notes: ["C↓", "D", "E", "F", "G", "G", "F", "E", "D", "C↓"],
    lyrics: ["A", "ba", "ra", "ta", "diz", "que", "tem", "se", "te", "saias"],
    description: "Uma cantiga infantil brasileira sobre uma barata mentirosa."
  },
  {
    title: "O Cravo e a Rosa",
    notes: ["C↓", "D", "E", "F", "G", "A", "G", "F", "E", "D", "C↓"],
    lyrics: ["O", "cra", "vo", "bri", "gou", "com", "a", "ro", "sa"],
    description: "Uma linda cantiga de roda sobre o amor entre um cravo e uma rosa."
  }
];

const MusicalBells: React.FC = () => {
  const [selectedSong, setSelectedSong] = useState(songs[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const playTimeout = useRef<NodeJS.Timeout | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  useEffect(() => {
    setCurrentNoteIndex(-1);
    stopPlayback();
  }, [selectedSong]);

  const stopPlayback = () => {
    if (playTimeout.current) {
      clearTimeout(playTimeout.current);
      playTimeout.current = null;
    }
    setIsPlaying(false);
    setCurrentNoteIndex(-1);
    stopAllAudio();
  };

  const playNote = (noteIndex: number) => {
    if (noteIndex >= selectedSong.notes.length) {
      setIsPlaying(false);
      setCurrentNoteIndex(-1);
      return;
    }
    
    setCurrentNoteIndex(noteIndex);
    
    if (!isMuted) {
      const noteKey = selectedSong.notes[noteIndex];
      playNoteSound(noteKey);
    }
    
    playTimeout.current = setTimeout(() => {
      playNote(noteIndex + 1);
    }, 800);
  };

  const handlePlaySong = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      setIsPlaying(true);
      playNote(0);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopAllAudio();
    }
  };

  const handleClickNote = (noteKey: string) => {
    if (!isMuted) {
      playNoteSound(noteKey);
    }
  };

  const generatePDF = () => {
    if (!pdfRef.current) return;
    
    const element = pdfRef.current;
    const opt = {
      margin: 10,
      filename: `${selectedSong.title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    toast({
      title: "Gerando PDF",
      description: "Aguarde enquanto criamos o PDF para download...",
    });

    setTimeout(() => {
      html2pdf().set(opt).from(element).save().then(() => {
        toast({
          title: "Download concluído",
          description: "O PDF foi gerado com sucesso!",
        });
      });
    }, 500);
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Sinos Musicais</CardTitle>
                <CardDescription>
                  Explore e toque músicas com sinos coloridos
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={toggleMute}>
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </Button>
                <Button variant="outline" size="icon" onClick={generatePDF}>
                  <Download size={18} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Seleção de Música</h3>
                  <select 
                    className="w-full p-2 border rounded"
                    value={selectedSong.title}
                    onChange={(e) => {
                      const song = songs.find(s => s.title === e.target.value);
                      if (song) setSelectedSong(song);
                    }}
                  >
                    {songs.map((song) => (
                      <option key={song.title} value={song.title}>
                        {song.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Controles</h3>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handlePlaySong}
                      className="flex items-center space-x-1"
                    >
                      {isPlaying ? <StopCircle size={18} /> : <Music2 size={18} />}
                      <span>{isPlaying ? "Parar" : "Tocar"} Música</span>
                    </Button>
                    <Button variant="outline" onClick={generatePDF} className="flex items-center space-x-1">
                      <FileText size={18} />
                      <span>Gerar Partitura</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Sinos Musicais</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {notes.map((note) => (
                    <div 
                      key={note.note}
                      onClick={() => handleClickNote(note.note)}
                      className="relative flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <div
                        style={{ backgroundColor: note.color, borderColor: note.color === "#FFFFFF" ? "#DDD" : note.color }}
                        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-md ${
                          note.color === "#FFFFFF" ? "text-black" : "text-white"
                        }`}
                      >
                        <span className="font-bold">{note.note}</span>
                      </div>
                      <span className="mt-1 text-xs font-medium">{note.label}</span>
                      <span className="text-[10px] text-gray-500">{note.colorName}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Partitura Visual: {selectedSong.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{selectedSong.description}</p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  {selectedSong.notes.map((noteKey, index) => {
                    const noteData = notes.find(n => n.note === noteKey);
                    const isCurrentNote = index === currentNoteIndex;
                    
                    return (
                      <div 
                        key={`${noteKey}-${index}`}
                        className={`flex flex-col items-center mb-2 transition-transform ${
                          isCurrentNote ? "scale-110" : ""
                        }`}
                      >
                        <div
                          style={{ 
                            backgroundColor: noteData?.color, 
                            borderColor: noteData?.color === "#FFFFFF" ? "#DDD" : noteData?.color,
                            boxShadow: isCurrentNote ? "0 0 10px 3px rgba(66, 153, 225, 0.6)" : "none"
                          }}
                          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                            noteData?.color === "#FFFFFF" ? "text-black" : "text-white"
                          }`}
                          onClick={() => handleClickNote(noteKey)}
                        >
                          <span className="font-medium text-sm">{noteKey}</span>
                        </div>
                        {selectedSong.lyrics && selectedSong.lyrics[index] && (
                          <span className="mt-1 text-xs">{selectedSong.lyrics[index]}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="hidden">
        <div ref={pdfRef}>
          <SongPDF song={selectedSong} notes={notes} />
        </div>
      </div>
    </div>
  );
};

export default MusicalBells;
