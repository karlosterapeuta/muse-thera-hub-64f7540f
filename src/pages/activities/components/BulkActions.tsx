import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckSquare,
  Heart,
  Download,
  Share2,
  Calendar,
  Tag,
  Trash2,
  Copy,
  Mail,
  FileText,
  Archive,
  Star,
  Filter
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Activity {
  id: string;
  title: string;
  category: string;
  duration: string;
  difficulty: string;
}

interface BulkActionsProps {
  selectedActivities: string[];
  allActivities: Activity[];
  onSelectionChange: (selected: string[]) => void;
  onBulkAction: (action: string, data?: any) => void;
  totalCount: number;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedActivities,
  allActivities,
  onSelectionChange,
  onBulkAction,
  totalCount
}) => {
  const [showBulkDialog, setShowBulkDialog] = useState<string | null>(null);
  const [emailData, setEmailData] = useState({ subject: '', message: '' });
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', notes: '' });
  const [tagData, setTagData] = useState({ tags: '' });

  const selectedCount = selectedActivities.length;
  const selectedActivitiesData = allActivities.filter(activity => 
    selectedActivities.includes(activity.id)
  );

  const selectAll = () => {
    const allIds = allActivities.map(activity => activity.id);
    onSelectionChange(allIds);
  };

  const selectNone = () => {
    onSelectionChange([]);
  };

  const selectByCategory = (category: string) => {
    const categoryIds = allActivities
      .filter(activity => activity.category === category)
      .map(activity => activity.id);
    onSelectionChange([...new Set([...selectedActivities, ...categoryIds])]);
  };

  const handleBulkAction = (action: string, data?: any) => {
    if (selectedCount === 0) {
      toast({
        title: "Nenhuma atividade selecionada",
        description: "Selecione pelo menos uma atividade para continuar.",
        variant: "destructive"
      });
      return;
    }

    onBulkAction(action, { activities: selectedActivities, ...data });
    setShowBulkDialog(null);
    
    // Clear form data
    setEmailData({ subject: '', message: '' });
    setScheduleData({ date: '', time: '', notes: '' });
    setTagData({ tags: '' });
  };

  const handleEmailAction = () => {
    if (!emailData.subject || !emailData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o assunto e a mensagem do email.",
        variant: "destructive"
      });
      return;
    }
    handleBulkAction('email', emailData);
  };

  const handleScheduleAction = () => {
    if (!scheduleData.date || !scheduleData.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione a data e horário para agendamento.",
        variant: "destructive"
      });
      return;
    }
    handleBulkAction('schedule', scheduleData);
  };

  const handleTagAction = () => {
    if (!tagData.tags.trim()) {
      toast({
        title: "Tags obrigatórias",
        description: "Digite pelo menos uma tag para adicionar.",
        variant: "destructive"
      });
      return;
    }
    handleBulkAction('addTags', { tags: tagData.tags.split(',').map(tag => tag.trim()) });
  };

  const categories = [...new Set(allActivities.map(activity => activity.category))];

  return (
    <>
      {selectedCount > 0 && (
        <Card className="border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckSquare className="h-5 w-5" />
                Ações em Lote
                <Badge variant="default" className="ml-2">
                  {selectedCount} selecionada{selectedCount !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={selectNone}
              >
                Limpar Seleção
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {/* Quick Actions */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('addToFavorites')}
                className="gap-2"
              >
                <Heart className="h-4 w-4" />
                Adicionar aos Favoritos
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('export')}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('share')}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Compartilhar Lista
              </Button>

              {/* Dialog Actions */}
              <Dialog open={showBulkDialog === 'email'} onOpenChange={(open) => !open && setShowBulkDialog(null)}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBulkDialog('email')}
                    className="gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Enviar por Email
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enviar Atividades por Email</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email-subject">Assunto</Label>
                      <Input
                        id="email-subject"
                        value={emailData.subject}
                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        placeholder="Lista de atividades terapêuticas"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-message">Mensagem</Label>
                      <Textarea
                        id="email-message"
                        value={emailData.message}
                        onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                        placeholder="Olá, segue a lista de atividades selecionadas..."
                        rows={4}
                      />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Atividades que serão incluídas ({selectedCount}):
                      </p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {selectedActivitiesData.slice(0, 5).map(activity => (
                          <p key={activity.id} className="text-sm">• {activity.title}</p>
                        ))}
                        {selectedCount > 5 && (
                          <p className="text-sm text-muted-foreground">
                            ... e mais {selectedCount - 5} atividades
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowBulkDialog(null)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleEmailAction}>
                        Enviar Email
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showBulkDialog === 'schedule'} onOpenChange={(open) => !open && setShowBulkDialog(null)}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBulkDialog('schedule')}
                    className="gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Agendar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agendar Atividades</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="schedule-date">Data</Label>
                        <Input
                          id="schedule-date"
                          type="date"
                          value={scheduleData.date}
                          onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="schedule-time">Horário</Label>
                        <Input
                          id="schedule-time"
                          type="time"
                          value={scheduleData.time}
                          onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="schedule-notes">Observações</Label>
                      <Textarea
                        id="schedule-notes"
                        value={scheduleData.notes}
                        onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                        placeholder="Notas adicionais sobre o agendamento..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowBulkDialog(null)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleScheduleAction}>
                        Agendar Atividades
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showBulkDialog === 'tags'} onOpenChange={(open) => !open && setShowBulkDialog(null)}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBulkDialog('tags')}
                    className="gap-2"
                  >
                    <Tag className="h-4 w-4" />
                    Adicionar Tags
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Tags às Atividades</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tags-input">Tags (separadas por vírgula)</Label>
                      <Input
                        id="tags-input"
                        value={tagData.tags}
                        onChange={(e) => setTagData({ tags: e.target.value })}
                        placeholder="relaxamento, grupo, individual, avançado"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Digite as tags separadas por vírgula
                      </p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowBulkDialog(null)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleTagAction}>
                        Adicionar Tags
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Destructive Actions */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('archive')}
                className="gap-2 text-orange-600 hover:text-orange-700"
              >
                <Archive className="h-4 w-4" />
                Arquivar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedCount} de {totalCount} atividades selecionadas
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Selecionar Todas
                </Button>
                <Button variant="ghost" size="sm" onClick={selectNone}>
                  Limpar Seleção
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Selecionar por categoria:</span>
              <Select onValueChange={selectByCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Escolha uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};