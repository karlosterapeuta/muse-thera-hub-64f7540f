import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users,
  Share2,
  MessageCircle,
  UserPlus,
  Settings,
  Globe,
  Lock,
  Eye,
  Edit,
  ThumbsUp,
  ThumbsDown,
  Star,
  Send,
  Reply,
  Flag,
  Crown,
  Shield,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

interface CollaborativeActivity {
  id: string;
  title: string;
  description: string;
  owner: User;
  collaborators: Collaborator[];
  permissions: ActivityPermissions;
  visibility: 'private' | 'team' | 'public';
  status: 'draft' | 'active' | 'archived';
  version: number;
  lastModified: Date;
  comments: Comment[];
  likes: number;
  shares: number;
  tags: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'collaborator' | 'viewer';
}

interface Collaborator extends User {
  joinedAt: Date;
  permissions: CollaboratorPermissions;
  isOnline: boolean;
  lastActive: Date;
}

interface ActivityPermissions {
  canEdit: boolean;
  canComment: boolean;
  canShare: boolean;
  canInvite: boolean;
  canDelete: boolean;
}

interface CollaboratorPermissions {
  canEdit: boolean;
  canComment: boolean;
  canInviteOthers: boolean;
}

interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  replies: Comment[];
  likes: number;
  isEdited: boolean;
  mentions: string[];
}

interface ActivityVersion {
  id: string;
  version: number;
  changes: string;
  author: User;
  timestamp: Date;
  content: any;
}

interface CollaborativeFeaturesProps {
  activities: CollaborativeActivity[];
  currentUser: User;
  onCreateActivity: (activityData: Partial<CollaborativeActivity>) => void;
  onUpdateActivity: (activityId: string, updates: Partial<CollaborativeActivity>) => void;
  onInviteCollaborator: (activityId: string, email: string, permissions: CollaboratorPermissions) => void;
  onRemoveCollaborator: (activityId: string, userId: string) => void;
  onUpdatePermissions: (activityId: string, userId: string, permissions: CollaboratorPermissions) => void;
  onAddComment: (activityId: string, content: string, parentId?: string) => void;
  onLikeActivity: (activityId: string) => void;
  onShareActivity: (activityId: string, method: 'link' | 'email' | 'team') => void;
}

export const CollaborativeFeatures: React.FC<CollaborativeFeaturesProps> = ({
  activities,
  currentUser,
  onCreateActivity,
  onUpdateActivity,
  onInviteCollaborator,
  onRemoveCollaborator,
  onUpdatePermissions,
  onAddComment,
  onLikeActivity,
  onShareActivity
}) => {
  const [selectedActivity, setSelectedActivity] = useState<CollaborativeActivity | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermissions, setInvitePermissions] = useState<CollaboratorPermissions>({
    canEdit: false,
    canComment: true,
    canInviteOthers: false
  });
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const myActivities = activities.filter(a => a.owner.id === currentUser.id);
  const sharedWithMe = activities.filter(a => 
    a.collaborators.some(c => c.id === currentUser.id) && a.owner.id !== currentUser.id
  );
  const publicActivities = activities.filter(a => a.visibility === 'public');

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'collaborator':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getVisibilityIcon = (visibility: CollaborativeActivity['visibility']) => {
    switch (visibility) {
      case 'private':
        return <Lock className="h-4 w-4" />;
      case 'team':
        return <Users className="h-4 w-4" />;
      case 'public':
        return <Globe className="h-4 w-4" />;
      default:
        return <Lock className="h-4 w-4" />;
    }
  };

  const handleInviteCollaborator = () => {
    if (!selectedActivity || !inviteEmail.trim()) {
      toast({
        title: "Erro na inclusão",
        description: "Selecione uma atividade e digite um email válido.",
        variant: "destructive"
      });
      return;
    }

    onInviteCollaborator(selectedActivity.id, inviteEmail.trim(), invitePermissions);
    setInviteEmail('');
    setShowInviteDialog(false);
    
    toast({
      title: "Convite enviado",
      description: `Convite enviado para ${inviteEmail}`,
    });
  };

  const handleAddComment = () => {
    if (!selectedActivity || !newComment.trim()) return;

    onAddComment(selectedActivity.id, newComment.trim(), replyingTo || undefined);
    setNewComment('');
    setReplyingTo(null);
    
    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi publicado com sucesso.",
    });
  };

  const formatTimestamp = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const renderComments = (comments: Comment[], level: number = 0) => {
    return comments.map(comment => (
      <div key={comment.id} className={`space-y-2 ${level > 0 ? 'ml-8 border-l pl-4' : ''}`}>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(comment.timestamp)}
                  </span>
                  {comment.isEdited && (
                    <Badge variant="outline" className="text-xs">editado</Badge>
                  )}
                </div>
                
                <p className="text-sm mb-2">{comment.content}</p>
                
                <div className="flex items-center gap-4 text-xs">
                  <button className="flex items-center gap-1 hover:text-primary">
                    <ThumbsUp className="h-3 w-3" />
                    {comment.likes}
                  </button>
                  
                  <button 
                    onClick={() => setReplyingTo(comment.id)}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <Reply className="h-3 w-3" />
                    Responder
                  </button>
                  
                  <button className="flex items-center gap-1 hover:text-destructive">
                    <Flag className="h-3 w-3" />
                    Reportar
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Colaboração em Atividades
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Activity Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            Minhas Atividades ({myActivities.length})
          </TabsTrigger>
          <TabsTrigger value="shared">
            Compartilhadas Comigo ({sharedWithMe.length})
          </TabsTrigger>
          <TabsTrigger value="public">
            Públicas ({publicActivities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Suas Atividades Colaborativas</h3>
            <Button onClick={() => onCreateActivity({})} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Nova Atividade Colaborativa
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myActivities.map(activity => (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{activity.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        {getVisibilityIcon(activity.visibility)}
                        <Badge variant="outline">{activity.visibility}</Badge>
                        <Badge variant="secondary">v{activity.version}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {activity.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{activity.collaborators.length} colaboradores</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MessageCircle className="h-4 w-4" />
                      <span>{activity.comments.length} comentários</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{activity.likes} curtidas</span>
                    </div>
                  </div>

                  <div className="flex -space-x-2 mb-4">
                    {activity.collaborators.slice(0, 4).map(collaborator => (
                      <Avatar key={collaborator.id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback className="text-xs">
                          {collaborator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {activity.collaborators.length > 4 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                        +{activity.collaborators.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowInviteDialog(true);
                      }}
                      className="flex-1"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Convidar
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowShareDialog(true);
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shared" className="space-y-4">
          <h3 className="text-lg font-semibold">Atividades Compartilhadas Comigo</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sharedWithMe.map(activity => {
              const myRole = activity.collaborators.find(c => c.id === currentUser.id);
              
              return (
                <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{activity.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={activity.owner.avatar} />
                            <AvatarFallback className="text-xs">
                              {activity.owner.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            por {activity.owner.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {myRole && getRoleIcon(myRole.role)}
                          <Badge variant="outline" className="text-xs">
                            {myRole?.role || 'viewer'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Modificado em {formatTimestamp(activity.lastModified)}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedActivity(activity)}
                      >
                        Abrir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="public" className="space-y-4">
          <h3 className="text-lg font-semibold">Atividades Públicas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicActivities.map(activity => (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg mb-2">{activity.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.owner.avatar} />
                      <AvatarFallback className="text-xs">
                        {activity.owner.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      por {activity.owner.name}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {activity.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        {activity.shares}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {activity.comments.length}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLikeActivity(activity.id)}
                      className="flex-1"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Curtir
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Activity Detail Dialog */}
      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedActivity && getVisibilityIcon(selectedActivity.visibility)}
              {selectedActivity?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedActivity && (
            <Tabs defaultValue="activity" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activity">Atividade</TabsTrigger>
                <TabsTrigger value="collaborators">Colaboradores</TabsTrigger>
                <TabsTrigger value="comments">Comentários</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="space-y-4">
                <div className="space-y-4">
                  <p className="text-muted-foreground">{selectedActivity.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedActivity.tags.map(tag => (
                      <Badge key={tag} variant="outline">#{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Proprietário:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedActivity.owner.avatar} />
                          <AvatarFallback className="text-xs">
                            {selectedActivity.owner.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{selectedActivity.owner.name}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium">Última modificação:</span>
                      <p className="text-muted-foreground mt-1">
                        {formatTimestamp(selectedActivity.lastModified)}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="collaborators" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">
                    Colaboradores ({selectedActivity.collaborators.length})
                  </h4>
                  {selectedActivity.permissions.canInvite && (
                    <Button
                      size="sm"
                      onClick={() => setShowInviteDialog(true)}
                      className="gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Convidar
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {selectedActivity.collaborators.map(collaborator => (
                    <Card key={collaborator.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={collaborator.avatar} />
                              <AvatarFallback>
                                {collaborator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{collaborator.name}</span>
                                {getRoleIcon(collaborator.role)}
                                {collaborator.isOnline && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {collaborator.email}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {selectedActivity.permissions.canEdit && (
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                <div className="space-y-4">
                  {selectedActivity.permissions.canComment && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {replyingTo && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Reply className="h-4 w-4" />
                              Respondendo a comentário
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setReplyingTo(null)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          )}
                          
                          <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Adicione um comentário..."
                            rows={3}
                          />
                          
                          <div className="flex justify-end">
                            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                              <Send className="h-4 w-4 mr-2" />
                              Comentar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <ScrollArea className="h-96 space-y-4">
                    {selectedActivity.comments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum comentário ainda</p>
                        <p className="text-sm">Seja o primeiro a comentar!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {renderComments(selectedActivity.comments)}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Colaborador</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="invite-email">Email do colaborador</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="usuario@exemplo.com"
              />
            </div>
            
            <div className="space-y-3">
              <Label>Permissões</Label>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="can-edit">Pode editar</Label>
                  <input
                    id="can-edit"
                    type="checkbox"
                    checked={invitePermissions.canEdit}
                    onChange={(e) => setInvitePermissions(prev => ({ 
                      ...prev, 
                      canEdit: e.target.checked 
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="can-comment">Pode comentar</Label>
                  <input
                    id="can-comment"
                    type="checkbox"
                    checked={invitePermissions.canComment}
                    onChange={(e) => setInvitePermissions(prev => ({ 
                      ...prev, 
                      canComment: e.target.checked 
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="can-invite">Pode convidar outros</Label>
                  <input
                    id="can-invite"
                    type="checkbox"
                    checked={invitePermissions.canInviteOthers}
                    onChange={(e) => setInvitePermissions(prev => ({ 
                      ...prev, 
                      canInviteOthers: e.target.checked 
                    }))}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleInviteCollaborator}>
                <Send className="h-4 w-4 mr-2" />
                Enviar Convite
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};