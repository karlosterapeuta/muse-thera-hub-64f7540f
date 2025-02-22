
import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TeaScalePDFProps {
  evaluationSections: any[];
  selections: Record<string, string>;
  categoryData: any[];
  pieData: any[];
}

export const TeaScalePDF: React.FC<TeaScalePDFProps> = ({
  evaluationSections,
  selections,
  categoryData,
  pieData
}) => {
  const COLORS = ['#4ade80', '#ffa1b5'];

  return (
    <div className="bg-white p-8" id="pdf-content">
      <h1 className="text-2xl font-bold mb-6 text-center">Escala de Avaliação TEA</h1>

      {evaluationSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="text-sm text-gray-600">{section.description}</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Parâmetros</TableHead>
                <TableHead className="w-24 text-center">Não</TableHead>
                <TableHead className="w-24 text-center">Pouco</TableHead>
                <TableHead className="w-24 text-center">Muito</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {section.parameters.map((parameter: string, index: number) => (
                <TableRow key={index}>
                  <TableCell>{parameter}</TableCell>
                  <TableCell className="text-center">
                    {selections[`${section.title}-${parameter}`] === "nao" ? "●" : "○"}
                  </TableCell>
                  <TableCell className="text-center">
                    {selections[`${section.title}-${parameter}`] === "pouco" ? "●" : "○"}
                  </TableCell>
                  <TableCell className="text-center">
                    {selections[`${section.title}-${parameter}`] === "muito" ? "●" : "○"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}

      <h2 className="text-2xl font-bold mb-6 text-center mt-8">
        Resultados da Escala de Avaliação TEA
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Habilidades Adquiridas
          </h3>
          <div className="h-[300px] w-full">
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Desempenho por Categoria
          </h3>
          <div className="h-[300px] w-full">
            <BarChart
              width={400}
              height={300}
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
          </div>
        </Card>
      </div>
    </div>
  );
};
