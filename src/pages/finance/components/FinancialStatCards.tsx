
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MusicIcon, HeadphonesIcon, TrendingUpIcon } from "lucide-react";

interface FinancialStatCardsProps {
  totalEarnings: number;
  totalSessions: number;
  averagePerSession: number;
}

export function FinancialStatCards({ 
  totalEarnings, 
  totalSessions, 
  averagePerSession 
}: FinancialStatCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-200">Receita de Musicoterapia</CardTitle>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <MusicIcon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            R$ {totalEarnings.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            💰 Harmonia financeira acumulada
          </p>
        </CardContent>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full -mr-8 -mb-8"></div>
      </Card>
      
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-200">Sessões de Musicoterapia</CardTitle>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <HeadphonesIcon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalSessions}</div>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            🎵 Melodias terapêuticas realizadas
          </p>
        </CardContent>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full -mr-8 -mb-8"></div>
      </Card>
      
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-900 dark:text-green-200">Valor Médio por Sessão</CardTitle>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <TrendingUpIcon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            R$ {averagePerSession.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400">
            📈 Crescendo do valor terapêutico
          </p>
        </CardContent>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400/10 to-emerald-600/10 rounded-full -mr-8 -mb-8"></div>
      </Card>
    </div>
  );
}
