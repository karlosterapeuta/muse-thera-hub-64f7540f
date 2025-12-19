import { motion } from "framer-motion";
import { Shield, CreditCard, Clock, Award, Smartphone, HeadphonesIcon } from "lucide-react";

const badges = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Pagamento Seguro",
    description: "Dados criptografados",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "PIX Instantâneo",
    description: "Acesso liberado na hora",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Acesso Vitalício",
    description: "Estude no seu ritmo",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Certificado",
    description: "Reconhecido no mercado",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Multi-plataforma",
    description: "Acesse de qualquer lugar",
  },
  {
    icon: <HeadphonesIcon className="h-6 w-6" />,
    title: "Suporte Dedicado",
    description: "Tire suas dúvidas",
  },
];

export function TrustBadges() {
  return (
    <section className="py-12 bg-muted/50 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                {badge.icon}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {badge.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {badge.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
