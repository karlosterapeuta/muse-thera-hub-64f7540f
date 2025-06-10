
import React from "react";
import { Control } from "react-hook-form";
import { Sparkles } from "lucide-react";
import { FormField, FormItem } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIKeyPointsForm } from "./AIKeyPointsForm";
import { IndividualSessionForm } from "./IndividualSessionForm";
import { GroupSessionForm } from "./GroupSessionForm";
import { DailyEvolutionForm } from "./DailyEvolutionForm";
import { MonthlyEvolutionForm } from "./MonthlyEvolutionForm";
import { SemesterEvolutionForm } from "./SemesterEvolutionForm";
import { TherapeuticDischargeForm } from "./TherapeuticDischargeForm";
import { TechnicalReportForm } from "./TechnicalReportForm";

type FormValues = {
  patient_id: string;
  date: Date;
  type: string;
  content: Record<string, any>;
};

interface ReportContentTabsProps {
  control: Control<FormValues>;
  selectedType: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  generateWithAI: (keyPoints: string) => Promise<void>;
  isGeneratingWithAI: boolean;
}

export function ReportContentTabs({ 
  control, 
  selectedType, 
  activeTab, 
  setActiveTab, 
  generateWithAI, 
  isGeneratingWithAI 
}: ReportContentTabsProps) {
  if (!selectedType) return null;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ai" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Gerar com IA
        </TabsTrigger>
        <TabsTrigger value="manual">Preenchimento Manual</TabsTrigger>
      </TabsList>
      
      <TabsContent value="ai" className="mt-6">
        <AIKeyPointsForm 
          onGenerate={generateWithAI}
          isGenerating={isGeneratingWithAI}
          reportType={selectedType}
        />
      </TabsContent>
      
      <TabsContent value="manual" className="mt-6">
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
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
              {selectedType === "technical_report" && (
                <TechnicalReportForm
                  content={field.value || {}}
                  onChange={field.onChange}
                />
              )}
            </FormItem>
          )}
        />
      </TabsContent>
    </Tabs>
  );
}
