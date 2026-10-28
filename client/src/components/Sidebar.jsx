import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, Link2, LogOut, Menu, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/doctors', icon: Stethoscope, label: 'Doctors' },
  { to: '/mappings', icon: Link2, label: 'Mappings' },
];

export default function Sidebar({ isOpen, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="mobile-header">
        <button className="hamburger" onClick={onToggle}>
          <Menu size={22} />
        </button>
        <h1>WhatBytes Healthcare</h1>
      </div>

      {/* Backdrop for mobile */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'visible' : ''}`}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Heart size={20} />
          </div>
          <div>
            <h1>WhatBytes</h1>
            <p className="brand-sub">Healthcare</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => {
                if (window.innerWidth <= 768) onToggle();
              }}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(user?.name)}</div>
            <div className="sidebar-user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-email">{user?.email || ''}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
