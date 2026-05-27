import { valorPorExtenso } from "@/utils/numberToWords";
import { maskCPF, maskCNPJ, onlyDigits } from "@/utils/cpfCnpjUtils";
import type { ReceiptIssuerProfile } from "@/hooks/useReceiptIssuerProfile";
import { FileText, CheckCircle2 } from "lucide-react";

interface Props {
  amount: number;
  patientName: string;
  patientDocument?: string;
  serviceDescription: string;
  paymentDate: string;
  paymentMethod: string;
  city?: string;
  observations?: string;
  issuer?: ReceiptIssuerProfile | null;
}

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);

const fmtDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
};

const maskDoc = (n?: string) => {
  if (!n) return "";
  const d = onlyDigits(n);
  return d.length === 11 ? maskCPF(d) : d.length === 14 ? maskCNPJ(d) : n;
};

export function ReceiptLivePreview(p: Props) {
  const docType = issuerDocType(p.issuer);
  const city = p.city || p.issuer?.city;

  return (
    <div className="relative">
      {/* Floating badge */}
      <div className="absolute -top-3 left-4 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-amber-500 px-3 py-1 text-[10px] font-bold text-white shadow-lg shadow-primary/30">
        <CheckCircle2 className="h-3 w-3" />
        PRÉ-VISUALIZAÇÃO AO VIVO
      </div>

      {/* Paper sheet */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-white text-slate-800 shadow-2xl shadow-primary/10 ring-1 ring-black/5 dark:bg-zinc-50">
        {/* Decorative diagonal stripe */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rotate-45 bg-gradient-to-br from-primary/10 to-amber-500/10" />
        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
          <FileText className="h-56 w-56 text-primary/[0.04]" strokeWidth={1} />
        </div>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary via-primary to-amber-500 px-6 py-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] opacity-80">Documento fiscal</div>
              <div className="text-lg font-extrabold leading-tight">RECIBO DE PAGAMENTO</div>
            </div>
            <div className="rounded-lg bg-white/15 px-2.5 py-1 text-right backdrop-blur">
              <div className="text-[9px] uppercase opacity-80">Emissão</div>
              <div className="text-[11px] font-semibold">{fmtDate(p.paymentDate) || "—"}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative px-6 py-5 text-[11px] leading-relaxed">
          {/* Amount card */}
          <div className="mb-5 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-amber-500/5 to-transparent p-4">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-primary/70">Valor recebido</div>
            <div className="mt-0.5 text-3xl font-extrabold tracking-tight text-primary">{fmtBRL(p.amount)}</div>
            <div className="mt-1 text-[10px] italic text-slate-500">
              ({p.amount > 0 ? valorPorExtenso(p.amount) : "—"})
            </div>
          </div>

          {/* Two-column parties */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Card title="Emissor (recebedor)">
              <div className="font-semibold text-slate-900">
                {p.issuer?.legal_name || <Placeholder>Configure seu perfil</Placeholder>}
              </div>
              {p.issuer?.trade_name && <div className="text-slate-500">{p.issuer.trade_name}</div>}
              {p.issuer?.document_number && (
                <div className="mt-1 text-slate-600">
                  <span className="font-semibold">{docType.toUpperCase()}:</span> {maskDoc(p.issuer.document_number)}
                </div>
              )}
              {p.issuer?.address && <div className="text-slate-500">{p.issuer.address}</div>}
            </Card>

            <Card title="Pagador">
              <div className="font-semibold text-slate-900">
                {p.patientName || <Placeholder>Nome do pagador</Placeholder>}
              </div>
              {p.patientDocument && (
                <div className="mt-1 text-slate-600">
                  <span className="font-semibold">DOC:</span> {maskDoc(p.patientDocument)}
                </div>
              )}
            </Card>
          </div>

          {/* Service */}
          <div className="mt-4">
            <SectionTitle>Referente a</SectionTitle>
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-3 text-slate-700">
              {p.serviceDescription || <Placeholder>Descrição do serviço</Placeholder>}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip label="Forma" value={p.paymentMethod?.toUpperCase() || "—"} />
              <Chip label="Data" value={fmtDate(p.paymentDate) || "—"} />
            </div>
          </div>

          {p.observations && (
            <div className="mt-4">
              <SectionTitle>Observações</SectionTitle>
              <div className="whitespace-pre-wrap rounded-lg bg-amber-50/70 border border-amber-200/60 p-2.5 text-slate-700">
                {p.observations}
              </div>
            </div>
          )}

          {/* Signature area */}
          <div className="mt-6 pt-4">
            <div className="text-center text-[11px] text-slate-600">
              {city || "_________________"}, {fmtDate(p.paymentDate) || "____ de ________ de ____"}
            </div>
            <div className="mx-auto mt-8 w-2/3 border-t border-slate-400" />
            <div className="mt-1 text-center text-[10px] uppercase tracking-wider text-slate-500">
              Assinatura do emissor
            </div>
          </div>
        </div>

        {/* Footer stripe */}
        <div className="relative h-2 bg-gradient-to-r from-primary via-amber-500 to-primary" />
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-primary/80">
      <span className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      {children}
      <span className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm">
      <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-primary/70">{title}</div>
      {children}
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] shadow-sm">
      <span className="font-semibold text-slate-500">{label}:</span>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return <span className="italic text-slate-400">{children}</span>;
}

function issuerDocType(i?: ReceiptIssuerProfile | null) {
  return i?.document_type || "cpf";
}
