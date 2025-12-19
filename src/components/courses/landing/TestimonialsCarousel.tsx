import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Ana Paula Silva",
    role: "Musicoterapeuta Clínica",
    avatar: "A",
    rating: 5,
    text: "Este curso transformou completamente minha prática. As técnicas são aplicáveis imediatamente e os resultados com meus pacientes foram surpreendentes!",
  },
  {
    name: "Carlos Eduardo",
    role: "Terapeuta Ocupacional",
    avatar: "C",
    rating: 5,
    text: "Mesmo não sendo da área de música, consegui aplicar os conceitos no meu trabalho. O conteúdo é didático e muito bem estruturado.",
  },
  {
    name: "Mariana Costa",
    role: "Mãe de criança TEA",
    avatar: "M",
    rating: 5,
    text: "Finalmente encontrei um curso que me ajuda a entender e aplicar a musicoterapia em casa. Meu filho adora as atividades!",
  },
  {
    name: "Dr. Ricardo Mendes",
    role: "Neurologista",
    avatar: "R",
    rating: 5,
    text: "A fundamentação científica deste curso é impecável. Recomendo para todos os profissionais da saúde.",
  },
  {
    name: "Fernanda Oliveira",
    role: "Professora de Música",
    avatar: "F",
    rating: 5,
    text: "Agregou muito à minha carreira como educadora musical. Agora consigo trabalhar com alunos especiais de forma muito mais eficaz.",
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O Que Nossos Alunos Dizem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Histórias reais de transformação profissional e pessoal
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-10 rounded-full h-12 w-12 border-border bg-card shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-10 rounded-full h-12 w-12 border-border bg-card shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Testimonial card */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center relative"
              >
                {/* Quote icon */}
                <Quote className="absolute top-6 left-6 h-8 w-8 text-primary/20" />

                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                  "{testimonials[currentIndex].text}"
                </p>

                {/* Author */}
                <div className="flex flex-col items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                    {testimonials[currentIndex].avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
