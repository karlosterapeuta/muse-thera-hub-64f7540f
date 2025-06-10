
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export type DashboardSession = {
  id: string;
  date: Date;
  patient_name: string;
  formatted_time: string;
  formatted_date: string;
  financial_amount?: number;
  notes?: string;
};

export type DayData = {
  date: Date;
  formatted_date: string;
  day_name: string;
  sessions: DashboardSession[];
  total_financial: number;
  session_count: number;
};

export type DashboardData = {
  weekDays: DayData[];
  totalSessions: number;
  totalRevenue: number;
  averagePerSession: number;
  upcomingSessions: any[];
  monthlyChange: number;
  completionRate: number;
  sessionData: any[];
  isLoading: boolean;
  error?: string;
};

export type SupabaseSession = {
  id: string;
  date: string;
  notes?: string;
  patient_id: string;
  patients?: {
    id: string;
    name: string;
    professional_id: string;
  };
};

export type FinancialRecord = {
  id: string;
  amount: number;
  session_date: string;
  description: string;
  professional_id: string;
};
