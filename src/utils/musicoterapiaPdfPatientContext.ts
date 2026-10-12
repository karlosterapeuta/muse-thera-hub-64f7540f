/**
 * Identificação clínica compacta no início do documento, após os dados do
 * paciente. Não repete o CID, nome ou responsável já exibidos no cabeçalho.
 */
export function renderMusicoterapiaPdfPatientContext(
  rawFields: Record<string, unknown> | undefined,
  escapeHtml: (value: string) => string
): string {
  const fields = rawFields || {};
  const safe = (key: string): string => {
    const value = fields[key];
    return typeof value === 'string' ? value.trim() : '';
  };
  const bullets: Array<{label:string; value:string}> = [
    { label: 'Nível de suporte informado', value: safe('support_level') },
    { label: 'Medicações relatadas', value: safe('current_medications') },
    { label: 'Período avaliado', value: safe('evaluation_period') },
    { label: 'Frequência dos atendimentos', value: safe('session_frequency') }
  ].filter(x=>x.value);
  const referralSource=safe('referral_source');
  const referralReason=safe('referral_reason');
  if (!bullets.length && !referralSource && !referralReason) return '';
  const info = bullets.length
    ? `<div class="pdf-context-grid pdf-keep">
        ${bullets.map(x => `<div class="pdf-context-item"><strong>${escapeHtml(x.label)}</strong>
        <span>${escapeHtml(x.value)}</span></div>`).join('')}
      </div>`
    : '';
  const referral = referralSource || referralReason
    ? `<div class="pdf-referral">
      <h3>Motivo do encaminhamento</h3>
      ${referralSource ? `<p><strong>Origem:</strong> ${escapeHtml(referralSource)}</p>` : ''}
      ${referralReason ? `<p>${escapeHtml(referralReason)}</p>` : ''}
    </div>`
    : '';
  return `<section class="pdf-patient-context section-block">
    ${info}
    ${referral}
  </section>`;
}

export function formatMusicoterapiaPdfDate(value: unknown): string {
  if (!value) return '';
  const text = String(value).trim();
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  const br = text.match(/^\d{2}\/\d{2}\/\d{4}$/);
  return br ? text : text;
}

/** Detecta se dois textos diagnósticos indicam o mesmo código informado. */
export function diagnosesHaveSameCid(a: unknown, b: unknown): boolean {
  const findCode = (value: unknown) => {
    const match = String(value || '').toUpperCase().match(/\b[A-Z]\d{2}(?:[.]\d{1,2})?\b/);
    return match ? match[0] : null;
  };
  const codeA=findCode(a);
  const codeB=findCode(b);
  return Boolean(codeA && codeB && codeA === codeB);
}
