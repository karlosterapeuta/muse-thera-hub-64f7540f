export interface EvolutionReportTemplate {
  id: string;
  name: string;
  sections: EvolutionReportSection[];
}

export interface EvolutionReportSection {
  id: string;
  title: string;
  description: string;
  fields: EvolutionReportField[];
}

export interface EvolutionReportField {
  id: string;
  label: string;
  type: 'multiselect' | 'textarea' | 'text';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export const evolutionMuseteraTemplate: EvolutionReportTemplate = {
  id: "evolution-musetera",
  name: "Relatório de Evolução – MuseTera",
  sections: [
    {
      id: "arrival",
      title: "1. Como a criança chegou",
      description: "Descreva o estado inicial da criança ao chegar na sessão",
      fields: [
        {
          id: "arrival_state",
          label: "Estado de chegada",
          type: "multiselect",
          required: true,
          options: [
            "Calma e receptiva",
            "Agitada e hiperativa",
            "Retraída e tímida",
            "Chorosa e resistente",
            "Ansiosa mas colaborativa"
          ]
        },
        {
          id: "arrival_notes",
          label: "Observações adicionais",
          type: "textarea",
          required: false,
          placeholder: "Descreva outros aspectos relevantes sobre a chegada..."
        }
      ]
    },
    {
      id: "resources",
      title: "2. Recursos usados",
      description: "Instrumentos e materiais utilizados na sessão",
      fields: [
        {
          id: "musical_instruments",
          label: "Instrumentos musicais",
          type: "multiselect",
          required: true,
          options: [
            "Piano/Teclado",
            "Violão",
            "Instrumentos de percussão",
            "Xilofone",
            "Flauta doce",
            "Chocalhos e maracas",
            "Tambores",
            "Boomwhackers"
          ]
        },
        {
          id: "additional_resources",
          label: "Recursos adicionais",
          type: "textarea",
          required: false,
          placeholder: "Descreva outros recursos utilizados..."
        }
      ]
    },
    {
      id: "dynamics",
      title: "3. Dinâmicas usadas",
      description: "Atividades e dinâmicas aplicadas durante a sessão",
      fields: [
        {
          id: "therapeutic_dynamics",
          label: "Dinâmicas terapêuticas",
          type: "multiselect",
          required: true,
          options: [
            "Improvisação musical",
            "Escuta musical ativa",
            "Movimento corporal com música",
            "Criação de ritmos",
            "Canto e vocalização",
            "Jogos musicais",
            "Relaxamento com música",
            "Composição musical simples"
          ]
        },
        {
          id: "dynamics_notes",
          label: "Detalhes das dinâmicas",
          type: "textarea",
          required: false,
          placeholder: "Descreva como as dinâmicas foram conduzidas..."
        }
      ]
    },
    {
      id: "therapeutic_plan",
      title: "4. Plano terapêutico em uso Musicoterapia",
      description: "Objetivos e estratégias do plano terapêutico aplicado",
      fields: [
        {
          id: "therapeutic_objectives",
          label: "Objetivos terapêuticos",
          type: "multiselect",
          required: true,
          options: [
            "Desenvolvimento da comunicação",
            "Regulação emocional",
            "Habilidades sociais",
            "Coordenação motora",
            "Atenção e concentração",
            "Expressão criativa",
            "Redução de ansiedade",
            "Autoestima e autoconfiança"
          ]
        },
        {
          id: "plan_notes",
          label: "Estratégias específicas",
          type: "textarea",
          required: false,
          placeholder: "Descreva as estratégias específicas do plano..."
        }
      ]
    },
    {
      id: "specific_behaviors",
      title: "5. Comportamentos específicos dos pacientes",
      description: "Comportamentos observados durante a sessão",
      fields: [
        {
          id: "observed_behaviors",
          label: "Comportamentos observados",
          type: "multiselect",
          required: true,
          options: [
            "Estereotipias diminuídas",
            "Maior contato visual",
            "Iniciativa para interação",
            "Autorregulação melhorada",
            "Comportamentos desafiadores reduzidos",
            "Maior tempo de atenção",
            "Respostas emocionais adequadas",
            "Flexibilidade comportamental"
          ]
        },
        {
          id: "behavior_notes",
          label: "Detalhes comportamentais",
          type: "textarea",
          required: false,
          placeholder: "Descreva outros comportamentos relevantes..."
        }
      ]
    },
    {
      id: "musical_responses",
      title: "6. Respostas ao ritmo, melodia e harmonia durante a sessão",
      description: "Como o paciente respondeu aos elementos musicais",
      fields: [
        {
          id: "rhythm_response",
          label: "Resposta ao ritmo",
          type: "multiselect",
          required: true,
          options: [
            "Sincronização corporal espontânea",
            "Acompanhamento com instrumentos",
            "Movimentos rítmicos coordenados",
            "Reconhecimento de padrões rítmicos",
            "Criação de ritmos próprios"
          ]
        },
        {
          id: "melody_response",
          label: "Resposta à melodia",
          type: "multiselect",
          required: true,
          options: [
            "Vocalização melódica",
            "Acompanhamento vocal",
            "Reconhecimento de melodias familiares",
            "Expressão emocional através da melodia",
            "Criação melódica espontânea"
          ]
        },
        {
          id: "harmony_response",
          label: "Resposta à harmonia",
          type: "multiselect",
          required: true,
          options: [
            "Sensibilidade a mudanças harmônicas",
            "Preferência por harmonias específicas",
            "Relaxamento com acordes suaves",
            "Estimulação com progressões complexas"
          ]
        },
        {
          id: "musical_responses_notes",
          label: "Observações sobre respostas musicais",
          type: "textarea",
          required: false,
          placeholder: "Descreva outras respostas musicais observadas..."
        }
      ]
    },
    {
      id: "active_participation",
      title: "7. Participação ativa em atividades musicais",
      description: "Nível de engajamento em instrumentos, canto e movimento",
      fields: [
        {
          id: "instrument_participation",
          label: "Uso de instrumentos",
          type: "multiselect",
          required: true,
          options: [
            "Exploração espontânea de instrumentos",
            "Uso direcionado de instrumentos",
            "Preferência por instrumentos específicos",
            "Técnica melhorada no manuseio",
            "Criatividade no uso de instrumentos"
          ]
        },
        {
          id: "vocal_participation",
          label: "Participação vocal",
          type: "multiselect",
          required: true,
          options: [
            "Vocalização espontânea",
            "Canto acompanhado",
            "Repetição de palavras/sílabas",
            "Criação de sons vocais",
            "Modulação da voz"
          ]
        },
        {
          id: "movement_participation",
          label: "Movimento corporal",
          type: "multiselect",
          required: true,
          options: [
            "Movimentos corporais livres",
            "Dança estruturada",
            "Coordenação com o ritmo",
            "Expressão corporal criativa",
            "Movimento direcionado"
          ]
        },
        {
          id: "participation_notes",
          label: "Detalhes da participação",
          type: "textarea",
          required: false,
          placeholder: "Descreva aspectos específicos da participação..."
        }
      ]
    },
    {
      id: "communication_evolution",
      title: "8. Evolução na comunicação verbal e não verbal",
      description: "Progressos observados na comunicação durante as interações musicais",
      fields: [
        {
          id: "verbal_communication",
          label: "Comunicação verbal",
          type: "multiselect",
          required: true,
          options: [
            "Aumento de vocalizações",
            "Palavras novas expressas",
            "Frases simples formadas",
            "Comunicação funcional melhorada",
            "Iniciativa para comunicar-se"
          ]
        },
        {
          id: "nonverbal_communication",
          label: "Comunicação não verbal",
          type: "multiselect",
          required: true,
          options: [
            "Maior contato visual",
            "Gestos comunicativos aumentados",
            "Expressões faciais mais variadas",
            "Uso de apontamento",
            "Imitação de gestos"
          ]
        },
        {
          id: "communication_notes",
          label: "Progressos comunicativos",
          type: "textarea",
          required: false,
          placeholder: "Descreva outros avanços na comunicação..."
        }
      ]
    },
    {
      id: "emotional_responses",
      title: "9. Respostas emocionais observadas",
      description: "Reações emocionais aos estímulos musicais",
      fields: [
        {
          id: "emotional_states",
          label: "Estados emocionais observados",
          type: "multiselect",
          required: true,
          options: [
            "Alegria e prazer evidente",
            "Calma e relaxamento",
            "Entusiasmo e animação",
            "Concentração e foco",
            "Satisfação pós-atividade",
            "Regulação emocional melhorada",
            "Expressão emocional adequada"
          ]
        },
        {
          id: "emotional_notes",
          label: "Detalhes das respostas emocionais",
          type: "textarea",
          required: false,
          placeholder: "Descreva nuances das respostas emocionais..."
        }
      ]
    },
    {
      id: "session_adjustments",
      title: "10. Ajustes feitos na sessão",
      description: "Modificações realizadas para maximizar os benefícios terapêuticos",
      fields: [
        {
          id: "therapeutic_adjustments",
          label: "Ajustes terapêuticos",
          type: "multiselect",
          required: true,
          options: [
            "Alteração do ritmo das atividades",
            "Troca de instrumentos utilizados",
            "Modificação do volume musical",
            "Adaptação das dinâmicas",
            "Mudança no ambiente físico",
            "Ajuste no tempo de atividades"
          ]
        },
        {
          id: "adjustments_notes",
          label: "Detalhes dos ajustes",
          type: "textarea",
          required: false,
          placeholder: "Explique os ajustes realizados e suas justificativas..."
        }
      ]
    },
    {
      id: "session_end",
      title: "11. Como o paciente saiu da sessão",
      description: "Estado do paciente ao final da sessão",
      fields: [
        {
          id: "final_state",
          label: "Estado final",
          type: "multiselect",
          required: true,
          options: [
            "Calmo e satisfeito",
            "Energizado positivamente",
            "Relaxado e tranquilo",
            "Comunicativo e sociável",
            "Mais organizado emocionalmente"
          ]
        },
        {
          id: "end_notes",
          label: "Observações finais",
          type: "textarea",
          required: false,
          placeholder: "Descreva outros aspectos relevantes do final da sessão..."
        }
      ]
    }
  ]
};