import { valorPorExtenso } from "@/utils/numberToWords";
import { maskCPF, maskCNPJ, onlyDigits } from "@/utils/cpfCnpjUtils";
import type { ReceiptIssuerProfile } from "@/hooks/useReceiptIssuerProfile";

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
  return (
    <div className="rounded-xl border border-border bg-card/40 backdrop-blur p-4 text-xs leading-relaxed">
      <div className="bg-gradient-to-r from-primary to-amber-500 -m-4 mb-4 p-3 rounded-t-xl text-white">
        <div className="flex items-center justify-between">
          <div className="font-bold text-sm">RECIBO DE PAGAMENTO</div>
          <div className="text-[10px] opacity-90">Pré-visualização ao vivo</div>
        </div>
      </div>

      <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 mb-3">
        <div className="text-[10px] uppercase text-muted-foreground">Valor recebido</div>
        <div className="text-xl font-bold text-primary">{fmtBRL(p.amount)}</div>
        <div className="text-[10px] text-muted-foreground italic mt-1">
          ({p.amount > 0 ? valorPorExtenso(p.amount) : "—"})
        </div>
      </div>

      <SectionTitle>Emissor (recebedor)</SectionTitle>
      <div>
        {p.issuer?.legal_name || <Placeholder>Configure seu perfil</Placeholder>}
        {p.issuer?.trade_name && ` (${p.issuer.trade_name})`}
      </div>
      {p.issuer?.document_number && (
        <div className="text-muted-foreground">{docType.toUpperCase()}: {maskDoc(p.issuer.document_number)}</div>
      )}
      {p.issuer?.address && <div className="text-muted-foreground">{p.issuer.address}</div>}

      <SectionTitle>Pagador</SectionTitle>
      <div>{p.patientName || <Placeholder>Nome do pagador</Placeholder>}</div>
      {p.patientDocument && <div className="text-muted-foreground">Documento: {maskDoc(p.patientDocument)}</div>}

      <SectionTitle>Referente a</SectionTitle>
      <div>{p.serviceDescription || <Placeholder>Descrição do serviço</Placeholder>}</div>
      <div className="text-muted-foreground mt-1">
        Forma: {p.paymentMethod?.toUpperCase()} · Data: {fmtDate(p.paymentDate)}
      </div>

      {p.observations && (
        <>
          <SectionTitle>Observações</SectionTitle>
          <div className="text-muted-foreground whitespace-pre-wrap">{p.observations}</div>
        </>
      )}

      <div className="mt-4 pt-3 border-t border-border text-center text-muted-foreground">
        {(p.city || p.issuer?.city) || "_________"}, {fmtDate(p.paymentDate) || "____"}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="mt-3 mb-1 text-[10px] font-bold uppercase text-primary/80 tracking-wider">{children}</div>;
}
function Placeholder({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground italic">{children}</span>;
}
function issuerDocType(i?: ReceiptIssuerProfile | null) {
  return i?.document_type || "cpf";
}
