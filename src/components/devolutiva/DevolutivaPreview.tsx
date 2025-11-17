import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation(['clinical', 'phrases', 'common']);
  
  const getLocaleDateString = (dateString: string) => {
    const localeMap: Record<string, string> = {
      'pt-BR': 'pt-BR',
      'en': 'en-US',
      'es': 'es-ES'
    };
    return new Date(dateString).toLocaleDateString(localeMap[i18n.language] || 'pt-BR');
  };
  
  const sections = [
    { title: t('phrases:categories.arrival_state.title'), icon: t('phrases:categories.arrival_state.icon'), content: data.arrival_state },
    { title: t('phrases:categories.communication.title'), icon: t('phrases:categories.communication.icon'), content: data.communication },
    { title: t('phrases:categories.emotional_regulation.title'), icon: t('phrases:categories.emotional_regulation.icon'), content: data.emotional_regulation },
    { title: t('phrases:categories.motor_development.title'), icon: t('phrases:categories.motor_development.icon'), content: data.motor_development },
    { title: t('phrases:categories.sensory_aspects.title'), icon: t('phrases:categories.sensory_aspects.icon'), content: data.sensory_aspects },
    { title: t('phrases:categories.musical_participation.title'), icon: t('phrases:categories.musical_participation.icon'), content: data.musical_participation },
    { title: t('phrases:categories.achievements.title'), icon: t('phrases:categories.achievements.icon'), content: data.achievements },
    { title: t('phrases:categories.family_guidelines.title'), icon: t('phrases:categories.family_guidelines.icon'), content: data.family_guidelines },
    { title: t('phrases:categories.next_steps.title'), icon: t('phrases:categories.next_steps.icon'), content: data.next_steps },
    { title: t('phrases:categories.general_observations.title'), icon: t('phrases:categories.general_observations.icon'), content: data.general_observations },
    { title: t('phrases:categories.challenges_resistance.title'), icon: t('phrases:categories.challenges_resistance.icon'), content: data.challenges_resistance }
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-8" id="devolutiva-preview">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="text-4xl mb-2">🎵</div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('clinical:devolutiva.title').toUpperCase()}
          </h1>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>{t('clinical:devolutiva.fields.patient')}:</strong> {data.patient_name}</p>
            <p><strong>{t('common:date')}:</strong> {getLocaleDateString(data.session_date)}</p>
            <p><strong>{t('clinical:devolutiva.fields.sessionNumber')} #:</strong> {data.session_number}</p>
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
            <p><strong>{t('clinical:devolutiva.fields.professionalName')}:</strong> {data.professional_name}</p>
            <p><strong>{t('clinical:devolutiva.fields.professionalRegistry')}:</strong> {data.professional_registry}</p>
          </div>
          <div className="pt-8 border-t-2 border-border">
            <p className="text-sm text-muted-foreground text-center">
              {t('common:signature')}: _________________________________
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
          <p className="text-xs text-muted-foreground text-center italic">
            {t('clinical:devolutiva.closingMessage')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
