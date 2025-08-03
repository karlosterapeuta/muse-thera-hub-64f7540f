import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarDays, Clock } from "lucide-react";
import LogoRound from "@/components/LogoRound";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";
import { getDashboardData } from "./services/dashboardService";
import { DashboardStats } from "./components/DashboardStats";

interface DashboardData {
  totalPatients: number;
  totalAnamnesis: number;
  totalReports: number;
  totalSessions: number;
  upcomingSessions: { id: string; patientName: string; time: string; }[];
  sessionData: { date: string; sessions: number; }[];
  isLoading: boolean;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalPatients: 0,
    totalAnamnesis: 0,
    totalReports: 0,
    totalSessions: 0,
    upcomingSessions: [],
    sessionData: [],
    isLoading: true,
  });

  useEffect(() => {
    async function loadDashboardData() {
      const data = await getDashboardData();
      setDashboardData({ ...data, isLoading: false });
    }

    loadDashboardData();
  }, []);

  const data = [
    {
      name: "Seg",
      pacientes: 4000,
      receita: 2400,
      amt: 2400,
    },
    {
      name: "Ter",
      pacientes: 3000,
      receita: 1398,
      amt: 2210,
    },
    {
      name: "Qua",
      pacientes: 2000,
      receita: 9800,
      amt: 2290,
    },
    {
      name: "Qui",
      pacientes: 2780,
      receita: 3908,
      amt: 2000,
    },
    {
      name: "Sex",
      pacientes: 1890,
      receita: 4800,
      amt: 2181,
    },
    {
      name: "Sab",
      pacientes: 2390,
      receita: 3800,
      amt: 2500,
    },
    {
      name: "Dom",
      pacientes: 3490,
      receita: 4300,
      amt: 2100,
    },
  ];

  const upcomingSessions = [
    {
      id: "1",
      patientName: "Maria Silva",
      time: "10:00 - 11:00",
    },
    {
      id: "2",
      patientName: "João Pereira",
      time: "14:00 - 15:00",
    },
    {
      id: "3",
      patientName: "Ana Souza",
      time: "16:00 - 17:00",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Dashboard
              </h2>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4">
              <span className="sm:ml-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <CalendarDays
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Relatório Mensal
                </button>
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4">
            {/* Stats Cards */}
            <DashboardStats
              totalPatients={dashboardData.totalPatients}
              totalReports={dashboardData.totalReports}
              isLoading={dashboardData.isLoading}
            />

            {/* Sessions Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sessões da Semana</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.isLoading ? (
                  <Skeleton className="w-full h-64" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.sessionData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sessions" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Próximas Sessões</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {dashboardData.isLoading ? (
                  <div className="flex flex-col space-y-2">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead className="text-right">Horário</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardData.upcomingSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">{session.patientName}</TableCell>
                          <TableCell className="text-right">{session.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
