import React, { useState } from 'react';
import { Heart, Star, Filter, Search, Grid, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityCard } from './ActivityCard';
import { ActivityDetailDialog } from './ActivityDetailDialog';
import { UserActivityManager } from './UserActivityManager';
import { Activity } from '../types';
import { UserActivityData } from '../types/user-data';

interface FavoritesManagerProps {
  activities: Activity[];
  userActivityData: UserActivityData;
  onUpdateUserData: (data: UserActivityData) => void;
}

export const FavoritesManager: React.FC<FavoritesManagerProps> = ({
  activities,
  userActivityData,
  onUpdateUserData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Get favorite activities
  const favoriteActivities = activities.filter(activity => 
    userActivityData.favorites.includes(activity.id.toString())
  );

  // Get completed activities
  const completedActivities = activities.filter(activity =>
    userActivityData.completed.some(c => c.activityId === activity.id.toString())
  );

  // Get recently viewed activities
  const recentlyViewedActivities = activities.filter(activity =>
    userActivityData.recentlyViewed.includes(activity.id.toString())
  );

  // Filter activities based on search term
  const filteredFavorites = favoriteActivities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCompleted = completedActivities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecent = recentlyViewedActivities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setDetailDialogOpen(true);
    
    // Add to recently viewed
    const newRecentlyViewed = [
      activity.id.toString(),
      ...userActivityData.recentlyViewed.filter(id => id !== activity.id.toString())
    ].slice(0, 10); // Keep only last 10 items
    
    onUpdateUserData({
      ...userActivityData,
      recentlyViewed: newRecentlyViewed
    });
  };

  const getActivityStats = (activity: Activity) => {
    const completions = userActivityData.completed.filter(c => c.activityId === activity.id.toString());
    const rating = userActivityData.ratings.find(r => r.activityId === activity.id.toString());
    const hasNote = userActivityData.personalNotes.some(n => n.activityId === activity.id.toString());
    
    return {
      completions: completions.length,
      totalTime: completions.reduce((sum, c) => sum + c.duration, 0),
      rating: rating?.rating || 0,
      hasNote
    };
  };

  const ActivityList = ({ activities }: { activities: Activity[] }) => (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
      {activities.map((activity) => {
        const stats = getActivityStats(activity);
        
        if (viewMode === 'list') {
          return (
            <Card key={activity.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {stats.completions > 0 && (
                        <span>✓ {stats.completions}x concluída</span>
                      )}
                      {stats.rating > 0 && (
                        <span>⭐ {stats.rating}/5</span>
                      )}
                      {stats.hasNote && <span>📝 Com anotação</span>}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(activity)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }
        
        return (
          <div key={activity.id} className="relative">
            <ActivityCard
              activity={activity}
              onViewDetails={handleViewDetails}
            />
            {/* Activity Stats Overlay */}
            <div className="absolute top-2 right-2 flex gap-1">
              {stats.completions > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {stats.completions}x
                </Badge>
              )}
              {stats.rating > 0 && (
                <Badge variant="default" className="text-xs">
                  ⭐{stats.rating}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Minhas Atividades</h2>
          <p className="text-muted-foreground">
            Gerencie suas atividades favoritas, concluídas e recentes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
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

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar nas suas atividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais recentes</SelectItem>
            <SelectItem value="alphabetical">Alfabética</SelectItem>
            <SelectItem value="rating">Melhor avaliadas</SelectItem>
            <SelectItem value="completed">Mais realizadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{favoriteActivities.length}</p>
                <p className="text-sm text-muted-foreground">Favoritas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{completedActivities.length}</p>
                <p className="text-sm text-muted-foreground">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{recentlyViewedActivities.length}</p>
                <p className="text-sm text-muted-foreground">Visualizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {userActivityData.completed.reduce((sum, c) => sum + c.duration, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Min. totais</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="favorites">
            Favoritas ({favoriteActivities.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Concluídas ({completedActivities.length})
          </TabsTrigger>
          <TabsTrigger value="recent">
            Recentes ({recentlyViewedActivities.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="favorites" className="mt-6">
          {filteredFavorites.length > 0 ? (
            <ActivityList activities={filteredFavorites} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Nenhuma atividade favorita</h3>
                <p className="text-muted-foreground">
                  Adicione atividades aos seus favoritos para acesso rápido
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {filteredCompleted.length > 0 ? (
            <ActivityList activities={filteredCompleted} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Nenhuma atividade concluída</h3>
                <p className="text-muted-foreground">
                  Complete suas primeiras atividades para ver seu progresso aqui
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          {filteredRecent.length > 0 ? (
            <ActivityList activities={filteredRecent} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Nenhuma atividade visualizada</h3>
                <p className="text-muted-foreground">
                  Explore as atividades para ver seu histórico de visualização
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Activity Detail Dialog */}
      <ActivityDetailDialog
        activity={selectedActivity}
        isOpen={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
      />
    </div>
  );
};