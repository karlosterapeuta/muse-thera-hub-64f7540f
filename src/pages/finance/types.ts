
export interface Clinic {
  id: string;
  name: string;
  address?: string;
  service_days?: string[];
  patient_ids?: string[];
  created_at?: string;
  updated_at?: string;
}

export type SessionStatus = 'scheduled' | 'completed' | 'no_show';

export interface FinancialRecord {
  id: string;
  professional_id: string;
  clinic_id: string;
  patient_id?: string;
  amount: number;
  session_date: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  
  // Session status
  session_status?: SessionStatus;
  
  // Recurrence fields
  is_recurring?: boolean;
  recurrence_type?: 'weekly' | 'monthly' | 'yearly';
  recurrence_end_date?: string;
  parent_record_id?: string;
  recurrence_pattern?: Record<string, any>;
  
  // Joined data
  clinic_name?: string;
  patient_name?: string;
}

export interface FinancialSummary {
  total: number;
  count: number;
  period: string;
}

export interface ClinicSummary {
  clinic_id: string;
  clinic_name: string;
  total: number;
  count: number;
}

export interface PeriodFilter {
  start_date: string;
  end_date: string;
}

export interface FinanceData {
  dailyEarnings: FinancialSummary[];
  weeklyEarnings: FinancialSummary[];
  monthlyEarnings: FinancialSummary[];
  yearlyEarnings: FinancialSummary[];
  clinicDistribution: ClinicSummary[];
  totalEarnings: number;
  totalSessions: number;
  averagePerSession: number;
}
