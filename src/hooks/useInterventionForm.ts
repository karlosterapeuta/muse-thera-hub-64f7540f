import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatNameFromEmail } from "@/lib/intervention-utils";

type Patient = {
  id: string;
  name: string;
};

export function useInterventionForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedDemands, setSelectedDemands] = useState<Record<string, string[]>>({});
  const [selectedSubDemands, setSelectedSubDemands] = useState<Record<string, string[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingPatients(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            variant: "destructive",
            title: "Não autenticado",
            description: "Você precisa estar logado para acessar esta página.",
          });
          navigate("/login");
          return;
        }

        setUserEmail(user.email || "");
        setUserName(formatNameFromEmail(user.email || ""));

        const { data, error } = await supabase
          .from("patients")
          .select("id, name")
          .eq("professional_id", user.id)
          .order("name");

        if (error) {
          toast({
            variant: "destructive",
            title: "Erro ao carregar pacientes",
            description: "Não foi possível carregar a lista de pacientes.",
          });
          return;
        }

        setPatients(data || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao buscar informações do usuário.",
        });
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchUserData();
  }, [toast, navigate]);

  const handleDemandToggle = (disorder: string, demand: string) => {
    setSelectedDemands(prev => {
      const current = prev[disorder] || [];
      const updated = current.includes(demand)
        ? current.filter(d => d !== demand)
        : [...current, demand];
      
      return {
        ...prev,
        [disorder]: updated
      };
    });
  };

  const handleSubDemandToggle = (category: string, subDemandLabel: string) => {
    setSelectedSubDemands(prev => {
      const current = prev[category] || [];
      const updated = current.includes(subDemandLabel)
        ? current.filter(d => d !== subDemandLabel)
        : [...current, subDemandLabel];
      
      return {
        ...prev,
        [category]: updated
      };
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const resetForm = () => {
    setSelectedPatient("");
    setSelectedDemands({});
    setSelectedSubDemands({});
    setExpandedCategories({});
  };

  return {
    patients,
    isLoadingPatients,
    selectedPatient,
    setSelectedPatient,
    selectedDemands,
    selectedSubDemands,
    expandedCategories,
    userEmail,
    userName,
    handleDemandToggle,
    handleSubDemandToggle,
    toggleCategory,
    resetForm,
  };
}
