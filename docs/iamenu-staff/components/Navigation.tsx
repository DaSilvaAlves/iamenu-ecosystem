
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../App';

const Navigation: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const staffItems = [
    { to: '/', icon: 'home', label: 'Início' },
    { to: '/shifts', icon: 'calendar_today', label: 'Turnos' },
    { to: '/announcements', icon: 'campaign', label: 'Anúncios' },
    { to: '/onboarding', icon: 'checklist', label: 'Tarefas' },
  ];

  const managerItems = [
    { to: '/', icon: 'dashboard', label: 'Dashboard' },
    { to: '/manager/onboarding', icon: 'people', label: 'Equipa' },
    { to: '/announcements', icon: 'campaign', label: 'Anúncios' },
  ];

  const items = user.role === 'STAFF' ? staffItems : managerItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 pb-8 pt-3 px-4 flex justify-around items-center z-50 max-w-md mx-auto">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-500 hover:text-white'
            }`
          }
        >
          <span className="material-icons-round text-2xl">{item.icon}</span>
          <span className="text-[10px] font-medium uppercase tracking-tight">{item.label}</span>
        </NavLink>
      ))}
      <div className="relative -top-10">
        <NavLink
          to={user.role === 'STAFF' ? '/time-off' : '/manager/create-shift'}
          className="w-14 h-14 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center shadow-lg shadow-primary/40 text-white hover:scale-105 transition-transform border-4 border-background-dark"
        >
          <span className="material-icons-round text-3xl">add</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
