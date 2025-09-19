import React from 'react';
import { User, FileText, Target, Music, Users, Clock, CheckCircle, Activity, BarChart, RefreshCw } from 'lucide-react';
import { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';

interface MusicotherapyTreatmentPlanPDFProps {
  planData: MusicotherapyTreatmentPlan;
  therapistName?: string;
}

export const MusicotherapyTreatmentPlanPDF: React.FC<MusicotherapyTreatmentPlanPDFProps> = ({ 
  planData, 
  therapistName 
}) => {
  const currentDate = new Date().toLocaleDateString('pt-BR');

  const renderSection = (title: string, icon: React.ElementType, children: React.ReactNode, bgColor = "bg-blue-50") => {
    const IconComponent = icon;
    return (
      <div className={`${bgColor} border-l-4 border-blue-500 p-6 mb-6 rounded-r-lg`}>
        <div className="flex items-center mb-4">
          <IconComponent className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        {children}
      </div>
    );
  };

  const renderListItems = (items: string[] | undefined, emptyText = "Não especificado") => {
    if (!items || items.length === 0) return <p className="text-gray-600">{emptyText}</p>;
    return (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-gray-800">{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white text-black font-serif leading-relaxed max-w-4xl mx-auto p-8" style={{ fontFamily: 'Times New Roman, serif', lineHeight: '1.6' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 mb-8 rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Plano de Tratamento Musicoterapêutico</h1>
          <p className="text-blue-100 text-lg">Modelo Profissional Completo</p>
          <div className="mt-4 text-blue-100">
            <p className="text-sm">Data de Emissão: {currentDate}</p>
          </div>
        </div>
      </div>

      {/* 1. Patient Identification */}
      {renderSection("1. Identificação do Paciente", User, (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Nome completo:</p>
            <p className="text-lg text-gray-800">{planData.patient_full_name || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Data de nascimento:</p>
            <p className="text-lg text-gray-800">{planData.patient_birth_date ? new Date(planData.patient_birth_date).toLocaleDateString('pt-BR') : 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Idade:</p>
            <p className="text-lg text-gray-800">{planData.patient_age || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Diagnóstico clínico:</p>
            <p className="text-lg text-gray-800">{planData.clinical_diagnosis || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Responsável:</p>
            <p className="text-lg text-gray-800">{planData.responsible_person || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Data de início do plano:</p>
            <p className="text-lg text-gray-800">{planData.plan_start_date ? new Date(planData.plan_start_date).toLocaleDateString('pt-BR') : 'Não informado'}</p>
          </div>
        </div>
      ), "bg-blue-50")}

      {/* 2. Initial Assessment */}
      {renderSection("2. Avaliação Inicial", FileText, (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Histórico clínico e familiar relevante:</p>
            <p className="text-gray-800 leading-relaxed">{planData.clinical_family_history || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Condições físicas, cognitivas, emocionais e sociais:</p>
            <p className="text-gray-800 leading-relaxed">{planData.physical_cognitive_conditions || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Nível de interação e comunicação:</p>
            <p className="text-gray-800 leading-relaxed">{planData.interaction_communication_level || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Interesses musicais:</p>
            <p className="text-gray-800 leading-relaxed">{planData.musical_interests || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Comportamentos observados durante avaliação inicial:</p>
            <p className="text-gray-800 leading-relaxed">{planData.observed_behaviors || 'Não informado'}</p>
          </div>
        </div>
      ), "bg-green-50")}

      {/* 3. General Objectives */}
      {renderSection("3. Objetivos Gerais", Target, (
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Propósitos amplos da musicoterapia para este paciente:</p>
          {renderListItems(planData.general_objectives, "Nenhum objetivo geral definido")}
        </div>
      ), "bg-purple-50")}

      {/* 4. Specific Objectives */}
      {renderSection("4. Objetivos Específicos", CheckCircle, (
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Objetivos mensuráveis e específicos:</p>
          {renderListItems(planData.specific_objectives, "Nenhum objetivo específico definido")}
        </div>
      ), "bg-yellow-50")}

      {/* 5. Musicotherapy Resources */}
      {renderSection("5. Recursos Musicoterapêuticos", Music, (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">Instrumentos musicais:</p>
            {renderListItems(planData.musical_instruments)}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">Recursos tecnológicos:</p>
            {renderListItems(planData.technological_resources)}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">Voz e corpo:</p>
            {renderListItems(planData.voice_body_resources)}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-2">Materiais complementares:</p>
            {renderListItems(planData.complementary_materials)}
          </div>
        </div>
      ), "bg-orange-50")}

      {/* 6. Strategies and Techniques */}
      {renderSection("6. Estratégias e Técnicas", Activity, (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Improvisação musical:</p>
            <p className="text-gray-800">{planData.musical_improvisation || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Recriação musical:</p>
            <p className="text-gray-800">{planData.musical_recreation || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Composição:</p>
            <p className="text-gray-800">{planData.musical_composition || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Escuta receptiva:</p>
            <p className="text-gray-800">{planData.receptive_listening || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Dinâmicas rítmicas:</p>
            <p className="text-gray-800">{planData.rhythmic_dynamics || 'Não especificado'}</p>
          </div>
        </div>
      ), "bg-pink-50")}

      {/* 7. Frequency and Duration */}
      {renderSection("7. Frequência e Duração", Clock, (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Sessões semanais:</p>
            <p className="text-lg text-gray-800">{planData.weekly_sessions || 0}x por semana</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Duração de cada sessão:</p>
            <p className="text-lg text-gray-800">{planData.session_duration_minutes || 0} minutos</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Período estimado:</p>
            <p className="text-lg text-gray-800">{planData.estimated_period_months || 0} meses</p>
          </div>
        </div>
      ), "bg-indigo-50")}

      {/* 8. Evaluation Criteria */}
      {renderSection("8. Critérios de Avaliação", BarChart, (
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Parâmetros observáveis para medir evolução:</p>
          {renderListItems(planData.evaluation_criteria_list, "Nenhum critério de avaliação definido")}
        </div>
      ), "bg-teal-50")}

      {/* 9. Therapeutic Plan in Action */}
      {renderSection("9. Plano Terapêutico em Ação", Users, (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Estrutura das sessões:</p>
            <p className="text-gray-800">{planData.session_structure || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Sequência das atividades musicais propostas:</p>
            <p className="text-gray-800">{planData.activity_sequence || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Flexibilidade para ajustes:</p>
            <p className="text-gray-800">{planData.flexibility_adjustments || 'Não especificado'}</p>
          </div>
        </div>
      ), "bg-red-50")}

      {/* 10. Re-evaluation and Evolution */}
      {renderSection("10. Reavaliação e Evolução", RefreshCw, (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Frequência da reavaliação:</p>
            <p className="text-gray-800">{planData.reevaluation_frequency || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Registro da evolução em prontuário:</p>
            <p className="text-gray-800">{planData.evolution_recording || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">Ajustes necessários nos objetivos e técnicas:</p>
            <p className="text-gray-800">{planData.necessary_adjustments || 'Não especificado'}</p>
          </div>
        </div>
      ), "bg-gray-50")}

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-8 mt-12">
        <div className="text-center">
          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-800">Musicoterapeuta Responsável</p>
            <p className="text-xl font-bold text-blue-600">{therapistName || 'Não informado'}</p>
          </div>
          
          {/* Signature lines */}
          <div className="flex justify-between items-end mb-8">
            <div className="text-center">
              <div className="border-b-2 border-gray-400 w-64 mb-2"></div>
              <p className="text-sm text-gray-600">Assinatura do Musicoterapeuta</p>
            </div>
            <div className="text-center">
              <div className="border-b-2 border-gray-400 w-64 mb-2"></div>
              <p className="text-sm text-gray-600">Data e Carimbo</p>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>Este documento foi gerado automaticamente pelo Sistema MuseTera</p>
            <p>Data de geração: {currentDate}</p>
            <p className="font-medium">© Sistema MuseTera - Musicoterapia Profissional</p>
          </div>
        </div>
      </div>
    </div>
  );
};