
import React from "react";
import { Card } from "@/components/ui/card";
import { DollarSign, CalendarDays, TrendingUp, Plus } from "lucide-react";
import { FinancialAgendaItem } from "../types/dashboardTypes";
import { Button } from "@/components/ui/button";

interface FinancialAgendaProps {
  financialSchedule: FinancialAgendaItem[];
  isLoading: boolean;
}

export function FinancialAgenda({ financialSchedule, isLoading }: FinancialAgendaProps) {
  if (isLoading) {
    return (
      <Card className="border border-border shadow-lg rounded-xl bg-card hover:shadow-xl transition-all duration-300">
        <div className="p-6 w-full">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-teal-700 to-emerald-700 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Agenda Financeira
            </h3>
          </div>
          <div className="flex items-center justify-center h-32">
            <div className="space-y-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground">Carregando registros financeiros...</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const hasData = financialSchedule && Array.isArray(financialSchedule) && financialSchedule.length > 0;

  return (
    <Card className="border border-border shadow-lg rounded-xl bg-card hover:shadow-xl transition-all duration-300">
      <div className="p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-teal-700 to-emerald-700 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Agenda Financeira
            </h3>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Adicionar
          </Button>
        </div>
        
        {hasData ? (
          <div className="space-y-4">
            {financialSchedule.slice(0, 8).map((record, index) => (
              <div
                key={record.id}
                className="group flex flex-col md:flex-row md:items-center md:justify-between p-5 bg-muted/30 rounded-2xl border border-border hover:shadow-lg hover:border-green-500/50 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-11 h-11 bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-background rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base leading-tight">
                      {record.patient_name && record.patient_name !== 'Paciente não informado' 
                        ? record.patient_name 
                        : 'Registro Financeiro'
                      }
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {record.clinic_name && record.clinic_name !== 'Clínica não informada' 
                        ? record.clinic_name 
                        : 'Atividade profissional'
                      }
                    </p>
                    {record.description && record.description.trim() && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {record.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <p className="font-bold text-green-600 dark:text-green-400 text-lg flex items-center md:justify-end">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {record.formatted_amount || 'R$ 0,00'}
                  </p>
                  <p className="text-muted-foreground text-sm flex items-center md:justify-end">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {record.formatted_date || 'Data não informada'}
                  </p>
                </div>
              </div>
            ))}
            {financialSchedule.length > 8 && (
              <div className="text-center py-2">
                <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                  Ver mais {financialSchedule.length - 8} registros
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="h-10 w-10 text-green-500" />
            </div>
            <h4 className="text-xl font-semibold text-foreground mb-3">Comece seus registros financeiros</h4>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              Ainda não há registros financeiros recentes. Adicione seus primeiros dados para acompanhar sua evolução profissional.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Registro
              </Button>
              <Button variant="outline">
                <CalendarDays className="h-4 w-4 mr-2" />
                Ver Histórico
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Dica: Use a seção "Financeiro" para gerenciar suas receitas
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
