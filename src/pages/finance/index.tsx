import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { FinancialStatCards } from "./components/FinancialStatCards";
import { FinanceCharts } from "./components/FinanceCharts";
import { useFinanceDashboard } from "./hooks/useFinanceDashboard";
import { PeriodFilter } from "./types";
import {
  PrinterIcon,
  CalendarIcon,
  BarChart2Icon,
  CalculatorIcon,
  PlusIcon,
  ClipboardListIcon,
  ArrowLeftIcon,
  ReceiptIcon,
  Building2Icon,
  FileBarChart2Icon,
  WalletIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinancialRecords } from "./hooks/useFinancialData";
import { IncomeTaxCalculator } from "./components/IncomeTaxCalculator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinanceDashboard() {
  const [dateFilter, setDateFilter] = useState<PeriodFilter | undefined>();
  const { data: dashboardData, isLoading: isDashboardLoading } = useFinanceDashboard(dateFilter);
  const { data: records = [], isLoading: isRecordsLoading } = useFinancialRecords(dateFilter);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleDateFilter = (start_date: string, end_date: string) => {
    setDateFilter({ start_date, end_date });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const getDateRangeText = () => {
    if (!dateFilter) return "Todos os períodos";
    return `${dateFilter.start_date.split("T")[0].split("-").reverse().join("/")} até ${dateFilter.end_date
      .split("T")[0]
      .split("-")
      .reverse()
      .join("/")}`;
  };

  const loading = isDashboardLoading || isRecordsLoading;

  const shortcuts = [
    { label: "Atendimentos", icon: ClipboardListIcon, to: "/finance/records" },
    { label: "Agenda", icon: CalendarIcon, to: "/finance/records", state: { viewMode: "agenda" } },
    { label: "Recibos", icon: ReceiptIcon, to: "/finance/receipts" },
    { label: "Clínicas", icon: Building2Icon, to: "/finance/clinics" },
    { label: "Relatórios", icon: FileBarChart2Icon, to: "/finance/reports" },
  ];

  return (
    <div className="container px-2 sm:px-4 md:px-6 py-4 md:py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        className="gap-2 -ml-2 text-muted-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Voltar
      </Button>

      {/* Cabeçalho */}
      <header className="rounded-xl border border-border/60 bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <WalletIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Gestão Financeira
              </h1>
              <p className="text-sm text-muted-foreground">
                Controle de receitas, atendimentos e recibos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="h-9"
            >
              <PrinterIcon className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Imprimir</span>}
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/finance/records")}
              className="h-9"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="ml-2">Novo atendimento</span>
            </Button>
          </div>
        </div>

        {/* Atalhos secundários */}
        <nav className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {shortcuts.map(({ label, icon: Icon, to, state }) => (
            <button
              key={label}
              onClick={() => navigate(to, state ? { state } : undefined)}
              className="flex items-center justify-center gap-2 rounded-md border border-border/60 bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/60 hover:border-border transition-colors"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              {label}
            </button>
          ))}
        </nav>
      </header>

      <DateRangeFilter onFilter={handleDateFilter} />

      <div className="print:hidden flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarIcon className="h-4 w-4" />
        Período: <span className="text-foreground font-medium">{getDateRangeText()}</span>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <>
          <FinancialStatCards
            totalEarnings={dashboardData?.totalEarnings || 0}
            totalSessions={dashboardData?.totalSessions || 0}
            averagePerSession={dashboardData?.averagePerSession || 0}
          />

          <Tabs defaultValue="charts" className="print:hidden">
            <TabsList className="mb-4">
              <TabsTrigger value="charts" className="gap-2">
                <BarChart2Icon className="h-4 w-4" />
                Análise gráfica
              </TabsTrigger>
              <TabsTrigger value="tax-calculator" className="gap-2">
                <CalculatorIcon className="h-4 w-4" />
                Calculadora de IR
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
                <div className="py-16 text-center border border-dashed border-border/60 rounded-lg">
                  <ClipboardListIcon className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Nenhum atendimento registrado no período selecionado.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => navigate("/finance/records")}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Cadastrar atendimento
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tax-calculator" className="mt-4">
              <IncomeTaxCalculator records={records} />
            </TabsContent>
          </Tabs>

          {/* Versão para impressão */}
          <div className="hidden print:block space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Relatório financeiro</h1>
              <p className="text-muted-foreground">Período: {getDateRangeText()}</p>
              <p className="text-muted-foreground">
                Gerado em: {new Date().toLocaleDateString("pt-BR")}
              </p>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="border rounded p-4 text-center">
                <h3 className="font-medium">Receita total</h3>
                <p className="text-xl font-bold">
                  {formatCurrency(dashboardData?.totalEarnings || 0)}
                </p>
              </div>
              <div className="border rounded p-4 text-center">
                <h3 className="font-medium">Atendimentos</h3>
                <p className="text-xl font-bold">{dashboardData?.totalSessions || 0}</p>
              </div>
              <div className="border rounded p-4 text-center">
                <h3 className="font-medium">Ticket médio</h3>
                <p className="text-xl font-bold">
                  {formatCurrency(dashboardData?.averagePerSession || 0)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
