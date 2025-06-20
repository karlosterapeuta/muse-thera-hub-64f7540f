
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, ClipboardList } from 'lucide-react';

export function PDFDownloadSection() {
  const handleDownloadArticle = () => {
    // Implementar geração de PDF do artigo completo
    window.print();
  };

  const handleDownloadScale = () => {
    // Criar PDF específico da escala para download
    const scaleContent = `
      ESCALA MUSETERA - SISTEMA DE AVALIAÇÃO MUSICOTERAPÊUTICA (0-6)
      
      INSTRUÇÕES DE USO:
      - Avalie cada domínio usando a escala de 0 a 6
      - Considere evidências observáveis
      - Use o contexto individual do paciente
      
      DOMÍNIOS DE AVALIAÇÃO:
      
      1. COGNITIVO
      □ 0 - Não Observado
      □ 1 - Emergente
      □ 2 - Inconsistente
      □ 3 - Moderado
      □ 4 - Consistente
      □ 5 - Avançado
      □ 6 - Excepcional
      
      2. MOTOR
      □ 0 - Não Observado
      □ 1 - Emergente
      □ 2 - Inconsistente
      □ 3 - Moderado
      □ 4 - Consistente
      □ 5 - Avançado
      □ 6 - Excepcional
      
      3. COMUNICATIVO
      □ 0 - Não Observado
      □ 1 - Emergente
      □ 2 - Inconsistente
      □ 3 - Moderado
      □ 4 - Consistente
      □ 5 - Avançado
      □ 6 - Excepcional
      
      4. SOCIAL
      □ 0 - Não Observado
      □ 1 - Emergente
      □ 2 - Inconsistente
      □ 3 - Moderado
      □ 4 - Consistente
      □ 5 - Avançado
      □ 6 - Excepcional
      
      5. EMOCIONAL
      □ 0 - Não Observado
      □ 1 - Emergente
      □ 2 - Inconsistente
      □ 3 - Moderado
      □ 4 - Consistente
      □ 5 - Avançado
      □ 6 - Excepcional
      
      6. SENSORIAL
      □ 0 - Não Observado
      □ 1 - Emergente
      □ 2 - Inconsistente
      □ 3 - Moderado
      □ 4 - Consistente
      □ 5 - Avançado
      □ 6 - Excepcional
      
      7. CRIATIVO
      □ 0 - Não Observado
      □ 1 - Emergente
      □ 2 - Inconsistente
      □ 3 - Moderado
      □ 4 - Consistente
      □ 5 - Avançado
      □ 6 - Excepcional
      
      INTERPRETAÇÃO DOS RESULTADOS:
      - Pontuação total: 0-42 pontos
      - Média por domínio: Soma total ÷ 7
      - Acompanhe a evolução ao longo do tempo
      
      Para mais informações: www.musetera.com.br
    `;
    
    const blob = new Blob([scaleContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Escala-MuseTera-Formulario.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadManual = () => {
    const manualContent = `
      MANUAL DE APLICAÇÃO - ESCALA MUSETERA
      
      OBJETIVO:
      A Escala MuseTera foi desenvolvida para avaliar o desenvolvimento terapêutico 
      em musicoterapia através de um sistema expandido de pontuação (0-6).
      
      APLICAÇÃO:
      1. Realize a observação durante a sessão de musicoterapia
      2. Avalie cada domínio baseado em evidências observáveis
      3. Considere o contexto individual e as características do paciente
      4. Documente observações específicas para justificar a pontuação
      
      CRITÉRIOS DE PONTUAÇÃO:
      
      0 - NÃO OBSERVADO:
      - Habilidade não demonstrada ou não observada
      - Ausência de comportamentos relacionados ao domínio
      
      1 - EMERGENTE:
      - Primeiros sinais da habilidade
      - Demonstrações muito esporádicas
      - Necessita de estímulo constante
      
      2 - INCONSISTENTE:
      - Habilidade presente mas variável
      - Qualidade inconsistente
      - Dependente do contexto
      
      3 - MODERADO:
      - Habilidade funcional
      - Requer apoio ou orientação
      - Demonstração regular com suporte
      
      4 - CONSISTENTE:
      - Habilidade bem estabelecida
      - Demonstração independente
      - Performance confiável
      
      5 - AVANÇADO:
      - Performance superior
      - Qualidade e refinamento
      - Generalização para outros contextos
      
      6 - EXCEPCIONAL:
      - Demonstração exemplar
      - Criatividade e maestria
      - Capacidade de ensinar outros
      
      FREQUÊNCIA DE APLICAÇÃO:
      - Avaliação inicial: Primeira sessão
      - Reavaliações: Mensais ou conforme necessário
      - Avaliação final: Última sessão do período
      
      INTERPRETAÇÃO:
      - Acompanhe tendências ao longo do tempo
      - Identifique áreas de progresso e necessidades
      - Use para planejamento terapêutico individualizado
      
      CONSIDERAÇÕES ÉTICAS:
      - Mantenha confidencialidade dos dados
      - Use apenas para fins terapêuticos
      - Documente adequadamente as observações
    `;
    
    const blob = new Blob([manualContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Manual-Escala-MuseTera.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Download className="h-5 w-5 text-blue-600" />
          Downloads Disponíveis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleDownloadArticle} 
          className="w-full justify-start"
          variant="outline"
        >
          <FileText className="h-4 w-4 mr-2" />
          Artigo Completo (PDF)
        </Button>
        
        <Button 
          onClick={handleDownloadScale} 
          className="w-full justify-start"
          variant="outline"
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          Escala MuseTera (Formulário)
        </Button>
        
        <Button 
          onClick={handleDownloadManual} 
          className="w-full justify-start"
          variant="outline"
        >
          <FileText className="h-4 w-4 mr-2" />
          Manual de Aplicação
        </Button>
        
        <div className="text-xs text-gray-500 mt-4">
          <p className="font-medium mb-1">Licença Creative Commons</p>
          <p>Este material pode ser usado livremente para fins acadêmicos e clínicos, com devida citação.</p>
        </div>
      </CardContent>
    </Card>
  );
}
