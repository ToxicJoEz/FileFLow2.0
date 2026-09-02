import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Trophy, MessageSquare, ArrowUp, Mail, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Profile() {
  const { user } = useAuthStore();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getJoinDate = (dateString) => {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="profile-wrap">
      {/* Banner */}
      <div className="profile-banner" style={{ background: user?.accentColor ? `linear-gradient(135deg, ${user.accentColor}44 0%, var(--bg-1) 100%)` : undefined }}>
        <div className="banner-pattern" style={{ backgroundImage: user?.accentColor ? `linear-gradient(${user.accentColor}55 1px, transparent 1px), linear-gradient(90deg, ${user.accentColor}55 1px, transparent 1px)` : undefined }}></div>
        <div className="banner-geo" style={{ borderWidth: '0 30px 52px 30px', borderColor: `transparent transparent ${user?.accentColor || 'var(--gold)'} transparent`, opacity: user?.accentColor ? 0.3 : 0.08, top: '20px', right: '120px' }}></div>
        <div className="banner-geo" style={{ borderWidth: '0 18px 31px 18px', borderColor: `transparent transparent ${user?.accentColor || 'var(--purple-2)'} transparent`, opacity: user?.accentColor ? 0.4 : 0.12, bottom: '30px', left: '40%', animation: 'float 7s ease-in-out infinite' }}></div>
        <div className="banner-edit">
          <Link to="/dashboard/settings" className="btn-ghost" style={{ fontSize: '12px', padding: '7px 14px' }}>Edit profile</Link>
        </div>
      </div>

      {/* Identity */}
      <div className="profile-identity">
        <div className="profile-av" style={{ background: user?.accentColor || 'var(--purple)', color: user?.accentColor ? '#fff' : 'var(--bg)' }}>
          {getInitials(user?.name)}
        </div>
        <div className="profile-name-block">
          <div className="profile-name">{user?.name || 'User'}</div>
          <div className="profile-handle">@{user?.handle || user?.name?.toLowerCase().replace(/\s+/g, '_') || 'user'} · Member since {getJoinDate(user?.createdAt)}</div>
          <div className="profile-badges">
            <span className="tag gold">{user?.role === 'admin' ? 'Admin' : 'Pro Beta'}</span>
            <span className="tag green">Early adopter</span>
            <span className="tag">Top searcher</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat-cell"><div className="stat-cell-n gold">1,248</div><div className="stat-cell-l">Searches</div></div>
        <div className="stat-cell"><div className="stat-cell-n">3,872</div><div className="stat-cell-l">Files found</div></div>
        <div className="stat-cell"><div className="stat-cell-n gold">6.4h</div><div className="stat-cell-l">Time saved</div></div>
        <div className="stat-cell"><div className="stat-cell-n">12</div><div className="stat-cell-l">Achievements</div></div>
        <div className="stat-cell"><div className="stat-cell-n">24</div><div className="stat-cell-l">Forum posts</div></div>
        <div className="stat-cell"><div className="stat-cell-n gold">14</div><div className="stat-cell-l">Day streak 🔥</div></div>
      </div>

      {/* Profile body */}
      <div className="profile-body">
        <div>
          {/* Achievements showcase */}
          <div className="section-hdr">
            <h3>🏆 Achievements</h3>
            <Link to="/dashboard/achievements">View all 40 →</Link>
          </div>
          <div className="ach-showcase">
            <div className="ach-card"><span className="ach-emoji">🔍</span><div className="ach-name">First Search</div><div className="ach-rarity rarity-common">Common</div></div>
            <div className="ach-card"><span className="ach-emoji">📄</span><div className="ach-name">PDF Master</div><div className="ach-rarity rarity-common">Common</div></div>
            <div className="ach-card epic"><span className="ach-emoji">⚡</span><div className="ach-name">Speed Demon</div><div className="ach-rarity rarity-epic">Epic</div></div>
            <div className="ach-card legendary"><span className="ach-emoji">🔥</span><div className="ach-name">14-Day Streak</div><div className="ach-rarity rarity-legendary">Legendary</div></div>
            <div className="ach-card"><span className="ach-emoji">📊</span><div className="ach-name">Excel Hunter</div><div className="ach-rarity rarity-rare">Rare</div></div>
            <div className="ach-card"><span className="ach-emoji">💬</span><div className="ach-name">Helpful Soul</div><div className="ach-rarity rarity-common">Common</div></div>
            <div className="ach-card locked"><span className="ach-emoji">🎯</span><div className="ach-name">Regex Wizard</div><div className="ach-rarity rarity-epic">Epic</div></div>
            <div className="ach-card locked"><span className="ach-emoji">🌟</span><div className="ach-name">Legend</div><div className="ach-rarity rarity-legendary">Legendary</div></div>
          </div>

          {/* Activity feed */}
          <div className="section-hdr" style={{ marginTop: '0.5rem' }}><h3>📋 Recent activity</h3></div>
          <div>
            <div className="activity-item"><div className="act-icon" style={{ background: 'var(--gold-dim)' }}><Search size={14} color="var(--gold)" /></div><div className="act-text">Searched for <strong>"quarterly revenue forecast"</strong> — found 4 results across 3 PDFs</div><div className="act-time">2h ago</div></div>
            <div className="activity-item"><div className="act-icon" style={{ background: 'var(--gold-dim)' }}><Trophy size={14} color="var(--gold)" /></div><div className="act-text">Unlocked achievement <strong>14-Day Streak 🔥</strong></div><div className="act-time">Today</div></div>
            <div className="activity-item"><div className="act-icon" style={{ background: 'var(--purple-dim)' }}><MessageSquare size={14} color="var(--purple-3)" /></div><div className="act-text">Replied to <strong>"Regex to find invoice numbers"</strong> in the community forum</div><div className="act-time">5h ago</div></div>
            <div className="activity-item"><div className="act-icon" style={{ background: 'var(--green-dim)' }}><ArrowUp size={14} color="var(--green)" /></div><div className="act-text">Voted for <strong>OCR for scanned PDFs</strong> on the roadmap</div><div className="act-time">Yesterday</div></div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="info-box">
            <h4>About</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '1rem' }}>
              {user?.bio || 'FileFlow user. Searching for documents efficiently.'}
            </p>
            <div className="info-row">
              <MapPin size={14} color="var(--text-4)" />
              {user?.location || 'Unknown location'}
            </div>
            <div className="info-row">
              <Mail size={14} color="var(--text-4)" />
              {user?.email || 'N/A'}
            </div>
          </div>

          <div className="info-box">
            <h4>File type usage</h4>
            <div className="usage-bar"><div className="usage-bar-top"><span style={{ color: 'var(--text-2)', fontSize: '12px' }}>PDF</span><span style={{ color: 'var(--text-3)', fontSize: '11px', fontFamily: 'var(--mono)' }}>58%</span></div><div className="usage-track"><div className="usage-fill" style={{ width: '58%', background: 'linear-gradient(90deg,#ef4444,#f87171)' }}></div></div></div>
            <div className="usage-bar"><div className="usage-bar-top"><span style={{ color: 'var(--text-2)', fontSize: '12px' }}>DOCX</span><span style={{ color: 'var(--text-3)', fontSize: '11px', fontFamily: 'var(--mono)' }}>24%</span></div><div className="usage-track"><div className="usage-fill" style={{ width: '24%', background: 'linear-gradient(90deg,var(--purple),var(--purple-3))' }}></div></div></div>
            <div className="usage-bar"><div className="usage-bar-top"><span style={{ color: 'var(--text-2)', fontSize: '12px' }}>XLSX</span><span style={{ color: 'var(--text-3)', fontSize: '11px', fontFamily: 'var(--mono)' }}>12%</span></div><div className="usage-track"><div className="usage-fill" style={{ width: '12%', background: 'linear-gradient(90deg,var(--green),#34d399)' }}></div></div></div>
            <div className="usage-bar"><div className="usage-bar-top"><span style={{ color: 'var(--text-2)', fontSize: '12px' }}>Other</span><span style={{ color: 'var(--text-3)', fontSize: '11px', fontFamily: 'var(--mono)' }}>6%</span></div><div className="usage-track"><div className="usage-fill" style={{ width: '6%', background: 'var(--text-3)' }}></div></div></div>
          </div>

          <div className="info-box">
            <h4>Forum posts</h4>
            <div className="forum-post-item"><div className="forum-post-title">Regex to find invoice numbers across 500 PDFs</div><div className="forum-post-meta">34 upvotes · 18 replies · 2h ago</div></div>
            <div className="forum-post-item"><div className="forum-post-title">FileFlow saved me 4 hours this week</div><div className="forum-post-meta">56 upvotes · 22 replies · 3d ago</div></div>
            <div className="forum-post-item"><div className="forum-post-title">Request: bulk export search results to CSV</div><div className="forum-post-meta">12 upvotes · 5 replies · 1w ago</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
