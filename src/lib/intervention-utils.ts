export const formatNameFromEmail = (email: string): string => {
  const namePart = email.split('@')[0];
  return namePart
    .split(/[._-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getComplexityColor = (complexity: string): string => {
  switch (complexity?.toLowerCase()) {
    case 'baixa':
    case 'fácil':
      return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    case 'média':
    case 'moderada':
      return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    case 'alta':
    case 'difícil':
      return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    default:
      return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300';
  }
};

export const groupActivitiesByDemand = (activities: any[]) => {
  return activities.reduce((acc, activity) => {
    const demand = activity.disorder || 'Outros';
    if (!acc[demand]) {
      acc[demand] = [];
    }
    acc[demand].push(activity);
    return acc;
  }, {} as Record<string, any[]>);
};

export const validateInterventionForm = (patientId: string, demands: Record<string, string[]>, subDemands: Record<string, string[]>) => {
  if (!patientId) {
    return { valid: false, error: 'Selecione um paciente' };
  }

  const selectedDisorders = Object.keys(demands).filter(
    disorder => demands[disorder].length > 0
  );
  const hasSubDemands = Object.values(subDemands).some(arr => arr.length > 0);

  if (selectedDisorders.length === 0 && !hasSubDemands) {
    return { valid: false, error: 'Selecione pelo menos uma demanda' };
  }

  return { valid: true };
};
