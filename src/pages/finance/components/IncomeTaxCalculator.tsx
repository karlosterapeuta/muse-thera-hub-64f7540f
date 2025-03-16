import React, { useState, useEffect } from "react";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatCurrency } from "@/lib/utils";
import { Printer, FileSpreadsheet, Info, PieChart as PieChartIcon } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { FinancialRecord } from "../types";

interface IncomeTaxCalculatorProps {
  records: FinancialRecord[];
}

// Schema para validação do formulário
const formSchema = z.object({
  grossIncome: z.string().min(1, "Campo obrigatório"),
  dependents: z.string().min(0),
  year: z.string().min(1, "Campo obrigatório"),
  expensesPercentage: z.string().min(0),
  socialSecurity: z.string().min(0),
  healthInsurance: z.string().min(0),
  educationExpenses: z.string().min(0),
  pensionPayments: z.string().min(0),
  privateRetirement: z.string().min(0),
});

// Tabela do IRPF 2024
const incomeTaxRates = [
  { base: 0, limit: 2259.20, rate: 0, deduction: 0 },
  { base: 2259.21, limit: 2826.65, rate: 0.075, deduction: 169.44 },
  { base: 2826.66, limit: 3751.05, rate: 0.15, deduction: 381.44 },
  { base: 3751.06, limit: 4664.68, rate: 0.225, deduction: 662.77 },
  { base: 4664.69, limit: Infinity, rate: 0.275, deduction: 896.00 },
];

// Cores para o gráfico
const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F59E0B'];

export function IncomeTaxCalculator({ records }: IncomeTaxCalculatorProps) {
  const isMobile = useIsMobile();
  const [calculatedValues, setCalculatedValues] = useState<{
    grossIncome: number;
    taxableIncome: number;
    simplifiedDeduction: number;
    itemizedDeduction: number;
    chosenDeduction: number;
    incomeTax: number;
    effectiveTaxRate: number;
    netIncome: number;
    deductionBreakdown: Record<string, number>;
    monthlyBreakdown: {
      month: string;
      netIncome: number;
      incomeTax: number;
    }[];
  } | null>(null);

  const [activeSection, setActiveSection] = useState<"calculator" | "report" | "chart" | "details">("calculator");
  const [isDeductiblePercentageBeingEdited, setIsDeductiblePercentageBeingEdited] = useState(false);

  const currentYear = new Date().getFullYear().toString();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossIncome: "",
      dependents: "0",
      year: currentYear,
      expensesPercentage: "32",
      socialSecurity: "0",
      healthInsurance: "0",
      educationExpenses: "0",
      pensionPayments: "0",
      privateRetirement: "0",
    },
  });

  // Função para calcular o imposto de renda
  const calculateIncomeTax = (values: z.infer<typeof formSchema>) => {
    const grossIncome = parseFloat(values.grossIncome.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
    const dependents = parseInt(values.dependents) || 0;
    const expensesPercentage = parseFloat(values.expensesPercentage) || 0;
    
    const socialSecurity = parseFloat(values.socialSecurity.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
    const healthInsurance = parseFloat(values.healthInsurance.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
    const educationExpenses = parseFloat(values.educationExpenses.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
    const pensionPayments = parseFloat(values.pensionPayments.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
    const privateRetirement = parseFloat(values.privateRetirement.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
    
    // Deduções por dependente (limite de 2023)
    const dependentDeduction = dependents * 2275.08;
    
    // Dedução simplificada (20% limitado a um valor conforme a legislação)
    const simplifiedDeductionLimit = 16754.34;
    const simplifiedDeduction = Math.min(grossIncome * 0.2, simplifiedDeductionLimit);
    
    // Dedução detalhada (somando todas as deduções legais)
    const itemizedDeduction = 
      socialSecurity + 
      healthInsurance + 
      educationExpenses + 
      pensionPayments + 
      privateRetirement + 
      dependentDeduction;
    
    // Escolhe a dedução mais vantajosa (maior valor)
    const chosenDeduction = Math.max(simplifiedDeduction, itemizedDeduction);
    
    // Base de cálculo (renda bruta - despesas dedutíveis)
    const deductibleExpenses = grossIncome * (expensesPercentage / 100);
    const taxableIncome = grossIncome - deductibleExpenses - chosenDeduction;
    
    // Cálculo do imposto conforme as faixas
    const annualTaxableIncome = taxableIncome * 12;
    const monthlyTaxableIncome = taxableIncome;
    
    // Encontrar a faixa de imposto
    const taxBracket = incomeTaxRates.find(bracket => 
      monthlyTaxableIncome > bracket.base && monthlyTaxableIncome <= bracket.limit
    ) || incomeTaxRates[0];
    
    // Cálculo do imposto mensal
    const monthlyIncomeTax = (monthlyTaxableIncome * taxBracket.rate) - taxBracket.deduction;
    
    // Ajuste para não ter imposto negativo
    const adjustedMonthlyIncomeTax = Math.max(0, monthlyIncomeTax);
    
    // Imposto anual
    const annualIncomeTax = adjustedMonthlyIncomeTax * 12;
    
    // Taxa efetiva
    const effectiveTaxRate = grossIncome > 0 ? (adjustedMonthlyIncomeTax / grossIncome) * 100 : 0;
    
    // Renda líquida
    const netIncome = grossIncome - adjustedMonthlyIncomeTax;
    
    // Breakdown das deduções para o gráfico
    const deductionBreakdown = {
      "Imposto de Renda": adjustedMonthlyIncomeTax,
      "Previdência": socialSecurity,
      "Saúde": healthInsurance,
      "Educação": educationExpenses,
      "Pensões": pensionPayments,
      "Previdência Privada": privateRetirement,
      "Renda Líquida": netIncome
    };
    
    // Breakdown mensal para o gráfico de barras
    const monthNames = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];
    
    const monthlyBreakdown = monthNames.map(month => ({
      month,
      netIncome: netIncome,
      incomeTax: adjustedMonthlyIncomeTax
    }));
    
    setCalculatedValues({
      grossIncome,
      taxableIncome: monthlyTaxableIncome,
      simplifiedDeduction,
      itemizedDeduction,
      chosenDeduction,
      incomeTax: adjustedMonthlyIncomeTax,
      effectiveTaxRate,
      netIncome,
      deductionBreakdown,
      monthlyBreakdown
    });
    
    // Só muda para a aba de relatório se não estiver editando o campo de percentual
    // e se houver receita
    if (grossIncome > 0 && !isDeductiblePercentageBeingEdited) {
      setActiveSection("report");
    }
  };
  
  // Formatar números como moeda
  const formatBRL = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Formatar como porcentagem
  const formatPercent = (value: number) => {
    return value.toFixed(2) + '%';
  };
  
  // Dados para o gráfico de pizza
  const generatePieChartData = () => {
    if (!calculatedValues) return [];
    
    return [
      { name: 'Imposto', value: calculatedValues.incomeTax },
      { name: 'Renda Líquida', value: calculatedValues.netIncome }
    ];
  };
  
  // Formatar input de moeda
  const formatCurrencyInput = (value: string) => {
    // Remove todos os caracteres não numéricos
    let numericValue = value.replace(/[^\d]/g, '');
    
    // Converte para número
    const numeric = parseInt(numericValue, 10);
    
    // Se não for um número válido, retorna string vazia
    if (isNaN(numeric)) {
      return '';
    }
    
    // Formata como moeda
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(numeric / 100);
  };
  
  // Safe parsing function for chart values
  const parseNumberSafely = (value: string | number): number => {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Tooltip formatter for charts with proper typing
  const formatChartValue = (value: string | number): string => {
    return formatBRL(parseNumberSafely(value));
  };
  
  // YAxis formatter for the bar chart with proper typing
  const formatYAxisValue = (value: string | number): string => {
    return formatBRL(parseNumberSafely(value)).split(',')[0];
  };
  
  // Impressão
  const handlePrint = () => {
    window.print();
  };
  
  // Exportar para CSV
  const exportToCSV = () => {
    if (!calculatedValues) return;
    
    const headers = [
      'Descrição',
      'Valor'
    ];
    
    const data = [
      ['Receita Bruta Mensal', formatBRL(calculatedValues.grossIncome)],
      ['Base de Cálculo', formatBRL(calculatedValues.taxableIncome)],
      ['Imposto Devido', formatBRL(calculatedValues.incomeTax)],
      ['Alíquota Efetiva', formatPercent(calculatedValues.effectiveTaxRate)],
      ['Renda Líquida', formatBRL(calculatedValues.netIncome)]
    ];
    
    // Combina headers e linhas
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    // Cria blob e link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'relatorio_imposto_renda.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Atualizar cálculos quando os valores do formulário mudarem
  useEffect(() => {
    const subscription = form.watch((values) => {
      // Verifica se há um valor de receita bruta para fazer o cálculo
      if (values.grossIncome && parseFloat(values.grossIncome.replace(/[^\d,.]/g, '').replace(',', '.')) > 0) {
        calculateIncomeTax(values as z.infer<typeof formSchema>);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);
  
  return (
    <div className="space-y-8 print:p-8">
      <div className="print:hidden">
        <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator" className={isMobile ? "text-xs px-1 py-1.5" : ""}>
              {isMobile ? "Calculadora" : "Calculadora"}
            </TabsTrigger>
            <TabsTrigger value="report" className={isMobile ? "text-xs px-1 py-1.5" : ""}>
              {isMobile ? "Relatório" : "Relatório"}
            </TabsTrigger>
            <TabsTrigger value="chart" className={isMobile ? "text-xs px-1 py-1.5" : ""}>
              {isMobile ? "Gráficos" : "Gráficos"}
            </TabsTrigger>
            <TabsTrigger value="details" className={isMobile ? "text-xs px-1 py-1.5" : ""}>
              {isMobile ? "Detalhes" : "Detalhes"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="grossIncome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium">Receita Bruta Mensal</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="R$ 0,00"
                                  {...field}
                                  className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30"
                                  onChange={(e) => {
                                    const formattedValue = formatCurrencyInput(e.target.value);
                                    field.onChange(formattedValue);
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Valor total recebido mensalmente pelos seus serviços
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="expensesPercentage"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel className="font-medium">Percentual de Despesas Dedutíveis</FormLabel>
                                <TooltipProvider>
                                  <UITooltip>
                                    <TooltipTrigger>
                                      <Info size={18} className="text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">
                                        No Simples Nacional, podem ser deduzidos até 32% da receita bruta como despesas.
                                      </p>
                                    </TooltipContent>
                                  </UITooltip>
                                </TooltipProvider>
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="32"
                                  {...field}
                                  className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    // Marca que o campo de percentual está sendo editado
                                    setIsDeductiblePercentageBeingEdited(true);
                                    setTimeout(() => {
                                      calculateIncomeTax(form.getValues());
                                      // Após um tempo, marca que o campo não está mais sendo editado
                                      setTimeout(() => setIsDeductiblePercentageBeingEdited(false), 500);
                                    }, 100);
                                  }}
                                  onFocus={() => setIsDeductiblePercentageBeingEdited(true)}
                                  onBlur={() => {
                                    // Dá um tempo para o cálculo ser feito antes de permitir mudança de aba
                                    setTimeout(() => setIsDeductiblePercentageBeingEdited(false), 500);
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Percentual de dedução de despesas do seu modelo fiscal
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="dependents"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium">Número de Dependentes</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30"
                                />
                              </FormControl>
                              <FormDescription>
                                Dependentes declarados no Imposto de Renda
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-medium">Ano de Referência</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={currentYear}
                                  {...field}
                                  className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30"
                                />
                              </FormControl>
                              <FormDescription>
                                Ano para cálculo do imposto
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="rounded-lg bg-muted/50 p-4">
                          <h3 className="text-sm font-medium text-foreground mb-3">Deduções Detalhadas</h3>
                          <div className="space-y-3">
                            <FormField
                              control={form.control}
                              name="socialSecurity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium">INSS</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="R$ 0,00"
                                      size="sm"
                                      {...field}
                                      className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30 h-8 text-sm"
                                      onChange={(e) => {
                                        const formattedValue = formatCurrencyInput(e.target.value);
                                        field.onChange(formattedValue);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="healthInsurance"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium">Plano de Saúde</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="R$ 0,00"
                                      size="sm"
                                      {...field}
                                      className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30 h-8 text-sm"
                                      onChange={(e) => {
                                        const formattedValue = formatCurrencyInput(e.target.value);
                                        field.onChange(formattedValue);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="educationExpenses"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium">Despesas com Educação</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="R$ 0,00"
                                      size="sm"
                                      {...field}
                                      className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30 h-8 text-sm"
                                      onChange={(e) => {
                                        const formattedValue = formatCurrencyInput(e.target.value);
                                        field.onChange(formattedValue);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="pensionPayments"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium">Pensão Alimentícia</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="R$ 0,00"
                                      size="sm"
                                      {...field}
                                      className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30 h-8 text-sm"
                                      onChange={(e) => {
                                        const formattedValue = formatCurrencyInput(e.target.value);
                                        field.onChange(formattedValue);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="privateRetirement"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-medium">Previdência Privada</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="R$ 0,00"
                                      size="sm"
                                      {...field}
                                      className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30 h-8 text-sm"
                                      onChange={(e) => {
                                        const formattedValue = formatCurrencyInput(e.target.value);
                                        field.onChange(formattedValue);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="report" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Relatório de Imposto de Renda</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handlePrint}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      <span className={isMobile ? "sr-only" : ""}>Imprimir</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={exportToCSV}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      <span className={isMobile ? "sr-only" : ""}>CSV</span>
                    </Button>
                  </div>
                </div>
                
                {calculatedValues ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Receita Bruta Mensal:</span>
                          <span className="font-medium">{formatBRL(calculatedValues.grossIncome)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base de Cálculo:</span>
                          <span className="font-medium">{formatBRL(calculatedValues.taxableIncome)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dedução Escolhida:</span>
                          <span className="font-medium">{formatBRL(calculatedValues.chosenDeduction)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Imposto Devido Mensal:</span>
                          <span className="font-semibold text-red-600">{formatBRL(calculatedValues.incomeTax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Alíquota Efetiva:</span>
                          <span className="font-medium">{formatPercent(calculatedValues.effectiveTaxRate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Renda Líquida Mensal:</span>
                          <span className="font-semibold text-green-600">{formatBRL(calculatedValues.netIncome)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Resumo Anual</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <span className="text-xs text-muted-foreground block">Receita Bruta Anual</span>
                          <span className="text-base font-medium">{formatBRL(calculatedValues.grossIncome * 12)}</span>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <span className="text-xs text-muted-foreground block">Imposto Anual</span>
                          <span className="text-base font-medium text-red-600">{formatBRL(calculatedValues.incomeTax * 12)}</span>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <span className="text-xs text-muted-foreground block">Renda Líquida Anual</span>
                          <span className="text-base font-medium text-green-600">{formatBRL(calculatedValues.netIncome * 12)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">Preencha os valores na aba Calculadora para ver o relatório</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chart" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Visualização Gráfica</h3>
                
                {calculatedValues ? (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Distribuição da Renda</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={generatePieChartData()}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            >
                              {generatePieChartData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => {
                                return [formatChartValue(value), ''];
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Projeção Mensal</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={calculatedValues.monthlyBreakdown}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis 
                              tickFormatter={(value) => formatYAxisValue(value)}
                            />
                            <Tooltip 
                              formatter={(value) => {
                                return [formatChartValue(value), ''];
                              }}
                            />
                            <Bar name="Renda Líquida" dataKey="netIncome" fill="#10B981" />
                            <Bar name="Imposto" dataKey="incomeTax" fill="#EF4444" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">Preencha os valores na aba Calculadora para ver os gráficos</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Detalhamento do Cálculo</h3>
                
                {calculatedValues ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Tabela de Alíquotas (2024)</h4>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Base de Cálculo Mensal</TableHead>
                              <TableHead>Alíquota</TableHead>
                              <TableHead>Dedução</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Até R$ 2.259,20</TableCell>
                              <TableCell>Isento</TableCell>
                              <TableCell>R$ 0,00</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>De R$ 2.259,21 até R$ 2.826,65</TableCell>
                              <TableCell>7,5%</TableCell>
                              <TableCell>R$ 169,44</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>De R$ 2.826,66 até R$ 3.751,05</TableCell>
                              <TableCell>15%</TableCell>
                              <TableCell>R$ 381,44</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>De R$ 3.751,06 até R$ 4.664,68</TableCell>
                              <TableCell>22,5%</TableCell>
                              <TableCell>R$ 662,77</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Acima de R$ 4.664,68</TableCell>
                              <TableCell>27,5%</TableCell>
                              <TableCell>R$ 896,00</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Comparativo Deduções</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Dedução Simplificada:</span>
                            <span>{formatBRL(calculatedValues.simplifiedDeduction)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            20% da receita, limitado a R$ 16.754,34 por ano
                          </p>
                        </div>
                        
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Dedução Detalhada:</span>
                            <span>{formatBRL(calculatedValues.itemizedDeduction)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Soma das deduções legais específicas
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Dedução Utilizada:</span>
                          <span className="font-semibold">
                            {formatBRL(calculatedValues.chosenDeduction)}
                            <span className="text-xs ml-2 text-muted-foreground">
                              ({calculatedValues.chosenDeduction === calculatedValues.simplifiedDeduction ? 'Simplificada' : 'Detalhada'})
                            </span>
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          O sistema utiliza automaticamente a dedução mais vantajosa para o cálculo do imposto
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">Preencha os valores na aba Calculadora para ver os detalhes do cálculo</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
