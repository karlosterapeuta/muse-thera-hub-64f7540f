import { ClipboardCheck, FileDown, Loader2, Save, Target, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PtiContent } from "@/types/pti";

interface Props {
  content: PtiContent;
  completion: number;
  patientId: string | null;
  planId?: string;
  saving: boolean;
  downloading: boolean;
  onSave: () => void;
  onExport: () => void;
  onReevaluate: () => void;
}

export function PtiReportStep({
  content, completion, patientId, planId, saving, downloading, onSave, onExport, onReevaluate,
}: Props) {
  const identity = content.identificacao;
  return (
    <div className="space-y-4">
      <Card className="border-primary/25 bg-primary/[0.04]">
        <CardContent className="space-y-4 p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <ClipboardCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Revisão final do PTI MuseTera</h3>
              <p className="text-sm text-muted-foreground">Confira o conteúdo antes de emitir o documento. A exportação registra uma versão no histórico.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryStat label="Paciente" value={identity.nome || "Não selecionado"} />
            <SummaryStat label="Profissional" value={identity.profissional || "Não informado"} />
            <SummaryStat label="Objetivos / metas" value={`${content.objetivosEspecificos.length} / ${content.metas.length}`} />
            <SummaryStat label="Preenchimento" value={`${completion}%`} />
          </div>
          <p className="rounded-lg border border-amber-300/40 bg-amber-500/5 p-3 text-sm text-muted-foreground">
            Revise informações clínicas, objetivos e metas. Dados ausentes não devem ser inventados. Somente o profissional pode aprovar o conteúdo.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onExport} disabled={downloading || saving || !patientId || !identity.nome.trim()} className="gap-2">
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />} Salvar versão e gerar PDF
            </Button>
            <Button onClick={onSave} disabled={saving || !patientId} variant="outline" className="gap-2">
              <Save className="h-4 w-4" /> Salvar plano
            </Button>
          </div>
          {!patientId && <p role="alert" className="text-sm text-amber-600">Selecione um paciente antes de emitir o PTI.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" /><h3 className="font-semibold">Objetivos cadastrados</h3></div>
          {content.objetivosEspecificos.length === 0
            ? <p className="text-sm text-muted-foreground">Nenhum objetivo cadastrado.</p>
            : content.objetivosEspecificos.map((item) =>
              <p key={item.id} className="rounded-lg border bg-muted/30 p-3 text-sm">{item.descricao || "Objetivo sem descrição"}</p>)}
          <p className="text-xs text-muted-foreground">{content.metas.length} meta(s) terapêutica(s) definida(s).</p>
        </CardContent>
      </Card>
      {planId && <Button variant="outline" className="gap-2" onClick={onReevaluate}>
        <CalendarClock className="h-4 w-4" /> Abrir reavaliação e acompanhamento
      </Button>}
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold">{value}</p>
    </div>
  );
}
