import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeftIcon, ShieldCheckIcon, SearchIcon, Loader2Icon, CheckCircle2Icon, ReceiptIcon } from "lucide-react";
import { toast } from "sonner";
import { useReceiptIssuerProfile, useSaveReceiptIssuerProfile } from "@/hooks/useReceiptIssuerProfile";
import { fetchCNPJ, isValidCNPJ, isValidCPF, maskCNPJ, maskCPF, onlyDigits } from "@/utils/cpfCnpjUtils";

export default function ReceiptProfilePage() {
  const navigate = useNavigate();
  const { data: existing, isLoading } = useReceiptIssuerProfile();
  const saveMutation = useSaveReceiptIssuerProfile();
  const [docType, setDocType] = useState<"cpf" | "cnpj">("cnpj");
  const [form, setForm] = useState({
    document_number: "",
    legal_name: "",
    trade_name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    email: "",
  });
  const [verified, setVerified] = useState(false);
  const [searching, setSearching] = useState(false);

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
      });
      setVerified(!!existing.verified);
    }
  }, [existing]);

  const handleSearchCNPJ = async () => {
    if (!isValidCNPJ(form.document_number)) {
      toast.error("CNPJ inválido");
      return;
    }
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
    } catch (e: any) {
      toast.error(e.message || "Falha ao consultar CNPJ");
    } finally {
      setSearching(false);
    }
  };

  const handleValidateCPF = () => {
    if (isValidCPF(form.document_number)) {
      setVerified(true);
      toast.success("✓ CPF válido (verificação algorítmica)");
    } else {
      setVerified(false);
      toast.error("CPF inválido");
    }
  };

  const handleSave = async () => {
    if (!form.legal_name.trim()) {
      toast.error("Nome/Razão Social obrigatório");
      return;
    }
    if (docType === "cpf" && !isValidCPF(form.document_number)) {
      toast.error("CPF inválido");
      return;
    }
    if (docType === "cnpj" && !isValidCNPJ(form.document_number)) {
      toast.error("CNPJ inválido");
      return;
    }
    try {
      await saveMutation.mutateAsync({
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
        verified,
        verified_at: verified ? new Date().toISOString() : null,
      });
      toast.success("Perfil de emissor salvo!");
      navigate("/finance");
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar");
    }
  };

  return (
    <div className="container max-w-3xl py-6 space-y-6 relative">
      {/* Cosmic blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 blur-3xl rounded-full -z-10" />

      <Button variant="ghost" size="sm" onClick={() => navigate("/finance")} className="gap-2">
        <ArrowLeftIcon className="h-4 w-4" /> Voltar
      </Button>

      {/* Premium Header */}
      <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl border-border/60 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-400/5 pointer-events-none" />
        <CardHeader className="relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-amber-500 blur-xl opacity-40" />
              <div className="relative bg-gradient-to-br from-primary to-amber-500 p-3 rounded-xl">
                <ShieldCheckIcon className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent">
                Perfil Profissional de Emissor
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Validação via Receita Federal (BrasilAPI) · 100% gratuito
              </p>
            </div>
            {verified && (
              <div className="ml-auto flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/30">
                <CheckCircle2Icon className="h-4 w-4" /> Validado
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-card/60 backdrop-blur-xl border-border/60">
        <CardContent className="p-6 space-y-5">
          <div>
            <Label className="mb-2 block">Tipo de documento</Label>
            <RadioGroup
              value={docType}
              onValueChange={(v) => {
                setDocType(v as any);
                setVerified(false);
              }}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="cnpj" id="cnpj" />
                <Label htmlFor="cnpj">CNPJ (validado online)</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="cpf" id="cpf" />
                <Label htmlFor="cpf">CPF (validação algorítmica)</Label>
              </div>
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
              <Button
                type="button"
                onClick={docType === "cnpj" ? handleSearchCNPJ : handleValidateCPF}
                disabled={searching}
                className="bg-gradient-to-r from-primary to-amber-500 text-white shrink-0"
              >
                {searching ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
                {docType === "cnpj" ? "Buscar" : "Validar"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Razão Social / Nome Completo *</Label>
              <Input value={form.legal_name} onChange={(e) => setForm({ ...form, legal_name: e.target.value })} />
            </div>
            <div>
              <Label>Nome Fantasia</Label>
              <Input value={form.trade_name} onChange={(e) => setForm({ ...form, trade_name: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Endereço</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <Label>Cidade</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <Label>UF</Label>
              <Input value={form.state} maxLength={2} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <Label>CEP</Label>
              <Input value={form.zip_code} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>E-mail</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => navigate("/finance/receipts")}>
              <ReceiptIcon className="h-4 w-4 mr-2" />
              Ver Recibos Emitidos
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-gradient-to-r from-primary to-amber-500 text-white"
            >
              {saveMutation.isPending && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
