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
}

export const products: Product[] = [
  {
    id: 'whatspro',
    name: 'WhatsApp Pro+',
    icon: 'MessageCircle',
    tagline: 'Transforme seu WhatsApp em uma Máquina de Vendas',
    description: 'Centralize conversas, automatize atendimentos com IA e organize seu funil de vendas.',
    features: [
      'Chat centralizado',
      'Chatbot com IA 24/7',
      'Campanhas em massa',
      'Relatórios detalhados'
    ],
    price: 'A partir de R$69,90/mês',
    priceType: 'paid',
    url: 'https://whatspro.onrender.com/',
    color: '#25D366'
  },
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
    price: 'R$19,90/mês',
    priceType: 'paid',
    url: 'https://session-tracker-pro.onrender.com/',
    color: '#14b8a6'
  }
];
