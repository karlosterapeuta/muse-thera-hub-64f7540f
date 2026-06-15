import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Check, Crown, Star, Gift, Sparkles } from "lucide-react";

type PlanKey = "gratuito" | "profissional" | "premium";

const PLANS: {
  key: PlanKey;
  name: string;
  price: string;
  period: string;
  icon: any;
  accent: string;
  highlight?: boolean;
  features: string[];
}[] = [
  {
    key: "gratuito",
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    icon: Gift,
    accent: "text-muted-foreground",
    features: [
      "Perfil público básico",
      "Aparece na busca de pacientes",
      "Até 3 leads por mês",
      "1 especialidade em destaque",
    ],
  },
  {
    key: "profissional",
    name: "Profissional",
    price: "R$ 39",
    period: "/mês",
    icon: Star,
    accent: "text-primary",
    highlight: true,
    features: [
      "Tudo do Gratuito",
      "Leads ilimitados",
      "Prioridade na busca pública",
      "Todas as especialidades e convênios",
      "Estatísticas de conversão",
      "Selo verificado",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    price: "R$ 79",
    period: "/mês",
    icon: Crown,
    accent: "text-amber-500",
    features: [
      "Tudo do Profissional",
      "Destaque máximo (topo da busca)",
      "Página de SEO personalizada",
      "Matching prioritário com IA",
      "Suporte dedicado",
    ],
  },
];

export default function PlanosTab() {
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<PlanKey>("gratuito");

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from("public_profiles" as any)
      .select("plan").eq("user_id", user.id).maybeSingle();
    if (data && (data as any).plan) setCurrent((data as any).plan as PlanKey);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const choose = (key: PlanKey) => {
    if (key === current) return;
    if (key === "gratuito") {
      toast.info("Você já tem acesso aos recursos gratuitos.");
      return;
    }
    toast.info("Em breve! Os planos pagos estarão disponíveis para contratação.");
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <Sparkles className="h-7 w-7 text-primary mx-auto mb-2" />
        <h2 className="text-xl font-bold">Aumente sua visibilidade e receba mais pacientes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Escolha o plano ideal para destacar seu perfil na busca pública de musicoterapeutas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((p) => {
          const isCurrent = p.key === current;
          return (
            <Card
              key={p.key}
              className={`relative flex flex-col ${p.highlight ? "border-primary shadow-lg shadow-primary/10" : ""}`}
            >
              {p.highlight && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">Mais popular</Badge>
              )}
              <CardHeader className="text-center pb-2">
                <p.icon className={`h-7 w-7 mx-auto mb-2 ${p.accent}`} />
                <CardTitle className="text-lg">{p.name}</CardTitle>
                <div className="mt-1">
                  <span className="text-3xl font-bold">{p.price}</span>
                  <span className="text-sm text-muted-foreground"> {p.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-4">
                <ul className="space-y-2 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={isCurrent ? "outline" : p.highlight ? "default" : "secondary"}
                  disabled={isCurrent}
                  onClick={() => choose(p.key)}
                  className="w-full"
                >
                  {isCurrent ? "Plano atual" : "Selecionar"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
