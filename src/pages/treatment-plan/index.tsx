import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TreatmentPlanForm() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new comprehensive musicotherapy treatment plan
    navigate('/musicotherapy-treatment-plan', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Redirecionando para o novo plano musicoterapêutico...</p>
      </div>
    </div>
  );
}