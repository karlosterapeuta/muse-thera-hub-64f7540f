
import { Stethoscope } from "lucide-react";

export function TreatmentPlanHeader() {
  return (
    <div className="text-center space-y-4 pt-8 pb-4">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
        <Stethoscope className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
        Plano Terapêutico Musicoterapêutico
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Elabore um plano terapêutico personalizado e baseado em evidências científicas
      </p>
    </div>
  );
}
