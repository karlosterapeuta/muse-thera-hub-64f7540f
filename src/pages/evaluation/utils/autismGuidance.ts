/**
 * Texto de apresentação para uso da Escala MuseTera com pessoas autistas.
 * Preserva a chave clínica original em assessments.content.selections para
 * compatibilidade com avaliações e relatórios históricos.
 */
export const AUTISM_FRIENDLY_PARAMETER_LABELS: Record<string, string> = {
  "Expressão adequada de emoções": "Expressão emocional nas modalidades próprias do paciente",
  "Resposta emocional apropriada": "Resposta emocional observável à experiência musical",
  "Resposta auditiva adequada": "Resposta auditiva funcional com conforto sensorial",
  "Expressões faciais adequadas": "Sinais afetivos individualizados (faciais, corporais ou vocais)",
  "Contato visual durante atividades": "Orientação à interação e atenção compartilhada, sem exigir contato ocular",
  "Proximidade física apropriada": "Comunicação de preferências e limites de espaço pessoal",
  "Disposição para se expor musicalmente": "Escolha voluntária de compartilhar uma produção musical",
  "Aceitação de liderança musical": "Participação em alternância de liderança musical combinada",
  "Aceita sugestões e orientações": "Negociação e resposta a sugestões musicais acessíveis",
  "Expressão de preferências verbalmente": "Expressão verbal de preferências, quando aplicável",
  "Autonomia nas escolhas musicais": "Manifestação autônoma de preferências musicais",
  "Controle de impulsos durante atividades": "Regulação de respostas em jogos musicais com regras previsíveis",
  "Adaptação a mudanças no repertório": "Estratégias de adaptação a mudanças musicais sinalizadas",
  "Tolerância a estímulos sonoros": "Identificação e manejo do conforto/desconforto sonoro",
  "Estabilidade emocional na sessão": "Identificação de necessidades de regulação durante a sessão",
  "Valorização de seu potencial": "Reconhecimento ou expressão das próprias capacidades musicais",
};

export const AUTISM_DOMAIN_NOTES: Record<string, string> = {
  "Domínio Musical": "Ofereça instrumentos e repertório de preferência, respostas por gestos ou comunicação alternativa e controle de volume. Observe musicalidade sem exigir fala.",
  "Domínio Psicossocial": "Considere reciprocidade e participação em modalidades diversas. Evite pontuar obediência, contato ocular ou mascaramento de traços autísticos como indicadores de progresso.",
  "Domínio Cognitivo": "Garanta instruções previsíveis e tempo de processamento individualizado. Diferencie barreiras de linguagem ou sensoriais da habilidade cognitiva que se pretende observar.",
  "Domínio Sensório-Motor": "Respeite hipersensibilidades, mobilidade e adaptações posturais; a recusa informada pode ser comunicação funcional, não falha. Não ultrapasse limiares de conforto.",
  "Domínio Comunicativo-Interativo": "Aceite comunicação oral, vocalizações, gestos, apontamento, figuras ou CAA. Os itens estritamente verbais podem ser marcados como não aplicáveis; não confunda ausência de fala com ausência de intenção comunicativa.",
};

export function presentationParameterLabel(original: string): string {
  return AUTISM_FRIENDLY_PARAMETER_LABELS[original] || original;
}
