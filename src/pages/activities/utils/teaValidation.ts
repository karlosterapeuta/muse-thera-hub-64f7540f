import { teaActivitiesData } from '../data/tea-specific-activities';
import { validateSynchronization } from '@/constants/teaFrequencies';

/**
 * Valida a integridade dos dados TEA no sistema
 */
export function validateTEASystem() {
  const validationResults = {
    activitiesValid: true,
    frequenciesValid: true,
    dataIntegrity: true,
    errors: [] as string[]
  };

  // Validar atividades TEA
  try {
    teaActivitiesData.forEach((activity, index) => {
      // Verificar campos obrigatórios
      if (!activity.supportLevel || activity.supportLevel < 1 || activity.supportLevel > 3) {
        validationResults.errors.push(`Atividade ${index}: Nível de suporte inválido`);
        validationResults.activitiesValid = false;
      }

      if (!activity.sensoryProfile) {
        validationResults.errors.push(`Atividade ${index}: Perfil sensorial ausente`);
        validationResults.activitiesValid = false;
      }

      if (!activity.teaSpecificBenefits || activity.teaSpecificBenefits.length === 0) {
        validationResults.errors.push(`Atividade ${index}: Benefícios TEA não especificados`);
        validationResults.activitiesValid = false;
      }

      if (!activity.adaptationSuggestions || 
          !activity.adaptationSuggestions.level1 || 
          !activity.adaptationSuggestions.level2 || 
          !activity.adaptationSuggestions.level3) {
        validationResults.errors.push(`Atividade ${index}: Adaptações por nível incompletas`);
        validationResults.activitiesValid = false;
      }
    });
  } catch (error) {
    validationResults.errors.push(`Erro ao validar atividades TEA: ${error}`);
    validationResults.activitiesValid = false;
  }

  // Validar sincronização com sistema TEA-Hero
  try {
    const bellSync = validateSynchronization('bell');
    const xylophoneSync = validateSynchronization('xylophone');
    const keyboardSync = validateSynchronization('keyboard');

    if (!bellSync || !xylophoneSync || !keyboardSync) {
      validationResults.errors.push('Sistema TEA-Hero não está sincronizado');
      validationResults.frequenciesValid = false;
    }
  } catch (error) {
    validationResults.errors.push(`Erro ao validar frequências TEA: ${error}`);
    validationResults.frequenciesValid = false;
  }

  // Validar integridade geral
  validationResults.dataIntegrity = validationResults.activitiesValid && validationResults.frequenciesValid;

  return validationResults;
}

/**
 * Obtém estatísticas do sistema TEA
 */
export function getTEASystemStats() {
  const stats = {
    totalActivities: teaActivitiesData.length,
    activitiesByLevel: {
      level1: 0,
      level2: 0,
      level3: 0
    },
    communicationStyles: {
      verbal: 0,
      nonVerbal: 0,
      mixed: 0
    },
    sensoryProfiles: {
      lowAuditory: 0,
      mediumAuditory: 0,
      highAuditory: 0
    },
    averageAttentionSpan: 0
  };

  teaActivitiesData.forEach(activity => {
    // Contar por nível de suporte
    stats.activitiesByLevel[`level${activity.supportLevel}` as keyof typeof stats.activitiesByLevel]++;

    // Contar estilos de comunicação
    if (activity.communicationStyle === 'verbal') {
      stats.communicationStyles.verbal++;
    } else if (activity.communicationStyle === 'non-verbal') {
      stats.communicationStyles.nonVerbal++;
    } else {
      stats.communicationStyles.mixed++;
    }

    // Contar perfis sensoriais auditivos
    if (activity.sensoryProfile.auditoryIntensity === 'low') {
      stats.sensoryProfiles.lowAuditory++;
    } else if (activity.sensoryProfile.auditoryIntensity === 'medium') {
      stats.sensoryProfiles.mediumAuditory++;
    } else {
      stats.sensoryProfiles.highAuditory++;
    }
  });

  // Calcular tempo médio de atenção
  const totalAttentionSpan = teaActivitiesData.reduce((sum, activity) => sum + activity.attentionSpan, 0);
  stats.averageAttentionSpan = Math.round(totalAttentionSpan / teaActivitiesData.length);

  return stats;
}

/**
 * Gera relatório de compatibilidade TEA para uma atividade específica
 */
export function generateTEACompatibilityReport(activityId: number, userProfile?: any) {
  const activity = teaActivitiesData.find(act => act.id === activityId);
  
  if (!activity) {
    return { error: 'Atividade não encontrada' };
  }

  const report = {
    activityId: activity.id,
    title: activity.title,
    supportLevel: activity.supportLevel,
    compatibility: {
      overall: 'medium' as 'high' | 'medium' | 'low',
      sensory: 'medium' as 'high' | 'medium' | 'low',
      communication: 'medium' as 'high' | 'medium' | 'low',
      duration: 'medium' as 'high' | 'medium' | 'low'
    },
    recommendations: [] as string[],
    warnings: [] as string[]
  };

  // Se há perfil do usuário, calcular compatibilidade específica
  if (userProfile) {
    // Compatibilidade sensorial
    if (userProfile.sensoryProfile) {
      if (userProfile.sensoryProfile.auditoryTolerance < 30 && 
          activity.sensoryProfile.auditoryIntensity === 'high') {
        report.compatibility.sensory = 'low';
        report.warnings.push('Atividade pode ter intensidade auditiva muito alta para o perfil');
      } else if (userProfile.sensoryProfile.auditoryTolerance > 70 || 
                 activity.sensoryProfile.auditoryIntensity === 'low') {
        report.compatibility.sensory = 'high';
      }
    }

    // Compatibilidade de comunicação
    if (userProfile.communicationPreferences) {
      if (userProfile.communicationPreferences.primaryStyle === activity.communicationStyle) {
        report.compatibility.communication = 'high';
      } else if (activity.communicationStyle === 'mixed') {
        report.compatibility.communication = 'medium';
        report.recommendations.push('Atividade oferece flexibilidade de comunicação');
      }
    }

    // Compatibilidade de duração
    if (userProfile.communicationPreferences?.preferredInteractionDuration) {
      const preferredDuration = userProfile.communicationPreferences.preferredInteractionDuration;
      if (Math.abs(activity.attentionSpan - preferredDuration) <= 5) {
        report.compatibility.duration = 'high';
      } else if (Math.abs(activity.attentionSpan - preferredDuration) > 15) {
        report.compatibility.duration = 'low';
        report.warnings.push('Duração da atividade pode não ser ideal para o perfil');
      }
    }

    // Compatibilidade geral
    const compatibilityScores = Object.values(report.compatibility).map(score => 
      score === 'high' ? 3 : score === 'medium' ? 2 : 1
    );
    const averageScore = compatibilityScores.reduce((sum, score) => sum + score, 0) / compatibilityScores.length;
    
    if (averageScore >= 2.5) {
      report.compatibility.overall = 'high';
    } else if (averageScore >= 2) {
      report.compatibility.overall = 'medium';
    } else {
      report.compatibility.overall = 'low';
    }
  }

  return report;
}