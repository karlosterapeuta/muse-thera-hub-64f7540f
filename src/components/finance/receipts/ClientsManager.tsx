import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Pencil, Trash2, SearchIcon, ShieldCheckIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useReceiptClients, useSaveReceiptClient, useDeleteReceiptClient, type ReceiptClient } from "@/hooks/useReceiptClients";
import { isValidCPF, isValidCNPJ, maskCPF, maskCNPJ, onlyDigits, fetchCNPJ } from "@/utils/cpfCnpjUtils";

const empty: Partial<ReceiptClient> = {
  name: "", document_type: "cpf", document_number: "", email: "", phone: "", address: "", city: "", state: "", zip_code: "",
};

export function ClientsManager() {
  const { data: clients = [], isLoading } = useReceiptClients();
  const save = useSaveReceiptClient();
  const del = useDeleteReceiptClient();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<ReceiptClient>>(empty);
  const [searching, setSearching] = useState(false);

  const filtered = clients.filter((c) =>
    !q ||
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    (c.document_number || "").includes(onlyDigits(q))
  );

  const startNew = () => { setForm(empty); setOpen(true); };
  const startEdit = (c: ReceiptClient) => { setForm(c); setOpen(true); };

  const searchCNPJ = async () => {
    if (!isValidCNPJ(form.document_number || "")) { toast.error("CNPJ inválido"); return; }
    setSearching(true);
    try {
      const data = await fetchCNPJ(form.document_number!);
      setForm((f) => ({
        ...f,
        name: data.razao_social || f.name,
        address: [data.logradouro, data.numero, data.bairro].filter(Boolean).join(", ") || f.address,
        city: data.municipio || f.city,
        state: data.uf || f.state,
        zip_code: data.cep || f.zip_code,
        email: data.email || f.email,
        phone: data.ddd_telefone_1 || f.phone,
      }));
      toast.success("Dados carregados da Receita Federal");
    } catch (e: any) {
      toast.error(e.message || "Falha ao buscar CNPJ");
    } finally { setSearching(false); }
  };

  const handleSave = async () => {
    if (!form.name?.trim()) { toast.error("Nome obrigatório"); return; }
    if (form.document_number) {
      const d = onlyDigits(form.document_number);
      if (form.document_type === "cpf" && !isValidCPF(d)) { toast.error("CPF inválido"); return; }
      if (form.document_type === "cnpj" && !isValidCNPJ(d)) { toast.error("CNPJ inválido"); return; }
    }
    try {
      await save.mutateAsync({ ...form, document_number: form.document_number ? onlyDigits(form.document_number) : null });
      toast.success("Cliente salvo!");
      setOpen(false);
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir este cliente?")) return;
    del.mutate(id, { onSuccess: () => toast.success("Cliente removido") });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por nome ou CPF/CNPJ..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button onClick={startNew} className="bg-gradient-to-r from-primary to-amber-500 text-white">
          <Plus className="h-4 w-4 mr-1" /> Novo Cliente
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12"><Loader2Icon className="h-6 w-6 animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" /> Nenhum cliente cadastrado.
        </CardContent></Card>
      ) : (
        <div className="grid gap-2">
          {filtered.map((c) => (
            <Card key={c.id} className="hover:border-primary/40 transition">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg"><Users className="h-4 w-4 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.document_number ? (c.document_type === "cnpj" ? maskCNPJ(c.document_number) : maskCPF(c.document_number)) : "Sem documento"}
                    {c.phone && ` · ${c.phone}`}
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => startEdit(c)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{form.id ? "Editar" : "Novo"} Cliente</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Nome completo *</Label>
              <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Tipo</Label>
                <Select value={form.document_type || "cpf"} onValueChange={(v) => setForm({ ...form, document_type: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="cpf">CPF</SelectItem><SelectItem value="cnpj">CNPJ</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Documento</Label>
                <div className="flex gap-1">
                  <Input
                    value={form.document_number || ""}
                    onChange={(e) => {
                      const v = form.document_type === "cnpj" ? maskCNPJ(e.target.value) : maskCPF(e.target.value);
                      setForm({ ...form, document_number: v });
                    }}
                  />
                  {form.document_type === "cnpj" && (
                    <Button type="button" size="sm" variant="outline" onClick={searchCNPJ} disabled={searching}>
                      {searching ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <ShieldCheckIcon className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>E-mail</Label><Input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Telefone</Label><Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div><Label>Endereço</Label><Input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-2">
              <div><Label>Cidade</Label><Input value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              <div><Label>UF</Label><Input maxLength={2} value={form.state || ""} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} /></div>
              <div><Label>CEP</Label><Input value={form.zip_code || ""} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={save.isPending} className="bg-gradient-to-r from-primary to-amber-500 text-white">
              {save.isPending && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />} Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
