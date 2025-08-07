import React from "react";

export default function BasicDashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card text-card-foreground p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Pacientes</h3>
            <p className="text-2xl font-bold">--</p>
          </div>
          
          <div className="bg-card text-card-foreground p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Relatórios</h3>
            <p className="text-2xl font-bold">--</p>
          </div>
          
          <div className="bg-card text-card-foreground p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Sessões</h3>
            <p className="text-2xl font-bold">--</p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-card text-card-foreground p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Bem-vindo ao MuseTera</h3>
            <p className="text-muted-foreground">
              Sistema carregado com sucesso! Esta é uma versão básica do dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}