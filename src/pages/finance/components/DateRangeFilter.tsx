
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

interface DateRangeFilterProps {
  onFilter: (startDate: string, endDate: string) => void;
}

export function DateRangeFilter({ onFilter }: DateRangeFilterProps) {
  const today = new Date();
  const [startDate, setStartDate] = useState(format(subDays(today, 30), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(today, "yyyy-MM-dd"));
  
  const applyFilter = () => {
    onFilter(startDate, endDate);
  };
  
  const setQuickFilter = (days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    
    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
    
    onFilter(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  };
  
  const setMonthFilter = () => {
    const date = new Date();
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    
    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
    
    onFilter(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
  };
  
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 border-blue-200 dark:border-blue-800">
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickFilter(7)}
              className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50 transition-all duration-300"
            >
              🎵 Última Semana
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickFilter(30)}
              className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:from-purple-200 hover:to-purple-300 dark:hover:from-purple-800/50 dark:hover:to-purple-700/50 transition-all duration-300"
            >
              🎼 Último Movimento (30 dias)
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickFilter(90)}
              className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:from-green-200 hover:to-green-300 dark:hover:from-green-800/50 dark:hover:to-green-700/50 transition-all duration-300"
            >
              🎹 Última Sinfonia (90 dias)
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={setMonthFilter}
              className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:from-orange-200 hover:to-orange-300 dark:hover:from-orange-800/50 dark:hover:to-orange-700/50 transition-all duration-300"
            >
              🎶 Mês Atual
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="text-sm font-medium text-foreground" htmlFor="start-date">De</label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="text-sm font-medium text-foreground" htmlFor="end-date">Até</label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button onClick={applyFilter} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
              🎯 Filtrar Harmonia
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
