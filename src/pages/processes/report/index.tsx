
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ReportFormFields } from "./components/ReportFormFields";
import { ReportContentTabs } from "./components/ReportContentTabs";
import { useReportData } from "./hooks/useReportData";
import { generatePDF } from "./utils/pdfGenerator";

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Por favor, selecione um paciente",
  }),
  date: z.date({
    required_error: "Por favor, selecione uma data",
  }),
  type: z.string({
    required_error: "Por favor, selecione o tipo de relatório",
  }),
  content: z.record(z.any()).default({}),
});

type FormValues = z.infer<typeof formSchema>;

export default function ReportForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");

  const {
    patients,
    isLoadingPatients,
    userEmail,
    userName,
    professionalData,
  } = useReportData();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: "",
      type: "",
      content: {},
    },
  });

  const generateWithAI = async (keyPoints: string) => {
    setIsGeneratingWithAI(true);
    try {
      const selectedPatient = patients.find(p => p.id === form.getValues('patient_id'));
      const selectedType = form.getValues('type');
      const selectedDate = form.getValues('date');

      if (!selectedPatient || !selectedType || !selectedDate) {
        toast({
          variant: "destructive",
          title: "Dados incompletos",
          description: "Por favor, selecione paciente, data e tipo de relatório antes de gerar com IA.",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: {
          reportType: selectedType,
          keyPoints: keyPoints,
          patientName: selectedPatient.name,
          evaluationDate: format(selectedDate, 'yyyy-MM-dd')
        }
      });

      if (error) throw error;

      if (data.content) {
        form.setValue('content', data.content);
        setActiveTab('manual');
        toast({
          title: "Relatório gerado!",
          description: "O conteúdo foi gerado pela IA. Revise e edite conforme necessário.",
        });
      }

    } catch (error) {
      console.error('Erro ao gerar relatório com IA:', error);
      toast({
        variant: "destructive",
        title: "Erro na geração",
        description: "Não foi possível gerar o relatório com IA. Tente novamente ou preencha manualmente.",
      });
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Submetendo formulário com dados:", data);
      const selectedPatient = patients.find(p => p.id === data.patient_id);
      if (!selectedPatient) {
        throw new Error("Paciente não encontrado");
      }

      const { error } = await supabase
        .from("assessments")
        .insert({
          patient_id: data.patient_id,
          date: format(data.date, "yyyy-MM-dd'T'HH:mm:ssXXX"),
          type: data.type,
          content: data.content,
        });

      if (error) throw error;

      await generatePDF(selectedPatient.name, data, professionalData, userEmail, userName);

      toast({
        title: "Sucesso!",
        description: "Relatório registrado e PDF gerado com sucesso.",
      });

      navigate("/processes");
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o relatório.",
      });
    }
  };

  const selectedType = form.watch("type");

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                generateWithAI={generateWithAI}
                isGeneratingWithAI={isGeneratingWithAI}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="submit"
                  className="w-32"
                  disabled={!form.watch("content") || Object.keys(form.watch("content") || {}).length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Gerar PDF
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
