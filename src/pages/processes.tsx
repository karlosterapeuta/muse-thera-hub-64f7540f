
import { Card } from "@/components/ui/card";
import {
  ClipboardList,
  FileText,
  Book,
  Users,
  ChartBar,
  Edit,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Processes() {
  const processes = [
    {
      title: "Anamnese",
      description: "Coleta inicial de informações e histórico do paciente",
      icon: ClipboardList,
      path: "/anamnesis"
    },
    {
      title: "Avaliação",
      description: "Avaliação das necessidades e potencialidades musicoterapêuticas",
      icon: FileText,
      path: "/processos/avaliacao"
    },
    {
      title: "Plano Terapêutico",
      description: "Definição dos objetivos e estratégias de tratamento",
      icon: Book,
      path: "/processos/plano"
    },
    {
      title: "Intervenção",
      description: "Aplicação das técnicas e atividades musicoterapêuticas",
      icon: Users,
      path: "/intervention"
    },
    {
      title: "Reavaliação",
      description: "Análise do progresso e ajustes no tratamento",
      icon: ChartBar,
      path: "/processos/reavaliacao"
    },
    {
      title: "Relatório",
      description: "Documentação e registro dos resultados",
      icon: Edit,
      path: "/processos/relatorio"
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-primary">
        Processos Musicoterapêuticos
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {processes.map((process, index) => (
          <Link to={process.path} key={index}>
            <Card
              className="p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer group h-full"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <process.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
                    {process.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">{process.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
