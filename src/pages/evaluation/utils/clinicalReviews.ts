/** Triagem clínica aprofundada dos 45 itens sinalizados no inventário MuseTera.
 * Texto de apoio a aplicação; não modifica IDs, escores nem define validade clínica.
 * É necessária decisão posterior de painel qualificado item a item.
 */
export interface ClinicalReview { guidance: string; reviewStatus: string; recommendation: string; }
export const TEA_CLINICAL_REVIEWS: Record<string, ClinicalReview> = {
  "Memória musical a longo prazo": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Expressividade vocal espontânea": {
    "guidance": "Este indicador examina a modalidade oral/vocal específica; ofereça oportunidades voluntárias de expressão sem exigir fala. Registre CAA, gesto e outras respostas nos indicadores de comunicação funcional, sem atribuir 0 apenas pela ausência de oralidade; marque N/A se o procedimento não for indicado.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Improvisação vocal": {
    "guidance": "Este indicador examina a modalidade oral/vocal específica; ofereça oportunidades voluntárias de expressão sem exigir fala. Registre CAA, gesto e outras respostas nos indicadores de comunicação funcional, sem atribuir 0 apenas pela ausência de oralidade; marque N/A se o procedimento não for indicado.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Qualidade da produção sonora": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Seguimento de comandos musicais": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Interação com pares no grupo": {
    "guidance": "Aplicar somente quando houver interação grupal/pares e oportunidade consentida. Registre convite, resposta, turnos e alternativas para partilha; sem grupo, marque N/A em vez de zero.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Compartilhamento de instrumentos": {
    "guidance": "Aplicar somente quando houver interação grupal/pares e oportunidade consentida. Registre convite, resposta, turnos e alternativas para partilha; sem grupo, marque N/A em vez de zero.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Aceitação de liderança musical": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Expressão adequada de emoções": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Resposta emocional apropriada": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Controle de impulsos durante atividades": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Estabilidade emocional na sessão": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Confiança para experimentar sons": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Aceitação de suas produções musicais": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Orgulho de suas criações": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Senso de competência musical": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Valorização de seu potencial": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Capacidade de generalização musical": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Transferência de aprendizagem": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Retenção de informações musicais": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Consolidação de aprendizagens": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Transferência entre modalidades": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Insight musical": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Metacognição musical": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Fluidez de gestos musicais": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Resposta auditiva adequada": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Desenvolvimento da motricidade fina": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Evolução da coordenação global": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Aperfeiçoamento gestual": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Refinamento de movimentos": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Precisão crescente": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Automatização de padrões": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Produção vocal intencional": {
    "guidance": "Este indicador examina a modalidade oral/vocal específica; ofereça oportunidades voluntárias de expressão sem exigir fala. Registre CAA, gesto e outras respostas nos indicadores de comunicação funcional, sem atribuir 0 apenas pela ausência de oralidade; marque N/A se o procedimento não for indicado.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Articulação de palavras cantadas": {
    "guidance": "Este indicador examina a modalidade oral/vocal específica; ofereça oportunidades voluntárias de expressão sem exigir fala. Registre CAA, gesto e outras respostas nos indicadores de comunicação funcional, sem atribuir 0 apenas pela ausência de oralidade; marque N/A se o procedimento não for indicado.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Vocabulário musical expressivo": {
    "guidance": "Este indicador examina a modalidade oral/vocal específica; ofereça oportunidades voluntárias de expressão sem exigir fala. Registre CAA, gesto e outras respostas nos indicadores de comunicação funcional, sem atribuir 0 apenas pela ausência de oralidade; marque N/A se o procedimento não for indicado.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Narrativas através de canções": {
    "guidance": "Este indicador examina a modalidade oral/vocal específica; ofereça oportunidades voluntárias de expressão sem exigir fala. Registre CAA, gesto e outras respostas nos indicadores de comunicação funcional, sem atribuir 0 apenas pela ausência de oralidade; marque N/A se o procedimento não for indicado.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Comentários sobre experiências musicais": {
    "guidance": "Este indicador examina a modalidade oral/vocal específica; ofereça oportunidades voluntárias de expressão sem exigir fala. Registre CAA, gesto e outras respostas nos indicadores de comunicação funcional, sem atribuir 0 apenas pela ausência de oralidade; marque N/A se o procedimento não for indicado.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Solicitações verbais relacionadas à música": {
    "guidance": "Defina antecipadamente o comportamento-alvo observável, oportunidades acessíveis, suporte e condições de N/A. Descreva a evidência sem inferir traços ou déficit fora do contexto.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Descrição de sensações musicais": {
    "guidance": "Este indicador examina a modalidade oral/vocal específica; ofereça oportunidades voluntárias de expressão sem exigir fala. Registre CAA, gesto e outras respostas nos indicadores de comunicação funcional, sem atribuir 0 apenas pela ausência de oralidade; marque N/A se o procedimento não for indicado.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Expressão de preferências verbalmente": {
    "guidance": "Este indicador examina a modalidade oral/vocal específica; ofereça oportunidades voluntárias de expressão sem exigir fala. Registre CAA, gesto e outras respostas nos indicadores de comunicação funcional, sem atribuir 0 apenas pela ausência de oralidade; marque N/A se o procedimento não for indicado.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Expressões faciais adequadas": {
    "guidance": "Reconheça atenção compartilhada, expressão e limites pessoais por sinais individualizados, sem impor contato ocular, expressão facial típica ou proximidade física. Observar escolhas espontâneas e formas comunicativas acessíveis.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Contato visual durante atividades": {
    "guidance": "Reconheça atenção compartilhada, expressão e limites pessoais por sinais individualizados, sem impor contato ocular, expressão facial típica ou proximidade física. Observar escolhas espontâneas e formas comunicativas acessíveis.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Proximidade física apropriada": {
    "guidance": "Reconheça atenção compartilhada, expressão e limites pessoais por sinais individualizados, sem impor contato ocular, expressão facial típica ou proximidade física. Observar escolhas espontâneas e formas comunicativas acessíveis.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Confiança no setting terapêutico": {
    "guidance": "Substitua julgamentos subjetivos por evidência verificável: descreva ação, quantidade de oportunidades, escolhas e apoio. Respeite autorregulação, recusa comunicada e perfil sensorial; não deduza emoção, autoestima ou obediência como desempenho.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  },
  "Demonstra progressos conquistados": {
    "guidance": "Comparar o mesmo comportamento em pelo menos duas ocasiões com condições documentadas; registrar data, apoio e evidência anterior. Não concluir evolução ou transferência por uma única sessão.",
    "reviewStatus": "Requer validação de conteúdo por painel",
    "recommendation": "Reformular descritor operacional sem alterar identificador salvo"
  }
};
