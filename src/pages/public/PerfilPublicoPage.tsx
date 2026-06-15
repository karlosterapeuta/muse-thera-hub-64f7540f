import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin, Star, Crown, GraduationCap, Stethoscope, Globe, Instagram,
  MessageCircle, Loader2, ArrowLeft, ShieldCheck, BadgeCheck,
} from "lucide-react";
import { SolicitarAtendimentoDialog } from "@/components/captacao/SolicitarAtendimentoDialog";

const SITE = "https://muse-thera-hub.lovable.app";

export default function PerfilPublicoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("public_profiles" as any)
        .select(
          "*, professional_specialties(specialties(name, slug)), professional_insurances(insurance_providers(name, slug))"
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      setProfile(data);
      if (data) {
        const { data: rev } = await supabase
          .from("reviews" as any)
          .select("*")
          .eq("profile_id", (data as any).id)
          .eq("is_approved", true)
          .order("created_at", { ascending: false });
        setReviews((rev as any) ?? []);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <Stethoscope className="h-12 w-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Perfil não encontrado</h1>
        <Button asChild variant="outline"><Link to="/encontrar-musicoterapeuta"><ArrowLeft className="h-4 w-4" /> Buscar profissionais</Link></Button>
      </div>
    );
  }

  const specialties: string[] = (profile.professional_specialties ?? []).map((s: any) => s.specialties?.name).filter(Boolean);
  const insurances: string[] = (profile.professional_insurances ?? []).map((i: any) => i.insurance_providers?.name).filter(Boolean);
  const location = [profile.city, profile.state].filter(Boolean).join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name,
    jobTitle: "Musicoterapeuta",
    address: location ? { "@type": "PostalAddress", addressLocality: profile.city, addressRegion: profile.state } : undefined,
    aggregateRating: profile.reviews_count > 0 ? { "@type": "AggregateRating", ratingValue: Number(profile.avg_rating).toFixed(1), reviewCount: profile.reviews_count } : undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${profile.full_name} — Musicoterapeuta${location ? " em " + location : ""} | Musetera`}</title>
        <meta name="description" content={(profile.bio || `Conheça ${profile.full_name}, musicoterapeuta${location ? " em " + location : ""}. Agende um atendimento.`).slice(0, 155)} />
        <link rel="canonical" href={`${SITE}/profissional/${profile.slug}`} />
        <meta property="og:title" content={`${profile.full_name} — Musicoterapeuta`} />
        <meta property="og:url" content={`${SITE}/profissional/${profile.slug}`} />
        <meta property="og:type" content="profile" />
        {profile.avatar_url && <meta property="og:image" content={profile.avatar_url} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/encontrar-musicoterapeuta"><ArrowLeft className="h-4 w-4" /> Voltar à busca</Link>
        </Button>

        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5" />
          <CardContent className="p-6 -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={profile.avatar_url ?? undefined} />
                <AvatarFallback className="text-2xl">{profile.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                  {profile.plan === "premium" && <Badge className="bg-amber-500 text-white gap-1"><Crown className="h-3 w-3" /> Premium</Badge>}
                </div>
                {location && <p className="text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-4 w-4" /> {location}</p>}
                {profile.professional_registration && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><ShieldCheck className="h-3.5 w-3.5" /> {profile.professional_registration}</p>
                )}
                <p className="flex items-center gap-1 text-amber-500 mt-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold">{Number(profile.avg_rating).toFixed(1)}</span>
                  <span className="text-muted-foreground text-sm">({profile.reviews_count} avaliações)</span>
                </p>
              </div>
              <Button size="lg" onClick={() => setDialogOpen(true)}>Solicitar Atendimento</Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {profile.attends_online && <Badge variant="secondary">Atende Online</Badge>}
              {profile.attends_in_person && <Badge variant="secondary">Atende Presencial</Badge>}
              {profile.accepts_private && <Badge variant="secondary">Particular</Badge>}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 space-y-4">
            {profile.bio && (
              <Card><CardHeader><CardTitle className="text-lg">Sobre</CardTitle></CardHeader>
                <CardContent className="text-muted-foreground whitespace-pre-line">{profile.bio}</CardContent></Card>
            )}
            {(profile.education || profile.postgraduate) && (
              <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Formação</CardTitle></CardHeader>
                <CardContent className="text-muted-foreground space-y-2">
                  {profile.education && <p>{profile.education}</p>}
                  {profile.postgraduate && <p className="text-sm">Pós-graduação: {profile.postgraduate}</p>}
                </CardContent></Card>
            )}
            <Card><CardHeader><CardTitle className="text-lg">Avaliações</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Ainda não há avaliações.</p>
                ) : reviews.map((r) => (
                  <div key={r.id} className="border-b last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{r.reviewer_name || "Paciente"}</span>
                      <span className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-current" : "opacity-30"}`} />)}
                      </span>
                    </div>
                    {r.comment && <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>}
                  </div>
                ))}
              </CardContent></Card>
          </div>

          <div className="space-y-4">
            {specialties.length > 0 && (
              <Card><CardHeader><CardTitle className="text-base">Especialidades</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {specialties.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                </CardContent></Card>
            )}
            {insurances.length > 0 && (
              <Card><CardHeader><CardTitle className="text-base">Convênios</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {insurances.map((i) => <Badge key={i} variant="outline">{i}</Badge>)}
                </CardContent></Card>
            )}
            {(profile.whatsapp || profile.instagram || profile.website) && (
              <Card><CardHeader><CardTitle className="text-base">Contato</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {profile.whatsapp && <a href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-primary"><MessageCircle className="h-4 w-4" /> WhatsApp</a>}
                  {profile.instagram && <a href={`https://instagram.com/${profile.instagram.replace("@", "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-primary"><Instagram className="h-4 w-4" /> {profile.instagram}</a>}
                  {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-primary"><Globe className="h-4 w-4" /> Site</a>}
                </CardContent></Card>
            )}
          </div>
        </div>
      </div>

      <SolicitarAtendimentoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        preferredProfileId={profile.id}
        preferredProfileName={profile.full_name}
      />
    </div>
  );
}
