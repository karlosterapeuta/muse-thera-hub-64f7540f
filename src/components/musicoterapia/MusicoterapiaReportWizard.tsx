import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Wand2, Music, Brain, Heart, Target, Home, Check, Sparkles, Info, BookOpen, MessageSquare, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { musicoterapiaTemplate, type ReportData, type ReportField } from '@/data/musicoterapiaTemplate';
import { MusicoterapiaFormField } from './MusicoterapiaFormField';
import { MusicoterapiaQuickFill } from './MusicoterapiaQuickFill';
import { FinalReviewSection } from './FinalReviewSection';
import { BasicInformationSection } from './BasicInformationSection';
import { MusicoterapiaGuidance } from './MusicoterapiaGuidance';

interface MusicoterapiaReportWizardProps {
  reportData: Partial<ReportData>;
  onUpdateData: (data: Partial<ReportData>) => void;
  onGenerateWithAI: (keyPoints: string) => Promise<any>;
  isGeneratingWithAI: boolean;
  patients: any[];
  onSaveReport: () => void;
  isSaving: boolean;
  professionalData?: any;
}

const STEPS = [
  {
    id: 'basic_info',
    title: '1. Identificação do Paciente',
    description: 'Dados do paciente e do profissional',
    icon: Target,
    fields: ['patient_name', 'patient_age', 'patient_diagnosis', 'cid_code', 'support_level', 'comorbidities', 'current_medications', 'treatment_start_date', 'session_count', 'session_frequency', 'session_duration', 'professional_name', 'professional_registry', 'session_date']
  },
  {
    id: 'referral',
    title: '2. Motivo do Encaminhamento',
    description: 'Origem e justificativa do encaminhamento',
    icon: ClipboardList,
    fields: ['referral_source', 'referral_reason']
  },
  {
    id: 'therapeutic_objectives',
    title: '3. Objetivos Terapêuticos',
    description: 'Metas e planejamento',
    icon: Target,
    fields: ['therapeutic_objectives', 'specific_goals']
  },
  {
    id: 'methodology',
    title: '4. Metodologia Musicoterapêutica',
    description: 'Abordagem, técnicas e procedimentos',
    icon: Music,
    fields: ['theoretical_framework', 'assessment_tools_used', 'session_setting', 'session_structure', 'session_activities', 'improvisation_use', 'receptive_techniques', 'recreative_techniques', 'compositional_techniques', 'tempo_dynamics_used', 'vocal_work']
  },
  {
    id: 'clinical_evolution',
    title: '5. Evolução Clínica',
    description: 'Progressos por domínios do desenvolvimento',
    icon: Heart,
    fields: ['domain_communication_verbal', 'domain_communication_nonverbal', 'domain_social_interaction', 'joint_attention', 'eye_contact_quality', 'domain_emotional', 'self_regulation_strategies', 'domain_sensory_integration', 'domain_cognitive', 'domain_motor_gross', 'domain_motor_fine', 'domain_musicality', 'vocalizations_observed', 'verbal_output_during_music', 'echolalia_musical', 'aac_use', 'pragmatic_skills', 'patient_evolution', 'evolution_compared_baseline']
  },
  {
    id: 'observed_results',
    title: '6. Resultados Observados',
    description: 'Metas atingidas e indicadores',
    icon: Brain,
    fields: ['goals_achieved', 'goals_in_progress', 'quantitative_indicators', 'treatment_summary']
  },
  {
    id: 'pending_intervention',
    title: '7. Aspectos a Intervir',
    description: 'Pontos que ainda necessitam de intervenção',
    icon: Target,
    fields: ['goals_not_achieved', 'red_flags_to_monitor']
  },
  {
    id: 'prognosis',
    title: '8. Prognóstico Terapêutico',
    description: 'Objetivos futuros e prognóstico',
    icon: Target,
    fields: ['next_objectives_short', 'next_objectives_medium', 'next_objectives_long', 'proposed_interventions', 'expected_outcomes', 'revaluation_date']
  },
  {
    id: 'recommendations',
    title: '9. Recomendações',
    description: 'Família, escola e equipe',
    icon: Home,
    fields: ['recommendations', 'home_activities', 'family_guidance', 'school_recommendations', 'interdisciplinary_team_notes', 'playlist_recommended']
  },
  {
    id: 'final_considerations',
    title: '10. Considerações Finais',
    description: 'Síntese conclusiva',
    icon: Sparkles,
    fields: ['final_considerations', 'conclusion', 'complementary_observations', 'additional_notes']
  },
  {
    id: 'final_review',
    title: '11. Assinatura',
    description: 'Assinatura e finalização',
    icon: Check,
    fields: ['signature', 'review_notes']
  }
];

const STEP_HINTS: Record<string, { icon: React.ElementType; title: string; description: string }> = {
  basic_info: { icon: Info, title: 'Identificação do paciente', description: 'Confirme dados do paciente e do profissional. Esses dados aparecem no cabeçalho do relatório final.' },
  referral: { icon: ClipboardList, title: 'Motivo do encaminhamento', description: 'Descreva quem encaminhou e a razão clínica que originou o início dos atendimentos.' },
  therapeutic_objectives: { icon: Target, title: 'Objetivos terapêuticos', description: 'Descreva metas claras, mensuráveis e individualizadas. Quanto mais específicas, mais sólido o relatório.' },
  methodology: { icon: Music, title: 'Metodologia musicoterapêutica', description: 'Detalhe a abordagem teórica, técnicas (receptivas, recriativas, improvisacionais, compositivas) e procedimentos utilizados.' },
  clinical_evolution: { icon: Heart, title: 'Evolução clínica', description: 'Registre os progressos por domínio: comunicação, interação social, regulação emocional, cognição, motricidade e respostas musicais.' },
  observed_results: { icon: Brain, title: 'Resultados observados', description: 'Sintetize as metas atingidas e os indicadores objetivos de progresso no período avaliado.' },
  pending_intervention: { icon: Target, title: 'Aspectos a intervir', description: 'Liste os pontos que ainda necessitam de intervenção e os sinais a monitorar.' },
  prognosis: { icon: Target, title: 'Prognóstico terapêutico', description: 'Estruture objetivos de curto, médio e longo prazo, com prognóstico e data de reavaliação.' },
  recommendations: { icon: Home, title: 'Recomendações', description: 'Oriente família, escola e equipe interdisciplinar com recomendações práticas.' },
  final_considerations: { icon: Sparkles, title: 'Considerações finais', description: 'Sintetize a evolução global e a indicação de continuidade do acompanhamento.' },
  final_review: { icon: Check, title: 'Assinatura', description: 'Revise o relatório, organize com IA se desejar, assine e finalize.' },
};


interface TemplateOption {
  id: string;
  label: string;
  description: string;
  values: Record<string, string | string[]>;
}

const STEP_TEMPLATES: Record<string, TemplateOption[]> = {
  methodology: [
    {
      id: 'methodology_benenzon',
      label: 'Modelo Benenzon (ISO)',
      description: 'Abordagem centrada no Princípio do ISO, com técnicas receptivas e improvisacionais.',
      values: {
        theoretical_framework: 'A intervenção fundamenta-se no Modelo Benenzon de Musicoterapia, com ênfase no Princípio do ISO (Identidade Sonora) — gestacional, universal, cultural, complementar e grupal —, articulado às diretrizes de intervenção em TEA conforme DSM-5-TR e CID-11.',
        assessment_tools_used: 'Instrumentos: observação clínica sistematizada, mapeamento do ISO do paciente, registro de respostas sonoro-musicais e Escala MuseTera de avaliação musicoterapêutica.',
        session_setting: 'Individual',
        session_structure: 'Sessões com estrutura previsível: ritual de abertura sonoro-musical, desenvolvimento (exploração e improvisação) e ritual de encerramento, com duração média de 40 a 50 minutos.',
        session_activities: ['Atividades de exploração instrumental livre, diálogos sonoros, improvisações vinculares e uso de objetos intermediários, respeitando o ISO do paciente.'],
        improvisation_use: 'A improvisação clínica foi utilizada como principal recurso de vínculo e comunicação não-verbal, partindo do ISO do paciente para construção de diálogos sonoros.',
        receptive_techniques: 'Técnicas receptivas: audição de canções e trechos musicais pertencentes ao ISO do paciente, favorecendo regulação e disponibilidade interna.',
        recreative_techniques: 'Técnicas recriativas: recriação de canções familiares e padrões rítmicos, favorecendo participação ativa e troca de turnos.',
        compositional_techniques: 'Recursos compositivos pontuais, com criação conjunta de pequenos motivos sonoros como forma de expressão e pertencimento.',
        tempo_dynamics_used: 'Variações de andamento e dinâmica foram utilizadas para regular estados de ativação, alternando momentos de organização e de expansão.',
        vocal_work: 'Trabalho vocal por meio de vocalizações, cantos e modulações de voz, favorecendo a comunicação e a expressão emocional.'
      }
    },
    {
      id: 'methodology_nordoff_robbins',
      label: 'Nordoff-Robbins (Criativa)',
      description: 'Improvisação clínica e desenvolvimento do "Music Child".',
      values: {
        theoretical_framework: 'A intervenção fundamenta-se na Musicoterapia Criativa de Nordoff-Robbins, que enfatiza a improvisação clínica e o desenvolvimento do "Music Child", articulada às diretrizes de intervenção em TEA conforme DSM-5-TR e CID-11.',
        assessment_tools_used: 'Instrumentos: escalas Nordoff-Robbins (Child-Therapist Relationship e Musical Communicativeness), observação clínica e registro audiovisual de sessões.',
        session_setting: 'Setting individual com piano/teclado e instrumental de percussão acessível, organizado para favorecer a iniciativa musical do paciente.',
        session_structure: 'Sessões estruturadas em torno da improvisação clínica responsiva, com abertura, desenvolvimento musical co-criativo e encerramento.',
        session_activities: 'Improvisações instrumentais e vocais responsivas, canções terapêuticas compostas para o paciente e atividades de turno musical.',
        improvisation_use: 'A improvisação clínica foi o eixo central das sessões, com o terapeuta acompanhando e ampliando musicalmente as iniciativas do paciente.',
        receptive_techniques: 'Momentos receptivos pontuais para regulação e escuta de motivos musicais significativos.',
        recreative_techniques: 'Recriação de canções terapêuticas e padrões musicais, estimulando engajamento e antecipação.',
        compositional_techniques: 'Composição de canções terapêuticas personalizadas, integrando nome, interesses e respostas do paciente.',
        tempo_dynamics_used: 'Uso intencional de andamento, intensidade e contraste musical para sustentar a atenção e modular respostas emocionais.',
        vocal_work: 'Trabalho vocal por meio do canto terapêutico e de vocalizações responsivas, favorecendo a comunicação musical.'
      }
    },
    {
      id: 'methodology_nmt',
      label: 'Musicoterapia Neurológica (NMT)',
      description: 'Técnicas padronizadas de Thaut (RAS, TIMP, MACT...) com base em neurociência.',
      values: {
        theoretical_framework: 'A intervenção fundamenta-se no modelo de Musicoterapia Neurológica (NMT) de Michael Thaut, baseado na neurociência da música e na plasticidade cerebral, utilizando técnicas padronizadas para reabilitação sensório-motora, cognitiva e de linguagem em TEA, em consonância com DSM-5-TR e CID-11.',
        assessment_tools_used: 'Instrumentos: protocolos NMT padronizados, avaliação de sincronização rítmica, testes de atenção e função executiva e registro neurocomportamental sistematizado.',
        session_setting: 'Setting estruturado com instrumental rítmico e melódico, metrônomo e recursos para estimulação sensório-motora controlada.',
        session_structure: 'Sessões organizadas por objetivos neurofuncionais, com aquecimento, aplicação de técnicas NMT específicas e fechamento, com registro de respostas.',
        session_activities: 'Atividades de sincronização rítmica, marcha sonora, exercícios motores instrumentais e tarefas de atenção e memória musical.',
        improvisation_use: 'A improvisação foi utilizada de forma estruturada, como recurso complementar às técnicas padronizadas.',
        receptive_techniques: 'Estimulação auditiva rítmica (RAS) e padrões sonoros para regulação e organização sensório-motora.',
        recreative_techniques: 'Execução musical instrumental terapêutica (TIMP) para treino motor e coordenação.',
        compositional_techniques: 'Uso pontual de criação de sequências musicais para treino de memória e função executiva (MACT/MMT).',
        tempo_dynamics_used: 'Andamento e pulsação controlados por metrônomo e variações dinâmicas para favorecer sincronização e regulação.',
        vocal_work: 'Técnicas vocais como entonação melódica (MIT) e estimulação musical da fala, conforme objetivos de linguagem.'
      }
    },
    {
      id: 'methodology_integrative',
      label: 'Abordagem integrativa',
      description: 'Combinação de Benenzon, Bruscia, Nordoff-Robbins e recursos sensoriais.',
      values: {
        theoretical_framework: 'A prática fundamenta-se em abordagem integrativa: Modelo Benenzon (Princípio do ISO), modelo de Bruscia (níveis e métodos — receptivo, recriativo, improvisacional e compositivo) e Musicoterapia Criativa de Nordoff-Robbins, associados às diretrizes de intervenção em TEA conforme DSM-5-TR e CID-11.',
        assessment_tools_used: 'Instrumentos: Escala MuseTera, IMTAP, mapeamento do ISO, observação clínica sistematizada e registro qualitativo por método.',
        session_setting: 'Setting individual em ambiente acústico controlado, com instrumental diversificado e adaptações sensoriais individualizadas.',
        session_structure: 'Sessões com estrutura previsível e flexível, contemplando abertura, desenvolvimento (com diferentes métodos) e encerramento.',
        session_activities: 'Atividades receptivas, recriativas, improvisacionais e compositivas, ajustadas ao perfil e ao momento clínico do paciente.',
        improvisation_use: 'A improvisação foi utilizada como recurso central de vínculo e comunicação, integrada às demais técnicas.',
        receptive_techniques: 'Audição musical seletiva, relaxamento sonoro e escuta de repertório significativo para regulação.',
        recreative_techniques: 'Recriação de canções e padrões rítmicos, favorecendo participação, antecipação e troca de turnos.',
        compositional_techniques: 'Criação conjunta de canções e motivos musicais como forma de expressão e pertencimento.',
        tempo_dynamics_used: 'Variações de andamento e dinâmica utilizadas intencionalmente para regular ativação e sustentar a atenção.',
        vocal_work: 'Trabalho vocal por meio de cantos, vocalizações e modulações, favorecendo comunicação e expressão emocional.'
      }
    }
  ],
  communication_language: [
    {
      id: 'verbal_emerging',
      label: 'Comunicação verbal emergente',
      description: 'Paciente com vocalizações e produção verbal em desenvolvimento.',
      values: {
        vocalizations_observed: 'Paciente apresenta vocalizações espontâneas durante atividades musicais, com variação de altura e intensidade, especialmente em resposta a estímulos melódicos preferidos.',
        verbal_output_during_music: 'Observa-se aumento da produção verbal durante o canto e atividades rítmicas, com tentativas de acompanhar trechos de canções familiares.',
        echolalia_musical: 'Ecolalia musical ocasional, com repetição de palavras-chave de canções logo após o terapeuta.',
        aac_use: 'Não utiliza CAA no momento. Comunicação predominantemente verbal e gestual.',
        pragmatic_skills: 'Habilidades pragmáticas em desenvolvimento, com iniciativa comunicativa crescente em contexto musical estruturado e troca de turnos com apoio do terapeuta.'
      }
    },
    {
      id: 'nonverbal_caa',
      label: 'Não-verbal com CAA',
      description: 'Paciente não-verbal que utiliza Comunicação Aumentativa e Alternativa.',
      values: {
        vocalizations_observed: 'Paciente apresenta vocalizações pré-linguísticas (sons vocálicos prolongados, balbucios) durante atividades musicais, em especial diante de estímulos rítmicos preferidos.',
        verbal_output_during_music: 'Sem produção verbal significativa. Comunicação ocorre por meio de gestos, expressões faciais e uso do sistema de CAA.',
        echolalia_musical: 'Ausência de ecolalia verbal; observa-se imitação rítmica e melódica corporal.',
        aac_use: 'Utiliza sistema de Comunicação Aumentativa e Alternativa (pranchas de PCS / aplicativo de CAA) durante a sessão para indicar instrumentos, músicas e estados emocionais.',
        pragmatic_skills: 'Pragmática emergente com apoio de CAA: realiza pedidos, escolhas e protestos por meio dos recursos comunicativos disponíveis durante atividades musicais.'
      }
    },
    {
      id: 'echolalic_functional',
      label: 'Ecolalia funcional',
      description: 'Paciente com ecolalia musical como recurso comunicativo principal.',
      values: {
        vocalizations_observed: 'Vocalizações ricas, com variação prosódica vinculadas a fragmentos melódicos de canções conhecidas.',
        verbal_output_during_music: 'Produção verbal predominantemente vinculada a trechos de canções, jingles e falas de mídia, utilizados de forma contextual.',
        echolalia_musical: 'Ecolalia musical funcional acentuada, com uso de refrões e fragmentos de canções como forma de comunicação, autorregulação e solicitação.',
        aac_use: 'Não utiliza CAA formal; a própria ecolalia musical funciona como recurso comunicativo.',
        pragmatic_skills: 'Pragmática mediada por ecolalia: o paciente utiliza trechos musicais para pedir, comentar e expressar afeto, com gradual ampliação do uso espontâneo e funcional.'
      }
    },
    {
      id: 'minimally_verbal',
      label: 'Minimamente verbal',
      description: 'Paciente com vocabulário restrito e produção verbal limitada.',
      values: {
        vocalizations_observed: 'Vocalizações pontuais com predomínio de vogais abertas e consoantes plosivas, intensificadas em momentos de prazer musical, especialmente diante de instrumentos de percussão e canções com refrões repetitivos.',
        verbal_output_during_music: 'Produção verbal limitada a palavras isoladas (5 a 15 palavras funcionais), com aumento notável de tentativas vocais durante atividades de canto compartilhado e preenchimento de lacunas melódicas (fill-in).',
        echolalia_musical: 'Ecolalia musical imediata observada em refrões repetitivos, funcionando como ponte para ampliação do repertório verbal funcional.',
        aac_use: 'Uso emergente de CAA de baixa tecnologia (pranchas temáticas) como suporte à comunicação durante a sessão, especialmente para escolha de canções e instrumentos.',
        pragmatic_skills: 'Pragmática em construção: realiza pedidos simples por meio de gestos, vocalizações e apontar, com aumento da intenção comunicativa em contexto musical estruturado e previsível.'
      }
    },
    {
      id: 'verbal_fluent_pragmatic',
      label: 'Verbal fluente com dificuldades pragmáticas',
      description: 'Paciente com fala fluente, mas alterações pragmáticas e prosódicas.',
      values: {
        vocalizations_observed: 'Vocalizações ricas e variadas, com boa modulação tonal durante o canto, embora apresente prosódia atípica na fala espontânea (entonação monocórdica ou exagerada).',
        verbal_output_during_music: 'Produção verbal fluente e gramaticalmente adequada, com vocabulário expandido. Canta canções completas com letra preservada e demonstra interesse por temas musicais específicos.',
        echolalia_musical: 'Ecolalia musical diferida presente, com reprodução de trechos de canções e jingles em contextos não relacionados, frequentemente com função autorregulatória.',
        aac_use: 'Não utiliza CAA; comunicação predominantemente oral.',
        pragmatic_skills: 'Dificuldades pragmáticas evidentes: alterações em troca de turnos, manutenção de tópico e leitura de pistas sociais. O contexto musical favorece a regulação destes aspectos por meio de regras claras de turno (pergunta-resposta musical, diálogos instrumentais).'
      }
    },
    {
      id: 'gestural_preverbal',
      label: 'Comunicação gestual e pré-verbal',
      description: 'Paciente em fase pré-linguística com comunicação predominantemente gestual.',
      values: {
        vocalizations_observed: 'Balbucio canônico e vocalizações pré-linguísticas com variação de altura e duração, intensificadas em momentos de afinamento afetivo durante o canto da terapeuta.',
        verbal_output_during_music: 'Ausência de produção verbal convencional. Comunicação ocorre por meio de vocalizações, gestos protodeclarativos e protoimperativos, expressões faciais e movimentos corporais sincrônicos à música.',
        echolalia_musical: 'Sem ecolalia verbal. Observa-se imitação rítmica corporal e tentativas de imitação melódica vocal.',
        aac_use: 'Não utiliza CAA formal. Início de exploração de objetos de referência sonoros como suporte à antecipação de atividades.',
        pragmatic_skills: 'Pragmática emergente em nível pré-verbal: atenção compartilhada em construção, contato ocular sustentado durante o canto e iniciativa de aproximação física para solicitar continuidade da música.'
      }
    },
    {
      id: 'bilingual_context',
      label: 'Contexto bilíngue / multicultural',
      description: 'Paciente exposto a mais de um idioma no contexto familiar.',
      values: {
        vocalizations_observed: 'Vocalizações com variação fonológica influenciada pelos dois idiomas de exposição, com produção sonora ampla durante atividades musicais em ambas as línguas.',
        verbal_output_during_music: 'Produção verbal mista, com alternância entre os idiomas (code-switching) durante o canto. Demonstra preferência por canções no idioma materno, com maior engajamento e produção.',
        echolalia_musical: 'Ecolalia musical funcional em ambos os idiomas, com reprodução de fragmentos de canções familiares como recurso comunicativo e regulatório.',
        aac_use: 'CAA não utilizada. Considera-se a possibilidade de prancha bilíngue caso seja indicada futuramente.',
        pragmatic_skills: 'Pragmática adequada à idade desenvolvimental, com adaptações para o contexto bilíngue. O uso de canções nos dois idiomas favorece a integração identitária e comunicativa.'
      }
    },
    {
      id: 'selective_mutism_music',
      label: 'Mutismo seletivo com expressão musical',
      description: 'Paciente que se comunica preferencialmente por meio musical.',
      values: {
        vocalizations_observed: 'Vocalizações presentes exclusivamente em contexto musical seguro, com qualidade sonora preservada durante o canto e ausentes ou raras em contexto verbal direto.',
        verbal_output_during_music: 'Produção verbal significativamente maior durante atividades musicais do que em contextos comunicativos convencionais. O canto funciona como ponte para a expressão verbal.',
        echolalia_musical: 'Ecolalia musical observada como estratégia segura de expressão, frequentemente utilizando trechos de canções para comunicar estados internos.',
        aac_use: 'Não utiliza CAA. O recurso musical funciona como mediador comunicativo principal.',
        pragmatic_skills: 'Pragmática preservada em contexto musical estruturado, com trocas comunicativas via instrumento e canto. Em contexto verbal direto, observa-se inibição comunicativa significativa.'
      }
    },
    {
      id: 'regression_recovery',
      label: 'Pós-regressão / em recuperação',
      description: 'Paciente em processo de recuperação de habilidades comunicativas.',
      values: {
        vocalizations_observed: 'Vocalizações em processo de reorganização, com retomada gradual de variação prosódica e melódica observada inicialmente em contexto musical.',
        verbal_output_during_music: 'Produção verbal em fase de reconstrução: o contexto musical favorece a retomada de palavras e expressões previamente adquiridas, com canções funcionando como âncoras mnemônicas.',
        echolalia_musical: 'Ecolalia musical funcional intensa, atuando como mecanismo de reapropriação da linguagem e da expressão emocional.',
        aac_use: 'Avaliação contínua sobre a necessidade de introdução de CAA como suporte temporário ou permanente, conforme evolução do quadro.',
        pragmatic_skills: 'Habilidades pragmáticas em recuperação progressiva, com retomada gradual de iniciativa comunicativa, atenção compartilhada e troca de turnos, mediadas pela segurança do setting musical.'
      }
    }
  ],
  future_plan: [
    {
      id: 'initial_stage',
      label: 'Início de tratamento',
      description: 'Foco em vínculo, exploração sonora e regulação básica.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Estabelecer vínculo terapêutico; favorecer exploração livre de instrumentos; ampliar tempo de permanência no setting.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Desenvolver atenção compartilhada em atividades musicais simples; introduzir rotinas sonoras previsíveis.',
        next_objectives_long: 'Longo prazo (6-12 meses): Consolidar repertório de canções funcionais e iniciar trocas musicais recíprocas com o terapeuta.',
        proposed_interventions: 'Intervenções predominantemente receptivas e exploratórias, com base no ISO de Benenzon e adaptações sensoriais individualizadas.',
        expected_outcomes: 'Espera-se maior tolerância ao setting, ampliação do repertório sonoro aceito e início de respostas comunicativas musicais.',
        revaluation_date: 'Reavaliação prevista em 3 meses, com observação clínica sistemática e registro qualitativo.'
      }
    },
    {
      id: 'consolidation',
      label: 'Fase de consolidação',
      description: 'Ampliação de habilidades e generalização para outros contextos.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Ampliar repertório de canções funcionais; consolidar troca de turnos musicais; aumentar tempo de atenção compartilhada.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Desenvolver autorregulação por meio de improvisações estruturadas; estimular comunicação intencional via instrumentos.',
        next_objectives_long: 'Longo prazo (6-12 meses): Promover generalização das habilidades musicais para contextos familiar e escolar.',
        proposed_interventions: 'Intervenções receptivas, recriativas e improvisacionais conforme modelo de Bruscia, com foco em ISO de Benenzon e adaptações sensoriais.',
        expected_outcomes: 'Espera-se evolução nas dimensões comunicativa, socioemocional e sensório-motora, com generalização para contextos familiar e escolar.',
        revaluation_date: 'Reavaliação prevista em 3 meses, com aplicação de escalas IMTAP e registro qualitativo.'
      }
    },
    {
      id: 'advanced',
      label: 'Fase avançada / preparação para alta',
      description: 'Autonomia musical e preparação para alta terapêutica.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Estimular autonomia na escolha de atividades musicais; consolidar autorregulação via música.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Promover participação em atividades musicais grupais; transferir estratégias para o cotidiano.',
        next_objectives_long: 'Longo prazo (6-12 meses): Preparar alta terapêutica gradual com orientações de continuidade musical em ambiente familiar e/ou escolar.',
        proposed_interventions: 'Intervenções improvisacionais e compositivas centradas na autonomia do paciente, com orientação familiar e interdisciplinar para sustentação dos ganhos.',
        expected_outcomes: 'Espera-se que o paciente utilize a música como recurso autorregulatório e comunicativo de forma autônoma e generalizada.',
        revaluation_date: 'Reavaliação prevista em 3 meses, com discussão de plano de alta junto à equipe interdisciplinar e família.'
      }
    },
    {
      id: 'crisis_reorganization',
      label: 'Fase de crise / reorganização',
      description: 'Paciente em momento de desorganização clínica, com foco em contência e regulação.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Restabelecer vínculo terapêutico após período de crise; favorecer estados de calma através de musicoterapia receptiva e ambientes sonoros previsíveis.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Reintroduzir gradualmente atividades musicais ativas conforme tolerância; consolidar rotina terapêutica estável.',
        next_objectives_long: 'Longo prazo (6-12 meses): Retomar progressão terapêutica interrompida, com reavaliação de objetivos e adaptações de acordo com nova configuração clínica.',
        proposed_interventions: 'Musicoterapia predominantemente receptiva (ambientação sonora, vibroacústica, musicoterapia de relaxamento), com estruturação altamente previsível e transições suaves. Abordagem de contência emocional conforme modelo de Bruscia.',
        expected_outcomes: 'Espera-se redução da agitação e melhora na regulação emocional, com retomada gradual do engajamento terapêutico.',
        revaluation_date: 'Reavaliação prevista em 1 a 2 meses, dada a instabilidade clínica atual, com registros detalhados de respostas emocionais.'
      }
    },
    {
      id: 'sensory_focus',
      label: 'Foco sensorial intensivo',
      description: 'Paciente com necessidade de trabalho sensorial-motor priorizado.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Ampliar repertório de estímulos sonoro-musicais tolerados; reduzir respostas de defesa auditiva através de abordagem gradativa.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Consolidar integração sensorial em atividades musicais; favorecer coordenação motora e esquema corporal via ritmo e movimento.',
        next_objectives_long: 'Longo prazo (6-12 meses): Promover uso funcional da experiência musical como estratégia de modulação sensorial e organização corporal em contextos variados.',
        proposed_interventions: 'Intervenções com foco em integração sensorial musical (modelo de Dunn adaptado), musicoterapia de vibroacústica, instrumentos de texturas variadas e atividades de movimento-rítmo estruturadas.',
        expected_outcomes: 'Espera-se aumento da tolerância a estímulos sonoros, melhora na coordenação motora e maior organização comportamental.',
        revaluation_date: 'Reavaliação prevista em 3 meses, com acompanhamento do Perfil Sensorial e registro de respostas a estímulos sonoros.'
      }
    },
    {
      id: 'communication_focus',
      label: 'Foco comunicativo intensivo',
      description: 'Prioridade para desenvolvimento de habilidades comunicativas via música.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Ampliar iniciativa comunicativa em contextos musicais; favorecer troca de turnos sonoros e preenchimento de lacunas melódicas.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Desenvolver ecolalia musical funcional para expressão de estados e pedidos; consolidar uso de CAA em atividades musicais.',
        next_objectives_long: 'Longo prazo (6-12 meses): Promover generalização de habilidades comunicativas musicais para interações verbais e não-verbais em contextos extra-terapêuticos.',
        proposed_interventions: 'Intervenções recriativas e improvisacionais com foco em diálogos instrumentais, técnicas de preenchimento de lacunas (fill-in), canções de scripts e integração com CAA musicalizada.',
        expected_outcomes: 'Espera-se aumento da produção vocal e gestual intencional, maior troca de turnos e início de generalização comunicativa.',
        revaluation_date: 'Reavaliação prevista em 3 meses, com registro audiovisual e análise de trocas comunicativas musicais.'
      }
    },
    {
      id: 'school_integration',
      label: 'Integração escolar',
      description: 'Preparação para transição e inclusão em ambiente escolar.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Desenvolver repertório de canções e ritmos que possam ser utilizados no contexto escolar; iniciar contato com grupo musical reduzido.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Promover habilidades de turno, espera e compartilhamento em atividades musicais grupais; preparar adaptações sensoriais para ambiente escolar.',
        next_objectives_long: 'Longo prazo (6-12 meses): Articular musicoterapia com planejamento escolar individualizado; transferir estratégias musicais para professores e equipe pedagógica.',
        proposed_interventions: 'Atividades musicais grupais estruturadas, canções de rotina escolar, instrumentos de fácil acesso e orientação pedagógica para uso de música em transições e regulação em sala de aula.',
        expected_outcomes: 'Espera-se maior adaptação ao ambiente escolar, redução de comportamentos desafiadores em transições e uso de recursos musicais pelo corpo docente.',
        revaluation_date: 'Reavaliação prevista em 3 meses, com reunião interdisciplinar envolvendo escola e família.'
      }
    },
    {
      id: 'family_crisis',
      label: 'Crise familiar / contexto de vulnerabilidade',
      description: 'Suporte à família em situação de vulnerabilidade socioeconômica ou crises.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Estabelecer ambiente terapêutico seguro e previsível; favorecer regulação emocional do paciente em contexto de instabilidade familiar.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Fortalecer vínculo familiar através de atividades musicais compartilhadas; orientar cuidadores sobre uso de música no cotidiano com recursos acessíveis.',
        next_objectives_long: 'Longo prazo (6-12 meses): Promover resiliência familiar e autonomia do paciente, articulando com rede de apoio social e serviços de atenção básica.',
        proposed_interventions: 'Musicoterapia receptiva e recriativa com materiais de baixo custo, orientação familiar sobre canções e ritmos do cotidiano, e articulação com assistência social.',
        expected_outcomes: 'Espera-se redução do estresse familiar, fortalecimento do vínculo afetivo e continuidade do tratamento apesar das adversidades.',
        revaluation_date: 'Reavaliação prevista em 2 meses, com acompanhamento do contexto familiar e articulação com serviços de apoio.'
      }
    },
    {
      id: 'transition_adolescence',
      label: 'Transição para adolescência',
      description: 'Paciente em processo de mudanças desenvolvimentais e identitárias.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Explorar repertório musical alinhado à faixa etária; favorecer expressão de identidade e preferências pessoais do adolescente.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Desenvolver atividades musicais de composição e improvisação como ferramentas de expressão emocional e construção identitária.',
        next_objectives_long: 'Longo prazo (6-12 meses): Promover autonomia musical e inserção em grupos ou atividades musicais comunitárias, favorecendo pertencimento social.',
        proposed_interventions: 'Intervenções compositivas e improvisacionais centradas no adolescente, com respeito às escolhas musicais e uso de tecnologia (apps, gravação, playlists).',
        expected_outcomes: 'Espera-se maior expressão de identidade, redução de isolamento social e desenvolvimento de interesses musicais autônomos.',
        revaluation_date: 'Reavaliação prevista em 3 meses, com participação ativa do adolescente na definição de objetivos.'
      }
    },
    {
      id: 'post_regression',
      label: 'Pós-regressão / recuperação de habilidades',
      description: 'Paciente em processo de reorganização após perda de habilidades.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Mapear repertório musical preservado; reestabelecer vínculo terapêutico e rotina de sessões com estruturação altamente previsível.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Reconstruir progressivamente habilidades musicais e comunicativas prévias, utilizando canções e atividades já consolidadas como âncoras.',
        next_objectives_long: 'Longo prazo (6-12 meses): Consolidar ganhos recuperados e ampliar repertório, com monitoramento contínuo de sinais de alerta e articulação com equipe médica.',
        proposed_interventions: 'Musicoterapia receptiva e recriativa com ênfase em repertório familiar, estruturação altamente previsível, musicoterapia de vibroacústica e atividades de contência emocional.',
        expected_outcomes: 'Espera-se recuperação gradual de habilidades prévias, maior organização emocional e estabilidade clínica.',
        revaluation_date: 'Reavaliação prevista em 2 meses, dada a necessidade de monitoramento frequente do quadro.'
      }
    }
  ],
  theoretical_foundation: [
    {
      id: 'benenzon_iso',
      label: 'Modelo Benenzon (ISO)',
      description: 'Fundamentação centrada no Princípio do ISO de Benenzon.',
      values: {
        theoretical_framework: 'O presente relatório fundamenta-se no Modelo Benenzon de Musicoterapia, com ênfase no Princípio do ISO (Identidade Sonora) — gestacional, universal, cultural, complementar e grupal — articulado às diretrizes de intervenção em TEA conforme DSM-5-TR e CID-11.',
        assessment_tools_used: 'Instrumentos: observação clínica sistematizada, mapeamento do ISO, registro de respostas sonoro-musicais e diário clínico de sessões.',
        references_cited: 'Benenzon, R. (1985). Manual de Musicoterapia. Petrópolis: Vozes. Benenzon, R. (2007). La nueva musicoterapia. Lumen. APA (2022). DSM-5-TR. OMS (2022). CID-11.'
      }
    },
    {
      id: 'nordoff_robbins',
      label: 'Nordoff-Robbins Criativa',
      description: 'Musicoterapia Criativa de Nordoff-Robbins.',
      values: {
        theoretical_framework: 'A intervenção fundamenta-se na Musicoterapia Criativa de Nordoff-Robbins, que enfatiza a improvisação clínica e o desenvolvimento do "Music Child", articulada às diretrizes de intervenção em TEA conforme DSM-5-TR e CID-11.',
        assessment_tools_used: 'Instrumentos: escalas Nordoff-Robbins (Child-Therapist Relationship in Coactive Musical Experience e Musical Communicativeness), observação clínica e registro audiovisual de sessões.',
        references_cited: 'Nordoff, P.; Robbins, C. (2007). Creative Music Therapy: A Guide to Fostering Clinical Musicianship. Barcelona Publishers. APA (2022). DSM-5-TR. OMS (2022). CID-11.'
      }
    },
    {
      id: 'bruscia_imtap',
      label: 'Bruscia + IMTAP',
      description: 'Modelo de Bruscia com avaliação clínica IMTAP.',
      values: {
        theoretical_framework: 'A prática fundamenta-se no modelo de Kenneth Bruscia (níveis e métodos de musicoterapia — receptivo, recriativo, improvisacional e compositivo) associado aos domínios clínicos da IMTAP (Individualized Music Therapy Assessment Profile), em consonância com as diretrizes do DSM-5-TR e CID-11 para TEA.',
        assessment_tools_used: 'Instrumentos: IMTAP (Baxter et al., 2007), observação clínica sistematizada e registro qualitativo por método.',
        references_cited: 'Bruscia, K. (2000). Definindo Musicoterapia. Enelivros. Baxter, H. T. et al. (2007). The Individualized Music Therapy Assessment Profile (IMTAP). Jessica Kingsley. APA (2022). DSM-5-TR.'
      }
    },
    {
      id: 'integrative',
      label: 'Abordagem integrativa',
      description: 'Combinação de Benenzon, Bruscia, Nordoff-Robbins e IMTAP.',
      values: {
        theoretical_framework: 'O presente relatório fundamenta-se em abordagem integrativa: Modelo Benenzon (Princípio do ISO), Musicoterapia Criativa de Nordoff-Robbins, modelo de Bruscia (níveis e métodos) e domínios clínicos da IMTAP, associados às diretrizes de intervenção em TEA conforme DSM-5-TR e CID-11.',
        assessment_tools_used: 'Instrumentos: IMTAP (Baxter et al., 2007), Escala MuseTera de avaliação musicoterapêutica, mapeamento do ISO, escalas Nordoff-Robbins, observação clínica sistematizada e Perfil Sensorial de Dunn.',
        references_cited: 'Benenzon, R. (1985). Manual de Musicoterapia. Bruscia, K. (2000). Definindo Musicoterapia. Nordoff, P.; Robbins, C. (2007). Creative Music Therapy. Baxter et al. (2007). The Individualized Music Therapy Assessment Profile. APA (2022). DSM-5-TR. OMS (2022). CID-11.'
      }
    },
    {
      id: 'cognitivo_comportamental_musical',
      label: 'Musicoterapia Cognitivo-Comportamental',
      description: 'Fundamentação em TCC aplicada à musicoterapia para TEA.',
      values: {
        theoretical_framework: 'A intervenção fundamenta-se na Musicoterapia Cognitivo-Comportamental (CBMT), que integra princípios da Terapia Cognitivo-Comportamental ao uso estruturado da música como reforçador, mediador de aprendizagem e regulador comportamental. A abordagem dialoga com as diretrizes do DSM-5-TR e CID-11 para TEA, priorizando análise funcional do comportamento, modelagem por reforço positivo musical, dessensibilização sistemática a estímulos sonoros e treino de habilidades sociais por meio de canções estruturadas.',
        assessment_tools_used: 'Instrumentos: análise funcional do comportamento (ABC), registro de frequência e duração de respostas-alvo, escalas de ansiedade adaptadas, observação clínica estruturada e protocolos de generalização de comportamentos musicais para contextos não-musicais.',
        references_cited: 'Hilliard, R. E. (2001). The effects of music therapy-based bereavement groups. Journal of Music Therapy. Madsen, C. K.; Cotter, V.; Madsen, C. H. (1968). A behavioral approach to music therapy. APA (2022). DSM-5-TR. OMS (2022). CID-11.'
      }
    },
    {
      id: 'neurologica_nmt',
      label: 'Musicoterapia Neurológica (NMT)',
      description: 'Modelo NMT de Thaut com base em neurociência.',
      values: {
        theoretical_framework: 'O presente relatório fundamenta-se no modelo de Musicoterapia Neurológica (NMT) de Michael Thaut, baseado nos princípios da neurociência da música e da plasticidade cerebral. A abordagem utiliza técnicas padronizadas (RAS, PSE, TIMP, MIT, MACT, AMMT) para reabilitação sensório-motora, cognitiva e de linguagem em TEA, em consonância com o DSM-5-TR, CID-11 e evidências de neuroimagem sobre processamento musical no espectro autista.',
        assessment_tools_used: 'Instrumentos: protocolos NMT padronizados, avaliação de sincronização rítmica, testes de atenção sustentada e dividida, escalas de função executiva e registro neurocomportamental sistematizado.',
        references_cited: 'Thaut, M. H.; Hoemberg, V. (2014). Handbook of Neurologic Music Therapy. Oxford University Press. Thaut, M. H. (2008). Rhythm, Music, and the Brain. Routledge. APA (2022). DSM-5-TR. OMS (2022). CID-11.'
      }
    },
    {
      id: 'humanista_orff',
      label: 'Abordagem Humanística Orff',
      description: 'Musicoterapia Orff de Gertrud Orff, humanística e desenvolvimentista.',
      values: {
        theoretical_framework: 'A intervenção fundamenta-se na Musicoterapia Orff (Orff-Musiktherapie) de Gertrud Orff, abordagem humanístico-desenvolvimentista que integra música, movimento, fala e expressão corporal por meio do princípio do Elementare Musik. A prática articula-se às diretrizes do DSM-5-TR e CID-11 para TEA, priorizando a multissensorialidade, a comunicação não-verbal e o desenvolvimento global do paciente através do fazer musical ativo.',
        assessment_tools_used: 'Instrumentos: observação clínica desenvolvimentista, registro multimodal (sonoro, gestual, corporal), instrumental Orff (xilofones, metalofones, percussão), avaliação de respostas multissensoriais e diário clínico narrativo.',
        references_cited: 'Orff, G. (1980). The Orff Music Therapy: Active Furthering of the Development of the Child. Schott. Voigt, M. (2003). Orff Music Therapy with Multi-Handicapped Children. APA (2022). DSM-5-TR. OMS (2022). CID-11.'
      }
    },
    {
      id: 'psicodinamica_priestley',
      label: 'Musicoterapia Analítica (Priestley)',
      description: 'Modelo Analítico de Mary Priestley com base psicodinâmica.',
      values: {
        theoretical_framework: 'O presente trabalho fundamenta-se na Musicoterapia Analítica de Mary Priestley, abordagem psicodinâmica que utiliza a improvisação musical como meio de exploração simbólica e elaboração emocional. Em contexto de TEA, a abordagem é adaptada para favorecer a expressão de conteúdos internos não-verbalizáveis, o vínculo terapêutico e a integração do self, em diálogo com as diretrizes do DSM-5-TR e CID-11.',
        assessment_tools_used: 'Instrumentos: análise qualitativa de improvisações musicais, registro de transferência e contratransferência sonora, observação clínica psicodinâmica e diário reflexivo de sessões.',
        references_cited: 'Priestley, M. (1994). Essays on Analytical Music Therapy. Barcelona Publishers. Eschen, J. T. (2002). Analytical Music Therapy. Jessica Kingsley. APA (2022). DSM-5-TR. OMS (2022). CID-11.'
      }
    },
    {
      id: 'desenvolvimentista_floortime',
      label: 'Musicoterapia Desenvolvimentista (DIR/Floortime)',
      description: 'Abordagem DIR/Floortime de Greenspan aplicada à musicoterapia.',
      values: {
        theoretical_framework: 'A intervenção fundamenta-se no modelo DIR/Floortime (Developmental, Individual-differences, Relationship-based) de Stanley Greenspan, integrado à prática musicoterapêutica. A música é utilizada como ferramenta para abrir e fechar círculos de comunicação, expandir capacidades funcionais emocionais e respeitar as diferenças individuais de processamento sensorial. A abordagem articula-se às diretrizes do DSM-5-TR e CID-11 para TEA.',
        assessment_tools_used: 'Instrumentos: Functional Emotional Assessment Scale (FEAS), perfil sensorial individualizado, registro de círculos de comunicação musical, observação dos seis marcos funcionais emocionais e videoanálise de interações.',
        references_cited: 'Greenspan, S. I.; Wieder, S. (2006). Engaging Autism: The Floortime Approach. Da Capo. Carpente, J. A. (2012). DIR-based music therapy. APA (2022). DSM-5-TR. OMS (2022). CID-11.'
      }
    },
    {
      id: 'comunitaria_cultural',
      label: 'Musicoterapia Comunitária e Cultural',
      description: 'Community Music Therapy de Stige e Pavlicevic.',
      values: {
        theoretical_framework: 'O presente relatório fundamenta-se na Musicoterapia Comunitária (Community Music Therapy) de Brynjulf Stige e Mercédès Pavlicevic, abordagem ecológica e cultural que considera o paciente em seu contexto sociocomunitário. Em TEA, a prática promove inclusão social, participação cultural e construção de redes de apoio através da música, em consonância com o modelo biopsicossocial da CID-11 e as diretrizes do DSM-5-TR.',
        assessment_tools_used: 'Instrumentos: mapeamento ecológico de redes sociais e culturais, registro de participação comunitária, observação em ambientes naturais, escalas de qualidade de vida e entrevistas com cuidadores e contextos significativos.',
        references_cited: 'Stige, B. (2002). Culture-Centered Music Therapy. Barcelona Publishers. Stige, B.; Aaro, L. E. (2012). Invitation to Community Music Therapy. Routledge. Pavlicevic, M.; Ansdell, G. (2004). Community Music Therapy. Jessica Kingsley. APA (2022). DSM-5-TR.'
      }
    }
  ],
  observed_results: [
    {
      id: 'results_positive',
      label: 'Evolução positiva',
      description: 'Paciente alcançou a maioria das metas com ganhos consistentes.',
      values: {
        goals_achieved: 'A maioria das metas terapêuticas propostas foi alcançada com sucesso, com destaque para a ampliação da comunicação (verbal e/ou não-verbal), maior tempo de atenção compartilhada e melhora na autorregulação emocional durante as atividades musicais.',
        goals_in_progress: 'Algumas metas encontram-se em fase de consolidação, evoluindo de forma consistente sessão a sessão, com tendência clara de generalização para contextos familiar e escolar.',
        quantitative_indicators: 'Os indicadores quantitativos da Escala MuseTera demonstraram evolução ascendente em todos os domínios avaliados, com ganhos mais expressivos nas dimensões comunicativa e socioemocional.',
        treatment_summary: 'O período terapêutico caracterizou-se por evolução clínica favorável e consistente. O paciente respondeu positivamente às intervenções musicoterapêuticas, demonstrando engajamento progressivo, ampliação de repertório de habilidades e ganhos generalizáveis ao cotidiano.'
      }
    },
    {
      id: 'results_partial',
      label: 'Evolução parcial',
      description: 'Ganhos importantes, com metas ainda em desenvolvimento.',
      values: {
        goals_achieved: 'Parte das metas terapêuticas foi alcançada, com ganhos pontuais em comunicação não-verbal, tolerância ao setting e participação em atividades musicais estruturadas.',
        goals_in_progress: 'Diversas metas permanecem em desenvolvimento, exigindo continuidade do processo terapêutico para consolidação. Observa-se evolução gradual, ainda dependente de mediação e apoio estruturado.',
        quantitative_indicators: 'Os indicadores quantitativos da Escala MuseTera apontam evolução moderada, com avanços em domínios específicos e estabilidade em outros, indicando necessidade de manutenção do plano terapêutico.',
        treatment_summary: 'O período terapêutico apresentou evolução parcial, com avanços relevantes em áreas específicas e metas ainda em processo de consolidação. Recomenda-se continuidade do tratamento para potencializar os ganhos observados.'
      }
    },
    {
      id: 'results_limited',
      label: 'Evolução limitada / inicial',
      description: 'Fase inicial ou ganhos discretos, vínculo em construção.',
      values: {
        goals_achieved: 'Nesta fase inicial, observam-se ganhos discretos, especialmente relacionados ao estabelecimento do vínculo terapêutico e à tolerância progressiva ao ambiente sonoro-musical.',
        goals_in_progress: 'A maior parte das metas permanece em estágio inicial de desenvolvimento, demandando tempo, constância e adaptações sensoriais para que se efetivem ganhos mais consistentes.',
        quantitative_indicators: 'Os indicadores quantitativos da Escala MuseTera mantêm-se em patamares iniciais, refletindo o caráter recente do processo terapêutico e a importância da continuidade para evolução mensurável.',
        treatment_summary: 'O período avaliado corresponde a uma fase inicial do processo terapêutico, marcada pela construção do vínculo e pela adaptação ao setting. Os ganhos, ainda discretos, sinalizam abertura para evolução com a continuidade do tratamento.'
      }
    },
    {
      id: 'results_unfavorable',
      label: 'Resposta abaixo do esperado',
      description: 'Paciente não respondeu bem às intervenções no período.',
      values: {
        goals_achieved: 'No período avaliado, as metas terapêuticas propostas não foram alcançadas conforme o esperado, observando-se respostas inconsistentes às intervenções musicoterapêuticas e dificuldade de engajamento sustentado nas atividades.',
        goals_in_progress: 'A maioria das metas permanece sem evolução significativa, exigindo revisão do plano terapêutico, das estratégias adotadas e das adaptações sensoriais e ambientais oferecidas.',
        quantitative_indicators: 'Os indicadores quantitativos da Escala MuseTera mantiveram-se estáveis ou apresentaram pouca variação, refletindo a baixa resposta às intervenções no período avaliado.',
        treatment_summary: 'O período terapêutico caracterizou-se por resposta abaixo do esperado, com baixo engajamento e ganhos pouco expressivos. Recomenda-se reavaliação do plano terapêutico, investigação de fatores intervenientes (clínicos, sensoriais, contextuais) e eventual articulação interdisciplinar.'
      }
    }
  ],
  pending_intervention: [
    {
      id: 'pending_communication',
      label: 'Foco em comunicação',
      description: 'Aspectos comunicativos ainda a desenvolver.',
      values: {
        goals_not_achieved: 'As metas relacionadas à comunicação verbal expressiva e ao uso funcional da linguagem em contextos sociais ainda não foram plenamente alcançadas, permanecendo como prioridade para a próxima etapa terapêutica.',
        red_flags_to_monitor: 'Recomenda-se monitorar a frequência de comportamentos repetitivos e estereotipias, bem como possíveis sinais de sobrecarga sensorial durante as atividades musicais.'
      }
    },
    {
      id: 'pending_social_regulation',
      label: 'Foco em interação e regulação',
      description: 'Interação social e autorregulação a fortalecer.',
      values: {
        goals_not_achieved: 'As metas voltadas à interação social recíproca, à atenção compartilhada sustentada e à autorregulação emocional em situações de frustração ainda requerem maior consolidação.',
        red_flags_to_monitor: 'Atenção a episódios de desregulação emocional, dificuldade em transições e variações na qualidade do contato visual, que devem ser acompanhados ao longo do processo.'
      }
    },
    {
      id: 'pending_sensory',
      label: 'Foco sensório-motor',
      description: 'Integração sensorial e aspectos motores a evoluir.',
      values: {
        goals_not_achieved: 'As metas relacionadas à integração sensorial, à coordenação motora e à tolerância a diferentes estímulos sonoros e texturas instrumentais ainda estão em desenvolvimento.',
        red_flags_to_monitor: 'Monitorar respostas de defesa sensorial (auditiva, tátil), bem como sinais de hipo ou hiper-reatividade que possam interferir na participação nas atividades.'
      }
    },
    {
      id: 'pending_low_response',
      label: 'Resposta global limitada',
      description: 'Paciente com baixo engajamento e dificuldades amplas.',
      values: {
        goals_not_achieved: 'A maior parte das metas terapêuticas não foi alcançada no período, observando-se baixo engajamento global, dificuldade de adesão ao setting e respostas inconsistentes às diferentes propostas musicais. Recomenda-se revisão do plano terapêutico e das estratégias de abordagem.',
        red_flags_to_monitor: 'Atenção a sinais de sobrecarga sensorial persistente, recusa frequente das atividades, aumento de comportamentos de esquiva ou desregulação, e possíveis fatores clínicos ou contextuais que estejam interferindo na resposta terapêutica, com indicação de articulação interdisciplinar.'
      }
    }
  ],
  prognosis: [
    {
      id: 'prognosis_favorable',
      label: 'Prognóstico favorável',
      description: 'Boa resposta terapêutica e perspectiva de evolução consistente.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Ampliar repertório de canções funcionais; consolidar troca de turnos musicais; aumentar o tempo de atenção compartilhada.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Desenvolver autorregulação por meio de improvisações estruturadas; estimular comunicação intencional via instrumentos.',
        next_objectives_long: 'Longo prazo (6-12 meses): Promover a generalização das habilidades musicais para os contextos familiar e escolar.',
        proposed_interventions: 'Manutenção das intervenções receptivas, recriativas e improvisacionais, com foco em ISO de Benenzon e adaptações sensoriais individualizadas.',
        expected_outcomes: 'Espera-se evolução consistente nas dimensões comunicativa, socioemocional e sensório-motora, com generalização para contextos do cotidiano. Prognóstico favorável.'
      }
    },
    {
      id: 'prognosis_reserved',
      label: 'Prognóstico reservado',
      description: 'Evolução possível, dependente de continuidade e suporte.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Fortalecer o vínculo terapêutico; ampliar a tolerância ao setting; consolidar rotinas sonoras previsíveis.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Desenvolver gradualmente a atenção compartilhada e a comunicação intencional, respeitando o ritmo do paciente.',
        next_objectives_long: 'Longo prazo (6-12 meses): Buscar a consolidação de ganhos básicos, com reavaliação contínua dos objetivos conforme a evolução clínica.',
        proposed_interventions: 'Intervenções predominantemente receptivas e exploratórias, com estruturação altamente previsível e adaptações sensoriais constantes.',
        expected_outcomes: 'Prognóstico reservado: a evolução é possível, porém gradual, e fortemente dependente da continuidade do tratamento e do suporte familiar e interdisciplinar.'
      }
    },
    {
      id: 'prognosis_discharge',
      label: 'Preparação para alta',
      description: 'Ganhos consolidados, com vistas à alta terapêutica gradual.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Estimular a autonomia na escolha de atividades musicais; consolidar a autorregulação por meio da música.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Promover a participação em atividades musicais grupais; transferir estratégias para o cotidiano.',
        next_objectives_long: 'Longo prazo (6-12 meses): Preparar a alta terapêutica gradual, com orientações de continuidade musical em ambiente familiar e/ou escolar.',
        proposed_interventions: 'Intervenções improvisacionais e compositivas centradas na autonomia do paciente, com orientação familiar e interdisciplinar para sustentação dos ganhos.',
        expected_outcomes: 'Espera-se que o paciente utilize a música como recurso autorregulatório e comunicativo de forma autônoma e generalizada, sustentando os ganhos após a alta.'
      }
    },
    {
      id: 'prognosis_unfavorable',
      label: 'Prognóstico desfavorável / a reavaliar',
      description: 'Baixa resposta no período; necessita revisão do plano.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Reestruturar o setting e as estratégias de abordagem; priorizar o restabelecimento do vínculo terapêutico e a tolerância mínima às atividades; reduzir demandas e ampliar adaptações sensoriais.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Investigar e tratar fatores intervenientes (clínicos, sensoriais, emocionais, contextuais); reavaliar a indicação e a frequência dos atendimentos em conjunto com a equipe interdisciplinar.',
        next_objectives_long: 'Longo prazo (6-12 meses): Redefinir objetivos terapêuticos a partir de nova avaliação, considerando o ritmo individual do paciente e a necessidade de suporte intensivo e articulado.',
        proposed_interventions: 'Intervenções predominantemente receptivas e de baixa demanda, com estruturação altamente previsível, adaptações sensoriais constantes e revisão contínua do plano terapêutico em articulação interdisciplinar.',
        expected_outcomes: 'Prognóstico reservado a desfavorável no momento: a evolução depende da identificação e do manejo dos fatores que limitaram a resposta terapêutica, bem como da continuidade do tratamento com plano revisado e suporte familiar e interdisciplinar consistente.'
      }
    }
  ]
};

export function MusicoterapiaReportWizard({ 
  reportData, 
  onUpdateData, 
  onGenerateWithAI, 
  isGeneratingWithAI,
  patients,
  onSaveReport,
  isSaving,
  professionalData
}: MusicoterapiaReportWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuickFill, setShowQuickFill] = useState(false);
  const [activeField, setActiveField] = useState<string>('');
  const { toast } = useToast();

  const currentStepData = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleFieldUpdate = useCallback((fieldId: string, value: any) => {
    onUpdateData({
      ...reportData,
      fieldValues: {
        ...reportData.fieldValues,
        [fieldId]: value
      }
    });
  }, [reportData, onUpdateData]);

  const stepContentRef = useRef<HTMLDivElement>(null);

  const scrollToStepContent = () => {
    setTimeout(() => {
      stepContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollToStepContent();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollToStepContent();
    }
  };

  const handleQuickFillInsert = (text: string) => {
    if (activeField) {
      const currentValue = reportData.fieldValues?.[activeField] || '';
      const newValue = currentValue ? `${currentValue}\n\n${text}` : text;
      handleFieldUpdate(activeField, newValue);
      toast({
        title: "Texto inserido",
        description: "Frase especializada adicionada ao campo atual.",
      });
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<Record<string, string>>({});

  const applyTemplateOption = useCallback((option: TemplateOption) => {
    onUpdateData({
      ...reportData,
      fieldValues: { ...reportData.fieldValues, ...option.values }
    });
    setSelectedTemplate(prev => ({ ...prev, [currentStepData.id]: option.id }));
    toast({
      title: 'Template aplicado',
      description: `"${option.label}" preencheu os campos desta etapa. Edite livremente.`
    });
  }, [currentStepData.id, reportData, onUpdateData, toast]);

  const validateCurrentStep = () => {
    // Validação especial para a primeira etapa (Informações Básicas)
    if (currentStep === 0) {
      const missingFields = [];
      
      if (!reportData.patientName?.trim()) {
        missingFields.push({ id: 'patient_name', label: 'Nome do Paciente' });
      }
      
      if (!reportData.professionalName?.trim()) {
        missingFields.push({ id: 'professional_name', label: 'Nome do Profissional' });
      }
      
      return missingFields;
    }

    // Validação padrão para outras etapas
    const requiredFields = musicoterapiaTemplate.fields.filter(field => 
      field.required && currentStepData.fields.includes(field.id)
    );

    const missingFields = requiredFields.filter(field => {
      const value = reportData.fieldValues?.[field.id];
      return !value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && !value.trim());
    });

    return missingFields;
  };

  const canProceed = () => {
    const missingFields = validateCurrentStep();
    return missingFields.length === 0;
  };

  const handleAIGeneration = async () => {
    const observations = Object.entries(reportData.fieldValues || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    return await onGenerateWithAI(observations || 'Sessão de musicoterapia para TEA');
  };

  const renderStepFields = () => {
    // Se for a primeira etapa (Informações Básicas), renderizar o componente especializado
    if (currentStep === 0) {
      return (
        <div className="dark">
          <BasicInformationSection
            reportData={reportData}
            onUpdateData={onUpdateData}
            professionalData={professionalData}
            patients={patients}
          />
        </div>
      );
    }

    // Se for a última etapa (Revisão Final), renderizar o componente especial
    if (currentStep === STEPS.length - 1) {
      return (
        <div className="dark">
          <FinalReviewSection
            reportData={reportData}
            onOrganizeWithAI={handleAIGeneration}
            isGeneratingWithAI={isGeneratingWithAI}
            onSaveReport={onSaveReport}
            isSaving={isSaving}
            professionalData={professionalData}
          />
        </div>
      );
    }

    const stepFields = musicoterapiaTemplate.fields.filter(field =>
      currentStepData.fields.includes(field.id)
    );

    const templateOptions = STEP_TEMPLATES[currentStepData.id];
    const activeTemplateId = selectedTemplate[currentStepData.id];

    const hint = STEP_HINTS[currentStepData.id];
    const HintIcon = hint?.icon || Info;

    return (
      <div className="dark space-y-8">
        {/* Step hint banner */}
        {hint && (
          <div className="relative overflow-hidden rounded-2xl border border-[#c9a84c]/20 bg-gradient-to-br from-[#c9a84c]/[0.06] via-transparent to-transparent p-5 flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center">
              <HintIcon className="h-5 w-5 text-[#f0d78c]" />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] font-bold">Dica clínica</div>
              <h3 className="text-base text-[#f0d78c] font-semibold" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {hint.title}
              </h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">{hint.description}</p>
            </div>
          </div>
        )}

        {/* Templates profissionais (noir/gold) */}
        {templateOptions && (
          <div className="relative rounded-2xl border-2 border-[#c9a84c]/40 bg-gradient-to-br from-[#c9a84c]/[0.10] via-[#0d0d0d]/60 to-[#0d0d0d]/40 p-5 sm:p-6 space-y-5 shadow-[0_0_40px_-12px_rgba(201,168,76,0.35)]">
            <div className="absolute -top-3 left-5 px-3 py-1 rounded-full bg-[#c9a84c] text-[#0d0d0d] text-[10px] uppercase tracking-[0.18em] font-black shadow-lg">
              ✦ Textos prontos
            </div>
            <div className="flex items-start gap-3 pt-1">
              <div className="h-11 w-11 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/40 flex items-center justify-center shrink-0">
                <Wand2 className="h-5 w-5 text-[#f0d78c]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg text-[#f0d78c] font-bold" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Selecione um texto pronto
                </h3>
                <p className="text-sm text-gray-300 font-light leading-relaxed">
                  Escolha o modelo mais próximo do perfil clínico do paciente — os campos serão preenchidos automaticamente e você poderá editá-los livremente.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templateOptions.map((opt) => {
                const isActive = activeTemplateId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => applyTemplateOption(opt)}
                    className={`group text-left p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'border-[#c9a84c] bg-[#c9a84c]/15 shadow-[0_0_30px_-10px_rgba(201,168,76,0.6)]'
                        : 'border-[#c9a84c]/25 bg-[#1a1a1a]/70 hover:border-[#c9a84c]/60 hover:bg-[#c9a84c]/[0.08] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`font-semibold text-sm ${isActive ? 'text-[#f0d78c]' : 'text-gray-200 group-hover:text-[#f0d78c]'}`}>
                        {opt.label}
                      </span>
                      {isActive && (
                        <div className="h-5 w-5 rounded-full bg-[#c9a84c] flex items-center justify-center">
                          <Check className="h-3 w-3 text-[#0d0d0d]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">{opt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Form fields — numbered cards */}
        <div className="space-y-5">
          {stepFields.map((field, idx) => {
            const isFilled = (() => {
              const v = reportData.fieldValues?.[field.id];
              if (Array.isArray(v)) return v.length > 0;
              if (typeof v === 'string') return v.trim().length > 0;
              return v !== undefined && v !== null && v !== '';
            })();
            return (
              <div
                key={field.id}
                className={`group rounded-2xl border bg-[#0d0d0d]/40 p-5 sm:p-6 transition-all hover:border-[#c9a84c]/40 ${
                  isFilled ? 'border-[#c9a84c]/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-colors ${
                      isFilled
                        ? 'bg-[#c9a84c] text-[#0d0d0d] border-[#c9a84c]'
                        : 'bg-transparent text-gray-500 border-white/15 group-hover:text-[#f0d78c] group-hover:border-[#c9a84c]/50'
                    }`}
                  >
                    {isFilled ? <Check className="h-3.5 w-3.5" /> : String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <MusicoterapiaFormField
                      field={field}
                      value={reportData.fieldValues?.[field.id]}
                      onChange={(value) => handleFieldUpdate(field.id, value)}
                      onFocus={() => setActiveField(field.id)}
                    />
                  </div>
                </div>

                {field.guidance && (
                  <div className="pl-10">
                    <MusicoterapiaGuidance text={field.guidance} fieldId={field.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const StepIcon = currentStepData.icon;

  return (
    <div className={`${showQuickFill ? 'max-w-6xl' : 'max-w-3xl'} mx-auto space-y-8 sm:space-y-12 lg:space-y-16 px-3 sm:px-4 lg:px-0 transition-[max-width] duration-300`} style={{ fontFamily: "'Work Sans', sans-serif" }}>
      {/* Editorial Hero — Monolithic noir & gold */}
      <header className="flex flex-col items-center text-center space-y-4 sm:space-y-6 lg:space-y-8 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/5 text-[#f0d78c] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase">
          Protocolo Clínico · TEA
        </div>

        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#f0d78c] leading-[1.05] px-2"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Relatório MuseTera TEA
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base lg:text-lg font-light leading-relaxed px-2">
            Estrutura premium para documentação de avaliação, objetivos, técnicas e evolução clínica em musicoterapia.
          </p>
        </div>

        {/* Progresso editorial */}
        <div className="w-full max-w-md pt-2">
          <div className="flex justify-between items-center mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
            <span>Progresso</span>
            <span className="text-[#c9a84c]">{Math.round(progress)}%</span>
          </div>
          <div className="h-[2px] bg-white/5 overflow-hidden rounded-full">
            <div
              className="h-full bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Stepper Indicator — horizontal numbered */}
      {/* Stepper Indicator — compact on mobile, full on desktop */}
      <nav className="relative px-1 sm:px-2">
        {/* Mobile: compact pill view */}
        <div className="lg:hidden space-y-3">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              aria-label="Etapa anterior"
              className="h-9 w-9 rounded-full bg-[#1a1a1a] border border-white/10 text-[#f0d78c] disabled:opacity-30 flex items-center justify-center shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex-1 min-w-0 text-center">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#c9a84c] font-bold">
                Etapa {currentStep + 1} de {STEPS.length}
              </div>
              <div className="text-sm text-[#f0d78c] font-semibold truncate" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {currentStepData.title.replace(/^\d+\.\s*/, '')}
              </div>
            </div>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={currentStep === STEPS.length - 1 || !canProceed()}
              aria-label="Próxima etapa"
              className="h-9 w-9 rounded-full bg-[#c9a84c] text-[#0d0d0d] disabled:opacity-30 flex items-center justify-center shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => { setCurrentStep(index); scrollToStepContent(); }}
                  aria-label={`Ir para ${step.title}`}
                  className={`h-1.5 rounded-full transition-all ${
                    isCurrent ? 'w-6 bg-[#c9a84c]' : isCompleted ? 'w-3 bg-[#c9a84c]/60' : 'w-3 bg-white/15'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Desktop: full stepper */}
        <div className="hidden lg:block relative">
          <div className="absolute top-5 left-0 w-full h-[1px] bg-white/5" />
          <ul className="relative flex justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              return (
                <li key={step.id} className="flex flex-col items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-black ring-8 ring-[#0d0d0d] transition-all
                      ${isCurrent
                        ? 'bg-[#c9a84c] text-[#0d0d0d] shadow-[0_0_24px_rgba(201,168,76,0.35)] scale-110'
                        : isCompleted
                          ? 'bg-[#1a1a1a] border border-[#c9a84c]/60 text-[#f0d78c]'
                          : 'bg-[#1a1a1a] border border-white/15 text-white/60 hover:border-[#c9a84c]/40'
                      }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : String(index + 1).padStart(2, '0')}
                  </button>
                  <span
                    className={`text-[9px] uppercase tracking-widest font-bold text-center transition-colors px-1 leading-tight
                      ${isCurrent ? 'text-[#c9a84c]' : isCompleted ? 'text-[#f0d78c]/70' : 'text-gray-500'}`}
                    style={{ fontFamily: "'Work Sans'" }}
                  >
                    {step.title.replace(/^\d+\.\s*/, '').split(' ').slice(0, 2).join(' ')}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Main Wizard Card — Monolithic */}
      <div ref={stepContentRef} className={`grid grid-cols-1 gap-6 ${showQuickFill ? 'lg:grid-cols-4' : ''}`}>
        <section className={`${showQuickFill ? 'lg:col-span-3' : ''} bg-[#1a1a1a] rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden relative`}>
          {/* Premium accent light */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#c9a84c]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="p-4 sm:p-8 lg:p-12 space-y-6 sm:space-y-8 lg:space-y-10 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] font-bold">
                <StepIcon className="h-3.5 w-3.5" />
                Etapa {String(currentStep + 1).padStart(2, '0')} de {String(STEPS.length).padStart(2, '0')}
              </div>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl text-[#f0d78c] leading-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {currentStepData.title.replace(/^\d+\.\s*/, '')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-light">{currentStepData.description}</p>
            </div>

            <div className="text-foreground">
              {renderStepFields()}
            </div>

            <footer className="pt-6 sm:pt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between border-t border-white/5 gap-4 sm:gap-6">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                  Sincronizado com Nuvem
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="text-gray-400 hover:text-[#f0d78c] hover:bg-white/5 px-3 sm:px-4"
                >
                  <ChevronLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={currentStep === STEPS.length - 1 || !canProceed()}
                  className="group flex items-center justify-center gap-2 sm:gap-3 bg-[#c9a84c] hover:bg-[#f0d78c] disabled:opacity-40 disabled:cursor-not-allowed text-[#0d0d0d] px-5 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base flex-1 sm:flex-none"
                  style={{ fontFamily: "'Work Sans'" }}
                >
                  Próxima Seção
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </footer>

            {!canProceed() && (
              <p className="text-xs text-destructive text-center">
                Preencha os campos obrigatórios para continuar
              </p>
            )}
          </div>
        </section>

        {/* Quick Fill Panel */}
        {showQuickFill && (
          <aside className="space-y-4">
            <MusicoterapiaQuickFill
              activeField={activeField}
              onInsert={handleQuickFillInsert}
              onClose={() => setShowQuickFill(false)}
            />
          </aside>
        )}
      </div>
    </div>
  );
}