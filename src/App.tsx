
import React from "react";
import "./App.css";
import BasicDashboard from "./pages/BasicDashboard";

const App = () => {
  console.log('App component starting to render');
  
  try {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <BasicDashboard />
      </div>
    );
  } catch (error) {
    console.error('App rendering failed:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Sistema Indisponível
          </h1>
          <p className="text-muted-foreground mb-6">
            Ocorreu um erro ao carregar a aplicação.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }
};

export default App;
