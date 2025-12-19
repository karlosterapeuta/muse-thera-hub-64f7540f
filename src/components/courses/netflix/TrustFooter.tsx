import { motion } from "framer-motion";
import { Shield, Clock, Award, CreditCard, Headphones, RefreshCcw } from "lucide-react";

export function TrustFooter() {
  const badges = [
    {
      icon: Shield,
      title: "Pagamento Seguro",
      description: "Criptografia SSL"
    },
    {
      icon: RefreshCcw,
      title: "Garantia 7 Dias",
      description: "Devolução total"
    },
    {
      icon: Clock,
      title: "Acesso Imediato",
      description: "Após confirmação"
    },
    {
      icon: Award,
      title: "Certificado",
      description: "Ao concluir"
    },
    {
      icon: Headphones,
      title: "Suporte",
      description: "Via e-mail"
    }
  ];

  return (
    <footer className="py-12 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-center group"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <badge.icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">
                  {badge.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {badge.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MuseTera Cursos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
