
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Gauge, Music2 } from "lucide-react";

type ConsciousnessLevel = {
  level: string;
  frequency: number;
  emotion: string;
  lifeView: string;
  divineView: string;
  process: string;
  color: string;
  direction: "up" | "down";
  suggestedSongs: string[];
};

const consciousnessLevels: ConsciousnessLevel[] = [
  {
    level: "Iluminação",
    frequency: 700,
    emotion: "Indescritível",
    lifeView: "Eu Sou",
    divineView: "Eu",
    process: "Plena Consciência",
    color: "bg-purple-900",
    direction: "up",
    suggestedSongs: ["Aquarela - Toquinho", "O Leãozinho - Toquinho"]
  },
  {
    level: "Paz",
    frequency: 600,
    emotion: "Felicidade",
    lifeView: "Perfeito",
    divineView: "Onipresença",
    process: "Iluminação",
    color: "bg-purple-600",
    direction: "up",
    suggestedSongs: ["Se Essa Rua Fosse Minha", "Nesta Rua"]
  },
  {
    level: "Alegria",
    frequency: 540,
    emotion: "Serenidade",
    lifeView: "Completo",
    divineView: "Unidade",
    process: "Transmutação",
    color: "bg-purple-500",
    direction: "up",
    suggestedSongs: ["Ciranda, Cirandinha", "A Linda Rosa Juvenil"]
  },
  {
    level: "Amor",
    frequency: 500,
    emotion: "Reverência",
    lifeView: "Benigno",
    divineView: "Amoroso",
    process: "Revelação",
    color: "bg-purple-400",
    direction: "up",
    suggestedSongs: ["O Cravo e a Rosa", "Borboletinha"]
  },
  {
    level: "Razão",
    frequency: 400,
    emotion: "Compreensão",
    lifeView: "Significativo",
    divineView: "Sábio",
    process: "Abstração",
    color: "bg-blue-500",
    direction: "up",
    suggestedSongs: ["A Casa - Vinicius de Moraes", "Gato Xadrez - Palavra Cantada"]
  },
  {
    level: "Aceitação",
    frequency: 350,
    emotion: "Perdão",
    lifeView: "Harmonioso",
    divineView: "Misericordioso",
    process: "Transcendência",
    color: "bg-blue-400",
    direction: "up",
    suggestedSongs: ["Peixe Vivo", "Escravos de Jó"]
  },
  {
    level: "Coragem",
    frequency: 200,
    emotion: "Afirmação",
    lifeView: "Possível",
    divineView: "Permissor",
    process: "Empoderamento",
    color: "bg-green-500",
    direction: "up",
    suggestedSongs: ["Marcha Soldado", "O Pato - Vinicius de Moraes"]
  },
  {
    level: "Orgulho",
    frequency: 175,
    emotion: "Desprezo",
    lifeView: "Exigente",
    divineView: "Indiferente",
    process: "Inflação",
    color: "bg-green-400",
    direction: "down",
    suggestedSongs: ["Sapo Cururu"]
  },
  {
    level: "Raiva",
    frequency: 150,
    emotion: "Ódio",
    lifeView: "Antagônico",
    divineView: "Rancoroso",
    process: "Agressão",
    color: "bg-teal-500",
    direction: "down",
    suggestedSongs: ["O Sapo Não Lava o Pé"]
  },
  {
    level: "Medo",
    frequency: 100,
    emotion: "Ansiedade",
    lifeView: "Assustador",
    divineView: "Punitivo",
    process: "Evasão",
    color: "bg-yellow-500",
    direction: "down",
    suggestedSongs: ["A Barata Diz Que Tem"]
  },
  {
    level: "Vergonha",
    frequency: 20,
    emotion: "Humilhação",
    lifeView: "Miserável",
    divineView: "Desprezador",
    process: "Eliminação",
    color: "bg-red-600",
    direction: "down",
    suggestedSongs: ["Eu sou pobre, pobre, pobre"]
  }
];

export default function HawkinsScale() {
  const [selectedLevel, setSelectedLevel] = useState<ConsciousnessLevel | null>(null);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8 animate-fade-in">
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
          <HeartPulse className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-primary">Escala de Consciência de Hawkins</h1>
        <p className="text-muted-foreground max-w-3xl">
          Desenvolvida pelo Dr. David Hawkins, esta escala mapeia os níveis de consciência 
          humana, desde estados mais densos até os mais elevados, medindo a frequência 
          vibracional de 20 Hz a 1000 Hz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {consciousnessLevels.map((level) => (
          <Card 
            key={level.level}
            className={`cursor-pointer transition-all hover:shadow-lg overflow-hidden ${
              selectedLevel?.level === level.level ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedLevel(level)}
          >
            <div className={`h-2 ${level.color}`} />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                {level.level} ({level.frequency} Hz)
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                {level.direction === "up" ? "↑" : "↓"} {level.emotion}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Visão de Vida:</span> {level.lifeView}
              </div>
              <div className="text-sm">
                <span className="font-medium">Visão de Deus:</span> {level.divineView}
              </div>
              <div className="text-sm">
                <span className="font-medium">Processo:</span> {level.process}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedLevel && (
        <Card className="mt-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="h-5 w-5 text-primary" />
              Sugestões Musicais para {selectedLevel.level}
            </CardTitle>
            <CardDescription>
              Músicas que podem auxiliar na elevação da frequência neste nível
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {selectedLevel.suggestedSongs.map((song, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${selectedLevel.color}`} />
                  {song}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {selectedLevel && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setSelectedLevel(null)}
          >
            Escolher Outro Nível
          </Button>
        </div>
      )}
    </div>
  );
}
