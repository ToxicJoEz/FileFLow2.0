import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Award, CreditCard, Settings, MessageSquare, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import UserCardModal from './UserCardModal';

export default function Sidebar() {
  const { user, logoutUser } = useAuthStore();
  const navigate = useNavigate();
  const [showUserCard, setShowUserCard] = useState(false);

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
    <>
      <aside className="app-sidebar">
        <div className="sidebar-user" onClick={() => setShowUserCard(true)}>
          <div 
            className="sidebar-av"
            style={{
              background: user?.accentColor || 'var(--purple)',
              color: user?.accentColor ? '#fff' : 'var(--bg)'
            }}
          >
            {getInitials(user?.name)}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>{user?.name || 'User'}</div>
          <div style={{ marginTop: '4px' }}>
            <span className="tag gold" style={{ fontSize: '10px' }}>
              {user?.role === 'admin' ? 'Admin' : (user?.plan === 'pro' ? 'Pro Plan' : 'Free Beta')}
            </span>
          </div>
        </div>
        
        <div className="snav-label" style={{ marginTop: '0.5rem' }}>Main</div>
        <NavLink to="/dashboard" end className={({ isActive }) => `snav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>
        <NavLink to="/dashboard/profile" className={({ isActive }) => `snav-item ${isActive ? 'active' : ''}`}>
          <User size={16} />
          Profile
        </NavLink>
        <NavLink to="/dashboard/achievements" className={({ isActive }) => `snav-item ${isActive ? 'active' : ''}`}>
          <Award size={16} />
          Achievements
        </NavLink>
        
        <div className="snav-label">Account</div>
        <NavLink to="/pricing" className={({ isActive }) => `snav-item ${isActive ? 'active' : ''}`}>
          <CreditCard size={16} />
          Billing
        </NavLink>
        <NavLink to="/dashboard/settings" className={({ isActive }) => `snav-item ${isActive ? 'active' : ''}`}>
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

      {showUserCard && (
        <UserCardModal user={user} onClose={() => setShowUserCard(false)} />
      )}
    </>
  );
}
