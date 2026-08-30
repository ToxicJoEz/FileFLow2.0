import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/blog', label: 'Blog' },
  { href: '/community', label: 'Community' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <nav className="nav">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/fileflow_horizontal_white_transparent.png" alt="FileFlow" className="nav-logo-full" />
        </Link>
        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink 
                to={link.href} 
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          {isCheckingAuth ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '80px', height: '36px', borderRadius: '8px', background: 'var(--bg-3)', animation: 'pulse 2s infinite' }}></div>
              <div style={{ width: '60px', height: '36px', borderRadius: '8px', background: 'var(--bg-3)', animation: 'pulse 2s infinite' }}></div>
            </div>
          ) : isAuthenticated ? (
            <Link to="/dashboard" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: 'var(--bg)' }}>
                {getInitials(user?.name)}
              </div>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/beta" className="btn-outline">Join Beta</Link>
              <Link to="/login" className="btn-ghost">Login</Link>
            </>
          )}
          <div 
            className="nav-hamburger" 
            onClick={toggleMenu} 
            aria-label="Open menu"
          >
            <span style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : '' }}></span>
            <span style={{ opacity: isOpen ? 0 : 1 }}></span>
            <span style={{ transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '' }}></span>
          </div>
        </div>
      </nav>
      <div className={`nav-mobile-menu ${isOpen ? 'open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <NavLink 
            key={link.href}
            to={link.href}
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={closeMenu}
          >
            {link.label}
          </NavLink>
        ))}
        <div className="nav-mobile-divider"></div>
        {isAuthenticated ? (
          <Link to="/dashboard" style={{ color: 'var(--gold)', fontWeight: 500 }} onClick={closeMenu}>Dashboard</Link>
        ) : (
          <>
            <Link to="/beta" style={{ color: 'var(--gold)', fontWeight: 500 }} onClick={closeMenu}>Join Beta — Free</Link>
            <Link to="/login" onClick={closeMenu}>Login</Link>
          </>
        )}
      </div>
    </>
  );
}
