import { changedClinicalFields, clinicalFieldLabel, formatClinicalRevisionValue } from "../utils/clinicalRevisionPresentation";

type Revision = {
  id: string;
  changed_at: string;
  event: string;
  old_snapshot: Record<string, unknown> | null;
  new_snapshot: Record<string, unknown>;
};

type Props = {
  revisions: Revision[];
  loading: boolean;
  error: string;
};

export function ClinicalRevisionHistory({ revisions, loading, error }: Props) {
  return <div className="mt-4 space-y-3 border-t border-border pt-4" role="region" aria-label="Histórico de revisões">
    <h3 className="font-semibold text-foreground">Revisões da anamnese</h3>
    {loading && <p role="status" className="text-sm text-muted-foreground">Carregando histórico...</p>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {!loading && !error && revisions.length === 0 &&
      <p className="text-sm text-muted-foreground">Nenhuma revisão encontrada para este documento.</p>}
    {!loading && !error && revisions.map(revision => {
      const changed = changedClinicalFields(revision.old_snapshot, revision.new_snapshot);
      const date = new Date(revision.changed_at);
      const when = Number.isNaN(date.getTime()) ? "Data indisponível" : date.toLocaleString("pt-BR");
      return <details key={revision.id} className="rounded-xl border border-border bg-muted/10 p-3">
        <summary className="cursor-pointer rounded-md py-1 text-sm font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          {when} · {revision.event === "created" ? "Registro criado" : "Registro atualizado"} · {changed.length} campo(s) com alteração
        </summary>
        <div className="mt-3 space-y-3">
          {changed.length ? changed.map(key => <div key={key} className="rounded-lg border border-border bg-background p-3">
            <p className="mb-2 text-sm font-bold text-primary">{clinicalFieldLabel(key)}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><p className="text-xs font-semibold text-muted-foreground">Anterior</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">{formatClinicalRevisionValue(revision.old_snapshot?.[key])}</p></div>
              <div><p className="text-xs font-semibold text-muted-foreground">Atual</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">{formatClinicalRevisionValue(revision.new_snapshot[key])}</p></div>
            </div>
          </div>) : <p className="text-sm text-muted-foreground">Somente metadados administrativos foram modificados.</p>}
        </div>
      </details>;
    })}
  </div>;
}
