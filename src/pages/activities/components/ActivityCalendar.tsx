import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScheduledActivity {
  id: string;
  activityId: string;
  activityTitle: string;
  date: Date;
  time: string;
  duration: number; // minutes
  participants: string[];
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface ActivityCalendarProps {
  scheduledActivities: ScheduledActivity[];
  onScheduleActivity: (activityId: string, date: Date, time: string) => void;
  onEditSchedule: (scheduleId: string) => void;
  onCancelSchedule: (scheduleId: string) => void;
  availableActivities: Array<{
    id: string;
    title: string;
    duration: string;
    category: string;
  }>;
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  scheduledActivities,
  onScheduleActivity,
  onEditSchedule,
  onCancelSchedule,
  availableActivities
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getActivitiesForDate = (date: Date) => {
    return scheduledActivities.filter(activity => 
      isSameDay(activity.date, date)
    );
  };

  const getStatusColor = (status: ScheduledActivity['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const dayActivities = selectedDate ? getActivitiesForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendário de Atividades
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[180px] text-center">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </span>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {monthDays.map(day => {
              const dayActivities = getActivitiesForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    p-2 min-h-[60px] text-sm border rounded-lg transition-colors
                    ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                    ${isCurrentDay ? 'border-primary' : 'border-border'}
                  `}
                >
                  <div className="w-full">
                    <div className={`font-medium ${isCurrentDay ? 'text-primary' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    {dayActivities.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {dayActivities.slice(0, 2).map(activity => (
                          <div
                            key={activity.id}
                            className={`w-2 h-2 rounded-full mx-auto ${getStatusColor(activity.status)}`}
                          />
                        ))}
                        {dayActivities.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayActivities.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardTitle>
              <Button
                onClick={() => setShowScheduleForm(true)}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Agendar Atividade
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {dayActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma atividade agendada para este dia</p>
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleForm(true)}
                  className="mt-4 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agendar primeira atividade
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {dayActivities
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(activity => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(activity.status)}`} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{activity.activityTitle}</h4>
                          <Badge 
                            variant={activity.status === 'completed' ? 'default' : 'outline'}
                            className="ml-2"
                          >
                            {activity.status === 'scheduled' && 'Agendada'}
                            {activity.status === 'completed' && 'Concluída'}
                            {activity.status === 'cancelled' && 'Cancelada'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {activity.time} ({activity.duration}min)
                          </div>
                          
                          {activity.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {activity.location}
                            </div>
                          )}
                          
                          {activity.participants.length > 0 && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {activity.participants.length} participante(s)
                            </div>
                          )}
                        </div>
                        
                        {activity.notes && (
                          <p className="text-sm text-muted-foreground">{activity.notes}</p>
                        )}
                        
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditSchedule(activity.id)}
                          >
                            Editar
                          </Button>
                          
                          {activity.status === 'scheduled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onCancelSchedule(activity.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {scheduledActivities.filter(a => a.status === 'scheduled').length}
                </p>
                <p className="text-xs text-muted-foreground">Agendadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {scheduledActivities.filter(a => a.status === 'completed').length}
                </p>
                <p className="text-xs text-muted-foreground">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {scheduledActivities.filter(a => a.status === 'cancelled').length}
                </p>
                <p className="text-xs text-muted-foreground">Canceladas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};