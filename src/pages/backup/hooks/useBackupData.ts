import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BackupStatistics {
  patients: number;
  anamnesis: number;
  assessments: number;
  treatmentPlans: number;
  reports: number;
  financialRecords: number;
  clinics: number;
  sessions: number;
}

export interface BackupData {
  patients: any[];
  anamnesis: any[];
  assessments: any[];
  treatmentPlans: any[];
  reports: any[];
  financialRecords: any[];
  clinics: any[];
  sessions: any[];
  professional: any;
}

export function useBackupStatistics() {
  return useQuery({
    queryKey: ["backup-statistics"],
    queryFn: async (): Promise<BackupStatistics> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const [
        patientsResult,
        anamnesisResult,
        assessmentsResult,
        treatmentPlansResult,
        reportsResult,
        financialResult,
        clinicsResult,
        sessionsResult,
      ] = await Promise.all([
        supabase.from("patients").select("id", { count: "exact", head: true }).eq("professional_id", user.id),
        supabase.from("anamnesis").select("id", { count: "exact", head: true }).eq("professional_id", user.id),
        supabase.from("assessments").select("id", { count: "exact", head: true }),
        supabase.from("treatment_plans").select("id", { count: "exact", head: true }),
        supabase.from("reports").select("id", { count: "exact", head: true }),
        supabase.from("financial_records").select("id", { count: "exact", head: true }).eq("professional_id", user.id),
        supabase.from("clinics").select("id", { count: "exact", head: true }).eq("created_by", user.id),
        supabase.from("sessions").select("id", { count: "exact", head: true }),
      ]);

      return {
        patients: patientsResult.count || 0,
        anamnesis: anamnesisResult.count || 0,
        assessments: assessmentsResult.count || 0,
        treatmentPlans: treatmentPlansResult.count || 0,
        reports: reportsResult.count || 0,
        financialRecords: financialResult.count || 0,
        clinics: clinicsResult.count || 0,
        sessions: sessionsResult.count || 0,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

export async function fetchBackupData(categories: string[]): Promise<Partial<BackupData>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  const data: Partial<BackupData> = {};

  // Fetch professional data
  const { data: professional } = await supabase
    .from("professionals")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  
  data.professional = professional;

  // Fetch each category
  if (categories.includes("patients")) {
    const { data: patients } = await supabase
      .from("patients")
      .select("*")
      .eq("professional_id", user.id);
    data.patients = patients || [];
  }

  if (categories.includes("anamnesis")) {
    const { data: anamnesis } = await supabase
      .from("anamnesis")
      .select("*")
      .eq("professional_id", user.id);
    data.anamnesis = anamnesis || [];
  }

  if (categories.includes("assessments")) {
    const { data: assessments } = await supabase
      .from("assessments")
      .select("*");
    data.assessments = assessments || [];
  }

  if (categories.includes("treatmentPlans")) {
    const { data: plans } = await supabase
      .from("treatment_plans")
      .select("*");
    data.treatmentPlans = plans || [];
  }

  if (categories.includes("reports")) {
    const { data: reports } = await supabase
      .from("reports")
      .select("*");
    data.reports = reports || [];
  }

  if (categories.includes("financialRecords")) {
    const { data: records } = await supabase
      .from("financial_records")
      .select("*")
      .eq("professional_id", user.id);
    data.financialRecords = records || [];
  }

  if (categories.includes("clinics")) {
    const { data: clinics } = await supabase
      .from("clinics")
      .select("*")
      .eq("created_by", user.id);
    data.clinics = clinics || [];
  }

  if (categories.includes("sessions")) {
    const { data: sessions } = await supabase
      .from("sessions")
      .select("*");
    data.sessions = sessions || [];
  }

  return data;
}
