
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { FinanceData, PeriodFilter } from "../types";
import { format, subDays, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const useFinanceDashboard = (filter?: PeriodFilter) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["finance-dashboard", filter],
    queryFn: async () => {
      try {
        const now = new Date();
        const startDate = filter?.start_date || format(subDays(now, 30), "yyyy-MM-dd");
        const endDate = filter?.end_date || format(now, "yyyy-MM-dd");
        
        // Fetch records within date range
        const { data: records, error: recordsError } = await supabase
          .from("financial_records")
          .select(`
            id,
            amount,
            session_date,
            clinic_id,
            clinics:clinic_id (name)
          `)
          .gte("session_date", startDate)
          .lte("session_date", endDate)
          .order("session_date");
        
        if (recordsError) throw recordsError;
        if (!records.length) {
          return {
            dailyEarnings: [],
            weeklyEarnings: [],
            monthlyEarnings: [],
            clinicDistribution: [],
            totalEarnings: 0,
            totalSessions: 0,
            averagePerSession: 0,
          };
        }
        
        // Process data for charts
        const total = records.reduce((sum, record) => sum + parseFloat(String(record.amount)), 0);
        const count = records.length;
        const average = count > 0 ? total / count : 0;
        
        // Daily earnings
        const dailyMap = new Map();
        records.forEach(record => {
          const day = record.session_date.substring(0, 10);
          const current = dailyMap.get(day) || { total: 0, count: 0 };
          dailyMap.set(day, {
            total: current.total + parseFloat(String(record.amount)),
            count: current.count + 1,
          });
        });
        
        const dailyEarnings = Array.from(dailyMap.entries()).map(([day, data]) => ({
          period: format(parseISO(day), "dd/MM", { locale: ptBR }),
          total: data.total,
          count: data.count,
        }));
        
        // Weekly and monthly calculations
        const weeklyMap = new Map();
        const monthlyMap = new Map();
        
        records.forEach(record => {
          const date = parseISO(record.session_date);
          const weekKey = `${format(date, 'w', { locale: ptBR })}-${format(date, 'yyyy')}`;
          const monthKey = format(date, 'MMM/yyyy', { locale: ptBR });
          
          const weekCurrent = weeklyMap.get(weekKey) || { total: 0, count: 0 };
          weeklyMap.set(weekKey, {
            total: weekCurrent.total + parseFloat(String(record.amount)),
            count: weekCurrent.count + 1,
          });
          
          const monthCurrent = monthlyMap.get(monthKey) || { total: 0, count: 0 };
          monthlyMap.set(monthKey, {
            total: monthCurrent.total + parseFloat(String(record.amount)),
            count: monthCurrent.count + 1,
          });
        });
        
        const weeklyEarnings = Array.from(weeklyMap.entries()).map(([week, data]) => ({
          period: `Semana ${week.split('-')[0]}`,
          total: data.total,
          count: data.count,
        }));
        
        const monthlyEarnings = Array.from(monthlyMap.entries()).map(([month, data]) => ({
          period: month,
          total: data.total,
          count: data.count,
        }));
        
        // Clinic distribution
        const clinicMap = new Map();
        records.forEach(record => {
          const clinicId = record.clinic_id;
          const clinicName = record.clinics?.name || "Desconhecido";
          const current = clinicMap.get(clinicId) || { total: 0, count: 0, name: clinicName };
          clinicMap.set(clinicId, {
            total: current.total + parseFloat(String(record.amount)),
            count: current.count + 1,
            name: clinicName,
          });
        });
        
        const clinicDistribution = Array.from(clinicMap.entries()).map(([id, data]) => ({
          clinic_id: id,
          clinic_name: data.name,
          total: data.total,
          count: data.count,
        }));
        
        // Return results
        return {
          dailyEarnings,
          weeklyEarnings,
          monthlyEarnings,
          clinicDistribution,
          totalEarnings: total,
          totalSessions: count,
          averagePerSession: average,
        } as FinanceData;
        
      } catch (error: any) {
        toast({
          title: "Erro ao carregar dados financeiros",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    },
  });
};
