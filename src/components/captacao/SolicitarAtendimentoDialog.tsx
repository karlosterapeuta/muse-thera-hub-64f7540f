import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

interface SolicitarAtendimentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferredProfileId?: string | null;
  preferredProfileName?: string | null;
}

const emptyForm = {
  guardian_name: "",
  patient_name: "",
  patient_age: "",
  city: "",
  state: "",
  phone: "",
  whatsapp: "",
  email: "",
  diagnosis: "",
  cid: "",
  therapeutic_goal: "",
  insurance: "",
  mode: "online" as "online" | "presencial" | "ambos",
  notes: "",
};

export function SolicitarAtendimentoDialog({
  open,
  onOpenChange,
  preferredProfileId = null,
  preferredProfileName = null,
}: SolicitarAtendimentoDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.patient_name.trim()) {
      toast.error("Informe o nome do paciente.");
      return;
    }
    if (!consent) {
      toast.error("É necessário aceitar o uso dos dados (LGPD).");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("captacao-triage", {
        body: {
          ...form,
          patient_age: form.patient_age ? Number(form.patient_age) : null,
          preferred_profile_id: preferredProfileId,
          lgpd_consent: consent,
        },
      });
      if (error) throw error;
      toast.success(
        data?.matches > 0
          ? `Solicitação enviada! Encontramos ${data.matches} musicoterapeuta(s) compatível(is).`
          : "Solicitação enviada com sucesso! Em breve entraremos em contato."
      );
      setForm(emptyForm);
      setConsent(false);
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível enviar a solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Encontrar Musicoterapeuta
          </DialogTitle>
          <DialogDescription>
            {preferredProfileName
              ? `Sua solicitação será direcionada para ${preferredProfileName} e outros profissionais compatíveis.`
              : "Preencha os dados e nossa IA encontrará o profissional ideal para o caso."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="space-y-2">
            <Label>Responsável</Label>
            <Input value={form.guardian_name} onChange={(e) => update("guardian_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Paciente *</Label>
            <Input value={form.patient_name} onChange={(e) => update("patient_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Idade</Label>
            <Input type="number" value={form.patient_age} onChange={(e) => update("patient_age", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Cidade</Label>
            <Input value={form.city} onChange={(e) => update("city", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Input value={form.state} onChange={(e) => update("state", e.target.value)} maxLength={2} placeholder="UF" />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Diagnóstico</Label>
            <Input value={form.diagnosis} onChange={(e) => update("diagnosis", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>CID</Label>
            <Input value={form.cid} onChange={(e) => update("cid", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Convênio</Label>
            <Input value={form.insurance} onChange={(e) => update("insurance", e.target.value)} placeholder="Ex.: Unimed / Particular" />
          </div>
          <div className="space-y-2">
            <Label>Modalidade</Label>
            <Select value={form.mode} onValueChange={(v) => update("mode", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="ambos">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Objetivo terapêutico</Label>
            <Textarea value={form.therapeutic_goal} onChange={(e) => update("therapeutic_goal", e.target.value)} rows={2} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Observações</Label>
            <Textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={2} />
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
          <Checkbox id="lgpd" checked={consent} onCheckedChange={(v) => setConsent(Boolean(v))} className="mt-0.5" />
          <Label htmlFor="lgpd" className="text-xs leading-relaxed text-muted-foreground font-normal cursor-pointer">
            Autorizo o uso dos meus dados pessoais para fins de contato e encaminhamento a profissionais de
            musicoterapia, conforme a Lei Geral de Proteção de Dados (LGPD).
          </Label>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Encontrar Musicoterapeuta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
