
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { FinancialStatCards } from "./components/FinancialStatCards";
import { FinanceCharts } from "./components/FinanceCharts";
import { useFinanceDashboard } from "./hooks/useFinanceDashboard";
import { PeriodFilter } from "./types";
import {
  FileTextIcon,
  PrinterIcon,
  DownloadIcon,
  CalendarIcon,
  PieChartIcon,
  BarChart2Icon,
  CalculatorIcon,
  PlusIcon,
  ListIcon,
  LayoutGridIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinancialRecords } from "./hooks/useFinancialData";
import { IncomeTaxCalculator } from "./components/IncomeTaxCalculator";
import { useIsMobile } from "@/hooks/use-mobile";

export default function FinanceDashboard() {
  const [dateFilter, setDateFilter] = useState<PeriodFilter | undefined>();
  const { data: dashboardData, isLoading: isDashboardLoading } = useFinanceDashboard(dateFilter);
  const { data: records = [], isLoading: isRecordsLoading } = useFinancialRecords(dateFilter);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleDateFilter = (start_date: string, end_date: string) => {
    setDateFilter({ start_date, end_date });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getDateRangeText = () => {
    if (!dateFilter) {
      return "Todos os períodos";
    }
    
    return `${dateFilter.start_date.split('T')[0].split('-').reverse().join('/')} até ${dateFilter.end_date.split('T')[0].split('-').reverse().join('/')}`;
  };
  
  return (
    <div className="container px-2 sm:px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Financeiro</h1>
        <div className="flex flex-wrap gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={() => window.print()}
            className="h-9 sm:h-10"
          >
            <PrinterIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#F97316]" />
            {isMobile && <span className="ml-1 text-xs">Imprimir</span>}
            {!isMobile && "Imprimir"}
          </Button>
          
          <Button
            variant="default"
            size={isMobile ? "sm" : "default"}
            onClick={() => navigate("/finance/records")}
            className="h-9 sm:h-10 bg-primary/90 hover:bg-primary"
          >
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            {isMobile && <span className="ml-1 text-xs">Novo</span>}
            {!isMobile && "Novo Registro"}
          </Button>
          
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={() => navigate("/finance/records", { state: { viewMode: "agenda" } })}
            className="h-9 sm:h-10"
          >
            <LayoutGridIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#0EA5E9]" />
            {isMobile && <span className="ml-1 text-xs">Agenda</span>}
            {!isMobile && "Agenda"}
          </Button>
          
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={() => navigate("/finance/records", { state: { viewMode: "list" } })}
            className="h-9 sm:h-10"
          >
            <ListIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#8B5CF6]" />
            {isMobile && <span className="ml-1 text-xs">Lista</span>}
            {!isMobile && "Lista"}
          </Button>
        </div>
      </div>
      
      <DateRangeFilter onFilter={handleDateFilter} />
      
      <div className="print:hidden">
        <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
          <CalendarIcon className="inline-block mr-2 h-4 w-4 sm:h-5 sm:w-5 align-text-bottom" />
          Período: {getDateRangeText()}
        </h2>
      </div>
      
      {(isDashboardLoading || isRecordsLoading) ? (
        <div className="py-12 sm:py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Carregando dados financeiros...</p>
        </div>
      ) : (
        <>
          <FinancialStatCards
            totalEarnings={dashboardData?.totalEarnings || 0}
            totalSessions={dashboardData?.totalSessions || 0}
            averagePerSession={dashboardData?.averagePerSession || 0}
          />
          
          <Tabs defaultValue="charts" className="print:hidden">
            <TabsList className="mb-4 w-full justify-start overflow-x-auto">
              <TabsTrigger value="charts" className={`px-2 sm:px-4 ${isMobile ? 'text-xs' : ''}`}>
                <BarChart2Icon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Gráficos
              </TabsTrigger>
              <TabsTrigger value="tax-calculator" className={`px-2 sm:px-4 bg-[#8B5CF6] text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white ${isMobile ? 'text-xs' : ''}`}>
                <CalculatorIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Calculadora IR
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="charts" className="mt-4">
              {dashboardData?.totalSessions > 0 ? (
                <FinanceCharts
                  dailyData={dashboardData?.dailyEarnings || []}
                  weeklyData={dashboardData?.weeklyEarnings || []}
                  monthlyData={dashboardData?.monthlyEarnings || []}
                  yearlyData={dashboardData?.yearlyEarnings || []}
                  clinicData={dashboardData?.clinicDistribution || []}
                />
              ) : (
                <div className="py-12 sm:py-20 text-center">
                  <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tax-calculator" className="mt-4">
              <IncomeTaxCalculator records={records} />
            </TabsContent>
          </Tabs>
          
          <div className="hidden print:block space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold">Relatório Financeiro</h1>
              <p className="text-muted-foreground">Período: {getDateRangeText()}</p>
              <p className="text-muted-foreground">Data de geração: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 mb-4 sm:mb-6">
              <div className="border rounded p-3 sm:p-4 text-center">
                <h3 className="font-medium">Receita Total</h3>
                <p className="text-lg sm:text-xl font-bold">{formatCurrency(dashboardData?.totalEarnings || 0)}</p>
              </div>
              <div className="border rounded p-3 sm:p-4 text-center">
                <h3 className="font-medium">Total de Atendimentos</h3>
                <p className="text-lg sm:text-xl font-bold">{dashboardData?.totalSessions || 0}</p>
              </div>
              <div className="border rounded p-3 sm:p-4 text-center">
                <h3 className="font-medium">Média por Atendimento</h3>
                <p className="text-lg sm:text-xl font-bold">{formatCurrency(dashboardData?.averagePerSession || 0)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
