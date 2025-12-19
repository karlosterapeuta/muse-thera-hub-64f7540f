import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Por quanto tempo terei acesso ao curso?",
    answer: "Você terá acesso vitalício ao curso e todas as suas atualizações. Uma vez adquirido, o conteúdo é seu para sempre.",
  },
  {
    question: "O curso oferece certificado?",
    answer: "Sim! Ao concluir todas as aulas e atividades, você receberá um certificado digital que pode ser usado para comprovar sua qualificação.",
  },
  {
    question: "Preciso ter conhecimento prévio em música?",
    answer: "Não é necessário! O curso foi desenvolvido para todos os níveis, desde iniciantes até profissionais. Começamos do básico e avançamos gradualmente.",
  },
  {
    question: "Posso assistir no celular?",
    answer: "Sim! Nossa plataforma é totalmente responsiva e você pode assistir às aulas em qualquer dispositivo: computador, tablet ou celular.",
  },
  {
    question: "Como funciona a garantia?",
    answer: "Oferecemos 7 dias de garantia incondicional. Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do seu investimento.",
  },
  {
    question: "Terei suporte durante o curso?",
    answer: "Sim! Você terá acesso direto ao instrutor através da comunidade exclusiva de alunos, além de suporte por e-mail.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos pagamento via PIX com compensação imediata. Seu acesso é liberado automaticamente após a confirmação do pagamento.",
  },
  {
    question: "O conteúdo é atualizado?",
    answer: "Sim! O curso recebe atualizações periódicas com novos conteúdos, técnicas e materiais. Todas as atualizações são gratuitas para quem já é aluno.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ainda Tem Dúvidas?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confira as perguntas mais frequentes dos nossos alunos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-border rounded-xl px-6 bg-card data-[state=open]:border-primary/50"
              >
                <AccordionTrigger className="hover:no-underline py-5 text-left">
                  <span className="font-semibold text-foreground">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
