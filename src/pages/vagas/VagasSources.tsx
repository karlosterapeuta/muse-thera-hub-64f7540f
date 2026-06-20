import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, ChevronDown, Linkedin, Search, Instagram, Globe, Facebook } from "lucide-react";
import {
  vagaCategories,
  stateSourcesByRegion,
  clinicsByCapital,
} from "@/data/vagas-sources";

// Estilo padrão unificado de card para toda a página de Vagas
const CARD_STYLE =
  "border-cyan-500/20 bg-gradient-to-b from-cyan-500/[0.03] to-transparent backdrop-blur-sm overflow-hidden";
// Estilo padrão para sub-cards internos (estados, clínicas)
const SUBCARD_STYLE =
  "rounded-xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/[0.03] to-transparent p-4";

export default function VagasSources() {
  const [openRegion, setOpenRegion] = useState<string | null>("Sudeste");

  return (
    <section className="mt-8 space-y-6">
      {/* Section heading */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          Mais Fontes de Vagas
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Diretório curado de oportunidades para musicoterapeutas em todo o Brasil —
          portais nacionais, clínicas de TEA e redes sociais.
        </p>
      </div>

      {/* Category grids */}
      <div className="grid gap-5 md:grid-cols-3">
        {vagaCategories.map((cat) => (
          <Card
            key={cat.id}
            className="border-cyan-500/20 bg-gradient-to-b from-cyan-500/[0.03] to-transparent backdrop-blur-sm overflow-hidden"
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{cat.emoji}</span>
                <h3 className="font-semibold text-base">{cat.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{cat.description}</p>
              <ul className="space-y-2">
                {cat.sources.map((src) => (
                  <li key={src.name}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2 rounded-lg p-2 -mx-2 hover:bg-cyan-500/10 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mt-0.5 text-cyan-500 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-foreground group-hover:text-cyan-500 transition-colors">
                          {src.name}
                        </span>
                        <span className="block text-xs text-muted-foreground leading-snug">
                          {src.description}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Per-state search */}
      <Card className="border-cyan-500/20">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-5 w-5 text-cyan-500" />
            <h3 className="font-semibold text-base">Busca por Estado</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Vagas filtradas por estado no LinkedIn, Indeed e clínicas de TEA. Toque numa
            região para expandir.
          </p>

          <div className="space-y-3">
            {stateSourcesByRegion.map(({ region, states }) => {
              const isOpen = openRegion === region;
              return (
                <div
                  key={region}
                  className="rounded-xl border border-border/60 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenRegion(isOpen ? null : region)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium text-sm">
                      <Badge
                        variant="outline"
                        className="border-cyan-500/40 text-cyan-500"
                      >
                        {states.length}
                      </Badge>
                      Região {region}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
                      {states.map((st) => (
                        <div
                          key={st.uf}
                          className="rounded-lg border border-border/50 bg-card p-3"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center justify-center h-6 px-1.5 rounded bg-cyan-500/10 text-[11px] font-bold text-cyan-500">
                              {st.uf}
                            </span>
                            <span className="text-sm font-medium truncate">
                              {st.name}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px] gap-1"
                            >
                              <a href={st.linkedin} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="h-3 w-3" /> LinkedIn
                              </a>
                            </Button>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px] gap-1"
                            >
                              <a href={st.indeed} target="_blank" rel="noopener noreferrer">
                                <Search className="h-3 w-3" /> Indeed
                              </a>
                            </Button>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px] gap-1"
                            >
                              <a href={st.instagram} target="_blank" rel="noopener noreferrer">
                                <Instagram className="h-3 w-3" /> TEA
                              </a>
                            </Button>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px] gap-1"
                            >
                              <a href={st.google} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-3 w-3" /> Google
                              </a>
                            </Button>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px] gap-1"
                            >
                              <a href={st.facebook} target="_blank" rel="noopener noreferrer">
                                <Facebook className="h-3 w-3" /> Facebook
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Clinics by capital */}
      <Card className="border-cyan-500/20">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-5 w-5 text-cyan-500" />
            <h3 className="font-semibold text-base">Clínicas de TEA por Capital</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Redes e clínicas de autismo das maiores capitais com páginas de carreira
            ou recrutamento ativo.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {clinicsByCapital.map((capital) => (
              <div
                key={capital.city}
                className="rounded-xl border border-border/50 bg-card p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center h-6 px-1.5 rounded bg-cyan-500/10 text-[11px] font-bold text-cyan-500">
                    {capital.uf}
                  </span>
                  <span className="text-sm font-semibold">{capital.city}</span>
                </div>
                <ul className="space-y-2">
                  {capital.clinics.map((clinic) => (
                    <li key={clinic.name}>
                      <a
                        href={clinic.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-2 rounded-lg p-2 -mx-2 hover:bg-cyan-500/10 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mt-0.5 text-cyan-500 shrink-0" />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-foreground group-hover:text-cyan-500 transition-colors">
                            {clinic.name}
                          </span>
                          <span className="block text-xs text-muted-foreground leading-snug">
                            {clinic.description}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
