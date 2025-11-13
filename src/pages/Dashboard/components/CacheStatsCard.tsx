import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, HardDrive } from "lucide-react";
import { useCacheManager } from "@/hooks/useCacheManager";

export function CacheStatsCard() {
  const { 
    stats, 
    cleanupCache, 
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
    <Card className="h-full border border-border shadow-lg rounded-xl bg-card hover:shadow-xl transition-all duration-300">
      <CardHeader className="px-6 py-4 border-b border-border">
        <CardTitle className="flex items-center gap-2 text-lg">
          <HardDrive className="h-5 w-5" />
          Cache do Sistema
        </CardTitle>
        <CardDescription className="text-sm">
          Monitoramento automático de memória
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 py-6">
        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uso de Memória</span>
            <span className="font-medium">{formatBytes(stats.memoryUsage)}</span>
          </div>
          <Progress value={Math.min(memoryUsagePercent, 100)} className="h-2" />
          {memoryUsagePercent > 80 && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              ⚠️ Cache alto - limpeza recomendada
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold">{stats.totalItems}</div>
            <div className="text-xs text-muted-foreground">Itens</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold">{Object.keys(stats.namespaces).length}</div>
            <div className="text-xs text-muted-foreground">Categorias</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => cleanupCache()}
            className="flex-1 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Limpar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => performFullCleanup()}
            className="flex-1 text-xs text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>

        {/* Auto-cleanup indicator */}
        <div className="text-center">
          <Badge variant="outline" className="text-xs text-emerald-600">
            🤖 Limpeza automática ativa
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}