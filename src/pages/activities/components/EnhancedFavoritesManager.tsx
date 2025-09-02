import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Heart, 
  CheckCircle, 
  Eye, 
  Search,
  Calendar,
  Clock,
  Star,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Target,
  Award,
  BarChart3
} from 'lucide-react';
import { Activity } from '../types';
import { UserActivityData } from '../types/user-data';
import { ActivityCard } from './ActivityCard';
import { ActivityDetailDialog } from './ActivityDetailDialog';

interface EnhancedFavoritesManagerProps {
  activities: Activity[];
  userActivityData: UserActivityData;
  onUpdateUserData: (data: UserActivityData) => void;
}

export const EnhancedFavoritesManager: React.FC<EnhancedFavoritesManagerProps> = ({
  activities,
  userActivityData,
  onUpdateUserData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'alphabetical' | 'rating' | 'completion'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('favorites');

  // Process activities data
  const processedData = useMemo(() => {
    const favoriteActivities = activities.filter(activity =>
      userActivityData.favorites.includes(activity.id.toString())
    );

    const completedActivities = activities.filter(activity =>
      userActivityData.completed.some(c => c.activityId === activity.id.toString())
    );

    const recentlyViewedActivities = activities.filter(activity =>
      userActivityData.recentlyViewed.includes(activity.id.toString())
    );

    const ratedActivities = activities.filter(activity =>
      userActivityData.ratings.some(r => r.activityId === activity.id.toString())
    );

    return {
      favorites: favoriteActivities,
      completed: completedActivities,
      recentlyViewed: recentlyViewedActivities,
      rated: ratedActivities
    };
  }, [activities, userActivityData]);

  // Filter and sort activities
  const getFilteredAndSortedActivities = (activityList: Activity[]) => {
    let filtered = activityList;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'rating':
          const ratingA = getUserRating(a.id.toString());
          const ratingB = getUserRating(b.id.toString());
          return ratingB - ratingA;
        case 'completion':
          const completionA = getCompletionDate(a.id.toString());
          const completionB = getCompletionDate(b.id.toString());
          return new Date(completionB).getTime() - new Date(completionA).getTime();
        case 'recent':
        default:
          return 0; // Keep original order
      }
    });
  };

  const getUserRating = (activityId: string): number => {
    const rating = userActivityData.ratings.find(r => r.activityId === activityId);
    return rating?.rating || 0;
  };

  const getCompletionDate = (activityId: string): string => {
    const completion = userActivityData.completed.find(c => c.activityId === activityId);
    return completion?.completedAt || '';
  };

  const getCompletionCount = (activityId: string): number => {
    return userActivityData.completed.filter(c => c.activityId === activityId).length;
  };

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setDetailDialogOpen(true);

    // Update recently viewed
    const updatedRecentlyViewed = [
      activity.id.toString(),
      ...userActivityData.recentlyViewed.filter(id => id !== activity.id.toString())
    ].slice(0, 20);

    onUpdateUserData({
      ...userActivityData,
      recentlyViewed: updatedRecentlyViewed
    });
  };

  // Statistics calculations
  const stats = {
    totalFavorites: processedData.favorites.length,
    totalCompleted: processedData.completed.length,
    totalViewed: processedData.recentlyViewed.length,
    averageRating: userActivityData.ratings.length > 0 
      ? userActivityData.ratings.reduce((sum, r) => sum + r.rating, 0) / userActivityData.ratings.length 
      : 0,
    totalCompletions: userActivityData.completed.length,
    categoriesExplored: new Set([
      ...processedData.favorites.map(a => a.category),
      ...processedData.completed.map(a => a.category)
    ]).size
  };

  const renderActivityList = (activityList: Activity[], emptyMessage: string) => {
    const filteredActivities = getFilteredAndSortedActivities(activityList);

    if (filteredActivities.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{emptyMessage}</p>
          </div>
        </div>
      );
    }

    return (
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="relative">
            <ActivityCard
              activity={activity}
              onViewDetails={handleViewDetails}
              categoryColor="#3B82F6"
            />
            
            {/* Additional Info Overlay */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {selectedTab === 'completed' && (
                <Badge variant="secondary" className="text-xs">
                  {getCompletionCount(activity.id.toString())}x completada
                </Badge>
              )}
              {selectedTab === 'rated' && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {getUserRating(activity.id.toString()).toFixed(1)}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Meu Dashboard de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{stats.totalFavorites}</div>
              <div className="text-xs text-muted-foreground">Favoritas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{stats.totalCompleted}</div>
              <div className="text-xs text-muted-foreground">Concluídas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{stats.totalViewed}</div>
              <div className="text-xs text-muted-foreground">Visualizadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{stats.averageRating.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Avaliação Média</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{stats.totalCompletions}</div>
              <div className="text-xs text-muted-foreground">Total Realizações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-500">{stats.categoriesExplored}</div>
              <div className="text-xs text-muted-foreground">Categorias Exploradas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar nas suas atividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="alphabetical">Alfabética</SelectItem>
                <SelectItem value="rating">Melhor Avaliadas</SelectItem>
                <SelectItem value="completion">Concluídas Recentemente</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favoritas ({stats.totalFavorites})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Concluídas ({stats.totalCompleted})
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Recentes ({stats.totalViewed})
          </TabsTrigger>
          <TabsTrigger value="rated" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Avaliadas ({userActivityData.ratings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites">
          {renderActivityList(
            processedData.favorites,
            "Você ainda não marcou nenhuma atividade como favorita."
          )}
        </TabsContent>

        <TabsContent value="completed">
          {renderActivityList(
            processedData.completed,
            "Você ainda não completou nenhuma atividade."
          )}
        </TabsContent>

        <TabsContent value="recent">
          {renderActivityList(
            processedData.recentlyViewed,
            "Você ainda não visualizou nenhuma atividade recentemente."
          )}
        </TabsContent>

        <TabsContent value="rated">
          {renderActivityList(
            processedData.rated,
            "Você ainda não avaliou nenhuma atividade."
          )}
        </TabsContent>
      </Tabs>

      {/* Activity Detail Dialog */}
      <ActivityDetailDialog
        activity={selectedActivity}
        isOpen={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        userActivityData={userActivityData}
        onUpdateUserData={onUpdateUserData}
      />
    </div>
  );
};