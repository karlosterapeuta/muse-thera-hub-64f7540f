
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Gauge, Music2, HeartPulse } from "lucide-react";

type EmotionalLevel = {
  range: string;
  emotion: string;
  frequency: string;
  description: string;
  suggestedSongs: string[];
};

const emotionalLevels: EmotionalLevel[] = [
  {
    range: "700-1000",
    emotion: "Iluminação",
    frequency: "Alta Frequência",
    description: "Estado de pura consciência e conexão universal",
    suggestedSongs: ["Aquarela - Toquinho", "O Leãozinho - Toquinho", "Dona Árvore - Palavra Cantada"]
  },
  {
    range: "600-700",
    emotion: "Paz",
    frequency: "Frequência Elevada",
    description: "Tranquilidade e serenidade profunda",
    suggestedSongs: ["Se Essa Rua Fosse Minha", "Nesta Rua", "A Linda Rosa Juvenil"]
  },
  {
    range: "500-600",
    emotion: "Amor",
    frequency: "Frequência Muito Alta",
    description: "Compaixão e harmonia com todos",
    suggestedSongs: ["O Cravo e a Rosa", "Borboletinha", "Ciranda, Cirandinha"]
  },
  {
    range: "400-500",
    emotion: "Razão",
    frequency: "Frequência Alta",
    description: "Compreensão e clareza mental",
    suggestedSongs: ["A Casa - Vinicius de Moraes", "Gato Xadrez - Palavra Cantada"]
  },
  {
    range: "300-400",
    emotion: "Aceitação",
    frequency: "Frequência Média-Alta",
    description: "Perdão e harmonia",
    suggestedSongs: ["Peixe Vivo", "Escravos de Jó"]
  },
  {
    range: "200-300",
    emotion: "Coragem",
    frequency: "Frequência Média",
    description: "Empoderamento e determinação",
    suggestedSongs: ["Marcha Soldado", "O Pato - Vinicius de Moraes"]
  },
  {
    range: "100-200",
    emotion: "Orgulho/Raiva",
    frequency: "Frequência Baixa",
    description: "Defensividade e frustração",
    suggestedSongs: ["Sapo Cururu", "O Sapo Não Lava o Pé"]
  },
  {
    range: "20-100",
    emotion: "Vergonha/Medo",
    frequency: "Frequência Muito Baixa",
    description: "Baixa autoestima e insegurança",
    suggestedSongs: ["A Barata Diz Que Tem", "Eu sou pobre, pobre, pobre"]
  }
];

export default function HawkinsScale() {
  const [selectedLevel, setSelectedLevel] = useState<EmotionalLevel | null>(null);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
          <HeartPulse className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-primary">Escala de Consciência de Hawkins</h1>
        <p className="text-muted-foreground max-w-2xl">
          Desenvolvida pelo Dr. David Hawkins, esta escala mede a frequência das emoções 
          e seu impacto em nossa consciência, variando de 20 Hz a 1000 Hz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {emotionalLevels.map((level) => (
          <Card 
            key={level.range}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedLevel?.range === level.range ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedLevel(level)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                {level.emotion}
              </CardTitle>
              <CardDescription>{level.range} Hz</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{level.description}</p>
              <Label className="text-xs font-medium text-primary">{level.frequency}</Label>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedLevel && (
        <Card className="mt-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="h-5 w-5 text-primary" />
              Sugestões Musicais para {selectedLevel.emotion}
            </CardTitle>
            <CardDescription>
              Músicas que podem ajudar a elevar sua frequência neste nível
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {selectedLevel.suggestedSongs.map((song, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-primary/50 rounded-full" />
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
