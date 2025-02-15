
export type ReportFormData = {
  patient_id: string;
  type: 'initial_evaluation' | 'progress_report' | 'session_summary' | 'discharge_summary' | 'assessment_report';
  content: Record<string, any>;
};
