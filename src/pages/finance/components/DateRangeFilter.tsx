
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
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickFilter(7)}
              className="bg-white/80 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              🎵 Última Semana
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickFilter(30)}
              className="bg-white/80 border-purple-200 text-purple-700 hover:bg-purple-100"
            >
              🎼 Último Movimento (30 dias)
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickFilter(90)}
              className="bg-white/80 border-green-200 text-green-700 hover:bg-green-100"
            >
              🎹 Última Sinfonia (90 dias)
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={setMonthFilter}
              className="bg-white/80 border-orange-200 text-orange-700 hover:bg-orange-100"
            >
              🎶 Mês Atual
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="text-sm font-medium" htmlFor="start-date">De</label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="text-sm font-medium" htmlFor="end-date">Até</label>
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
