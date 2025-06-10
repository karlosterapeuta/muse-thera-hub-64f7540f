
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";

interface AIKeyPointsFormProps {
  onGenerate: (keyPoints: string) => Promise<void>;
  isGenerating: boolean;
  reportType: string;
}

export function AIKeyPointsForm({ onGenerate, isGenerating, reportType }: AIKeyPointsFormProps) {
  const [keyPoints, setKeyPoints] = useState("");

  const getPlaceholderText = (type: string) => {
    const placeholders = {
      individual_session: "Ex: Paciente de 8 anos com TEA, primeira sessão após férias. Mostrou interesse pelos instrumentos de percussão, especialmente o xilofone. Apresentou dificuldade inicial de engajamento, mas respondeu bem à música familiar. Trabalhou coordenação motora e expressão emocional.",
      monthly_evolution: "Ex: João, 12 anos, autismo. Mês focado em comunicação não-verbal e interação social. Progresso significativo na imitação rítmica. Desafios com mudanças de atividade. Família relatou maior calma em casa.",
      daily_evolution: "Ex: Maria chegou agitada hoje. Usamos respiração com flauta doce para acalmar. Participou de improvisação com violão. Mostrou criatividade na criação melódica. Saiu mais tranquila.",
      semester_evolution: "Ex: Pedro, 6 meses de tratamento. Evolução notável na comunicação e socialização. Família muito engajada. Recomendo continuidade com foco em autonomia.",
      therapeutic_discharge: "Ex: Ana, 2 anos de tratamento. Objetivos alcançados: comunicação fluente, autorregulação emocional, interação social adequada. Família preparada para continuidade em casa.",
      group_session: "Ex: Grupo de 4 adolescentes. Tema: expressão de sentimentos. Atividade de composição coletiva. Boa interação, especialmente entre Luis e Carla. Marcos ainda reservado."
    };

    return placeholders[type as keyof typeof placeholders] || placeholders.individual_session;
  };

  const getReportTypeLabel = (type: string) => {
    const labels = {
      individual_session: "Sessão Individual",
      monthly_evolution: "Evolução Mensal", 
      daily_evolution: "Evolução Diária",
      semester_evolution: "Evolução Semestral",
      therapeutic_discharge: "Alta Terapêutica",
      group_session: "Sessão em Grupo"
    };

    return labels[type as keyof typeof labels] || "Relatório";
  };

  const handleGenerate = async () => {
    if (keyPoints.trim()) {
      await onGenerate(keyPoints.trim());
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          Geração Assistida por IA
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Descreva os pontos principais sobre o paciente e a sessão. A IA gerará um {getReportTypeLabel(reportType).toLowerCase()} estruturado que você poderá editar.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="keyPoints">Pontos Principais</Label>
          <Textarea
            id="keyPoints"
            placeholder={getPlaceholderText(reportType)}
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            rows={6}
            className="mt-2"
          />
        </div>
        
        <Button 
          onClick={handleGenerate}
          disabled={!keyPoints.trim() || isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando relatório...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar Relatório com IA
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          O conteúdo gerado será exibido nos campos abaixo para você revisar e editar antes de salvar.
        </p>
      </CardContent>
    </Card>
  );
}
