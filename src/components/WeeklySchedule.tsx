
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek, endOfWeek, addDays, isToday, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

type WeeklySessionType = {
  id: string;
  date: Date;
  patient_name: string;
  formatted_time: string;
  formatted_date: string;
};

type DaySessionsType = {
  date: Date;
  formatted_date: string;
  day_name: string;
  sessions: WeeklySessionType[];
};

export function WeeklySchedule({ isLoading }: { isLoading?: boolean }) {
  const [weekSessions, setWeekSessions] = useState<DaySessionsType[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklySessions = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No user found");
          setLocalLoading(false);
          return;
        }

        // Get professional_id for the current user
        const { data: professional, error: professionalError } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (professionalError || !professional) {
          console.log("No professional profile found for user");
          setLocalLoading(false);
          return;
        }

        // Get current week dates
        const today = new Date();
        const startDate = startOfWeek(today, { weekStartsOn: 0 });
        const endDate = endOfWeek(today, { weekStartsOn: 0 });
        
        // Format dates for Supabase query
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(endDate, "yyyy-MM-dd");
        
        // Fetch sessions for this week with patient information, filtered by professional
        const { data: sessions, error } = await supabase
          .from("sessions")
          .select(`
            id, 
            date, 
            patient_id, 
            patients!inner (
              id,
              name,
              professional_id
            )
          `)
          .eq('patients.professional_id', professional.id)
          .gte('date', formattedStartDate)
          .lte('date', formattedEndDate)
          .order('date');
          
        if (error) {
          console.error("Error fetching weekly sessions:", error);
          return;
        }

        // Prepare data structure for the week (now including Saturday)
        const daysOfWeek: DaySessionsType[] = [];
        for (let i = 0; i < 7; i++) {
          const date = addDays(startDate, i);
          daysOfWeek.push({
            date,
            formatted_date: format(date, "dd/MM", { locale: ptBR }),
            day_name: format(date, "EEEE", { locale: ptBR }),
            sessions: []
          });
        }

        // Organize sessions by day
        if (sessions) {
          sessions.forEach(session => {
            const sessionDate = parseISO(session.date);
            const dayIndex = daysOfWeek.findIndex(day => 
              isSameDay(day.date, sessionDate)
            );
            
            if (dayIndex !== -1) {
              daysOfWeek[dayIndex].sessions.push({
                id: session.id,
                date: sessionDate,
                patient_name: session.patients?.name || "Paciente não encontrado",
                formatted_time: format(sessionDate, "HH:mm", { locale: ptBR }),
                formatted_date: format(sessionDate, "dd/MM", { locale: ptBR })
              });
            }
          });
        }
        
        setWeekSessions(daysOfWeek);
      } catch (error) {
        console.error("Error in weekly schedule:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchWeeklySessions();
  }, []);
  
  const loading = isLoading || localLoading;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Agenda Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p>Carregando agenda...</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] md:h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {weekSessions.map((day) => (
                <div 
                  key={day.formatted_date}
                  className={`border rounded-lg p-3 ${isToday(day.date) ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium capitalize">
                      {day.day_name}
                    </h4>
                    <Badge variant={isToday(day.date) ? "default" : "outline"}>
                      {day.formatted_date}
                    </Badge>
                  </div>
                  
                  {day.sessions.length > 0 ? (
                    <div className="space-y-3">
                      {day.sessions.map((session) => (
                        <div key={session.id} className="flex items-start gap-2 bg-card p-2 rounded-md border">
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{session.formatted_time}</span>
                            </div>
                            <div className="flex items-center gap-1 font-medium">
                              <User className="h-3 w-3 text-primary" />
                              <span className="truncate">{session.patient_name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                      {isToday(day.date) ? 'Nenhuma sessão hoje' : 'Nenhuma sessão agendada'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
