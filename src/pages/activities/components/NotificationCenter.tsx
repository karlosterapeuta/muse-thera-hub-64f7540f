import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell,
  BellOff,
  Clock,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Settings,
  X,
  Trash2,
  CheckCheck,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { format, isToday, isYesterday, differenceInHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'update' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  remindersBefore: number; // minutes
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  types: {
    reminders: boolean;
    achievements: boolean;
    updates: boolean;
    social: boolean;
    system: boolean;
  };
}

interface NotificationCenterProps {
  notifications: Notification[];
  settings: NotificationSettings;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (notificationId: string) => void;
  onClearAll: () => void;
  onUpdateSettings: (settings: NotificationSettings) => void;
  onScheduleReminder: (activityId: string, reminderTime: Date, message: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  settings,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  onUpdateSettings,
  onScheduleReminder
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  const [filterType, setFilterType] = useState<'all' | Notification['type']>('all');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filterType === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filterType);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return <Clock className="h-4 w-4" />;
      case 'achievement':
        return <Target className="h-4 w-4" />;
      case 'update':
        return <Bell className="h-4 w-4" />;
      case 'social':
        return <MessageSquare className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'high') return 'text-red-500';
    
    switch (type) {
      case 'reminder':
        return 'text-blue-500';
      case 'achievement':
        return 'text-green-500';
      case 'update':
        return 'text-purple-500';
      case 'social':
        return 'text-orange-500';
      case 'system':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatNotificationTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return 'Ontem';
    } else if (differenceInHours(new Date(), timestamp) < 168) { // 1 week
      return format(timestamp, 'EEE', { locale: ptBR });
    } else {
      return format(timestamp, 'dd/MM', { locale: ptBR });
    }
  };

  const handleSettingsUpdate = (updates: Partial<NotificationSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const handleTypeToggle = (type: keyof NotificationSettings['types']) => {
    handleSettingsUpdate({
      types: {
        ...localSettings.types,
        [type]: !localSettings.types[type]
      }
    });
  };

  const playNotificationSound = () => {
    if (localSettings.soundEnabled && 'Audio' in window) {
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(() => {
        // Fallback to system notification sound
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Som de notificação indisponível');
        }
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        handleSettingsUpdate({ pushEnabled: true });
        toast({
          title: "Notificações ativadas",
          description: "Você receberá notificações do sistema.",
        });
      } else {
        handleSettingsUpdate({ pushEnabled: false });
        toast({
          title: "Permissão negada",
          description: "Não foi possível ativar as notificações push.",
          variant: "destructive"
        });
      }
    }
  };

  const groupNotificationsByDate = () => {
    const groups: Record<string, Notification[]> = {};
    
    filteredNotifications.forEach(notification => {
      let dateKey: string;
      
      if (isToday(notification.timestamp)) {
        dateKey = 'Hoje';
      } else if (isYesterday(notification.timestamp)) {
        dateKey = 'Ontem';
      } else {
        dateKey = format(notification.timestamp, 'dd/MM/yyyy', { locale: ptBR });
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(notification);
    });
    
    return groups;
  };

  const notificationGroups = groupNotificationsByDate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Central de Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkAllAsRead}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Marcar como Lidas
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Settings Panel */}
        {showSettings && (
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm">Configurações de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* General Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications-enabled">Notificações Ativadas</Label>
                  <Switch
                    id="notifications-enabled"
                    checked={localSettings.enabled}
                    onCheckedChange={(enabled) => handleSettingsUpdate({ enabled })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-enabled" className="flex items-center gap-2">
                    {localSettings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    Som das Notificações
                  </Label>
                  <Switch
                    id="sound-enabled"
                    checked={localSettings.soundEnabled}
                    onCheckedChange={(soundEnabled) => handleSettingsUpdate({ soundEnabled })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="push-enabled" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Notificações Push
                  </Label>
                  <Switch
                    id="push-enabled"
                    checked={localSettings.pushEnabled}
                    onCheckedChange={(pushEnabled) => {
                      if (pushEnabled) {
                        requestNotificationPermission();
                      } else {
                        handleSettingsUpdate({ pushEnabled });
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="email-enabled" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Notificações por Email
                  </Label>
                  <Switch
                    id="email-enabled"
                    checked={localSettings.emailEnabled}
                    onCheckedChange={(emailEnabled) => handleSettingsUpdate({ emailEnabled })}
                  />
                </div>
              </div>

              <Separator />

              {/* Reminder Settings */}
              <div className="space-y-3">
                <Label>Lembretes</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Lembrar</span>
                  <Select
                    value={localSettings.remindersBefore.toString()}
                    onValueChange={(value) => handleSettingsUpdate({ remindersBefore: parseInt(value) })}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm">minutos antes</span>
                </div>
              </div>

              <Separator />

              {/* Quiet Hours */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quiet-hours">Modo Silencioso</Label>
                  <Switch
                    id="quiet-hours"
                    checked={localSettings.quietHours.enabled}
                    onCheckedChange={(enabled) => 
                      handleSettingsUpdate({
                        quietHours: { ...localSettings.quietHours, enabled }
                      })
                    }
                  />
                </div>

                {localSettings.quietHours.enabled && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={localSettings.quietHours.start}
                      onChange={(e) => 
                        handleSettingsUpdate({
                          quietHours: { ...localSettings.quietHours, start: e.target.value }
                        })
                      }
                      className="w-24"
                    />
                    <span className="text-sm">até</span>
                    <Input
                      type="time"
                      value={localSettings.quietHours.end}
                      onChange={(e) => 
                        handleSettingsUpdate({
                          quietHours: { ...localSettings.quietHours, end: e.target.value }
                        })
                      }
                      className="w-24"
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Notification Types */}
              <div className="space-y-3">
                <Label>Tipos de Notificação</Label>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="type-reminders" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Lembretes
                    </Label>
                    <Switch
                      id="type-reminders"
                      checked={localSettings.types.reminders}
                      onCheckedChange={() => handleTypeToggle('reminders')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="type-achievements" className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Conquistas
                    </Label>
                    <Switch
                      id="type-achievements"
                      checked={localSettings.types.achievements}
                      onCheckedChange={() => handleTypeToggle('achievements')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="type-updates" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Atualizações
                    </Label>
                    <Switch
                      id="type-updates"
                      checked={localSettings.types.updates}
                      onCheckedChange={() => handleTypeToggle('updates')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="type-social" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Social
                    </Label>
                    <Switch
                      id="type-social"
                      checked={localSettings.types.social}
                      onCheckedChange={() => handleTypeToggle('social')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="type-system" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Sistema
                    </Label>
                    <Switch
                      id="type-system"
                      checked={localSettings.types.system}
                      onCheckedChange={() => handleTypeToggle('system')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Label className="text-sm">Filtrar:</Label>
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="reminder">Lembretes</SelectItem>
              <SelectItem value="achievement">Conquistas</SelectItem>
              <SelectItem value="update">Atualizações</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
          
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="ml-auto text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Todas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-96">
          {Object.keys(notificationGroups).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma notificação encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(notificationGroups).map(([date, groupNotifications]) => (
                <div key={date}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 sticky top-0 bg-background">
                    {date}
                  </h4>
                  <div className="space-y-2">
                    {groupNotifications.map(notification => (
                      <Card 
                        key={notification.id}
                        className={`cursor-pointer transition-colors ${
                          !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
                        }`}
                        onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className={getNotificationColor(notification.type, notification.priority)}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                                    {notification.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-2 ml-2">
                                  <span className="text-xs text-muted-foreground">
                                    {formatNotificationTime(notification.timestamp)}
                                  </span>
                                  {notification.priority === 'high' && (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteNotification(notification.id);
                                    }}
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              {notification.actionUrl && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto mt-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle action URL navigation
                                  }}
                                >
                                  Ver mais
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};