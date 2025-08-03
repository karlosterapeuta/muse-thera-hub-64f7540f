
import { getProfessionalId } from "./professionalService";
import { getPatientsCount, getAnamnesisCount, getReportsCount } from "./countsService";

export interface DashboardData {
  totalPatients: number;
  totalAnamnesis: number;
  totalReports: number;
  totalSessions: number;
  upcomingSessions: { id: string; patientName: string; time: string; }[];
  sessionData: { date: string; sessions: number; }[];
}

export async function getDashboardData(): Promise<DashboardData> {
  console.log("🔍 Carregando dados do dashboard...");
  
  try {
    const professionalId = await getProfessionalId();
    
    if (!professionalId) {
      console.log("❌ ID do profissional não encontrado");
      return {
        totalPatients: 0,
        totalAnamnesis: 0,
        totalReports: 0,
        totalSessions: 0,
        upcomingSessions: [],
        sessionData: [],
      };
    }

    // Buscar dados em paralelo
    const [totalPatients, totalAnamnesis, totalReports] = await Promise.all([
      getPatientsCount(professionalId),
      getAnamnesisCount(professionalId),
      getReportsCount(professionalId),
    ]);

    // Dados mockados para sessões (pode ser implementado posteriormente)
    const mockSessionData = [
      { date: "Seg", sessions: 3 },
      { date: "Ter", sessions: 2 },
      { date: "Qua", sessions: 4 },
      { date: "Qui", sessions: 1 },
      { date: "Sex", sessions: 3 },
      { date: "Sab", sessions: 0 },
      { date: "Dom", sessions: 0 },
    ];

    const mockUpcomingSessions = [
      { id: "1", patientName: "Maria Silva", time: "10:00 - 11:00" },
      { id: "2", patientName: "João Pereira", time: "14:00 - 15:00" },
      { id: "3", patientName: "Ana Souza", time: "16:00 - 17:00" },
    ];

    const result = {
      totalPatients,
      totalAnamnesis,
      totalReports,
      totalSessions: mockSessionData.reduce((acc, day) => acc + day.sessions, 0),
      upcomingSessions: mockUpcomingSessions,
      sessionData: mockSessionData,
    };

    console.log("✅ Dados do dashboard carregados:", result);
    return result;
  } catch (error) {
    console.error("❌ Erro ao carregar dados do dashboard:", error);
    return {
      totalPatients: 0,
      totalAnamnesis: 0,
      totalReports: 0,
      totalSessions: 0,
      upcomingSessions: [],
      sessionData: [],
    };
  }
}
