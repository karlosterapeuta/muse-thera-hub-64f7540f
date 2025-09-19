import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, HardDrive, Music, Database } from "lucide-react";
import { useCacheManager } from "@/hooks/useCacheManager";

export function CacheManagerCard() {
  const { 
    stats, 
    clearCache, 
    cleanupCache, 
    cleanWebStorage, 
    cleanAudioCaches, 
    performFullCleanup 
  } = useCacheManager();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const memoryUsagePercent = (stats.memoryUsage / (50 * 1024 * 1024)) * 100; // 50MB max

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Gerenciador de Cache
        </CardTitle>
        <CardDescription>
          Monitore e gerencie o cache da aplicação para melhor performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uso de Memória</span>
            <span>{formatBytes(stats.memoryUsage)} / 50 MB</span>
          </div>
          <Progress value={Math.min(memoryUsagePercent, 100)} className="h-2" />
          {memoryUsagePercent > 80 && (
            <p className="text-sm text-amber-600">
              ⚠️ Uso de cache alto. Considere fazer limpeza.
            </p>
          )}
        </div>

        {/* Cache Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Total de Itens</p>
            <p className="text-2xl font-bold">{stats.totalItems}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Namespaces</p>
            <p className="text-2xl font-bold">{Object.keys(stats.namespaces).length}</p>
          </div>
        </div>

        {/* Namespace Breakdown */}
        {Object.keys(stats.namespaces).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Detalhes por Categoria</h4>
            <div className="space-y-2">
              {Object.entries(stats.namespaces).map(([namespace, data]) => (
                <div key={namespace} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    {namespace === 'audio' && <Music className="h-4 w-4" />}
                    {namespace === 'api' && <Database className="h-4 w-4" />}
                    <span className="text-sm font-medium">{namespace}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{data.items} itens</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatBytes(data.size)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Ações de Limpeza</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => cleanupCache()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Limpar Expirados
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => cleanAudioCaches()}
              className="flex items-center gap-2"
            >
              <Music className="h-4 w-4" />
              Limpar Áudio
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => cleanWebStorage()}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Limpar Storage
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => performFullCleanup()}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Limpeza Completa
            </Button>
          </div>
        </div>

        {/* Auto-cleanup Status */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span>Limpeza Automática</span>
            <Badge variant="outline" className="text-emerald-600">
              ✓ Ativa (5 min)
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Cache é limpo automaticamente a cada 5 minutos e ao fechar a aplicação
          </p>
        </div>
      </CardContent>
    </Card>
  );
}