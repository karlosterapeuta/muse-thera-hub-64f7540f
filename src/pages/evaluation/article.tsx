
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function EvaluationArticle() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/documents/artigo-musetera.pdf';
    link.download = 'Artigo_MuseTera_Musicoterapia.pdf';
    link.click();
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/evaluation">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-sm sm:text-base font-semibold text-foreground leading-tight">
              Artigo Científico — Sistema MuseTera
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              José Carlos Batista da Silva · Faculdade Alpha · 2025
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Baixar PDF</span>
        </Button>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 min-h-0">
        <iframe
          src="/documents/artigo-musetera.pdf"
          className="w-full h-full border-0"
          title="Artigo Científico - Sistema MuseTera"
        />
      </div>
    </div>
  );
}
