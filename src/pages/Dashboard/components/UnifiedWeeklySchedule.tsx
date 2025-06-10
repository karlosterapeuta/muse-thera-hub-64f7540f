
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, DollarSign, Building2 } from "lucide-react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DayData } from "../hooks/useDashboardData";

interface UnifiedWeeklyScheduleProps {
  weekDays: DayData[];
  isLoading: boolean;
}

export function UnifiedWeeklySchedule({ weekDays, isLoading }: UnifiedWeeklyScheduleProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Agenda Semanal Unificada
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p>Carregando agenda...</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] md:h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {weekDays.map((day) => (
                <div 
                  key={day.formatted_date}
                  className={`border rounded-lg p-3 ${isToday(day.date) ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium capitalize text-sm">
                      {day.day_name}
                    </h4>
                    <Badge variant={isToday(day.date) ? "default" : "outline"}>
                      {day.formatted_date}
                    </Badge>
                  </div>
                  
                  {/* Day Summary */}
                  <div className="mb-3 p-2 bg-muted/50 rounded-md">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {day.session_count}
                      </span>
                      <span className="flex items-center gap-1 text-green-600">
                        <DollarSign className="h-3 w-3" />
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(day.total_financial)}
                      </span>
                    </div>
                  </div>

                  {/* Sessions */}
                  {day.sessions.length > 0 ? (
                    <div className="space-y-2">
                      {day.sessions.map((session) => (
                        <div key={session.id} className="bg-card p-2 rounded-md border text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground mb-1">
                            <Clock className="h-3 w-3" />
                            <span>{session.formatted_time}</span>
                          </div>
                          <div className="flex items-center gap-1 font-medium mb-1">
                            <User className="h-3 w-3 text-primary" />
                            <span className="truncate">{session.patient_name}</span>
                          </div>
                          {session.financial_amount && (
                            <div className="flex items-center gap-1 text-green-600">
                              <DollarSign className="h-3 w-3" />
                              <span>
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(session.financial_amount)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-16 text-xs text-muted-foreground">
                      {isToday(day.date) ? 'Nenhuma atividade hoje' : 'Nenhuma atividade'}
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
