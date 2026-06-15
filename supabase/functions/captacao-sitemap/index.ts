import { createClient } from "npm:@supabase/supabase-js@2";

const SITE = "https://muse-thera-hub.lovable.app";

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const urls: { loc: string; priority: string }[] = [
    { loc: `${SITE}/encontrar-musicoterapeuta`, priority: "0.9" },
  ];

  const [{ data: profiles }, { data: pages }] = await Promise.all([
    supabase.from("public_profiles").select("slug, updated_at").eq("is_published", true),
    supabase.from("seo_pages").select("slug, updated_at").eq("is_published", true),
  ]);

  for (const p of profiles ?? []) {
    urls.push({ loc: `${SITE}/profissional/${(p as any).slug}`, priority: "0.7" });
  }
  for (const p of pages ?? []) {
    urls.push({ loc: `${SITE}/musicoterapia/${(p as any).slug}`, priority: "0.6" });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
