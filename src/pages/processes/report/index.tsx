
import React from "react";
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

export default function ReportForm() {
  const {
    patients,
    isLoadingPatients,
    userEmail,
    userName,
    professionalData,
  } = useReportData();

  const {
    form,
    generateWithAI,
    isGeneratingWithAI,
    activeTab,
    setActiveTab,
  } = useReportForm();

  const selectedType = form.watch("type");
  const selectedPatient = patients.find(p => p.id === form.watch("patient_id"));
  const isContentEmpty = !form.watch("content") || Object.keys(form.watch("content") || {}).length === 0;

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Novo Relatório</CardTitle>
          <CardDescription>
            Registre um novo relatório para o paciente
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
                isContentEmpty={isContentEmpty}
              />
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
