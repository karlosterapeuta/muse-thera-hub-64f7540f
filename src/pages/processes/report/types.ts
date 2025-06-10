
export type ReportFormData = {
  patient_id: string;
  type: 
    | 'individual_session'
    | 'group_session'
    | 'daily_evolution'
    | 'monthly_evolution'
    | 'semester_evolution'
    | 'therapeutic_discharge'
    | 'administrative_discharge'
    | 'tea_scale'
    | 'family_report'
    | 'team_report'
    | 'technical_report';
  content: Record<string, any>;
};
