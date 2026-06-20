import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Share2,
  Globe,
  Home,
  Briefcase,
  Sparkles,
  Flame,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { EnrichedVacancy, Modalidade } from "@/hooks/useJobVacancies";

const modalidadeIcon = (m: Modalidade) => {
  if (m === "Remoto") return Globe;
  if (m === "Híbrido") return Home;
  return Building2;
};

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function VagaCard({ vaga }: { vaga: EnrichedVacancy }) {
  const ModIcon = vaga.modalidade ? modalidadeIcon(vaga.modalidade) : Briefcase;
  const posted = formatDate(vaga.posted_at) ?? formatDate(vaga.created_at);

  const handleShare = async () => {
    const shareData = {
      title: vaga.title,
      text: `Vaga para musicoterapeutas: ${vaga.title}${vaga.company ? ` na ${vaga.company}` : ""}`,
      url: vaga.url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(vaga.url);
      toast({ title: "Link copiado!", description: "O link da vaga foi copiado." });
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      toast({ title: "Não foi possível compartilhar", variant: "destructive" });
    }
  };

  return (
    <Card className="group flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-0.5 border-border/60">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {vaga.isNew && (
            <Badge className="gap-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">
              <Sparkles className="h-3 w-3" /> Nova
            </Badge>
          )}
          {vaga.isUrgent && (
            <Badge variant="destructive" className="gap-1">
              <Flame className="h-3 w-3" /> Urgente
            </Badge>
          )}
          {vaga.area && <Badge variant="secondary">{vaga.area}</Badge>}
        </div>
        <h3 className="font-semibold leading-snug line-clamp-2">{vaga.title}</h3>
        {vaga.company && (
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{vaga.company}</span>
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-2.5 pb-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {(vaga.city || vaga.uf) && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {[vaga.city, vaga.uf].filter(Boolean).join(" - ")}
            </span>
          )}
          {vaga.modalidade && (
            <span className="flex items-center gap-1.5">
              <ModIcon className="h-3.5 w-3.5 shrink-0" />
              {vaga.modalidade}
            </span>
          )}
          {vaga.contrato && (
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
              {vaga.contrato}
            </span>
          )}
          {posted && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              {posted}
            </span>
          )}
        </div>

        {vaga.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">{vaga.description}</p>
        )}

        {vaga.source && (
          <p className="text-xs text-muted-foreground/70">Fonte: {vaga.source}</p>
        )}
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        <Button
          asChild
          size="sm"
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
        >
          <a href={vaga.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" /> Candidatar-se
          </a>
        </Button>
        <Button size="sm" variant="outline" onClick={handleShare} aria-label="Compartilhar vaga">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
