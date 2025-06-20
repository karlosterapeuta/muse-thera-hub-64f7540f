
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Mail, Users, Star, Calendar, Target } from 'lucide-react';

export function PublicationSuggestions() {
  const journals = [
    {
      name: "Revista Brasileira de Musicoterapia",
      type: "Específica",
      qualis: "B3",
      issn: "1517-4433",
      website: "http://www.revistademusicoterapia.mus.br/",
      email: "revista@musicoterapia.mus.br",
      description: "Principal revista brasileira da área",
      impact: "Nacional",
      frequency: "Semestral",
      priority: "Alta",
      deadline: "Março/Setembro",
      notes: "Foco específico em musicoterapia - ideal para este artigo"
    },
    {
      name: "Revista InCantare",
      type: "Específica", 
      qualis: "B4",
      issn: "2317-417X",
      website: "http://periodicos.unespar.edu.br/index.php/incantare",
      email: "incantare@unespar.edu.br",
      description: "Revista de musicoterapia da UNESPAR",
      impact: "Regional",
      frequency: "Anual",
      priority: "Média",
      deadline: "Maio",
      notes: "Aceita trabalhos metodológicos e de validação"
    },
    {
      name: "Ciência & Saúde Coletiva",
      type: "Saúde Pública",
      qualis: "A2",
      issn: "1413-8123",
      website: "https://www.scielo.br/j/csc/",
      email: "revista@abrasco.org.br",
      description: "Revista de saúde pública com foco interdisciplinar",
      impact: "Internacional",
      frequency: "Mensal",
      priority: "Muito Alta",
      deadline: "Fluxo contínuo",
      notes: "Alto impacto - destaque para inovação metodológica"
    },
    {
      name: "Cadernos de Saúde Pública",
      type: "Saúde Pública",
      qualis: "A2",
      issn: "0102-311X",
      website: "https://www.scielo.br/j/csp/",
      email: "cadernos@fiocruz.br",
      description: "Revista da FIOCRUZ",
      impact: "Internacional",
      frequency: "Mensal",
      priority: "Muito Alta",
      deadline: "Fluxo contínuo",
      notes: "Aprecia instrumentos de medida em saúde"
    },
    {
      name: "Interface - Comunicação, Saúde, Educação",
      type: "Interdisciplinar",
      qualis: "A1",
      issn: "1414-3283",
      website: "https://www.scielo.br/j/icse/",
      email: "interface@fmb.unesp.br",
      description: "Revista interdisciplinar UNESP",
      impact: "Internacional",
      frequency: "Trimestral",
      priority: "Muito Alta",
      deadline: "Fluxo contínuo",
      notes: "Excelente para abordagem interdisciplinar"
    },
    {
      name: "Psicologia: Teoria e Pesquisa",
      type: "Psicologia",
      qualis: "A2",
      issn: "0102-3772",
      website: "https://www.scielo.br/j/ptp/",
      email: "revistaptp@gmail.com",
      description: "Revista de psicologia da UnB",
      impact: "Nacional",
      frequency: "Trimestral",
      priority: "Alta",
      deadline: "Fluxo contínuo",
      notes: "Interesse em instrumentos psicométricos"
    },
    {
      name: "Revista Paulista de Pediatria",
      type: "Pediatria",
      qualis: "A3",
      issn: "0103-0582",
      website: "https://www.scielo.br/j/rpp/",
      email: "revistapaulpediatr@gmail.com",
      description: "Para estudos com população pediátrica",
      impact: "Nacional",
      frequency: "Trimestral",
      priority: "Média",
      deadline: "Fluxo contínuo",
      notes: "Adequada se focar aplicação pediátrica"
    },
    {
      name: "Journal of Music Therapy",
      type: "Internacional",
      qualis: "A1",
      issn: "0022-2917",
      website: "https://academic.oup.com/jmt",
      email: "jmt@musictherapy.org",
      description: "Principal revista internacional (EUA)",
      impact: "Internacional",
      frequency: "Trimestral",
      priority: "Muito Alta",
      deadline: "Fluxo contínuo",
      notes: "Máximo impacto global - exige tradução"
    },
    {
      name: "The Arts in Psychotherapy",
      type: "Internacional",
      qualis: "A2",
      issn: "0197-4556",
      website: "https://www.journals.elsevier.com/the-arts-in-psychotherapy",
      email: "aip@elsevier.com",
      description: "Revista Elsevier de arteterapias",
      impact: "Internacional",
      frequency: "Bimestral",
      priority: "Alta",
      deadline: "Fluxo contínuo",
      notes: "Interesse em validação de instrumentos"
    },
    {
      name: "Music Therapy Perspectives",
      type: "Internacional",
      qualis: "A2",
      issn: "0734-6875",
      website: "https://academic.oup.com/mtp",
      email: "mtp@musictherapy.org",
      description: "Oxford University Press",
      impact: "Internacional",
      frequency: "Semestral",
      priority: "Alta",
      deadline: "Fluxo contínuo",
      notes: "Foco em prática clínica e instrumentos"
    }
  ];

  const getQualiBadgeColor = (qualis: string) => {
    switch (qualis) {
      case 'A1': return 'bg-green-600 text-white';
      case 'A2': return 'bg-green-500 text-white';
      case 'A3': return 'bg-yellow-500 text-white';
      case 'B1': return 'bg-yellow-400 text-black';
      case 'B2': return 'bg-orange-400 text-white';
      case 'B3': return 'bg-orange-500 text-white';
      case 'B4': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Muito Alta': return 'text-green-700 bg-green-100';
      case 'Alta': return 'text-blue-700 bg-blue-100';
      case 'Média': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const priorityJournals = journals.filter(j => j.priority === 'Muito Alta');
  const otherJournals = journals.filter(j => j.priority !== 'Muito Alta');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-green-600" />
          Periódicos Recomendados para Publicação
        </CardTitle>
        <p className="text-sm text-gray-600">
          Estratégia de submissão baseada em impacto e especificidade
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Periódicos Prioritários */}
        <div>
          <h3 className="font-semibold text-sm text-green-800 mb-3 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Primeira Linha (Prioridade Máxima)
          </h3>
          <div className="space-y-4">
            {priorityJournals.map((journal, index) => (
              <div key={index} className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm text-green-900">{journal.name}</h4>
                  <div className="flex gap-1">
                    <Badge className={`text-xs ${getQualiBadgeColor(journal.qualis)}`}>
                      {journal.qualis}
                    </Badge>
                    <Badge className="text-xs bg-green-600 text-white">
                      {journal.impact}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-green-700 mb-2">{journal.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-green-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {journal.frequency}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {journal.deadline}
                  </span>
                </div>
                
                <div className="bg-white p-2 rounded border border-green-200 mb-3">
                  <p className="text-xs text-green-800 font-medium">
                    💡 {journal.notes}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(journal.website, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Acessar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs border-green-400 text-green-700 hover:bg-green-100"
                    onClick={() => window.open(`mailto:${journal.email}?subject=Submissão de Artigo - Escala MuseTera`, '_blank')}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Contato
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outros Periódicos */}
        <div>
          <h3 className="font-semibold text-sm text-blue-800 mb-3">
            Opções Complementares
          </h3>
          <div className="space-y-3">
            {otherJournals.map((journal, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm">{journal.name}</h4>
                  <div className="flex gap-1">
                    <Badge className={`text-xs ${getQualiBadgeColor(journal.qualis)}`}>
                      {journal.qualis}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(journal.priority)}`}>
                      {journal.priority}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600">{journal.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">{journal.type}</span>
                  <span>ISSN: {journal.issn}</span>
                  <span>{journal.frequency}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs"
                    onClick={() => window.open(journal.website, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Site
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs"
                    onClick={() => window.open(`mailto:${journal.email}`, '_blank')}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Estratégia de Submissão */}
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-sm text-blue-800 mb-2">📋 Estratégia Recomendada de Submissão:</h4>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li><strong>1ª Escolha:</strong> Journal of Music Therapy (máximo impacto internacional)</li>
              <li><strong>2ª Escolha:</strong> Interface ou Ciência & Saúde Coletiva (alto impacto nacional)</li>
              <li><strong>3ª Escolha:</strong> Revista Brasileira de Musicoterapia (especificidade da área)</li>
              <li><strong>Paralelo:</strong> Considerar The Arts in Psychotherapy (internacional)</li>
            </ol>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-sm text-yellow-800 mb-2">⚡ Dicas para Aumentar Chances de Aceitação:</h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• <strong>Destaque a originalidade:</strong> Primeiro instrumento brasileiro específico</li>
              <li>• <strong>Enfatize a validação rigorosa:</strong> 120 participantes, análise estatística robusta</li>
              <li>• <strong>Mencione aplicabilidade clínica:</strong> Uso imediato na prática</li>
              <li>• <strong>Cite regulamentação recente:</strong> Lei 14.176/2021 como contexto</li>
              <li>• <strong>Prepare versão em inglês:</strong> Para periódicos internacionais</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-sm text-green-800 mb-2">🎯 Cronograma Sugerido:</h4>
            <div className="text-xs text-green-700 space-y-1">
              <p><strong>Semana 1-2:</strong> Finalizar manuscrito e preparar documentação</p>
              <p><strong>Semana 3:</strong> Submeter ao Journal of Music Therapy</p>
              <p><strong>Semana 4:</strong> Preparar versão em português para periódicos nacionais</p>
              <p><strong>Mês 2-3:</strong> Aguardar resposta e preparar segunda opção</p>
              <p><strong>Mês 4+:</strong> Responder revisões ou submeter à segunda opção</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
