
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Song {
  id: number;
  title: string;
  artist: string;
}

export default function SongsPage() {
  const songs: Song[] = [
    { id: 1, title: "Atirei o Pau no Gato", artist: "Tradicional" },
    { id: 2, title: "Sapo Cururu", artist: "Tradicional" },
    { id: 3, title: "Ciranda, Cirandinha", artist: "Tradicional" },
    { id: 4, title: "O Sítio do Seu Lobato", artist: "Tradicional" },
    { id: 5, title: "A Barata Diz Que Tem", artist: "Tradicional" },
    { id: 6, title: "Marcha Soldado", artist: "Tradicional" },
    { id: 7, title: "Boi da Cara Preta", artist: "Tradicional" },
    { id: 8, title: "Peixe Vivo", artist: "Tradicional" },
    { id: 9, title: "Escravos de Jó", artist: "Tradicional" },
    { id: 10, title: "Cai, Cai Balão", artist: "Tradicional" },
    { id: 11, title: "O Cravo e a Rosa", artist: "Tradicional" },
    { id: 12, title: "Fui no Itororó", artist: "Tradicional" },
    { id: 13, title: "Se Essa Rua Fosse Minha", artist: "Tradicional" },
    { id: 14, title: "Pirulito que Bate Bate", artist: "Tradicional" },
    { id: 15, title: "A Canoa Virou", artist: "Tradicional" },
    { id: 16, title: "Indiozinhos", artist: "Tradicional" },
    { id: 17, title: "A Linda Rosa Juvenil", artist: "Tradicional" },
    { id: 18, title: "Capelinha de Melão", artist: "Tradicional" },
    { id: 19, title: "Nesta Rua", artist: "Tradicional" },
    { id: 20, title: "O Pintinho Amarelinho", artist: "Tradicional" },
    { id: 21, title: "A Galinha do Vizinho", artist: "Tradicional" },
    { id: 22, title: "O Elefante", artist: "Xuxa" },
    { id: 23, title: "A Casa", artist: "Vinicius de Moraes" },
    { id: 24, title: "O Pato", artist: "Vinicius de Moraes" },
    { id: 25, title: "Aquarela", artist: "Toquinho" },
    { id: 26, title: "A Baratinha", artist: "Tradicional" },
    { id: 27, title: "A Dona Aranha", artist: "Adaptação em português" },
    { id: 28, title: "A Roda do Ônibus", artist: "Adaptação em português" },
    { id: 29, title: "Borboletinha", artist: "Tradicional" },
    { id: 30, title: "Cachorrinho está latindo", artist: "Tradicional" },
    { id: 31, title: "Caranguejo não é peixe", artist: "Tradicional" },
    { id: 32, title: "Dona Árvore", artist: "Palavra Cantada" },
    { id: 33, title: "Eu sou pobre, pobre, pobre", artist: "Tradicional" },
    { id: 34, title: "Fui ao mercado", artist: "Tradicional" },
    { id: 35, title: "Gato Xadrez", artist: "Palavra Cantada" },
    { id: 36, title: "O Jacaré", artist: "Xuxa" },
    { id: 37, title: "O Leãozinho", artist: "Toquinho" },
    { id: 38, title: "O Sapo Não Lava o Pé", artist: "Tradicional" },
    { id: 39, title: "A Canoa Virou", artist: "Tradicional" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Músicas</CardTitle>
            <CardDescription>
              Repertório de músicas para sessões de musicoterapia
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar música ou artista..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              <div className="space-y-3">
                {filteredSongs.map((song) => (
                  <div
                    key={song.id}
                    className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedSong?.id === song.id ? "bg-primary/10 border-primary" : ""
                    }`}
                    onClick={() => setSelectedSong(song)}
                  >
                    <h3 className="font-medium text-lg">{song.title}</h3>
                    <p className="text-gray-600">{song.artist}</p>
                  </div>
                ))}
                
                {filteredSongs.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    Nenhuma música encontrada com o termo "{searchTerm}"
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6" /> Letra da Música
            </CardTitle>
            <CardDescription>
              {selectedSong ? `${selectedSong.title} - ${selectedSong.artist}` : "Selecione uma música para ver a letra"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              {selectedSong ? (
                <div className="space-y-4">
                  <p className="text-gray-500 italic text-center">
                    Para adicionar a letra da música "{selectedSong.title}", você precisará inseri-la manualmente 
                    respeitando os direitos autorais ou obtendo as devidas licenças.
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-center text-sm text-gray-500">
                      Espaço reservado para a letra da música.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <FileText size={48} className="mb-4 text-gray-300" />
                  <p>Selecione uma música da lista para visualizar sua letra</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          {selectedSong && (
            <CardFooter className="flex justify-end border-t pt-4">
              <Button variant="outline" onClick={() => setSelectedSong(null)}>
                Voltar para a lista
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
