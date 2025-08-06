import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Settings, Users, User, Clock, CheckCircle } from "lucide-react";
import { PreparationStep, PreparationItem } from "../types";

interface PreparationChecklistProps {
  preparationSteps: PreparationStep[];
  onComplete?: (completed: boolean) => void;
}

export function PreparationChecklist({ preparationSteps, onComplete }: PreparationChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const getCategoryIcon = (category: PreparationStep['category']) => {
    switch (category) {
      case 'environment':
        return <Settings className="h-4 w-4" />;
      case 'materials':
        return <Settings className="h-4 w-4" />;
      case 'therapist':
        return <User className="h-4 w-4" />;
      case 'participants':
        return <Users className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: PreparationStep['category']) => {
    switch (category) {
      case 'environment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'materials':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'therapist':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'participants':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getCategoryLabel = (category: PreparationStep['category']) => {
    switch (category) {
      case 'environment':
        return 'Ambiente';
      case 'materials':
        return 'Materiais';
      case 'therapist':
        return 'Terapeuta';
      case 'participants':
        return 'Participantes';
      default:
        return 'Geral';
    }
  };

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => {
      const newChecked = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      // Verifica se todos os itens obrigatórios estão marcados
      const allRequiredItems = preparationSteps
        .flatMap(step => step.items.filter(item => item.required))
        .map(item => item.id);
      
      const allRequiredChecked = allRequiredItems.every(id => newChecked.includes(id));
      onComplete?.(allRequiredChecked);
      
      return newChecked;
    });
  };

  const getTotalEstimatedTime = () => {
    let totalMinutes = 0;
    preparationSteps.forEach(step => {
      step.items.forEach(item => {
        if (item.timeNeeded) {
          const time = item.timeNeeded.match(/(\d+)/);
          if (time) totalMinutes += parseInt(time[1]);
        }
      });
    });
    return totalMinutes > 0 ? `${totalMinutes} min` : 'N/A';
  };

  const getCompletionStats = () => {
    const totalItems = preparationSteps.reduce((sum, step) => sum + step.items.length, 0);
    const completedItems = checkedItems.length;
    const requiredItems = preparationSteps.reduce(
      (sum, step) => sum + step.items.filter(item => item.required).length, 
      0
    );
    const completedRequired = preparationSteps
      .flatMap(step => step.items.filter(item => item.required))
      .filter(item => checkedItems.includes(item.id))
      .length;

    return {
      total: totalItems,
      completed: completedItems,
      required: requiredItems,
      completedRequired,
      percentage: Math.round((completedItems / totalItems) * 100) || 0
    };
  };

  const stats = getCompletionStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Lista de Preparação</h3>
          <p className="text-sm text-muted-foreground">
            Tempo estimado: {getTotalEstimatedTime()} • {stats.completed}/{stats.total} itens concluídos
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">
              {stats.completedRequired}/{stats.required} obrigatórios
            </span>
          </div>
          <div className="w-32 bg-secondary rounded-full h-2 mt-1">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {preparationSteps.map((step, stepIndex) => (
          <Card key={stepIndex}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className={`p-2 rounded-lg ${getCategoryColor(step.category)}`}>
                  {getCategoryIcon(step.category)}
                </div>
                {step.title}
                <Badge variant="outline" className="ml-auto">
                  {getCategoryLabel(step.category)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {step.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                      checkedItems.includes(item.id)
                        ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                        : 'bg-muted/30 border-border hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox
                      id={item.id}
                      checked={checkedItems.includes(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={item.id}
                        className={`text-sm cursor-pointer ${
                          checkedItems.includes(item.id) ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {item.description}
                        {item.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      
                      <div className="flex items-center gap-2 mt-1">
                        {item.timeNeeded && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Clock className="h-3 w-3" />
                            {item.timeNeeded}
                          </Badge>
                        )}
                        {item.required && (
                          <Badge variant="destructive" className="text-xs">
                            Obrigatório
                          </Badge>
                        )}
                      </div>
                      
                      {item.notes && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.completedRequired === stats.required && stats.required > 0 && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Preparação básica concluída! Todos os itens obrigatórios foram verificados.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}