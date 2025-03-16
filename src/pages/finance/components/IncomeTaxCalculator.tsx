
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FinancialRecord } from "../types";

// Define the schema for the tax calculation form
const formSchema = z.object({
  taxYear: z.string(),
  deductibleExpensesPercentage: z.coerce.number().min(0).max(100),
  dependents: z.coerce.number().min(0).max(10),
  otherDeductions: z.coerce.number().min(0),
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
    taxableIncome: number;
    calculatedTax: number;
    effectiveTaxRate: number;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taxYear: new Date().getFullYear().toString(),
      deductibleExpensesPercentage: 32, // Default for healthcare professionals in Brazil
      dependents: 0,
      otherDeductions: 0,
    },
  });

  const calculateIncomeTax = (values: FormValues) => {
    // Filter records by the selected year
    const yearRecords = records.filter(record => 
      new Date(record.session_date).getFullYear().toString() === values.taxYear
    );

    // Calculate gross income from records
    const grossIncome = yearRecords.reduce((sum, record) => sum + record.amount, 0);
    
    // Calculate deductible expenses (simplified taxation)
    const deductibleExpensesAmount = (grossIncome * values.deductibleExpensesPercentage) / 100;
    
    // Calculate dependents deduction (BR tax rules 2023)
    const dependentsDeduction = values.dependents * 2275.08; // 2023 value per dependent
    
    // Calculate taxable income
    const taxableIncome = Math.max(0, grossIncome - deductibleExpensesAmount - dependentsDeduction - values.otherDeductions);
    
    // Apply progressive tax rates (2023 Brazil rates)
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
    
    // Ensure tax is not negative
    calculatedTax = Math.max(0, calculatedTax);
    
    // Calculate effective tax rate
    const effectiveTaxRate = grossIncome > 0 ? (calculatedTax / grossIncome) * 100 : 0;
    
    setCalculationResult({
      grossIncome,
      deductibleExpenses: deductibleExpensesAmount,
      dependentsDeduction,
      otherDeductions: values.otherDeductions,
      taxableIncome,
      calculatedTax,
      effectiveTaxRate,
    });
  };

  const generateAvailableYears = () => {
    const years = new Set<string>();
    records.forEach(record => {
      const year = new Date(record.session_date).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a)); // Sort years descending
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const availableYears = generateAvailableYears();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cálculo de Imposto de Renda</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(calculateIncomeTax)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="taxYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano Fiscal</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                          <SelectItem value={new Date().getFullYear().toString()}>
                            {new Date().getFullYear()}
                          </SelectItem>
                        )}
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
                    <FormLabel>Percentual de Despesas Dedutíveis (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                    <FormLabel>Número de Dependentes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="otherDeductions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outras Deduções (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full">Calcular Imposto</Button>
          </form>
        </Form>
        
        {calculationResult && (
          <div className="mt-6 p-4 border rounded-md bg-muted/30">
            <h3 className="text-lg font-medium mb-4">Resultados do Cálculo</h3>
            
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
              
              <div className="md:col-span-2 p-3 bg-primary/10 rounded-md">
                <p className="text-sm text-muted-foreground">Imposto Devido:</p>
                <p className="text-xl font-bold">{formatCurrency(calculationResult.calculatedTax)}</p>
              </div>
            </div>
            
            <p className="mt-4 text-xs text-muted-foreground">
              * Este cálculo é uma estimativa baseada nas regras do Imposto de Renda Pessoa Física do Brasil 
              para o ano-calendário 2023. Consulte um contador para a declaração oficial.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
