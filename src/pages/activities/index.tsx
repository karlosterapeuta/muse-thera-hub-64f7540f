import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { 
  Brain, Users, Heart, Move, MessageSquare, BookOpen, Music, 
  Zap, User, Lightbulb, HelpingHand, Globe, Puzzle, Target, 
  Eye, Flame, Shield, GraduationCap, FlaskConical, ShieldCheck,
  Sparkles, Church, Cross, Network, Fingerprint
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActivityFilters } from "./components/ActivityFilters";
import { ActivityCard } from "./components/ActivityCard";
import { ActivityDetailDialog } from "./components/ActivityDetailDialog";
import { ActivityStats } from "./components/ActivityStats";
import { enhancedActivitiesData } from "./data/enhanced-activities-data";
import { getCombinedActivities } from "./utils/activityMigrator";
import { Activity, ActivityFilter } from "./types";

export default function ActivitiesPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [filters, setFilters] = useState<ActivityFilter>({});
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  
  // User activity data state
  const [userActivityData, setUserActivityData] = useState({
    userId: 'user-123',
    favorites: [],
    completed: [],
    ratings: [],
    recentlyViewed: [],
    personalNotes: []
  });
  
  // Dados das categorias melhoradas
  const categories = [
    { id: "cognitive", name: "cognitive", label: "Cognitivas", icon: <Brain className="h-5 w-5" />, description: "Atividades focadas no desenvolvimento de habilidades cognitivas", color: "#3B82F6" },
    { id: "social", name: "social", label: "Sociais", icon: <Users className="h-5 w-5" />, description: "Atividades que promovem interação e cooperação", color: "#10B981" },
    { id: "emotional", name: "emotional", label: "Emocionais", icon: <Heart className="h-5 w-5" />, description: "Atividades para reconhecimento e regulação emocional", color: "#EF4444" },
    { id: "motor", name: "motor", label: "Motoras", icon: <Move className="h-5 w-5" />, description: "Atividades que trabalham coordenação motora e movimento", color: "#F59E0B" },
    { id: "language", name: "language", label: "Linguagem", icon: <MessageSquare className="h-5 w-5" />, description: "Atividades voltadas para desenvolvimento da comunicação", color: "#8B5CF6" },
    { id: "moral", name: "moral", label: "Morais", icon: <Shield className="h-5 w-5" />, description: "Atividades que exploram valores éticos e morais", color: "#6B7280" },
    { id: "creative", name: "creative", label: "Criativas", icon: <Lightbulb className="h-5 w-5" />, description: "Atividades que estimulam criatividade e improvisação", color: "#EC4899" },
    { id: "psychosexual", name: "psychosexual", label: "Psicossexuais", icon: <User className="h-5 w-5" />, description: "Atividades para desenvolvimento saudável da identidade", color: "#14B8A6" },
    { id: "psychosocial", name: "psychosocial", label: "Psicossociais", icon: <Users className="h-5 w-5" />, description: "Atividades baseadas no desenvolvimento psicossocial", color: "#F97316" },
    { id: "intellectual", name: "intellectual", label: "Intelectuais", icon: <GraduationCap className="h-5 w-5" />, description: "Atividades que estimulam raciocínio abstrato", color: "#0EA5E9" },
    { id: "adaptive", name: "adaptive", label: "Adaptativas", icon: <Puzzle className="h-5 w-5" />, description: "Atividades que desenvolvem resiliência e adaptação", color: "#84CC16" },
    { id: "spiritual", name: "spiritual", label: "Espirituais", icon: <Church className="h-5 w-5" />, description: "Atividades que exploram a dimensão espiritual", color: "#A855F7" },
    { id: "neurological", name: "neurological", label: "Desenvolvimento Neurológico", icon: <Network className="h-5 w-5" />, description: "Atividades para estimular desenvolvimento neurológico", color: "#059669" },
    { id: "identity", name: "identity", label: "Identidade", icon: <Fingerprint className="h-5 w-5" />, description: "Atividades focadas no fortalecimento da identidade pessoal", color: "#DC2626" }
  ];
  
  // Obter todas as atividades de forma unificada (enhanced + migrated)
  const allActivities = useMemo(() => {
    const combinedData = getCombinedActivities(enhancedActivitiesData);
    return Object.values(combinedData).flat();
  }, []);

  // Obter todas as tags disponíveis
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    allActivities.forEach(activity => {
      activity.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allActivities]);

  // Filtrar atividades
  const filteredActivities = useMemo(() => {
    return allActivities.filter(activity => {
      const isCategoryMatch = !filters.category || activity.category === filters.category;
      const isDifficultyMatch = !filters.difficulty || activity.difficulty === filters.difficulty;
      const isAgeGroupMatch = !filters.ageGroup || activity.ageGroup === filters.ageGroup;
      
      const isDurationMatch = !filters.duration || (() => {
        const durationMinutes = parseInt(activity.duration);
        switch (filters.duration) {
          case 'short': return durationMinutes <= 20;
          case 'medium': return durationMinutes > 20 && durationMinutes <= 40;
          case 'long': return durationMinutes > 40;
          default: return true;
        }
      })();

      const isPreparationTimeMatch = !filters.preparationTime || (() => {
        const prepSteps = activity.preparationSteps?.length || 0;
        switch (filters.preparationTime) {
          case 'minimal': return prepSteps <= 3;
          case 'moderate': return prepSteps > 3 && prepSteps <= 8;
          case 'extensive': return prepSteps > 8;
          default: return true;
        }
      })();

      const isTagsMatch = !filters.tags || filters.tags.length === 0 || 
        filters.tags.some(filterTag => activity.tags?.includes(filterTag));
      
      const isSearchMatch = !filters.searchTerm || (() => {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesTitle = activity.title.toLowerCase().includes(searchTerm);
        const matchesDescription = activity.description.toLowerCase().includes(searchTerm);
        const matchesTags = activity.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) || false;
        const matchesObjectives = activity.objectives?.some(obj => obj.toLowerCase().includes(searchTerm)) || false;
        
        return matchesTitle || matchesDescription || matchesTags || matchesObjectives;
      })();

      return isCategoryMatch && isDifficultyMatch && isAgeGroupMatch && 
             isDurationMatch && isPreparationTimeMatch && isTagsMatch && isSearchMatch;
    });
  }, [allActivities, filters]);

  const handleViewActivityDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setDetailDialogOpen(true);
    
    // Add to recently viewed
    const newRecentlyViewed = [
      activity.id.toString(),
      ...userActivityData.recentlyViewed.filter(id => id !== activity.id.toString())
    ].slice(0, 10);
    
    setUserActivityData({
      ...userActivityData,
      recentlyViewed: newRecentlyViewed
    });
  };

  const handleUpdateUserData = (data: any) => {
    setUserActivityData(data);
    localStorage.setItem('userActivityData', JSON.stringify(data));
  };

  return (
    <div className="container mx-auto py-6">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Explorar Atividades Terapêuticas
          </h1>
          <p className="text-lg text-muted-foreground">
            Descubra uma ampla variedade de atividades cuidadosamente desenvolvidas para apoiar 
            o crescimento e desenvolvimento através de abordagens terapêuticas especializadas.
          </p>
        </div>

        {/* Activity Statistics */}
        <ActivityStats 
          totalActivities={allActivities.length}
          filteredActivities={filteredActivities.length}
          userActivityData={userActivityData}
          allActivities={allActivities}
        />

      {/* Filtros avançados */}
      <ActivityFilters
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        availableTags={availableTags}
        isExpanded={filtersExpanded}
        onToggleExpanded={() => setFiltersExpanded(!filtersExpanded)}
      />

      {/* Resultados da busca */}
      {Object.keys(filters).length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Resultados da Busca</h2>
            <p className="text-muted-foreground">{filteredActivities.length} atividades encontradas</p>
          </div>
          
          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => {
                const category = categories.find(cat => cat.id === activity.category);
                return (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onViewDetails={handleViewActivityDetails}
                    categoryColor={category?.color}
                  />
                );
              })}
            </div>
          ) : (
            <Card className="p-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Nenhuma atividade encontrada com os filtros aplicados.</p>
                <Button variant="outline" onClick={() => setFilters({})}>
                  Limpar Filtros
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Categorias principais - sempre visíveis */}
      {Object.keys(filters).length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.slice(0, 7).map((category) => {
            const combinedData = getCombinedActivities(enhancedActivitiesData);
            const activitiesCount = combinedData[category.id]?.length || 0;
            return (
              <Card 
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-shadow group" 
                onClick={() => navigate(`/activities/category/${category.id}`)}
              >
                <CardHeader className="text-center">
                  <div 
                    className="mx-auto p-4 rounded-full group-hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: `${category.color}20`, 
                      color: category.color 
                    }}
                  >
                    {category.icon}
                  </div>
                  <CardTitle className="text-xl">{category.label}</CardTitle>
                  <CardDescription>
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    {activitiesCount} atividades disponíveis
                  </p>
                </CardContent>
              </Card>
            );
          })}

          {/* Card para ver todas as categorias */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow group border-dashed border-2" 
            onClick={() => setCategoriesDialogOpen(true)}
          >
            <CardHeader className="text-center">
              <div className="mx-auto p-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 dark:from-purple-900/20 dark:to-pink-900/20 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Eye className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Ver Todas</CardTitle>
              <CardDescription>
                Explore todas as categorias disponíveis e descubra mais atividades especializadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                {categories.length} categorias disponíveis
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialog for all categories */}
      <Dialog open={categoriesDialogOpen} onOpenChange={setCategoriesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Todas as Categorias</DialogTitle>
            <DialogDescription>
              Explore todas as categorias de atividades terapêuticas disponíveis
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {categories.map((category) => {
              const combinedData = getCombinedActivities(enhancedActivitiesData);
              const activitiesCount = combinedData[category.id]?.length || 0;
              return (
                <Card 
                  key={category.id}
                  className="cursor-pointer hover:shadow-md transition-shadow group"
                  onClick={() => {
                    navigate(`/activities/category/${category.id}`);
                    setCategoriesDialogOpen(false);
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-full"
                        style={{ 
                          backgroundColor: `${category.color}20`, 
                          color: category.color 
                        }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.label}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {activitiesCount > 0 ? `${activitiesCount} atividades` : 'Em desenvolvimento'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for activity details */}
      <ActivityDetailDialog
        activity={selectedActivity}
        isOpen={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        userActivityData={userActivityData}
        onUpdateUserData={handleUpdateUserData}
      />
    </div>
  );
}