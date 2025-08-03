
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, DollarSign, Plus } from "lucide-react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DayData } from "../types/dashboardTypes";
import { Button } from "@/components/ui/button";

interface UnifiedWeeklyScheduleProps {
  weekDays: DayData[];
  isLoading: boolean;
}

export function UnifiedWeeklySchedule({ weekDays, isLoading }: UnifiedWeeklyScheduleProps) {
  if (isLoading) {
    return (
      <Card className="min-h-[500px]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Agenda Semanal Unificada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="space-y-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="text-gray-500">Carregando agenda...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = weekDays && Array.isArray(weekDays) && weekDays.length > 0;
  const hasAnyActivity = hasData && weekDays.some(day => 
    (day.sessions && day.sessions.length > 0) || 
    (day.total_financial && day.total_financial > 0)
  );

  return (
    <Card className="min-h-[500px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Agenda Semanal Unificada
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Calendar className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Erro ao carregar agenda</h3>
            <p className="text-gray-500 text-center mb-4">
              Não foi possível carregar os dados da agenda. Verifique sua conexão e tente novamente.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
          </div>
        ) : !hasAnyActivity ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma atividade esta semana</h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">
              Você ainda não tem sessões ou registros financeiros para esta semana. 
              Comece adicionando seus primeiros dados.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Sessão
              </Button>
              <Button variant="outline" size="sm">
                <DollarSign className="h-4 w-4 mr-2" />
                Registro Financeiro
              </Button>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[400px] md:h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {weekDays.map((day) => {
                const hasDayActivity = (day.sessions && day.sessions.length > 0) || (day.total_financial && day.total_financial > 0);
                
                return (
                  <div 
                    key={day.formatted_date}
                    className={`border rounded-lg p-3 min-h-[120px] transition-colors ${
                      isToday(day.date) 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className={`font-medium capitalize text-sm ${
                        isToday(day.date) ? 'text-primary' : 'text-gray-700'
                      }`}>
                        {day.day_name}
                      </h4>
                      <Badge variant={isToday(day.date) ? "default" : "outline"} className="text-xs">
                        {day.formatted_date}
                      </Badge>
                    </div>
                    
                    {/* Day Summary */}
                    <div className="mb-3 p-2 bg-muted/50 rounded-md">
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {day.session_count || 0}
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <DollarSign className="h-3 w-3" />
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(day.total_financial || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Sessions */}
                    {hasDayActivity ? (
                      <div className="space-y-2">
                        {day.sessions && day.sessions.map((session) => (
                          <div key={session.id} className="bg-card p-2 rounded-md border text-xs">
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <Clock className="h-3 w-3" />
                              <span>{session.formatted_time || 'Sem horário'}</span>
                            </div>
                            <div className="flex items-center gap-1 font-medium mb-1">
                              <User className="h-3 w-3 text-primary" />
                              <span className="truncate">{session.patient_name || 'Paciente não identificado'}</span>
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
                        {isToday(day.date) ? (
                          <span className="text-center">
                            Nenhuma atividade<br />hoje
                          </span>
                        ) : (
                          'Livre'
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
