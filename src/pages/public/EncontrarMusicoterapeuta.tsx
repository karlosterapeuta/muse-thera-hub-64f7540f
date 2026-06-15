import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Search, Crown, Stethoscope, Loader2, BadgeCheck } from "lucide-react";
import { SolicitarAtendimentoDialog } from "@/components/captacao/SolicitarAtendimentoDialog";

interface PublicProfile {
  id: string;
  slug: string;
  full_name: string;
  avatar_url: string | null;
  city: string | null;
  state: string | null;
  attends_online: boolean;
  attends_in_person: boolean;
  accepts_private: boolean;
  plan: string;
  avg_rating: number;
  reviews_count: number;
  professional_specialties: { specialties: { name: string; slug: string } | null }[];
}

const SITE = "https://muse-thera-hub.lovable.app";

export default function EncontrarMusicoterapeuta() {
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [specialties, setSpecialties] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: profData }, { data: specData }] = await Promise.all([
        supabase
          .from("public_profiles" as any)
          .select(
            "id, slug, full_name, avatar_url, city, state, attends_online, attends_in_person, accepts_private, plan, avg_rating, reviews_count, professional_specialties(specialties(name, slug))"
          )
          .eq("is_published", true),
        supabase.from("specialties" as any).select("name, slug").order("name"),
      ]);
      setProfiles((profData as any) ?? []);
      setSpecialties((specData as any) ?? []);
      setLoading(false);
    })();
  }, []);

  const states = useMemo(() => {
    const s = new Set<string>();
    profiles.forEach((p) => p.state && s.add(p.state));
    return Array.from(s).sort();
  }, [profiles]);

  const filtered = useMemo(() => {
    return profiles
      .filter((p) => {
        if (search && !p.full_name.toLowerCase().includes(search.toLowerCase()) && !(p.city ?? "").toLowerCase().includes(search.toLowerCase())) return false;
        if (stateFilter !== "all" && p.state !== stateFilter) return false;
        if (modeFilter === "online" && !p.attends_online) return false;
        if (modeFilter === "presencial" && !p.attends_in_person) return false;
        if (modeFilter === "particular" && !p.accepts_private) return false;
        if (specialtyFilter !== "all" && !p.professional_specialties?.some((ps) => ps.specialties?.slug === specialtyFilter)) return false;
        return true;
      })
      .sort((a, b) => {
        const planRank = (plan: string) => (plan === "premium" ? 2 : plan === "profissional" ? 1 : 0);
        const diff = planRank(b.plan) - planRank(a.plan);
        if (diff !== 0) return diff;
        return Number(b.avg_rating) - Number(a.avg_rating);
      });
  }, [profiles, search, stateFilter, modeFilter, specialtyFilter]);

  const openDialog = (id: string, name: string) => {
    setSelected({ id, name });
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Encontrar Musicoterapeuta | Musetera</title>
        <meta
          name="description"
          content="Encontre musicoterapeutas qualificados no Brasil. Filtre por cidade, especialidade (TEA, TDAH, linguagem) e atendimento online ou presencial."
        />
        <link rel="canonical" href={`${SITE}/encontrar-musicoterapeuta`} />
        <meta property="og:title" content="Encontrar Musicoterapeuta | Musetera" />
        <meta property="og:url" content={`${SITE}/encontrar-musicoterapeuta`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <header className="border-b bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Encontre o Musicoterapeuta ideal
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Conectamos pacientes, responsáveis e escolas a musicoterapeutas qualificados em todo o Brasil.
          </p>
          <Button size="lg" className="mt-6" onClick={() => openDialog("", "")}>
            <Search className="h-4 w-4" /> Solicitar Atendimento
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Nome ou cidade" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estados</SelectItem>
              {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={modeFilter} onValueChange={setModeFilter}>
            <SelectTrigger><SelectValue placeholder="Atendimento" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer modalidade</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="presencial">Presencial</SelectItem>
              <SelectItem value="particular">Particular</SelectItem>
            </SelectContent>
          </Select>
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger><SelectValue placeholder="Especialidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas especialidades</SelectItem>
              {specialties.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Stethoscope className="h-10 w-10 mx-auto mb-3 opacity-50" />
            Nenhum musicoterapeuta encontrado com esses filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <Card key={p.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
                {p.plan === "premium" && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-amber-500 text-white gap-1"><Crown className="h-3 w-3" /> Premium</Badge>
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src={p.avatar_url ?? undefined} />
                      <AvatarFallback>{p.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <Link to={`/profissional/${p.slug}`} className="font-semibold hover:text-primary truncate block">
                        {p.full_name}
                      </Link>
                      {(p.city || p.state) && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {[p.city, p.state].filter(Boolean).join(", ")}
                        </p>
                      )}
                      <p className="text-sm flex items-center gap-1 text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="font-medium">{Number(p.avg_rating).toFixed(1)}</span>
                        <span className="text-muted-foreground">({p.reviews_count})</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-4 min-h-[24px]">
                    {p.professional_specialties?.slice(0, 3).map((ps) =>
                      ps.specialties ? (
                        <Badge key={ps.specialties.slug} variant="secondary" className="text-xs">{ps.specialties.name}</Badge>
                      ) : null
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button asChild variant="outline" className="flex-1"><Link to={`/profissional/${p.slug}`}>Ver perfil</Link></Button>
                    <Button className="flex-1" onClick={() => openDialog(p.id, p.full_name)}>Solicitar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <SolicitarAtendimentoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        preferredProfileId={selected?.id || null}
        preferredProfileName={selected?.name || null}
      />
    </div>
  );
}
