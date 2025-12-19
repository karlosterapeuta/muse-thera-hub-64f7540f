import { motion } from "framer-motion";
import { 
  Brain, 
  Heart, 
  Music, 
  Target, 
  Lightbulb, 
  TrendingUp,
  CheckCircle2
} from "lucide-react";

const benefits = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Fundamentos Científicos",
    description: "Aprenda as bases neurocientíficas por trás da musicoterapia e como aplicá-las na prática.",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Técnicas Terapêuticas",
    description: "Domine técnicas validadas e eficazes para diferentes contextos e necessidades.",
  },
  {
    icon: <Music className="h-6 w-6" />,
    title: "Repertório Prático",
    description: "Acesse um vasto repertório de músicas e atividades prontas para uso imediato.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Casos Reais",
    description: "Estude casos clínicos reais e aprenda como abordar diferentes situações.",
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Metodologias Inovadoras",
    description: "Conheça as metodologias mais atuais e inovadoras do mercado.",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Crescimento Profissional",
    description: "Destaque-se no mercado com conhecimentos exclusivos e certificação.",
  },
];

export function BenefitsGrid() {
  return (
    <section id="benefits" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            O que você vai aprender
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Transforme Sua Prática Profissional
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Com conteúdos práticos e aplicáveis desde a primeira aula
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="shrink-0 p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary h-fit">
                {benefit.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  {benefit.title}
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
