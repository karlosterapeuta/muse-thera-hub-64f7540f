// Protocolo de aplicação CLÍNICA PROPOSTO. Não representa instrumento validado.
// Ordem das observações corresponde à ordem dos parâmetros existentes da Escala MuseTera.
export interface EvaluationActivityProtocol {
  title: string;
  materials: string;
  procedure: string;
  evidence: string;
  prompts: string[];
}

export const EVALUATION_ACTIVITY_PROTOCOLS: Record<string, EvaluationActivityProtocol> = {
  "Percepção Musical": {
    title: "Escuta, comparação e recordação",
    materials: "Teclado ou áudios curtos, tambor e dois instrumentos de timbres contrastantes.",
    procedure: "Apresente pares de sons e trechos breves; alterne altura, timbre, intensidade, pulsação e melodias. Repita após breve intervalo e, quando aplicável, retome material de sessão anterior.",
    evidence: "Registrar acertos por tentativa, tempo de atenção, respostas por gesto/olhar/voz e necessidade de pistas.",
    prompts: ["Diferenciar dois sons graves e agudos em três apresentações.","Identificar qual instrumento tocou sem pista visual em três tentativas.","Marcar a pulsação de um trecho curto em duas velocidades.","Reproduzir ou reconhecer uma sequência sonora após pausa breve.","Reconhecer canção trabalhada em sessão anterior sem antecipar a resposta.","Acompanhar trecho sonoro e registrar o tempo de atenção efetiva.","Distinguir sons fortes e fracos com intensidade confortável.","Reconhecer dois pequenos motivos melódicos iguais ou diferentes."]
  },
  "Expressão Musical": {
    title: "Exploração e improvisação compartilhada",
    materials: "Instrumentos acessíveis, microfone opcional e acompanhamento harmônico simples.",
    procedure: "Ofereça escolha de instrumento e momentos de exploração espontânea, imitação e improvisação, sem exigir resposta verbal.",
    evidence: "Anotar iniciativa, variedade expressiva, intenção, sincronia e níveis de apoio.",
    prompts: ["Observar vocalizações espontâneas dirigidas ou relacionadas à música.","Convidar a expressar contraste emocional ou musical por instrumento.","Oferecer período de criação livre sem modelo inicial.","Propor completar vocalmente uma frase musical aberta.","Propor diálogo improvisado com pergunta e resposta instrumental.","Convidar a acompanhar pulso estável com apoio progressivamente reduzido.","Observar controle de início, duração e intensidade do som produzido.","Disponibilizar instrumentos para iniciar uma ideia musical própria."]
  },
  "Compreensão Musical": {
    title: "Jogo de sinais e estruturas musicais",
    materials: "Tambor, teclado, canções familiares e cartões opcionais.",
    procedure: "Faça músicas com começo, pausa, final, contraste de velocidade e intensidade; peça respostas por gestos, escolha ou execução.",
    evidence: "Registrar compreensão funcional, número de tentativas e pistas dadas.",
    prompts: ["Observar antecipação e resposta ao sinal musical de começar/parar.","Oferecer dois estilos contrastantes e solicitar discriminação por escolha.","Apresentar instrumentos conhecidos para identificação por som ou imagem.","Aplicar contrastes forte/fraco e rápido/lento com comandos claros.","Relacionar trechos a emoções sem pressupor uma única resposta correta.","Apresentar instruções simples incorporadas à canção.","Interromper padrão previsível e observar antecipação da continuação.","Explorar repetição e contraste em forma musical curta (A–B–A)."]
  },
  "Interação Social": {
    title: "Roda de turnos e parceria musical",
    materials: "Dois instrumentos e, se houver grupo, pares disponíveis.",
    procedure: "Conduza jogo de pergunta–resposta musical, partilha de instrumentos, turnos e mudanças de liderança; não penalize ausência de pares quando não houver grupo.",
    evidence: "Registrar engajamento, reciprocidade, espontaneidade e apoio social.",
    prompts: ["Observar engajamento compartilhado com terapeuta em atividade musical.","Quando houver pares, registrar convites e respostas na interação grupal.","Propor troca de instrumentos em momento combinado.","Criar pausa convidativa e observar iniciativa de interação.","Executar alternância de frases sonoras com o terapeuta.","Realizar turnos musicais com sinal previsível de espera.","Convidar paciente a seguir liderança musical e depois conduzir.","Propor execução colaborativa de um ritmo ou canção."]
  },
  "Regulação Emocional": {
    title: "Contrastes musicais e retomada da atividade",
    materials: "Playlist individualizada e instrumentos de intensidade controlável.",
    procedure: "Ofereça escolhas musicais, pequenas mudanças e desafios adequados; observe sinais de conforto, desconforto e estratégias de autorregulação; interrompa se houver sofrimento.",
    evidence: "Anotar sinais afetivos antes/durante/depois, necessidade de mediação e tempo de recuperação.",
    prompts: ["Registrar expressão emocional observável por voz, gesto ou instrumento.","Oferecer recurso musical preferido e observar uso para reorganização.","Comparar respostas afetivas a trechos familiares e novos.","Observar mudanças de estado afetivo após música escolhida.","Propor desafio musical ajustado e registrar reação ao erro.","Introduzir pausas musicais e observar controle de resposta.","Alterar trecho ou instrumento com aviso e observar adaptação.","Registrar estabilidade e recuperação emocional ao longo da sessão."]
  },
  "Autoestima e Autoconceito": {
    title: "Escolhas, desafio graduado e apresentação opcional",
    materials: "Instrumentos de preferência e gravador opcional com consentimento.",
    procedure: "Dê oportunidades reais de escolha, criação, repetição e apresentação facultativa; evite exigir exposição ou aprovação verbal.",
    evidence: "Registrar iniciativa, persistência e comunicação de satisfação sem inferir autoestima apenas da habilidade musical.",
    prompts: ["Oferecer instrumento novo e observar iniciativa de experimentação.","Convidar a ouvir a própria criação e observar aceitação sem julgamento.","Oferecer apresentação musical somente se paciente concordar.","Permitir compartilhar criação e observar sinais autorreferidos de satisfação.","Introduzir dificuldade acessível e registrar tentativas de continuidade.","Oferecer duas opções e observar escolha independente.","Perguntar ou oferecer comunicação alternativa sobre sensação de competência.","Registrar reconhecimento de conquistas comunicado pelo paciente."]
  },
  "Funções Executivas": {
    title: "Sequência rítmica com regras variáveis",
    materials: "Tambor, cartões com padrões e instrumento de pausa.",
    procedure: "Apresente uma sequência simples, solicite planejamento, execução, interrupção e mudança de regra. Ajuste complexidade ao perfil.",
    evidence: "Registrar quantidade de etapas independentes, erros, autorreparação e pistas.",
    prompts: ["Observar permanência na tarefa musical por tempo previamente definido.","Solicitar organizar duas ou três etapas sonoras antes de tocar.","Alterar regra de execução e observar ajuste de estratégia.","Introduzir problema musical simples com solução possível.","Oferecer escolha entre dois caminhos para terminar uma frase.","Executar jogo tocar/parar conforme sinal combinado.","Solicitar sequência temporal de três ações musicais.","Convidar paciente a conferir e ajustar sua execução."]
  },
  "Processamento da Informação": {
    title: "Escuta, ordenação e transformação sonora",
    materials: "Sinos, cartões visuais e sons curtos contrastantes.",
    procedure: "Apresente estímulos auditivos curtos com diferentes ordens e modalidades; varie a quantidade de pistas de forma controlada.",
    evidence: "Registrar latência, sequência correta, necessidade de repetição e generalização observada.",
    prompts: ["Medir resposta ao sinal sonoro sem priorizar rapidez em prejuízo de precisão.","Pedir reprodução da ordem de dois ou três sons.","Associar som, gesto e cartão visual durante tarefa acessível.","Repetir sequência após processamento de outra informação breve.","Apresentar o mesmo padrão em instrumento diferente.","Transferir regra já aprendida para material musical novo.","Agrupar sons por uma característica combinada.","Identificar regra simples em padrões repetidos."]
  },
  "Aprendizagem Musical": {
    title: "Ensino breve e verificação de retenção",
    materials: "Instrumento acessível e sequência de duas a quatro notas/ritmos.",
    procedure: "Ensine uma habilidade curta; teste imediatamente, após distração e, quando possível, em outra sessão ou instrumento.",
    evidence: "Registrar desempenho inicial, após ensino e na retomada, com mesmo critério.",
    prompts: ["Ensinar padrão novo e verificar primeira aquisição.","Reavaliar padrão após intervalo sem demonstrá-lo novamente.","Convidar aplicação de padrão previamente conhecido.","Introduzir variação de repertório e observar adaptação.","Retomar habilidade aprendida em sessão anterior.","Reproduzir padrão aprendido com voz, corpo ou instrumento alternativo.","Observar descoberta autônoma de solução musical após exploração.","Perguntar ou ofertar símbolos para descrever como conseguiu aprender."]
  },
  "Coordenação Motora": {
    title: "Padrões de percussão e movimento adaptado",
    materials: "Tambor, baquetas leves, teclado ou instrumentos adaptados.",
    procedure: "Peça sequências de movimentos finos, amplos, alternados e simultâneos, considerando adaptações físicas e fadiga.",
    evidence: "Registrar precisão, coordenação, tempo, conforto e apoio; não confundir limitação motora com desinteresse.",
    prompts: ["Solicitar alternância e simultaneidade de mãos quando acessível.","Explorar acionamento fino de teclas ou pequenos instrumentos.","Organizar sequência motora de dois a três gestos.","Reproduzir pulso com movimentos acessíveis.","Associar gesto corporal ao início e final da música.","Executar movimentos amplos seguros acompanhando a música.","Alternar movimentos distintos sem exigir simetria impossível.","Observar continuidade e transições dos gestos musicais."]
  },
  "Processamento Sensorial": {
    title: "Exploração sensorial graduada e segura",
    materials: "Instrumentos com timbre e textura variados; controle de volume.",
    procedure: "Apresente estímulos previsíveis e graduais, com liberdade de recusa e pausa; não use exposição sonora desconfortável.",
    evidence: "Registrar aceitação, aversão, autorregulação, discriminação e ajustes ambientais.",
    prompts: ["Apresentar som confortável e registrar orientação ou resposta auditiva.","Associar estímulo sonoro e sinal visual.","Oferecer contato voluntário com diferentes texturas instrumentais.","Observar percepção corporal durante ação musical adaptada.","Comparar tolerância a volumes baixos e moderados sem exceder conforto.","Disponibilizar escolha de volume e pausas para modular estímulo.","Discriminar pequenas diferenças seguras de som ou textura.","Integrar movimento corporal seguro a estímulos auditivos."]
  },
  "Desenvolvimento Motor": {
    title: "Repetição comparável e variação de movimentos",
    materials: "Instrumentos adaptados e registros anteriores quando disponíveis.",
    procedure: "Repita um padrão motor musical breve, compare desempenho com linha de base e registre adaptações; evolução exige mais de uma ocasião.",
    evidence: "Registrar consistência, esforço, mudanças ao longo de sessões e apoios.",
    prompts: ["Comparar destreza em tarefa manual musical repetida.","Comparar coordenação ampla em movimento musical seguro.","Observar melhora na organização e execução de gestos.","Propor refinamento gradual da mesma ação instrumental.","Registrar quantidade de movimentos desnecessários sem penalizar adaptações.","Comparar precisão do padrão após práticas sucessivas.","Verificar se padrão musical é executado com menos pistas.","Convidar variação espontânea de gesto durante música."]
  },
  "Comunicação Verbal": {
    title: "Canções com lacunas e escolhas comunicativas",
    materials: "Canções familiares, microfone opcional e comunicação alternativa.",
    procedure: "Use canção de escolha do paciente com pausas funcionais, perguntas musicais e oportunidade de fala ou vocalização; respeite perfil não verbal.",
    evidence: "Registrar intenção, modalidade e espontaneidade; não equiparar ausência de fala a ausência de comunicação.",
    prompts: ["Criar pausa musical para observar vocalização com intenção.","Oferecer completar palavras cantadas conhecidas sem cobrança articulatória.","Apresentar objetos musicais e observar nomeação espontânea.","Criar canção narrativa com início e continuação conduzida pelo paciente.","Convidar comentário livre sobre trecho escutado.","Oferecer oportunidade de pedir música, pausa ou instrumento verbalmente.","Convidar relato de sensação musical com respostas abertas.","Apresentar opções e observar expressão verbal de preferência."]
  },
  "Comunicação Não-Verbal": {
    title: "Diálogo musical com gestos e escolhas",
    materials: "Instrumentos, imagens acessíveis e espelho opcional.",
    procedure: "Construa interações com pausa, gesto, apontamento, imitação e expressão corporal sem exigir contato ocular.",
    evidence: "Registrar função comunicativa de gestos, expressões e movimentos, respeitando diferenças neurodivergentes.",
    prompts: ["Convidar pedido ou resposta por gesto durante canção.","Observar expressões faciais espontâneas relacionadas à música.","Oferecer espaço para expressar-se corporalmente durante trecho.","Registrar orientação social espontânea sem impor contato visual.","Criar ocasião para gesto intencional de início/parada.","Propor imitação de gesto musical acessível.","Apresentar duas opções e observar apontamento ou indicação.","Observar regulação de distância interpessoal respeitando preferências sensoriais."]
  },
  "Pragmática Comunicativa": {
    title: "Conversação musical funcional",
    materials: "Dois instrumentos e repertório escolhido pelo paciente.",
    procedure: "Use alternância musical como conversação e crie ocasiões para iniciar, responder, manter assunto e reparar mal-entendidos.",
    evidence: "Registrar intenção, reciprocidade, adequação ao contexto e pistas fornecidas.",
    prompts: ["Criar pausa para iniciativa comunicativa espontânea.","Realizar turnos de pergunta e resposta instrumental ou vocal.","Observar convite espontâneo à interação musical.","Introduzir convite musical do terapeuta e registrar resposta.","Sustentar tema musical por algumas trocas.","Oferecer meios para solicitar pausa, ajuda ou preferência pela música.","Simular falha de compreensão leve e observar tentativa de esclarecer.","Variar contexto da troca e observar adaptação comunicativa."]
  },
  "Interação Terapêutica": {
    title: "Sessão compartilhada com escolhas e colaboração",
    materials: "Instrumentos preferidos, proposta nova e registro longitudinal.",
    procedure: "Ofereça sequência previsível com escolha, colaboração e encerramento, registrando qualidade da aliança ao longo das sessões.",
    evidence: "Registrar sinais observáveis de confiança, negociação, cooperação e generalização quando houver evidência externa.",
    prompts: ["Observar procura espontânea e reciprocidade com musicoterapeuta.","Registrar exploração segura do ambiente e solicitações de apoio.","Convidar execução conjunta com papéis definidos.","Oferecer sugestão alternativa respeitando recusa comunicada.","Disponibilizar meio verbal ou não verbal para comunicar necessidade.","Negociar objetivos simples da atividade com o paciente.","Comparar conquistas demonstradas em sessões subsequentes.","Registrar transferência apenas se observada ou relatada por fonte identificada."]
  }
};
