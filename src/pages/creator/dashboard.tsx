import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  LogOut,
  Loader2,
  LayoutDashboard,
  GraduationCap,
  PieChart,
  Building2,
  BarChart3
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { CourseCreator, CoursePurchase, Course, formatPrice } from "@/types/courses";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreatorCourseManager } from "@/components/creator/CreatorCourseManager";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  totalStudents: number;
  pendingPayments: number;
  pendingRevenue: number;
  // Novos campos para divisão de receita
  grossRevenue: number;
  platformRevenue: number;
  grossPendingRevenue: number;
  pendingPlatformRevenue: number;
}

export default function CreatorDashboardPage() {
  const navigate = useNavigate();
  const [creator, setCreator] = useState<CourseCreator | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchases, setPurchases] = useState<CoursePurchase[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalSales: 0,
    totalStudents: 0,
    pendingPayments: 0,
    pendingRevenue: 0,
    grossRevenue: 0,
    platformRevenue: 0,
    grossPendingRevenue: 0,
    pendingPlatformRevenue: 0
  });
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Check session and load data using Supabase Auth
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Get authenticated user from local session (no network call)
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        
        if (!user) {
          navigate('/creator-login');
          return;
        }

        // Get creator data by user_id
        const { data: creatorData, error: creatorError } = await supabase
          .from('course_creators')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (creatorError || !creatorData) {
          toast.error("Conta de criador não encontrada");
          await supabase.auth.signOut();
          navigate('/creator-login');
          return;
        }

        setCreator(creatorData as CourseCreator);

        // Save creator credentials to localStorage for Edge Function calls
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          localStorage.setItem("creatorId", creatorData.id);
          localStorage.setItem("creatorToken", sessionData.session.access_token);
        }

        // Load creator's courses
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .eq('creator_id', creatorData.id);

        if (coursesData) {
          setCourses(coursesData);
        }

        // Load purchases for creator's courses (only with existing courses - INNER JOIN)
        const { data: purchasesData } = await (supabase as any)
          .from('creator_course_purchases')
          .select(`
            *,
            course:courses!inner(id, title, thumbnail_url)
          `)
          .eq('creator_id', creatorData.id)
          .order('created_at', { ascending: false });

        if (purchasesData) {
          setPurchases(purchasesData as any[]);

          // Calculate stats
            const paid = purchasesData.filter(p => p.payment_status === 'paid');
            const pending = purchasesData.filter(p => p.payment_status === 'pending');
            
            setStats({
              totalRevenue: paid.reduce((acc, p) => acc + (p.creator_amount_cents || 0), 0),
              totalSales: paid.length,
              totalStudents: new Set(paid.map(p => p.user_id)).size,
              pendingPayments: pending.length,
              pendingRevenue: pending.reduce((acc, p) => acc + (p.creator_amount_cents || 0), 0),
              // Novos campos
              grossRevenue: paid.reduce((acc, p) => acc + (p.amount_cents || 0), 0),
              platformRevenue: paid.reduce((acc, p) => acc + (p.platform_amount_cents || 0), 0),
              grossPendingRevenue: pending.reduce((acc, p) => acc + (p.amount_cents || 0), 0),
              pendingPlatformRevenue: pending.reduce((acc, p) => acc + (p.platform_amount_cents || 0), 0)
            });
          }

      } catch (error) {
        console.error('Error loading dashboard:', error);
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/creator-login');
        }
      }
    );

    loadData();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    // Clear creator credentials from localStorage
    localStorage.removeItem("creatorId");
    localStorage.removeItem("creatorToken");
    
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso");
    navigate('/creator-login');
  };

  const handleConfirmPayment = async (purchaseId: string) => {
    try {
      const { error } = await supabase
        .from('course_purchases')
        .update({
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          confirmed_by_creator_at: new Date().toISOString()
        })
        .eq('id', purchaseId);

      if (error) throw error;

      // Grant course access
      const purchase = purchases.find(p => p.id === purchaseId);
      if (purchase) {
        await supabase
          .from('course_access')
          .upsert({
            course_id: purchase.course_id,
            user_id: purchase.user_id,
            purchase_id: purchaseId,
            is_active: true
          }, { onConflict: 'course_id,user_id' });
      }

      toast.success("Pagamento confirmado! Acesso liberado para o aluno.");
      
      // Refresh data
      window.location.reload();

    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error("Erro ao confirmar pagamento");
    }
  };

  // Filter purchases by selected course
  const filteredPurchases = selectedCourse === "all" 
    ? purchases 
    : purchases.filter(p => p.course_id === selectedCourse);

  // Process sales data by month for chart
  const salesByMonth = useMemo(() => {
    const monthlyData: { [key: string]: { sales: number; revenue: number; month: Date } } = {};
    
    purchases.forEach(purchase => {
      if (purchase.payment_status === 'paid' && purchase.created_at) {
        const date = new Date(purchase.created_at);
        const monthKey = format(date, 'yyyy-MM');
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { sales: 0, revenue: 0, month: date };
        }
        monthlyData[monthKey].sales++;
        monthlyData[monthKey].revenue += (purchase.creator_amount_cents || 0);
      }
    });
    
    // Convert to array, sort by date, and take last 6 months
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([_, data]) => ({
        name: format(data.month, 'MMM/yy', { locale: ptBR }),
        vendas: data.sales,
        receita: data.revenue / 100
      }));
  }, [purchases]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <img 
                src="/lovable-uploads/musetera-logo-new.png" 
                alt="MuseTera Logo" 
                className="relative w-full h-full object-cover rounded-full shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Painel do Criador</h1>
              <p className="text-muted-foreground">Olá, {creator?.name}!</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Meus Cursos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {creator && <CreatorCourseManager creatorId={creator.id} />}
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Receita Total</CardDescription>
              <CardTitle className="text-2xl text-emerald-600">
                {formatPrice(stats.totalRevenue)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-1" />
                Sua comissão ({creator?.commission_percentage || 70}%)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Vendas Confirmadas</CardDescription>
              <CardTitle className="text-2xl">{stats.totalSales}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mr-1 text-emerald-500" />
                Pagamentos recebidos
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Alunos</CardDescription>
              <CardTitle className="text-2xl">{stats.totalStudents}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                Compraram seus cursos
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pagamentos Pendentes</CardDescription>
              <CardTitle className="text-2xl text-amber-600">{stats.pendingPayments}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1 text-amber-500" />
                Aguardando confirmação
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Receita Pendente</CardDescription>
              <CardTitle className="text-2xl text-amber-600">
                {formatPrice(stats.pendingRevenue)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-1" />
                A receber após confirmação
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Split Card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Divisão de Receita
            </CardTitle>
            <CardDescription>
              Como suas vendas são divididas entre você e a plataforma Musetera
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Gross Revenue */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Receita Bruta Total (Confirmada)</p>
              <p className="text-3xl font-bold">{formatPrice(stats.grossRevenue)}</p>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600 font-medium">Sua Comissão ({creator?.commission_percentage || 70}%)</span>
                <span className="text-blue-600 font-medium">Musetera ({100 - (creator?.commission_percentage || 70)}%)</span>
              </div>
              <div className="relative h-6 bg-blue-500/20 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-l-full transition-all duration-500"
                  style={{ width: `${creator?.commission_percentage || 70}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  <span className="text-white drop-shadow-sm">
                    {formatPrice(stats.totalRevenue)} | {formatPrice(stats.platformRevenue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Split Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">Sua Comissão</span>
                </div>
                <p className="text-2xl font-bold text-emerald-600">{formatPrice(stats.totalRevenue)}</p>
                <p className="text-sm text-muted-foreground mt-1">({creator?.commission_percentage || 70}% das vendas)</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-700">Musetera</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{formatPrice(stats.platformRevenue)}</p>
                <p className="text-sm text-muted-foreground mt-1">({100 - (creator?.commission_percentage || 70)}% das vendas)</p>
              </div>
            </div>

            {/* Pending Section */}
            {(stats.grossPendingRevenue > 0) && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="font-semibold text-amber-700">Valores Pendentes</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Bruto</p>
                    <p className="font-medium">{formatPrice(stats.grossPendingRevenue)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Você receberá</p>
                    <p className="font-medium text-emerald-600">{formatPrice(stats.pendingRevenue)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Musetera</p>
                    <p className="font-medium text-blue-600">{formatPrice(stats.pendingPlatformRevenue)}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Sales Evolution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Evolução de Vendas
            </CardTitle>
            <CardDescription>
              Vendas confirmadas nos últimos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {salesByMonth.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Ainda não há vendas para exibir.</p>
                <p className="text-sm">Quando você fizer sua primeira venda, ela aparecerá aqui!</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'receita') return [`R$ ${value.toFixed(2)}`, 'Sua Receita'];
                      return [value, 'Vendas'];
                    }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    formatter={(value) => value === 'vendas' ? 'Quantidade de Vendas' : 'Sua Receita (R$)'}
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="vendas" 
                    fill="#10b981" 
                    name="vendas"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="receita" 
                    fill="#3b82f6" 
                    name="receita"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Meus Cursos
            </CardTitle>
            <CardDescription>
              Cursos que você está oferecendo na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Você ainda não tem cursos cadastrados.</p>
                <p className="text-sm">Vá para a aba "Meus Cursos" para criar seu primeiro curso.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => {
                  const courseSales = purchases.filter(p => p.course_id === course.id && p.payment_status === 'paid').length;
                  const courseRevenue = purchases
                    .filter(p => p.course_id === course.id && p.payment_status === 'paid')
                    .reduce((acc, p) => acc + (p.creator_amount_cents || 0), 0);

                  return (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <span className="text-4xl">🎵</span>
                          </div>
                        )}
                        <Badge 
                          className="absolute top-2 right-2"
                          variant={course.is_published ? "default" : "secondary"}
                        >
                          {course.is_published ? "Publicado" : "Rascunho"}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatPrice(course.price_cents || 0)}
                        </p>
                        <Separator className="my-3" />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{courseSales} vendas</span>
                          <span className="font-medium text-emerald-600">{formatPrice(courseRevenue)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales History */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Histórico de Vendas
                </CardTitle>
                <CardDescription>
                  Todas as vendas dos seus cursos
                </CardDescription>
              </div>
              
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[200px]">
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
            </div>
          </CardHeader>
          <CardContent>
            {filteredPurchases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Nenhuma venda encontrada.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead className="text-emerald-600">Sua Comissão</TableHead>
                      <TableHead className="text-blue-600">Taxa Musetera</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(purchase.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{purchase.buyer_name || "N/A"}</p>
                            <p className="text-sm text-muted-foreground">{purchase.buyer_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {(purchase.course as any)?.title || "Curso removido"}
                        </TableCell>
                        <TableCell>{formatPrice(purchase.amount_cents)}</TableCell>
                        <TableCell className="font-medium text-emerald-600">
                          {formatPrice(purchase.creator_amount_cents)}
                        </TableCell>
                        <TableCell className="font-medium text-blue-600">
                          {formatPrice(purchase.platform_amount_cents)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              purchase.payment_status === 'paid' ? 'default' :
                              purchase.payment_status === 'pending' ? 'secondary' :
                              'destructive'
                            }
                            className={
                              purchase.payment_status === 'paid' ? 'bg-emerald-500' :
                              purchase.payment_status === 'pending' ? 'bg-amber-500 text-white' :
                              ''
                            }
                          >
                            {purchase.payment_status === 'paid' ? 'Pago' :
                             purchase.payment_status === 'pending' ? 'Pendente' :
                             'Cancelado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {purchase.payment_status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleConfirmPayment(purchase.id)}
                              className="gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Confirmar
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Creator Info */}
        <Card>
          <CardHeader>
            <CardTitle>Seus Dados</CardTitle>
            <CardDescription>
              Informações do seu perfil de criador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{creator?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{creator?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{creator?.phone || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comissão</p>
                <p className="font-medium">{creator?.commission_percentage || 70}%</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Chave PIX ({creator?.pix_key_type?.toUpperCase()})</p>
                <p className="font-medium">{creator?.pix_key}</p>
              </div>
              {creator?.bio && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="font-medium">{creator.bio}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
