import { motion } from "framer-motion";
import { Stethoscope, GraduationCap, Users, School } from "lucide-react";

const audiences = [
  {
    icon: <Stethoscope className="h-8 w-8" />,
    title: "Musicoterapeutas",
    description: "Profissionais que buscam aprimorar suas técnicas e ampliar seu repertório terapêutico.",
  },
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: "Estudantes",
    description: "Estudantes de música, terapia ou áreas da saúde interessados em musicoterapia.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Pais e Cuidadores",
    description: "Famílias de crianças TEA que desejam aplicar técnicas musicais em casa.",
  },
  {
    icon: <School className="h-8 w-8" />,
    title: "Educadores",
    description: "Professores que querem usar a música como ferramenta pedagógica e terapêutica.",
  },
];

export function TargetAudience() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Para quem é este curso?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Feito Para Você que Quer
            <span className="text-primary"> Transformar Vidas</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Este curso foi desenvolvido para diferentes perfis de profissionais e entusiastas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="mb-4 p-3 rounded-xl bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {audience.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {audience.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {audience.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
