import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type PixKeyType = "cpf" | "email" | "phone" | "random";

export default function CreatorRegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    bio: "",
    pixKeyType: "" as PixKeyType | "",
    pixKey: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Email inválido");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Senhas não conferem");
      return false;
    }
    if (!formData.pixKeyType) {
      toast.error("Selecione o tipo de chave PIX");
      return false;
    }
    if (!formData.pixKey.trim()) {
      toast.error("Chave PIX é obrigatória");
      return false;
    }
    if (!acceptedTerms) {
      toast.error("Você precisa aceitar os termos para continuar");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const emailLower = formData.email.toLowerCase().trim();

      // Check if email already exists in course_creators
      const { data: existing } = await supabase
        .from('course_creators')
        .select('id')
        .eq('email', emailLower)
        .single();

      if (existing) {
        toast.error("Este email já está cadastrado como criador");
        return;
      }

      // Create user in Supabase Auth
      const redirectUrl = `${window.location.origin}/creator-dashboard`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailLower,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: formData.name.trim(),
            is_creator: true,
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          toast.error("Este email já está cadastrado. Tente fazer login.");
        } else {
          toast.error(authError.message);
        }
        return;
      }

      if (!authData.user) {
        toast.error("Erro ao criar conta");
        return;
      }

      // Insert new creator with user_id linked
      const { error: creatorError } = await supabase
        .from('course_creators')
        .insert({
          user_id: authData.user.id,
          name: formData.name.trim(),
          email: emailLower,
          phone: formData.phone.trim() || null,
          password_hash: 'supabase_auth', // Placeholder since we use Supabase Auth
          bio: formData.bio.trim() || null,
          pix_key_type: formData.pixKeyType,
          pix_key: formData.pixKey.trim(),
          is_active: true,
        });

      if (creatorError) {
        // Rollback: delete auth user if creator insert fails
        console.error('Creator insert error:', creatorError);
        toast.error("Erro ao criar perfil de criador");
        return;
      }

      toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.");
      navigate('/creator-login');

    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Link 
            to="/creator-login" 
            className="absolute left-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="mx-auto w-24 h-24 mb-4 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <img 
              src="/lovable-uploads/musetera-logo-new.png" 
              alt="MuseTera Logo" 
              className="relative w-full h-full object-cover rounded-full shadow-lg"
            />
          </div>
          <CardTitle className="text-2xl">Cadastro de Criador</CardTitle>
          <CardDescription>
            Crie sua conta para vender cursos na plataforma MuseTera
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Info */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio / Descrição</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre você e sua experiência..."
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>

            {/* PIX Info */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Dados para Recebimento (PIX)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Chave PIX *</Label>
                  <Select
                    value={formData.pixKeyType}
                    onValueChange={(value) => handleChange("pixKeyType", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="random">Chave Aleatória</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pixKey">Chave PIX *</Label>
                  <Input
                    id="pixKey"
                    placeholder="Sua chave PIX"
                    value={formData.pixKey}
                    onChange={(e) => handleChange("pixKey", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                disabled={isLoading}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-tight cursor-pointer"
              >
                Aceito os termos de uso da plataforma e concordo em receber minha comissão de 70% sobre cada venda realizada.
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Já tem uma conta?{" "}
              <Link to="/creator-login" className="text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
