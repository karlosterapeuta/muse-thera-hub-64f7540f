
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientSelect } from "@/pages/anamnesis/components/PatientSelect";
import { SelectField } from "@/pages/anamnesis/components/SelectField";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { InitialEvaluationForm } from "./components/InitialEvaluationForm";
import { ProgressReportForm } from "./components/ProgressReportForm";
import { SessionSummaryForm } from "./components/SessionSummaryForm";
import { DischargeSummaryForm } from "./components/DischargeSummaryForm";
import { AssessmentReportForm } from "./components/AssessmentReportForm";
import type { ReportFormData } from "./types";

const reportTypes = [
  { value: "initial_evaluation", label: "Avaliação Inicial" },
  { value: "progress_report", label: "Relatório de Progresso" },
  { value: "session_summary", label: "Resumo de Sessão" },
  { value: "discharge_summary", label: "Resumo de Alta" },
  { value: "assessment_report", label: "Relatório de Avaliação" },
];

export default function ReportPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState<ReportFormData>({
    patient_id: "",
    type: "initial_evaluation",
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

  const handleSubmit = async () => {
    if (!formData.patient_id) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar relatório",
        description: "Por favor, selecione um paciente",
      });
      return;
    }

    try {
      console.log("Enviando dados do relatório:", formData); // Debug log

      const { error } = await supabase.from("reports").insert({
        patient_id: formData.patient_id,
        type: formData.type,
        content: formData.content,
      });

      if (error) {
        console.error("Erro ao inserir relatório:", error); // Debug log
        throw error;
      }

      console.log("Relatório salvo com sucesso"); // Debug log

      toast({
        title: "Relatório salvo com sucesso",
        description: "O relatório foi registrado no sistema",
      });

      navigate("/processos/relatorios");
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar relatório",
        description: "Ocorreu um erro ao tentar salvar o relatório",
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
      case "initial_evaluation":
        return <InitialEvaluationForm {...props} />;
      case "progress_report":
        return <ProgressReportForm {...props} />;
      case "session_summary":
        return <SessionSummaryForm {...props} />;
      case "discharge_summary":
        return <DischargeSummaryForm {...props} />;
      case "assessment_report":
        return <AssessmentReportForm {...props} />;
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

        <Button onClick={handleSubmit} className="w-full">
          Salvar Relatório
        </Button>
      </CardContent>
    </Card>
  );
}
