
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type Patient = {
  id: string;
  name: string;
};

export function useTreatmentPlanData() {
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const { toast } = useToast();

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      setUserEmail(user.email || "");
      setUserName(formatNameFromEmail(user.email || ""));

      console.log("Buscando pacientes para usuário:", user.id);
      
      const { data, error } = await supabase
        .from("patients")
        .select("id, name")
        .eq("professional_id", user.id)
        .order("name");

      if (error) throw error;
      
      console.log("Dados dos pacientes retornados:", data);
      console.log(`${data?.length || 0} pacientes encontrados`);
      
      setPatients(data || []);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de pacientes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    isLoading,
    patients,
    userEmail,
    userName,
  };
}
