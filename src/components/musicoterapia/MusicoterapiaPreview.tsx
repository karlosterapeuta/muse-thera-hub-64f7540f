import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Music, User, Calendar, FileText, Target, Activity, TrendingUp, Lightbulb, Home, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ReportData } from '@/data/musicoterapiaTemplate';
import { musicoterapiaTemplate, reportSections, scaleFieldIds } from '@/data/musicoterapiaTemplate';
import { getSelectedMusicoterapiaObjectives, musicoterapiaObjectiveCategories } from '@/data/musicoterapiaObjectives';
import { getSelectedMusicoterapiaApproaches } from '@/data/musicoterapiaApproaches';
import { MusicoterapiaApproachResultsSummary } from './MusicoterapiaApproachResultsSummary';
import { MusicoterapiaObjectiveFlowSummary } from './MusicoterapiaObjectiveFlowSummary';

interface MusicoterapiaPreviewProps {
  reportData: ReportData;
  professionalData?: any;
}

export function MusicoterapiaPreview({ reportData, professionalData }: MusicoterapiaPreviewProps) {
  const selectedObjectives = getSelectedMusicoterapiaObjectives(reportData.fieldValues?.therapeutic_objective_ids);
  const selectedApproaches = getSelectedMusicoterapiaApproaches(reportData.fieldValues?.musicoterapia_approach_ids);
  const isLegacyReport = selectedApproaches.length === 0;
  const formatDate = (date: string | Date) => {
    if (!date) return 'Data não informada';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const renderScaleValue = (value: number, label: string) => {
    const percentage = (value / 10) * 100;
    const getColor = (val: number) => {
      if (val >= 8) return 'bg-green-500';
      if (val >= 6) return 'bg-yellow-500';
      if (val >= 4) return 'bg-orange-500';
      return 'bg-red-500';
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-lg font-bold text-primary">{value}/10</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${getColor(value)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const renderArrayField = (values: string[] | undefined, title: string) => {
    if (!values || values.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="font-medium text-primary">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {value}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6 bg-background">
      {/* Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl text-primary">
                  Relatório de Musicoterapia
                </CardTitle>
                <p className="text-muted-foreground">
                  Especializado para Transtorno do Espectro Autista (TEA)
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              {reportData.templateId}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Patient and Professional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Informações do Paciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{reportData.patientName || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Idade</p>
              <p className="font-medium">{reportData.patientAge || 'Não informada'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Diagnóstico</p>
              <p className="font-medium">{reportData.patientDiagnosis || 'Não informado'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Informações Profissionais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Profissional</p>
              <p className="font-medium">{professionalData?.name || reportData.professionalName || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registro</p>
              <p className="font-medium">{professionalData?.register || reportData.professionalRegistry || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data da Sessão</p>
              <p className="font-medium">{formatDate(reportData.sessionDate)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Objetivos planejados, não resultados adquiridos */}
      {selectedObjectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Objetivos a estimular ou desenvolver</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">Seleção de objetivos para intervenção; não representa habilidades adquiridas.</p>
            {musicoterapiaObjectiveCategories.map((category) => {
              const group = selectedObjectives.filter((item) => item.category === category.id);
              if (!group.length) return null;
              return (
                <section key={category.id} className="space-y-2">
                  <h4 className="font-semibold text-primary text-sm">{category.icon} {category.title}</h4>
                  {group.map((item) => (
                    <div key={item.id} className="rounded-lg border border-primary/15 p-3">
                      <p className="font-semibold">{item.icon} {item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.objective}</p>
                    </div>
                  ))}
                </section>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Therapeutic Objectives */}
      {selectedObjectives.length === 0 && reportData.fieldValues?.therapeutic_objectives && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Objetivos complementares</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {Array.isArray(reportData.fieldValues.therapeutic_objectives)
                ? reportData.fieldValues.therapeutic_objectives.join('\n')
                : String(reportData.fieldValues.therapeutic_objectives)}
            </p>
          </CardContent>
        </Card>
      )}

      {selectedObjectives.length === 0 && reportData.fieldValues?.specific_goals && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Metas específicas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">
              {Array.isArray(reportData.fieldValues.specific_goals)
                ? reportData.fieldValues.specific_goals.join('\n')
                : String(reportData.fieldValues.specific_goals)}
            </p>
          </CardContent>
        </Card>
      )}

      {selectedApproaches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <span>Abordagem Musicoterapêutica</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Abordagens selecionadas pelo profissional; a seleção não é evidência de aplicação ou resultado.
            </p>
            {selectedApproaches.map((approach) => (
              <div key={approach.id} className="rounded-lg border border-primary/15 p-3 space-y-1">
                <p className="font-semibold">{approach.title}</p>
                <p className="text-sm text-muted-foreground">{approach.description}</p>
                <p className="text-sm"><strong>Objetivos possíveis:</strong> {approach.goals}</p>
                {approach.clinicalNote && (
                  <p className="text-xs text-muted-foreground">Nota clínica: {approach.clinicalNote}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <MusicoterapiaApproachResultsSummary approachIds={reportData.fieldValues?.musicoterapia_approach_ids} results={reportData.fieldValues?.approach_results} />
      <MusicoterapiaObjectiveFlowSummary objectiveIds={reportData.fieldValues?.therapeutic_objective_ids} outcomes={reportData.fieldValues?.objective_outcomes} />

      {/* Instruments and Techniques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Music className="h-5 w-5 text-primary" />
              <span>Recursos Musicais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderArrayField(
              reportData.fieldValues?.instruments_used,
              'Instrumentos Utilizados'
            )}
            {renderArrayField(
              reportData.fieldValues?.musical_techniques,
              'Técnicas Aplicadas'
            )}
            {renderArrayField(
              reportData.fieldValues?.musical_genres,
              'Gêneros Musicais'
            )}
          </CardContent>
        </Card>

        {/* Assessment Scales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Avaliação Musical</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reportData.fieldValues?.musical_response_scale && renderScaleValue(
              reportData.fieldValues.musical_response_scale,
              'Resposta Musical'
            )}
            {reportData.fieldValues?.rhythm_coordination && renderScaleValue(
              reportData.fieldValues.rhythm_coordination,
              'Coordenação Rítmica'
            )}
            {reportData.fieldValues?.musical_communication && renderScaleValue(
              reportData.fieldValues.musical_communication,
              'Comunicação Musical'
            )}
            {reportData.fieldValues?.emotional_regulation && renderScaleValue(
              reportData.fieldValues.emotional_regulation,
              'Autorregulação'
            )}
            {reportData.fieldValues?.social_interaction && renderScaleValue(
              reportData.fieldValues.social_interaction,
              'Interação Social'
            )}
            {reportData.fieldValues?.attention_focus && renderScaleValue(
              reportData.fieldValues.attention_focus,
              'Atenção e Foco'
            )}
          </CardContent>
        </Card>
      </div>

      {/* Session Activities */}
      {isLegacyReport && reportData.fieldValues?.session_activities && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Atividades Realizadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {reportData.fieldValues.session_activities}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Patient Evolution */}
      {isLegacyReport && reportData.fieldValues?.patient_evolution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Evolução do Paciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {reportData.fieldValues.patient_evolution}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sensory Response */}
      {reportData.fieldValues?.sensory_response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Resposta Sensorial Musical</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {reportData.fieldValues.sensory_response}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {reportData.fieldValues?.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span>Recomendações</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {reportData.fieldValues.recommendations}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Home Activities */}
      {reportData.fieldValues?.home_activities && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-primary" />
              <span>Atividades para Casa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {reportData.fieldValues.home_activities}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Conclusion */}
      {reportData.fieldValues?.conclusion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Conclusão</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {reportData.fieldValues.conclusion}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Additional Observations */}
      {reportData.additionalObservations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Observações Adicionais</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {reportData.additionalObservations}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ===== Seções Clínicas Expandidas ===== */}
      {reportSections.map((section) => {
        // Evitar reapresentar técnicas/metodologias legadas quando a Etapa 04
        // já possui a seleção estruturada. Dados antigos continuam preservados.
        const hiddenRemovedStepFields = [
          'session_activities', 'patient_evolution', 'evolution_compared_baseline',
          'goals_not_achieved', 'red_flags_to_monitor',
          'domain_communication_verbal', 'domain_communication_nonverbal', 'domain_social_interaction',
          'joint_attention', 'eye_contact_quality', 'domain_emotional', 'self_regulation_strategies',
          'domain_sensory_integration', 'domain_cognitive', 'domain_motor_gross',
          'domain_motor_fine', 'domain_musicality', 'vocalizations_observed',
          'verbal_output_during_music', 'echolalia_musical', 'aac_use', 'pragmatic_skills'
        ];
        const hiddenLegacyApproachFields = [
          'theoretical_framework', 'assessment_tools_used', 'session_setting', 'session_structure',
          'improvisation_use', 'receptive_techniques', 'recreative_techniques',
          'compositional_techniques', 'tempo_dynamics_used', 'vocal_work'
        ];
        const visibleFields = selectedApproaches.length > 0
          ? section.fieldIds.filter((id) => !hiddenLegacyApproachFields.includes(id) && !hiddenRemovedStepFields.includes(id))
          : section.fieldIds;
        const filledFields = visibleFields
          .map((id) => {
            const value = reportData.fieldValues?.[id];
            if (value === undefined || value === null || value === '') return null;
            if (Array.isArray(value) && value.length === 0) return null;
            const def = musicoterapiaTemplate.fields.find((f) => f.id === id);
            return def ? { def, value } : null;
          })
          .filter(Boolean) as { def: typeof musicoterapiaTemplate.fields[number]; value: any }[];

        if (filledFields.length === 0) return null;

        return (
          <Card key={section.id} className="border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg text-primary">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filledFields.map(({ def, value }) =>
                def.type === 'scale' ? (
                  <div key={def.id}>{renderScaleValue(Number(value), def.label)}</div>
                ) : (
                  <div key={def.id} className="space-y-1">
                    <h4 className="font-medium text-primary text-sm">{def.label}</h4>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Resumo Quantitativo */}
      {(() => {
        const filled = scaleFieldIds
          .map((id) => {
            const v = Number(reportData.fieldValues?.[id]);
            if (!v) return null;
            const def = musicoterapiaTemplate.fields.find((f) => f.id === id);
            return def ? { label: def.label, value: v } : null;
          })
          .filter(Boolean) as { label: string; value: number }[];
        if (filled.length === 0) return null;
        return (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Resumo Quantitativo das Escalas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filled.map((s) => (
                <div key={s.label}>{renderScaleValue(s.value, s.label)}</div>
              ))}
            </CardContent>
          </Card>
        );
      })()}


      {/* Footer */}
      <Card className="border-2 border-primary/20">
        <CardContent className="pt-6">
          <Separator className="mb-6" />
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Relatório elaborado por: <span className="font-medium text-foreground">{professionalData?.name || reportData.professionalName}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Registro Profissional: <span className="font-medium text-foreground">{professionalData?.register || reportData.professionalRegistry || 'Não informado'}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Data de elaboração: <span className="font-medium text-foreground">{formatDate(new Date())}</span>
            </p>
            <p className="text-xs text-muted-foreground opacity-75 mt-4">
              Documento gerado eletronicamente - Plataforma MuseTera
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}