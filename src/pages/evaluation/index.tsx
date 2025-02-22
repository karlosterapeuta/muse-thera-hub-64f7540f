import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";
import { TeaScalePDF } from "@/components/TeaScalePDF";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Patient {
  id: string;
  name: string;
  birth_date: string | null;
}

export default function Evaluation() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedEvaluation, setSelectedEvaluation] = useState("1");
  const [selections, setSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchPatients() {
      const { data, error } = await supabase
        .from('patients')
        .select('id, name, birth_date')
        .order('name');
      
      if (error) {
        console.error('Erro ao carregar pacientes:', error);
        return;
      }
      
      setPatients(data);
      if (data.length > 0) {
        setSelectedPatient(data[0].id);
      }
    }

    fetchPatients();
  }, []);

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

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
      ],
      inverseScoring: true
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
      ],
      doubleWeight: true
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
      ],
      doubleWeight: ["Imitação de canções", "Criação vocal"]
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

  const calculateScore = (section: typeof evaluationSections[0], parameter: string) => {
    const value = selections[`${section.title}-${parameter}`];
    if (!value) return 0;

    const isDoubleWeight = section.doubleWeight === true || 
      (Array.isArray(section.doubleWeight) && section.doubleWeight.includes(parameter));

    let score = 0;
    if (section.inverseScoring) {
      score = value === "nao" ? 2 : value === "pouco" ? 1 : 0;
    } else {
      score = value === "muito" ? 2 : value === "pouco" ? 1 : 0;
    }

    return isDoubleWeight ? score * 2 : score;
  };

  const calculateSectionScore = (section: typeof evaluationSections[0]) => {
    const maxPossibleScore = section.parameters.reduce((acc, param) => {
      const isDoubleWeight = section.doubleWeight === true || 
        (Array.isArray(section.doubleWeight) && section.doubleWeight.includes(param));
      return acc + (isDoubleWeight ? 4 : 2);
    }, 0);

    const actualScore = section.parameters.reduce((acc, param) => 
      acc + calculateScore(section, param), 0);

    return Math.round((actualScore / maxPossibleScore) * 100);
  };

  const calculateTotalProgress = () => {
    const totalSelections = Object.keys(selections).length;
    const totalParameters = evaluationSections.reduce(
      (acc, section) => acc + section.parameters.length, 0
    );
    const progress = (totalSelections / totalParameters) * 100;
    return {
      adquirido: Math.round(progress),
      naoAdquirido: Math.round(100 - progress)
    };
  };

  const categoryData = evaluationSections.map(section => ({
    name: section.title.split('/')[0].trim(),
    value: calculateSectionScore(section)
  }));

  const progress = calculateTotalProgress();
  const pieData = [
    { name: "Adquirido", value: progress.adquirido },
    { name: "Não adquirido", value: progress.naoAdquirido },
  ];

  const COLORS = ['#4ade80', '#ffa1b5'];

  const handleGeneratePDF = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) {
      toast.error("Erro ao gerar PDF");
      return;
    }

    const opt = {
      margin: 10,
      filename: `avaliacao-tea-${selectedPatientData?.name || 'paciente'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      toast.promise(html2pdf().set(opt).from(element).save(), {
        loading: "Gerando PDF...",
        success: "PDF gerado com sucesso!",
        error: "Erro ao gerar PDF"
      });
    } catch (error) {
      toast.error("Erro ao gerar PDF");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Select
              value={selectedPatient}
              onValueChange={setSelectedPatient}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Selecione o paciente" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPatientData && (
              <div>
                <p className="text-sm sm:text-base text-gray-600">
                  Data de Nascimento: {selectedPatientData.birth_date ? new Date(selectedPatientData.birth_date).toLocaleDateString('pt-BR') : 'Não informada'}
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Select
              value={selectedEvaluation}
              onValueChange={setSelectedEvaluation}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione a avaliação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Avaliação 1</SelectItem>
                <SelectItem value="2">Avaliação 2</SelectItem>
                <SelectItem value="3">Avaliação 3</SelectItem>
                <SelectItem value="4">Avaliação 4</SelectItem>
                <SelectItem value="5">Avaliação 5</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGeneratePDF}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Gerar PDF
            </Button>
          </div>
        </div>

        {evaluationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6 sm:mb-8">
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">{section.title}</h2>
              <p className="text-xs sm:text-sm text-gray-600">{section.description}</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Parâmetros</TableHead>
                    <TableHead className="w-16 sm:w-24 text-center">Não</TableHead>
                    <TableHead className="w-16 sm:w-24 text-center">Pouco</TableHead>
                    <TableHead className="w-16 sm:w-24 text-center">Muito</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.parameters.map((parameter, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm sm:text-base">{parameter}</TableCell>
                      <TableCell className="text-center p-2 sm:p-4">
                        <RadioGroup
                          value={selections[`${section.title}-${parameter}`]}
                          onValueChange={(value) => 
                            setSelections(prev => ({
                              ...prev,
                              [`${section.title}-${parameter}`]: value
                            }))
                          }
                          className="flex justify-center"
                        >
                          <div className="relative">
                            <RadioGroupItem
                              value="nao"
                              id={`${section.title}-${parameter}-nao`}
                              className="sr-only"
                            />
                            <label
                              htmlFor={`${section.title}-${parameter}-nao`}
                              className={`block w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-red-500 cursor-pointer ${
                                selections[`${section.title}-${parameter}`] === "nao"
                                  ? "bg-red-500"
                                  : "bg-white"
                              }`}
                            />
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell className="text-center p-2 sm:p-4">
                        <RadioGroup
                          value={selections[`${section.title}-${parameter}`]}
                          onValueChange={(value) => 
                            setSelections(prev => ({
                              ...prev,
                              [`${section.title}-${parameter}`]: value
                            }))
                          }
                          className="flex justify-center"
                        >
                          <div className="relative">
                            <RadioGroupItem
                              value="pouco"
                              id={`${section.title}-${parameter}-pouco`}
                              className="sr-only"
                            />
                            <label
                              htmlFor={`${section.title}-${parameter}-pouco`}
                              className={`block w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-yellow-500 cursor-pointer ${
                                selections[`${section.title}-${parameter}`] === "pouco"
                                  ? "bg-yellow-500"
                                  : "bg-white"
                              }`}
                            />
                          </div>
                        </RadioGroup>
                      </TableCell>
                      <TableCell className="text-center p-2 sm:p-4">
                        <RadioGroup
                          value={selections[`${section.title}-${parameter}`]}
                          onValueChange={(value) => 
                            setSelections(prev => ({
                              ...prev,
                              [`${section.title}-${parameter}`]: value
                            }))
                          }
                          className="flex justify-center"
                        >
                          <div className="relative">
                            <RadioGroupItem
                              value="muito"
                              id={`${section.title}-${parameter}-muito`}
                              className="sr-only"
                            />
                            <label
                              htmlFor={`${section.title}-${parameter}-muito`}
                              className={`block w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-green-500 cursor-pointer ${
                                selections[`${section.title}-${parameter}`] === "muito"
                                  ? "bg-green-500"
                                  : "bg-white"
                              }`}
                            />
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-semibold text-sm sm:text-base">Pontuação</TableCell>
                    <TableCell className="text-center text-sm sm:text-base">
                      {section.inverseScoring ? "2" : "0"}
                    </TableCell>
                    <TableCell className="text-center text-sm sm:text-base">1</TableCell>
                    <TableCell className="text-center text-sm sm:text-base">
                      {section.inverseScoring ? "0" : "2"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        ))}

        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
          Resultados da Escala de Avaliação TEA
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
              Habilidades Adquiridas
            </h3>
            <div className="h-[250px] sm:h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-xs sm:text-sm">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
              Desempenho por Categoria
            </h3>
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6D28D9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}
