import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, User, Mail, Phone, Key, Percent, Loader2 } from "lucide-react";
import { useAllCourseCreators, useCreateCreator, useUpdateCreator } from "@/hooks/useCourseCreators";
import { CourseCreator } from "@/types/courses";
import { toast } from "sonner";

const PIX_KEY_TYPES = [
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Telefone" },
  { value: "random", label: "Chave Aleatória" },
];

interface CreatorForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  pix_key: string;
  pix_key_type: "cpf" | "cnpj" | "email" | "phone" | "random";
  bio: string;
  commission_percentage: number;
  is_active: boolean;
}

const emptyForm: CreatorForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  pix_key: "",
  pix_key_type: "cpf",
  bio: "",
  commission_percentage: 70,
  is_active: true,
};

export function CreatorManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState<CourseCreator | null>(null);
  const [form, setForm] = useState<CreatorForm>(emptyForm);

  const { data: creators, isLoading } = useAllCourseCreators();
  const createCreator = useCreateCreator();
  const updateCreator = useUpdateCreator();

  const handleOpenNew = () => {
    setEditingCreator(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (creator: CourseCreator) => {
    setEditingCreator(creator);
    setForm({
      name: creator.name,
      email: creator.email,
      password: "",
      phone: creator.phone || "",
      pix_key: creator.pix_key,
      pix_key_type: creator.pix_key_type,
      bio: creator.bio || "",
      commission_percentage: creator.commission_percentage,
      is_active: creator.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.pix_key) {
      toast.error("Nome, email e chave PIX são obrigatórios");
      return;
    }

    if (!editingCreator && !form.password) {
      toast.error("Senha é obrigatória para novos criadores");
      return;
    }

    try {
      if (editingCreator) {
        await updateCreator.mutateAsync({
          id: editingCreator.id,
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          pix_key: form.pix_key,
          pix_key_type: form.pix_key_type,
          bio: form.bio || undefined,
          commission_percentage: form.commission_percentage,
          is_active: form.is_active,
          newPassword: form.password || undefined,
        });
      } else {
        await createCreator.mutateAsync({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          pix_key: form.pix_key,
          pix_key_type: form.pix_key_type,
          bio: form.bio || undefined,
          commission_percentage: form.commission_percentage,
        });
      }
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving creator:", error);
    }
  };

  const isSaving = createCreator.isPending || updateCreator.isPending;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Criadores de Cursos
        </CardTitle>
        <Button size="sm" onClick={handleOpenNew}>
          <Plus className="h-4 w-4 mr-1" /> Novo Criador
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : creators?.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            Nenhum criador cadastrado
          </p>
        ) : (
          creators?.map((creator) => (
            <div
              key={creator.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{creator.name}</p>
                    {!creator.is_active && (
                      <Badge variant="secondary" className="text-xs">Inativo</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{creator.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {creator.commission_percentage}% comissão
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      PIX: {PIX_KEY_TYPES.find(t => t.value === creator.pix_key_type)?.label}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenEdit(creator)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>

      {/* Creator Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCreator ? "Editar Criador" : "Novo Criador de Cursos"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Basic Info */}
            <div className="grid gap-4">
              <div>
                <Label className="flex items-center gap-1">
                  <User className="h-3 w-3" /> Nome *
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <Label className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email *
                </Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <Label className="flex items-center gap-1">
                  <Key className="h-3 w-3" /> Senha {!editingCreator && "*"}
                </Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editingCreator ? "Deixe vazio para manter a atual" : "Senha de acesso"}
                />
              </div>

              <div>
                <Label className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Telefone
                </Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            {/* PIX Info */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Dados de Pagamento PIX</h4>
              <div className="grid gap-4">
                <div>
                  <Label>Tipo de Chave PIX *</Label>
                  <Select
                    value={form.pix_key_type}
                    onValueChange={(value) =>
                      setForm({ ...form, pix_key_type: value as CreatorForm["pix_key_type"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PIX_KEY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Chave PIX *</Label>
                  <Input
                    value={form.pix_key}
                    onChange={(e) => setForm({ ...form, pix_key: e.target.value })}
                    placeholder="Chave PIX para receber pagamentos"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-1">
                    <Percent className="h-3 w-3" /> Comissão (%)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={form.commission_percentage}
                    onChange={(e) =>
                      setForm({ ...form, commission_percentage: parseInt(e.target.value) || 70 })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Percentual do valor do curso que vai para o criador
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="border-t pt-4">
              <Label>Bio / Descrição</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Uma breve descrição sobre o criador..."
                rows={3}
              />
            </div>

            {/* Active Status */}
            {editingCreator && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Status</Label>
                    <p className="text-xs text-muted-foreground">
                      Criadores inativos não aparecem nas opções
                    </p>
                  </div>
                  <Switch
                    checked={form.is_active}
                    onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCreator ? "Salvar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
