
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the notes and their corresponding colors
const notes = [
  { note: "C1", color: "#EA384C", colorName: "VERMELHO" },   // Red
  { note: "D", color: "#F97316", colorName: "LARANJA" },     // Orange
  { note: "E", color: "#FEF08A", colorName: "AMARELA" },     // Yellow
  { note: "F", color: "#4ADE80", colorName: "VERDE" },       // Green
  { note: "G", color: "#33C3F0", colorName: "AZUL CLARO" },  // Light Blue
  { note: "A", color: "#1E40AF", colorName: "AZUL ESCURO" }, // Dark Blue
  { note: "B", color: "#9B87F5", colorName: "ROXO" },        // Purple
  { note: "C8", color: "#FFFFFF", colorName: "BRANCO" },     // White
];

// Define simple songs with the notes
const songs = [
  {
    title: "Brilha, Brilha Estrelinha",
    notes: ["C1", "C1", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C1"],
    description: "Uma canção infantil clássica, também conhecida como 'Twinkle Twinkle Little Star'."
  },
  {
    title: "Parabéns a Você",
    notes: ["C1", "C1", "D", "C1", "F", "E", "C1", "C1", "D", "C1", "G", "F"],
    description: "A canção tradicional de aniversário."
  },
  {
    title: "Dó-Ré-Mi",
    notes: ["C1", "D", "E", "F", "G", "A", "B", "C8"],
    description: "A famosa escala musical simples."
  },
  {
    title: "Ode à Alegria",
    notes: ["E", "E", "F", "G", "G", "F", "E", "D", "C1", "C1", "D", "E", "E", "D", "D"],
    description: "Melodia principal da Nona Sinfonia de Beethoven."
  },
  {
    title: "Escala Cromática",
    notes: ["C1", "D", "E", "F", "G", "A", "B", "C8", "B", "A", "G", "F", "E", "D", "C1"],
    description: "Uma escala que percorre todas as notas em sequência, subindo e descendo."
  },
  // 20 novas músicas simples
  {
    title: "Ciranda, Cirandinha",
    notes: ["C1", "D", "E", "C1", "D", "E", "C1", "E", "D", "C1"],
    description: "Canção folclórica brasileira muito popular entre crianças."
  },
  {
    title: "Marcha Soldado",
    notes: ["E", "E", "E", "G", "C1", "C1", "G", "G", "E", "E", "C1"],
    description: "Canção infantil brasileira tradicional."
  },
  {
    title: "O Sapo Não Lava o Pé",
    notes: ["G", "A", "G", "F", "E", "F", "G", "G", "A", "G", "F", "E", "F", "G"],
    description: "Canção infantil brasileira divertida e educativa."
  },
  {
    title: "Frère Jacques",
    notes: ["C1", "D", "E", "C1", "C1", "D", "E", "C1", "E", "F", "G", "E", "F", "G"],
    description: "Canção de origem francesa conhecida em todo o mundo."
  },
  {
    title: "Escravos de Jó",
    notes: ["G", "G", "G", "E", "G", "G", "G", "E", "G", "E", "C1", "C1", "A", "A", "G"],
    description: "Música folclórica brasileira usada em jogos infantis."
  },
  {
    title: "Cai, Cai, Balão",
    notes: ["G", "E", "G", "E", "C1", "G", "F", "E", "D", "C1"],
    description: "Canção tradicional das festas juninas no Brasil."
  },
  {
    title: "A Canoa Virou",
    notes: ["E", "G", "C1", "G", "E", "G", "C1", "G", "C1", "B", "A", "G", "F", "E"],
    description: "Canção folclórica brasileira."
  },
  {
    title: "Eu Vi Uma Barata",
    notes: ["C1", "C1", "D", "E", "C1", "E", "D", "C1", "C1", "D", "E", "C1"],
    description: "Canção infantil brasileira simples e divertida."
  },
  {
    title: "Se Esta Rua Fosse Minha",
    notes: ["C1", "E", "F", "G", "G", "F", "E", "D", "C1", "E", "G", "C1"],
    description: "Canção de ninar tradicional brasileira."
  },
  {
    title: "Borboletinha",
    notes: ["G", "E", "G", "E", "A", "G", "F", "E", "D", "C1"],
    description: "Canção infantil brasileira muito popular em escolas."
  },
  {
    title: "Jingle Bells (Início)",
    notes: ["E", "E", "E", "E", "E", "E", "E", "G", "C1", "D", "E"],
    description: "Música natalina conhecida mundialmente."
  },
  {
    title: "Atirei o Pau no Gato",
    notes: ["G", "E", "E", "F", "G", "G", "G", "A", "G", "F", "E", "D", "C1"],
    description: "Canção infantil tradicional brasileira."
  },
  {
    title: "Caranguejo",
    notes: ["C1", "C1", "A", "A", "G", "G", "E", "G", "A", "G", "F", "E"],
    description: "Música folclórica brasileira popular em brincadeiras infantis."
  },
  {
    title: "Row, Row, Row Your Boat",
    notes: ["C1", "C1", "C1", "D", "E", "E", "D", "E", "F", "G", "C8"],
    description: "Canção infantil inglesa tradicional."
  },
  {
    title: "Samba Lelê",
    notes: ["G", "G", "G", "E", "A", "A", "G", "E", "G", "F", "E", "D", "C1"],
    description: "Canção folclórica brasileira muito usada em brincadeiras."
  },
  {
    title: "London Bridge",
    notes: ["G", "A", "G", "F", "E", "F", "G", "D", "E", "F", "E", "F", "G"],
    description: "Canção tradicional inglesa conhecida mundialmente."
  },
  {
    title: "Meu Lanchinho",
    notes: ["C1", "D", "E", "C1", "C1", "D", "E", "C1", "E", "F", "G"],
    description: "Canção infantil brasileira cantada na hora do lanche escolar."
  },
  {
    title: "Pirulito que Bate Bate",
    notes: ["G", "E", "G", "E", "A", "G", "F", "E", "D", "C1", "D", "E", "F"],
    description: "Canção folclórica brasileira popular entre crianças."
  },
  {
    title: "O Cravo e a Rosa",
    notes: ["E", "G", "G", "A", "G", "F", "E", "E", "A", "A", "G", "F", "E", "D"],
    description: "Canção infantil tradicional portuguesa e brasileira."
  },
  {
    title: "Passarinho que Som é Esse",
    notes: ["G", "G", "E", "G", "A", "A", "G", "F", "E", "D", "C1"],
    description: "Canção educativa brasileira para ensinar sons de animais."
  }
];

export default function MusicalBells() {
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null);
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  // Play a single note
  const playNote = (note: string) => {
    // Find the index of the note in our notes array
    const noteIndex = notes.findIndex(n => n.note === note);
    if (noteIndex >= 0) {
      setCurrentNoteIndex(noteIndex);
      // Reset the highlight after a short delay
      setTimeout(() => setCurrentNoteIndex(null), 500);
    }
  };

  // Play a song
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
        setTimeout(playNextNote, 800); // Play each note with a delay
      } else {
        setCurrentSong(null);
        setIsPlaying(false);
      }
    };

    playNextNote();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-primary">
        Sinos Musicais
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Musical Bells Display */}
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

        {/* Songs List */}
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
                    onClick={() => playSong(index)}
                  >
                    <div className="font-semibold text-lg">{song.title}</div>
                    <p className="text-sm text-gray-600 mb-2">{song.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {song.notes.map((note, noteIndex) => {
                        const noteData = notes.find(n => n.note === note);
                        return (
                          <div
                            key={`${note}-${noteIndex}`}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ 
                              backgroundColor: noteData?.color,
                              color: ["C8", "E"].includes(note) ? "#333" : "white"
                            }}
                          >
                            {note}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
