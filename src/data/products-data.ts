export interface Product {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  features: string[];
  price: string;
  priceType: 'free' | 'paid';
  url: string;
  color: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: 'teraday',
    name: 'TeraDay',
    icon: 'Calendar',
    tagline: 'Simplifique sua prática terapêutica',
    description: 'Controle sessões, finanças e produtividade em um só lugar.',
    features: [
      'Dashboard inteligente',
      'Calendário interativo',
      'Controle financeiro',
      'Relatórios PDF'
    ],
    price: 'R$14,99/mês',
    priceType: 'paid',
    url: 'https://session-tracker-pro.onrender.com/',
    color: '#14b8a6',
    badge: '👥 Para todos os Terapeutas'
  }
];
