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
import { MusicoterapiaObjectiveSelector } from './MusicoterapiaObjectiveSelector';
import { getSelectedMusicoterapiaObjectives } from '@/data/musicoterapiaObjectives';
import { getSelectedMusicoterapiaApproaches } from '@/data/musicoterapiaApproaches';
import { MusicoterapiaApproachSelector } from './MusicoterapiaApproachSelector';
import { MusicoterapiaReferenceSelector } from './MusicoterapiaReferenceSelector';
import { getSelectedMusicoterapiaReferences } from '@/data/musicoterapiaReferences';
import { MusicoterapiaApproachResults } from './MusicoterapiaApproachResults';
import { MusicoterapiaObjectiveOutcomes } from './MusicoterapiaObjectiveOutcomes';
import { MusicoterapiaPendingInterventions } from './MusicoterapiaPendingInterventions';
import { MusicoterapiaFinalConsiderations } from './MusicoterapiaFinalConsiderations';
import { getObjectiveOutcomesValidationIssues } from '@/data/musicoterapiaObjectiveOutcomes';
import { getApproachResultsValidationIssues } from '@/data/musicoterapiaApproachResults';

interface MusicoterapiaReportWizardProps {
  reportData: Partial<ReportData>;
  onUpdateData: (data: Partial<ReportData>) => void;
  onGenerateWithAI: (keyPoints: string) => Promise<any>;
  isGeneratingWithAI: boolean;
  patients: any[];
  onSelectPatient: (patientId: string) => void;
  anamnesisStatus: 'idle' | 'loading' | 'loaded' | 'empty' | 'error';
  onSaveReport: () => void;
  logoUrl: string | null;
  onLogoChange: (logoUrl: string | null) => void;
  onExportPDF: (logoUrl?: string | null) => Promise<void>;
  isExporting: boolean;
  isSaving: boolean;
  professionalData?: any;
}

const STEPS = [
  {
    id: 'basic_info',
    title: '1. Identificação do Paciente',
    description: 'Dados do paciente, profissional e motivo do encaminhamento',
    icon: Target,
    fields: ['patient_name', 'patient_age', 'patient_diagnosis', 'evaluation_period', 'diagnosis_source', 'cid_code', 'support_level', 'comorbidities', 'current_medications', 'treatment_start_date', 'session_count', 'session_frequency', 'session_duration', 'professional_name', 'professional_registry', 'session_date', 'referral_source', 'referral_reason']
  },
  {
    id: 'therapeutic_objectives',
    title: '2. Objetivos Terapêuticos',
    description: 'Seleção de objetivos a desenvolver e planejamento individualizado',
    icon: Target,
    fields: [] // Nesta etapa, usar somente o catálogo de 27 objetivos selecionáveis
  },
  {
    id: 'methodology',
    title: '3. Abordagem Musicoterapêutica',
    description: 'Selecione uma ou mais abordagens adotadas no acompanhamento',
    icon: Music,
    fields: [] // Somente o catálogo das 10 abordagens
  },
  {
    id: 'observed_results',
    title: '4. Resultados Observados',
    description: 'Respostas às abordagens da Etapa 03 e evolução dos objetivos da Etapa 02',
    icon: Brain,
    fields: [] // Preenchimento rápido, vinculado às abordagens realmente selecionadas
  },
  {
    id: 'pending_intervention',
    title: '5. Aspectos a Intervir',
    description: 'Demandas geradas a partir dos resultados informados na Etapa 04',
    icon: Target,
    fields: [] // Exibição automática de objetivos ainda em desenvolvimento
  },
  {
    id: 'references',
    title: '6. Referência',
    description: 'Escolha autores e obras para fundamentar o relatório',
    icon: BookOpen,
    fields: [] // Somente seis referências bibliográficas selecionáveis
  },
  {
    id: 'recommendations',
    title: '7. Recomendações',
    description: 'Orientações objetivas para a continuidade do acompanhamento',
    icon: Home,
    fields: ['recommendations'] // Apenas o campo principal, sem cartões extras
  },
  {
    id: 'final_considerations',
    title: '8. Considerações Finais',
    description: 'Síntese objetiva dos resultados e demandas ainda em acompanhamento',
    icon: Sparkles,
    fields: [] // Síntese derivada das Etapas 04–05 e nota opcional do profissional
  },
  {
    id: 'final_review',
    title: '9. Assinatura',
    description: 'Assinatura e finalização',
    icon: Check,
    fields: ['signature', 'review_notes']
  }
];

const STEP_HINTS: Record<string, { icon: React.ElementType; title: string; description: string }> = {
  basic_info: { icon: Info, title: 'Identificação e encaminhamento', description: 'Confirme os dados do paciente e do profissional e, quando disponíveis, informe a origem e o motivo do encaminhamento.' },
  therapeutic_objectives: { icon: Target, title: 'Objetivos terapêuticos', description: 'Selecione os objetivos que a musicoterapia irá estimular; defina metas observáveis e individualizadas, respeitando as características do paciente.' },
  methodology: { icon: Music, title: 'Abordagem Musicoterapêutica', description: 'Selecione os referenciais e modos de intervenção efetivamente previstos ou utilizados. Métodos especializados exigem capacitação apropriada.' },
  observed_results: { icon: Brain, title: 'Resultados por abordagem e objetivo', description: 'Registre a resposta às abordagens e a evolução de cada objetivo. A Etapa 05 será atualizada automaticamente.' },
  pending_intervention: { icon: Target, title: 'Aspectos a intervir', description: 'Veja as demandas que precisam continuar, calculadas a partir dos resultados da Etapa 04.' },
  references: { icon: BookOpen, title: 'Referências bibliográficas', description: 'Selecione apenas obras coerentes com as abordagens e efetivamente utilizadas no embasamento clínico.' },
  recommendations: { icon: Home, title: 'Recomendações', description: 'Registre apenas orientações essenciais, específicas para o paciente e coerentes com os resultados das etapas anteriores.' },
  final_considerations: { icon: Sparkles, title: 'Síntese clínica', description: 'Revise a síntese baseada nos resultados registrados e acrescente somente o que ainda não conste no relatório.' },
  final_review: { icon: Check, title: 'Assinatura', description: 'Revise o relatório, organize com IA se desejar, assine e finalize.' },
};


interface TemplateOption {
  id: string;
  label: string;
  description: string;
  values: Record<string, string | string[]>;
}

const STEP_TEMPLATES: Record<string, TemplateOption[]> = {
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
  ]

};

export function MusicoterapiaReportWizard({ 
  reportData, 
  onUpdateData, 
  onGenerateWithAI, 
  isGeneratingWithAI,
  patients,
  onSelectPatient,
  anamnesisStatus,
  onSaveReport,
  logoUrl,
  onLogoChange,
  onExportPDF,
  isExporting,
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

    // Objetivos novos devem ser escolhidos exclusivamente no catálogo aprovado.
    // Conteúdo legado permanece nos relatórios antigos, mas não é oferecido aqui.
    if (currentStepData.id === 'therapeutic_objectives') {
      const selected = getSelectedMusicoterapiaObjectives(reportData.fieldValues?.therapeutic_objective_ids);
      return selected.length > 0
        ? []
        : [{ id: 'therapeutic_objective_ids', label: 'Selecione pelo menos um dos 27 objetivos terapêuticos' }];
    }

    if (currentStepData.id === 'methodology') {
      const selected = getSelectedMusicoterapiaApproaches(reportData.fieldValues?.musicoterapia_approach_ids);
      return selected.length > 0
        ? []
        : [{ id: 'musicoterapia_approach_ids', label: 'Selecione pelo menos uma abordagem musicoterapêutica' }];
    }

    if (currentStepData.id === 'observed_results') {
      const issues = [
        ...getApproachResultsValidationIssues(
          reportData.fieldValues?.musicoterapia_approach_ids,
          reportData.fieldValues?.approach_results
        ),
        ...getObjectiveOutcomesValidationIssues(
          reportData.fieldValues?.therapeutic_objective_ids,
          reportData.fieldValues?.objective_outcomes
        )
      ];
      return issues.map((message, index) => ({ id: `result_${index}`, label: message }));
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
    // Aguardar a consulta à Anamnese antes de avançar para outras etapas.
    if (currentStep === 0 && anamnesisStatus === 'loading') return false;
    const missingFields = validateCurrentStep();
    return missingFields.length === 0;
  };



  const renderStepFields = () => {
    // Se for a primeira etapa (Informações Básicas), renderizar o componente especializado
    if (currentStep === 0) {
      return (
        <div className="space-y-1">
          <BasicInformationSection
            reportData={reportData}
            onUpdateData={onUpdateData}
            professionalData={professionalData}
            patients={patients}
            onSelectPatient={onSelectPatient}
            anamnesisStatus={anamnesisStatus}
          />
        </div>
      );
    }

    // Se for a última etapa (Revisão Final), renderizar o componente especial
    if (currentStep === STEPS.length - 1) {
      return (
        <div className="space-y-1">
          <FinalReviewSection
            reportData={reportData}
            logoUrl={logoUrl}
            onLogoChange={onLogoChange}
            onExportPDF={onExportPDF}
            isExporting={isExporting}
            onSaveReport={onSaveReport}
            isSaving={isSaving}
            professionalData={professionalData}
          />
        </div>
      );
    }

    if (currentStepData.id === 'references') {
      return (
        <div className="space-y-1">
          <MusicoterapiaReferenceSelector
            selectedIds={getSelectedMusicoterapiaReferences(reportData.fieldValues?.musicoterapia_reference_ids).map((item) => item.id)}
            selectedApproachIds={getSelectedMusicoterapiaApproaches(reportData.fieldValues?.musicoterapia_approach_ids).map((item) => item.id)}
            onChange={(ids) => handleFieldUpdate('musicoterapia_reference_ids', ids)}
          />
        </div>
      );
    }

    // A Etapa 03 mostra exclusivamente as dez abordagens solicitadas,
    // sem os formulários, buscas ou modelos de metodologia legados.
    if (currentStepData.id === 'methodology') {
      return (
        <div className="space-y-1">
          <MusicoterapiaApproachSelector
            selectedIds={getSelectedMusicoterapiaApproaches(reportData.fieldValues?.musicoterapia_approach_ids).map((item) => item.id)}
            onChange={(ids) => handleFieldUpdate('musicoterapia_approach_ids', ids)}
          />
        </div>
      );
    }

    // A Etapa 04 mostra somente as abordagens selecionadas na Etapa 03.
    // Os antigos campos extensos e os modelos de respostas prontas não são exibidos.
    if (currentStepData.id === 'observed_results') {
      return (
        <div className="space-y-1">
          <div className="space-y-6">
            <MusicoterapiaApproachResults
              selectedApproachIds={getSelectedMusicoterapiaApproaches(reportData.fieldValues?.musicoterapia_approach_ids).map((item) => item.id)}
              value={reportData.fieldValues?.approach_results}
              onChange={(results) => handleFieldUpdate('approach_results', results)}
            />
            <MusicoterapiaObjectiveOutcomes
              selectedIds={getSelectedMusicoterapiaObjectives(reportData.fieldValues?.therapeutic_objective_ids).map((item) => item.id)}
              value={reportData.fieldValues?.objective_outcomes}
              onChange={(outcomes) => handleFieldUpdate('objective_outcomes', outcomes)}
            />
          </div>
        </div>
      );
    }

    if (currentStepData.id === 'pending_intervention') {
      return (
        <div className="space-y-1">
          <MusicoterapiaPendingInterventions
            selectedObjectiveIds={reportData.fieldValues?.therapeutic_objective_ids}
            selectedApproachIds={reportData.fieldValues?.musicoterapia_approach_ids}
            objectiveOutcomes={reportData.fieldValues?.objective_outcomes}
          />
        </div>
      );
    }

    if (currentStepData.id === 'final_considerations') {
      return (
        <div className="space-y-1">
          <MusicoterapiaFinalConsiderations
            fields={reportData.fieldValues}
            onChange={(note) => handleFieldUpdate('final_considerations', note)}
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
      <div className="space-y-6">
        {/* Evitar orientações redundantes na Etapa 07, que agora tem só um campo. */}
        {hint && currentStepData.id !== 'recommendations' && (
          <div className="relative overflow-hidden rounded-2xl border border-teal-600/20 bg-gradient-to-br from-teal-600/5 via-transparent to-transparent p-5 flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-xl bg-teal-600/10 border border-teal-600/30 flex items-center justify-center">
              <HintIcon className="h-5 w-5 text-teal-800 dark:text-teal-200" />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400 font-bold">Dica clínica</div>
              <h3 className="text-base text-teal-800 dark:text-teal-200 font-semibold" >
                {hint.title}
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">{hint.description}</p>
            </div>
          </div>
        )}

        {currentStepData.id === 'therapeutic_objectives' && (
          <MusicoterapiaObjectiveSelector
            selectedIds={getSelectedMusicoterapiaObjectives(reportData.fieldValues?.therapeutic_objective_ids).map((item) => item.id)}
            onChange={(ids) => handleFieldUpdate('therapeutic_objective_ids', ids)}
          />
        )}

        {/* Templates profissionais (noir/gold) */}
        {templateOptions && (
          <div className="relative rounded-2xl border-2 border-teal-600/40 bg-gradient-to-br from-teal-600/10 via-card to-card p-5 sm:p-6 space-y-5 shadow-sm">
            <div className="absolute -top-3 left-5 px-3 py-1 rounded-full bg-teal-700 text-white text-[10px] uppercase tracking-[0.18em] font-black shadow-lg">
              ✦ Textos prontos
            </div>
            <div className="flex items-start gap-3 pt-1">
              <div className="h-11 w-11 rounded-xl bg-teal-600/15 border border-teal-600/40 flex items-center justify-center shrink-0">
                <Wand2 className="h-5 w-5 text-teal-800 dark:text-teal-200" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg text-teal-800 dark:text-teal-200 font-bold" >
                  Selecione um texto pronto
                </h3>
                <p className="text-sm text-foreground/80 font-light leading-relaxed">
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
                        ? 'border-teal-600 bg-teal-600/15 shadow-[0_0_30px_-10px_rgba(201,168,76,0.6)]'
                        : 'border-teal-600/25 bg-card/70 hover:border-teal-600/60 hover:bg-teal-600/[0.08] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`font-semibold text-sm ${isActive ? 'text-teal-800 dark:text-teal-200' : 'text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-200'}`}>
                        {opt.label}
                      </span>
                      {isActive && (
                        <div className="h-5 w-5 rounded-full bg-teal-700 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-normal leading-relaxed">{opt.description}</p>
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
                className={`group rounded-2xl border bg-background/40 p-5 sm:p-6 transition-all hover:border-teal-600/40 ${
                  isFilled ? 'border-teal-600/30' : 'border-border/60'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-colors ${
                      isFilled
                        ? 'bg-teal-700 text-white border-teal-600'
                        : 'bg-transparent text-muted-foreground border-border/70 group-hover:text-teal-800 dark:text-teal-200 group-hover:border-teal-600/50'
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
    <div className={`${showQuickFill ? 'max-w-6xl' : 'max-w-5xl'} mx-auto space-y-5 sm:space-y-6 lg:space-y-7 px-3 sm:px-4 lg:px-0 transition-[max-width] duration-300`} >
      {/* Clinical workspace: compact heading, readable progress and direct step navigation */}
      <header className="relative overflow-hidden rounded-2xl border border-teal-800/25 bg-gradient-to-br from-[#0f302f] via-[#164845] to-[#155e58] p-5 sm:p-7 lg:p-8 shadow-lg">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[32px] border-border/60" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/25 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-teal-50">
              <Music className="h-3.5 w-3.5" />
              MUSETERA · DOCUMENTAÇÃO CLÍNICA
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Relatório MuseTera TEA
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-teal-50/85">
              Documente o atendimento em nove etapas, registre respostas observáveis e revise o conteúdo antes de gerar o relatório clínico.
            </p>
          </div>
          <div className="w-full rounded-xl border border-border/70 bg-white/10 p-4 backdrop-blur-sm lg:w-64">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-teal-50">
              <span>Etapa {currentStep + 1} de {STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/20" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do relatório">
              <div className="h-full rounded-full bg-teal-200 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-teal-50/75">Navegação do formulário · não indica conclusão clínica</p>
          </div>
        </div>
      </header>

      {/* Compact context strip uses only current report values; no implied clinical completion. */}
      <div className="grid gap-2 rounded-2xl border border-border/70 bg-card p-3 shadow-sm sm:grid-cols-3 sm:p-4">
        <div className="min-w-0 rounded-xl bg-muted/40 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Paciente</p>
          <p className="mt-1 truncate text-sm font-semibold text-foreground">{reportData.patientName?.trim() || 'Aguardando identificação'}</p>
        </div>
        <div className="rounded-xl bg-muted/40 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Objetivos selecionados</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{getSelectedMusicoterapiaObjectives(reportData.fieldValues?.therapeutic_objective_ids).length}</p>
        </div>
        <div className="rounded-xl bg-muted/40 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Abordagens selecionadas</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{getSelectedMusicoterapiaApproaches(reportData.fieldValues?.musicoterapia_approach_ids).length}</p>
        </div>
      </div>

      {/* All steps remain directly accessible on desktop; mobile uses a scrollable row */}
      <nav aria-label="Etapas do relatório" className="rounded-2xl border border-border/70 bg-card p-3 shadow-sm sm:p-4">
        <div className="flex items-center justify-between gap-3 pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">Organização do documento</p>
            <p className="text-sm text-muted-foreground">Navegue entre as nove etapas. Os registros precisam de revisão antes da emissão.</p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs font-medium text-foreground sm:flex">
            <ClipboardList className="h-4 w-4 text-teal-600" />
            {currentStep + 1}/{STEPS.length}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible xl:grid-cols-5">
          {STEPS.map((step, index) => {
            const active = currentStep === index;
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => { setCurrentStep(index); scrollToStepContent(); }}
                aria-current={active ? 'step' : undefined}
                aria-label={`Etapa ${index + 1}: ${step.title.replace(/^\d+\.\s*/, '')}`}
                className={`flex min-w-[162px] items-center gap-2 rounded-xl border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 lg:min-w-0 ${
                  active
                    ? 'border-teal-500 bg-teal-50 text-teal-950 shadow-sm dark:bg-teal-950/40 dark:text-teal-100'
                    : 'border-border/70 bg-background text-foreground hover:border-teal-400 hover:bg-accent/50'
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  active ? 'bg-teal-700 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-medium opacity-70">ETAPA {String(index + 1).padStart(2, '0')}</span>
                  <span className="block text-xs font-semibold leading-tight">{step.title.replace(/^\d+\.\s*/, '')}</span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Wizard Card — Monolithic */}
      <div ref={stepContentRef} className={`grid grid-cols-1 gap-6 ${showQuickFill ? 'lg:grid-cols-4' : ''}`}>
        <section className={`${showQuickFill ? 'lg:col-span-3' : ''} bg-card rounded-2xl border border-border/70 shadow-lg overflow-hidden relative`}>
          {/* Premium accent light */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="p-4 sm:p-8 lg:p-12 space-y-6 sm:space-y-8 lg:space-y-10 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-teal-700 dark:text-teal-300 font-semibold">
                <StepIcon className="h-3.5 w-3.5" />
                Etapa {String(currentStep + 1).padStart(2, '0')} de {String(STEPS.length).padStart(2, '0')}
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight"
                
              >
                {currentStepData.title.replace(/^\d+\.\s*/, '')}
              </h2>
              <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
            </div>

            <div className="text-foreground">
              {renderStepFields()}
            </div>

            <footer className="pt-6 sm:pt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between border-t border-border/60 gap-4 sm:gap-6">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-600" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                  Revise as informações antes de emitir
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted px-3 sm:px-4"
                >
                  <ChevronLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={currentStep === STEPS.length - 1 || !canProceed()}
                  className="group flex min-h-11 items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors text-sm flex-1 sm:flex-none"
                  
                >
                  Próxima Seção
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </footer>

            {!canProceed() && (
              <p className="text-xs text-destructive text-center">
                {currentStep === 0 && anamnesisStatus === 'loading'
                  ? 'Aguarde: buscando os dados da Anamnese...'
                  : 'Preencha os campos obrigatórios para continuar'}
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