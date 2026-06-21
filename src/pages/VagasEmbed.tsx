import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Share2, RefreshCw, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import { useJobVacancies } from "@/hooks/useJobVacancies";
import { VagaCard } from "@/components/vagas/VagaCard";
import {
  VagasFilters,
  EMPTY_FILTERS,
  type VagasFilterState,
} from "@/components/vagas/VagasFilters";
const MUSETERA_LOGO = "/lovable-uploads/musetera-logo-new.png";

const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function VagasEmbed() {
  const isMobile = useIsMobile();
  const { vacancies, loading, newCount, reload } = useJobVacancies();
  const [filters, setFilters] = useState<VagasFilterState>(EMPTY_FILTERS);

  const availableUfs = useMemo(
    () => Array.from(new Set(vacancies.map((v) => v.uf).filter(Boolean) as string[])),
    [vacancies]
  );

  const filtered = useMemo(() => {
    const term = norm(filters.search.trim());
    return vacancies.filter((v) => {
      if (filters.uf !== "all" && v.uf !== filters.uf) return false;
      if (filters.modalidade !== "all" && v.modalidade !== filters.modalidade) return false;
      if (filters.contrato !== "all" && v.contrato !== filters.contrato) return false;
      if (filters.area !== "all" && v.area !== filters.area) return false;
      if (term) {
        const blob = norm(
          `${v.title} ${v.company ?? ""} ${v.location ?? ""} ${v.description ?? ""} ${v.source ?? ""}`
        );
        if (!blob.includes(term)) return false;
      }
      return true;
    });
  }, [vacancies, filters]);

  const handleShare = async () => {
    const shareData = {
      title: "💼 Vagas MuseTera",
      text: "Confira as oportunidades para musicoterapeutas no Vagas MuseTera!",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(shareData.url);
      toast({ title: "Link copiado!", description: "O link das vagas foi copiado." });
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return;
      toast({ title: "Não foi possível compartilhar", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className={`container mx-auto px-4 ${isMobile ? "py-4" : "py-6"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={museteraLogo.url}
              alt="Logotipo MuseTera"
              width={48}
              height={48}
              loading="lazy"
              className={`${isMobile ? "h-10 w-10" : "h-12 w-12"} drop-shadow-lg`}
            />
            <div>
              <h1
                className={`${isMobile ? "text-xl" : "text-3xl"} font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent`}
              >
                💼 Vagas para Musicoterapeutas
              </h1>
              <p className={`text-muted-foreground mt-1 ${isMobile ? "text-xs" : "text-sm"}`}>
                Quadro inteligente de oportunidades reais em todo o Brasil
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={reload} size={isMobile ? "sm" : "default"} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              {!isMobile && "Atualizar"}
            </Button>
            <Button
              onClick={handleShare}
              size={isMobile ? "sm" : "default"}
              className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-md"
            >
              <Share2 className="h-4 w-4" />
              {!isMobile && "Compartilhar"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-10 space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {filtered.length} {filtered.length === 1 ? "vaga" : "vagas"}
          </Badge>
          {newCount > 0 && (
            <Badge className="gap-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">
              <Sparkles className="h-3 w-3" /> {newCount} nova{newCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <VagasFilters filters={filters} onChange={setFilters} availableUfs={availableUfs} />

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center space-y-4 py-16">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold text-muted-foreground">
              {vacancies.length === 0
                ? "Nenhuma vaga publicada ainda"
                : "Nenhuma vaga corresponde aos filtros"}
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {vacancies.length === 0
                ? "Novas oportunidades para musicoterapeutas aparecerão aqui automaticamente assim que forem encontradas e aprovadas."
                : "Tente ajustar ou limpar os filtros para ver mais resultados."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((vaga) => (
              <VagaCard key={vaga.id} vaga={vaga} />
            ))}
          </div>
        )}
      </main>

      <footer className="w-full py-6 mt-8 border-t bg-gradient-to-r from-cyan-500/5 to-blue-600/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src={museteraLogo.url}
              alt="MuseTera"
              width={32}
              height={32}
              loading="lazy"
              className="h-8 w-8 drop-shadow-md"
            />
            <div className="text-sm">
              <div className="font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Sistema MuseTera
              </div>
              <div className="text-xs text-muted-foreground">
                Plataforma Especializada em Musicoterapia
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            © 2025 MuseTera • Desenvolvido para Musicoterapeutas Profissionais
          </div>
        </div>
      </footer>
    </div>
  );
}
