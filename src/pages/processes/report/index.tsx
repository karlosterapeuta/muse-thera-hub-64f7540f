
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientSelect } from "@/pages/anamnesis/components/PatientSelect";
import { SelectField } from "@/pages/anamnesis/components/SelectField";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { IndividualSessionForm } from "./components/IndividualSessionForm";
import { GroupSessionForm } from "./components/GroupSessionForm";
import { DailyEvolutionForm } from "./components/DailyEvolutionForm";
import { MonthlyEvolutionForm } from "./components/MonthlyEvolutionForm";
import { SemesterEvolutionForm } from "./components/SemesterEvolutionForm";
import { TherapeuticDischargeForm } from "./components/TherapeuticDischargeForm";
import { AdministrativeDischargeForm } from "./components/AdministrativeDischargeForm";
import { TeaScaleForm } from "./components/TeaScaleForm";
import { FamilyReportForm } from "./components/FamilyReportForm";
import { TeamReportForm } from "./components/TeamReportForm";
import { TechnicalReportForm } from "./components/TechnicalReportForm";
import html2pdf from "html2pdf.js";
import type { ReportFormData } from "./types";

const reportTypes = [
  { value: "individual_session", label: "Relatório de Sessão Individual" },
  { value: "group_session", label: "Relatório de Sessão em Grupo" },
  { value: "daily_evolution", label: "Evolução Diária" },
  { value: "monthly_evolution", label: "Evolução Mensal" },
  { value: "semester_evolution", label: "Evolução Semestral" },
  { value: "therapeutic_discharge", label: "Alta Terapêutica" },
  { value: "administrative_discharge", label: "Alta Administrativa" },
  { value: "tea_scale", label: "Escala TEA" },
  { value: "family_report", label: "Relatório para Família" },
  { value: "team_report", label: "Relatório para Equipe" },
  { value: "technical_report", label: "Relatório Técnico" },
];

export default function ReportPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [formData, setFormData] = useState<ReportFormData>({
    patient_id: "",
    type: "individual_session",
    content: {},
  });

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        setUserEmail(user.email || "");
        setUserName(formatNameFromEmail(user.email || ""));

        const { data, error } = await supabase
          .from("patients")
          .select("id, name")
          .order("name");

        if (error) throw error;

        if (data) {
          setPatients(data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar a lista de pacientes",
        });
      }
    }

    loadData();
  }, [toast]);

  const generatePDF = async (patientName: string) => {
    const element = document.createElement('div');
    
    const generateContentHTML = (content: Record<string, any>) => {
      return Object.entries(content)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => {
          const label = key.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          let displayValue = value;
          if (Array.isArray(value)) {
            displayValue = value.join('\n');
          } else if (typeof value === 'object') {
            displayValue = JSON.stringify(value, null, 2);
          }

          return `
            <div style="margin-bottom: 20px; page-break-inside: avoid;">
              <div style="font-weight: 600; font-size: 13px; margin-bottom: 3px; color: #374151;">
                ${label}
              </div>
              <div style="background-color: #F9FAFB; padding: 6px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 12px; line-height: 1.5; color: #1F2937; white-space: pre-wrap;">
                ${String(displayValue).replace(/\n/g, '<br>')}
              </div>
            </div>
          `;
        })
        .join('');
    };

    const reportTitle = reportTypes.find(t => t.value === formData.type)?.label || "Relatório";

    element.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #E5E7EB;">
          <div style="margin-bottom: 24px;">
            <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" style="width: 200px; height: auto; margin: 0 auto;">
          </div>
          <h1 style="color: #2563EB; font-size: 24px; font-weight: bold; margin-bottom: 12px;">
            ${reportTitle}
          </h1>
          <h2 style="color: #1F2937; font-size: 18px; margin-bottom: 6px;">
            Paciente: ${patientName}
          </h2>
          <p style="color: #6B7280; font-size: 13px;">
            Data: ${new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div style="margin-bottom: 24px;">
          ${generateContentHTML(formData.content)}
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #E5E7EB; text-align: center;">
          <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
            Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
          </p>
          <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
            Musetera - Sistema de Gestão para Musicoterapia
          </p>
          <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
            Musicoterapeuta: ${userName}
          </p>
          <p style="color: #6B7280; font-size: 11px;">
            Email: ${userEmail}
          </p>
        </div>
      </div>
    `;

    const opt = {
      margin: [20, 20, 20, 20],
      filename: `${reportTitle} - ${patientName}.pdf`,
      pagebreak: { mode: 'avoid-all' },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
      },
    };

    await html2pdf().from(element).set(opt).save();
  };

  const handleDownloadPDF = async () => {
    if (!formData.patient_id) {
      toast({
        variant: "destructive",
        title: "Erro ao gerar relatório",
        description: "Por favor, selecione um paciente",
      });
      return;
    }

    try {
      const { error } = await supabase.from("reports").insert({
        patient_id: formData.patient_id,
        type: formData.type,
        content: formData.content,
      });

      if (error) throw error;

      const selectedPatient = patients.find(p => p.id === formData.patient_id);
      if (selectedPatient) {
        await generatePDF(selectedPatient.name);
      }

      toast({
        title: "Sucesso!",
        description: "Relatório salvo e PDF gerado com sucesso.",
      });

      navigate("/processos/relatorios");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao tentar gerar o relatório",
      });
    }
  };

  const renderForm = () => {
    const props = {
      content: formData.content,
      onChange: (content: Record<string, any>) =>
        setFormData((prev) => ({ ...prev, content })),
    };

    switch (formData.type) {
      case "individual_session":
        return <IndividualSessionForm {...props} />;
      case "group_session":
        return <GroupSessionForm {...props} />;
      case "daily_evolution":
        return <DailyEvolutionForm {...props} />;
      case "monthly_evolution":
        return <MonthlyEvolutionForm {...props} />;
      case "semester_evolution":
        return <SemesterEvolutionForm {...props} />;
      case "therapeutic_discharge":
        return <TherapeuticDischargeForm {...props} />;
      case "administrative_discharge":
        return <AdministrativeDischargeForm {...props} />;
      case "tea_scale":
        return <TeaScaleForm {...props} />;
      case "family_report":
        return <FamilyReportForm {...props} />;
      case "team_report":
        return <TeamReportForm {...props} />;
      case "technical_report":
        return <TechnicalReportForm {...props} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Relatório</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PatientSelect
          patients={patients}
          selectedPatient={formData.patient_id}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, patient_id: value }))
          }
        />

        <SelectField
          label="Tipo de Relatório"
          value={formData.type}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              type: value as ReportFormData["type"],
              content: {},
            }))
          }
          options={reportTypes}
        />

        {renderForm()}

        <Button onClick={handleDownloadPDF} className="w-full">
          Baixar Relatório
        </Button>
      </CardContent>
    </Card>
  );
}
