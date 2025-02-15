
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function Evaluation() {
  const [patient] = useState({
    name: "ANA",
    birthDate: "06/02/2025"
  });

  const evaluationSections = [
    {
      title: "Comportamentos restritivos",
      description: "Não = 2, Pouco = 1, Muito = 0",
      parameters: [
        "Estereotipias",
        "Agressividade",
        "Desinteresse",
        "Passividade",
        "Resistência",
        "Reclusão (isolamento)",
        "Pirraça"
      ]
    },
    {
      title: "Interação social / Cognição",
      description: "Não = 0, Pouco = 1, Muito = 2",
      parameters: [
        "Contato visual",
        "Comunicação verbal",
        "Interação com instrumentos musicais",
        "Interação com outros objetos",
        "Interação com educador ou musicoterapeuta",
        "Interação com pais (se aplicável)",
        "Interação com pares (se aplicável)",
        "Atenção",
        "Imitação"
      ]
    },
    {
      title: "Percepção / Exploração rítmica",
      description: "Não = 0, Pouco = 1, Muito = 2",
      parameters: [
        "Pulso interno (x2)",
        "Regulação temporal (x2)",
        "Apoio (x2)",
        "Ritmo real (x2)",
        "Contrastes de andamento (x2)"
      ]
    },
    {
      title: "Percepção / Exploração sonora",
      description: "Não = 0, Pouco = 1, Muito = 2",
      parameters: [
        "Som/silêncio",
        "Timbre",
        "Planos de altura",
        "Movimento sonoro",
        "Contrastes de intensidade",
        "Repetição de ideias rítmicas e/ou melódicas",
        "Senso de conclusão"
      ]
    },
    {
      title: "Exploração vocal",
      description: "Não = 0, Pouco = 1, Muito = 2",
      parameters: [
        "Vocalizações",
        "Balbucios",
        "Sílabas canônica",
        "Imitação de canções (x2)",
        "Criação vocal (x2)"
      ]
    },
    {
      title: "Movimentação corporal com a música",
      description: "Não = 0, Pouco = 1, Muito = 2",
      parameters: [
        "Andar",
        "Correr",
        "Parar",
        "Dançar",
        "Pular",
        "Gesticular",
        "Movimentar-se no lugar"
      ]
    }
  ];

  const categoryData = [
    { name: "Comportamentos Restritivos", value: 20 },
    { name: "Interação Social", value: 35 },
    { name: "Exploração Rítmica", value: 45 },
    { name: "Exploração Sonora", value: 30 },
    { name: "Exploração Vocal", value: 25 },
    { name: "Movimentação com a Música", value: 40 }
  ];

  const pieData = [
    { name: "Adquirido", value: 30 },
    { name: "Não adquirido", value: 70 },
  ];

  const COLORS = ['#4ade80', '#ffa1b5'];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{patient.name}</h1>
            <p className="text-gray-600">Data de Nascimento: {patient.birthDate}</p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full">
            Avaliação 1
          </div>
        </div>

        {evaluationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="text-sm text-gray-600">{section.description}</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parâmetros</TableHead>
                  <TableHead className="w-24 text-center">Não</TableHead>
                  <TableHead className="w-24 text-center">Pouco</TableHead>
                  <TableHead className="w-24 text-center">Muito</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {section.parameters.map((parameter, index) => (
                  <TableRow key={index}>
                    <TableCell>{parameter}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <div className="w-4 h-4 rounded-full border-2 border-red-500 bg-white" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <div className="w-4 h-4 rounded-full border-2 border-yellow-500 bg-white" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-white" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-semibold">Pontuação</TableCell>
                  <TableCell className="text-center">2</TableCell>
                  <TableCell className="text-center">1</TableCell>
                  <TableCell className="text-center">0</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ))}

        <h2 className="text-2xl font-bold mb-6 text-center">
          Resultados da Escala de Avaliação TEA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Habilidades Adquiridas
            </h3>
            <div className="h-[300px] flex items-center justify-center">
              <PieChart width={300} height={300}>
                <Pie
                  data={pieData}
                  cx={150}
                  cy={150}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Desempenho por Categoria
            </h3>
            <div className="h-[300px]">
              <BarChart
                width={500}
                height={300}
                data={categoryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#6D28D9" />
              </BarChart>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}
