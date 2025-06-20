
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Mail, Users } from 'lucide-react';

export function PublicationSuggestions() {
  const journals = [
    {
      name: "Revista Brasileira de Musicoterapia",
      type: "Específica",
      qualis: "B3",
      issn: "1517-4433",
      website: "http://www.revistademusicoterapia.mus.br/",
      email: "revista@musicoterapia.mus.br",
      description: "Principal revista brasileira da área"
    },
    {
      name: "Revista InCantare",
      type: "Específica", 
      qualis: "B4",
      issn: "2317-417X",
      website: "http://periodicos.unespar.edu.br/index.php/incantare",
      email: "incantare@unespar.edu.br",
      description: "Revista de musicoterapia da UNESPAR"
    },
    {
      name: "Ciência & Saúde Coletiva",
      type: "Saúde Pública",
      qualis: "A2",
      issn: "1413-8123",
      website: "https://www.scielo.br/j/csc/",
      email: "revista@abrasco.org.br",
      description: "Revista de saúde pública com foco interdisciplinar"
    },
    {
      name: "Cadernos de Saúde Pública",
      type: "Saúde Pública",
      qualis: "A2",
      issn: "0102-311X",
      website: "https://www.scielo.br/j/csp/",
      email: "cadernos@fiocruz.br",
      description: "Revista da FIOCRUZ"
    },
    {
      name: "Interface - Comunicação, Saúde, Educação",
      type: "Interdisciplinar",
      qualis: "A1",
      issn: "1414-3283",
      website: "https://www.scielo.br/j/icse/",
      email: "interface@fmb.unesp.br",
      description: "Revista interdisciplinar UNESP"
    },
    {
      name: "Psicologia: Teoria e Pesquisa",
      type: "Psicologia",
      qualis: "A2",
      issn: "0102-3772",
      website: "https://www.scielo.br/j/ptp/",
      email: "revistaptp@gmail.com",
      description: "Revista de psicologia da UnB"
    },
    {
      name: "Revista Paulista de Pediatria",
      type: "Pediatria",
      qualis: "A3",
      issn: "0103-0582",
      website: "https://www.scielo.br/j/rpp/",
      email: "revistapaulpediatr@gmail.com",
      description: "Para estudos com população pediátrica"
    },
    {
      name: "Journal of Music Therapy",
      type: "Internacional",
      qualis: "A1",
      issn: "0022-2917",
      website: "https://academic.oup.com/jmt",
      email: "jmt@musictherapy.org",
      description: "Principal revista internacional (EUA)"
    }
  ];

  const getQualiBadgeColor = (qualis: string) => {
    switch (qualis) {
      case 'A1': return 'bg-green-500';
      case 'A2': return 'bg-green-400';
      case 'A3': return 'bg-yellow-500';
      case 'B1': return 'bg-yellow-400';
      case 'B2': return 'bg-orange-400';
      case 'B3': return 'bg-orange-500';
      case 'B4': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-green-600" />
          Sugestões para Publicação
        </CardTitle>
        <p className="text-sm text-gray-600">
          Periódicos brasileiros e internacionais recomendados
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {journals.map((journal, index) => (
          <div key={index} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm">{journal.name}</h4>
              <Badge className={`text-xs ${getQualiBadgeColor(journal.qualis)}`}>
                {journal.qualis}
              </Badge>
            </div>
            
            <p className="text-xs text-gray-600">{journal.description}</p>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">{journal.type}</span>
              <span>ISSN: {journal.issn}</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2 text-xs"
                onClick={() => window.open(journal.website, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Site
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2 text-xs"
                onClick={() => window.open(`mailto:${journal.email}`, '_blank')}
              >
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-sm text-blue-800 mb-2">Dicas para Submissão:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Verifique as normas específicas de cada revista</li>
            <li>• Considere o escopo e público-alvo do periódico</li>
            <li>• Priorize revistas com Qualis A1-A2 para maior impacto</li>
            <li>• Revise cuidadosamente antes da submissão</li>
            <li>• Prepare material suplementar quando necessário</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
