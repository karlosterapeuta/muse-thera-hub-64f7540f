import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DevolutivaPreviewProps {
  data: {
    patient_name: string;
    session_date: string;
    session_number: number;
    arrival_state: string;
    communication: string;
    emotional_regulation: string;
    motor_development: string;
    sensory_aspects: string;
    musical_participation: string;
    achievements: string;
    family_guidelines: string;
    next_steps: string;
    general_observations: string;
    challenges_resistance: string;
    professional_name: string;
    professional_registry: string;
  };
}

export function DevolutivaPreview({ data }: DevolutivaPreviewProps) {
  const sections = [
    { title: 'Estado de Chegada', icon: '👋', content: data.arrival_state },
    { title: 'Comunicação e Interação', icon: '💬', content: data.communication },
    { title: 'Regulação Emocional', icon: '❤️', content: data.emotional_regulation },
    { title: 'Desenvolvimento Motor', icon: '🤸', content: data.motor_development },
    { title: 'Aspectos Sensoriais', icon: '🎵', content: data.sensory_aspects },
    { title: 'Participação Musical', icon: '🎼', content: data.musical_participation },
    { title: 'Conquistas da Sessão', icon: '🎯', content: data.achievements },
    { title: 'Orientações para Família', icon: '👨‍👩‍👧‍👦', content: data.family_guidelines },
    { title: 'Próximos Passos', icon: '🔜', content: data.next_steps },
    { title: 'Observações Gerais', icon: '📝', content: data.general_observations },
    { title: 'Desafios e Resistências', icon: '⚠️', content: data.challenges_resistance }
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-8" id="devolutiva-preview">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="text-4xl mb-2">🎵</div>
          <h1 className="text-2xl font-bold text-foreground">
            DEVOLUTIVA MUSICOTERAPIA
          </h1>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Paciente:</strong> {data.patient_name}</p>
            <p><strong>Data:</strong> {new Date(data.session_date).toLocaleDateString('pt-BR')}</p>
            <p><strong>Sessão #:</strong> {data.session_number}</p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            section.content && (
              <div key={section.title} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{section.icon}</span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {section.title}
                  </h3>
                </div>
                <p className="text-sm text-foreground leading-relaxed pl-8">
                  {section.content}
                </p>
              </div>
            )
          ))}
        </div>

        <Separator className="my-8" />

        {/* Footer */}
        <div className="space-y-4">
          <div className="text-sm text-foreground">
            <p><strong>Profissional:</strong> {data.professional_name}</p>
            <p><strong>Registro:</strong> {data.professional_registry}</p>
          </div>
          <div className="pt-8 border-t-2 border-border">
            <p className="text-sm text-muted-foreground text-center">
              Assinatura: _________________________________
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
          <p className="text-xs text-muted-foreground text-center italic">
            A música é uma ponte que conecta, desenvolve e transforma. Continuemos juntos nesta jornada! 🎵
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
