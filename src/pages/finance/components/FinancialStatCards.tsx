
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
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900">Receita de Musicoterapia</CardTitle>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <MusicIcon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">
            R$ {totalEarnings.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-blue-600">
            💰 Harmonia financeira acumulada
          </p>
        </CardContent>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full -mr-8 -mb-8"></div>
      </Card>
      
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-900">Sessões de Musicoterapia</CardTitle>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <HeadphonesIcon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{totalSessions}</div>
          <p className="text-xs text-purple-600">
            🎵 Melodias terapêuticas realizadas
          </p>
        </CardContent>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full -mr-8 -mb-8"></div>
      </Card>
      
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-900">Valor Médio por Sessão</CardTitle>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <TrendingUpIcon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">
            R$ {averagePerSession.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-green-600">
            📈 Crescendo do valor terapêutico
          </p>
        </CardContent>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400/10 to-emerald-600/10 rounded-full -mr-8 -mb-8"></div>
      </Card>
    </div>
  );
}
