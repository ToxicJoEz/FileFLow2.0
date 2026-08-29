import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function NotFound() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate('/blog');
    }
  };

  return (
    <div className="error-wrap">
      <div className="error-orb" style={{ width: '500px', height: '500px', top: '-100px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(124,58,237,0.12)' }}></div>
      <div className="error-orb" style={{ width: '280px', height: '280px', bottom: 0, right: '5%', background: 'rgba(245,166,35,0.06)' }}></div>

      <div className="float-file" style={{ top: '18%', left: '5%', animation: 'float 6s ease-in-out infinite' }}>
        <div className="ff-dot" style={{ background: '#ef4444' }}></div>contract.pdf
      </div>
      <div className="float-file" style={{ top: '26%', right: '6%', animation: 'float 8s ease-in-out infinite 1s' }}>
        <div className="ff-dot" style={{ background: 'var(--purple-2)' }}></div>report.docx
      </div>
      <div className="float-file" style={{ bottom: '22%', left: '7%', animation: 'float 7s ease-in-out infinite 0.5s' }}>
        <div className="ff-dot" style={{ background: '#10b981' }}></div>data.xlsx
      </div>
      <div className="float-file" style={{ bottom: '28%', right: '7%', animation: 'float 9s ease-in-out infinite 2s' }}>
        <div className="ff-dot" style={{ background: 'var(--gold)' }}></div>notes.txt
      </div>
      <div className="float-file" style={{ top: '50%', left: '3%', animation: 'float 10s ease-in-out infinite 3s' }}>
        <div className="ff-dot" style={{ background: '#3b82f6' }}></div>slides.pptx
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="error-code">404</div>
        <h1 className="error-title">This file doesn't exist.</h1>
        <p className="error-desc">We searched everywhere — PDFs, spreadsheets, Word docs — and couldn't find the page you're looking for. It may have moved or been deleted.</p>

        <div className="error-search">
          <Search size={16} color="var(--gold)" style={{ flexShrink: 0 }} />
          <input 
            type="text" 
            placeholder="Search the site..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="error-links">
          <Link to="/" className="error-link">🏠 Home</Link>
          <Link to="/about" className="error-link">👋 About</Link>
          <Link to="/pricing" className="error-link">💰 Pricing</Link>
          <Link to="/blog" className="error-link">📖 Blog</Link>
          <Link to="/community" className="error-link">💬 Community</Link>
          <Link to="/changelog" className="error-link">📋 Changelog</Link>
          <Link to="/contact" className="error-link">📧 Contact</Link>
        </div>
      </div>
    </div>
  );
}
