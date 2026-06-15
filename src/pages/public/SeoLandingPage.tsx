import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Loader2, ArrowRight } from "lucide-react";

const SITE = "https://muse-thera-hub.lovable.app";

interface SeoPage {
  slug: string;
  title: string;
  meta_description: string | null;
  h1: string | null;
  body_content: string | null;
  city: string | null;
  specialty_slug: string | null;
}

interface ProfileCard {
  slug: string;
  full_name: string;
  avatar_url: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
}

export default function SeoLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<SeoPage | null>(null);
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("seo_pages" as any)
        .select("slug, title, meta_description, h1, body_content, city, specialty_slug")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const p = data as unknown as SeoPage;
      setPage(p);

      // Load related published professionals (by city when available)
      let query = supabase
        .from("public_profiles" as any)
        .select("slug, full_name, avatar_url, city, state, bio")
        .eq("is_published", true)
        .limit(12);
      if (p.city) query = query.ilike("city", `%${p.city}%`);
      const { data: profs } = await query;
      setProfiles(((profs as unknown as ProfileCard[]) ?? []));
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Página não encontrada</h1>
        <Button asChild>
          <Link to="/encontrar-musicoterapeuta">
            <Search className="h-4 w-4" /> Buscar musicoterapeutas
          </Link>
        </Button>
      </div>
    );
  }

  const url = `${SITE}/musicoterapia/${page.slug}`;

  return (
    <>
      <Helmet>
        <title>{page.title}</title>
        {page.meta_description && <meta name="description" content={page.meta_description} />}
        <link rel="canonical" href={url} />
        <meta property="og:title" content={page.title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        {page.meta_description && <meta property="og:description" content={page.meta_description} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.title,
            description: page.meta_description ?? undefined,
            url,
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-10 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              {page.h1 || page.title}
            </h1>
            {page.meta_description && (
              <p className="text-muted-foreground mt-3 text-lg">{page.meta_description}</p>
            )}
            <Button asChild className="mt-6">
              <Link to="/encontrar-musicoterapeuta">
                <Search className="h-4 w-4" /> Encontrar um musicoterapeuta
              </Link>
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
          {page.body_content && (
            <article className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-line">
              {page.body_content}
            </article>
          )}

          {profiles.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Musicoterapeutas{page.city ? ` em ${page.city}` : ""}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profiles.map((p) => (
                  <Card key={p.slug}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={p.avatar_url ?? undefined} alt={p.full_name} />
                        <AvatarFallback>{p.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/profissional/${p.slug}`}
                          className="font-semibold hover:text-primary truncate block"
                        >
                          {p.full_name}
                        </Link>
                        {(p.city || p.state) && (
                          <Badge variant="outline" className="mt-1">
                            <MapPin className="h-3 w-3" />
                            {[p.city, p.state].filter(Boolean).join(", ")}
                          </Badge>
                        )}
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/profissional/${p.slug}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
