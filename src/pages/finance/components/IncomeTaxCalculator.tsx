
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialRecord } from "../types";
import { 
  BarChart3Icon, 
  TableIcon, 
  FileTextIcon, 
  PieChartIcon, 
  InfoIcon,
  CalculatorIcon,
  DollarSignIcon,
  CheckCircleIcon
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const formSchema = z.object({
  taxYear: z.string(),
  deductibleExpensesPercentage: z.coerce.number().min(0).max(100),
  dependents: z.coerce.number().min(0).max(10),
  otherDeductions: z.coerce.number().min(0),
  taxRegime: z.enum(["simplesNacional", "mei", "lucroPesumido"]),
  professionalType: z.enum(["healthProfessional", "musicalTherapist", "other"]),
  previdenciaContribution: z.coerce.number().min(0),
  courses: z.coerce.number().min(0),
  equipment: z.coerce.number().min(0),
  transportation: z.coerce.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

interface IncomeTaxCalculatorProps {
  records: FinancialRecord[];
}

export function IncomeTaxCalculator({ records }: IncomeTaxCalculatorProps) {
  const [calculationResult, setCalculationResult] = useState<{
    grossIncome: number;
    deductibleExpenses: number;
    dependentsDeduction: number;
    otherDeductions: number;
    specificDeductions: {
      courses: number;
      equipment: number;
      transportation: number;
      previdencia: number;
    };
    taxableIncome: number;
    calculatedTax: number;
    effectiveTaxRate: number;
    monthlyBreakdown: { month: string; income: number; tax: number }[];
  } | null>(null);

  const [activeSection, setActiveSection] = useState<"calculator" | "report" | "chart" | "details">("calculator");

  const currentYear = new Date().getFullYear().toString();
  
  // Generate available years from the records
  const generateAvailableYears = () => {
    const years = new Set<string>();
    records.forEach(record => {
      const year = new Date(record.session_date).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  };
  
  const availableYears = generateAvailableYears();
  const defaultYear = availableYears.length > 0 ? availableYears[0] : currentYear;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taxYear: defaultYear,
      deductibleExpensesPercentage: 32,
      dependents: 0,
      otherDeductions: 0,
      taxRegime: "simplesNacional",
      professionalType: "musicalTherapist",
      previdenciaContribution: 0,
      courses: 0,
      equipment: 0,
      transportation: 0,
    },
  });

  const watchProfessionalType = form.watch("professionalType");
  const watchTaxRegime = form.watch("taxRegime");
  const watchTaxYear = form.watch("taxYear");

  const updateDeductiblePercentage = (value: string) => {
    switch (value) {
      case "healthProfessional":
        form.setValue("deductibleExpensesPercentage", 32);
        break;
      case "musicalTherapist":
        form.setValue("deductibleExpensesPercentage", 32);
        break;
      case "other":
        form.setValue("deductibleExpensesPercentage", 25);
        break;
    }
  };

  const handleProfessionalTypeChange = (value: string) => {
    updateDeductiblePercentage(value);
  };

  // Automatically calculate tax when records change or form values change
  useEffect(() => {
    if (records.length > 0) {
      const values = form.getValues();
      calculateIncomeTax(values);
    }
  }, [records, watchTaxYear, watchProfessionalType, watchTaxRegime]);

  const calculateIncomeTax = (values: FormValues) => {
    const yearRecords = records.filter(record => 
      new Date(record.session_date).getFullYear().toString() === values.taxYear
    );

    const grossIncome = yearRecords.reduce((sum, record) => sum + record.amount, 0);
    
    const specificDeductions = {
      courses: values.courses,
      equipment: values.equipment,
      transportation: values.transportation,
      previdencia: values.previdenciaContribution
    };
    
    const totalSpecificDeductions = Object.values(specificDeductions).reduce((sum, val) => sum + val, 0);
    
    const deductibleExpensesAmount = (grossIncome * values.deductibleExpensesPercentage) / 100;
    
    const dependentsDeduction = values.dependents * 2275.08;
    
    const taxableIncome = Math.max(0, grossIncome - deductibleExpensesAmount - dependentsDeduction - values.otherDeductions - totalSpecificDeductions);
    
    let calculatedTax = 0;
    
    if (taxableIncome <= 22847.76) {
      calculatedTax = 0;
    } else if (taxableIncome <= 33919.80) {
      calculatedTax = (taxableIncome - 22847.76) * 0.075 - 1713.58;
    } else if (taxableIncome <= 45012.60) {
      calculatedTax = (taxableIncome - 33919.80) * 0.15 - 4257.57;
    } else if (taxableIncome <= 55976.16) {
      calculatedTax = (taxableIncome - 45012.60) * 0.225 - 7633.51;
    } else {
      calculatedTax = (taxableIncome - 55976.16) * 0.275 - 10432.32;
    }
    
    calculatedTax = Math.max(0, calculatedTax);
    
    const effectiveTaxRate = grossIncome > 0 ? (calculatedTax / grossIncome) * 100 : 0;
    
    const monthlyData: Record<string, { income: number; tax: number }> = {};
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    months.forEach(month => {
      monthlyData[month] = { income: 0, tax: 0 };
    });
    
    yearRecords.forEach(record => {
      const recordDate = new Date(record.session_date);
      const month = months[recordDate.getMonth()];
      monthlyData[month].income += record.amount;
    });
    
    Object.keys(monthlyData).forEach(month => {
      const proportion = grossIncome > 0 ? monthlyData[month].income / grossIncome : 0;
      monthlyData[month].tax = calculatedTax * proportion;
    });
    
    const monthlyBreakdown = months.map(month => ({
      month,
      income: monthlyData[month].income,
      tax: monthlyData[month].tax
    }));
    
    setCalculationResult({
      grossIncome,
      deductibleExpenses: deductibleExpensesAmount,
      dependentsDeduction,
      otherDeductions: values.otherDeductions,
      specificDeductions,
      taxableIncome,
      calculatedTax,
      effectiveTaxRate,
      monthlyBreakdown
    });
    
    if (grossIncome > 0) {
      setActiveSection("report");
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getTaxRegimeLabel = (regime: string) => {
    switch (regime) {
      case "simplesNacional": return "Simples Nacional";
      case "mei": return "MEI";
      case "lucroPesumido": return "Lucro Presumido";
      default: return regime;
    }
  };
  
  const getProfessionalTypeLabel = (type: string) => {
    switch (type) {
      case "healthProfessional": return "Profissional de Saúde";
      case "musicalTherapist": return "Musicoterapeuta";
      case "other": return "Outro";
      default: return type;
    }
  };
  
  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#1EAEDB', '#33C3F0'];
  
  const renderDeductionsPieChart = () => {
    if (!calculationResult) return null;
    
    const data = [
      { name: 'Desp. Dedutíveis', value: calculationResult.deductibleExpenses },
      { name: 'Dependentes', value: calculationResult.dependentsDeduction },
      { name: 'Cursos', value: calculationResult.specificDeductions.courses },
      { name: 'Equipamentos', value: calculationResult.specificDeductions.equipment },
      { name: 'Transporte', value: calculationResult.specificDeductions.transportation },
      { name: 'Previdência', value: calculationResult.specificDeductions.previdencia },
      { name: 'Outras Deduções', value: calculationResult.otherDeductions }
    ].filter(item => item.value > 0);
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  const renderIncomeVsTaxChart = () => {
    if (!calculationResult) return null;
    
    const data = calculationResult.monthlyBreakdown.map(item => ({
      month: item.month,
      Receita: item.income,
      Imposto: item.tax
    }));
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend />
          <Bar dataKey="Receita" fill="#4ade80" />
          <Bar dataKey="Imposto" fill="#f43f5e" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <Card className="w-full border-[#8B5CF6]/30 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[#8B5CF6]/20 to-transparent border-b border-[#8B5CF6]/20">
        <CardTitle className="text-[#8B5CF6] flex items-center">
          <DollarSignIcon className="mr-2 h-5 w-5" />
          Cálculo Automático do Imposto de Renda
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
          <p className="text-green-700 text-sm">
            Os cálculos são realizados automaticamente com base nos registros financeiros do período selecionado.
          </p>
        </div>
        
        <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as any)} className="w-full">
          <TabsList className="mb-6 grid grid-cols-4 gap-4 bg-[#8B5CF6]/10 p-1">
            <TabsTrigger 
              value="calculator" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              <CalculatorIcon className="mr-2 h-4 w-4" />
              Parâmetros
            </TabsTrigger>
            {calculationResult && (
              <>
                <TabsTrigger 
                  value="report"
                  className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Relatório
                </TabsTrigger>
                <TabsTrigger 
                  value="chart"
                  className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
                >
                  <PieChartIcon className="mr-2 h-4 w-4" />
                  Gráficos
                </TabsTrigger>
                <TabsTrigger 
                  value="details"
                  className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
                >
                  <TableIcon className="mr-2 h-4 w-4" />
                  Detalhamento
                </TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(calculateIncomeTax)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="taxYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#8B5CF6] font-medium">Ano Fiscal</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setTimeout(() => calculateIncomeTax(form.getValues()), 100);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30">
                              <SelectValue placeholder="Selecione o ano" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableYears.length > 0 ? (
                              availableYears.map(year => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value={currentYear}>
                                {currentYear}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        {records.filter(r => new Date(r.session_date).getFullYear().toString() === field.value).length === 0 && (
                          <p className="text-amber-600 text-xs mt-1">
                            Nenhum registro para este ano.
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="professionalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#8B5CF6] font-medium">Categoria Profissional</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleProfessionalTypeChange(value);
                            setTimeout(() => calculateIncomeTax(form.getValues()), 100);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30">
                              <SelectValue placeholder="Selecione sua categoria profissional" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="healthProfessional">Profissional de Saúde</SelectItem>
                            <SelectItem value="musicalTherapist">Musicoterapeuta</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="taxRegime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#8B5CF6] font-medium">Regime Tributário</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setTimeout(() => calculateIncomeTax(form.getValues()), 100);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30">
                              <SelectValue placeholder="Selecione o regime tributário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="simplesNacional">Simples Nacional</SelectItem>
                            <SelectItem value="mei">MEI</SelectItem>
                            <SelectItem value="lucroPesumido">Lucro Presumido</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deductibleExpensesPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#8B5CF6] font-medium">Percentual de Despesas Dedutíveis (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30"
                            onChange={(e) => {
                              field.onChange(e);
                              setTimeout(() => calculateIncomeTax(form.getValues()), 100);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dependents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#8B5CF6] font-medium">Número de Dependentes</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30"
                            onChange={(e) => {
                              field.onChange(e);
                              setTimeout(() => calculateIncomeTax(form.getValues()), 100);
                            }} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="previdenciaContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#8B5CF6] font-medium">Contribuição Previdenciária (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            {...field} 
                            className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30"
                            onChange={(e) => {
                              field.onChange(e);
                              setTimeout(() => calculateIncomeTax(form.getValues()), 100);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="p-5 border rounded-lg bg-[#8B5CF6]/5 border-[#8B5CF6]/20 space-y-4">
                  <h3 className="font-medium flex items-center text-[#8B5CF6]">
                    <InfoIcon className="h-4 w-4 mr-2" />
                    Deduções Específicas para Musicoterapeutas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="courses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#8B5CF6] font-medium">Cursos e Capacitações (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              {...field} 
                              className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30"
                              onChange={(e) => {
                                field.onChange(e);
                                setTimeout(() => calculateIncomeTax(form.getValues()), 100);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="equipment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#8B5CF6] font-medium">Equipamentos e Instrumentos (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              {...field} 
                              className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30"
                              onChange={(e) => {
                                field.onChange(e);
                                setTimeout(() => calculateIncomeTax(form.getValues()), 100);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="transportation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#8B5CF6] font-medium">Transporte e Locomoção (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              {...field} 
                              className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30"
                              onChange={(e) => {
                                field.onChange(e);
                                setTimeout(() => calculateIncomeTax(form.getValues()), 100);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="otherDeductions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#8B5CF6] font-medium">Outras Deduções (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field} 
                          className="border-[#8B5CF6]/30 focus:ring-[#8B5CF6]/30"
                          onChange={(e) => {
                            field.onChange(e);
                            setTimeout(() => calculateIncomeTax(form.getValues()), 100);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#8B5CF6] hover:bg-[#9b87f5]"
                >
                  <CalculatorIcon className="mr-2 h-4 w-4" />
                  Atualizar Cálculos
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          {calculationResult && (
            <>
              <TabsContent value="report" className="space-y-6">
                <div className="p-4 border rounded-md bg-muted/30">
                  <h3 className="text-lg font-semibold mb-4">Resumo da Declaração de Imposto de Renda</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ano Fiscal:</p>
                      <p className="text-lg font-semibold">{form.getValues().taxYear}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Regime Tributário:</p>
                      <p className="text-lg font-semibold">{getTaxRegimeLabel(form.getValues().taxRegime)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Categoria Profissional:</p>
                      <p className="text-lg font-semibold">{getProfessionalTypeLabel(form.getValues().professionalType)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Percentual de Despesas Dedutíveis:</p>
                      <p className="text-lg font-semibold">{form.getValues().deductibleExpensesPercentage}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Receita Bruta:</p>
                    <p className="text-lg font-semibold">{formatCurrency(calculationResult.grossIncome)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Despesas Dedutíveis:</p>
                    <p className="text-lg font-semibold">{formatCurrency(calculationResult.deductibleExpenses)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Dedução por Dependentes:</p>
                    <p className="text-lg font-semibold">{formatCurrency(calculationResult.dependentsDeduction)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Outras Deduções:</p>
                    <p className="text-lg font-semibold">{formatCurrency(calculationResult.otherDeductions)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Base de Cálculo:</p>
                    <p className="text-lg font-semibold">{formatCurrency(calculationResult.taxableIncome)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Alíquota Efetiva:</p>
                    <p className="text-lg font-semibold">{calculationResult.effectiveTaxRate.toFixed(2)}%</p>
                  </div>
                </div>
                
                <div className="p-4 bg-primary/10 rounded-md">
                  <p className="text-sm text-muted-foreground">Imposto Devido:</p>
                  <p className="text-xl font-bold">{formatCurrency(calculationResult.calculatedTax)}</p>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">Deduções Específicas de Musicoterapia</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cursos e Capacitações:</p>
                      <p className="font-medium">{formatCurrency(calculationResult.specificDeductions.courses)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Equipamentos e Instrumentos:</p>
                      <p className="font-medium">{formatCurrency(calculationResult.specificDeductions.equipment)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transporte e Locomoção:</p>
                      <p className="font-medium">{formatCurrency(calculationResult.specificDeductions.transportation)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contribuição Previdenciária:</p>
                      <p className="font-medium">{formatCurrency(calculationResult.specificDeductions.previdencia)}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  * Este cálculo é uma estimativa baseada nas regras do Imposto de Renda Pessoa Física do Brasil 
                  para o ano-calendário 2023. Consulte um contador para a declaração oficial.
                </p>
                
                <div className="flex justify-end">
                  <Button onClick={() => window.print()} variant="outline" className="gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    Imprimir Relatório
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="chart" className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Receita vs. Imposto (Mensal)</h3>
                  {renderIncomeVsTaxChart()}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Distribuição de Deduções</h3>
                  {renderDeductionsPieChart()}
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <h3 className="text-lg font-medium">Detalhamento Mensal</h3>
                <div className="rounded-md border overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium">Mês</th>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium">Receita</th>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium">Imposto Proporcional</th>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium">Alíquota Efetiva</th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {calculationResult.monthlyBreakdown.map((item) => {
                        const monthlyRate = item.income > 0 ? (item.tax / item.income) * 100 : 0;
                        return (
                          <tr key={item.month}>
                            <td className="px-4 py-2 text-sm">{item.month}</td>
                            <td className="px-4 py-2 text-sm">{formatCurrency(item.income)}</td>
                            <td className="px-4 py-2 text-sm">{formatCurrency(item.tax)}</td>
                            <td className="px-4 py-2 text-sm">{monthlyRate.toFixed(2)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-muted">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium">Total</th>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium">
                          {formatCurrency(calculationResult.grossIncome)}
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium">
                          {formatCurrency(calculationResult.calculatedTax)}
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium">
                          {calculationResult.effectiveTaxRate.toFixed(2)}%
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <h3 className="text-lg font-medium mt-6">Informações para a Declaração</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Rendimentos Tributáveis:</p>
                    <p>{formatCurrency(calculationResult.taxableIncome)}</p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Deduções Permitidas:</p>
                    <p>{formatCurrency(calculationResult.deductibleExpenses + calculationResult.dependentsDeduction + calculationResult.otherDeductions + 
                      calculationResult.specificDeductions.courses + calculationResult.specificDeductions.equipment + 
                      calculationResult.specificDeductions.transportation + calculationResult.specificDeductions.previdencia)}</p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Imposto Retido na Fonte (se houver):</p>
                    <p>R$ 0,00</p>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Imposto a Pagar:</p>
                    <p>{formatCurrency(calculationResult.calculatedTax)}</p>
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
