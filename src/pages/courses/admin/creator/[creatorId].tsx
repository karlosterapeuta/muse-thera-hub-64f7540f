import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  BookOpen, 
  GraduationCap, 
  TrendingUp,
  Clock,
  CheckCircle,
  Loader2,
  Calendar,
  Percent,
  Key
} from "lucide-react";
import { useCreatorDashboard } from "@/hooks/useCreatorDashboard";
import { useAdmin } from "@/hooks/use-admin";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const PIX_KEY_TYPES: Record<string, string> = {
  cpf: "CPF",
  cnpj: "CNPJ",
  email: "Email",
  phone: "Telefone",
  random: "Chave Aleatória",
};

export default function CreatorDashboardAdmin() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useAdmin();
  const { data, isLoading, error } = useCreatorDashboard(creatorId);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Acesso negado. Apenas administradores podem acessar esta página.");
      navigate("/courses/admin");
    }
  }, [isAdmin, adminLoading, navigate]);

  if (adminLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data?.creator) {
    return (
      <div className="container max-w-6xl py-6">
        <Button variant="ghost" onClick={() => navigate("/courses/admin")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Criador não encontrado</p>
        </div>
      </div>
    );
  }

  const { creator, courses, sales, stats, monthlySales } = data;

  // Filter sales
  const filteredSales = sales.filter((sale) => {
    const matchesStatus = statusFilter === "all" || sale.payment_status === statusFilter;
    const matchesCourse = courseFilter === "all" || sale.course_id === courseFilter;
    return matchesStatus && matchesCourse;
  });

  const chartConfig = {
    revenue: {
      label: "Receita",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/courses/admin")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Dashboard do Criador</h1>
            <p className="text-muted-foreground text-sm">
              Visualizando dados de {creator.name}
            </p>
          </div>
        </div>
        <Badge variant={creator.is_active ? "default" : "secondary"} className="text-sm">
          {creator.is_active ? "Ativo" : "Inativo"}
        </Badge>
      </div>

      {/* Creator Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{creator.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {creator.email}
                </div>
                {creator.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {creator.phone}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 md:border-l md:pl-6">
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Cadastrado em
                </p>
                <p className="font-medium">
                  {new Date(creator.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Percent className="h-3 w-3" /> Comissão
                </p>
                <p className="font-medium">{creator.commission_percentage}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Key className="h-3 w-3" /> Chave PIX ({PIX_KEY_TYPES[creator.pix_key_type]})
                </p>
                <p className="font-medium text-sm truncate">{creator.pix_key}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Receita Total</span>
            </div>
            <p className="text-xl font-bold text-green-600">
              R$ {stats.totalRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Receita Pendente</span>
            </div>
            <p className="text-xl font-bold text-yellow-600">
              R$ {stats.pendingRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Vendas Confirmadas</span>
            </div>
            <p className="text-xl font-bold text-blue-600">{stats.confirmedSales}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Vendas Pendentes</span>
            </div>
            <p className="text-xl font-bold text-orange-600">{stats.pendingSales}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Alunos</span>
            </div>
            <p className="text-xl font-bold text-purple-600">{stats.totalStudents}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              <span className="text-xs text-muted-foreground">Cursos</span>
            </div>
            <p className="text-xl font-bold text-indigo-600">{stats.totalCourses}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Receita por Mês (Últimos 6 meses)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `R$${value}`} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Receita"]}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Cursos do Criador ({courses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum curso cadastrado</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4 space-y-2">
                  {course.thumbnail_url && (
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium line-clamp-2">{course.title}</h4>
                    <Badge variant={course.is_published ? "default" : "secondary"} className="shrink-0 text-xs">
                      {course.is_published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Preço:</span>
                    <span className="font-medium">R$ {(course.price_cents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vendas:</span>
                    <span className="font-medium">{course.sales_count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Receita:</span>
                    <span className="font-medium text-green-600">R$ {course.revenue.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales History Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Histórico de Vendas
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cursos</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma venda encontrada</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Comissão</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(sale.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.buyer_name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{sale.buyer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {sale.course_title}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        R$ {(sale.amount_cents / 100).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap text-green-600">
                        R$ {(sale.creator_amount_cents / 100).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={sale.payment_status === "confirmed" ? "default" : "secondary"}>
                          {sale.payment_status === "confirmed" ? "Confirmado" : "Pendente"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
