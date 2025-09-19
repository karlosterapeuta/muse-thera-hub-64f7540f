export function formatAccessLimit(accessLimit?: string): string {
  switch (accessLimit) {
    case '30-minutes':
      return '30 minutos (teste)';
    case '30-days':
      return '30 dias';
    case '6-months':
      return '6 meses';
    case '1-year':
      return '1 ano';
    default:
      return '30 dias';
  }
}