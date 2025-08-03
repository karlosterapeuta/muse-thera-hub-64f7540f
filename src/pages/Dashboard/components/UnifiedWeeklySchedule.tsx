
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, DollarSign, Plus, RefreshCw } from "lucide-react";
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

  const hasValidData = weekDays && Array.isArray(weekDays) && weekDays.length > 0;
  const hasAnyActivity = hasValidData && weekDays.some(day => 
    (day.sessions && Array.isArray(day.sessions) && day.sessions.length > 0) || 
    (day.total_financial && day.total_financial > 0)
  );

  return (
    <Card className="min-h-[500px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Agenda Semanal Unificada
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasValidData ? (
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
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-6 mb-6">
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Sua semana está livre!</h3>
            <p className="text-gray-500 text-center mb-6 max-w-md leading-relaxed">
              Você ainda não tem sessões ou registros financeiros para esta semana. 
              É um bom momento para planejar novas atividades ou revisar dados anteriores.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Agendar Sessão
              </Button>
              <Button variant="outline" size="sm">
                <DollarSign className="h-4 w-4 mr-2" />
                Adicionar Registro Financeiro
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Dica: Use as seções "Pacientes" e "Relatórios" para gerenciar seus dados
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] md:h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {weekDays.map((day) => {
                const hasDayActivity = (day.sessions && Array.isArray(day.sessions) && day.sessions.length > 0) || 
                                    (day.total_financial && day.total_financial > 0);
                
                return (
                  <div 
                    key={day.formatted_date}
                    className={`border rounded-lg p-3 min-h-[120px] transition-all duration-300 ${
                      isToday(day.date) 
                        ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className={`font-medium capitalize text-sm ${
                        isToday(day.date) ? 'text-primary font-semibold' : 'text-gray-700'
                      }`}>
                        {day.day_name}
                      </h4>
                      <Badge variant={isToday(day.date) ? "default" : "outline"} className="text-xs">
                        {day.formatted_date}
                      </Badge>
                    </div>
                    
                    {/* Day Summary */}
                    <div className={`mb-3 p-2 rounded-md ${
                      isToday(day.date) ? 'bg-primary/10' : 'bg-muted/50'
                    }`}>
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {day.session_count || 0}
                        </span>
                        <span className={`flex items-center gap-1 ${
                          (day.total_financial || 0) > 0 ? 'text-green-600 font-medium' : 'text-gray-500'
                        }`}>
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
                        {day.sessions && Array.isArray(day.sessions) && day.sessions.map((session) => (
                          <div key={session.id} className="bg-card p-2 rounded-md border text-xs hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                              <Clock className="h-3 w-3" />
                              <span>{session.formatted_time || 'Sem horário'}</span>
                            </div>
                            <div className="flex items-center gap-1 font-medium mb-1">
                              <User className="h-3 w-3 text-primary" />
                              <span className="truncate" title={session.patient_name}>
                                {session.patient_name || 'Paciente não identificado'}
                              </span>
                            </div>
                            {session.financial_amount && session.financial_amount > 0 && (
                              <div className="flex items-center gap-1 text-green-600 font-medium">
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
                          <div className="text-center">
                            <div className="text-gray-400 mb-1">📅</div>
                            <span className="text-center">
                              Nenhuma atividade<br />hoje
                            </span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-gray-300 mb-1">✨</div>
                            <span>Livre</span>
                          </div>
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
