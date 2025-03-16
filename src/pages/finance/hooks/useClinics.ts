
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clinic } from "../types";

export const useClinics = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["clinics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .order("name");
        
      if (error) {
        toast({
          title: "Erro ao carregar clínicas",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Clinic[];
    },
  });
};

export const useAddClinic = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (clinic: Pick<Clinic, "name" | "address">) => {
      const { data, error } = await supabase
        .from("clinics")
        .insert(clinic)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Clínica adicionada",
        description: "Clínica adicionada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar clínica",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateClinic = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (clinic: Partial<Clinic> & { id: string }) => {
      const { data, error } = await supabase
        .from("clinics")
        .update({
          name: clinic.name,
          address: clinic.address,
        })
        .eq("id", clinic.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Clínica atualizada",
        description: "Clínica atualizada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar clínica",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteClinic = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("clinics")
        .delete()
        .eq("id", id);
        
      if (error) {
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Clínica excluída",
        description: "Clínica excluída com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir clínica",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
