console.log("🔧 Loading Dashboard component...");

import React from "react";

export default function Dashboard() {
  console.log("🎯 Dashboard component rendering...");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Sistema carregado com sucesso!</p>
        </div>
      </div>
    </div>
  );
}