
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Calendar, Plus, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface UpcomingSession {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
}

interface UpcomingSessionsProps {
  upcomingSessions: UpcomingSession[];
  isLoading: boolean;
}

export function UpcomingSessions({ upcomingSessions, isLoading }: UpcomingSessionsProps) {
  const { t } = useTranslation('financial');
  
  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {t('dashboard.upcomingSessions.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-muted rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-muted-foreground/20 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasSessions = upcomingSessions && Array.isArray(upcomingSessions) && upcomingSessions.length > 0;

  return (
    <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {t('dashboard.upcomingSessions.title')}
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasSessions ? (
          <div className="space-y-3">
            {upcomingSessions.slice(0, 5).map((session, index) => (
              <div 
                key={session.id}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl border border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground leading-tight">
                    {session.name || t('dashboard.upcomingSessions.patientNotInformed')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {session.type || t('dashboard.upcomingSessions.regularSession')}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {session.date || t('dashboard.upcomingSessions.dateNotInformed')}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {session.time || t('dashboard.upcomingSessions.timeNotInformed')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-blue-500 dark:text-blue-400" />
            </div>
            <h4 className="text-xl font-semibold text-foreground mb-3">{t('dashboard.upcomingSessions.noSessions')}</h4>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              {t('dashboard.financialAgenda.emptyDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('dashboard.upcomingSessions.scheduleFirst')}
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                {t('dashboard.upcomingSessionsExtra.viewFullAgenda')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground/80 mt-4">
              {t('dashboard.upcomingSessionsExtra.tip')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
