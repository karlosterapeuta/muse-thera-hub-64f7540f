
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { FinancialStatCards } from "./components/FinancialStatCards";
import { FinanceCharts } from "./components/FinanceCharts";
import { useFinanceDashboard } from "./hooks/useFinanceDashboard";
import { PeriodFilter } from "./types";
import { PlusIcon, TableIcon, BarChart2Icon, BuildingIcon } from "lucide-react";

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<PeriodFilter | undefined>();
  const { data, isLoading, error } = useFinanceDashboard(dateFilter);
  
  const handleDateFilter = (start_date: string, end_date: string) => {
    setDateFilter({ start_date, end_date });
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão Financeira</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate("/finance/records")}
            variant="outline"
          >
            <TableIcon className="mr-2 h-4 w-4" />
            Registros
          </Button>
          <Button
            onClick={() => navigate("/finance/clinics")}
            variant="outline"
          >
            <BuildingIcon className="mr-2 h-4 w-4" />
            Clínicas
          </Button>
          <Button
            onClick={() => navigate("/finance/records", { state: { openForm: true } })}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        </div>
      </div>
      
      <DateRangeFilter onFilter={handleDateFilter} />
      
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Carregando dados financeiros...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <p className="text-destructive">Erro ao carregar dados financeiros</p>
          <Button 
            variant="link" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Tentar novamente
          </Button>
        </div>
      ) : (
        <>
          <FinancialStatCards
            totalEarnings={data?.totalEarnings || 0}
            totalSessions={data?.totalSessions || 0}
            averagePerSession={data?.averagePerSession || 0}
          />
          
          {data?.totalSessions > 0 ? (
            <FinanceCharts
              dailyData={data?.dailyEarnings || []}
              weeklyData={data?.weeklyEarnings || []}
              monthlyData={data?.monthlyEarnings || []}
              yearlyData={data?.yearlyEarnings || []}
              clinicData={data?.clinicDistribution || []}
            />
          ) : (
            <div className="py-20 text-center">
              <BarChart2Icon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nenhum registro financeiro</h3>
              <p className="mt-2 text-muted-foreground">
                Adicione registros financeiros para visualizar estatísticas e gráficos.
              </p>
              <Button 
                className="mt-4"
                onClick={() => navigate("/finance/records", { state: { openForm: true } })}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar Registro
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
