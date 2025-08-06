import React, { useState, useEffect } from 'react';
import { Heart, Star, Clock, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Activity } from '../types';
import { UserActivityData, ActivityRating, PersonalNote } from '../types/user-data';

interface UserActivityManagerProps {
  activity: Activity;
  userActivityData: UserActivityData;
  onUpdateUserData: (data: UserActivityData) => void;
}

export const UserActivityManager: React.FC<UserActivityManagerProps> = ({
  activity,
  userActivityData,
  onUpdateUserData
}) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [personalNote, setPersonalNote] = useState('');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(30);

  useEffect(() => {
    setIsFavorite(userActivityData.favorites.includes(activity.id.toString()));
    
    const rating = userActivityData.ratings.find(r => r.activityId === activity.id.toString());
    setUserRating(rating?.rating || 0);
    
    const note = userActivityData.personalNotes.find(n => n.activityId === activity.id.toString());
    setPersonalNote(note?.note || '');
  }, [activity.id, userActivityData]);

  const toggleFavorite = () => {
    const newFavorites = isFavorite 
      ? userActivityData.favorites.filter(id => id !== activity.id.toString())
      : [...userActivityData.favorites, activity.id.toString()];
    
    const updatedData = { ...userActivityData, favorites: newFavorites };
    onUpdateUserData(updatedData);
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorite 
        ? "A atividade foi removida da sua lista de favoritos"
        : "A atividade foi adicionada à sua lista de favoritos"
    });
  };

  const updateRating = (rating: number) => {
    const existingRatingIndex = userActivityData.ratings.findIndex(r => r.activityId === activity.id.toString());
    const newRating: ActivityRating = {
      activityId: activity.id.toString(),
      rating,
      ratedAt: new Date().toISOString()
    };

    const newRatings = [...userActivityData.ratings];
    if (existingRatingIndex >= 0) {
      newRatings[existingRatingIndex] = newRating;
    } else {
      newRatings.push(newRating);
    }

    const updatedData = { ...userActivityData, ratings: newRatings };
    onUpdateUserData(updatedData);
    setUserRating(rating);
    
    toast({
      title: "Avaliação registrada",
      description: `Você avaliou esta atividade com ${rating} estrela${rating > 1 ? 's' : ''}`
    });
  };

  const savePersonalNote = () => {
    const existingNoteIndex = userActivityData.personalNotes.findIndex(n => n.activityId === activity.id.toString());
    const note: PersonalNote = {
      activityId: activity.id.toString(),
      note: personalNote,
      createdAt: existingNoteIndex >= 0 ? userActivityData.personalNotes[existingNoteIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newNotes = [...userActivityData.personalNotes];
    if (existingNoteIndex >= 0) {
      newNotes[existingNoteIndex] = note;
    } else {
      newNotes.push(note);
    }

    const updatedData = { ...userActivityData, personalNotes: newNotes };
    onUpdateUserData(updatedData);
    setNoteDialogOpen(false);
    
    toast({
      title: "Nota pessoal salva",
      description: "Sua anotação sobre esta atividade foi salva com sucesso"
    });
  };

  const markAsCompleted = () => {
    const completion = {
      activityId: activity.id.toString(),
      completedAt: new Date().toISOString(),
      duration: sessionDuration,
      difficulty: activity.difficulty,
      rating: userRating
    };

    const updatedData = {
      ...userActivityData,
      completed: [...userActivityData.completed, completion]
    };
    
    onUpdateUserData(updatedData);
    setCompletionDialogOpen(false);
    
    toast({
      title: "Atividade concluída! 🎉",
      description: `Parabéns! Você completou "${activity.title}" em ${sessionDuration} minutos`
    });
  };

  const completionCount = userActivityData.completed.filter(c => c.activityId === activity.id.toString()).length;
  const averageRating = userActivityData.ratings.length > 0 
    ? userActivityData.ratings.reduce((sum, r) => sum + r.rating, 0) / userActivityData.ratings.length 
    : 0;

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={isFavorite ? "default" : "outline"}
          size="sm"
          onClick={toggleFavorite}
        >
          <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
          {isFavorite ? 'Favorito' : 'Favoritar'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNoteDialogOpen(true)}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Anotação
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCompletionDialogOpen(true)}
        >
          <Clock className="h-4 w-4 mr-2" />
          Marcar como Concluída
        </Button>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sua avaliação:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => updateRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-4 w-4 ${
                  star <= userRating 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        {userRating > 0 && (
          <span className="text-sm text-muted-foreground">
            ({userRating}/5)
          </span>
        )}
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Completada</p>
                <p className="text-xs text-muted-foreground">
                  {completionCount} {completionCount === 1 ? 'vez' : 'vezes'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Avaliação Média</p>
                <p className="text-xs text-muted-foreground">
                  {averageRating > 0 ? `${averageRating.toFixed(1)}/5` : 'Não avaliada'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anotação Pessoal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Escreva suas observações sobre esta atividade..."
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              rows={5}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={savePersonalNote}>
                Salvar Anotação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Completion Dialog */}
      <Dialog open={completionDialogOpen} onOpenChange={setCompletionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar Atividade como Concluída</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Duração da sessão (minutos)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCompletionDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={markAsCompleted}>
                Concluir Atividade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};