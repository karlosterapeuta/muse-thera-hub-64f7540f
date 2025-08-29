import React from 'react';
import { User, Brain, Heart, MessageSquare, Zap, Calendar, FileText, Award } from 'lucide-react';

interface TreatmentPlanPDFProps {
  formData: {
    patient_name: string;
    therapist_name: string;
    age: string;
    diagnosis: string;
    treatment_date: string;
    session_frequency: string;
    treatment_duration: string;
    therapy_goals: string;
    intervention_techniques: string;
    additional_notes: string;
    // TEA Assessment scores
    sensory_hypo: string;
    sensory_hyper: string;
    sensory_seeking: string;
    social_interaction: string;
    social_communication: string;
    social_motivation: string;
    repetitive_motor: string;
    repetitive_verbal: string;
    repetitive_interests: string;
    change_routine: string;
    change_environment: string;
    change_unexpected: string;
  };
}

export const TreatmentPlanPDFContent: React.FC<TreatmentPlanPDFProps> = ({ formData }) => {
  const teaSections = [
    {
      title: "Processamento Sensorial",
      icon: Brain,
      gradient: "from-blue-500 to-purple-600",
      items: [
        { label: "Hiposensibilidade", value: formData.sensory_hypo },
        { label: "Hipersensibilidade", value: formData.sensory_hyper },
        { label: "Busca Sensorial", value: formData.sensory_seeking }
      ]
    },
    {
      title: "Interação Social",
      icon: Heart,
      gradient: "from-purple-500 to-pink-600",
      items: [
        { label: "Interação Social", value: formData.social_interaction },
        { label: "Comunicação Social", value: formData.social_communication },
        { label: "Motivação Social", value: formData.social_motivation }
      ]
    },
    {
      title: "Comportamentos Repetitivos",
      icon: Zap,
      gradient: "from-green-500 to-teal-600",
      items: [
        { label: "Motores", value: formData.repetitive_motor },
        { label: "Verbais", value: formData.repetitive_verbal },
        { label: "Interesses", value: formData.repetitive_interests }
      ]
    },
    {
      title: "Reação a Mudanças",
      icon: MessageSquare,
      gradient: "from-orange-500 to-red-600",
      items: [
        { label: "Rotina", value: formData.change_routine },
        { label: "Ambiente", value: formData.change_environment },
        { label: "Inesperadas", value: formData.change_unexpected }
      ]
    }
  ];

  const getScoreColor = (score: string) => {
    const num = parseInt(score) || 0;
    if (num <= 3) return 'bg-green-100 text-green-800 border-green-200';
    if (num <= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (num <= 8) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getScoreLabel = (score: string) => {
    const num = parseInt(score) || 0;
    if (num <= 3) return 'Leve';
    if (num <= 6) return 'Moderado';
    if (num <= 8) return 'Acentuado';
    return 'Severo';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="bg-white text-black font-serif leading-relaxed" style={{ fontFamily: 'Times New Roman, serif', lineHeight: '1.6' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Plano de Tratamento Musicoterapêutico</h1>
            <p className="text-blue-100 text-lg">Especializado em Transtorno do Espectro Autista (TEA)</p>
          </div>
          <div className="text-right text-blue-100">
            <p className="text-sm">Data de Emissão</p>
            <p className="text-lg font-semibold">{currentDate}</p>
          </div>
        </div>
      </div>

      {/* Patient Information Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
        <div className="flex items-center mb-4">
          <User className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Informações do Paciente</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 uppercase tracking-wide">Nome do Paciente</p>
            <p className="text-xl font-semibold text-gray-800">{formData.patient_name || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 uppercase tracking-wide">Idade</p>
            <p className="text-xl font-semibold text-gray-800">{formData.age || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 uppercase tracking-wide">Diagnóstico</p>
            <p className="text-lg text-gray-800">{formData.diagnosis || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 uppercase tracking-wide">Terapeuta Responsável</p>
            <p className="text-lg text-gray-800">{formData.therapist_name || 'Não informado'}</p>
          </div>
        </div>
      </div>

      {/* Treatment Information */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-500 p-6 mb-8 rounded-r-lg">
        <div className="flex items-center mb-4">
          <Calendar className="h-6 w-6 text-green-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Informações do Tratamento</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 uppercase tracking-wide">Data de Início</p>
            <p className="text-lg font-semibold">{formatDate(formData.treatment_date) || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 uppercase tracking-wide">Frequência</p>
            <p className="text-lg font-semibold">{formData.session_frequency || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 uppercase tracking-wide">Duração</p>
            <p className="text-lg font-semibold">{formData.treatment_duration || 'Não informado'}</p>
          </div>
        </div>
      </div>

      {/* TEA Assessment Results */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Award className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Avaliação TEA - Resultados</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          {teaSections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                <div className={`bg-gradient-to-r ${section.gradient} text-white p-4`}>
                  <div className="flex items-center">
                    <IconComponent className="h-5 w-5 mr-2" />
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(item.value)}`}>
                          {item.value || '0'}/10
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${getScoreColor(item.value)}`}>
                          {getScoreLabel(item.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Treatment Goals */}
      {formData.therapy_goals && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 mb-8 rounded-r-lg">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Objetivos Terapêuticos</h2>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{formData.therapy_goals}</p>
          </div>
        </div>
      )}

      {/* Intervention Techniques */}
      {formData.intervention_techniques && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 mb-8 rounded-r-lg">
          <div className="flex items-center mb-4">
            <Zap className="h-6 w-6 text-yellow-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Técnicas de Intervenção</h2>
          </div>
          <div className="bg-white p-4 rounded-lg border border-yellow-200">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{formData.intervention_techniques}</p>
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {formData.additional_notes && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-l-4 border-gray-500 p-6 mb-8 rounded-r-lg">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-6 w-6 text-gray-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Observações Adicionais</h2>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{formData.additional_notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-6 mt-12">
        <div className="text-center">
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-800">Musicoterapeuta Responsável</p>
            <p className="text-xl font-bold text-blue-600">{formData.therapist_name || 'Não informado'}</p>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Este documento foi gerado automaticamente pelo Sistema MuseTera</p>
            <p>Data de geração: {currentDate}</p>
            <p className="font-medium">© Sistema MuseTera - Musicoterapia Especializada em TEA</p>
          </div>
        </div>
        
        {/* Signature line */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-end">
            <div className="text-center">
              <div className="border-b-2 border-gray-400 w-64 mb-2"></div>
              <p className="text-sm text-gray-600">Assinatura do Musicoterapeuta</p>
            </div>
            <div className="text-center">
              <div className="border-b-2 border-gray-400 w-64 mb-2"></div>
              <p className="text-sm text-gray-600">Data e Carimbo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};