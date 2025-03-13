
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SongPDF } from "@/components/SongPDF";
import html2pdf from "html2pdf.js";

// Define the notes and their corresponding colors
const notes = [
  { note: "C1", color: "#EA384C", colorName: "VERMELHO" },   // Red
  { note: "D", color: "#F97316", colorName: "LARANJA" },     // Orange
  { note: "E", color: "#FEF08A", colorName: "AMARELA" },     // Yellow
  { note: "F", color: "#4ADE80", colorName: "VERDE" },       // Green
  { note: "G", color: "#33C3F0", colorName: "AZUL CLARO" },  // Light Blue
  { note: "A", color: "#9B87F5", colorName: "AZUL ESCURO" }, // Dark Blue
  { note: "B", color: "#9B87F5", colorName: "ROXO" },        // Purple
  { note: "C8", color: "#FFFFFF", colorName: "BRANCO" },     // White
];

// Define complete songs with consistent structure for notes and lyrics
const songs = [
  {
    title: "Brilha, Brilha Estrelinha",
    notes: ["C1", "C1", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C1", "G", "G", "F", "F", "E", "E", "D", "G", "G", "F", "F", "E", "E", "D", "C1", "C1", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C1"],
    lyrics: ["Bri", "lha", "bri", "lha", "es", "tre", "li", "nha", "quero", "ver", "você", "bri", "lhar", "lá", "no", "céu", "tão", "al", "ti", "nho", "faz", "pa", "re", "cer", "um", "dia", "man", "ti", "nho", "bri", "lha", "bri", "lha", "es", "tre", "li", "nha", "quero", "ver", "você", "bri", "lhar"],
    description: "Uma canção infantil clássica, também conhecida como 'Twinkle Twinkle Little Star', com todas as estrofes completas."
  },
  {
    title: "Parabéns a Você",
    notes: ["C1", "C1", "D", "C1", "F", "E", "C1", "C1", "D", "C1", "G", "F", "C1", "C1", "C8", "A", "F", "E", "D", "B", "B", "A", "F", "G", "F"],
    lyrics: ["Pa", "ra", "béns", "a", "vo", "cê", "nes", "ta", "da", "ta", "que", "ri", "da", "mui", "tas", "fe", "li", "ci", "da", "des", "mui", "tos", "a", "nos", "de", "vi", "da"],
    description: "A canção tradicional de aniversário completa, com todas as estrofes."
  },
  {
    title: "Dó-Ré-Mi",
    notes: ["C1", "D", "E", "F", "G", "A", "B", "C8", "C1", "D", "E", "F", "G", "A", "B", "C8"],
    lyrics: ["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si", "Dó", "es", "ca", "la", "mu", "si", "cal", "com", "ple", "ta"],
    description: "A famosa escala musical completa, ascendente e descendente."
  },
  {
    title: "Ode à Alegria",
    notes: ["E", "E", "F", "G", "G", "F", "E", "D", "C1", "C1", "D", "E", "E", "D", "D", "E", "E", "F", "G", "G", "F", "E", "D", "C1", "C1", "D", "E", "D", "C1", "C1"],
    lyrics: ["O", "de", "à", "a", "le", "gri", "a", "be", "la", "cen", "te", "lha", "di", "vi", "na", "fi", "lha", "do", "E", "lí", "seo", "ce", "les", "ti", "al", "tu", "a", "ma", "gi", "a"],
    description: "Melodia principal da Nona Sinfonia de Beethoven, com estrofes completas."
  },
  {
    title: "Escala Cromática",
    notes: ["C1", "D", "E", "F", "G", "A", "B", "C8", "B", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["Su", "bin", "do", "a", "es", "ca", "la", "mú", "si", "cal", "des", "cen", "do", "a", "gora"],
    description: "Uma escala que percorre todas as notas em sequência, subindo e descendo."
  },
  // Músicas brasileiras completas e revisadas
  {
    title: "Ciranda, Cirandinha",
    notes: ["C1", "D", "E", "C1", "D", "E", "C1", "E", "D", "C1", "D", "E", "C1", "D", "D", "E", "F", "F", "E", "D", "C1"],
    lyrics: ["Ci", "ran", "da", "ci", "ran", "di", "nha", "va", "mos", "to", "dos", "ci", "ran", "dar", "o", "a", "nel", "que", "tu", "me", "des", "te"],
    description: "Canção folclórica brasileira muito popular entre crianças, com versos completos."
  },
  {
    title: "Marcha Soldado",
    notes: ["E", "E", "E", "G", "C1", "C1", "G", "G", "E", "E", "C1", "E", "E", "E", "G", "C1", "C1", "G", "G", "E", "E", "C1"],
    lyrics: ["Mar", "cha", "sol", "da", "do", "ca", "be", "ça", "de", "pa", "pel", "se", "não", "mar", "char", "di", "rei", "ti", "nho", "vai", "pre", "so"],
    description: "Canção infantil brasileira tradicional com todos os versos."
  },
  {
    title: "O Sapo Não Lava o Pé",
    notes: ["G", "A", "G", "F", "E", "F", "G", "G", "A", "G", "F", "E", "F", "G", "G", "A", "G", "F", "E", "F", "G", "G", "A", "G", "F", "E", "F", "G"],
    lyrics: ["O", "sa", "po", "não", "la", "va", "o", "pé", "não", "la", "va", "por", "que", "não", "e", "le", "mo", "ra", "lá", "na", "la", "go", "a", "não", "la", "va", "o", "pé"],
    description: "Canção infantil brasileira divertida e educativa, com todos os versos."
  },
  {
    title: "Frère Jacques",
    notes: ["C1", "D", "E", "C1", "C1", "D", "E", "C1", "E", "F", "G", "E", "F", "G", "G", "A", "G", "F", "E", "C1", "G", "G", "A", "G", "F", "E", "C1"],
    lyrics: ["Frè", "re", "Jac", "ques", "Frè", "re", "Jac", "ques", "Dor", "mez", "vous", "Dor", "mez", "vous", "Son", "nez", "les", "ma", "ti", "nes", "Son", "nez", "les", "ma", "ti", "nes", "Din", "din", "don"],
    description: "Canção de origem francesa conhecida em todo o mundo, com todos os versos."
  },
  {
    title: "Escravos de Jó",
    notes: ["G", "G", "G", "E", "G", "G", "G", "E", "G", "E", "C1", "C1", "A", "A", "G", "G", "G", "G", "E", "G", "G", "G", "E", "G", "E", "C1", "C1", "A", "A", "G"],
    lyrics: ["Es", "cra", "vos", "de", "Jó", "jo", "ga", "vam", "ca", "xan", "gá", "ti", "ra", "ti", "ra", "bo", "ta", "dei", "xa", "fi", "car", "guer", "rei", "ros", "com", "guer", "rei", "ros", "fa", "zem"],
    description: "Música folclórica brasileira usada em jogos infantis, com todos os versos."
  },
  {
    title: "Cai, Cai, Balão",
    notes: ["G", "E", "G", "E", "C1", "G", "F", "E", "D", "C1", "G", "E", "G", "E", "C1", "G", "F", "E", "D", "C1", "C1", "D", "E", "F", "G", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["Cai", "cai", "ba", "lão", "cai", "cai", "ba", "lão", "a", "qui", "na", "mi", "nha", "mão", "não", "cai", "não", "não", "não", "não", "cai", "a", "qui", "na", "mi", "nha", "mão", "mão", "mão", "mão", "mão"],
    description: "Canção tradicional das festas juninas no Brasil, com todos os versos."
  },
  {
    title: "A Canoa Virou",
    notes: ["E", "G", "C1", "G", "E", "G", "C1", "G", "C1", "B", "A", "G", "F", "E", "E", "G", "C1", "G", "E", "G", "C1", "G", "C1", "B", "A", "G", "F", "E"],
    lyrics: ["A", "ca", "no", "a", "vi", "rou", "por", "dei", "xar", "e", "la", "vi", "rar", "foi", "por", "cau", "sa", "do", "Ma", "ri", "a", "que", "não", "sou", "be", "re", "mar"],
    description: "Canção folclórica brasileira completa com todos os versos."
  },
  {
    title: "Eu Vi Uma Barata",
    notes: ["C1", "C1", "D", "E", "C1", "E", "D", "C1", "C1", "D", "E", "C1", "C1", "C1", "D", "E", "C1", "E", "D", "C1", "C1", "D", "E", "C1"],
    lyrics: ["Eu", "vi", "u", "ma", "ba", "ra", "ta", "na", "ca", "re", "ca", "do", "ve", "lho", "pa", "dre", "an", "tô", "nio", "sai", "ba", "ra", "ta", "dei"],
    description: "Canção infantil brasileira simples e divertida, com todos os versos."
  },
  {
    title: "Se Esta Rua Fosse Minha",
    notes: ["C1", "E", "F", "G", "G", "F", "E", "D", "C1", "E", "G", "C1", "C1", "E", "F", "G", "G", "F", "E", "D", "C1", "E", "G", "C1", "G", "G", "A", "G", "F", "E", "D", "C1", "D", "E", "F"],
    lyrics: ["Se", "es", "ta", "ru", "a", "fos", "se", "mi", "nha", "eu", "man", "da", "va", "la", "dri", "lhar", "com", "pe", "dri", "nhas", "de", "bri", "lhan", "te", "pa", "ra", "o", "meu", "a", "mor", "pas", "sar"],
    description: "Canção de ninar tradicional brasileira completa."
  },
  {
    title: "Borboletinha",
    notes: ["G", "E", "G", "E", "A", "G", "F", "E", "D", "C1", "G", "E", "G", "E", "A", "G", "F", "E", "D", "C1", "F", "E", "D", "C1", "G", "F", "E", "D"],
    lyrics: ["Bor", "bo", "le", "ti", "nha", "tá", "na", "co", "zi", "nha", "fa", "zen", "do", "cho", "co", "la", "te", "pa", "ra", "ma", "dri", "nha", "po", "ti", "po", "ti", "po", "ti"],
    description: "Canção infantil brasileira muito popular em escolas, com todos os versos."
  },
  {
    title: "Jingle Bells",
    notes: ["E", "E", "E", "E", "E", "E", "E", "G", "C1", "D", "E", "F", "F", "F", "F", "F", "E", "E", "E", "E", "D", "D", "E", "D", "G"],
    lyrics: ["Jin", "gle", "bells", "jin", "gle", "bells", "jin", "gle", "all", "the", "way", "oh", "what", "fun", "it", "is", "to", "ride", "in", "a", "one", "horse", "o", "pen", "sleigh"],
    description: "Música natalina conhecida mundialmente, com todos os versos do refrão."
  },
  {
    title: "Atirei o Pau no Gato",
    notes: ["G", "E", "E", "F", "G", "G", "G", "A", "G", "F", "E", "D", "C1", "G", "E", "E", "F", "G", "G", "G", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["A", "ti", "rei", "o", "pau", "no", "ga", "to", "to", "mas", "o", "ga", "to", "não", "mor", "reu", "reu", "reu", "do", "na", "chi", "ca", "ca", "ad", "mi", "rou"],
    description: "Canção infantil tradicional brasileira, com todos os versos."
  },
  {
    title: "Caranguejo",
    notes: ["C1", "C1", "A", "A", "G", "G", "E", "G", "A", "G", "F", "E", "C1", "C1", "A", "A", "G", "G", "E", "G", "A", "G", "F", "E"],
    lyrics: ["Ca", "ran", "gue", "jo", "não", "é", "pei", "xe", "ca", "ran", "gue", "jo", "pei", "xe", "é", "na", "va", "zi", "a", "ni", "ma", "ré"],
    description: "Música folclórica brasileira popular em brincadeiras infantis, com todos os versos."
  },
  {
    title: "Row, Row, Row Your Boat",
    notes: ["C1", "C1", "C1", "D", "E", "E", "D", "E", "F", "G", "C8", "C8", "C8", "G", "G", "G", "E", "E", "E", "C1", "C1", "C1"],
    lyrics: ["Row", "row", "row", "your", "boat", "gen", "tly", "down", "the", "stream", "mer", "ri", "ly", "mer", "ri", "ly", "mer", "ri", "ly", "mer", "ri", "ly"],
    description: "Canção infantil inglesa tradicional, com todos os versos."
  },
  {
    title: "Samba Lelê",
    notes: ["G", "G", "G", "E", "A", "A", "G", "E", "G", "F", "E", "D", "C1", "G", "G", "G", "E", "A", "A", "G", "E", "G", "F", "E", "D", "C1"],
    lyrics: ["Sam", "ba", "Le", "lê", "es", "tá", "do", "en", "te", "es", "tá", "com", "a", "ca", "be", "ça", "que", "bra", "da", "pre", "ci", "sa", "de", "u", "ma", "ben", "ção"],
    description: "Canção folclórica brasileira muito usada em brincadeiras, com todos os versos."
  },
  {
    title: "London Bridge",
    notes: ["G", "A", "G", "F", "E", "F", "G", "D", "E", "F", "E", "F", "G", "G", "A", "G", "F", "E", "F", "G", "D", "G", "E", "C1"],
    lyrics: ["Lon", "don", "Bridge", "is", "fal", "ling", "down", "fal", "ling", "down", "fal", "ling", "down", "Lon", "don", "Bridge", "is", "fal", "ling", "down", "my", "fair", "la", "dy"],
    description: "Canção tradicional inglesa conhecida mundialmente, com todos os versos."
  },
  {
    title: "Meu Lanchinho",
    notes: ["C1", "D", "E", "C1", "C1", "D", "E", "C1", "E", "F", "G", "E", "F", "G", "C1", "D", "E", "C1", "C1", "D", "E", "C1"],
    lyrics: ["Meu", "lan", "chi", "nho", "meu", "lan", "chi", "nho", "vou", "co", "mer", "pra", "fi", "car", "for", "ti", "nho", "e", "cres", "cer"],
    description: "Canção infantil brasileira cantada na hora do lanche escolar, com todos os versos."
  },
  {
    title: "Pirulito que Bate Bate",
    notes: ["G", "E", "G", "E", "A", "G", "F", "E", "D", "C1", "D", "E", "F", "G", "E", "G", "E", "A", "G", "F", "E", "D", "C1", "D", "E", "F"],
    lyrics: ["Pi", "ru", "li", "to", "que", "ba", "te", "ba", "te", "pi", "ru", "li", "to", "que", "já", "ba", "teu", "quem", "gos", "ta", "de", "mim", "é", "e", "la", "quem"],
    description: "Canção folclórica brasileira popular entre crianças, com todos os versos."
  },
  {
    title: "O Cravo e a Rosa",
    notes: ["E", "G", "G", "A", "G", "F", "E", "E", "A", "A", "G", "F", "E", "D", "E", "G", "G", "A", "G", "F", "E", "E", "A", "A", "G", "F", "E", "D"],
    lyrics: ["O", "cra", "vo", "bri", "gou", "com", "a", "ro", "sa", "de", "bai", "xo", "de", "uma", "sa", "cu", "da", "de", "o", "cra", "vo", "sa", "iu", "ma", "chu", "ca", "do"],
    description: "Canção infantil tradicional portuguesa e brasileira, com todos os versos."
  },
  {
    title: "Passarinho que Som é Esse",
    notes: ["G", "G", "E", "G", "A", "A", "G", "F", "E", "D", "C1", "G", "G", "E", "G", "A", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["Pas", "sa", "ri", "nho", "que", "som", "é", "es", "se", "que", "tu", "fa", "zes", "quan", "do", "vo", "as", "pe", "lo", "ar", "piu", "piu"],
    description: "Canção educativa brasileira para ensinar sons de animais, com todos os versos."
  }
];

export default function MusicalBells() {
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null);
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState<number | null>(null);
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

  // Function to generate and download PDF
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
                  >
                    <div className="font-semibold text-lg mb-2">{song.title}</div>
                    <p className="text-sm text-gray-600 mb-3">{song.description}</p>
                    
                    {/* Notes with lyrics - Modified to display all notes properly */}
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
                    
                    {/* Action buttons */}
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

      {/* Hidden PDF content for generation */}
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
