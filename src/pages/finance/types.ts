
export interface Clinic {
  id: string;
  name: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

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
  clinicDistribution: ClinicSummary[];
  totalEarnings: number;
  totalSessions: number;
  averagePerSession: number;
}
