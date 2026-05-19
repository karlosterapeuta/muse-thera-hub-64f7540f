import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SearchIcon, Loader2Icon, CheckCircle2Icon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useReceiptIssuerProfile, useSaveReceiptIssuerProfile } from "@/hooks/useReceiptIssuerProfile";
import { fetchCNPJ, isValidCNPJ, isValidCPF, maskCNPJ, maskCPF, onlyDigits } from "@/utils/cpfCnpjUtils";
import { SignaturePad } from "./SignaturePad";

export function IssuerProfileForm() {
  const { data: existing, isLoading } = useReceiptIssuerProfile();
  const save = useSaveReceiptIssuerProfile();
  const [docType, setDocType] = useState<"cpf" | "cnpj">("cnpj");
  const [form, setForm] = useState({
    document_number: "", legal_name: "", trade_name: "",
    address: "", city: "", state: "", zip_code: "", phone: "", email: "",
    signature_url: "",
  });
  const [verified, setVerified] = useState(false);
  const [searching, setSearching] = useState(false);
  const [uploadingSig, setUploadingSig] = useState(false);

  useEffect(() => {
    if (existing) {
      setDocType(existing.document_type);
      setForm({
        document_number: existing.document_number,
        legal_name: existing.legal_name,
        trade_name: existing.trade_name || "",
        address: existing.address || "",
        city: existing.city || "",
        state: existing.state || "",
        zip_code: existing.zip_code || "",
        phone: existing.phone || "",
        email: existing.email || "",
        signature_url: existing.signature_url || "",
      });
      setVerified(!!existing.verified);
    }
  }, [existing]);

  const handleSearchCNPJ = async () => {
    if (!isValidCNPJ(form.document_number)) { toast.error("CNPJ inválido"); return; }
    setSearching(true);
    try {
      const data = await fetchCNPJ(form.document_number);
      setForm((f) => ({
        ...f,
        legal_name: data.razao_social || f.legal_name,
        trade_name: data.nome_fantasia || f.trade_name,
        address: [data.logradouro, data.numero, data.complemento, data.bairro].filter(Boolean).join(", "),
        city: data.municipio || f.city,
        state: data.uf || f.state,
        zip_code: data.cep || f.zip_code,
        phone: data.ddd_telefone_1 || f.phone,
        email: data.email || f.email,
      }));
      setVerified(true);
      toast.success("✓ CNPJ validado na Receita Federal");
    } catch (e: any) { toast.error(e.message || "Falha"); }
    finally { setSearching(false); }
  };

  const handleValidateCPF = () => {
    if (isValidCPF(form.document_number)) { setVerified(true); toast.success("✓ CPF válido"); }
    else { setVerified(false); toast.error("CPF inválido"); }
  };

  const handleSaveSignature = async (dataUrl: string) => {
    setUploadingSig(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const blob = await (await fetch(dataUrl)).blob();
      const path = `${user.id}/receipt-signature-${Date.now()}.png`;
      const { error: upErr } = await supabase.storage.from("digital-signatures").upload(path, blob, {
        contentType: "image/png", upsert: true,
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("digital-signatures").getPublicUrl(path);
      setForm((f) => ({ ...f, signature_url: pub.publicUrl }));
      toast.success("Assinatura salva!");
    } catch (e: any) {
      toast.error(e.message || "Erro ao enviar assinatura");
    } finally { setUploadingSig(false); }
  };

  const handleSave = async () => {
    if (!form.legal_name.trim()) { toast.error("Nome obrigatório"); return; }
    if (docType === "cpf" && !isValidCPF(form.document_number)) { toast.error("CPF inválido"); return; }
    if (docType === "cnpj" && !isValidCNPJ(form.document_number)) { toast.error("CNPJ inválido"); return; }
    try {
      await save.mutateAsync({
        document_type: docType,
        document_number: onlyDigits(form.document_number),
        legal_name: form.legal_name,
        trade_name: form.trade_name || null,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        zip_code: form.zip_code || null,
        phone: form.phone || null,
        email: form.email || null,
        signature_url: form.signature_url || null,
        verified,
        verified_at: verified ? new Date().toISOString() : null,
      });
      toast.success("Perfil salvo!");
    } catch (e: any) { toast.error(e.message); }
  };

  if (isLoading) return <div className="text-center py-10"><Loader2Icon className="h-6 w-6 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-4">
      <Card className="bg-card/60 backdrop-blur-xl">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Dados do Emissor (Recebedor)</h3>
              <p className="text-xs text-muted-foreground">Validação via Receita Federal (BrasilAPI) · gratuito</p>
            </div>
            {verified && (
              <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
                <CheckCircle2Icon className="h-4 w-4" /> Validado
              </div>
            )}
          </div>

          <div>
            <Label className="mb-2 block">Tipo de documento</Label>
            <RadioGroup value={docType} onValueChange={(v) => { setDocType(v as any); setVerified(false); }} className="flex gap-6">
              <div className="flex items-center gap-2"><RadioGroupItem value="cnpj" id="cnpj" /><Label htmlFor="cnpj">CNPJ</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="cpf" id="cpf" /><Label htmlFor="cpf">CPF</Label></div>
            </RadioGroup>
          </div>

          <div>
            <Label>{docType === "cnpj" ? "CNPJ" : "CPF"}</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={form.document_number}
                onChange={(e) => {
                  const v = docType === "cnpj" ? maskCNPJ(e.target.value) : maskCPF(e.target.value);
                  setForm({ ...form, document_number: v });
                  setVerified(false);
                }}
                placeholder={docType === "cnpj" ? "00.000.000/0000-00" : "000.000.000-00"}
              />
              <Button type="button" onClick={docType === "cnpj" ? handleSearchCNPJ : handleValidateCPF} disabled={searching}
                className="bg-gradient-to-r from-primary to-amber-500 text-white shrink-0">
                {searching ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
                <span className="ml-1">{docType === "cnpj" ? "Buscar" : "Validar"}</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><Label>Razão Social / Nome *</Label><Input value={form.legal_name} onChange={(e) => setForm({ ...form, legal_name: e.target.value })} /></div>
            <div><Label>Nome Fantasia</Label><Input value={form.trade_name} onChange={(e) => setForm({ ...form, trade_name: e.target.value })} /></div>
            <div className="md:col-span-2"><Label>Endereço</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div><Label>Cidade</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div><Label>UF</Label><Input maxLength={2} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} /></div>
            <div><Label>CEP</Label><Input value={form.zip_code} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} /></div>
            <div><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="md:col-span-2"><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>

          <div className="pt-2">
            <Label className="mb-2 block">Assinatura Digital</Label>
            <SignaturePad initialUrl={form.signature_url} onSave={handleSaveSignature} saving={uploadingSig} />
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={save.isPending} className="bg-gradient-to-r from-primary to-amber-500 text-white">
              {save.isPending && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
              <ShieldCheckIcon className="h-4 w-4 mr-2" /> Salvar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
