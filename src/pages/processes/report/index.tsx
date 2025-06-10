
import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportFormFields } from "./components/ReportFormFields";
import { ReportContentTabs } from "./components/ReportContentTabs";
import { ReportSubmission } from "./components/ReportSubmission";
import { useReportData } from "./hooks/useReportData";
import { useReportForm } from "./hooks/useReportForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function ReportForm() {
  const { reportId } = useParams();
  const [searchParams] = useSearchParams();
  const patientIdFromQuery = searchParams.get('patient_id');
  const { toast } = useToast();

  const {
    patients,
    isLoadingPatients,
    userEmail,
    userName,
    userId,
    professionalData,
  } = useReportData();

  const {
    form,
    generateWithAI,
    isGeneratingWithAI,
    activeTab,
    setActiveTab,
  } = useReportForm();

  // Carregar dados do relatório se estiver editando
  useEffect(() => {
    const loadReport = async () => {
      if (!reportId) {
        // Se tem patient_id na query, pré-selecionar
        if (patientIdFromQuery) {
          form.setValue('patient_id', patientIdFromQuery);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .eq("id", reportId)
          .single();

        if (error) throw error;

        if (data) {
          form.setValue('patient_id', data.patient_id);
          form.setValue('date', new Date(data.date));
          form.setValue('type', data.type);
          form.setValue('content', data.content || {});
          setActiveTab('manual');
        }
      } catch (error) {
        console.error("Erro ao carregar relatório:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar o relatório.",
        });
      }
    };

    loadReport();
  }, [reportId, patientIdFromQuery, form, setActiveTab, toast]);

  const selectedType = form.watch("type");
  const selectedPatient = patients.find(p => p.id === form.watch("patient_id"));
  const isContentEmpty = !form.watch("content") || Object.keys(form.watch("content") || {}).length === 0;

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>
            {reportId ? "Editar Relatório" : "Novo Relatório"}
          </CardTitle>
          <CardDescription>
            {reportId 
              ? "Edite as informações do relatório existente"
              : "Registre um novo relatório para o paciente"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-6">
              <ReportFormFields
                control={form.control}
                patients={patients}
                isLoadingPatients={isLoadingPatients}
              />

              <ReportContentTabs
                control={form.control}
                selectedType={selectedType}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                generateWithAI={(keyPoints) => generateWithAI(keyPoints, patients)}
                isGeneratingWithAI={isGeneratingWithAI}
              />

              <ReportSubmission
                formData={form.getValues()}
                selectedPatient={selectedPatient}
                professionalData={professionalData}
                userEmail={userEmail}
                userName={userName}
                userId={userId}
                isContentEmpty={isContentEmpty}
                reportId={reportId}
              />
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
