import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, User, Mail, Phone, Key, Loader2, Trash2, Search, Users, BookOpen, DollarSign, GraduationCap, ChevronDown, ChevronUp, Filter, Eye } from "lucide-react";
import { useAllCourseCreators, useCreateCreator, useUpdateCreator, useDeleteCreator, useCreatorStats } from "@/hooks/useCourseCreators";
import { CourseCreator } from "@/types/courses";
import { toast } from "sonner";
import { CommissionSelector, getCommissionBadgeVariant } from "./CommissionSelector";

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

// Creator Stats Card Component
function CreatorStatsCard({ creatorId }: { creatorId: string }) {
  const { data: stats, isLoading } = useCreatorStats(creatorId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-muted rounded p-2 h-12" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t">
      <div className="flex items-center gap-2 p-2 rounded-md bg-blue-500/10">
        <BookOpen className="h-4 w-4 text-blue-500" />
        <div>
          <p className="text-xs text-muted-foreground">Cursos</p>
          <p className="font-semibold text-sm">{stats.coursesCount}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 p-2 rounded-md bg-green-500/10">
        <DollarSign className="h-4 w-4 text-green-500" />
        <div>
          <p className="text-xs text-muted-foreground">Vendas</p>
          <p className="font-semibold text-sm">{stats.totalSales}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 p-2 rounded-md bg-yellow-500/10">
        <DollarSign className="h-4 w-4 text-yellow-500" />
        <div>
          <p className="text-xs text-muted-foreground">Receita</p>
          <p className="font-semibold text-sm">R$ {stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 p-2 rounded-md bg-purple-500/10">
        <GraduationCap className="h-4 w-4 text-purple-500" />
        <div>
          <p className="text-xs text-muted-foreground">Alunos</p>
          <p className="font-semibold text-sm">{stats.studentsCount}</p>
        </div>
      </div>
    </div>
  );
}

export function CreatorManagement() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState<CourseCreator | null>(null);
  const [form, setForm] = useState<CreatorForm>(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [expandedCreatorId, setExpandedCreatorId] = useState<string | null>(null);

  const { data: creators, isLoading } = useAllCourseCreators();
  const createCreator = useCreateCreator();
  const updateCreator = useUpdateCreator();
  const deleteCreator = useDeleteCreator();

  // Filter and search creators
  const filteredCreators = useMemo(() => {
    if (!creators) return [];
    
    return creators.filter((creator) => {
      // Search filter
      const matchesSearch = 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "active" && creator.is_active) ||
        (statusFilter === "inactive" && !creator.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [creators, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    if (!creators) return { total: 0, active: 0, inactive: 0 };
    return {
      total: creators.length,
      active: creators.filter(c => c.is_active).length,
      inactive: creators.filter(c => !c.is_active).length,
    };
  }, [creators]);

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

  const handleDelete = async (creatorId: string) => {
    try {
      await deleteCreator.mutateAsync(creatorId);
      if (expandedCreatorId === creatorId) {
        setExpandedCreatorId(null);
      }
    } catch (error) {
      console.error("Error deleting creator:", error);
    }
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

  const toggleExpanded = (creatorId: string) => {
    setExpandedCreatorId(expandedCreatorId === creatorId ? null : creatorId);
  };

  const isSaving = createCreator.isPending || updateCreator.isPending;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Criadores de Cursos</CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {stats.total} total
            </Badge>
            <Badge variant="default" className="text-xs bg-green-500/20 text-green-700 hover:bg-green-500/30">
              {stats.active} ativos
            </Badge>
            {stats.inactive > 0 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {stats.inactive} inativos
              </Badge>
            )}
            <Button size="sm" onClick={handleOpenNew}>
              <Plus className="h-4 w-4 mr-1" /> Novo Criador
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredCreators.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            {searchQuery || statusFilter !== "all" 
              ? "Nenhum criador encontrado com os filtros aplicados"
              : "Nenhum criador cadastrado"}
          </p>
        ) : (
          filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="rounded-lg border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between p-3">
                <div 
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  onClick={() => toggleExpanded(creator.id)}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{creator.name}</p>
                      {!creator.is_active && (
                        <Badge variant="secondary" className="text-xs">Inativo</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{creator.email}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className={getCommissionBadgeVariant(creator.commission_percentage).className}
                      >
                        {getCommissionBadgeVariant(creator.commission_percentage).label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        PIX: {PIX_KEY_TYPES.find(t => t.value === creator.pix_key_type)?.label}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    {expandedCreatorId === creator.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/courses/admin/creator/${creator.id}`)}
                    title="Ver Dashboard"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEdit(creator)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir criador?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir <strong>{creator.name}</strong>? 
                          Esta ação não pode ser desfeita.
                          {creator.is_active && (
                            <span className="block mt-2 text-yellow-600">
                              ⚠️ Este criador está ativo. Verifique se não há cursos associados.
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(creator.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleteCreator.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Expanded Stats */}
              {expandedCreatorId === creator.id && (
                <div className="px-3 pb-3">
                  <CreatorStatsCard creatorId={creator.id} />
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>

      {/* Creator Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] flex flex-col p-0 sm:max-w-lg">
          <DialogHeader className="p-4 sm:p-6 pb-2">
            <DialogTitle>
              {editingCreator ? "Editar Criador" : "Novo Criador de Cursos"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-4">
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

                <CommissionSelector
                  value={form.commission_percentage}
                  onChange={(value) => setForm({ ...form, commission_percentage: value })}
                />
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

          <DialogFooter className="p-4 sm:p-6 pt-4 gap-2 flex-col-reverse sm:flex-row">
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
