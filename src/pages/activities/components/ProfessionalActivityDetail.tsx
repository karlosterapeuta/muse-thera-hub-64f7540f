import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Target, 
  Clock, 
  GraduationCap, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen,
  BarChart3,
  Settings2
} from "lucide-react";
import { ProfessionalActivity, disorderInfo, demandCategoryInfo } from "@/data/activities-by-disorder";
import { cn } from "@/lib/utils";

interface ProfessionalActivityDetailProps {
  activity: ProfessionalActivity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const complexityColors = {
  leve: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  moderado: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  severo: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
};

const complexityLabels = {
  leve: "Nível 1 - Suporte Leve",
  moderado: "Nível 2 - Suporte Moderado",
  severo: "Nível 3 - Suporte Intensivo"
};

export function ProfessionalActivityDetail({ activity, open, onOpenChange }: ProfessionalActivityDetailProps) {
  if (!activity) return null;

  const disorder = disorderInfo[activity.disorder];
  const categoryInfo = demandCategoryInfo[activity.demandCategory];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className={cn(
          "p-6 pb-4 bg-gradient-to-r text-white rounded-t-lg",
          disorder.color
        )}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold mb-2">
                {activity.title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {disorder.icon} {disorder.name}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {categoryInfo.icon} {categoryInfo.name}
                </Badge>
                <Badge variant="secondary" className={cn("border", complexityColors[activity.complexityLevel])}>
                  {complexityLabels[activity.complexityLevel]}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-150px)]">
          <div className="p-6 space-y-6">
            {/* Objetivo Geral */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Objetivo Geral</h3>
              </div>
              <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
                {activity.generalObjective}
              </p>
            </section>

            {/* Objetivos Específicos */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-lg">Objetivos Específicos</h3>
              </div>
              <ul className="space-y-2">
                {activity.specificObjectives.map((obj, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary font-medium">{index + 1}.</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Informações Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Duração</p>
                <p className="font-medium text-sm">{activity.estimatedTime}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <GraduationCap className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Faixa Etária</p>
                <p className="font-medium text-sm">{activity.ageRange}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <BarChart3 className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Complexidade</p>
                <p className="font-medium text-sm capitalize">{activity.complexityLevel}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <Package className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Materiais</p>
                <p className="font-medium text-sm">{activity.materials.length} itens</p>
              </div>
            </div>

            <Separator />

            {/* Descrição */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Descrição da Atividade</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {activity.description}
              </p>
            </section>

            {/* Materiais */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-lg">Materiais Necessários</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {activity.materials.map((material, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {material}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Critérios de Avaliação */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">Critérios de Avaliação</h3>
              </div>
              <ul className="space-y-2">
                {activity.evaluationCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Adaptações */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Settings2 className="h-5 w-5 text-cyan-600" />
                <h3 className="font-semibold text-lg">Adaptações por Nível de Suporte</h3>
              </div>
              <ul className="space-y-2">
                {activity.adaptations.map((adaptation, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    <span className="text-primary font-medium">•</span>
                    <span>{adaptation}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Contraindicações */}
            {activity.contraindications && activity.contraindications.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-lg">Contraindicações/Precauções</h3>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {activity.contraindications.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Dicas */}
            {activity.tips && activity.tips.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-lg">Dicas Práticas</h3>
                </div>
                <ul className="space-y-2">
                  {activity.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-600 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Fundamentação Teórica */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-lg">Fundamentação Teórica</h3>
              </div>
              <p className="text-muted-foreground italic bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
                {activity.theoreticalBasis}
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
