
import { Card } from "@/components/ui/card";
import { PDFButton } from "./PDFButton";

interface PDFPreviewProps {
  title: string;
  content: React.ReactNode;
  filename?: string;
}

export const PDFPreview = ({ title, content, filename }: PDFPreviewProps) => {
  // Converter o conteúdo React para HTML string
  const htmlContent = `
    <div class="header">
      <h1 class="title">${title}</h1>
      <p class="subtitle">Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
    <div class="content">
      ${typeof content === 'string' ? content : ''}
    </div>
    <div class="footer">
      <p>Documento gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
    </div>
  `;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Visualização do Documento</h3>
        <PDFButton 
          htmlContent={htmlContent}
          filename={filename}
          variant="default"
        />
      </div>
      
      <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px]">
        <div className="text-center border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-blue-600">{title}</h1>
          <p className="text-gray-600">Gerado em {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="prose max-w-none">
          {content}
        </div>
      </div>
    </Card>
  );
};
