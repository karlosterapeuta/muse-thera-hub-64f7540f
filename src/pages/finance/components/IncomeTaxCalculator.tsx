
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { calculateIncomeTax } from "@/lib/finance";
import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from "@/lib/utils";

const formSchema = z.object({
  grossIncome: z.string().refine(value => !isNaN(parseCurrencyInput(value)), {
    message: "Renda bruta deve ser um número válido."
  }),
  socialSecurity: z.string().refine(value => !isNaN(parseCurrencyInput(value)), {
    message: "INSS deve ser um número válido."
  }),
  healthInsurance: z.string().refine(value => !isNaN(parseCurrencyInput(value)), {
    message: "Plano de saúde deve ser um número válido."
  }),
  educationExpenses: z.string().refine(value => !isNaN(parseCurrencyInput(value)), {
    message: "Gastos com educação devem ser um número válido."
  }),
  pensionPayments: z.string().refine(value => !isNaN(parseCurrencyInput(value)), {
    message: "Pensão alimentícia deve ser um número válido."
  }),
  privateRetirement: z.string().optional().refine(value => value === undefined || !isNaN(parseCurrencyInput(value)), {
    message: "Previdência privada deve ser um número válido."
  }),
});

interface TaxResult {
  taxableIncome: number;
  incomeTax: number;
  effectiveTaxRate: number;
}

// Add the interface for the records prop
interface FinancialRecord {
  id: string;
  amount: number;
  session_date: string;
  clinic_id?: string;
  clinic_name?: string;
  patient_name?: string;
  description?: string;
}

interface IncomeTaxCalculatorProps {
  records?: FinancialRecord[];
}

export function IncomeTaxCalculator({ records }: IncomeTaxCalculatorProps) {
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);

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

  // If records are provided, calculate total income and prefill the form
  useEffect(() => {
    if (records && records.length > 0) {
      const totalIncome = records.reduce((sum, record) => sum + record.amount, 0);
      
      // Only update if this is not already set to a custom value
      if (form.getValues().grossIncome === "R$ 0,00") {
        form.setValue("grossIncome", formatCurrencyInput(totalIncome.toString()), { 
          shouldValidate: true 
        });
      }
    }
  }, [records, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        form.setValue(name, formatCurrencyInput(value[name] || "R$ 0,00"), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const grossIncome = parseCurrencyInput(values.grossIncome);
    const socialSecurity = parseCurrencyInput(values.socialSecurity);
    const healthInsurance = parseCurrencyInput(values.healthInsurance);
    const educationExpenses = parseCurrencyInput(values.educationExpenses);
    const pensionPayments = parseCurrencyInput(values.pensionPayments);
    const privateRetirement = values.privateRetirement ? parseCurrencyInput(values.privateRetirement) : 0;

    const result = calculateIncomeTax(
      grossIncome,
      socialSecurity,
      healthInsurance,
      educationExpenses,
      pensionPayments,
      privateRetirement
    );

    setTaxResult(result);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora de Imposto de Renda</CardTitle>
        <CardDescription>
          Calcule o imposto de renda mensal devido com base nos seus rendimentos e deduções.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="grossIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renda Bruta Mensal</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
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
                  <FormLabel>INSS Mensal</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="healthInsurance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plano de Saúde Mensal</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
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
                  <FormLabel>Gastos com Educação Anuais</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pensionPayments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pensão Alimentícia Mensal</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
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
                  <FormLabel>Previdência Privada Mensal (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="text"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Calcular</Button>
          </form>
        </Form>
      </CardContent>
      {taxResult && (
        <CardFooter className="flex flex-col space-y-2">
          <Separator />
          <div className="text-sm font-medium">Resultados:</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Base de Cálculo:</Label>
              <div>{formatCurrency(taxResult.taxableIncome)}</div>
            </div>
            <div>
              <Label>Imposto de Renda Mensal:</Label>
              <div>{formatCurrency(taxResult.incomeTax)}</div>
            </div>
            <div>
              <Label>Alíquota Efetiva:</Label>
              <div>{taxResult.effectiveTaxRate.toFixed(2)}%</div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
