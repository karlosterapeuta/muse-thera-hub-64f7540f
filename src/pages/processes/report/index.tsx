
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
  const [formData, setFormData] = useState<ReportFormData>({
    patient_id: "",
    type: "individual_session",
    content: {},
  });

  useEffect(() => {
    async function loadPatients() {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("id, name")
          .order("name");

        if (error) throw error;

        if (data) {
          setPatients(data);
        }
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar pacientes",
          description: "Não foi possível carregar a lista de pacientes",
        });
      }
    }

    loadPatients();
  }, [toast]);

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
      // Primeiro, salva o relatório no banco de dados
      const { error } = await supabase.from("reports").insert({
        patient_id: formData.patient_id,
        type: formData.type,
        content: formData.content,
      });

      if (error) throw error;

      // Encontra o paciente selecionado
      const selectedPatient = patients.find(p => p.id === formData.patient_id);
      const reportType = reportTypes.find(t => t.value === formData.type)?.label || "Relatório";
      
      // Cria um elemento temporário para renderizar o conteúdo do PDF
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="text-align: center;">${reportType}</h1>
          <h2>Paciente: ${selectedPatient?.name || 'Não especificado'}</h2>
          <hr />
          ${Object.entries(formData.content).map(([key, value]) => `
            <div style="margin-bottom: 20px;">
              <h3>${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
              <p style="white-space: pre-line;">${value}</p>
            </div>
          `).join('')}
        </div>
      `;

      // Configurações do PDF
      const opt = {
        margin: 1,
        filename: `${reportType} - ${selectedPatient?.name || 'Relatório'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
      };

      // Gera o PDF
      await html2pdf().from(element).set(opt).save();

      toast({
        title: "Relatório gerado com sucesso",
        description: "O relatório foi salvo e baixado em PDF",
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
