
import { useState } from 'react';
import { generateStaticPDF } from '@/utils/staticPDFGenerator';
import { TeaScalePDFStatic } from '@/components/TeaScalePDFStatic';
import { ParametersGraphsPDFStatic } from '@/components/ParametersGraphsPDFStatic';
import { MuseteraReportPDF } from '@/components/MuseteraReportPDF';
import React from 'react';

interface EvaluationData {
  categoryData: any[];
  pieData: any[];
  radarData: any[];
  selectedParameters: any;
  overallScore: {
    raw: number;
    max: number;
    percentage: number;
  };
  evaluationDomains: any[];
  patientName: string;
  evaluatorName: string;
  evaluatorEmail: string;
  evaluationDate: Date;
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
        evaluatorName: data.evaluatorName,
        evaluatorEmail: data.evaluatorEmail
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
        evaluatorName: data.evaluatorName,
        evaluatorEmail: data.evaluatorEmail,
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
      console.log("📑 Gerando Relatório PDF com gráficos estáticos...");
      
      const component = React.createElement(MuseteraReportPDF, {
        categoryData: data.categoryData,
        pieData: data.pieData,
        radarData: data.radarData,
        selectedParameters: data.selectedParameters,
        overallScore: data.overallScore,
        evaluationDomains: data.evaluationDomains,
        patientName: data.patientName,
        evaluatorName: data.evaluatorName,
        evaluatorEmail: data.evaluatorEmail,
        evaluationDate: data.evaluationDate
      });

      return await generateStaticPDF(component, {
        filename: `Relatorio_Completo_${data.patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        waitTime: 4000,
        quality: 1.8
      });
      
    } catch (error) {
      console.error("Erro ao gerar Relatório PDF:", error);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateTeaScalePDF,
    generateParametersPDF,
    generateReportPDF
  };
};
