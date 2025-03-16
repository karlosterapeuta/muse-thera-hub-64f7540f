
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FinancialRecord } from "../types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { calculateIncomeTax } from "@/lib/finance";
import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from "@/lib/utils";

const formSchema = z.object({
  grossIncome: z.string().refine((value) => {
    const parsedValue = parseCurrencyInput(value);
    return !isNaN(parsedValue) && parsedValue >= 0;
  }, {
    message: "Renda bruta deve ser um número válido e não negativo.",
  }),
  socialSecurity: z.string().refine((value) => {
    const parsedValue = parseCurrencyInput(value);
    return !isNaN(parsedValue) && parsedValue >= 0;
  }, {
    message: "Contribuição ao INSS deve ser um número válido e não negativo.",
  }),
  healthInsurance: z.string().refine((value) => {
    const parsedValue = parseCurrencyInput(value);
    return !isNaN(parsedValue) && parsedValue >= 0;
  }, {
    message: "Plano de saúde deve ser um número válido e não negativo.",
  }),
  educationExpenses: z.string().refine((value) => {
    const parsedValue = parseCurrencyInput(value);
    return !isNaN(parsedValue) && parsedValue >= 0;
  }, {
    message: "Gastos com educação devem ser um número válido e não negativo.",
  }),
  pensionPayments: z.string().refine((value) => {
    const parsedValue = parseCurrencyInput(value);
    return !isNaN(parsedValue) && parsedValue >= 0;
  }, {
    message: "Previdência privada deve ser um número válido e não negativo.",
  }),
  privateRetirement: z.string().refine((value) => {
    const parsedValue = parseCurrencyInput(value);
    return !isNaN(parsedValue) && parsedValue >= 0;
  }, {
    message: "Aposentadoria privada deve ser um número válido e não negativo.",
  }),
});

interface IncomeTaxResult {
  taxableIncome: number;
  incomeTax: number;
  effectiveTaxRate: number;
}

interface IncomeTaxCalculatorProps {
  records?: FinancialRecord[];
}

export function IncomeTaxCalculator({ records }: IncomeTaxCalculatorProps) {
  const [incomeTaxResult, setIncomeTaxResult] = useState<IncomeTaxResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossIncome: "R$ 0,00",
      socialSecurity: "R$ 0,00",
      healthInsurance: "R$ 0,00",
      educationExpenses: "R$ 0,00",
      pensionPayments: "R$ 0,00",
      privateRetirement: "R$ 0,00",
    },
  });

  // If records are provided, pre-fill the grossIncome field
  useEffect(() => {
    if (records && records.length > 0) {
      // Calculate total gross income (monthly average)
      const totalIncome = records.reduce((sum, record) => sum + record.amount, 0);
      const monthlyAverage = totalIncome / 12; // Assuming records are for a year
      
      form.setValue("grossIncome", formatCurrencyInput(monthlyAverage.toFixed(2)));
    }
  }, [records, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const grossIncome = parseCurrencyInput(values.grossIncome);
    const socialSecurity = parseCurrencyInput(values.socialSecurity);
    const healthInsurance = parseCurrencyInput(values.healthInsurance);
    const educationExpenses = parseCurrencyInput(values.educationExpenses);
    const pensionPayments = parseCurrencyInput(values.pensionPayments);
    const privateRetirement = parseCurrencyInput(values.privateRetirement);

    if (
      isNaN(grossIncome) ||
      isNaN(socialSecurity) ||
      isNaN(healthInsurance) ||
      isNaN(educationExpenses) ||
      isNaN(pensionPayments) ||
      isNaN(privateRetirement)
    ) {
      alert("Por favor, insira valores numéricos válidos.");
      return;
    }

    const result = calculateIncomeTax(
      grossIncome,
      socialSecurity,
      healthInsurance,
      educationExpenses,
      pensionPayments,
      privateRetirement
    );

    setIncomeTaxResult({
      taxableIncome: result.taxableIncome,
      incomeTax: result.incomeTax,
      effectiveTaxRate: result.effectiveTaxRate,
    });
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="border-none shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Calculadora de Imposto de Renda</CardTitle>
          <CardDescription>
            Simule o cálculo do seu imposto de renda com base nos seus rendimentos e deduções.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="grossIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Renda Bruta Mensal</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="R$ 0,00"
                          value={field.value}
                          onChange={(e) => {
                            const formattedValue = formatCurrencyInput(e.target.value);
                            field.onChange(formattedValue);
                          }}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialSecurity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contribuição Mensal ao INSS</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="R$ 0,00"
                          value={field.value}
                          onChange={(e) => {
                            const formattedValue = formatCurrencyInput(e.target.value);
                            field.onChange(formattedValue);
                          }}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="healthInsurance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gastos Mensais com Plano de Saúde</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="R$ 0,00"
                          value={field.value}
                          onChange={(e) => {
                            const formattedValue = formatCurrencyInput(e.target.value);
                            field.onChange(formattedValue);
                          }}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="educationExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gastos Anuais com Educação (Seu e de Dependentes)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="R$ 0,00"
                          value={field.value}
                          onChange={(e) => {
                            const formattedValue = formatCurrencyInput(e.target.value);
                            field.onChange(formattedValue);
                          }}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pensionPayments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pagamentos Mensais para Previdência Privada</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="R$ 0,00"
                          value={field.value}
                          onChange={(e) => {
                            const formattedValue = formatCurrencyInput(e.target.value);
                            field.onChange(formattedValue);
                          }}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
                <FormField
                  control={form.control}
                  name="privateRetirement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aposentadoria Privada Mensal</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="R$ 0,00"
                          value={field.value}
                          onChange={(e) => {
                            const formattedValue = formatCurrencyInput(e.target.value);
                            field.onChange(formattedValue);
                          }}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Calcular Imposto de Renda
              </Button>
            </form>
          </Form>

          {incomeTaxResult && (
            <div className="mt-8">
              <Separator className="my-4" />
              <h2 className="text-xl font-semibold">Resultado</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Renda Tributável Anual:</Label>
                  <span>{formatCurrency(incomeTaxResult.taxableIncome * 12)}</span>
                </div>
                <div className="flex justify-between">
                  <Label>Imposto de Renda Anual Devido:</Label>
                  <span>{formatCurrency(incomeTaxResult.incomeTax * 12)}</span>
                </div>
                <div className="flex justify-between">
                  <Label>Alíquota Efetiva:</Label>
                  <span>{incomeTaxResult.effectiveTaxRate.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
