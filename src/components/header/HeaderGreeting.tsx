import { useProfessionalData } from "@/hooks/useProfessionalData";

export function HeaderGreeting() {
  const { data: professional } = useProfessionalData();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="hidden lg:flex flex-col items-center text-center">
      <span className="text-sm font-semibold text-foreground">
        {getGreeting()}, {professional?.name?.split(' ')[0] || 'Profissional'}
      </span>
      <span className="text-xs text-muted-foreground">{getCurrentDate()}</span>
    </div>
  );
}
