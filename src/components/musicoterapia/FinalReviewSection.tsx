import React, { useState, useRef } from 'react';
import { Eye, Zap, Download, FileText, Loader2, Upload, Image, X, Save, CheckCircle, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ReportData } from '@/data/musicoterapiaTemplate';
import { getMusicoterapiaQualityWarnings } from '@/utils/musicoterapiaQuality';
import { getSelectedMusicoterapiaObjectives, musicoterapiaObjectiveCategories } from '@/data/musicoterapiaObjectives';
import { getSelectedMusicoterapiaApproaches } from '@/data/musicoterapiaApproaches';
import { MusicoterapiaApproachResultsSummary } from './MusicoterapiaApproachResultsSummary';
import { MusicoterapiaObjectiveFlowSummary } from './MusicoterapiaObjectiveFlowSummary';
import { MusicoterapiaReferralSummary } from './MusicoterapiaReferralSummary';

interface FinalReviewSectionProps {
  reportData: Partial<ReportData>;
  onSaveReport: () => void;
  logoUrl: string | null;
  onLogoChange: (logoUrl: string | null) => void;
  onExportPDF: (logoUrl?: string | null) => Promise<void>;
  isExporting: boolean;
  isSaving: boolean;
  professionalData?: any;
}

export function FinalReviewSection({
  reportData,
  onSaveReport,
  logoUrl,
  onLogoChange,
  onExportPDF,
  isExporting,
  isSaving,
  professionalData
}: FinalReviewSectionProps) {
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Tipo de arquivo invalido",
        description: "Por favor, selecione apenas arquivos de imagem (PNG, JPG, etc.)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "A imagem deve ter no maximo 5MB",
      });
      return;
    }

    setIsUploadingLogo(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario nao autenticado");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('report-logos')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('report-logos')
        .getPublicUrl(fileName);

      onLogoChange(publicUrl);

      toast({
        title: "Logo enviada com sucesso!",
        description: "A logo sera incluida no PDF gerado.",
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Nao foi possivel enviar a logo. Tente novamente.",
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Logo removida",
      description: "A logo foi removida do relatorio.",
    });
  };

  const renderPreviewContent = () => {
    const fields = reportData.fieldValues || {};
    const selectedObjectives = getSelectedMusicoterapiaObjectives(fields.therapeutic_objective_ids);
    const selectedApproaches = getSelectedMusicoterapiaApproaches(fields.musicoterapia_approach_ids);
    const isLegacyReport = selectedApproaches.length === 0;
    const complementaryObjectives = Array.isArray(fields.therapeutic_objectives)
      ? fields.therapeutic_objectives.filter((value: unknown) => String(value ?? '').trim())
      : String(fields.therapeutic_objectives ?? '').trim()
        ? [String(fields.therapeutic_objectives)]
        : [];

    return (
      <div className="max-w-4xl mx-auto bg-white">
        <div className="relative bg-gradient-to-r from-[#0d0d0d] to-[#1a1a1a] text-white p-4 sm:p-8 rounded-t-lg">
          <div className="absolute top-4 right-4 opacity-20">
            <FileText className="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Relatorio MuseTera TEA</h1>
            <p className="text-[#c9a84c] text-base sm:text-lg">Musicoterapia para Transtorno do Espectro Autista</p>
            <div className="mt-4 text-xs sm:text-sm text-[#c9a84c]/80">
              Gerado em {new Date().toLocaleDateString('pt-BR')} as {new Date().toLocaleTimeString('pt-BR')}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-l-4 border-l-[#c9a84c] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-base sm:text-lg">
                  <div className="w-8 h-8 bg-[#c9a84c]/20 rounded-full flex items-center justify-center text-sm">
                    P
                  </div>
                  Dados do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Nome:</span>
                  <span className="text-foreground">{reportData.patientName || 'Nao informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Idade:</span>
                  <span className="text-foreground">{reportData.patientAge || 'Nao informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Diagnostico:</span>
                  <span className="text-foreground">{reportData.patientDiagnosis || 'Nao informado'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#c9a84c] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-base sm:text-lg">
                  <div className="w-8 h-8 bg-[#c9a84c]/20 rounded-full flex items-center justify-center text-sm">
                    M
                  </div>
                  Dados do Profissional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Nome:</span>
                  <span className="text-foreground">{reportData.professionalName || 'Nao informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Registro:</span>
                  <span className="text-foreground">{reportData.professionalRegistry || 'Nao informado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Data da Sessao:</span>
                  <span className="text-foreground">{reportData.sessionDate ? new Date(reportData.sessionDate).toLocaleDateString('pt-BR') : 'Nao informado'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

      <MusicoterapiaReferralSummary source={fields.referral_source} reason={fields.referral_reason} />

          {selectedObjectives.length > 0 && (
            <Card className="border border-[#c9a84c]/30">
              <CardHeader>
                <CardTitle className="text-[#c9a84c]">Objetivos a estimular ou desenvolver</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">Objetivos planejados; não representam conquistas já observadas.</p>
                {musicoterapiaObjectiveCategories.map((category) => {
                  const group = selectedObjectives.filter((objective) => objective.category === category.id);
                  if (!group.length) return null;
                  return (
                    <section key={category.id} className="space-y-2">
                      <h4 className="text-sm font-semibold text-[#c9a84c]">{category.icon} {category.title}</h4>
                      {group.map((objective) => (
                        <div key={objective.id} className="rounded-lg border border-[#c9a84c]/20 p-3 bg-[#c9a84c]/5">
                          <p className="font-semibold text-sm">{objective.icon} {objective.title}</p>
                          <p className="text-sm mt-1 leading-relaxed">{objective.objective}</p>
                        </div>
                      ))}
                    </section>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {selectedObjectives.length === 0 && complementaryObjectives.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-[#c9a84c]/20 to-[#c9a84c]/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-xs">O</div>
                  Objetivos complementares
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="space-y-2 sm:space-y-3">
                  {complementaryObjectives.map((objective: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2 sm:p-3 bg-[#c9a84c]/10 rounded-lg border border-[#c9a84c]/20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-[#c9a84c] font-bold text-[10px] sm:text-xs mt-0.5 flex-shrink-0">{index + 1}</div>
                      <p className="text-foreground leading-relaxed flex-1">{objective}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedApproaches.length > 0 && (
            <Card className="border border-[#c9a84c]/30">
              <CardHeader>
                <CardTitle className="text-[#c9a84c]">Abordagem Musicoterapêutica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Abordagens selecionadas pelo profissional. A escolha não comprova aplicação ou resultados.
                </p>
                {selectedApproaches.map((approach) => (
                  <div key={approach.id} className="rounded-lg border border-[#c9a84c]/20 p-3 bg-[#c9a84c]/5 space-y-1">
                    <p className="font-semibold text-sm">{approach.title}</p>
                    <p className="text-sm leading-relaxed">{approach.description}</p>
                    <p className="text-sm leading-relaxed"><strong>Objetivos possíveis:</strong> {approach.goals}</p>
                    {approach.clinicalNote && (
                      <p className="text-xs text-muted-foreground">Nota clínica: {approach.clinicalNote}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <MusicoterapiaApproachResultsSummary approachIds={fields.musicoterapia_approach_ids} results={fields.approach_results} />
          <MusicoterapiaObjectiveFlowSummary objectiveIds={fields.therapeutic_objective_ids} outcomes={fields.objective_outcomes} />

          {isLegacyReport && fields.session_activities && Array.isArray(fields.session_activities) && fields.session_activities.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-[#c9a84c]/20 to-[#c9a84c]/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-xs">A</div>
                  Atividades Realizadas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="space-y-2 sm:space-y-3">
                  {fields.session_activities.map((activity: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2 sm:p-3 bg-[#c9a84c]/10 rounded-lg border border-[#c9a84c]/20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-[#c9a84c] font-bold text-[10px] sm:text-xs mt-1 flex-shrink-1">-</div>
                      <p className="text-foreground leading-relaxed flex-1">{activity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {isLegacyReport && fields.patient_evolution && Array.isArray(fields.patient_evolution) && fields.patient_evolution.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-[#c9a84c]/20 to-[#c9a84c]/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-xs">E</div>
                  Evolucao do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="space-y-2 sm:space-y-3">
                  {fields.patient_evolution.map((evolution: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2 sm:p-3 bg-[#c9a84c]/10 rounded-lg border border-[#c9a84c]/20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-[#c9a84c] font-bold text-[10px] sm:text-xs mt-1 flex-shrink-0">ok</div>
                      <p className="text-foreground leading-relaxed flex-1">{evolution}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {fields.recommendations && Array.isArray(fields.recommendations) && fields.recommendations.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-[#c9a84c]/20 to-[#c9a84c]/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-xs">R</div>
                  Recomendacoes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="space-y-2 sm:space-y-3">
                  {fields.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2 sm:p-3 bg-[#c9a84c]/10 rounded-lg border border-[#c9a84c]/20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-[#c9a84c] font-bold text-[10px] sm:text-xs mt-1 flex-shrink-1">&gt;</div>
                      <p className="text-foreground leading-relaxed flex-1">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {fields.conclusion && Array.isArray(fields.conclusion) && fields.conclusion.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-[#c9a84c]/20 to-[#c9a84c]/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-[#c9a84c] text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-xs">C</div>
                  Conclusao
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="space-y-2 sm:space-y-3">
                  {fields.conclusion.map((conclusion: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2 sm:p-3 bg-[#c9a84c]/10 rounded-lg border border-[#c9a84c]/20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#c9a84c]/30 rounded-full flex items-center justify-center text-[#c9a84c] font-bold text-[10px] sm:text-xs mt-1 flex-shrink-0">*</div>
                      <p className="text-foreground leading-relaxed flex-1">{conclusion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="border-t-2 border-[#c9a84c]/30 pt-4 sm:pt-6 mt-6 sm:mt-8">
            <div className="bg-gradient-to-r from-[#0d0d0d]/5 to-[#0d0d0d]/10 p-4 sm:p-6 rounded-lg">
              <div className="text-center">
                <p className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  <strong>Identificação profissional:</strong> {reportData.signature || reportData.professionalName || 'Nao informado'}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-[#c9a84c] rounded-full"></div>
                  <span>Documento emitido pelo MuseTera; assinatura eletrônica não verificada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filledFieldsCount = Object.keys(reportData.fieldValues || {}).length;
  const clinicalWarnings = getMusicoterapiaQualityWarnings(reportData);
  const totalSteps = 11;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Info Banner */}
      <div className="rounded-2xl border border-[#c9a84c]/30 bg-[#0d0d0d]/40 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex-shrink-1">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-[#c9a84c]" />
          </div>
          <div className="min-w-1">
            <p className="font-medium text-sm sm:text-base text-[#c9a84c]">Revisao Final</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Personalize, visualize e exporte seu relatorio profissional. Verifique todos os dados antes de finalizar.
            </p>
          </div>
        </div>
      </div>

      {clinicalWarnings.length > 0 && (
        <div role="status" className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 space-y-2">
          <p className="font-semibold text-sm text-amber-500">Revisão técnico-clínica: {clinicalWarnings.length} pontos de atenção</p>
          <p className="text-xs text-muted-foreground">Avisos orientativos. Confirme observações, medidas e fontes antes de finalizar. Não são diagnóstico automático nem impedem relatórios anteriores.</p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-foreground">
            {clinicalWarnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <StatCard
          label="Campos Preenchidos"
          value={filledFieldsCount.toString()}
          icon={<FileText className="h-4 w-4 text-[#c9a84c]" />}
        />
        <StatCard
          label="Dados do Paciente"
          value={reportData.patientName ? 'OK' : '---'}
          icon={<CheckCircle className="h-4 w-4 text-[#c9a84c]" />}
        />
        <StatCard
          label="Dados do Profissional"
          value={reportData.professionalName ? 'OK' : '---'}
          icon={<CheckCircle className="h-4 w-4 text-[#c9a84c]" />}
        />
        <StatCard
          label="Data da Sessao"
          value={reportData.sessionDate ? new Date(reportData.sessionDate).toLocaleDateString('pt-BR') : '---'}
          icon={<FileText className="h-4 w-4 text-[#c9a84c]" />}
        />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {/* Upload Logo */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d]/30 hover:border-[#c9a84c]/30 hover:bg-[#0d0d0d]/50 transition-all p-4 sm:p-5 flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex-shrink-0">
              <Image className="h-5 w-5 text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Upload de Logo</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Adicione sua logo ao PDF</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            {logoUrl ? (
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-20 object-contain border border-[#c9a84c]/30 rounded-xl bg-[#0d0d0d]/40"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={removeLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-[#c9a84c] font-medium">Logo carregada!</p>
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full border-[#c9a84c]/30 hover:bg-[#c9a84c]/10 hover:text-[#c9a84c] text-xs sm:text-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingLogo}
                >
                  {isUploadingLogo ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar Logo
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Visualizar */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d]/30 hover:border-[#c9a84c]/30 hover:bg-[#0d0d0d]/50 transition-all p-4 sm:p-5 flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex-shrink-0">
              <Eye className="h-5 w-5 text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Visualizar Relatorio</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Confira os dados resumidos antes de gerar o PDF</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-[#c9a84c]/30 hover:bg-[#c9a84c]/10 hover:text-[#c9a84c] text-xs sm:text-sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Previa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
                <DialogHeader className="p-4 sm:p-6 pb-0">
                  <DialogTitle className="text-sm sm:text-base">Previa do Relatorio de Musicoterapia</DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    Prévia resumida; o PDF final contém também as demais seções clínicas
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] p-4 sm:p-6 pt-2">
                  {renderPreviewContent()}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>


        {/* Exportação pelo gerador principal: o mesmo PDF da página de relatórios */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d]/30 hover:border-[#c9a84c]/30 transition-all p-4 sm:p-5 flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30">
              <Download className="h-5 w-5 text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Exportar PDF</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Mesmo modelo de relatório da página principal</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <Button onClick={() => void onExportPDF(logoUrl)} disabled={isExporting || isUploadingLogo}
              className="w-full bg-[#0d0d0d] border border-[#c9a84c]/40 hover:bg-[#c9a84c]/10 text-[#c9a84c] text-xs sm:text-sm">
              {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              {isExporting ? 'Gerando...' : 'Baixar PDF'}
            </Button>
          </div>
        </div>

        {/* Salvar */}
        <div className="rounded-2xl border border-white/5 bg-[#0d0d0d]/30 hover:border-[#c9a84c]/30 hover:bg-[#0d0d0d]/50 transition-all p-4 sm:p-5 flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex-shrink-0">
              <Save className="h-5 w-5 text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Salvar Relatorio</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Salve o relatorio no sistema</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <Button
              onClick={onSaveReport}
              disabled={isSaving}
              className="w-full bg-[#0d0d0d] border border-[#c9a84c]/40 hover:bg-[#c9a84c]/10 text-[#c9a84c] text-xs sm:text-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>


      {/* Progress Summary */}
      <div className="rounded-2xl border border-[#c9a84c]/30 bg-gradient-to-br from-[#c9a84c]/10 to-transparent p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30">
              <CheckCircle className="h-5 w-5 text-[#c9a84c]" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-[#c9a84c]">Relatorio Concluido</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Revise os dados e os avisos clínicos antes de exportar.</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#c9a84c] hidden sm:block" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0d0d0d]/30 p-3 sm:p-4 text-center hover:border-[#c9a84c]/30 transition-all">
      <div className="flex items-center justify-center mb-2">
        {icon}
      </div>
      <div className="text-lg sm:text-2xl font-bold text-[#c9a84c] mb-1">{value}</div>
      <div className="text-[10px] sm:text-xs font-medium text-muted-foreground">{label}</div>
    </div>
  );
}
