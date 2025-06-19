
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

export type FinancialAgendaItem = {
  id: string;
  amount: number;
  session_date: string;
  description?: string;
  patient_name?: string;
  clinic_name?: string;
  formatted_date: string;
  formatted_amount: string;
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
  totalPatients: number;
  totalAnamnesis: number;
  totalReports: number;
  financialSchedule: FinancialAgendaItem[];
  isLoading: boolean;
};
