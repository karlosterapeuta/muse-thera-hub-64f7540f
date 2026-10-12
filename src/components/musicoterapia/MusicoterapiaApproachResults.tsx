import React, { useState } from 'react';
import { Check, ClipboardCheck } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { getSelectedMusicoterapiaApproaches } from '@/data/musicoterapiaApproaches';
import { approachResultStatuses, getRecordedApproachResults, getApproachResultsValidationIssues, type ApproachResultsById, type ApproachResultEntry } from '@/data/musicoterapiaApproachResults';

const suggestions: Record<string, string[]> = {
  ativa: [
    'Cantou ou vocalizou', 'Tocou instrumentos', 'Fez escolhas musicais',
    'Explorou diferentes timbres', 'Acompanhou uma pulsação com apoio',
    'Iniciou uma sequência instrumental', 'Respondeu a pausas musicais',
    'Experimentou diferentes intensidades sonoras', 'Solicitou repetir a atividade',
    'Participou de canto compartilhado'
  ],
  receptiva: [
    'Escutou voluntariamente', 'Expressou preferências', 'Compartilhou lembranças',
    'Escolheu o repertório para escuta', 'Solicitou repetir uma música',
    'Demonstrou desconforto com determinado som', 'Manteve-se na experiência de escuta',
    'Reconheceu uma música familiar', 'Respondeu a mudanças de intensidade',
    'Comunicou desejo de interromper a escuta'
  ],
  improvisacao: [
    'Iniciou sons', 'Respondeu à improvisação', 'Alternou turnos',
    'Variou padrões rítmicos', 'Propôs uma ideia musical',
    'Reproduziu um motivo apresentado', 'Mudou o andamento da execução',
    'Utilizou pausas na troca musical', 'Explorou combinações de instrumentos',
    'Concluiu uma sequência improvisada'
  ],
  recreativa: [
    'Participou de jogos', 'Cantou canções conhecidas', 'Interagiu em grupo',
    'Escolheu uma brincadeira musical', 'Aguardou sua vez com apoio',
    'Acompanhou gestos de uma canção', 'Participou de jogo de pergunta e resposta',
    'Solicitou continuar a brincadeira', 'Explorou instrumento durante o jogo',
    'Comunicou preferência por atividade'
  ],
  analitica: [
    'Expressou sentimentos', 'Compartilhou significados', 'Improvisou livremente',
    'Associou uma música a uma experiência', 'Descreveu sensações durante a escuta',
    'Escolheu sons para representar uma ideia', 'Comentou sua produção musical',
    'Solicitou interromper a proposta', 'Compartilhou uma lembrança musical',
    'Identificou elementos relevantes da experiência'
  ],
  neurologica_nmt: [
    'Realizou movimento ritmado', 'Executou sequência motora', 'Acompanhou pistas musicais',
    'Sincronizou um movimento com pulso musical', 'Realizou alternância de movimentos com apoio',
    'Iniciou movimento após sinal musical', 'Concluiu sequência de movimentos proposta',
    'Necessitou de pistas adicionais para executar', 'Ajustou o andamento do movimento',
    'Apresentou dificuldade na sequência proposta'
  ],
  comportamental: [
    'Realizou resposta-alvo', 'Aguardou turno', 'Seguiu sequência',
    'Respondeu a uma instrução musical simples', 'Solicitou ajuda durante a atividade',
    'Completou etapa com mediação', 'Escolheu entre duas propostas sonoras',
    'Retomou a atividade após uma pausa', 'Recusou uma demanda musical',
    'Precisou de apoio para alternar tarefas'
  ],
  humanista: [
    'Fez escolhas', 'Expressou preferências', 'Participou voluntariamente',
    'Iniciou uma experiência musical própria', 'Recusou uma proposta e escolheu outra',
    'Compartilhou uma criação sonora', 'Solicitou mudança de repertório',
    'Escolheu a intensidade da experiência', 'Expressou necessidades durante a atividade',
    'Manteve participação em proposta escolhida'
  ],
  nordoff_robbins: [
    'Respondeu à improvisação', 'Iniciou interação musical', 'Sustentou trocas',
    'Introduziu variação rítmica', 'Acompanhou mudança melódica',
    'Alternou iniciativa e resposta musical', 'Criou motivo sonoro espontâneo',
    'Interrompeu e retomou a interação', 'Comunicou preferência durante o diálogo musical',
    'Explorou diferentes formas de resposta instrumental'
  ],
  bonny_gim: [
    'Participou da escuta guiada', 'Compartilhou imagens', 'Relatou percepções',
    'Selecionou repertório para a experiência', 'Descreveu sensações evocadas',
    'Compartilhou lembrança associada à música', 'Solicitou pausa na escuta',
    'Comunicou desconforto durante a experiência', 'Descreveu uma imagem simbólica',
    'Compartilhou impressões após a escuta'
  ]
};

interface Props {
  selectedApproachIds: string[];
  value: unknown;
  onChange: (results: ApproachResultsById) => void;
}

export function MusicoterapiaApproachResults({ selectedApproachIds, value, onChange }: Props) {
  const [openNotes, setOpenNotes] = useState<string[]>([]);
  const approaches = getSelectedMusicoterapiaApproaches(selectedApproachIds);
  const data = value && typeof value === 'object' && !Array.isArray(value) ? value as ApproachResultsById : {};
  const recorded = getRecordedApproachResults(selectedApproachIds, data);
  const issues = getApproachResultsValidationIssues(selectedApproachIds, data);

  const update = (id: string, patch: Partial<ApproachResultEntry>) => {
    const previous: ApproachResultEntry = data[id] || { status: 'insufficient_data', indicators: [], note: '' };
    const next: ApproachResultEntry = { ...previous, ...patch };
    if (next.status === 'not_applied') { next.indicators = []; next.note = ''; }
    onChange({ ...data, [id]: next });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-teal-600/40 bg-teal-600/10 p-4 flex gap-3">
        <ClipboardCheck className="h-6 w-6 shrink-0 text-teal-800 dark:text-teal-200" />
        <div>
          <h3 className="font-semibold text-teal-800 dark:text-teal-200">Como o paciente respondeu a cada abordagem?</h3>
          <p className="text-sm text-foreground/80 mt-1">
            Selecione a classificação e marque somente as situações realmente observadas. Os exemplos são opcionais e podem ser complementados com uma descrição própria.
          </p>
          <p className="text-xs text-teal-800 dark:text-teal-200 mt-2" aria-live="polite">{recorded.length} de {approaches.length} registradas</p>
        </div>
      </div>
      {!approaches.length && <p className="text-amber-700 dark:text-amber-300 text-sm">Selecione uma abordagem na Etapa 03.</p>}
      {approaches.map((approach, i) => {
        const result = recorded.find(item => item.approach.id === approach.id)?.result;
        return (
          <section key={approach.id} className="rounded-xl border border-border/70 bg-card p-4 space-y-3">
            <div className="flex gap-2 items-center">
              <span className="rounded-full border border-teal-600/40 text-teal-800 dark:text-teal-200 text-xs px-2 py-1">{i + 1}</span>
              <h4 className="text-teal-800 dark:text-teal-200 font-semibold text-sm flex-1">{approach.title}</h4>
              {result && <Check className="h-4 w-4 text-emerald-400" />}
            </div>
            <p className="text-xs text-muted-foreground">Qual foi a resposta observada?</p>
            <div className="flex flex-wrap gap-2">
              {approachResultStatuses.map(item => (
                <button key={item.id} type="button" aria-pressed={result?.status === item.id}
                  onClick={() => update(approach.id, { status: item.id, indicators: item.id === 'not_applied' ? [] : result?.indicators || [], note: item.id === 'not_applied' ? '' : result?.note || '' })}
                  className={`rounded-lg border px-3 py-2 text-xs focus-visible:ring-2 focus-visible:ring-teal-500 ${result?.status === item.id
                    ? 'bg-teal-700 text-white border-teal-600'
                    : 'bg-background text-foreground/90 border-border/70 hover:border-teal-600/60'}`}>
                  {item.label}
                </button>
              ))}
            </div>
            {result && result.status !== 'not_applied' && (
              <div className="border-t border-border/60 pt-3 space-y-3">
                <p className="text-xs text-muted-foreground">O que aconteceu? Selecione os registros observados <span className="text-muted-foreground">(opcional)</span></p>
                <div className="flex flex-wrap gap-2">
                  {(suggestions[approach.id] || []).map(label => {
                    const selected = result.indicators.includes(label);
                    return (
                      <button type="button" key={label} aria-pressed={selected}
                        onClick={() => update(approach.id, { indicators: selected ? result.indicators.filter(x => x !== label) : [...result.indicators, label] })}
                        className={`border rounded-full px-3 py-1.5 text-xs ${selected
                          ? 'border-teal-600 bg-teal-600/15 text-teal-800 dark:text-teal-200'
                          : 'border-border/70 text-foreground/80'}`}>
                        {selected ? '✓ ' : '+ '}{label}
                      </button>
                    );
                  })}
                </div>
                <button type="button" onClick={() => setOpenNotes(list => list.includes(approach.id) ? list.filter(x => x !== approach.id) : [...list, approach.id])}
                  className="text-xs text-teal-800 dark:text-teal-200 hover:underline">
                  {openNotes.includes(approach.id) || result.note ? 'Ocultar observação' : '+ Observação curta (opcional)'}
                </button>
                {(openNotes.includes(approach.id) || Boolean(result.note)) && (
                  <Textarea rows={2} maxLength={2000}
                    value={result.note}
                    onChange={event => update(approach.id, { note: event.target.value })}
                    placeholder="Ex.: Em 5 oportunidades, respondeu em 4 com apoio gestual."
                    className="bg-background border-border/70 text-foreground" />
                )}
              </div>
            )}
          </section>
        );
      })}
      {issues.length > 0 && <p className="text-xs text-amber-700 dark:text-amber-200 rounded-lg border border-amber-500/30 p-3" role="status">{issues.join(' ')}</p>}
    </div>
  );
}
