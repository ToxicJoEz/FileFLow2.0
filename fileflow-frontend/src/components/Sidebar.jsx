import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Award, CreditCard, Settings, MessageSquare, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Sidebar() {
  const { user, logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logoutUser();
    navigate('/login');
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-user">
        <div className="sidebar-av">{getInitials(user?.name)}</div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>{user?.name || 'User'}</div>
        <div style={{ marginTop: '4px' }}><span className="tag gold" style={{ fontSize: '10px' }}>{user?.role === 'admin' ? 'Admin' : 'Pro Beta'}</span></div>
      </div>
      
      <div className="snav-label">Main</div>
      <NavLink to="/dashboard" className={({ isActive }) => `snav-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={16} />
        Dashboard
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `snav-item ${isActive ? 'active' : ''}`}>
        <User size={16} />
        Profile
      </NavLink>
      <NavLink to="/achievements" className={({ isActive }) => `snav-item ${isActive ? 'active' : ''}`}>
        <Award size={16} />
        Achievements <span className="snav-badge">3 new</span>
      </NavLink>
      
      <div className="snav-label">Account</div>
      <NavLink to="/billing" className={({ isActive }) => `snav-item ${isActive ? 'active' : ''}`}>
        <CreditCard size={16} />
        Billing
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => `snav-item ${isActive ? 'active' : ''}`}>
        <Settings size={16} />
        Settings
      </NavLink>
      <NavLink to="/community" className={({ isActive }) => `snav-item ${isActive ? 'active' : ''}`}>
        <MessageSquare size={16} />
        Community
      </NavLink>
      
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <a href="#" onClick={handleLogout} className="snav-item">
          <LogOut size={16} />
          Sign out
        </a>
      </div>
    </aside>
  );
}
