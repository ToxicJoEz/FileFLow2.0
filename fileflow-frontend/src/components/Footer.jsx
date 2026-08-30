import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <img src="/fileflow_horizontal_white_transparent.png" alt="FileFlow" className="nav-logo-full" />
          </Link>
          <p>Your all-in-one file management platform. Fast. Smart. Simple. Search inside every document instantly — 100% offline.</p>
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="tag green">v0.9.4 Beta</span>
            <span className="tag">Windows 10/11</span>
            <span className="tag">100% Offline</span>
          </div>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/screenshots">Screenshots</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/roadmap">Roadmap</Link></li>
            <li><Link to="/changelog">Changelog</Link></li>
            <li><Link to="/beta">Join Beta</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Community</h4>
          <ul>
            <li><Link to="/community">Forum</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/profile">Profiles</Link></li>
            <li><Link to="/achievements">Achievements</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 FileFlow. All rights reserved.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Built with care · Windows Desktop App
          <span style={{ color: 'var(--border-2)' }}>·</span>
          <Link to="/privacy" style={{ color: 'var(--text-4)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='var(--gold)'} onMouseOut={(e) => e.target.style.color='var(--text-4)'}>Privacy</Link>
          <span style={{ color: 'var(--border-2)' }}>·</span>
          <Link to="/terms" style={{ color: 'var(--text-4)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='var(--gold)'} onMouseOut={(e) => e.target.style.color='var(--text-4)'}>Terms</Link>
        </p>
      </div>
    </footer>
  );
}
