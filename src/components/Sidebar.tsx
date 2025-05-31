
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  Activity, 
  Music, 
  Gamepad2, 
  Headphones, 
  DollarSign, 
  UserCheck, 
  Key, 
  FileBarChart,
  BookOpen
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/professional', icon: UserCheck, label: 'Profissional' },
    { to: '/patients', icon: Users, label: 'Pacientes' },
    { to: '/processes', icon: FileText, label: 'Processos' },
    { to: '/activities', icon: Activity, label: 'Atividades' },
    { to: '/music-composer', icon: Music, label: 'Compositor Musical' },
    { to: '/tea-hero', icon: Gamepad2, label: 'TEA Hero' },
    { to: '/binaural-frequencies', icon: Headphones, label: 'Frequências Binaurais' },
    { to: '/finance', icon: DollarSign, label: 'Financeiro' },
    { to: '/users', icon: Users, label: 'Usuários' },
    { to: '/invite-codes', icon: Key, label: 'Códigos de Convite' },
    { to: '/anamnesis', icon: FileText, label: 'Anamnese' },
    { to: '/evaluation', icon: FileBarChart, label: 'Avaliação' },
    { to: '/treatment-plan', icon: FileText, label: 'Plano de Tratamento' },
    { to: '/intervention', icon: Activity, label: 'Intervenção' },
    { to: '/reevaluation', icon: FileBarChart, label: 'Reavaliação' },
    { to: '/scientific-article', icon: BookOpen, label: 'Artigo Científico' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Menu</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
