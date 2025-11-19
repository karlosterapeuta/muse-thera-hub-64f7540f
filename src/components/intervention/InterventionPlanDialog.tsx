import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Activity, Target, Clock, Lightbulb, ListChecks } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { InterventionPlan } from "@/hooks/useInterventionPlans";

interface InterventionPlanDialogProps {
  plan: InterventionPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (plan: InterventionPlan) => void;
}

export function InterventionPlanDialog({ plan, open, onOpenChange, onDownload }: InterventionPlanDialogProps) {
  if (!plan) return null;

  const activities = plan.complementary_materials?.activities || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{plan.patient_name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4" />
                Criado em {format(new Date(plan.created_at), "PPP", { locale: ptBR })}
              </DialogDescription>
            </div>
            <Button onClick={() => onDownload(plan)} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-150px)] pr-4">
          <div className="space-y-6">
            {/* Plan Info */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="font-semibold">
                  {activities.length} {activities.length === 1 ? 'Atividade' : 'Atividades'}
                </span>
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                Atividades do Plano
              </h3>

              {activities.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma atividade disponível neste plano.
                </p>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                      {/* Activity Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{activity.name}</h4>
                          <Badge variant="secondary" className="mt-2">
                            {activity.complexity}
                          </Badge>
                        </div>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>

                      {/* General Objective */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Target className="h-4 w-4 text-primary" />
                          Objetivo Geral
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">
                          {activity.generalObjective}
                        </p>
                      </div>

                      {/* Specific Objective */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          Objetivo Específico
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">
                          {activity.specificObjective}
                        </p>
                      </div>

                      {/* Estimated Time */}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Tempo Estimado:</span>
                        <span className="text-muted-foreground">{activity.estimatedTime}</span>
                      </div>

                      {/* Materials */}
                      {activity.materials && activity.materials.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Materiais Necessários:</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                            {activity.materials.map((material, idx) => (
                              <li key={idx}>{material}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Evaluation Criteria */}
                      {activity.evaluationCriteria && activity.evaluationCriteria.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Critérios de Avaliação:</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                            {activity.evaluationCriteria.map((criteria, idx) => (
                              <li key={idx}>{criteria}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Associated Demand */}
                      {activity.associatedDemand && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Demanda Associada:</span> {activity.associatedDemand}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
