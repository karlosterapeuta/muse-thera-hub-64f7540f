
import { Card } from "@/components/ui/card";
import {
  ClipboardList,
  FileText,
  Book,
  Users,
  ChartBar,
  Edit,
} from "lucide-react";

export default function Processes() {
  const processes = [
    {
      title: "Anamnese",
      description: "Coleta inicial de informações e histórico do paciente",
      icon: ClipboardList,
    },
    {
      title: "Avaliação",
      description: "Avaliação das necessidades e potencialidades musicoterapêuticas",
      icon: FileText,
    },
    {
      title: "Plano Terapêutico",
      description: "Definição dos objetivos e estratégias de tratamento",
      icon: Book,
    },
    {
      title: "Intervenção",
      description: "Aplicação das técnicas e atividades musicoterapêuticas",
      icon: Users,
    },
    {
      title: "Reavaliação",
      description: "Análise do progresso e ajustes no tratamento",
      icon: ChartBar,
    },
    {
      title: "Relatório",
      description: "Documentação e registro dos resultados",
      icon: Edit,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        Processos Musicoterapêuticos
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processes.map((process, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                <process.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2 text-primary">
                  {process.title}
                </h2>
                <p className="text-gray-600">{process.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
