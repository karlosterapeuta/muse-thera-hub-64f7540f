import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Target, RefreshCw, Heart, Flag } from "lucide-react";
import { FacilitationGuide } from "../types";

interface FacilitationGuidePanelProps {
  facilitationGuide: FacilitationGuide;
}

export function FacilitationGuidePanel({ facilitationGuide }: FacilitationGuidePanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Guia de Facilitação</h3>
        <p className="text-sm text-muted-foreground">
          Scripts, frases-chave e estratégias para conduzir a atividade com efetividade
        </p>
      </div>

      <div className="grid gap-4">
        {/* Introdução */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                <Flag className="h-4 w-4" />
              </div>
              Apresentação da Atividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facilitationGuide.introduction.map((intro, index) => (
                <div key={index} className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                    "{intro}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Frases-chave */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-2 rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <MessageCircle className="h-4 w-4" />
              </div>
              Frases-Chave para Orientação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {facilitationGuide.keyPhrases.map((phrase, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {index + 1}
                  </Badge>
                  <p className="text-sm text-muted-foreground italic">
                    "{phrase}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Técnicas de Motivação */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                <Heart className="h-4 w-4" />
              </div>
              Técnicas de Motivação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facilitationGuide.motivationTechniques.map((technique, index) => (
                <div key={index} className="p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <p className="text-sm text-purple-900 dark:text-purple-100">
                    <strong>#{index + 1}:</strong> {technique}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estratégias de Redirecionamento */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-2 rounded-lg bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                <RefreshCw className="h-4 w-4" />
              </div>
              Estratégias de Redirecionamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facilitationGuide.redirectionStrategies.map((strategy, index) => (
                <div key={index} className="p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <p className="text-sm text-orange-900 dark:text-orange-100">
                    <strong>Situação:</strong> {strategy}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Encerramento */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-2 rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <Target className="h-4 w-4" />
              </div>
              Abordagem de Encerramento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facilitationGuide.closingApproach.map((approach, index) => (
                <div key={index} className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-900 dark:text-green-100 font-medium">
                    "{approach}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}