import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Pencil, Trash2, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useReceiptTemplates, useSaveReceiptTemplate, useDeleteReceiptTemplate, type ReceiptTemplate } from "@/hooks/useReceiptTemplates";

const empty: Partial<ReceiptTemplate> = {
  title: "", description: "", suggested_amount: undefined, payment_method: "pix",
};

export function TemplatesManager() {
  const { data: templates = [], isLoading } = useReceiptTemplates();
  const save = useSaveReceiptTemplate();
  const del = useDeleteReceiptTemplate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<ReceiptTemplate>>(empty);

  const startNew = () => { setForm(empty); setOpen(true); };
  const startEdit = (t: ReceiptTemplate) => { setForm(t); setOpen(true); };

  const handleSave = async () => {
    if (!form.title?.trim()) { toast.error("Título obrigatório"); return; }
    try {
      await save.mutateAsync(form);
      toast.success("Modelo salvo!");
      setOpen(false);
    } catch (e: any) { toast.error(e.message); }
  };
  const handleDel = (id: string) => {
    if (!confirm("Excluir este modelo?")) return;
    del.mutate(id, { onSuccess: () => toast.success("Modelo removido") });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={startNew} className="bg-gradient-to-r from-primary to-amber-500 text-white">
          <Plus className="h-4 w-4 mr-1" /> Novo Modelo
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12"><Loader2Icon className="h-6 w-6 animate-spin mx-auto" /></div>
      ) : templates.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" /> Nenhum modelo. Crie atalhos para emitir recibos mais rápido.
        </CardContent></Card>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {templates.map((t) => (
            <Card key={t.id} className="hover:border-primary/40 transition">
              <CardContent className="p-3 flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg"><FileText className="h-4 w-4 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{t.description}</div>
                  <div className="text-xs text-primary mt-1">
                    {t.suggested_amount ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(t.suggested_amount)) : "Valor livre"}
                    {t.payment_method && ` · ${t.payment_method.toUpperCase()}`}
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => startEdit(t)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => handleDel(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{form.id ? "Editar" : "Novo"} Modelo</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Título *</Label><Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Descrição</Label><Textarea rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Valor sugerido (R$)</Label>
                <Input type="number" step="0.01" value={form.suggested_amount ?? ""} onChange={(e) => setForm({ ...form, suggested_amount: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div>
                <Label>Forma de pagamento</Label>
                <Select value={form.payment_method || "pix"} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartão de crédito">Cartão de Crédito</SelectItem>
                    <SelectItem value="cartão de débito">Cartão de Débito</SelectItem>
                    <SelectItem value="transferência">Transferência</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
