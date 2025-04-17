
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clinic } from "../types";
import { PostgrestError } from "@supabase/supabase-js";

export const useClinics = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["clinics"],
    queryFn: async (): Promise<Clinic[]> => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Fetch only clinics associated with the current user
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .eq("created_by", user.id)
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
    mutationFn: async (clinic: Pick<Clinic, "name" | "address" | "service_days" | "patient_ids">): Promise<Clinic> => {
      // Get the current user to set as creator
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      const { data, error } = await supabase
        .from("clinics")
        .insert({
          ...clinic,
          created_by: user.id // Add the user ID as creator
        })
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
    onError: (error: Error) => {
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
    mutationFn: async (clinic: Partial<Clinic> & { id: string }): Promise<Clinic> => {
      const { data, error } = await supabase
        .from("clinics")
        .update({
          name: clinic.name,
          address: clinic.address,
          service_days: clinic.service_days,
          patient_ids: clinic.patient_ids
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
    onError: (error: Error | PostgrestError) => {
      toast({
        title: "Erro ao atualizar clínica",
        description: "error" in error ? error.error : error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteClinic = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
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
    onError: (error: Error | PostgrestError) => {
      toast({
        title: "Erro ao excluir clínica",
        description: "error" in error ? error.error : error.message,
        variant: "destructive",
      });
    },
  });
};
