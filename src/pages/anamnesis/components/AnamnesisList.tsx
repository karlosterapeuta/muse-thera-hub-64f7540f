
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAnamnesisData, useDeleteAnamnesis, AnamnesisItem } from "@/hooks/useAnamnesisData";
import { 
  Eye, 
  Edit, 
  Download, 
  Trash2, 
  Plus, 
  Search,
  Calendar,
  User,
  FileText,
  ArrowLeft
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";


interface AnamnesesListProps {
  onCreateNew: () => void;
  onEdit: (anamnesisId: string, patientId: string) => void;
  onView: (anamnesis: AnamnesisItem) => void;
}

export function AnamnesisList({ onCreateNew, onEdit, onView }: AnamnesesListProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: anamneses = [], isLoading, error } = useAnamnesisData();
  const deleteAnamnesis = useDeleteAnamnesis();

  const filteredAnamneses = useMemo(() => {
    if (!searchTerm) return anamneses;
    
    return anamneses.filter(anamnesis =>
      anamnesis.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anamnesis.main_clinical_demand?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, anamneses]);

  const handleDelete = (anamnesisId: string) => {
    deleteAnamnesis.mutate(anamnesisId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-destructive mb-4">
            <h3 className="text-lg font-semibold text-foreground">Erro ao carregar anamneses</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {error.message || "Não foi possível carregar as anamneses."}
            </p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/processes")}
        className="gap-2 -ml-2"
      >
        <ArrowLeft size={16} />
        Voltar
      </Button>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Anamneses Salvas</h1>
          <p className="text-muted-foreground">Gerencie todas as anamneses dos seus pacientes</p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus size={16} />
          Nova Anamnese
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="Buscar por paciente ou demanda..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Anamneses</p>
                <p className="text-2xl font-bold">{anamneses.length}</p>
              </div>
              <FileText className="text-blue-500" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pacientes Únicos</p>
                <p className="text-2xl font-bold">
                  {new Set(anamneses.map(a => a.patient_id)).size}
                </p>
              </div>
              <User className="text-green-500" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold">
                  {anamneses.filter(a => {
                    const created = new Date(a.created_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return created >= weekAgo;
                  }).length}
                </p>
              </div>
              <Calendar className="text-purple-500" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anamneses List */}
      {filteredAnamneses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {anamneses.length === 0 ? "Nenhuma anamnese encontrada" : "Nenhuma anamnese corresponde à busca"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {anamneses.length === 0 
                ? "Comece criando sua primeira anamnese clicando no botão acima."
                : "Tente ajustar os termos de busca para encontrar a anamnese desejada."
              }
            </p>
            {anamneses.length === 0 && (
              <Button onClick={onCreateNew} variant="outline">
                <Plus size={16} className="mr-2" />
                Criar Primeira Anamnese
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnamneses.map((anamnesis) => (
            <Card key={anamnesis.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{anamnesis.patient_name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        ID: {anamnesis.patient_id.slice(-8)}
                      </Badge>
                      {anamnesis.filled_by_guardian && (
                        <Badge className="text-xs bg-cyan-600 hover:bg-cyan-600 text-white">
                          Preenchida pelo responsável
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {anamnesis.main_clinical_demand && (
                    <div>
                      <p className="text-sm font-medium text-foreground">Demanda Principal:</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {anamnesis.main_clinical_demand}
                      </p>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      Criada: {formatDate(anamnesis.created_at)}
                    </div>
                    {anamnesis.updated_at !== anamnesis.created_at && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        Atualizada: {formatDate(anamnesis.updated_at)}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between gap-2 pt-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onView(anamnesis)}
                        className="flex items-center gap-1"
                      >
                        <Eye size={14} />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(anamnesis.id, anamnesis.patient_id)}
                        className="flex items-center gap-1"
                      >
                        <Edit size={14} />
                        Editar
                      </Button>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={deleteAnamnesis.isPending}
                        >
                          {deleteAnamnesis.isPending ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Anamnese</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a anamnese de <strong>{anamnesis.patient_name}</strong>? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(anamnesis.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
