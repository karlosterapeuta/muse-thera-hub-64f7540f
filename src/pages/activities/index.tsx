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
import { SearchWithSuggestions } from "./components/SearchWithSuggestions";
import { RecommendationEngine } from "./components/RecommendationEngine";
import { QuickActions } from "./components/QuickActions";
import { enhancedActivitiesData } from "./data/enhanced-activities-data";
import { teaActivitiesData, TEAActivity } from "./data/tea-specific-activities";
import { getCombinedActivities } from "./utils/activityMigrator";
import { Activity, ActivityFilter } from "./types";
import { TEAActivityCard } from "./components/TEAActivityCard";
import { TEAFilters } from "./components/TEAFilters";
import { TEADetailDialog } from "./components/TEADetailDialog";
import { TEAGuidanceTips } from "./components/TEAGuidanceTips";
import { TEAQuickPersonalization } from "./components/TEAQuickPersonalization";
import { TEAEmergencyKit } from "./components/TEAEmergencyKit";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ActivitiesPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | TEAActivity | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [isTeaMode, setIsTeaMode] = useState(false);
  const [teaFilters, setTeaFilters] = useState({
    supportLevels: [] as number[],
    communicationStyle: [] as string[],
    auditoryIntensity: [] as string[],
    visualStimuli: [] as string[],
    movementRequired: [] as string[],
    attentionSpan: [5, 60] as [number, number],
    predictabilityLevel: [] as string[],
    hasTactileElements: null as boolean | null,
    teaCategories: [] as string[],
    sensoryFriendly: false
  });
  const [filters, setFilters] = useState<ActivityFilter>({});
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentActivitySearches');
    return saved ? JSON.parse(saved) : [];
  });
  
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
  
  // Obter todas as atividades de forma unificada (enhanced + migrated ou TEA)
  const allActivities = useMemo(() => {
    if (isTeaMode) {
      return teaActivitiesData;
    }
    const combinedData = getCombinedActivities(enhancedActivitiesData);
    return Object.values(combinedData).flat();
  }, [isTeaMode]);

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
      if (isTeaMode) {
        const teaActivity = activity as TEAActivity;
        
        // TEA-specific filtering
        if (teaFilters.supportLevels.length > 0 && !teaFilters.supportLevels.includes(teaActivity.supportLevel)) {
          return false;
        }
        
        if (teaFilters.communicationStyle.length > 0 && !teaFilters.communicationStyle.includes(teaActivity.communicationStyle)) {
          return false;
        }
        
        if (teaFilters.auditoryIntensity.length > 0 && !teaFilters.auditoryIntensity.includes(teaActivity.sensoryProfile.auditoryIntensity)) {
          return false;
        }
        
        if (teaFilters.visualStimuli.length > 0 && !teaFilters.visualStimuli.includes(teaActivity.sensoryProfile.visualStimuli)) {
          return false;
        }
        
        if (teaFilters.movementRequired.length > 0 && !teaFilters.movementRequired.includes(teaActivity.sensoryProfile.movementRequired)) {
          return false;
        }
        
        if (teaActivity.attentionSpan < teaFilters.attentionSpan[0] || teaActivity.attentionSpan > teaFilters.attentionSpan[1]) {
          return false;
        }
        
        if (teaFilters.predictabilityLevel.length > 0 && !teaFilters.predictabilityLevel.includes(teaActivity.predictabilityLevel)) {
          return false;
        }
        
        if (teaFilters.hasTactileElements !== null && teaActivity.sensoryProfile.tactileElements !== teaFilters.hasTactileElements) {
          return false;
        }
        
        if (teaFilters.sensoryFriendly) {
          if (teaActivity.sensoryProfile.auditoryIntensity !== 'low' || teaActivity.sensoryProfile.visualStimuli === 'rich') {
            return false;
          }
        }
      }
      
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
  }, [allActivities, filters, teaFilters, isTeaMode]);

  const handleViewActivityDetails = (activity: Activity | TEAActivity) => {
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

  const handleSearchChange = (searchTerm: string) => {
    setFilters({ ...filters, searchTerm });
    
    // Add to recent searches if it's a meaningful search
    if (searchTerm.trim().length > 2 && !recentSearches.includes(searchTerm.trim())) {
      const newRecentSearches = [searchTerm.trim(), ...recentSearches].slice(0, 10);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentActivitySearches', JSON.stringify(newRecentSearches));
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setFilters({ ...filters, searchTerm: search });
  };

  // Check if user has enough activity for recommendations
  const hasUserActivity = userActivityData.favorites.length > 0 || 
                         userActivityData.completed.length > 0 || 
                         userActivityData.recentlyViewed.length > 2;

  return (
    <div className="w-full px-0 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto mb-6 sm:mb-8 px-2 sm:px-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="flex-1 text-center lg:text-left">
               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                 {isTeaMode ? 'Atividades TEA Especializadas MuseTera' : 'Explorar Atividades Terapêuticas'}
               </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl">
                {isTeaMode 
                  ? 'Atividades desenvolvidas especificamente para pessoas no espectro autista' 
                  : 'Descubra uma ampla variedade de atividades cuidadosamente desenvolvidas para apoiar o crescimento e desenvolvimento através de abordagens terapêuticas especializadas.'
                }
              </p>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative">
                {/* Efeito de brilho de fundo */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-30 animate-pulse"></div>
                
                <div className="relative flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-5 rounded-xl border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative">
                    <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0 animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <div>
                      <Label htmlFor="tea-mode" className="font-bold text-sm sm:text-base text-blue-800 cursor-pointer">
                        Modo TEA
                      </Label>
                      <p className="text-xs text-blue-600/80 hidden sm:block">
                        Atividades especializadas
                      </p>
                    </div>
                    
                    <div className="relative">
                      <Switch
                        id="tea-mode"
                        checked={isTeaMode}
                        onCheckedChange={(checked) => {
                          setIsTeaMode(checked);
                          // Reset filters when switching modes
                          if (checked) {
                            setFilters({});
                          } else {
                            setTeaFilters({
                              supportLevels: [],
                              communicationStyle: [],
                              auditoryIntensity: [],
                              visualStimuli: [],
                              movementRequired: [],
                              attentionSpan: [5, 60],
                              predictabilityLevel: [],
                              hasTactileElements: null,
                              teaCategories: [],
                              sensoryFriendly: false
                            });
                          }
                        }}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500 shadow-md"
                      />
                      {isTeaMode && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Badge "NOVO" adicional */}
                  <div className="absolute -top-2 -right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md animate-bounce">
                      ✨ NOVO
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Statistics */}
        <ActivityStats 
          totalActivities={allActivities.length}
          filteredActivities={filteredActivities.length}
          userActivityData={userActivityData}
          allActivities={allActivities}
        />

        {/* Quick Actions */}
        <div className="mb-6">
          <QuickActions
            allActivities={allActivities}
            userActivityData={userActivityData}
            onViewActivity={handleViewActivityDetails}
            onFilterChange={setFilters}
          />
        </div>

          {/* TEA Quick Personalization & Guidance */}
          {isTeaMode && (
            <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
              <TEAQuickPersonalization 
                teaProfile={null}
                onOpenPersonalization={() => console.log('Open TEA personalization')}
              />
              <TEAGuidanceTips />
              <TEAEmergencyKit />
            </div>
          )}

          {/* Enhanced Search */}
        <div className="mb-4 sm:mb-6">
          <SearchWithSuggestions
            searchTerm={filters.searchTerm || ''}
            onSearchChange={handleSearchChange}
            allActivities={allActivities}
            recentSearches={recentSearches}
            onRecentSearchClick={handleRecentSearchClick}
          />
        </div>

        {/* Recommendations Section */}
        {hasUserActivity && !Object.keys(filters).some(key => filters[key as keyof ActivityFilter]) && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
              <Button 
                variant={showRecommendations ? "default" : "outline"}
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="animate-fade-in w-full sm:w-auto"
                size={isMobile ? "sm" : "default"}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {showRecommendations ? 'Ocultar Recomendações' : 'Ver Recomendações Personalizadas'}
              </Button>
            </div>
            
            {showRecommendations && (
              <div className="animate-fade-in">
                <RecommendationEngine
                  allActivities={allActivities}
                  userActivityData={userActivityData}
                  onViewActivity={handleViewActivityDetails}
                  currentFilters={filters}
                />
              </div>
            )}
          </div>
        )}

      {isTeaMode ? (
        <TEAFilters
          filters={teaFilters}
          onFilterChange={setTeaFilters}
          isExpanded={filtersExpanded}
          onToggleExpanded={() => setFiltersExpanded(!filtersExpanded)}
        />
      ) : (
        <ActivityFilters
          filters={filters}
          onFilterChange={setFilters}
          categories={categories}
          availableTags={availableTags}
          isExpanded={filtersExpanded}
          onToggleExpanded={() => setFiltersExpanded(!filtersExpanded)}
        />
      )}

      {/* Resultados da busca */}
      {Object.keys(filters).length > 0 && (
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Resultados da Busca</h2>
            <p className="text-sm sm:text-base text-muted-foreground">{filteredActivities.length} atividades encontradas</p>
          </div>
          
          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredActivities.map((activity) => {
                const category = categories.find(cat => cat.id === activity.category);
                return isTeaMode ? (
                  <TEAActivityCard
                    key={activity.id}
                    activity={activity as TEAActivity}
                    onViewDetails={handleViewActivityDetails}
                  />
                ) : (
                  <ActivityCard
                    key={activity.id}
                    activity={activity as Activity}
                    onViewDetails={handleViewActivityDetails}
                    categoryColor={category?.color}
                  />
                );
              })}
            </div>
          ) : (
            <Card className="p-4 sm:p-6">
              <div className="text-center">
                <p className="text-sm sm:text-base text-muted-foreground mb-4">Nenhuma atividade encontrada com os filtros aplicados.</p>
                <Button variant="outline" onClick={() => setFilters({})} size={isMobile ? "sm" : "default"}>
                  Limpar Filtros
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Categorias principais - sempre visíveis */}
      {Object.keys(filters).length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 7).map((category) => {
            const combinedData = getCombinedActivities(enhancedActivitiesData);
            const activitiesCount = combinedData[category.id]?.length || 0;
            return (
              <Card 
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-shadow group" 
                onClick={() => navigate(`/activities/category/${category.id}`)}
              >
                <CardHeader className="text-center p-4 sm:p-6">
                  <div 
                    className="mx-auto p-3 sm:p-4 rounded-full group-hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: `${category.color}20`, 
                      color: category.color 
                    }}
                  >
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{category.label}</CardTitle>
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground text-center">
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
            <CardHeader className="text-center p-4 sm:p-6">
              <div className="mx-auto p-3 sm:p-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 dark:from-purple-900/20 dark:to-pink-900/20 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Eye className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Ver Todas</CardTitle>
              <CardDescription className="text-sm">
                Explore todas as categorias disponíveis e descubra mais atividades especializadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
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
      {isTeaMode ? (
        <TEADetailDialog
          activity={selectedActivity as TEAActivity}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />
      ) : (
        <ActivityDetailDialog
          activity={selectedActivity as Activity}
          isOpen={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          userActivityData={userActivityData}
          onUpdateUserData={handleUpdateUserData}
        />
      )}
    </div>
  );
}