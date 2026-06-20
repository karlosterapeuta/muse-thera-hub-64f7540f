// Admin-only control panel for the automated WhatsApp vacancy engine.
// Lets the admin run a search, review the queue, approve/reject and dispatch.
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Send,
  Check,
  X,
  ExternalLink,
  Loader2,
  Sparkles,
  RefreshCw,
  Users,
} from "lucide-react";

const CARD_STYLE =
  "border-cyan-500/20 bg-gradient-to-b from-cyan-500/[0.03] to-transparent backdrop-blur-sm overflow-hidden";

type Status = "pending" | "approved" | "rejected" | "sent" | "expired";

interface Vacancy {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  url: string;
  source: string | null;
  description: string | null;
  status: Status;
  relevance_score: number | null;
  created_at: string;
}

async function invokeFunction(name: string, body?: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke(name, { body: body ?? {} });
  if (error) throw error;
  return data;
}

const STATUS_TABS: { key: Status; label: string }[] = [
  { key: "pending", label: "Pendentes" },
  { key: "approved", label: "Aprovadas" },
  { key: "sent", label: "Enviadas" },
  { key: "rejected", label: "Rejeitadas" },
];

export default function VagasAdminPanel() {
  const { data: isAdmin } = useAdmin();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Status>("pending");
  const [groups, setGroups] = useState<{ id: string; subject: string; size: number | null }[]>([]);

  const { data: settings } = useQuery({
    queryKey: ["vagas_settings"],
    enabled: !!isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vagas_settings")
        .select("id, whatsapp_group_url")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const listGroupsMutation = useMutation({
    mutationFn: () => invokeFunction("vagas-dispatch", { action: "list_groups" }),
    onSuccess: (data: { groups?: { id: string; subject: string; size: number | null }[] }) => {
      setGroups(data?.groups ?? []);
      toast({ title: "Grupos carregados", description: `${data?.groups?.length ?? 0} grupo(s) encontrado(s).` });
    },
    onError: (e: Error) => toast({ title: "Erro ao listar grupos", description: e.message, variant: "destructive" }),
  });

  const setGroupMutation = useMutation({
    mutationFn: async (jid: string) => {
      if (!settings?.id) throw new Error("Configurações não encontradas");
      const { error } = await supabase
        .from("vagas_settings")
        .update({ whatsapp_group_url: jid })
        .eq("id", settings.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Grupo definido", description: "Vagas serão enviadas para este grupo." });
      queryClient.invalidateQueries({ queryKey: ["vagas_settings"] });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });


  const { data: vacancies, isLoading } = useQuery({
    queryKey: ["job_vacancies", tab],
    enabled: !!isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_vacancies")
        .select("id, title, company, location, url, source, description, status, relevance_score, created_at")
        .eq("status", tab)
        .order("relevance_score", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as Vacancy[];
    },
  });

  const searchMutation = useMutation({
    mutationFn: () => invokeFunction("vagas-search"),
    onSuccess: (data: { inserted?: number }) => {
      toast({ title: "Busca concluída", description: `${data?.inserted ?? 0} nova(s) vaga(s) encontrada(s).` });
      queryClient.invalidateQueries({ queryKey: ["job_vacancies"] });
    },
    onError: (e: Error) => toast({ title: "Erro na busca", description: e.message, variant: "destructive" }),
  });

  const dispatchMutation = useMutation({
    mutationFn: () => invokeFunction("vagas-dispatch", { force: true }),
    onSuccess: (data: { sent?: number; outbound_configured?: boolean }) => {
      if (data?.outbound_configured === false) {
        toast({
          title: "Canal de envio não configurado",
          description: "Defina o endpoint WHATSAPP_OUTBOUND_URL para envio automático ao grupo.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Envio concluído", description: `${data?.sent ?? 0} vaga(s) enviada(s) ao grupo.` });
      }
      queryClient.invalidateQueries({ queryKey: ["job_vacancies"] });
    },
    onError: (e: Error) => toast({ title: "Erro no envio", description: e.message, variant: "destructive" }),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("job_vacancies").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["job_vacancies"] }),
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  if (!isAdmin) return null;

  return (
    <Card className={`mt-6 ${CARD_STYLE}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-cyan-500" />
          Robô de Divulgação de Vagas (Admin)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Busca automática, validação e envio de vagas para o grupo do WhatsApp.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => searchMutation.mutate()}
            disabled={searchMutation.isPending}
            className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
          >
            {searchMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Buscar novas vagas
          </Button>
          <Button
            onClick={() => dispatchMutation.mutate()}
            disabled={dispatchMutation.isPending}
            variant="outline"
            className="gap-2 border-cyan-500/30"
          >
            {dispatchMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Enviar agora ao grupo
          </Button>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["job_vacancies"] })}
            variant="ghost"
            size="icon"
            aria-label="Atualizar lista"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.03] p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users className="h-4 w-4 text-cyan-500" />
            Grupo de destino (WhatsApp)
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {settings?.whatsapp_group_url?.endsWith("@g.us")
              ? `Grupo configurado: ${settings.whatsapp_group_url}`
              : "Nenhum grupo selecionado. Liste os grupos e escolha um."}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-cyan-500/30"
              onClick={() => listGroupsMutation.mutate()}
              disabled={listGroupsMutation.isPending}
            >
              {listGroupsMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              Listar grupos
            </Button>
            {groups.length > 0 && (
              <Select
                onValueChange={(jid) => setGroupMutation.mutate(jid)}
                defaultValue={
                  settings?.whatsapp_group_url?.endsWith("@g.us")
                    ? settings.whatsapp_group_url
                    : undefined
                }
              >
                <SelectTrigger className="h-9 w-[260px] border-cyan-500/30 text-xs">
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id} className="text-xs">
                      {g.subject}
                      {g.size ? ` (${g.size})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>


          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                tab === t.key
                  ? "bg-cyan-500 text-white"
                  : "bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
          </div>
        ) : !vacancies || vacancies.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma vaga nesta categoria.</p>
        ) : (
          <ul className="space-y-2">
            {vacancies.map((v) => (
              <li
                key={v.id}
                className="rounded-xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/[0.03] to-transparent p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{v.title}</span>
                      {typeof v.relevance_score === "number" && (
                        <Badge variant="secondary" className="shrink-0 text-[10px]">
                          {v.relevance_score}%
                        </Badge>
                      )}
                    </div>
                    {v.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{v.description}</p>
                    )}
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-cyan-600 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {v.source ?? "ver vaga"}
                    </a>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {tab !== "approved" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-green-600 hover:bg-green-500/10"
                        onClick={() => updateStatus.mutate({ id: v.id, status: "approved" })}
                        aria-label="Aprovar"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {tab !== "rejected" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:bg-red-500/10"
                        onClick={() => updateStatus.mutate({ id: v.id, status: "rejected" })}
                        aria-label="Rejeitar"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
