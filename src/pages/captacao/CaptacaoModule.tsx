import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  UserCircle, Inbox, BarChart3, Loader2, ExternalLink, Save, TrendingUp, Target, CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/hooks/use-admin";
import { Shield } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo Lead",
  contatado: "Contatado",
  avaliacao_agendada: "Avaliação Agendada",
  em_atendimento: "Em Atendimento",
  convertido: "Convertido",
  perdido: "Perdido",
};

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export default function CaptacaoModule() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "perfil";
  const { data: isAdmin } = useAdmin();

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">📌 Captação de Pacientes</h1>
        <p className="text-muted-foreground text-sm">Gerencie seu perfil público, leads recebidos e estatísticas.</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setParams({ tab: v })}>
        <TabsList className={`grid ${isAdmin ? "grid-cols-4" : "grid-cols-3"} w-full sm:w-auto`}>
          <TabsTrigger value="perfil"><UserCircle className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Meu Perfil</span></TabsTrigger>
          <TabsTrigger value="leads"><Inbox className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Leads</span></TabsTrigger>
          <TabsTrigger value="stats"><BarChart3 className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Estatísticas</span></TabsTrigger>
          {isAdmin && <TabsTrigger value="admin"><Shield className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Admin</span></TabsTrigger>}
        </TabsList>

        <TabsContent value="perfil" className="mt-6"><PerfilTab /></TabsContent>
        <TabsContent value="leads" className="mt-6"><LeadsTab /></TabsContent>
        <TabsContent value="stats" className="mt-6"><StatsTab /></TabsContent>
        {isAdmin && <TabsContent value="admin" className="mt-6"><AdminTab /></TabsContent>}
      </Tabs>
    </div>
  );
}


function PerfilTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [selSpecs, setSelSpecs] = useState<Set<string>>(new Set());
  const [selIns, setSelIns] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const [{ data: prof }, { data: specs }, { data: ins }] = await Promise.all([
      supabase.from("public_profiles" as any).select("*, professional_specialties(specialty_id), professional_insurances(insurance_id)").eq("user_id", user.id).maybeSingle(),
      supabase.from("specialties" as any).select("*").order("name"),
      supabase.from("insurance_providers" as any).select("*").order("name"),
    ]);
    setSpecialties((specs as any) ?? []);
    setInsurances((ins as any) ?? []);
    if (prof) {
      setProfile(prof);
      setSelSpecs(new Set(((prof as any).professional_specialties ?? []).map((s: any) => s.specialty_id)));
      setSelIns(new Set(((prof as any).professional_insurances ?? []).map((i: any) => i.insurance_id)));
    } else {
      const { data: { user: u } } = await supabase.auth.getUser();
      setProfile({ user_id: u?.id, full_name: u?.user_metadata?.name || "", slug: "", is_published: false, plan: "gratuito", attends_online: true, attends_in_person: false, accepts_private: true });
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: any) => setProfile((p: any) => ({ ...p, [k]: v }));
  const toggle = (setFn: any, set: Set<string>, id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setFn(next);
  };

  const save = async () => {
    if (!profile.full_name?.trim()) { toast.error("Informe seu nome completo."); return; }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const slug = profile.slug?.trim() || `${slugify(profile.full_name)}-${(user!.id).slice(0, 6)}`;
      const payload = {
        user_id: user!.id, slug,
        full_name: profile.full_name, avatar_url: profile.avatar_url ?? null,
        city: profile.city ?? null, state: profile.state ?? null,
        professional_registration: profile.professional_registration ?? null,
        bio: profile.bio ?? null, education: profile.education ?? null,
        postgraduate: profile.postgraduate ?? null, target_audience: profile.target_audience ?? null,
        attends_online: !!profile.attends_online, attends_in_person: !!profile.attends_in_person,
        accepts_private: !!profile.accepts_private, whatsapp: profile.whatsapp ?? null,
        instagram: profile.instagram ?? null, website: profile.website ?? null,
        years_experience: profile.years_experience ? Number(profile.years_experience) : 0,
        is_published: !!profile.is_published,
      };
      const { data: saved, error } = await supabase.from("public_profiles" as any)
        .upsert(payload, { onConflict: "user_id" }).select().single();
      if (error) throw error;
      const profileId = (saved as any).id;
      await supabase.from("professional_specialties" as any).delete().eq("profile_id", profileId);
      await supabase.from("professional_insurances" as any).delete().eq("profile_id", profileId);
      if (selSpecs.size) await supabase.from("professional_specialties" as any).insert(Array.from(selSpecs).map((id) => ({ profile_id: profileId, specialty_id: id })));
      if (selIns.size) await supabase.from("professional_insurances" as any).insert(Array.from(selIns).map((id) => ({ profile_id: profileId, insurance_id: id })));
      toast.success("Perfil público salvo!");
      load();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message?.includes("duplicate") ? "Esse link de perfil já está em uso." : "Erro ao salvar o perfil.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Dados do Perfil</CardTitle>
          {profile.slug && profile.is_published && (
            <Button asChild variant="outline" size="sm"><Link to={`/profissional/${profile.slug}`} target="_blank"><ExternalLink className="h-3.5 w-3.5" /> Ver público</Link></Button>
          )}
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Nome completo *</Label><Input value={profile.full_name ?? ""} onChange={(e) => set("full_name", e.target.value)} /></div>
          <div className="space-y-2"><Label>Link do perfil (slug)</Label><Input value={profile.slug ?? ""} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="gerado automaticamente" /></div>
          <div className="space-y-2"><Label>Cidade</Label><Input value={profile.city ?? ""} onChange={(e) => set("city", e.target.value)} /></div>
          <div className="space-y-2"><Label>Estado (UF)</Label><Input value={profile.state ?? ""} maxLength={2} onChange={(e) => set("state", e.target.value.toUpperCase())} /></div>
          <div className="space-y-2"><Label>Registro profissional</Label><Input value={profile.professional_registration ?? ""} onChange={(e) => set("professional_registration", e.target.value)} /></div>
          <div className="space-y-2"><Label>Anos de experiência</Label><Input type="number" value={profile.years_experience ?? ""} onChange={(e) => set("years_experience", e.target.value)} /></div>
          <div className="space-y-2"><Label>Foto (URL)</Label><Input value={profile.avatar_url ?? ""} onChange={(e) => set("avatar_url", e.target.value)} /></div>
          <div className="space-y-2"><Label>WhatsApp</Label><Input value={profile.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} /></div>
          <div className="space-y-2"><Label>Instagram</Label><Input value={profile.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} /></div>
          <div className="space-y-2"><Label>Site</Label><Input value={profile.website ?? ""} onChange={(e) => set("website", e.target.value)} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Biografia</Label><Textarea rows={3} value={profile.bio ?? ""} onChange={(e) => set("bio", e.target.value)} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Formação</Label><Textarea rows={2} value={profile.education ?? ""} onChange={(e) => set("education", e.target.value)} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Pós-graduações</Label><Input value={profile.postgraduate ?? ""} onChange={(e) => set("postgraduate", e.target.value)} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Público atendido</Label><Input value={profile.target_audience ?? ""} onChange={(e) => set("target_audience", e.target.value)} placeholder="Ex.: crianças, adultos, idosos" /></div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-base">Especialidades</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {specialties.map((s) => (
              <Badge key={s.id} variant={selSpecs.has(s.id) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggle(setSelSpecs, selSpecs, s.id)}>{s.name}</Badge>
            ))}
          </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Convênios aceitos</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {insurances.map((i) => (
              <Badge key={i.id} variant={selIns.has(i.id) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggle(setSelIns, selIns, i.id)}>{i.name}</Badge>
            ))}
          </CardContent></Card>
      </div>

      <Card><CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
        <div className="space-y-3 w-full">
          <div className="flex items-center gap-3"><Switch checked={!!profile.attends_online} onCheckedChange={(v) => set("attends_online", v)} /><Label>Atendimento online</Label></div>
          <div className="flex items-center gap-3"><Switch checked={!!profile.attends_in_person} onCheckedChange={(v) => set("attends_in_person", v)} /><Label>Atendimento presencial</Label></div>
          <div className="flex items-center gap-3"><Switch checked={!!profile.accepts_private} onCheckedChange={(v) => set("accepts_private", v)} /><Label>Aceita particular</Label></div>
          <div className="flex items-center gap-3"><Switch checked={!!profile.is_published} onCheckedChange={(v) => set("is_published", v)} /><Label className="font-medium">Publicar perfil (visível na busca pública)</Label></div>
        </div>
        <Button onClick={save} disabled={saving} className="w-full sm:w-auto">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Salvar perfil</Button>
      </CardContent></Card>
    </div>
  );
}

function LeadsTab() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("lead_matches" as any)
      .select("*, patient_leads(*), triage:patient_leads(triage_reports(*))")
      .order("score", { ascending: false });
    setMatches((data as any) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (match: any, newStatus: string) => {
    const { error } = await supabase.from("lead_matches" as any).update({ status: newStatus }).eq("id", match.id);
    if (error) { toast.error("Erro ao atualizar status."); return; }
    await supabase.from("lead_status_history" as any).insert({ match_id: match.id, previous_status: match.status, new_status: newStatus });
    toast.success("Status atualizado.");
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (matches.length === 0) return <div className="text-center py-16 text-muted-foreground"><Inbox className="h-10 w-10 mx-auto mb-3 opacity-50" />Nenhum lead recebido ainda.</div>;

  return (
    <div className="space-y-3">
      {matches.map((m) => {
        const lead = m.patient_leads;
        if (!lead) return null;
        return (
          <Card key={m.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{lead.patient_name}</span>
                    {lead.patient_age && <Badge variant="outline">{lead.patient_age} anos</Badge>}
                    <Badge variant="secondary">Score {Number(m.score).toFixed(0)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {[lead.city, lead.state].filter(Boolean).join(", ")} • {lead.mode}
                    {lead.diagnosis && ` • ${lead.diagnosis}`}
                  </p>
                  {lead.therapeutic_goal && <p className="text-sm mt-1">🎯 {lead.therapeutic_goal}</p>}
                  <p className="text-sm text-muted-foreground mt-1">
                    {lead.whatsapp && `WhatsApp: ${lead.whatsapp} `}
                    {lead.phone && `Tel: ${lead.phone} `}
                    {lead.email && `• ${lead.email}`}
                  </p>
                </div>
                <Select value={m.status} onValueChange={(v) => changeStatus(m, v)}>
                  <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function StatsTab() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, converted: 0, rate: 0 });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("lead_matches" as any).select("status");
      const arr = (data as any) ?? [];
      const total = arr.length;
      const converted = arr.filter((m: any) => m.status === "convertido").length;
      setStats({ total, converted, rate: total ? Math.round((converted / total) * 100) : 0 });
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const cards = [
    { label: "Leads recebidos", value: stats.total, icon: Target, color: "text-blue-500" },
    { label: "Leads convertidos", value: stats.converted, icon: CheckCircle2, color: "text-green-500" },
    { label: "Taxa de conversão", value: `${stats.rate}%`, icon: TrendingUp, color: "text-amber-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <Card key={c.label}><CardContent className="p-6">
          <c.icon className={`h-6 w-6 ${c.color} mb-3`} />
          <p className="text-3xl font-bold">{c.value}</p>
          <p className="text-sm text-muted-foreground">{c.label}</p>
        </CardContent></Card>
      ))}
    </div>
  );
}
