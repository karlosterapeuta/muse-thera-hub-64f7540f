import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, Users, Target, AlertTriangle, CheckCircle, 
  FileText, Play, BookOpen, Settings, Download
} from 'lucide-react';
import { Activity } from '../types';

interface ActivityDetailDialogProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityDetailDialog: React.FC<ActivityDetailDialogProps> = ({
  activity,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!activity) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{activity.title}</DialogTitle>
              <DialogDescription className="text-base">
                {activity.description}
              </DialogDescription>
            </div>
            <Badge className={getDifficultyColor(activity.difficulty)}>
              {getDifficultyLabel(activity.difficulty)}
            </Badge>
          </div>
        </DialogHeader>

        {/* Informações básicas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Duração</p>
              <p className="text-sm text-muted-foreground">{activity.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Idade</p>
              <p className="text-sm text-muted-foreground">{activity.ageGroup}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Objetivos</p>
              <p className="text-sm text-muted-foreground">{activity.objectives?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Áreas</p>
              <p className="text-sm text-muted-foreground">{activity.therapeuticAreas?.length || 0}</p>
            </div>
          </div>
        </div>

        <Separator />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="instructions">Instruções</TabsTrigger>
            <TabsTrigger value="session">Sessão</TabsTrigger>
            <TabsTrigger value="adaptations">Adaptações</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Objetivos */}
            {activity.objectives && activity.objectives.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objetivos Terapêuticos
                </h3>
                <ul className="space-y-1">
                  {activity.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Áreas terapêuticas */}
            {activity.therapeuticAreas && activity.therapeuticAreas.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Áreas Terapêuticas</h3>
                <div className="flex flex-wrap gap-2">
                  {activity.therapeuticAreas.map((area) => (
                    <Badge key={area} variant="secondary">{area}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Materiais */}
            {activity.materials && activity.materials.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Materiais Necessários</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {activity.materials.map((material, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-sm">{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefícios */}
            {activity.benefits && activity.benefits.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Benefícios Esperados</h3>
                <ul className="space-y-1">
                  {activity.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contraindicações */}
            {activity.contraindications && activity.contraindications.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Contraindicações
                </h3>
                <ul className="space-y-1">
                  {activity.contraindications.map((contraindication, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{contraindication}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {activity.tags && activity.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {activity.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="instructions" className="mt-4 space-y-4">
            {activity.instructions && activity.instructions.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Instruções Passo a Passo
                </h3>
                <ol className="space-y-3">
                  {activity.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="text-muted-foreground">Instruções detalhadas não disponíveis para esta atividade.</p>
            )}

            {/* Critérios de avaliação */}
            {activity.evaluationCriteria && activity.evaluationCriteria.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Critérios de Avaliação</h3>
                <ul className="space-y-1">
                  {activity.evaluationCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="session" className="mt-4 space-y-4">
            {activity.sessionPlan ? (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Estrutura da Sessão
                </h3>
                
                <div className="space-y-4">
                  {activity.sessionPlan.warmUp && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Aquecimento</h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">{activity.sessionPlan.warmUp}</p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Atividade Principal</h4>
                    <p className="text-sm text-green-800 dark:text-green-200">{activity.sessionPlan.mainActivity}</p>
                  </div>
                  
                  {activity.sessionPlan.coolDown && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Encerramento</h4>
                      <p className="text-sm text-purple-800 dark:text-purple-200">{activity.sessionPlan.coolDown}</p>
                    </div>
                  )}
                </div>

                {/* Variações */}
                {activity.sessionPlan.variations && activity.sessionPlan.variations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Variações Possíveis</h4>
                    <ul className="space-y-1">
                      {activity.sessionPlan.variations.map((variation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{variation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Passos de progressão */}
                {activity.sessionPlan.progressionSteps && activity.sessionPlan.progressionSteps.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Progressão de Dificuldade</h4>
                    <div className="space-y-2">
                      {activity.sessionPlan.progressionSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 border rounded">
                          <div className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Plano de sessão detalhado não disponível para esta atividade.</p>
            )}
          </TabsContent>

          <TabsContent value="adaptations" className="mt-4 space-y-4">
            {activity.adaptations && activity.adaptations.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Adaptações e Modificações
                </h3>
                <div className="space-y-3">
                  {activity.adaptations.map((adaptation, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="text-sm">{adaptation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Sugestões de adaptação não disponíveis para esta atividade.</p>
            )}
          </TabsContent>

          <TabsContent value="resources" className="mt-4 space-y-4">
            {activity.resourceLinks && activity.resourceLinks.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recursos Complementares
                </h3>
                <div className="space-y-3">
                  {activity.resourceLinks.map((resource, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          {resource.description && (
                            <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                          )}
                          <Badge variant="outline" className="mt-2">
                            {resource.type}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Acessar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Recursos complementares não disponíveis para esta atividade.</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};