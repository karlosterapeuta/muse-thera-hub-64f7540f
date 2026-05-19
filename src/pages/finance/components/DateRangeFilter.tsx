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
    <Card className="border-border/60">
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setQuickFilter(7)}>
              Últimos 7 dias
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickFilter(30)}>
              Últimos 30 dias
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickFilter(90)}>
              Últimos 90 dias
            </Button>
            <Button variant="outline" size="sm" onClick={setMonthFilter}>
              Mês atual
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="text-sm font-medium text-foreground" htmlFor="start-date">De</label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="text-sm font-medium text-foreground" htmlFor="end-date">Até</label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <Button onClick={applyFilter}>Aplicar filtro</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
