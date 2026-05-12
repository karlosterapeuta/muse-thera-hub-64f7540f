import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  Calendar, 
  User, 
  Heart,
  Brain,
  Music,
  Baby,
  MessageCircle,
  Users,
  Stethoscope,
  Home,
  FileText,
  Activity,
  Palette,
  Volume2,
  Headphones,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { generateProfessionalAnamnesePDF } from "@/utils/anamnesisePDFGenerator";
import { ModernFormCard } from "./ModernFormCard";
import { imageUrlToBase64 } from "@/utils/imageToBase64";
import { calculateAgeFromBirthDate } from "@/utils/dateUtils";

type AnamnesisItem = {
  id: string;
  patient_id: string;
  created_at: string;
  updated_at: string;
  patient_name?: string;
  main_clinical_demand?: string;
};

interface AnamnesisViewProps {
  anamnesis: AnamnesisItem;
  onBack: () => void;
  onEdit: (anamnesisId: string, patientId: string) => void;
}

export function AnamnesisView({ anamnesis, onBack, onEdit }: AnamnesisViewProps) {
  const [anamnesisData, setAnamnesisData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAnamnesisData();
  }, [anamnesis.id]);

  const loadAnamnesisData = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("anamnesis")
        .select("*")
        .eq("id", anamnesis.id)
        .single();

      if (error) {
        console.error("Erro ao carregar dados da anamnese:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da anamnese.",
          variant: "destructive",
        });
        return;
      }

      setAnamnesisData(data);
      
      // Debug logs para verificar os dados da História Sonora e Musical
      console.log("🔍 Dados carregados da anamnese:", data);
      console.log("🎵 História Sonora - pregnancy_sound_experiences:", data.pregnancy_sound_experiences);
      console.log("🎵 História Sonora - mother_movements_songs:", data.mother_movements_songs);
      console.log("🎵 História Sonora - childhood_sound_environment:", data.childhood_sound_environment);
      console.log("🎵 História Sonora - parents_sound_reactions:", data.parents_sound_reactions);
      console.log("🎵 História Sonora - typical_house_sounds:", data.typical_house_sounds);
      console.log("🎵 História Sonora - night_body_sounds:", data.night_body_sounds);
      console.log("🎵 História Sonora - family_musical_history:", data.family_musical_history);
      console.log("🎵 História Sonora - patient_musical_history:", data.patient_musical_history);
    } catch (error) {
      console.error("Erro ao carregar dados da anamnese:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da anamnese.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Get complete professional data from the professionals table
      const { data: { user } } = await supabase.auth.getUser();
      let professionalData = {
        name: 'Profissional',
        email: 'profissional@musetera.app',
        specialty: '',
        phone: '',
        register: '',
        license_number: '',
        association: '',
        stamp_photo_url: '',
        avatar_url: '',
        digital_stamp_url: ''
      };

      if (user) {
        // Try to fetch professional data from the professionals table
        console.log("🔍 [AnamnesisView] Buscando profissional com user_id:", user.id);
        
        const { data: professional, error } = await supabase
          .from('professionals')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log("📊 [AnamnesisView] Query profissional resultado:", {
          profError: error?.message || null,
          professionalData: professional ? {
            id: professional.id,
            name: professional.name,
            stamp_photo_url: professional.stamp_photo_url,
            avatar_url: professional.avatar_url,
            digital_stamp_url: professional.digital_stamp_url,
          } : null
        });

        if (professional && !error) {
          professionalData = {
            name: professional.name || formatNameFromEmail(user.email || ''),
            email: professional.email || user.email || 'profissional@musetera.app',
            specialty: professional.specialty || '',
            phone: professional.phone || '',
            register: professional.register || '',
            license_number: professional.license_number || '',
            association: professional.association || '',
            stamp_photo_url: professional.stamp_photo_url || '',
            avatar_url: professional.avatar_url || '',
            digital_stamp_url: professional.digital_stamp_url || ''
          };
          console.log("✅ [AnamnesisView] Dados do profissional carregados com sucesso");
        } else {
          console.warn("⚠️ [AnamnesisView] Usando fallback para dados do profissional:", error?.message);
          professionalData.name = formatNameFromEmail(user.email || '');
          professionalData.email = user.email || 'profissional@musetera.app';
        }
      }

      // Converter imagens para Base64
      let professionalPhotoBase64: string | null = null;
      let digitalStampBase64: string | null = null;

      console.log("🔍 [AnamnesisView] URLs de imagem antes da conversão:", {
        stamp_photo_url: professionalData.stamp_photo_url,
        avatar_url: professionalData.avatar_url,
        digital_stamp_url: professionalData.digital_stamp_url
      });

      if (professionalData.stamp_photo_url || professionalData.avatar_url) {
        try {
          const photoUrl = professionalData.stamp_photo_url || professionalData.avatar_url;
          console.log("🖼️ [AnamnesisView] Convertendo foto do profissional para Base64...", photoUrl);
          professionalPhotoBase64 = await imageUrlToBase64(photoUrl);
          console.log("✅ [AnamnesisView] Foto convertida:", professionalPhotoBase64 ? "OK" : "FALHOU");
        } catch (e) {
          console.warn("⚠️ [AnamnesisView] Não foi possível converter foto para Base64:", e);
        }
      } else {
        console.log("⚠️ [AnamnesisView] Nenhuma URL de foto encontrada para conversão");
      }

      if (professionalData.digital_stamp_url) {
        try {
          console.log("🖼️ [AnamnesisView] Convertendo carimbo digital para Base64...", professionalData.digital_stamp_url);
          digitalStampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
          console.log("✅ [AnamnesisView] Carimbo convertido:", digitalStampBase64 ? "OK" : "FALHOU");
        } catch (e) {
          console.warn("⚠️ [AnamnesisView] Não foi possível converter carimbo para Base64:", e);
        }
      }

      // Ensure we have the required created_at field and structure the data properly
      const formattedAnamnesisData = {
        ...anamnesisData,
        created_at: anamnesisData.created_at || anamnesis.created_at,
        patient_name: anamnesis.patient_name
      };

      const success = await generateProfessionalAnamnesePDF(
        formattedAnamnesisData,
        professionalData,
        anamnesis.patient_name || 'Paciente',
        professionalPhotoBase64,
        digitalStampBase64
      );

      if (success) {
        toast({
          title: "Sucesso",
          description: "PDF profissional gerado com sucesso!",
        });
      } else {
        throw new Error("Falha na geração do PDF");
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper functions for organized data display
  const calculateAge = () => {
    return calculateAgeFromBirthDate(anamnesisData.birth_date);
  };

  const getCompletionStats = () => {
    const totalBooleanFields = Object.entries(anamnesisData).filter(([key, value]) => 
      typeof value === 'boolean' && !['id', 'patient_id', 'professional_id', 'created_at', 'updated_at'].includes(key)
    ).length;
    
    const checkedFields = Object.entries(anamnesisData).filter(([key, value]) => 
      typeof value === 'boolean' && value === true
    ).length;

    const textFields = [
      'legal_guardian', 'family_relationship', 'referral_professional', 'main_clinical_demand',
      'current_medication', 'school_enrollment', 'school_adaptation', 'extracurricular_activities',
      'pregnancy_sound_experiences', 'mother_movements_songs', 'childhood_sound_environment',
      'parents_sound_reactions', 'typical_house_sounds', 'night_body_sounds',
      'family_musical_history', 'patient_musical_history', 'therapeutic_goals', 'treatment_approach'
    ];
    
    const completedTextFields = textFields.filter(field => 
      anamnesisData[field] && anamnesisData[field].trim() !== ''
    ).length;

    return {
      totalBooleanFields,
      checkedFields,
      totalTextFields: textFields.length,
      completedTextFields,
      overallCompletion: Math.round(((checkedFields + completedTextFields) / (totalBooleanFields + textFields.length)) * 100)
    };
  };

  const renderBooleanSection = (title: string, icon: any, gradient: string, fields: string[], labels: Record<string, string>) => {
    const hasAnyTrue = fields.some(field => anamnesisData[field] === true);
    
    if (!hasAnyTrue) return null;

    return (
      <ModernFormCard title={title} icon={icon} gradient={gradient}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fields.map(field => {
            if (!anamnesisData[field]) return null;
            return (
              <div key={field} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 border border-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-white font-medium">{labels[field] || field.replace(/_/g, ' ')}</span>
              </div>
            );
          })}
        </div>
      </ModernFormCard>
    );
  };

  const renderTextSection = (title: string, icon: any, gradient: string, fields: Array<{key: string, label: string}>) => {
    return (
      <ModernFormCard title={title} icon={icon} gradient={gradient}>
        <div className="space-y-4">
          {fields.map(field => {
            const value = anamnesisData[field.key];
            const isEmpty = !value || value.trim() === '';
            
            return (
              <div key={field.key}>
                <h4 className="font-bold text-sm text-white mb-2">{field.label}</h4>
                <div className={`p-3 rounded-lg border ${isEmpty ? 'bg-gray-800 border-gray-700' : 'bg-gray-800 border-gray-600'}`}>
                  {isEmpty ? (
                    <p className="text-sm text-gray-400 italic">Campo disponível para preenchimento</p>
                  ) : (
                    <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{value}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ModernFormCard>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = getCompletionStats();

  return (
    <div className="space-y-6 bg-gray-950 p-6 rounded-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 border-gray-700 text-white hover:bg-gray-800">
            <ArrowLeft size={16} />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Anamnese Detalhada
            </h1>
            <p className="text-gray-400">Paciente: {anamnesis.patient_name}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onEdit(anamnesis.id, anamnesis.patient_id)}
            className="flex items-center gap-2"
          >
            <Edit size={16} />
            Editar
          </Button>
          <Button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Gerando PDF...
              </>
            ) : (
              <>
                <Download size={16} />
                Baixar PDF Profissional
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Criado em</p>
                <p className="font-semibold text-white">{formatDate(anamnesis.created_at)}</p>
              </div>
              <Calendar className="text-blue-500" size={20} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Atualizado em</p>
                <p className="font-semibold text-white">{formatDate(anamnesis.updated_at)}</p>
              </div>
              <Clock className="text-green-500" size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completude</p>
                <p className="font-semibold text-white">{stats.overallCompletion}%</p>
              </div>
              <Activity className="text-orange-500" size={20} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Aspectos Marcados</p>
                <p className="font-semibold text-white">{stats.checkedFields}</p>
              </div>
              <CheckCircle2 className="text-purple-500" size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Identificação e Encaminhamento */}
      {(anamnesisData.legal_guardian || anamnesisData.family_relationship ||
        anamnesisData.referral_professional || anamnesisData.main_clinical_demand ||
        anamnesisData.diagnosis_details || anamnesisData.cid_code ||
        anamnesisData.clinical_details) && (
        <ModernFormCard title="Identificação e Encaminhamento" icon={User} gradient="from-blue-500 to-cyan-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anamnesisData.legal_guardian && (
              <div>
                <p className="text-sm font-semibold text-gray-400">Responsável Legal</p>
                <p className="font-medium text-white">{anamnesisData.legal_guardian}</p>
              </div>
            )}
            {anamnesisData.family_relationship && (
              <div>
                <p className="text-sm font-semibold text-gray-400">Parentesco</p>
                <p className="font-medium text-white">{anamnesisData.family_relationship}</p>
              </div>
            )}
            {anamnesisData.referral_professional && (
              <div>
                <p className="text-sm font-semibold text-gray-400">Profissional que Encaminhou</p>
                <p className="font-medium text-white">{anamnesisData.referral_professional}</p>
              </div>
            )}
            {anamnesisData.cid_code && (
              <div>
                <p className="text-sm font-semibold text-gray-400">CID-10/11</p>
                <p className="font-medium text-white">{anamnesisData.cid_code}</p>
              </div>
            )}
            {anamnesisData.main_clinical_demand && (
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-400">Demanda Clínica Principal</p>
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 mt-1">
                  <p className="text-white leading-relaxed whitespace-pre-wrap">{anamnesisData.main_clinical_demand}</p>
                </div>
              </div>
            )}
            {anamnesisData.diagnosis_details && (
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-400">Diagnóstico(s) Existente(s)</p>
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 mt-1">
                  <p className="text-white leading-relaxed whitespace-pre-wrap">{anamnesisData.diagnosis_details}</p>
                </div>
              </div>
            )}
            {anamnesisData.clinical_details && (
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-400">Detalhes Clínicos Adicionais</p>
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 mt-1">
                  <p className="text-white leading-relaxed whitespace-pre-wrap">{anamnesisData.clinical_details}</p>
                </div>
              </div>
            )}
          </div>
        </ModernFormCard>
      )}

      {/* Detailed Sound and Musical History */}
      {renderTextSection(
        "História Sonora e Musical Detalhada",
        Headphones,
        "from-purple-500 to-pink-500",
        [
          { key: 'pregnancy_sound_experiences', label: 'Experiências sonoras durante a gravidez' },
          { key: 'mother_movements_songs', label: 'Movimentos da mãe com canções' },
          { key: 'childhood_sound_environment', label: 'Ambiente sonoro na infância' },
          { key: 'parents_sound_reactions', label: 'Reações dos pais aos sons' },
          { key: 'typical_house_sounds', label: 'Sons típicos da casa' },
          { key: 'night_body_sounds', label: 'Sons corporais noturnos' },
          { key: 'family_musical_history', label: 'História musical da família' },
          { key: 'patient_musical_history', label: 'História musical do paciente' }
        ]
      )}

      {/* Other Text Sections */}
      {renderTextSection(
        "Informações Escolares e Sociais",
        Home,
        "from-green-500 to-teal-500",
        [
          { key: 'school_enrollment', label: 'Matrícula escolar' },
          { key: 'school_adaptation', label: 'Adaptação escolar' },
          { key: 'extracurricular_activities', label: 'Atividades extracurriculares' },
          { key: 'family_support_network', label: 'Rede de Apoio Familiar' }
        ]
      )}

      {renderTextSection(
        "Medicação em Uso",
        Stethoscope,
        "from-red-500 to-orange-500",
        [
          { key: 'current_medication', label: 'Medicação Atual' },
          { key: 'medication_schedule', label: 'Horários e Dosagens' },
          { key: 'medication_effects', label: 'Efeitos Observados' }
        ]
      )}

      {renderTextSection(
        "Acompanhamento Terapêutico",
        Heart,
        "from-rose-500 to-pink-500",
        [
          { key: 'therapy_frequency', label: 'Frequência das Terapias' },
          { key: 'therapy_observations', label: 'Observações sobre Evolução' }
        ]
      )}

      {renderTextSection(
        "Detalhes Musicais do Paciente",
        Music,
        "from-violet-500 to-fuchsia-500",
        [
          { key: 'instruments_played', label: 'Instrumento(s) que toca/tocou' },
          { key: 'music_practice_time', label: 'Tempo de Prática Musical' }
        ]
      )}

      {renderTextSection(
        "Objetivos e Abordagem Terapêutica",
        Activity,
        "from-emerald-500 to-teal-500",
        [
          { key: 'therapeutic_goals', label: 'Objetivos terapêuticos' },
          { key: 'treatment_approach', label: 'Abordagem de tratamento' }
        ]
      )}

      {/* Boolean Sections */}
      {renderBooleanSection(
        "Terapias e Suporte",
        Heart,
        "from-pink-500 to-rose-500",
        ['psychological_support', 'psychopedagogical', 'occupational_therapy', 'physiotherapy', 'equine_therapy', 'speech_therapy', 'aba_therapy', 'sensory_integration', 'psychomotricity', 'nutrition', 'music_therapy'],
        {
          psychological_support: 'Apoio psicológico',
          psychopedagogical: 'Psicopedagógico',
          occupational_therapy: 'Terapia ocupacional',
          physiotherapy: 'Fisioterapia',
          equine_therapy: 'Equoterapia',
          speech_therapy: 'Fonoaudiologia',
          aba_therapy: 'Terapia ABA',
          sensory_integration: 'Integração Sensorial',
          psychomotricity: 'Psicomotricidade',
          nutrition: 'Nutrição',
          music_therapy: 'Musicoterapia'
        }
      )}

      {renderBooleanSection(
        "Experiências Musicais",
        Music,
        "from-violet-500 to-purple-500",
        ['musical_education', 'instrumental_practice', 'body_musical_expression', 'vocal_expression', 'choral_activities', 'no_musical_experience'],
        {
          musical_education: 'Educação musical',
          instrumental_practice: 'Prática instrumental',
          body_musical_expression: 'Expressão corporal musical',
          vocal_expression: 'Expressão vocal',
          choral_activities: 'Atividades corais',
          no_musical_experience: 'Sem experiência musical'
        }
      )}

      {renderBooleanSection(
        "Comportamento Musical",
        Volume2,
        "from-indigo-500 to-blue-500",
        ['active_musical_listening', 'body_expression', 'sound_responsiveness', 'spontaneous_vocal', 'instrumental_exploration', 'adverse_sound_reactivity', 'auditory_hypersensitivity', 'positive_musical_response', 'nominal_call_response', 'active_sound_search', 'specific_sound_aversion', 'sound_source_location'],
        {
          active_musical_listening: 'Escuta musical ativa',
          body_expression: 'Expressão corporal',
          sound_responsiveness: 'Responsividade sonora',
          spontaneous_vocal: 'Vocalização espontânea',
          instrumental_exploration: 'Exploração instrumental',
          adverse_sound_reactivity: 'Reatividade sonora adversa',
          auditory_hypersensitivity: 'Hipersensibilidade auditiva',
          positive_musical_response: 'Resposta musical positiva',
          nominal_call_response: 'Resposta ao chamado nominal',
          active_sound_search: 'Busca ativa por sons',
          specific_sound_aversion: 'Aversão a sons específicos',
          sound_source_location: 'Localização da fonte sonora'
        }
      )}

      {renderBooleanSection(
        "Preferências Musicais",
        Palette,
        "from-cyan-500 to-blue-500",
        ['children_repertoire', 'rock_genre', 'sacred_gospel', 'other_musical_genres', 'brazilian_popular', 'country_music', 'classical_music'],
        {
          children_repertoire: 'Repertório infantil',
          rock_genre: 'Rock',
          sacred_gospel: 'Sacro/Gospel',
          other_musical_genres: 'Outros gêneros musicais',
          brazilian_popular: 'MPB',
          country_music: 'Country',
          classical_music: 'Música clássica'
        }
      )}

      {renderBooleanSection(
        "Desenvolvimento Motor",
        Activity,
        "from-emerald-500 to-green-500",
        ['cervical_control', 'crawling_pattern', 'fine_motor_dev', 'independent_sitting', 'autonomous_walking', 'broad_motor_dev'],
        {
          cervical_control: 'Controle cervical',
          crawling_pattern: 'Padrão de engatinhar',
          fine_motor_dev: 'Desenvolvimento motor fino',
          independent_sitting: 'Sentar independente',
          autonomous_walking: 'Marcha autônoma',
          broad_motor_dev: 'Desenvolvimento motor amplo'
        }
      )}

      {renderBooleanSection(
        "Desenvolvimento da Linguagem",
        MessageCircle,
        "from-amber-500 to-yellow-500",
        ['babbling', 'simple_phrases', 'echolalia', 'first_words', 'nonverbal_communication', 'verbal_language_absence'],
        {
          babbling: 'Balbucio',
          simple_phrases: 'Frases simples',
          echolalia: 'Ecolalia',
          first_words: 'Primeiras palavras',
          nonverbal_communication: 'Comunicação não verbal',
          verbal_language_absence: 'Ausência de linguagem verbal'
        }
      )}

      {renderBooleanSection(
        "Aspectos Sociais",
        Users,
        "from-teal-500 to-cyan-500",
        ['visual_contact', 'shared_play', 'stereotyped_behavior', 'peer_interaction', 'social_isolation', 'restricted_interests'],
        {
          visual_contact: 'Contato visual',
          shared_play: 'Brincadeira compartilhada',
          stereotyped_behavior: 'Comportamento estereotipado',
          peer_interaction: 'Interação com pares',
          social_isolation: 'Isolamento social',
          restricted_interests: 'Interesses restritos'
        }
      )}

      {renderBooleanSection(
        "Regulação Emocional",
        Heart,
        "from-pink-500 to-red-500",
        ['heteroaggressive', 'emotional_ability', 'anxiety', 'frequent_crying', 'low_frustration_tolerance', 'irritability'],
        {
          heteroaggressive: 'Heteroagressividade',
          emotional_ability: 'Habilidade emocional',
          anxiety: 'Ansiedade',
          frequent_crying: 'Choro frequente',
          low_frustration_tolerance: 'Baixa tolerância à frustração',
          irritability: 'Irritabilidade'
        }
      )}

      {renderBooleanSection(
        "Transtornos e Condições",
        Brain,
        "from-orange-500 to-red-500",
        ['autism_spectrum', 'down_syndrome', 'intellectual_disability', 'other_diagnoses', 'adhd', 'chronic_encephalopathy', 'anxiety_disorders', 'cerebral_palsy', 'epilepsy', 'williams_syndrome', 'fragile_x_syndrome', 'rett_syndrome', 'alzheimer', 'parkinson', 'depression', 'bipolar_disorder'],
        {
          autism_spectrum: 'Espectro autista',
          down_syndrome: 'Síndrome de Down',
          intellectual_disability: 'Deficiência intelectual',
          other_diagnoses: 'Outros diagnósticos',
          adhd: 'TDAH',
          chronic_encephalopathy: 'Encefalopatia crônica',
          anxiety_disorders: 'Transtornos de ansiedade',
          cerebral_palsy: 'Paralisia Cerebral',
          epilepsy: 'Epilepsia',
          williams_syndrome: 'Síndrome de Williams',
          fragile_x_syndrome: 'Síndrome X Frágil',
          rett_syndrome: 'Síndrome de Rett',
          alzheimer: 'Doença de Alzheimer',
          parkinson: 'Doença de Parkinson',
          depression: 'Depressão',
          bipolar_disorder: 'Transtorno Bipolar'
        }
      )}

      {/* Completion Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resumo da Avaliação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{stats.checkedFields}</p>
              <p className="text-sm text-muted-foreground">Aspectos Avaliados</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.completedTextFields}</p>
              <p className="text-sm text-muted-foreground">Campos Preenchidos</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{stats.overallCompletion}%</p>
              <p className="text-sm text-muted-foreground">Completude Geral</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{anamnesis.patient_id.slice(-8)}</p>
              <p className="text-sm text-muted-foreground">ID do Paciente</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
