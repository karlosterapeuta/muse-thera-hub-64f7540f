
import { useState } from "react";
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
  CalculatorIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFinancialRecords } from "./hooks/useFinancialData";
import { IncomeTaxCalculator } from "./components/IncomeTaxCalculator";

export default function FinancialReports() {
  const [dateFilter, setDateFilter] = useState<PeriodFilter | undefined>();
  const { data: dashboardData, isLoading: isDashboardLoading } = useFinanceDashboard(dateFilter);
  const { data: records = [], isLoading: isRecordsLoading } = useFinancialRecords(dateFilter);
  
  const handleDateFilter = (start_date: string, end_date: string) => {
    setDateFilter({ start_date, end_date });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const recordsByClinic = records.reduce((acc, record) => {
    const clinic = record.clinic_name || "Sem clínica";
    if (!acc[clinic]) {
      acc[clinic] = {
        count: 0,
        total: 0,
        records: []
      };
    }
    acc[clinic].count += 1;
    acc[clinic].total += record.amount;
    acc[clinic].records.push(record);
    return acc;
  }, {} as Record<string, { count: number, total: number, records: typeof records }>);
  
  const getDateRangeText = () => {
    if (!dateFilter) {
      return "Todos os períodos";
    }
    
    const start = format(parseISO(dateFilter.start_date), "dd/MM/yyyy", { locale: ptBR });
    const end = format(parseISO(dateFilter.end_date), "dd/MM/yyyy", { locale: ptBR });
    
    return `${start} até ${end}`;
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Relatórios Financeiros</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handlePrint}
          >
            <PrinterIcon className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>
      
      <DateRangeFilter onFilter={handleDateFilter} />
      
      <div className="print:hidden">
        <h2 className="text-xl font-bold mb-4">
          <CalendarIcon className="inline-block mr-2 h-5 w-5 align-text-bottom" />
          Período: {getDateRangeText()}
        </h2>
      </div>
      
      {(isDashboardLoading || isRecordsLoading) ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Carregando relatórios...</p>
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
              <TabsTrigger value="charts" className="px-4">
                <BarChart2Icon className="mr-2 h-4 w-4" />
                Gráficos
              </TabsTrigger>
              <TabsTrigger value="by-clinic" className="px-4">
                <PieChartIcon className="mr-2 h-4 w-4" />
                Por Clínica
              </TabsTrigger>
              <TabsTrigger value="all-records" className="px-4">
                <FileTextIcon className="mr-2 h-4 w-4" />
                Todos os Registros
              </TabsTrigger>
              <TabsTrigger value="income-tax" className="px-4 bg-[#8B5CF6] text-white data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white animate-pulse-gentle">
                <CalculatorIcon className="mr-2 h-4 w-4" />
                Imposto de Renda
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
                <div className="py-20 text-center">
                  <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="by-clinic" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dados por Clínica</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(recordsByClinic).length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Clínica</TableHead>
                          <TableHead>Qtd. Atendimentos</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Valor Médio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(recordsByClinic).map(([clinicName, data]) => (
                          <TableRow key={clinicName}>
                            <TableCell className="font-medium">{clinicName}</TableCell>
                            <TableCell>{data.count}</TableCell>
                            <TableCell>{formatCurrency(data.total)}</TableCell>
                            <TableCell>{formatCurrency(data.total / data.count)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="all-records" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Todos os Registros</CardTitle>
                </CardHeader>
                <CardContent>
                  {records.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Clínica</TableHead>
                            <TableHead>Paciente</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {records.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>
                                {format(parseISO(record.session_date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                              </TableCell>
                              <TableCell>{record.clinic_name}</TableCell>
                              <TableCell>{record.patient_name || '-'}</TableCell>
                              <TableCell>{formatCurrency(record.amount)}</TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {record.description || '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-muted-foreground">Nenhum registro disponível para o período selecionado.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="income-tax" className="mt-4">
              <div className="p-4 bg-gradient-to-r from-[#9b87f5]/10 to-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/20 mb-4">
                <h3 className="text-xl font-bold text-[#8B5CF6] flex items-center mb-2">
                  <CalculatorIcon className="mr-2 h-5 w-5" />
                  Cálculo de Imposto de Renda
                </h3>
                <p className="text-muted-foreground">
                  Utilize esta ferramenta para calcular seu imposto de renda com base nos seus rendimentos e deduções específicas para musicoterapeutas.
                </p>
              </div>
              <IncomeTaxCalculator records={records} />
            </TabsContent>
          </Tabs>
          
          <div className="hidden print:block space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Relatório Financeiro</h1>
              <p className="text-muted-foreground">Período: {getDateRangeText()}</p>
              <p className="text-muted-foreground">Data de geração: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
            </div>
            
            <div className="grid gap-4 grid-cols-3 mb-6">
              <div className="border rounded p-4 text-center">
                <h3 className="font-medium">Receita Total</h3>
                <p className="text-xl font-bold">{formatCurrency(dashboardData?.totalEarnings || 0)}</p>
              </div>
              <div className="border rounded p-4 text-center">
                <h3 className="font-medium">Total de Atendimentos</h3>
                <p className="text-xl font-bold">{dashboardData?.totalSessions || 0}</p>
              </div>
              <div className="border rounded p-4 text-center">
                <h3 className="font-medium">Média por Atendimento</h3>
                <p className="text-xl font-bold">{formatCurrency(dashboardData?.averagePerSession || 0)}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Dados por Clínica</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Clínica</th>
                    <th className="text-left p-2">Qtd. Atendimentos</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Valor Médio</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(recordsByClinic).map(([clinicName, data]) => (
                    <tr key={clinicName} className="border-b">
                      <td className="p-2">{clinicName}</td>
                      <td className="p-2">{data.count}</td>
                      <td className="p-2">{formatCurrency(data.total)}</td>
                      <td className="p-2">{formatCurrency(data.total / data.count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-2">Registros Detalhados</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Data</th>
                    <th className="text-left p-2">Clínica</th>
                    <th className="text-left p-2">Paciente</th>
                    <th className="text-left p-2">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b">
                      <td className="p-2">
                        {format(parseISO(record.session_date), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="p-2">{record.clinic_name}</td>
                      <td className="p-2">{record.patient_name || '-'}</td>
                      <td className="p-2">{formatCurrency(record.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
