
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type Patient = {
  id: string;
  name: string;
  birth_date?: string;
  age?: number;
};

export function useReportData() {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [professionalData, setProfessionalData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const loadProfessionalData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: professional, error } = await supabase
        .from('professionals')
        .select('name, phone, email')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading professional data:', error);
        return;
      }

      if (professional) {
        setProfessionalData({
          name: professional.name || '',
          phone: professional.phone || '',
          email: professional.email || '',
        });
      }
    } catch (error) {
      console.error('Error loading professional data:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoadingPatients(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        setUserEmail(user.email || "");
        setUserName(formatNameFromEmail(user.email || ""));
        setUserId(user.id);

        console.log("Buscando pacientes para usuário:", user.id);
        
        const { data, error } = await supabase
          .from("patients")
          .select("id, name, birth_date, age")
          .eq("professional_id", user.id)
          .order("name");

        if (error) throw error;
        
        setPatients(data || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar a lista de pacientes",
        });
      } finally {
        setIsLoadingPatients(false);
      }
    }

    fetchData();
    loadProfessionalData();
  }, [toast]);

  return {
    patients,
    isLoadingPatients,
    userEmail,
    userName,
    userId,
    professionalData,
  };
}
