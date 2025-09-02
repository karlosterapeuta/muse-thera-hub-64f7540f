import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { 
  Share2,
  Copy,
  Mail,
  MessageSquare,
  Download,
  QrCode,
  Link,
  FileText,
  Image,
  Printer,
  Send,
  Users,
  Globe,
  Lock,
  Star,
  Calendar,
  Clock,
  Target
} from 'lucide-react';
import { Activity } from '../types';

interface AdvancedSharingProps {
  activity: Activity;
  userActivityData?: {
    ratings: Array<{ activityId: string; rating: number; review?: string }>;
    personalNotes: Array<{ activityId: string; note: string }>;
  };
}

interface ShareOptions {
  includePersonalNotes: boolean;
  includeRating: boolean;
  includeAdaptations: boolean;
  format: 'summary' | 'detailed' | 'checklist';
  audience: 'colleagues' | 'parents' | 'students' | 'general';
}

export const AdvancedSharing: React.FC<AdvancedSharingProps> = ({
  activity,
  userActivityData
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareOptions, setShareOptions] = useState<ShareOptions>({
    includePersonalNotes: false,
    includeRating: true,
    includeAdaptations: true,
    format: 'summary',
    audience: 'colleagues'
  });
  const [customMessage, setCustomMessage] = useState('');
  const [emailList, setEmailList] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const userRating = userActivityData?.ratings.find(r => r.activityId === activity.id.toString());
  const userNote = userActivityData?.personalNotes.find(n => n.activityId === activity.id.toString());

  const generateShareableContent = () => {
    const sections = [];

    // Header
    sections.push(`# ${activity.title}\n`);
    sections.push(`**Categoria:** ${activity.category}`);
    sections.push(`**Dificuldade:** ${activity.difficulty}`);
    sections.push(`**Duração:** ${activity.duration}`);
    sections.push(`**Faixa Etária:** ${activity.ageGroup}\n`);

    // Description
    sections.push(`## Descrição`);
    sections.push(`${activity.description}\n`);

    // Objectives
    if (activity.objectives && activity.objectives.length > 0) {
      sections.push(`## Objetivos Terapêuticos`);
      activity.objectives.forEach(obj => {
        sections.push(`- ${obj}`);
      });
      sections.push('');
    }

    // Format specific content
    if (shareOptions.format === 'detailed') {
      // Materials
      if (activity.materials && activity.materials.length > 0) {
        sections.push(`## Materiais Necessários`);
        activity.materials.forEach(material => {
          sections.push(`- ${material}`);
        });
        sections.push('');
      }

      // Instructions
      if (activity.instructions && activity.instructions.length > 0) {
        sections.push(`## Instruções`);
        activity.instructions.forEach((instruction, index) => {
          sections.push(`${index + 1}. ${instruction}`);
        });
        sections.push('');
      }

      // Benefits
      if (activity.benefits && activity.benefits.length > 0) {
        sections.push(`## Benefícios Esperados`);
        activity.benefits.forEach(benefit => {
          sections.push(`- ${benefit}`);
        });
        sections.push('');
      }
    }

    if (shareOptions.format === 'checklist') {
      sections.push(`## Lista de Verificação`);
      sections.push(`- [ ] Materiais preparados`);
      sections.push(`- [ ] Espaço organizado`);
      sections.push(`- [ ] Participantes orientados`);
      sections.push(`- [ ] Tempo reservado (${activity.duration})`);
      if (activity.preparationSteps) {
        activity.preparationSteps.forEach(step => {
          step.items.forEach(item => {
            sections.push(`- [ ] ${item.description}`);
          });
        });
      }
      sections.push('');
    }

    // Adaptations
    if (shareOptions.includeAdaptations && activity.adaptations && activity.adaptations.length > 0) {
      sections.push(`## Adaptações Possíveis`);
      activity.adaptations.forEach(adaptation => {
        sections.push(`- ${adaptation}`);
      });
      sections.push('');
    }

    // Personal content
    if (shareOptions.includeRating && userRating) {
      sections.push(`## Minha Avaliação`);
      sections.push(`**Nota:** ${'⭐'.repeat(userRating.rating)}`);
      if (userRating.review) {
        sections.push(`**Comentário:** ${userRating.review}`);
      }
      sections.push('');
    }

    if (shareOptions.includePersonalNotes && userNote) {
      sections.push(`## Minhas Anotações`);
      sections.push(userNote.note);
      sections.push('');
    }

    // Custom message
    if (customMessage.trim()) {
      sections.push(`## Mensagem Adicional`);
      sections.push(customMessage);
      sections.push('');
    }

    // Footer based on audience
    const audienceFooters = {
      colleagues: 'Compartilhado por um colega terapeuta através da plataforma de atividades terapêuticas.',
      parents: 'Esta atividade foi recomendada pelo terapeuta do seu filho.',
      students: 'Material educativo compartilhado para fins de aprendizagem.',
      general: 'Atividade terapêutica compartilhada para sua informação.'
    };

    sections.push(`---`);
    sections.push(audienceFooters[shareOptions.audience]);

    return sections.join('\n');
  };

  const generateShareLink = async () => {
    setIsGeneratingLink(true);
    
    // Simulate API call to generate shareable link
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const linkId = `activity_${activity.id}_${Date.now()}`;
    const link = `${window.location.origin}/shared-activity/${linkId}?format=${shareOptions.format}&audience=${shareOptions.audience}`;
    
    setShareLink(link);
    setIsGeneratingLink(false);
    
    toast({
      title: "Link gerado com sucesso!",
      description: "O link foi copiado para sua área de transferência.",
    });
    
    // Copy to clipboard
    navigator.clipboard.writeText(link);
  };

  const handleCopyContent = () => {
    const content = generateShareableContent();
    navigator.clipboard.writeText(content);
    
    toast({
      title: "Conteúdo copiado!",
      description: "O conteúdo da atividade foi copiado para sua área de transferência.",
    });
  };

  const handleEmailShare = () => {
    const content = generateShareableContent();
    const subject = `Atividade Terapêutica: ${activity.title}`;
    const body = encodeURIComponent(content);
    
    if (emailList.trim()) {
      // For multiple emails, we would normally send via backend
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "O envio por email será implementado em breve.",
      });
    } else {
      // Open default email client
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
    }
  };

  const handleDownloadPDF = () => {
    // This would integrate with a PDF library
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O download em PDF será implementado em breve.",
    });
  };

  const handlePrint = () => {
    const content = generateShareableContent();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${activity.title}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
              h1, h2 { color: #333; }
              ul, ol { margin-left: 20px; }
              hr { margin: 20px 0; }
            </style>
          </head>
          <body>
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${content}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'summary': return 'Resumo com informações essenciais';
      case 'detailed': return 'Versão completa com todos os detalhes';
      case 'checklist': return 'Lista de verificação para preparação';
      default: return '';
    }
  };

  const getAudienceDescription = (audience: string) => {
    switch (audience) {
      case 'colleagues': return 'Outros profissionais terapeutas';
      case 'parents': return 'Pais e responsáveis';
      case 'students': return 'Estudantes e estagiários';
      case 'general': return 'Público em geral';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Compartilhar Atividade
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Activity Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{activity.category}</Badge>
                    <Badge variant="outline">{activity.difficulty}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activity.duration}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Opções de Compartilhamento</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Formato</label>
                <Select 
                  value={shareOptions.format} 
                  onValueChange={(value: any) => setShareOptions({...shareOptions, format: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">
                      <div>
                        <div>Resumo</div>
                        <div className="text-xs text-muted-foreground">Informações essenciais</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="detailed">
                      <div>
                        <div>Detalhado</div>
                        <div className="text-xs text-muted-foreground">Versão completa</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="checklist">
                      <div>
                        <div>Lista de Verificação</div>
                        <div className="text-xs text-muted-foreground">Para preparação</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Público-alvo</label>
                <Select 
                  value={shareOptions.audience} 
                  onValueChange={(value: any) => setShareOptions({...shareOptions, audience: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colleagues">Colegas Terapeutas</SelectItem>
                    <SelectItem value="parents">Pais e Responsáveis</SelectItem>
                    <SelectItem value="students">Estudantes</SelectItem>
                    <SelectItem value="general">Público Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Include Options */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Incluir no Compartilhamento</h5>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="adaptations"
                    checked={shareOptions.includeAdaptations}
                    onCheckedChange={(checked) => 
                      setShareOptions({...shareOptions, includeAdaptations: !!checked})
                    }
                  />
                  <label htmlFor="adaptations" className="text-sm">
                    Adaptações possíveis
                  </label>
                </div>

                {userRating && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rating"
                      checked={shareOptions.includeRating}
                      onCheckedChange={(checked) => 
                        setShareOptions({...shareOptions, includeRating: !!checked})
                      }
                    />
                    <label htmlFor="rating" className="text-sm">
                      Minha avaliação ({userRating.rating} estrelas)
                    </label>
                  </div>
                )}

                {userNote && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notes"
                      checked={shareOptions.includePersonalNotes}
                      onCheckedChange={(checked) => 
                        setShareOptions({...shareOptions, includePersonalNotes: !!checked})
                      }
                    />
                    <label htmlFor="notes" className="text-sm">
                      Minhas anotações pessoais
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <label className="text-sm font-medium mb-2 block">Mensagem Adicional (opcional)</label>
              <Textarea
                placeholder="Adicione uma mensagem personalizada..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Sharing Methods */}
          <div className="space-y-4">
            <h4 className="font-medium">Métodos de Compartilhamento</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={handleCopyContent}
              >
                <Copy className="h-5 w-5" />
                <div className="text-center">
                  <div className="text-sm font-medium">Copiar Conteúdo</div>
                  <div className="text-xs text-muted-foreground">Para colar em outro lugar</div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={generateShareLink}
                disabled={isGeneratingLink}
              >
                <Link className="h-5 w-5" />
                <div className="text-center">
                  <div className="text-sm font-medium">
                    {isGeneratingLink ? 'Gerando...' : 'Gerar Link'}
                  </div>
                  <div className="text-xs text-muted-foreground">Link compartilhável</div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={handleEmailShare}
              >
                <Mail className="h-5 w-5" />
                <div className="text-center">
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-xs text-muted-foreground">Enviar por email</div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={handlePrint}
              >
                <Printer className="h-5 w-5" />
                <div className="text-center">
                  <div className="text-sm font-medium">Imprimir</div>
                  <div className="text-xs text-muted-foreground">Versão impressa</div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={handleDownloadPDF}
              >
                <Download className="h-5 w-5" />
                <div className="text-center">
                  <div className="text-sm font-medium">Download PDF</div>
                  <div className="text-xs text-muted-foreground">Arquivo em PDF</div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => {
                  toast({
                    title: "Funcionalidade em desenvolvimento",
                    description: "QR Code será implementado em breve.",
                  });
                }}
              >
                <QrCode className="h-5 w-5" />
                <div className="text-center">
                  <div className="text-sm font-medium">QR Code</div>
                  <div className="text-xs text-muted-foreground">Código QR</div>
                </div>
              </Button>
            </div>

            {/* Email List for Multiple Recipients */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Enviar para múltiplos emails (opcional)
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="email1@example.com, email2@example.com..."
                  value={emailList}
                  onChange={(e) => setEmailList(e.target.value)}
                />
                <Button 
                  variant="outline"
                  onClick={handleEmailShare}
                  disabled={!emailList.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Generated Link Display */}
            {shareLink && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Link className="h-4 w-4" />
                    <span className="text-sm font-medium">Link Gerado</span>
                  </div>
                  <div className="flex gap-2">
                    <Input value={shareLink} readOnly className="text-xs" />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(shareLink);
                        toast({
                          title: "Link copiado!",
                          description: "O link foi copiado para sua área de transferência.",
                        });
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};