import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  GitCompare,
  Clock,
  Users,
  Target,
  Star,
  X,
  Plus,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  Scale
} from 'lucide-react';
import { Activity } from '../types';
import { ActivityCard } from './ActivityCard';

interface ActivityComparisonProps {
  allActivities: Activity[];
  onViewActivity: (activity: Activity) => void;
}

interface ComparisonCriteria {
  id: string;
  name: string;
  getValue: (activity: Activity) => string | number;
  format?: (value: any) => string;
  type: 'text' | 'number' | 'array' | 'difficulty';
}

export const ActivityComparison: React.FC<ActivityComparisonProps> = ({
  allActivities,
  onViewActivity
}) => {
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);
  const [comparisonView, setComparisonView] = useState<'detailed' | 'summary'>('detailed');

  const comparisonCriteria: ComparisonCriteria[] = [
    {
      id: 'title',
      name: 'Título',
      getValue: (activity) => activity.title,
      type: 'text'
    },
    {
      id: 'category',
      name: 'Categoria',
      getValue: (activity) => activity.category,
      type: 'text'
    },
    {
      id: 'difficulty',
      name: 'Dificuldade',
      getValue: (activity) => activity.difficulty,
      type: 'difficulty'
    },
    {
      id: 'duration',
      name: 'Duração',
      getValue: (activity) => parseInt(activity.duration) || 0,
      format: (value) => `${value} min`,
      type: 'number'
    },
    {
      id: 'ageGroup',
      name: 'Faixa Etária',
      getValue: (activity) => activity.ageGroup,
      type: 'text'
    },
    {
      id: 'objectives',
      name: 'Objetivos',
      getValue: (activity) => activity.objectives?.length || 0,
      format: (value) => `${value} objetivos`,
      type: 'number'
    },
    {
      id: 'materials',
      name: 'Materiais',
      getValue: (activity) => activity.materials?.length || 0,
      format: (value) => `${value} materiais`,
      type: 'number'
    },
    {
      id: 'therapeuticAreas',
      name: 'Áreas Terapêuticas',
      getValue: (activity) => activity.therapeuticAreas?.length || 0,
      format: (value) => `${value} áreas`,
      type: 'number'
    },
    {
      id: 'preparationSteps',
      name: 'Preparação',
      getValue: (activity) => activity.preparationSteps?.length || 0,
      format: (value) => value === 0 ? 'Sem preparação' : `${value} etapas`,
      type: 'number'
    },
    {
      id: 'tags',
      name: 'Tags',
      getValue: (activity) => activity.tags?.length || 0,
      format: (value) => `${value} tags`,
      type: 'number'
    }
  ];

  const filteredActivities = useMemo(() => {
    if (!searchTerm) return allActivities;
    
    return allActivities.filter(activity =>
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [allActivities, searchTerm]);

  const handleAddActivity = (activity: Activity) => {
    if (selectedActivities.length >= 4) return; // Max 4 activities for comparison
    
    if (!selectedActivities.find(a => a.id === activity.id)) {
      setSelectedActivities([...selectedActivities, activity]);
    }
    setIsSelectDialogOpen(false);
  };

  const handleRemoveActivity = (activityId: number) => {
    setSelectedActivities(selectedActivities.filter(a => a.id !== activityId));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'hard': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
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

  const compareValues = (criterion: ComparisonCriteria, activities: Activity[]) => {
    const values = activities.map(activity => criterion.getValue(activity));
    
    if (criterion.type === 'number') {
      const numValues = values as number[];
      const max = Math.max(...numValues);
      const min = Math.min(...numValues);
      
      return numValues.map(value => ({
        value,
        formatted: criterion.format ? criterion.format(value) : value.toString(),
        status: value === max ? 'best' : value === min ? 'worst' : 'neutral'
      }));
    }
    
    return values.map(value => ({
      value,
      formatted: criterion.format ? criterion.format(value) : value.toString(),
      status: 'neutral' as const
    }));
  };

  const getRecommendation = () => {
    if (selectedActivities.length < 2) return null;

    const scores = selectedActivities.map(activity => {
      let score = 0;
      
      // Shorter activities get higher scores for quick sessions
      const duration = parseInt(activity.duration) || 0;
      if (duration <= 20) score += 3;
      else if (duration <= 40) score += 2;
      else score += 1;
      
      // Easy activities get higher scores for beginners
      if (activity.difficulty === 'easy') score += 3;
      else if (activity.difficulty === 'medium') score += 2;
      else score += 1;
      
      // More objectives = better
      score += Math.min((activity.objectives?.length || 0), 5);
      
      // Less preparation needed = better
      const prepSteps = activity.preparationSteps?.length || 0;
      if (prepSteps <= 3) score += 2;
      else if (prepSteps <= 6) score += 1;
      
      return { activity, score };
    });

    const recommended = scores.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    return recommended.activity;
  };

  const recommendedActivity = getRecommendation();

  if (selectedActivities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Comparar Atividades
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Compare até 4 atividades lado a lado para escolher a melhor opção
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Scale className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhuma atividade selecionada</h3>
            <p className="text-muted-foreground mb-4">
              Adicione atividades para começar a comparação
            </p>
            <Dialog open={isSelectDialogOpen} onOpenChange={setIsSelectDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Atividades
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Selecionar Atividades para Comparar</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar atividades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredActivities.slice(0, 12).map((activity) => (
                      <div key={activity.id} className="relative">
                        <ActivityCard
                          activity={activity}
                          onViewDetails={() => handleAddActivity(activity)}
                          categoryColor="#3B82F6"
                        />
                        <Button
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddActivity(activity);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Comparação de Atividades
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {selectedActivities.length} atividade{selectedActivities.length !== 1 ? 's' : ''} selecionada{selectedActivities.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={comparisonView === 'summary' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setComparisonView('summary')}
              >
                Resumo
              </Button>
              <Button
                variant={comparisonView === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setComparisonView('detailed')}
              >
                Detalhado
              </Button>
              
              <Dialog open={isSelectDialogOpen} onOpenChange={setIsSelectDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={selectedActivities.length >= 4}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar {selectedActivities.length >= 4 ? '(Máx. 4)' : ''}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Atividade</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar atividades..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredActivities
                        .filter(activity => !selectedActivities.find(a => a.id === activity.id))
                        .slice(0, 12)
                        .map((activity) => (
                          <div key={activity.id} className="relative">
                            <ActivityCard
                              activity={activity}
                              onViewDetails={() => handleAddActivity(activity)}
                              categoryColor="#3B82F6"
                            />
                            <Button
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddActivity(activity);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        {/* Selected activities preview */}
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {selectedActivities.map((activity) => (
              <div key={activity.id} className="flex-shrink-0 relative">
                <Card className="w-48">
                  <CardContent className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => handleRemoveActivity(activity.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm line-clamp-2">{activity.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {activity.duration}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getDifficultyColor(activity.difficulty)}`}
                      >
                        {getDifficultyLabel(activity.difficulty)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendation */}
      {recommendedActivity && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-900 dark:text-green-100">
                  Recomendação: {recommendedActivity.title}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Baseado na dificuldade, duração e objetivos, esta é a melhor opção para começar.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewActivity(recommendedActivity)}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Ver Detalhes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Critério</th>
                  {selectedActivities.map((activity) => (
                    <th key={activity.id} className="text-left p-4 min-w-48">
                      <div className="space-y-1">
                        <div className="font-medium text-sm line-clamp-2">{activity.title}</div>
                        <Badge variant="outline" className="text-xs">
                          {activity.category}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonCriteria.map((criterion) => {
                  const comparisons = compareValues(criterion, selectedActivities);
                  
                  return (
                    <tr key={criterion.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">{criterion.name}</td>
                      {comparisons.map((comparison, index) => (
                        <td key={index} className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={
                              criterion.type === 'difficulty' 
                                ? `px-2 py-1 rounded text-xs ${getDifficultyColor(comparison.value as string)}`
                                : ''
                            }>
                              {comparison.formatted}
                            </span>
                            {comparison.status === 'best' && criterion.type === 'number' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {comparison.status === 'worst' && criterion.type === 'number' && (
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary View */}
      {comparisonView === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {selectedActivities.map((activity) => (
            <Card key={activity.id} className="relative">
              <CardContent className="p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => handleRemoveActivity(activity.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium line-clamp-2 mb-2">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {activity.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Dificuldade:</span>
                      <Badge className={getDifficultyColor(activity.difficulty)}>
                        {getDifficultyLabel(activity.difficulty)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Duração:</span>
                      <span>{activity.duration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Objetivos:</span>
                      <span>{activity.objectives?.length || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Preparação:</span>
                      <span>{activity.preparationSteps?.length || 0} etapas</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onViewActivity(activity)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};