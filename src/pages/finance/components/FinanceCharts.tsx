
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialSummary, ClinicSummary } from "../types";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FinanceChartsProps {
  dailyData: FinancialSummary[];
  weeklyData: FinancialSummary[];
  monthlyData: FinancialSummary[];
  yearlyData: FinancialSummary[];
  clinicData: ClinicSummary[];
}

const COLORS = ['#667eea', '#764ba2', '#00C49F', '#8884d8', '#667eea', '#82ca9d'];

export function FinanceCharts({ 
  dailyData, 
  weeklyData, 
  monthlyData,
  yearlyData,
  clinicData 
}: FinanceChartsProps) {
  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '12px',
    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
    padding: '10px 14px',
    color: 'hsl(var(--foreground))',
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40">
          <TabsTrigger value="daily" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">🎵 Andante (Diário)</TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">🎶 Crescendo (Semanal)</TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">🎼 Forte (Mensal)</TabsTrigger>
          <TabsTrigger value="yearly" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">🎹 Fortíssimo (Anual)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="mt-4">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-200 flex items-center space-x-2">
                <span>🎵</span>
                <span>Harmonia Financeira Diária</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="period" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "🎵 Receita Musical"]}
                    labelFormatter={(label) => `🗓️ Compasso: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="total" name="Receita" stroke="#8b5cf6" strokeWidth={2.5} activeDot={{ r: 8, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} dot={{ fill: '#8b5cf6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-4">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-purple-900 dark:text-purple-200 flex items-center space-x-2">
                <span>🎶</span>
                <span>Crescendo Semanal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="period" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Receita"]} />
                  <Legend />
                  <Bar dataKey="total" name="Receita" fill="#82ca9d" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-900 dark:text-green-200 flex items-center space-x-2">
                <span>🎼</span>
                <span>Forte Mensal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="period" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Receita"]} />
                  <Legend />
                  <Bar dataKey="total" name="Receita" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="yearly" className="mt-4">
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-orange-900 dark:text-orange-200 flex items-center space-x-2">
                <span>🎹</span>
                <span>Fortíssimo Anual</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="period" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Receita"]} labelFormatter={(label) => `Ano: ${label}`} />
                  <Legend />
                  <Bar dataKey="total" name="Receita Total" fill="#FF8042" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="text-indigo-900 dark:text-indigo-200 flex items-center space-x-2">
              <span>🎯</span>
              <span>Orquestra de Clínicas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clinicData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="clinic_name"
                  label={({ clinic_name, percent }) => 
                    `${clinic_name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {clinicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Receita"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
