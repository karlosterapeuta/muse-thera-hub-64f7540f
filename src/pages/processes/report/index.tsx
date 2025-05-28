import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Download, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
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

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Por favor, selecione um paciente",
  }),
  date: z.date({
    required_error: "Por favor, selecione uma data",
  }),
  type: z.string(),
  content: z.record(z.any()),
});

type FormValues = z.infer<typeof formSchema>;

type Patient = {
  id: string;
  name: string;
};

export default function ReportForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [professionalData, setProfessionalData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: {},
    },
  });

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoadingPatients(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        setUserEmail(user.email || "");
        setUserName(formatNameFromEmail(user.email || ""));
        setUserId(user.id);

        console.log("Buscando pacientes para usuário:", user.id);
        
        // Only fetch patients registered by the current user
        const { data, error } = await supabase
          .from("patients")
          .select("id, name")
          .eq("professional_id", user.id)
          .order("name");

        if (error) throw error;
        
        setPatients(data || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar a lista de pacientes",
        });
      } finally {
        setIsLoadingPatients(false);
      }
    }

    fetchData();
  }, [toast]);

  useEffect(() => {
    loadProfessionalData();
  }, []);

  const loadProfessionalData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: professional, error } = await supabase
        .from('professionals')
        .select('name, phone, email')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading professional data:', error);
        return;
      }

      if (professional) {
        setProfessionalData({
          name: professional.name || '',
          phone: professional.phone || '',
          email: professional.email || '',
        });
      }
    } catch (error) {
      console.error('Error loading professional data:', error);
    }
  };

  const generateContentHTML = (content: Record<string, any>, type: string) => {
    if (type === "daily_evolution") {
      return `
        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Estado Inicial
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.initial_state || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Atividades Realizadas
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.activities || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Respostas Observadas
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.responses || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Observações
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.observations || '').split('\n').join('<br>')}
          </div>
        </div>
      `;
    } else if (type === "monthly_evolution") {
      return `
        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Objetivos Terapêuticos
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.therapeutic_objectives || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Conquistas
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.achievements || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Desafios
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.challenges || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Ajustes Necessários
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.adjustments || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Próximos Passos
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.next_steps || '').split('\n').join('<br>')}
          </div>
        </div>
      `;
    } else if (type === "semester_evolution") {
      return `
        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Avaliação Inicial
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.initial_evaluation || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Processo Terapêutico
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.therapeutic_process || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Áreas de Evolução
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.evolution_areas || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Envolvimento Familiar
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.family_involvement || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Conclusões
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.conclusions || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Recomendações
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.recommendations || '').split('\n').join('<br>')}
          </div>
        </div>
      `;
    } else if (type === "therapeutic_discharge") {
      return `
        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Resumo do Tratamento
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.treatment_summary || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Objetivos Alcançados
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.achieved_goals || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Recomendações
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.recommendations || '').split('\n').join('<br>')}
          </div>
        </div>
      `;
    } else if (type === "individual_session") {
      return `
        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Objetivos
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.objectives || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Atividades Realizadas
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.activities || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Resposta do Paciente
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.patient_response || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Observações
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.observations || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Próximos Passos
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            ${String(content.next_steps || '').split('\n').join('<br>')}
          </div>
        </div>
      `;
    } else if (type === "group_session") {
      return `
        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Dados da Sessão em Grupo
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            <strong>Participantes:</strong><br>
            ${String(content.participants || '').split('\n').join('<br>')}<br><br>
            <strong>Tema:</strong><br>
            ${String(content.theme || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Desenvolvimento
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            <strong>Dinâmica do Grupo:</strong><br>
            ${String(content.group_dynamics || '').split('\n').join('<br>')}<br><br>
            <strong>Atividades Realizadas:</strong><br>
            ${String(content.activities || '').split('\n').join('<br>')}
          </div>
        </div>

        <div style="margin-bottom: 28px;">
          <h2 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #E5E7EB;">
            Avaliação
          </h2>
          <div style="background-color: #F9FAFB; padding: 12px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
            <strong>Resposta do Grupo:</strong><br>
            ${String(content.group_response || '').split('\n').join('<br>')}<br><br>
            <strong>Observações:</strong><br>
            ${String(content.observations || '').split('\n').join('<br>')}
          </div>
        </div>
      `;
    }
    return '';
  };

  const generatePDF = async (patientName: string, formValues: FormValues) => {
    const element = document.createElement('div');
    
    element.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #E5E7EB;">
          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 18px; color: #374151; margin-bottom: 8px;">
              ${professionalData.name}
            </h2>
            <p style="font-size: 14px; color: #6B7280; margin-bottom: 4px;">
              ${professionalData.phone}
            </p>
            <p style="font-size: 14px; color: #6B7280; margin-bottom: 16px;">
              ${professionalData.email}
            </p>
          </div>
          <h1 style="color: #2563EB; font-size: 28px; font-weight: bold; margin-bottom: 16px;">
            ${formValues.type === "monthly_evolution" 
              ? "Evolução Mensal" 
              : formValues.type === "daily_evolution" 
              ? "Evolução Diária" 
              : formValues.type === "therapeutic_discharge"
              ? "Alta Terapêutica"
              : formValues.type === "individual_session"
              ? "Relatório de Sessão Individual"
              : formValues.type === "group_session"
              ? "Relatório de Sessão em Grupo"
              : "Evolução Semestral"}
          </h1>
          <h2 style="color: #1F2937; font-size: 22px; margin-bottom: 8px;">
            Paciente: ${patientName}
          </h2>
          <p style="color: #6B7280; font-size: 16px;">
            Data do Relatório: ${format(formValues.date, 'PPP', { locale: ptBR })}
          </p>
        </div>

        <div style="margin-bottom: 32px;">
          ${generateContentHTML(formValues.content, formValues.type)}
        </div>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: center;">
          <p style="color: #6B7280; font-size: 13px; margin-bottom: 4px;">
            Documento gerado em ${format(new Date(), 'PPP', { locale: ptBR })} às ${new Date().toLocaleTimeString('pt-BR')}
          </p>
          <p style="color: #6B7280; font-size: 13px; margin-bottom: 4px;">
            Musetera - Sistema de Gestão para Musicoterapia
          </p>
          <p style="color: #6B7280; font-size: 13px; margin-bottom: 4px;">
            Musicoterapeuta: ${userName}
          </p>
          <p style="color: #6B7280; font-size: 13px;">
            Email: ${userEmail}
          </p>
        </div>
      </div>
    `;

    const opt = {
      margin: [20, 20, 20, 20],
      filename: `${formValues.type === "monthly_evolution" 
        ? "Evolução Mensal" 
        : formValues.type === "daily_evolution" 
        ? "Evolução Diária"
        : formValues.type === "therapeutic_discharge"
        ? "Alta Terapêutica"
        : formValues.type === "individual_session"
        ? "Relatório de Sessão Individual"
        : formValues.type === "group_session"
        ? "Relatório de Sessão em Grupo"
        : "Evolução Semestral"} - ${patientName}.pdf`,
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

  const saveReport = async (data: FormValues) => {
    try {
      console.log("Salvando relatório com dados:", data);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      const { error } = await supabase
        .from("reports")
        .insert({
          patient_id: data.patient_id,
          professional_id: user.id,
          type: data.type as any,
          content: data.content as any,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Erro ao salvar relatório:", error);
        throw error;
      }

      toast({
        title: "Sucesso!",
        description: "Relatório salvo no sistema com sucesso.",
      });

      return true;
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o relatório.",
      });
      return false;
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Submetendo formulário com dados:", data);
      const selectedPatient = patients.find(p => p.id === data.patient_id);
      if (!selectedPatient) {
        throw new Error("Paciente não encontrado");
      }

      // Salva o relatório no banco de dados
      const saved = await saveReport(data);
      if (!saved) return;

      // Gera o PDF
      await generatePDF(selectedPatient.name, data);

      navigate("/processes/reports");
    } catch (error) {
      console.error("Erro ao processar relatório:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível processar o relatório.",
      });
    }
  };

  const handleSaveOnly = async () => {
    const data = form.getValues();
    if (!data.patient_id || !data.type || !data.date) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha paciente, tipo e data do relatório.",
      });
      return;
    }

    await saveReport(data);
  };

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
              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paciente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingPatients ? "Carregando pacientes..." : "Selecione um paciente"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.length > 0 ? (
                          patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-patients" disabled>
                            {isLoadingPatients ? "Carregando pacientes..." : "Nenhum paciente encontrado"}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do Relatório</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ptBR}
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          classNames={{
                            caption_label: "hidden",
                            dropdown_month: "w-full",
                            dropdown_year: "w-full",
                            caption: "flex justify-center pt-1",
                            dropdown: "p-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Relatório</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de relatório" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual_session">
                          Sessão Individual
                        </SelectItem>
                        <SelectItem value="group_session">
                          Sessão em Grupo
                        </SelectItem>
                        <SelectItem value="daily_evolution">
                          Evolução Diária
                        </SelectItem>
                        <SelectItem value="monthly_evolution">
                          Evolução Mensal
                        </SelectItem>
                        <SelectItem value="semester_evolution">
                          Evolução Semestral
                        </SelectItem>
                        <SelectItem value="therapeutic_discharge">
                          Alta Terapêutica
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => {
                  const selectedType = form.watch("type");
                  return (
                    <FormItem>
                      {selectedType === "individual_session" && (
                        <IndividualSessionForm
                          content={field.value || {}}
                          onChange={field.onChange}
                        />
                      )}
                      {selectedType === "group_session" && (
                        <GroupSessionForm
                          content={field.value || {}}
                          onChange={field.onChange}
                        />
                      )}
                      {selectedType === "daily_evolution" && (
                        <DailyEvolutionForm
                          content={field.value || {}}
                          onChange={field.onChange}
                        />
                      )}
                      {selectedType === "monthly_evolution" && (
                        <MonthlyEvolutionForm
                          content={field.value || {}}
                          onChange={field.onChange}
                        />
                      )}
                      {selectedType === "semester_evolution" && (
                        <SemesterEvolutionForm
                          content={field.value || {}}
                          onChange={field.onChange}
                        />
                      )}
                      {selectedType === "therapeutic_discharge" && (
                        <TherapeuticDischargeForm
                          content={field.value || {}}
                          onChange={field.onChange}
                        />
                      )}
                    </FormItem>
                  );
                }}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveOnly}
                  className="w-32"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
                <Button
                  type="submit"
                  className="w-32"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Salvar e Gerar PDF
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
