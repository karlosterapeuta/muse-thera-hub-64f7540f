
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, DollarSign, Plus, RefreshCw, Target } from "lucide-react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DayData } from "../types/dashboardTypes";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface UnifiedWeeklyScheduleProps {
  weekDays: DayData[];
  isLoading: boolean;
}

export function UnifiedWeeklySchedule({ weekDays, isLoading }: UnifiedWeeklyScheduleProps) {
  const { t } = useTranslation('financial');
  
  if (isLoading) {
    return (
      <Card className="min-h-[500px] border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t('dashboard.weeklySchedule.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="border rounded-lg p-3 min-h-[120px] animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
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
    <Card className="min-h-[500px] border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t('dashboard.weeklySchedule.title')}
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasValidData ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-full p-6 mb-6">
              <Calendar className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Erro ao carregar agenda</h3>
            <p className="text-gray-500 text-center mb-4">
              Não foi possível carregar os dados da agenda. Verifique sua conexão.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        ) : !hasAnyActivity ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-6 mb-6">
              <Target className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Semana livre para crescer!</h3>
            <p className="text-gray-500 text-center mb-6 max-w-md leading-relaxed">
              Sua agenda desta semana está livre. É o momento perfeito para planejar novas atividades, 
              organizar relatórios ou focar no desenvolvimento profissional.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Agendar Primeira Sessão
              </Button>
              <Button variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Registrar Atividade
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Use este tempo para organizar seu consultório e preparar materiais
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
                                {session.patient_name || t('dashboard.weeklySchedule.patientNotIdentified')}
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
                            <div className="text-primary mb-1">🎯</div>
                            <span className="text-primary font-medium">
                              Dia livre<br />para focar
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
