
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek, endOfWeek, addDays, isToday, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

type FinancialRecordType = {
  id: string;
  amount: number;
  session_date: string;
  description?: string;
  clinic_name: string;
  formatted_date: string;
  formatted_amount: string;
};

type DayFinancialType = {
  date: Date;
  formatted_date: string;
  day_name: string;
  records: FinancialRecordType[];
  total: number;
};

export function FinancialWeeklySchedule({ isLoading }: { isLoading?: boolean }) {
  const [weekFinancials, setWeekFinancials] = useState<DayFinancialType[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyFinancials = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No user found");
          setLocalLoading(false);
          return;
        }

        // Get professional_id for the current user
        const { data: professional, error: professionalError } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (professionalError || !professional) {
          console.log("No professional profile found for user");
          setLocalLoading(false);
          return;
        }

        // Get current week dates
        const today = new Date();
        const startDate = startOfWeek(today, { weekStartsOn: 0 });
        const endDate = endOfWeek(today, { weekStartsOn: 0 });
        
        // Format dates for Supabase query
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(endDate, "yyyy-MM-dd");
        
        // Fetch financial records for this week, filtered by professional
        const { data: records, error } = await supabase
          .from("financial_records")
          .select(`
            id, 
            amount, 
            session_date, 
            description,
            clinic_id,
            clinics:clinic_id (name)
          `)
          .eq('professional_id', user.id)
          .gte('session_date', formattedStartDate)
          .lte('session_date', formattedEndDate)
          .order('session_date');
          
        if (error) {
          console.error("Error fetching weekly financial records:", error);
          return;
        }

        // Prepare data structure for the week
        const daysOfWeek: DayFinancialType[] = [];
        for (let i = 0; i < 7; i++) {
          const date = addDays(startDate, i);
          daysOfWeek.push({
            date,
            formatted_date: format(date, "dd/MM", { locale: ptBR }),
            day_name: format(date, "EEEE", { locale: ptBR }),
            records: [],
            total: 0
          });
        }

        // Organize records by day
        if (records) {
          records.forEach(record => {
            const recordDate = parseISO(record.session_date);
            const dayIndex = daysOfWeek.findIndex(day => 
              isSameDay(day.date, recordDate)
            );
            
            if (dayIndex !== -1) {
              const formattedRecord: FinancialRecordType = {
                id: record.id,
                amount: record.amount,
                session_date: record.session_date,
                description: record.description,
                clinic_name: record.clinics?.name || "Clínica não encontrada",
                formatted_date: format(recordDate, "dd/MM", { locale: ptBR }),
                formatted_amount: new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(record.amount)
              };
              
              daysOfWeek[dayIndex].records.push(formattedRecord);
              daysOfWeek[dayIndex].total += record.amount;
            }
          });
        }
        
        setWeekFinancials(daysOfWeek);
      } catch (error) {
        console.error("Error in financial weekly schedule:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchWeeklyFinancials();
  }, []);
  
  const loading = isLoading || localLoading;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Agenda Financeira Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p>Carregando agenda financeira...</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] md:h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {weekFinancials.map((day) => (
                <div 
                  key={day.formatted_date}
                  className={`border rounded-lg p-3 ${isToday(day.date) ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium capitalize">
                      {day.day_name}
                    </h4>
                    <Badge variant={isToday(day.date) ? "default" : "outline"}>
                      {day.formatted_date}
                    </Badge>
                  </div>
                  
                  {day.records.length > 0 ? (
                    <div className="space-y-3">
                      {day.records.map((record) => (
                        <div key={record.id} className="flex items-start gap-2 bg-card p-2 rounded-md border">
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                              <DollarSign className="h-3 w-3" />
                              <span>{record.formatted_amount}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              <span className="truncate">{record.clinic_name}</span>
                            </div>
                            {record.description && (
                              <p className="text-xs text-muted-foreground truncate">
                                {record.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t">
                        <div className="text-sm font-bold text-primary">
                          Total: {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(day.total)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                      {isToday(day.date) ? 'Nenhum registro hoje' : 'Nenhum registro'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
