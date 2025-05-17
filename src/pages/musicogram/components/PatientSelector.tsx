
import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Patient {
  id: string;
  name: string;
}

interface PatientSelectorProps {
  onPatientSelect: (patientId: string | null) => void;
  currentPatient: string | null;
}

export function PatientSelector({ onPatientSelect, currentPatient }: PatientSelectorProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('patients')
          .select('id, name')
          .order('name');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setPatients(data);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        // Fallback to demo data if error
        setPatients([
          { id: '1', name: 'Ana Silva' },
          { id: '2', name: 'Bruno Costa' },
          { id: '3', name: 'Carla Mendes' },
          { id: '4', name: 'Daniel Oliveira' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, []);
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="space-y-2">
      <Input
        placeholder="Buscar paciente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2"
      />
      
      <Select
        value={currentPatient}
        onValueChange={(value) => {
          const selectedPatient = patients.find(p => p.id === value);
          if (selectedPatient) {
            onPatientSelect(selectedPatient.id);
          } else {
            onPatientSelect(null);
          }
        }}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecionar paciente" />
        </SelectTrigger>
        <SelectContent>
          {filteredPatients.length === 0 ? (
            <SelectItem value="no-results" disabled>
              Nenhum paciente encontrado
            </SelectItem>
          ) : (
            filteredPatients.map(patient => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

export default PatientSelector;
