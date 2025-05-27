
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  Music, 
  FileAudio, 
  Download, 
  Play, 
  Eye,
  Trash2,
  Star,
  Volume2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  pitch: string;
  duration: number;
  position: { x: number; y: number };
  color: string;
  shape: string;
  timestamp: number;
}

interface ImportedSong {
  id: string;
  name: string;
  duration: string;
  notes: Note[];
  difficulty: number;
  category: string;
  tempo?: number;
  pattern?: string[];
  previewUrl?: string;
}

interface MusicImporterProps {
  onImportSong: (song: ImportedSong) => void;
  onLoadExercise: (exercise: ImportedSong) => void;
}

const MusicImporter: React.FC<MusicImporterProps> = ({
  onImportSong,
  onLoadExercise
}) => {
  const [importedSongs, setImportedSongs] = useState<ImportedSong[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  // Função para obter cor da nota
  const getColorForNote = (pitch: string) => {
    const colorMap: { [key: string]: string } = {
      'C': '#FF0000',  // Vermelho - Dó
      'D': '#FF6600',  // Laranja - Ré  
      'E': '#FFFF00',  // Amarelo - Mi
      'F': '#00CC00',  // Verde - Fá
      'G': '#0099FF',  // Azul claro - Sol
      'A': '#6600FF',  // Roxo - Lá
      'B': '#FF1493'   // Rosa - Si
    };
    return colorMap[pitch] || '#888888';
  };

  // Função para obter forma da nota
  const getShapeForNote = (pitch: string) => {
    const shapeMap: { [key: string]: string } = {
      'C': 'circle',
      'D': 'square', 
      'E': 'triangle',
      'F': 'diamond',
      'G': 'hexagon',
      'A': 'triangle-up',
      'B': 'circle-outline'
    };
    return shapeMap[pitch] || 'circle';
  };

  // Função para gerar notas estruturadas
  const generateNotesFromPattern = (pattern: string[], startX = 150, startY = 140) => {
    return pattern.map((pitch, index) => ({
      id: `note-${Date.now()}-${index}`,
      pitch,
      duration: 1,
      position: { x: startX + (index * 80), y: startY },
      color: getColorForNote(pitch),
      shape: getShapeForNote(pitch),
      timestamp: index
    }));
  };

  // Biblioteca de exercícios pré-definidos
  const predefinedExercises: ImportedSong[] = [
    {
      id: "ex1",
      name: "🔴 Primeiro Dó",
      duration: "0:30",
      notes: generateNotesFromPattern(["C", "C", "C", "C"]),
      difficulty: 1,
      category: "iniciante",
      tempo: 80,
      pattern: ["C", "C", "C", "C"]
    },
    {
      id: "ex2", 
      name: "🌈 Escala Colorida",
      duration: "1:00",
      notes: generateNotesFromPattern(["C", "D", "E", "F", "G"]),
      difficulty: 2,
      category: "intermediario",
      tempo: 90,
      pattern: ["C", "D", "E", "F", "G"]
    },
    {
      id: "ex3",
      name: "🎵 Brilha Brilha Estrelinha",
      duration: "2:00",
      notes: generateNotesFromPattern(["C", "C", "G", "G", "A", "A", "G"]),
      difficulty: 2,
      category: "infantil",
      tempo: 100,
      pattern: ["C", "C", "G", "G", "A", "A", "G"]
    },
    {
      id: "ex4",
      name: "🎹 Acordes Básicos",
      duration: "1:30",
      notes: generateNotesFromPattern(["C", "E", "G"]),
      difficulty: 3,
      category: "avancado",
      tempo: 120,
      pattern: ["C", "E", "G"]
    },
    {
      id: "ex5",
      name: "🟠 Descobrindo o RÉ",
      duration: "0:45",
      notes: generateNotesFromPattern(["D", "D", "D", "D", "D"]),
      difficulty: 1,
      category: "iniciante",
      tempo: 85,
      pattern: ["D", "D", "D", "D", "D"]
    },
    {
      id: "ex6",
      name: "🎶 Melodia Simples",
      duration: "1:15",
      notes: generateNotesFromPattern(["C", "D", "E", "E", "D", "C"]),
      difficulty: 2,
      category: "intermediario",
      tempo: 95,
      pattern: ["C", "D", "E", "E", "D", "C"]
    },
    {
      id: "ex7",
      name: "🎪 Parabéns para Você",
      duration: "2:30",
      notes: generateNotesFromPattern(["C", "C", "D", "C", "F", "E"]),
      difficulty: 2,
      category: "infantil",
      tempo: 110,
      pattern: ["C", "C", "D", "C", "F", "E"]
    },
    {
      id: "ex8",
      name: "🌟 Estrela da Manhã",
      duration: "1:45",
      notes: generateNotesFromPattern(["G", "E", "E", "F", "D", "D", "C"]),
      difficulty: 3,
      category: "avancado",
      tempo: 105,
      pattern: ["G", "E", "E", "F", "D", "D", "C"]
    }
  ];

  const categories = [
    { id: "all", name: "📚 Todos", color: "bg-gray-500" },
    { id: "iniciante", name: "🌱 Iniciante", color: "bg-green-500" },
    { id: "intermediario", name: "🌿 Intermediário", color: "bg-blue-500" },
    { id: "avancado", name: "🌳 Avançado", color: "bg-purple-500" },
    { id: "infantil", name: "🧸 Infantil", color: "bg-pink-500" }
  ];

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simular processamento de arquivo
    const randomPattern = ["C", "D", "E", "F", "G"];
    const newSong: ImportedSong = {
      id: Date.now().toString(),
      name: file.name.replace(/\.[^/.]+$/, ""),
      duration: "2:30",
      notes: generateNotesFromPattern(randomPattern),
      difficulty: Math.floor(Math.random() * 3) + 1,
      category: "importado",
      tempo: 120,
      pattern: randomPattern
    };

    setImportedSongs(prev => [...prev, newSong]);
    
    toast({
      title: "🎵 Música importada!",
      description: `${newSong.name} foi adicionada à sua biblioteca.`,
    });
  }, [toast]);

  const handleLoadSong = (song: ImportedSong) => {
    console.log("Carregando música:", song);
    onImportSong(song);
    toast({
      title: "🎼 Música carregada!",
      description: `${song.name} está pronta para ser tocada no compositor.`,
    });
  };

  const handleLoadExerciseLocal = (exercise: ImportedSong) => {
    console.log("Carregando exercício:", exercise);
    onLoadExercise(exercise);
    toast({
      title: "📝 Exercício carregado!",
      description: `${exercise.name} está pronto para praticar no compositor.`,
    });
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Star 
        key={i}
        className={`w-4 h-4 ${
          i < difficulty ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredSongs = importedSongs.filter(song => 
    selectedCategory === "all" || song.category === selectedCategory
  );

  const filteredExercises = predefinedExercises.filter(exercise =>
    selectedCategory === "all" || exercise.category === selectedCategory
  );

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-emerald-800 mb-2">
          📁 Biblioteca Musical Educativa
        </h2>
        <p className="text-emerald-600">Importe músicas e acesse exercícios pré-definidos</p>
      </div>

      {/* Upload Section */}
      <Card className="mb-6 border-4 border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardTitle className="flex items-center">
            <Upload className="w-6 h-6 mr-2" />
            Importar Nova Música
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <Input
                type="file"
                accept=".mid,.midi,.json,.xml"
                onChange={handleFileUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>
            <div className="text-sm text-gray-600 text-center">
              <div className="flex items-center space-x-2">
                <FileAudio className="w-5 h-5" />
                <span>Suporte: MIDI, JSON, MusicXML</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="text-lg font-bold text-emerald-800 mb-3">🎯 Filtrar por Categoria</div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`${
                selectedCategory === category.id 
                  ? `${category.color} text-white` 
                  : `border-2 hover:${category.color} hover:text-white`
              } transition-all`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Pre-defined Exercises */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center">
          <Music className="w-7 h-7 mr-2" />
          📝 Exercícios Educativos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map(exercise => (
            <Card key={exercise.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald-300">
              <CardHeader className="bg-gradient-to-r from-emerald-100 to-emerald-200">
                <CardTitle className="text-lg text-emerald-800 flex items-center justify-between">
                  <span>{exercise.name}</span>
                  <div className="flex">{getDifficultyStars(exercise.difficulty)}</div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">⏱️ Duração:</span>
                    <span className="font-bold">{exercise.duration}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">🎵 Notas:</span>
                    <span className="font-bold">{exercise.notes.length}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">🎼 Tempo:</span>
                    <span className="font-bold">{exercise.tempo} BPM</span>
                  </div>

                  <div className="flex space-x-1">
                    {exercise.notes.slice(0, 5).map((note, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: note.color }}
                        title={note.pitch}
                      >
                        {note.pitch}
                      </div>
                    ))}
                    {exercise.notes.length > 5 && (
                      <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">
                        +{exercise.notes.length - 5}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleLoadExerciseLocal(exercise)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Carregar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => {
                        toast({
                          title: "🔍 Prévia do Exercício",
                          description: `${exercise.name}: ${exercise.pattern?.join(' → ') || 'Sequência musical'}`,
                        });
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Imported Songs */}
      {filteredSongs.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center">
            <FileAudio className="w-7 h-7 mr-2" />
            🎼 Músicas Importadas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSongs.map(song => (
              <Card key={song.id} className="hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200">
                  <CardTitle className="text-lg text-blue-800 flex items-center justify-between">
                    <span>{song.name}</span>
                    <div className="flex">{getDifficultyStars(song.difficulty)}</div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">⏱️ Duração:</span>
                      <span className="font-bold">{song.duration}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">🎵 Notas:</span>
                      <span className="font-bold">{song.notes.length}</span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleLoadSong(song)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Carregar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setImportedSongs(prev => prev.filter(s => s.id !== song.id));
                          toast({ title: "Música removida", description: `${song.name} foi removida.` });
                        }}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredSongs.length === 0 && filteredExercises.length === 0 && selectedCategory !== "all" && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhum conteúdo encontrado</h3>
          <p className="text-gray-500">Não há músicas ou exercícios nesta categoria.</p>
        </div>
      )}
    </div>
  );
};

export default MusicImporter;
