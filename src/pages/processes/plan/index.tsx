
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ReassessmentPlanForm } from "./components/ReassessmentPlanForm";
import { supabase } from "@/integrations/supabase/client";

// Define an interface for professionalInfo
interface ProfessionalInfo {
  name: string;
  phone: string;
  email: string;
}

const TreatmentPlanPage = () => {
  const [professionalInfo, setProfessionalInfo] = useState<ProfessionalInfo>({
    name: "",
    phone: "",
    email: ""
  });
  const { toast } = useToast();
  
  // Load professional data
  useEffect(() => {
    const loadProfessionalData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error("User not authenticated");
          return;
        }

        const { data, error } = await supabase
          .from('professionals')
          .select('name, phone, email')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error loading professional data:', error);
          return;
        }

        if (data) {
          setProfessionalInfo({
            name: data.name || "",
            phone: data.phone || "",
            email: data.email || ""
          });
        }
      } catch (error) {
        console.error('Failed to load professional data:', error);
        toast({
          title: "Error",
          description: "Could not load professional data",
          variant: "destructive",
        });
      }
    };

    loadProfessionalData();
  }, [toast]);

  // Generate footer with professional info
  const profFooter = `
    <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: left;">
      <p style="color: #111827; font-size: 15px; margin-bottom: 6px;">
        <strong>Nome:</strong> ${professionalInfo.name || "-"}
      </p>
      <p style="color: #111827; font-size: 15px; margin-bottom: 6px;">
        <strong>Telefone:</strong> ${professionalInfo.phone || "-"}
      </p>
      <p style="color: #111827; font-size: 15px;">
        <strong>Email:</strong> ${professionalInfo.email || "-"}
      </p>
    </div>
  `;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Plano de Tratamento</h1>
      <ReassessmentPlanForm form={{ control: { _formValues: { reassessments: [] } } }} />
      {/* More plan page content would go here */}
    </div>
  );
};

export default TreatmentPlanPage;
