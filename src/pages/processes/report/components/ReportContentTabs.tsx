
import React from "react";
import { Control } from "react-hook-form";
import { Sparkles, Zap } from "lucide-react";
import { FormField, FormItem } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AIKeyPointsForm } from "./AIKeyPointsForm";
import { IndividualSessionForm } from "./IndividualSessionForm";
import { GroupSessionForm } from "./GroupSessionForm";
import { DailyEvolutionForm } from "./DailyEvolutionForm";
import { MonthlyEvolutionForm } from "./MonthlyEvolutionForm";
import { SemesterEvolutionForm } from "./SemesterEvolutionForm";
import { TherapeuticDischargeForm } from "./TherapeuticDischargeForm";
import { TechnicalReportForm } from "./TechnicalReportForm";
import { FormValues } from "../hooks/useReportForm";

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
    <div className="w-full space-y-6">
      {/* Hero Section para IA */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-1">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-cyan-400/20 animate-pulse"></div>
        <div className="relative bg-white/95 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full animate-bounce"></div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Geração Inteligente com IA
            </h3>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse">
              NOVO
            </Badge>
          </div>
          <p className="text-center text-gray-600 mb-4">
            🚀 Crie relatórios profissionais em segundos com nossa IA especializada em musicoterapia
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setActiveTab('ai')}
              className={`group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 ${
                activeTab === 'ai' ? 'scale-105 shadow-purple-500/25' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative flex items-center gap-3">
                <Zap className="h-6 w-6 animate-bounce" />
                Gerar com IA Agora
                <Sparkles className="h-5 w-5 animate-spin" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-100 rounded-xl p-1">
          <TabsTrigger 
            value="ai" 
            className={`flex items-center gap-3 text-base font-semibold rounded-lg transition-all duration-300 ${
              activeTab === 'ai' 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105' 
                : 'hover:bg-white/50'
            }`}
          >
            <div className="relative">
              <Sparkles className={`h-5 w-5 ${activeTab === 'ai' ? 'animate-pulse text-yellow-300' : ''}`} />
              {activeTab === 'ai' && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              )}
            </div>
            Gerar com IA
            {activeTab === 'ai' && (
              <Badge className="bg-yellow-400 text-purple-900 text-xs animate-pulse">
                ATIVO
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="manual"
            className="flex items-center gap-2 text-base font-semibold rounded-lg transition-all duration-300 hover:bg-white/50"
          >
            Preenchimento Manual
          </TabsTrigger>
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
    </div>
  );
}
