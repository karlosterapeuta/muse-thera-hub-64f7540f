
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PDFPreview } from "./PDFPreview";

export const ExamplePDFUsage = () => {
  const [title, setTitle] = useState("Meu Documento");
  const [content, setContent] = useState("Este é o conteúdo do meu documento PDF.");

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Gerador de PDF</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título do Documento</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do documento"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Conteúdo</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite o conteúdo do documento"
              rows={6}
            />
          </div>
        </div>
      </Card>

      <PDFPreview
        title={title}
        content={<p>{content}</p>}
        filename={`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`}
      />
    </div>
  );
};
