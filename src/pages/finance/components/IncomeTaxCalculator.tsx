
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { FinancialRecord } from '../types';

// Parse currency string to number
const parseCurrencyValue = (value: string): number => {
  if (!value || value === '') return 0;
  return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
};

interface IncomeTaxCalculatorProps {
  records?: FinancialRecord[];
}

export const IncomeTaxCalculator: React.FC<IncomeTaxCalculatorProps> = ({ records = [] }) => {
  const [simpleIndexValue, setSimpleIndexValue] = useState('');
  const [presumptionValue, setPresumptionValue] = useState('');
  const [realProfitValue, setRealProfitValue] = useState('');
  const [meiValue, setMeiValue] = useState('');
  const [simplesValue, setSimplesValue] = useState('');

  const [simpleIndexTax, setSimpleIndexTax] = useState(0);
  const [presumptionTax, setPresumptionTax] = useState(0);
  const [realProfitTax, setRealProfitTax] = useState(0);
  const [meiTax, setMeiTax] = useState(0);
  const [simplesTax, setSimplesTax] = useState(0);

  const [selectedActivity, setSelectedActivity] = useState('commerce');

  const calculateSimpleIndex = (value: number) => {
    const taxRate = 0.08;
    const tax = value * taxRate;
    setSimpleIndexTax(tax);
  };

  const calculatePresumption = (value: number) => {
    let taxRate = 0;
    switch (selectedActivity) {
      case 'commerce': taxRate = 0.08; break;
      case 'industry': taxRate = 0.08; break;
      case 'service': taxRate = 0.32; break;
      case 'transport': taxRate = 0.16; break;
      default: taxRate = 0.08;
    }
    const tax = value * taxRate;
    setPresumptionTax(tax);
  };

  const calculateRealProfit = (value: number) => {
    const taxRate = 0.15;
    const additionalTaxThreshold = 20000;
    const additionalTaxRate = 0.10;
    let tax = value * taxRate;
    if (value > additionalTaxThreshold) {
      const excess = value - additionalTaxThreshold;
      tax += excess * additionalTaxRate;
    }
    setRealProfitTax(tax);
  };

  const calculateMei = (value: number) => {
    const taxRate = 0.05;
    const tax = value * taxRate;
    setMeiTax(tax);
  };

  const calculateSimples = (value: number) => {
    let taxRate = 0;
    switch (selectedActivity) {
      case 'commerce': taxRate = 0.04; break;
      case 'industry': taxRate = 0.045; break;
      case 'service': taxRate = 0.06; break;
      default: taxRate = 0.04;
    }
    const tax = value * taxRate;
    setSimplesTax(tax);
  };

  const handleBlur = (
    rawValue: string,
    setValue: (v: string) => void,
    calculate: (v: number) => void
  ) => {
    const value = parseCurrencyValue(rawValue);
    if (value === 0) {
      setValue('');
    } else {
      setValue(formatCurrency(value));
      calculate(value);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-900 dark:text-blue-200 flex items-center space-x-2">
          <span>🧮</span>
          <span>Calculadora IR - Musicoterapeutas</span>
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-400">
          🎵 Calcule o imposto de renda devido para profissionais de musicoterapia com base em diferentes regimes tributários.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Tabs defaultValue="simpleIndex" className="w-full">
          <TabsList>
            <TabsTrigger value="simpleIndex">Simples Indexado</TabsTrigger>
            <TabsTrigger value="presumption">Lucro Presumido</TabsTrigger>
            <TabsTrigger value="realProfit">Lucro Real</TabsTrigger>
            <TabsTrigger value="mei">MEI</TabsTrigger>
            <TabsTrigger value="simples">Simples Nacional</TabsTrigger>
          </TabsList>
          <TabsContent value="simpleIndex" className="space-y-2">
            <div className="grid gap-2">
              <Label htmlFor="simpleIndex">Receita Bruta Anual</Label>
              <Input id="simpleIndex" placeholder="R$ 0,00" value={simpleIndexValue}
                onChange={(e) => setSimpleIndexValue(e.target.value)}
                onBlur={(e) => handleBlur(e.target.value, setSimpleIndexValue, calculateSimpleIndex)} />
            </div>
            <p className="text-foreground">Imposto de Renda Devido: {formatCurrency(simpleIndexTax)}</p>
          </TabsContent>
          <TabsContent value="presumption" className="space-y-2">
            <div className="grid gap-2">
              <Label htmlFor="presumption">Receita Bruta Trimestral</Label>
              <Input id="presumption" placeholder="R$ 0,00" value={presumptionValue}
                onChange={(e) => setPresumptionValue(e.target.value)}
                onBlur={(e) => handleBlur(e.target.value, setPresumptionValue, calculatePresumption)} />
            </div>
            <Select onValueChange={setSelectedActivity}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Selecione a Atividade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="commerce">Comércio</SelectItem>
                <SelectItem value="industry">Indústria</SelectItem>
                <SelectItem value="service">Serviço</SelectItem>
                <SelectItem value="transport">Transporte</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-foreground">Imposto de Renda Devido: {formatCurrency(presumptionTax)}</p>
          </TabsContent>
          <TabsContent value="realProfit" className="space-y-2">
            <div className="grid gap-2">
              <Label htmlFor="realProfit">Lucro Real Trimestral</Label>
              <Input id="realProfit" placeholder="R$ 0,00" value={realProfitValue}
                onChange={(e) => setRealProfitValue(e.target.value)}
                onBlur={(e) => handleBlur(e.target.value, setRealProfitValue, calculateRealProfit)} />
            </div>
            <p className="text-foreground">Imposto de Renda Devido: {formatCurrency(realProfitTax)}</p>
          </TabsContent>
          <TabsContent value="mei" className="space-y-2">
            <div className="grid gap-2">
              <Label htmlFor="mei">Receita Bruta Mensal</Label>
              <Input id="mei" placeholder="R$ 0,00" value={meiValue}
                onChange={(e) => setMeiValue(e.target.value)}
                onBlur={(e) => handleBlur(e.target.value, setMeiValue, calculateMei)} />
            </div>
            <p className="text-foreground">Imposto de Renda Devido: {formatCurrency(meiTax)}</p>
          </TabsContent>
          <TabsContent value="simples" className="space-y-2">
            <div className="grid gap-2">
              <Label htmlFor="simples">Receita Bruta Anual</Label>
              <Input id="simples" placeholder="R$ 0,00" value={simplesValue}
                onChange={(e) => setSimplesValue(e.target.value)}
                onBlur={(e) => handleBlur(e.target.value, setSimplesValue, calculateSimples)} />
            </div>
            <Select onValueChange={setSelectedActivity}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Selecione a Atividade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="commerce">Comércio</SelectItem>
                <SelectItem value="industry">Indústria</SelectItem>
                <SelectItem value="service">Serviço</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-foreground">Imposto de Renda Devido: {formatCurrency(simplesTax)}</p>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
          🎯 Calcular Harmonia Fiscal
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IncomeTaxCalculator;
