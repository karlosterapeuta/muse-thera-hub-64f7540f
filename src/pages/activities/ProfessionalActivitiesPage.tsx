import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DisorderTabs } from "./components/DisorderTabs";
import { DemandCategorySection } from "./components/DemandCategorySection";
import { ProfessionalActivityDetail } from "./components/ProfessionalActivityDetail";
import { 
  DisorderType, 
  DemandCategory,
  ProfessionalActivity, 
  professionalActivities, 
  disorderInfo, 
  demandCategoryInfo,
  getActivitiesByDisorder,
  getDemandCategoriesForDisorder
} from "@/data/activities-by-disorder";
import { cn } from "@/lib/utils";

export default function ProfessionalActivitiesPage() {
  const [selectedDisorder, setSelectedDisorder] = useState<DisorderType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<ProfessionalActivity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Filtra atividades baseado na seleção e busca
  const filteredActivities = useMemo(() => {
    let activities = selectedDisorder === 'all' 
      ? professionalActivities 
      : getActivitiesByDisorder(selectedDisorder);

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      activities = activities.filter(a => 
        a.title.toLowerCase().includes(search) ||
        a.generalObjective.toLowerCase().includes(search) ||
        a.demandLabel.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search) ||
        a.materials.some(m => m.toLowerCase().includes(search))
      );
    }

    return activities;
  }, [selectedDisorder, searchTerm]);

  // Agrupa atividades por demanda
  const activitiesByDemand = useMemo(() => {
    const grouped: Record<DemandCategory, ProfessionalActivity[]> = {} as Record<DemandCategory, ProfessionalActivity[]>;
    
    filteredActivities.forEach(activity => {
      if (!grouped[activity.demandCategory]) {
        grouped[activity.demandCategory] = [];
      }
      grouped[activity.demandCategory].push(activity);
    });

    return grouped;
  }, [filteredActivities]);

  const handleActivityClick = (activity: ProfessionalActivity) => {
    setSelectedActivity(activity);
    setDetailOpen(true);
  };

  const handleClearFilters = () => {
    setSelectedDisorder('all');
    setSearchTerm('');
  };

  // Estatísticas
  const stats = useMemo(() => {
    const byDisorder: Record<DisorderType, number> = {
      TEA: getActivitiesByDisorder('TEA').length,
      TDAH: getActivitiesByDisorder('TDAH').length,
      TOD: getActivitiesByDisorder('TOD').length,
      DI: getActivitiesByDisorder('DI').length,
    };
    return {
      total: professionalActivities.length,
      byDisorder,
      filtered: filteredActivities.length
    };
  }, [filteredActivities.length]);

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
            📋 Atividades por Demanda
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto">
            Atividades profissionais validadas e organizadas por transtorno e demanda específica.
            Cada atividade inclui objetivos, materiais, critérios de avaliação e fundamentação teórica.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{stats.total}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total de Atividades</p>
            </CardContent>
          </Card>
          {(Object.entries(stats.byDisorder) as [DisorderType, number][]).map(([disorder, count]) => (
            <Card 
              key={disorder} 
              className={cn(
                "border-l-4 cursor-pointer transition-all hover:shadow-md",
                selectedDisorder === disorder && "ring-2 ring-primary",
                disorder === 'TEA' && "border-l-blue-500",
                disorder === 'TDAH' && "border-l-orange-500",
                disorder === 'TOD' && "border-l-red-500",
                disorder === 'DI' && "border-l-purple-500"
              )}
              onClick={() => setSelectedDisorder(disorder)}
            >
              <CardContent className="p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold">{count}</p>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <span>{disorderInfo[disorder].icon}</span>
                  {disorder}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, objetivo, demanda ou material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {(searchTerm || selectedDisorder !== 'all') && (
            <Button variant="outline" onClick={handleClearFilters} className="shrink-0">
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Results count */}
        {(searchTerm || selectedDisorder !== 'all') && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-sm">
              {stats.filtered} {stats.filtered === 1 ? 'atividade encontrada' : 'atividades encontradas'}
            </Badge>
            {selectedDisorder !== 'all' && (
              <Badge 
                variant="outline" 
                className={cn(
                  "bg-gradient-to-r text-white",
                  disorderInfo[selectedDisorder].color
                )}
              >
                {disorderInfo[selectedDisorder].icon} {disorderInfo[selectedDisorder].name}
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="outline">
                Busca: "{searchTerm}"
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Disorder Tabs */}
      <div className="max-w-7xl mx-auto">
        <DisorderTabs 
          selectedDisorder={selectedDisorder} 
          onDisorderChange={setSelectedDisorder}
        >
          {/* Selected Disorder Info */}
          {selectedDisorder !== 'all' && (
            <Card className={cn(
              "mb-6 bg-gradient-to-r text-white",
              disorderInfo[selectedDisorder].color
            )}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="text-2xl">{disorderInfo[selectedDisorder].icon}</span>
                  {disorderInfo[selectedDisorder].name}
                </CardTitle>
                <CardDescription className="text-white/80">
                  {disorderInfo[selectedDisorder].description}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Activities grouped by demand */}
          {filteredActivities.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(activitiesByDemand).map(([category, activities]) => (
                <DemandCategorySection
                  key={category}
                  category={category as DemandCategory}
                  activities={activities}
                  onActivityClick={handleActivityClick}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Nenhuma atividade encontrada</p>
                <p className="text-sm mb-4">Tente ajustar os filtros ou termos de busca</p>
                <Button variant="outline" onClick={handleClearFilters}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </Card>
          )}
        </DisorderTabs>
      </div>

      {/* Activity Detail Dialog */}
      <ProfessionalActivityDetail
        activity={selectedActivity}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
