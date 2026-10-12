/**
 * Bloco discreto de identificação e carimbo reais.
 * Não produzir um "carimbo digital" sintético, nem atestar assinatura
 * criptográfica/eletrônica não verificada pelo sistema.
 */
interface SignatureDetails {
  name?: unknown;
  register?: unknown;
  specialty?: unknown;
  date?: unknown;
  email?: unknown;
  phone?: unknown;
  portrait?: string | null;
  stamp?: string | null;
}

export function renderMusicoterapiaSignaturePdf(
  input: SignatureDetails,
  escapeHtml: (value: string) => string
): string {
  const safe = (value: unknown): string => escapeHtml(String(value || '').trim());
  const name = safe(input.name) || 'Profissional responsável';
  const register = safe(input.register);
  const specialty = safe(input.specialty) || 'Musicoterapia';
  const date = safe(input.date);
  const email = safe(input.email);
  const phone = safe(input.phone);
  const portrait = input.portrait ? `<img src="${safe(input.portrait)}" alt="Imagem cadastrada do profissional" style="width:60px;height:60px;object-fit:contain;border-radius:8px;border:1px solid #d7e8e6;" />` : '';
  const stamp = input.stamp ? `
    <div style="flex-shrink:0;text-align:center;">
      <img src="${safe(input.stamp)}" alt="Carimbo cadastrado pelo profissional"
        style="display:block;max-width:114px;max-height:92px;object-fit:contain;margin:0 auto 3px;"/>
      <small style="font-size:8px;color:#64748b;">Carimbo cadastrado</small>
    </div>` : '';
  return `<section class="section-block pdf-signature-block pdf-keep" style="margin:16px 0 0;border:1px solid #d6e8e7;border-radius:9px;page-break-inside:avoid;break-inside:avoid;">
    <div style="border-top:3px solid #0f766e;padding:13px 16px;">
      <h3 style="color:#0f766e;font-size:12px;margin:0 0 11px;padding-bottom:6px;border-bottom:1px solid #c5e7df;">
        Identificação do profissional responsável
      </h3>
      <div class="pdf-keep" style="display:flex;align-items:center;gap:14px;">
        ${portrait}
        <div style="flex:1;min-width:0;font-size:10px;line-height:1.6;overflow-wrap:anywhere;">
          <strong style="font-size:12px;color:#134e4a;">${name}</strong>
          <div>${specialty}</div>
          ${register ? `<div><strong>Registro:</strong> ${register}</div>` : ''}
          ${email ? `<div><strong>Contato:</strong> ${email}</div>` : ''}
          ${phone ? `<div><strong>Telefone:</strong> ${phone}</div>` : ''}
          ${date ? `<div><strong>Data de emissão:</strong> ${date}</div>` : ''}
        </div>
        ${stamp}
      </div>
      <p style="font-size:9px;line-height:1.5;color:#64748b;margin:11px 0 0;">
        Documento gerado no MuseTera. O carimbo e a identificação, quando presentes,
        não substituem a verificação da assinatura do profissional.
      </p>
    </div>
  </section>`;
}
