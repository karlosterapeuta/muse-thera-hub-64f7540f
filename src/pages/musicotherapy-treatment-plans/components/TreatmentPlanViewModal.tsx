import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, User, FileText, Target, Music, Clock, CheckCircle, Activity, BarChart, Users, RefreshCw } from 'lucide-react';
import { useSingleTreatmentPlan } from '@/hooks/useSingleTreatmentPlan';

interface TreatmentPlanViewModalProps {
  planId: string | null;
  open: boolean;
  onClose: () => void;
}

export const TreatmentPlanViewModal: React.FC<TreatmentPlanViewModalProps> = ({
  planId,
  open,
  onClose,
}) => {
  const { data: plan, isLoading } = useSingleTreatmentPlan(planId);

  const renderSection = (title: string, icon: React.ElementType, children: React.ReactNode) => {
    const IconComponent = icon;
    return (
      <div className="bg-muted/50 border-l-4 border-primary p-4 mb-4 rounded-r-lg">
        <div className="flex items-center mb-3">
          <IconComponent className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        {children}
      </div>
    );
  };

  const renderListItems = (items: string[] | undefined, emptyText = "Não especificado") => {
    if (!items || items.length === 0) return <p className="text-muted-foreground text-sm">{emptyText}</p>;
    return (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-foreground text-sm">{item}</li>
        ))}
      </ul>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'ativo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
      case 'concluído':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
      case 'rascunho':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-full max-w-4xl h-[90vh] sm:h-[85vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-4 sm:p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">
                {isLoading ? 'Carregando...' : plan?.patient_full_name || 'Plano Musicoterapêutico'}
              </DialogTitle>
              {plan && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusColor(plan.status || 'draft')}>
                    {plan.status || 'Rascunho'}
                  </Badge>
                  {plan.clinical_diagnosis && (
                    <span className="text-sm text-muted-foreground">{plan.clinical_diagnosis}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : plan ? (
            <div className="space-y-2 py-4">
              {/* 1. Patient Identification */}
              {renderSection("1. Identificação do Paciente", User, (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Nome completo:</p>
                    <p className="text-sm font-medium">{plan.patient_full_name || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Data de nascimento:</p>
                    <p className="text-sm font-medium">
                      {plan.patient_birth_date ? new Date(plan.patient_birth_date).toLocaleDateString('pt-BR') : 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Idade:</p>
                    <p className="text-sm font-medium">{plan.patient_age || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Diagnóstico clínico:</p>
                    <p className="text-sm font-medium">{plan.clinical_diagnosis || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Responsável:</p>
                    <p className="text-sm font-medium">{plan.responsible_person || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Data de início:</p>
                    <p className="text-sm font-medium">
                      {plan.plan_start_date ? new Date(plan.plan_start_date).toLocaleDateString('pt-BR') : 'Não informado'}
                    </p>
                  </div>
                </div>
              ))}

              {/* 2. Initial Assessment */}
              {renderSection("2. Avaliação Inicial", FileText, (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Histórico clínico e familiar:</p>
                    <p className="text-sm">{plan.clinical_family_history || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Condições físicas, cognitivas, emocionais:</p>
                    <p className="text-sm">{plan.physical_cognitive_conditions || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nível de interação e comunicação:</p>
                    <p className="text-sm">{plan.interaction_communication_level || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Interesses musicais:</p>
                    <p className="text-sm">{plan.musical_interests || 'Não informado'}</p>
                  </div>
                </div>
              ))}

              {/* 3. General Objectives */}
              {renderSection("3. Objetivos Gerais", Target, (
                renderListItems(plan.general_objectives, "Nenhum objetivo geral definido")
              ))}

              {/* 4. Specific Objectives */}
              {renderSection("4. Objetivos Específicos", CheckCircle, (
                renderListItems(plan.specific_objectives, "Nenhum objetivo específico definido")
              ))}

              {/* 5. Musicotherapy Resources */}
              {renderSection("5. Recursos Musicoterapêuticos", Music, (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Instrumentos musicais:</p>
                    {renderListItems(plan.musical_instruments)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Recursos tecnológicos:</p>
                    {renderListItems(plan.technological_resources)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Voz e corpo:</p>
                    {renderListItems(plan.voice_body_resources)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Materiais complementares:</p>
                    {renderListItems(plan.complementary_materials)}
                  </div>
                </div>
              ))}

              {/* 6. Strategies and Techniques */}
              {renderSection("6. Estratégias e Técnicas", Activity, (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Improvisação musical:</p>
                    <p className="text-sm">{plan.musical_improvisation || 'Não especificado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Recriação musical:</p>
                    <p className="text-sm">{plan.musical_recreation || 'Não especificado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Composição:</p>
                    <p className="text-sm">{plan.musical_composition || 'Não especificado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Escuta receptiva:</p>
                    <p className="text-sm">{plan.receptive_listening || 'Não especificado'}</p>
                  </div>
                </div>
              ))}

              {/* 7. Frequency and Duration */}
              {renderSection("7. Frequência e Duração", Clock, (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Sessões semanais:</p>
                    <p className="text-sm font-medium">{plan.weekly_sessions || 0}x por semana</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duração da sessão:</p>
                    <p className="text-sm font-medium">{plan.session_duration_minutes || 0} minutos</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Período estimado:</p>
                    <p className="text-sm font-medium">{plan.estimated_period_months || 0} meses</p>
                  </div>
                </div>
              ))}

              {/* 8. Evaluation Criteria */}
              {renderSection("8. Critérios de Avaliação", BarChart, (
                renderListItems(plan.evaluation_criteria_list, "Nenhum critério de avaliação definido")
              ))}

              {/* 9. Plan in Action */}
              {renderSection("9. Plano em Ação", Users, (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Estrutura das sessões:</p>
                    <p className="text-sm">{plan.session_structure || 'Não especificado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Sequência de atividades:</p>
                    <p className="text-sm">{plan.activity_sequence || 'Não especificado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Flexibilidade para ajustes:</p>
                    <p className="text-sm">{plan.flexibility_adjustments || 'Não especificado'}</p>
                  </div>
                </div>
              ))}

              {/* 10. Re-evaluation */}
              {renderSection("10. Reavaliação e Evolução", RefreshCw, (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Frequência da reavaliação:</p>
                    <p className="text-sm">{plan.reevaluation_frequency || 'Não especificado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Registro da evolução:</p>
                    <p className="text-sm">{plan.evolution_recording || 'Não especificado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Ajustes necessários:</p>
                    <p className="text-sm">{plan.necessary_adjustments || 'Não especificado'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Plano não encontrado
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 p-4 sm:p-6 border-t">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};