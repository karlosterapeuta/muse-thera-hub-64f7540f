
import React from "react";
import { Card } from "@/components/ui/card";
import { DollarSign, CalendarDays } from "lucide-react";
import { FinancialAgendaItem } from "../hooks/useDashboardData";

interface FinancialAgendaProps {
  financialSchedule: FinancialAgendaItem[];
  isLoading: boolean;
}

export function FinancialAgenda({ financialSchedule, isLoading }: FinancialAgendaProps) {
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
      <div className="p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Agenda Financeira
          </h3>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="space-y-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="text-gray-500">Carregando registros financeiros...</p>
            </div>
          </div>
        ) : financialSchedule.length > 0 ? (
          <div className="space-y-4">
            {financialSchedule.map((record, index) => (
              <div
                key={record.id}
                className="group flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{record.patient_name}</h4>
                    <p className="text-gray-600">{record.clinic_name}</p>
                    {record.description && (
                      <p className="text-sm text-gray-500 mt-1">{record.description}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <p className="font-bold text-green-600 text-xl">{record.formatted_amount}</p>
                  <p className="text-gray-600 flex items-center md:justify-end">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {record.formatted_date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-10 w-10 text-gray-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-600 mb-2">Nenhum registro financeiro</h4>
            <p className="text-gray-500">Seus registros financeiros aparecerão aqui</p>
          </div>
        )}
      </div>
    </Card>
  );
}
