import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function Achievements() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <>
      {/* Progress */}
      <div className="ach-progress anim-fade-up">
        <div className="prog-top">
          <div>
            <div className="prog-subtitle">YOUR RANK</div>
            <div className="prog-title">Knowledge Seeker</div>
          </div>
          <div className="rank-badge">✦ 12 / 40 achievements</div>
        </div>
        <div className="prog-track"><div className="prog-fill" style={{ width: '30%' }}></div></div>
        <div className="rank-labels">
          <div className="rank-label">Beginner<br /><span>0</span></div>
          <div className="rank-label">Explorer<br /><span>5</span></div>
          <div className="rank-label current">Seeker ←<br /><span>12</span></div>
          <div className="rank-label">Master<br /><span>20</span></div>
          <div className="rank-label">Expert<br /><span>30</span></div>
          <div className="rank-label">Legend<br /><span>40</span></div>
        </div>
        <div className="ach-counters">
          <div className="ach-ctr"><div className="ach-ctr-n" style={{ color: 'var(--text-3)' }}>8</div><div className="ach-ctr-l">Common</div></div>
          <div className="ach-ctr"><div className="ach-ctr-n" style={{ color: 'var(--purple-3)' }}>3</div><div className="ach-ctr-l">Rare</div></div>
          <div className="ach-ctr"><div className="ach-ctr-n" style={{ color: 'var(--purple-2)' }}>1</div><div className="ach-ctr-l">Epic</div></div>
          <div className="ach-ctr"><div className="ach-ctr-n" style={{ color: 'var(--gold)' }}>0</div><div className="ach-ctr-l">Legendary</div></div>
        </div>
      </div>

      {/* Filters */}
      <div className="ach-filters">
        {['All', '✓ Earned', '🔒 Locked', '⭐ Legendary', '💜 Epic'].map(filter => (
          <button 
            key={filter} 
            className={`ach-filter ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search Milestones */}
      <div className="ach-section anim-fade-up">
        <div className="ach-sec-hdr">
          <span style={{ fontSize: '20px' }}>🔍</span>
          <div className="ach-sec-title">Search Milestones</div>
          <span className="tag">5 / 10 earned</span>
        </div>
        <div className="ach-grid">
          <div className="ach-item"><div className="ach-new">NEW</div><span className="ach-icon">🔍</span><div className="ach-title">First Search</div><div className="ach-desc">Run your very first search</div><div className="ach-rarity rarity-common">Common</div></div>
          <div className="ach-item"><span className="ach-icon">💯</span><div className="ach-title">100 Searches</div><div className="ach-desc">Complete 100 searches</div><div className="ach-rarity rarity-common">Common</div></div>
          <div className="ach-item rare"><span className="ach-icon">🚀</span><div className="ach-title">500 Searches</div><div className="ach-desc">Complete 500 searches</div><div className="ach-rarity rarity-rare">Rare</div></div>
          <div className="ach-item rare"><div className="ach-new">NEW</div><span className="ach-icon">⚡</span><div className="ach-title">1,000 Searches</div><div className="ach-desc">Complete 1,000 searches</div><div className="ach-rarity rarity-rare">Rare</div></div>
          <div className="ach-item epic"><div className="ach-new">NEW</div><span className="ach-icon">💎</span><div className="ach-title">Speed Demon</div><div className="ach-desc">50 results in under 100ms</div><div className="ach-rarity rarity-epic">Epic</div></div>
          <div className="ach-item locked"><span className="ach-icon">🎯</span><div className="ach-title">5,000 Searches</div><div className="ach-desc">Complete 5,000 searches</div><div className="ach-prog-mini"><div className="ach-prog-fill" style={{ width: '25%' }}></div></div><div className="ach-prog-txt">1,248 / 5,000</div><div className="ach-rarity rarity-epic">Epic</div></div>
          <div className="ach-item locked legendary"><span className="ach-icon">👑</span><div className="ach-title">10,000 Searches</div><div className="ach-desc">The ultimate searcher</div><div className="ach-prog-mini"><div className="ach-prog-fill" style={{ width: '12%', background: 'var(--gold)' }}></div></div><div className="ach-prog-txt">1,248 / 10,000</div><div className="ach-rarity rarity-legendary">Legendary</div></div>
          <div className="ach-item locked epic"><span className="ach-icon">🔮</span><div className="ach-title">Regex Wizard</div><div className="ach-desc">Use regex search 50 times</div><div className="ach-prog-mini"><div className="ach-prog-fill" style={{ width: '20%' }}></div></div><div className="ach-prog-txt">10 / 50</div><div className="ach-rarity rarity-epic">Epic</div></div>
        </div>
      </div>

      {/* File Mastery */}
      <div className="ach-section anim-fade-up">
        <div className="ach-sec-hdr">
          <span style={{ fontSize: '20px' }}>📂</span>
          <div className="ach-sec-title">File Mastery</div>
          <span className="tag">4 / 8 earned</span>
        </div>
        <div className="ach-grid">
          <div className="ach-item"><span className="ach-icon">📄</span><div className="ach-title">PDF Master</div><div className="ach-desc">Search 100 PDFs</div><div className="ach-rarity rarity-common">Common</div></div>
          <div className="ach-item"><span className="ach-icon">📝</span><div className="ach-title">Word Wrangler</div><div className="ach-desc">Search 50 DOCX files</div><div className="ach-rarity rarity-common">Common</div></div>
          <div className="ach-item"><span className="ach-icon">📊</span><div className="ach-title">Excel Hunter</div><div className="ach-desc">Search 50 XLSX files</div><div className="ach-rarity rarity-common">Common</div></div>
          <div className="ach-item rare"><span className="ach-icon">📚</span><div className="ach-title">Bibliophile</div><div className="ach-desc">Search inside an EPUB</div><div className="ach-rarity rarity-rare">Rare</div></div>
          <div className="ach-item locked epic"><span className="ach-icon">🗃️</span><div className="ach-title">Archive Diver</div><div className="ach-desc">Search 1,000+ files at once</div><div className="ach-prog-mini"><div className="ach-prog-fill" style={{ width: '38%' }}></div></div><div className="ach-prog-txt">387 / 1,000</div><div className="ach-rarity rarity-epic">Epic</div></div>
          <div className="ach-item locked"><span className="ach-icon">⚙️</span><div className="ach-title">Format Master</div><div className="ach-desc">Use all 30+ formats</div><div className="ach-rarity rarity-epic">Epic</div></div>
          <div className="ach-item locked"><span className="ach-icon">🏗️</span><div className="ach-title">Multi-folder Pro</div><div className="ach-desc">Search across 5+ folders</div><div className="ach-rarity rarity-rare">Rare</div></div>
          <div className="ach-item locked legendary"><span className="ach-icon">🌌</span><div className="ach-title">File Universe</div><div className="ach-desc">Search 100,000+ files</div><div className="ach-rarity rarity-legendary">Legendary</div></div>
        </div>
      </div>

      {/* Community */}
      <div className="ach-section anim-fade-up">
        <div className="ach-sec-hdr">
          <span style={{ fontSize: '20px' }}>💬</span>
          <div className="ach-sec-title">Community</div>
          <span className="tag">3 / 6 earned</span>
        </div>
        <div className="ach-grid">
          <div className="ach-item"><span className="ach-icon">👋</span><div className="ach-title">First Post</div><div className="ach-desc">Make your first forum post</div><div className="ach-rarity rarity-common">Common</div></div>
          <div className="ach-item"><span className="ach-icon">💬</span><div className="ach-title">Helpful Soul</div><div className="ach-desc">Get 10 upvotes on a post</div><div className="ach-rarity rarity-common">Common</div></div>
          <div className="ach-item rare"><span className="ach-icon">🏆</span><div className="ach-title">Top Contributor</div><div className="ach-desc">Reach top 10 leaderboard</div><div className="ach-rarity rarity-rare">Rare</div></div>
          <div className="ach-item locked"><span className="ach-icon">🗳️</span><div className="ach-title">Roadmap Voter</div><div className="ach-desc">Vote on 5 features</div><div className="ach-prog-mini"><div className="ach-prog-fill" style={{ width: '40%' }}></div></div><div className="ach-prog-txt">2 / 5</div><div className="ach-rarity rarity-common">Common</div></div>
          <div className="ach-item locked epic"><span className="ach-icon">🎙️</span><div className="ach-title">Community Voice</div><div className="ach-desc">Get a suggestion on roadmap</div><div className="ach-rarity rarity-epic">Epic</div></div>
          <div className="ach-item locked legendary"><span className="ach-icon">👑</span><div className="ach-title">Community Legend</div><div className="ach-desc">Reach #1 on leaderboard</div><div className="ach-rarity rarity-legendary">Legendary</div></div>
        </div>
      </div>

      {/* Secret */}
      <div className="ach-section anim-fade-up">
        <div className="ach-sec-hdr">
          <span style={{ fontSize: '20px' }}>🔒</span>
          <div className="ach-sec-title">Secret Achievements</div>
          <span className="tag">0 / 4 found</span>
        </div>
        <div className="secret-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="secret-item">
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px', filter: 'grayscale(1)', opacity: 0.3 }}>❓</span>
              <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: 'var(--mono)' }}>??? — Hidden</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
