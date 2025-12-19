import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Play, Lock, Gift, Clock } from "lucide-react";
import { CourseWithProgress } from "@/types/courses";

interface CourseModulesProps {
  course: CourseWithProgress;
}

// Demo modules for display
const demoModules = [
  {
    title: "Módulo 1: Fundamentos da Musicoterapia",
    lessons: 8,
    duration: "2h 30min",
    items: [
      "Introdução à Musicoterapia",
      "História e Evolução",
      "Bases Neurocientíficas",
      "Ética Profissional",
    ],
    isFree: true,
  },
  {
    title: "Módulo 2: Técnicas e Metodologias",
    lessons: 12,
    duration: "4h 15min",
    items: [
      "Improvisação Terapêutica",
      "Recriação Musical",
      "Composição Terapêutica",
      "Audição Receptiva",
    ],
    isFree: false,
  },
  {
    title: "Módulo 3: Aplicações Práticas",
    lessons: 10,
    duration: "3h 45min",
    items: [
      "Musicoterapia com Crianças",
      "Musicoterapia com Idosos",
      "TEA e Musicoterapia",
      "Saúde Mental",
    ],
    isFree: false,
  },
  {
    title: "Módulo 4: Planejamento e Avaliação",
    lessons: 6,
    duration: "2h 00min",
    items: [
      "Plano Terapêutico",
      "Avaliação de Resultados",
      "Documentação Clínica",
      "Estudos de Caso",
    ],
    isFree: false,
    isBonus: true,
  },
];

export function CourseModules({ course }: CourseModulesProps) {
  const totalLessons = demoModules.reduce((acc, m) => acc + m.lessons, 0);

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
            Conteúdo do Curso
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {course.totalModules} Módulos Completos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {course.totalLessons} aulas práticas e didáticas para você dominar a musicoterapia
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {demoModules.map((module, index) => (
              <AccordionItem
                key={index}
                value={`module-${index}`}
                className="border border-border rounded-xl px-6 bg-card data-[state=open]:border-primary/50"
              >
                <AccordionTrigger className="hover:no-underline py-5">
                  <div className="flex items-center gap-4 text-left w-full">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">
                          {module.title}
                        </h3>
                        {module.isFree && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
                            GRÁTIS
                          </span>
                        )}
                        {module.isBonus && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium flex items-center gap-1">
                            <Gift className="h-3 w-3" />
                            BÔNUS
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {module.lessons} aulas
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {module.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ul className="space-y-3 ml-14">
                    {module.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center gap-3 text-muted-foreground"
                      >
                        {module.isFree ? (
                          <Play className="h-4 w-4 text-primary" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                        <span>{item}</span>
                      </li>
                    ))}
                    <li className="text-sm text-muted-foreground/70 italic">
                      + mais {module.lessons - module.items.length} aulas...
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 p-6 rounded-xl bg-muted/50 border border-border text-center"
          >
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{totalLessons}+ aulas</span> em{" "}
              <span className="font-semibold text-foreground">{demoModules.length} módulos</span> com{" "}
              <span className="font-semibold text-foreground">12+ horas</span> de conteúdo prático
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
