
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ReportPage = () => {
  const [professionalInfo, setProfessionalInfo] = useState({
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

  const footer = `
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
    <div>
      {/* Report page content */}
      <h1>Report Page</h1>
      {/* This component would contain the actual report content */}
    </div>
  );
};

export default ReportPage;
