import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  User,
  Sparkles,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Activity } from '../types';

interface Rating {
  id: string;
  activityId: string;
  rating: number;
  review?: string;
  ratedAt: string;
  helpful?: number;
  categories: {
    effectiveness: number;
    engagement: number;
    difficulty: number;
    preparation: number;
  };
}

interface EnhancedRatingSystemProps {
  activity: Activity;
  userRating?: Rating;
  allRatings?: Rating[];
  onSubmitRating: (rating: Rating) => void;
}

export const EnhancedRatingSystem: React.FC<EnhancedRatingSystemProps> = ({
  activity,
  userRating,
  allRatings = [],
  onSubmitRating
}) => {
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [overallRating, setOverallRating] = useState(userRating?.rating || 0);
  const [categories, setCategories] = useState(
    userRating?.categories || {
      effectiveness: 0,
      engagement: 0,
      difficulty: 0,
      preparation: 0
    }
  );
  const [review, setReview] = useState(userRating?.review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate average ratings
  const avgRating = allRatings.length > 0 
    ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length 
    : 0;

  const avgCategories = allRatings.length > 0 
    ? {
        effectiveness: allRatings.reduce((sum, r) => sum + r.categories.effectiveness, 0) / allRatings.length,
        engagement: allRatings.reduce((sum, r) => sum + r.categories.engagement, 0) / allRatings.length,
        difficulty: allRatings.reduce((sum, r) => sum + r.categories.difficulty, 0) / allRatings.length,
        preparation: allRatings.reduce((sum, r) => sum + r.categories.preparation, 0) / allRatings.length,
      }
    : { effectiveness: 0, engagement: 0, difficulty: 0, preparation: 0 };

  const handleSubmitRating = async () => {
    if (overallRating === 0) return;

    setIsSubmitting(true);
    
    const newRating: Rating = {
      id: userRating?.id || `rating_${Date.now()}`,
      activityId: activity.id.toString(),
      rating: overallRating,
      review: review.trim() || undefined,
      ratedAt: new Date().toISOString(),
      categories,
      helpful: userRating?.helpful || 0
    };

    await onSubmitRating(newRating);
    setIsSubmitting(false);
    setIsRatingDialogOpen(false);
  };

  const StarRating = ({ 
    value, 
    onChange, 
    size = 'md',
    readonly = false 
  }: { 
    value: number; 
    onChange?: (value: number) => void;
    size?: 'sm' | 'md' | 'lg';
    readonly?: boolean;
  }) => {
    const starSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            className={`${starSize} ${
              star <= value 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${!readonly ? 'hover:text-yellow-300 transition-colors' : ''}`}
          >
            <Star className={starSize} />
          </button>
        ))}
      </div>
    );
  };

  const CategoryRating = ({ 
    label, 
    value, 
    average, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    average: number;
    onChange: (value: number) => void;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex items-center gap-2">
          <StarRating value={value} onChange={onChange} size="sm" />
          <span className="text-xs text-muted-foreground">
            (Média: {average.toFixed(1)})
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overall Rating Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Avaliações da Atividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{avgRating.toFixed(1)}</div>
                <StarRating value={Math.round(avgRating)} readonly size="sm" />
                <div className="text-sm text-muted-foreground">
                  {allRatings.length} avaliação{allRatings.length !== 1 ? 'ões' : ''}
                </div>
              </div>
              
              <Separator orientation="vertical" className="h-16" />
              
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="text-center">
                  <div className="text-sm font-medium">Eficácia</div>
                  <div className="text-lg font-bold">{avgCategories.effectiveness.toFixed(1)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">Envolvimento</div>
                  <div className="text-lg font-bold">{avgCategories.engagement.toFixed(1)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">Dificuldade</div>
                  <div className="text-lg font-bold">{avgCategories.difficulty.toFixed(1)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">Preparação</div>
                  <div className="text-lg font-bold">{avgCategories.preparation.toFixed(1)}</div>
                </div>
              </div>
            </div>

            <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
              <DialogTrigger asChild>
                <Button variant={userRating ? "outline" : "default"}>
                  <Star className="h-4 w-4 mr-2" />
                  {userRating ? 'Editar Avaliação' : 'Avaliar Atividade'}
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Avaliar Atividade</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Overall Rating */}
                  <div className="text-center">
                    <label className="text-sm font-medium">Avaliação Geral</label>
                    <div className="mt-2">
                      <StarRating 
                        value={overallRating} 
                        onChange={setOverallRating} 
                        size="lg" 
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Category Ratings */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Avaliações Específicas</h4>
                    
                    <CategoryRating
                      label="Eficácia Terapêutica"
                      value={categories.effectiveness}
                      average={avgCategories.effectiveness}
                      onChange={(value) => setCategories({...categories, effectiveness: value})}
                    />
                    
                    <CategoryRating
                      label="Nível de Envolvimento"
                      value={categories.engagement}
                      average={avgCategories.engagement}
                      onChange={(value) => setCategories({...categories, engagement: value})}
                    />
                    
                    <CategoryRating
                      label="Dificuldade de Execução"
                      value={categories.difficulty}
                      average={avgCategories.difficulty}
                      onChange={(value) => setCategories({...categories, difficulty: value})}
                    />
                    
                    <CategoryRating
                      label="Facilidade de Preparação"
                      value={categories.preparation}
                      average={avgCategories.preparation}
                      onChange={(value) => setCategories({...categories, preparation: value})}
                    />
                  </div>

                  <Separator />

                  {/* Review */}
                  <div>
                    <label className="text-sm font-medium">
                      Comentário (opcional)
                    </label>
                    <Textarea
                      placeholder="Compartilhe sua experiência com esta atividade..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleSubmitRating}
                    disabled={overallRating === 0 || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Salvando...' : userRating ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Rating Distribution */}
          {allRatings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Distribuição das Avaliações</h4>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = allRatings.filter(r => r.rating === stars).length;
                const percentage = (count / allRatings.length) * 100;
                
                return (
                  <div key={stars} className="flex items-center gap-2 text-sm">
                    <span className="w-3">{stars}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <div className="flex-1 h-2 bg-muted rounded">
                      <div 
                        className="h-full bg-yellow-400 rounded" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-xs text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      {allRatings.filter(r => r.review).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comentários Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allRatings
                .filter(r => r.review)
                .slice(-3)
                .map((rating, index) => (
                  <div key={index} className="border-l-2 border-muted pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating value={rating.rating} readonly size="sm" />
                      <Badge variant="outline" className="text-xs">
                        {new Date(rating.ratedAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm">{rating.review}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Útil ({rating.helpful || 0})
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};