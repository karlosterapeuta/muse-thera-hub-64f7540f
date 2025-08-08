
import { useState } from 'react';
import { generateStaticPDF } from '@/utils/staticPDFGenerator';
import { TeaScalePDFStatic } from '@/components/TeaScalePDFStatic';
import { ParametersGraphsPDFStatic } from '@/components/ParametersGraphsPDFStatic';
import { EnhancedMuseteraReportPDF } from '@/components/EnhancedMuseteraReportPDF';
import { PrintableMuseTeraScalePDF } from '@/components/PrintableMuseTeraScalePDF';
import React from 'react';
import { ProfessionalData } from '@/hooks/useProfessionalData';

interface EvaluationData {
  categoryData: any[];
  pieData: any[];
  radarData: any[];
  selectedParameters: any;
  overallScore: {
    raw: number;
    max: number;
    percentage: number;
    completionPercentage: number;
    evaluatedDomains: number;
    totalDomains: number;
    evaluatedParameters: number;
    totalParameters: number;
  };
  evaluationDomains: any[];
  patientName: string;
  professionalData?: ProfessionalData | null;
  evaluationDate: Date;
  patientData?: {
    age?: number;
    birthDate?: string;
    diagnosis?: string;
    medications?: string;
    musicalPreferences?: string;
    previousTherapies?: string;
    familyHistory?: string;
    developmentConcerns?: string;
  };
}

export const useEvaluationPDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTeaScalePDF = async (data: EvaluationData): Promise<boolean> => {
    setIsGenerating(true);
    try {
      console.log("📋 Gerando PDF TEA Scale com gráficos estáticos...");
      
      const component = React.createElement(TeaScalePDFStatic, {
        categoryData: data.categoryData,
        pieData: data.pieData,
        radarData: data.radarData,
        selectedParameters: data.selectedParameters,
        overallScore: data.overallScore,
        evaluationDomains: data.evaluationDomains,
        patientName: data.patientName,
        professionalData: data.professionalData
      });

      return await generateStaticPDF(component, {
        filename: `TEA_Scale_${data.patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        waitTime: 3000,
        quality: 1.8
      });
      
    } catch (error) {
      console.error("Erro ao gerar PDF TEA Scale:", error);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateParametersPDF = async (data: EvaluationData): Promise<boolean> => {
    setIsGenerating(true);
    try {
      console.log("📊 Gerando PDF de Parâmetros com gráficos estáticos...");
      
      const component = React.createElement(ParametersGraphsPDFStatic, {
        categoryData: data.categoryData,
        pieData: data.pieData,
        radarData: data.radarData,
        overallScore: data.overallScore,
        patientName: data.patientName,
        professionalData: data.professionalData,
        evaluationDate: data.evaluationDate
      });

      return await generateStaticPDF(component, {
        filename: `Parametros_Graficos_${data.patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        waitTime: 3000,
        quality: 1.8
      });
      
    } catch (error) {
      console.error("Erro ao gerar PDF de Parâmetros:", error);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReportPDF = async (data: EvaluationData): Promise<boolean> => {
    setIsGenerating(true);
    try {
      console.log("📑 Gerando Relatório MuseTera Aprimorado...");
      
      const component = React.createElement(EnhancedMuseteraReportPDF, {
        categoryData: data.categoryData,
        pieData: data.pieData,
        radarData: data.radarData,
        selectedParameters: data.selectedParameters,
        overallScore: data.overallScore,
        evaluationDomains: data.evaluationDomains,
        patientName: data.patientName,
        professionalData: data.professionalData,
        evaluationDate: data.evaluationDate,
        patientData: data.patientData
      });

      return await generateStaticPDF(component, {
        filename: `Relatorio_MuseTera_Completo_${data.patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        waitTime: 5000,
        quality: 2.0
      });
      
    } catch (error) {
      console.error("Erro ao gerar Relatório MuseTera:", error);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBlankScalePDF = async (
    params: { patientName?: string; professionalName?: string; evaluationDate?: Date } = {}
  ): Promise<boolean> => {
    setIsGenerating(true);
    try {
      console.log("📝 Gerando Escala MuseTera para impressão...");

      const component = React.createElement(PrintableMuseTeraScalePDF, {
        patientName: params.patientName,
        professionalName: params.professionalName,
        evaluationDate: params.evaluationDate,
      });

      return await generateStaticPDF(component, {
        filename: `Escala_MuseTera_Impressao_${new Date().toISOString().split('T')[0]}.pdf`,
        waitTime: 2200,
        quality: 2.0,
        format: 'a4',
        orientation: 'portrait',
      });
    } catch (error) {
      console.error("Erro ao gerar Escala MuseTera (impressão):", error);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateTeaScalePDF,
    generateParametersPDF,
    generateReportPDF,
    generateBlankScalePDF,
  };
};
