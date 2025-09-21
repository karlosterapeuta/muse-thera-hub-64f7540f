
import { useState, useEffect } from "react";
import { AnamnesisList } from "./components/AnamnesisList";
import { AnamnesisView } from "./components/AnamnesisView";
import AnamnesisFormWrapper from "./AnamnesisFormWrapper";

type AnamnesisItem = {
  id: string;
  patient_id: string;
  created_at: string;
  updated_at: string;
  patient_name?: string;
  main_clinical_demand?: string;
};

type View = 'list' | 'form' | 'view';

export default function AnamnesisManager() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedAnamnesis, setSelectedAnamnesis] = useState<AnamnesisItem | null>(null);
  const [editAnamnesisId, setEditAnamnesisId] = useState<string | null>(null);
  const [editPatientId, setEditPatientId] = useState<string | null>(null);

  // Read URL parameters to handle direct navigation to edit mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patient_id');
    const anamnesisId = urlParams.get('anamnesis_id');
    const mode = urlParams.get('mode');

    if (mode === 'edit' && patientId && anamnesisId) {
      setEditPatientId(patientId);
      setEditAnamnesisId(anamnesisId);
      setCurrentView('form');
      // Clean URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const handleCreateNew = () => {
    setEditAnamnesisId(null);
    setEditPatientId(null);
    setSelectedAnamnesis(null);
    setCurrentView('form');
  };

  const handleEdit = (anamnesisId: string, patientId: string) => {
    setEditAnamnesisId(anamnesisId);
    setEditPatientId(patientId);
    setSelectedAnamnesis(null);
    setCurrentView('form');
  };

  const handleView = (anamnesis: AnamnesisItem) => {
    setSelectedAnamnesis(anamnesis);
    setEditAnamnesisId(null);
    setEditPatientId(null);
    setCurrentView('view');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedAnamnesis(null);
    setEditAnamnesisId(null);
    setEditPatientId(null);
  };

  if (currentView === 'form') {
    return (
      <AnamnesisFormWrapper 
        editAnamnesisId={editAnamnesisId}
        editPatientId={editPatientId}
        onBack={handleBackToList}
      />
    );
  }

  if (currentView === 'view' && selectedAnamnesis) {
    return (
      <AnamnesisView
        anamnesis={selectedAnamnesis}
        onBack={handleBackToList}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <AnamnesisList
      onCreateNew={handleCreateNew}
      onEdit={handleEdit}
      onView={handleView}
    />
  );
}
