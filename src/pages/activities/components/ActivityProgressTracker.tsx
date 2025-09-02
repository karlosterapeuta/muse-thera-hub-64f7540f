import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  Circle,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Calendar,
  Award,
  Timer,
  Activity,
  BookOpen,
  Star
} from 'lucide-react';
import { format, differenceInMinutes, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityProgress {
  activityId: string;
  activityTitle: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  startedAt?: Date;
  completedAt?: Date;
  pausedAt?: Date;
  totalTimeSpent: number; // minutes
  progressPercentage: number;
  steps: ActivityStep[];
  notes: string[];
  difficulties: string[];
  achievements: string[];
}

interface ActivityStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  timeSpent?: number;
  notes?: string;
  completedAt?: Date;
}

interface ActivityProgressTrackerProps {
  activityProgress: ActivityProgress[];
  onUpdateProgress: (activityId: string, updates: Partial<ActivityProgress>) => void;
  onStepComplete: (activityId: string, stepId: string, notes?: string) => void;
  onAddNote: (activityId: string, note: string) => void;
  onStartActivity: (activityId: string) => void;
  onPauseActivity: (activityId: string) => void;
  onCompleteActivity: (activityId: string, finalNotes?: string) => void;
}

export const ActivityProgressTracker: React.FC<ActivityProgressTrackerProps> = ({
  activityProgress,
  onUpdateProgress,
  onStepComplete,
  onAddNote,
  onStartActivity,
  onPauseActivity,
  onCompleteActivity
}) => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({});

  // Timer management
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const newTimers = { ...prev };
        Object.keys(newTimers).forEach(activityId => {
          const activity = activityProgress.find(a => a.activityId === activityId);
          if (activity?.status === 'in_progress') {
            newTimers[activityId] = (newTimers[activityId] || 0) + 1;
          }
        });
        return newTimers;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [activityProgress]);

  const getActivityById = (id: string) => {
    return activityProgress.find(a => a.activityId === id);
  };

  const selectedActivityData = selectedActivity ? getActivityById(selectedActivity) : null;

  const handleStartActivity = (activityId: string) => {
    onStartActivity(activityId);
    setActiveTimers(prev => ({ ...prev, [activityId]: 0 }));
  };

  const handlePauseActivity = (activityId: string) => {
    onPauseActivity(activityId);
    setActiveTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[activityId];
      return newTimers;
    });
  };

  const handleAddNote = () => {
    if (selectedActivity && newNote.trim()) {
      onAddNote(selectedActivity, newNote.trim());
      setNewNote('');
      setShowNoteDialog(false);
    }
  };

  const getStatusColor = (status: ActivityProgress['status']) => {
    switch (status) {
      case 'not_started':
        return 'text-gray-500';
      case 'in_progress':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'paused':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: ActivityProgress['status']) => {
    switch (status) {
      case 'not_started':
        return <Circle className="h-4 w-4" />;
      case 'in_progress':
        return <Play className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'paused':
        return <Pause className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const categorizeActivities = () => {
    return {
      inProgress: activityProgress.filter(a => a.status === 'in_progress'),
      completed: activityProgress.filter(a => a.status === 'completed'),
      paused: activityProgress.filter(a => a.status === 'paused'),
      notStarted: activityProgress.filter(a => a.status === 'not_started')
    };
  };

  const categories = categorizeActivities();

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Play className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.inProgress.length}</p>
                <p className="text-xs text-muted-foreground">Em Andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.completed.length}</p>
                <p className="text-xs text-muted-foreground">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Pause className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.paused.length}</p>
                <p className="text-xs text-muted-foreground">Pausadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatTime(activityProgress.reduce((acc, a) => acc + a.totalTimeSpent, 0))}
                </p>
                <p className="text-xs text-muted-foreground">Tempo Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="inProgress" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inProgress" className="gap-2">
            <Play className="h-4 w-4" />
            Em Andamento ({categories.inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="paused" className="gap-2">
            <Pause className="h-4 w-4" />
            Pausadas ({categories.paused.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Concluídas ({categories.completed.length})
          </TabsTrigger>
          <TabsTrigger value="notStarted" className="gap-2">
            <Circle className="h-4 w-4" />
            Não Iniciadas ({categories.notStarted.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inProgress" className="space-y-4">
          {categories.inProgress.map(activity => (
            <Card key={activity.activityId} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(activity.status)}>
                      {getStatusIcon(activity.status)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{activity.activityTitle}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Iniciada em {activity.startedAt && format(activity.startedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Timer className="h-3 w-3" />
                      {formatTime(activity.totalTimeSpent + (activeTimers[activity.activityId] || 0))}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePauseActivity(activity.activityId)}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedActivity(activity.activityId)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progresso Geral</span>
                      <span className="text-sm text-muted-foreground">
                        {activity.progressPercentage}%
                      </span>
                    </div>
                    <Progress value={activity.progressPercentage} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Etapas:</span>
                      <span className="ml-2 font-medium">
                        {activity.steps.filter(s => s.isCompleted).length}/{activity.steps.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Notas:</span>
                      <span className="ml-2 font-medium">{activity.notes.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Conquistas:</span>
                      <span className="ml-2 font-medium">{activity.achievements.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="paused" className="space-y-4">
          {categories.paused.map(activity => (
            <Card key={activity.activityId} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(activity.status)}>
                      {getStatusIcon(activity.status)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{activity.activityTitle}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Pausada em {activity.pausedAt && format(activity.pausedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Timer className="h-3 w-3" />
                      {formatTime(activity.totalTimeSpent)}
                    </Badge>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleStartActivity(activity.activityId)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continuar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={activity.progressPercentage} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {activity.progressPercentage}% concluído
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {categories.completed.map(activity => (
            <Card key={activity.activityId} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(activity.status)}>
                      {getStatusIcon(activity.status)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{activity.activityTitle}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Concluída em {activity.completedAt && format(activity.completedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Timer className="h-3 w-3" />
                      {formatTime(activity.totalTimeSpent)}
                    </Badge>
                    {activity.achievements.length > 0 && (
                      <Badge variant="default" className="gap-1">
                        <Award className="h-3 w-3" />
                        {activity.achievements.length}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      <CheckCircle className="h-4 w-4 inline mr-1 text-green-500" />
                      {activity.steps.length} etapas
                    </span>
                    <span>
                      <FileText className="h-4 w-4 inline mr-1" />
                      {activity.notes.length} notas
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedActivity(activity.activityId)}
                  >
                    Ver Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="notStarted" className="space-y-4">
          {categories.notStarted.map(activity => (
            <Card key={activity.activityId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(activity.status)}>
                      {getStatusIcon(activity.status)}
                    </div>
                    <CardTitle className="text-lg">{activity.activityTitle}</CardTitle>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleStartActivity(activity.activityId)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {activity.steps.length} etapas para completar
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Activity Detail Dialog */}
      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {selectedActivityData?.activityTitle}
            </DialogTitle>
          </DialogHeader>
          
          {selectedActivityData && (
            <div className="space-y-6">
              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedActivityData.progressPercentage}%
                    </div>
                    <p className="text-sm text-muted-foreground">Progresso</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTime(selectedActivityData.totalTimeSpent)}
                    </div>
                    <p className="text-sm text-muted-foreground">Tempo Gasto</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedActivityData.steps.filter(s => s.isCompleted).length}/{selectedActivityData.steps.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Etapas</p>
                  </CardContent>
                </Card>
              </div>

              {/* Steps */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Etapas da Atividade</h3>
                <div className="space-y-3">
                  {selectedActivityData.steps.map((step, index) => (
                    <Card key={step.id} className={step.isCompleted ? 'bg-green-50 dark:bg-green-900/10' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                            {step.isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{step.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                            {step.notes && (
                              <p className="text-sm bg-muted p-2 rounded mt-2">{step.notes}</p>
                            )}
                            {step.isCompleted && step.completedAt && (
                              <p className="text-xs text-green-600 mt-2">
                                Concluída em {format(step.completedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                              </p>
                            )}
                          </div>
                          {!step.isCompleted && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onStepComplete(selectedActivityData.activityId, step.id)}
                            >
                              Concluir
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Notas</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNoteDialog(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Adicionar Nota
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedActivityData.notes.map((note, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <p className="text-sm">{note}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {selectedActivityData.notes.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma nota adicionada ainda
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nota</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="note-text">Nota</Label>
              <Textarea
                id="note-text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Digite sua observação sobre a atividade..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddNote}>
                Adicionar Nota
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};