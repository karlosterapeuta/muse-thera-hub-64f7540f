
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarDays, Users } from "lucide-react";

const data = [
  { name: "Jan", sessions: 20 },
  { name: "Feb", sessions: 25 },
  { name: "Mar", sessions: 28 },
  { name: "Apr", sessions: 32 },
];

const upcomingSessions = [
  {
    id: 1,
    name: "João Silva",
    type: "Regular",
    date: "24/03/2024",
    time: "14:00",
  },
  {
    id: 2,
    name: "Maria Santos",
    type: "Initial",
    date: "24/03/2024",
    time: "15:30",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="text-primary" />
            <h3 className="text-lg font-semibold">Sessões esta Semana</h3>
          </div>
          <div className="text-2xl md:text-3xl font-bold mb-2">28</div>
          <div className="text-sm text-green-600">+8% vs. mês anterior</div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CalendarDays className="text-primary" />
            <h3 className="text-lg font-semibold">Taxa de Conclusão</h3>
          </div>
          <div className="text-2xl md:text-3xl font-bold mb-2">89%</div>
          <div className="text-sm text-green-600">+3% vs. mês anterior</div>
        </Card>
      </div>

      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Evolução de Sessões</h3>
        <div className="h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#6D28D9"
                strokeWidth={2}
                dot={{ fill: "#6D28D9" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Próximas Sessões</h3>
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <div
              key={session.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                  {session.name[0]}
                </div>
                <div>
                  <h4 className="font-semibold">{session.name}</h4>
                  <p className="text-sm text-gray-600">Sessão {session.type}</p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="font-semibold">{session.date}</p>
                <p className="text-sm text-gray-600">{session.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
