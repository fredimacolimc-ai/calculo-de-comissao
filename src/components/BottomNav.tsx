import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, PlusCircle, User } from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Início' },
  { to: '/viagens', icon: List, label: 'Viagens' },
  { to: '/nova', icon: PlusCircle, label: 'Nova' },
  { to: '/perfil', icon: User, label: 'Perfil' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
