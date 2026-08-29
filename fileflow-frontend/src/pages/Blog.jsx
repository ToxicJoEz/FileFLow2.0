import React, { useState } from 'react';
import { Search, FileText, Zap, Settings, Shield, BarChart, Award, ArrowLeft, Share, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Blog() {
  const [activeCat, setActiveCat] = useState('all');
  const [view, setView] = useState('list'); // 'list' or 'article'

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast.success("Subscribed to newsletter!");
  };

  const showArticle = () => {
    setView('article');
    window.scrollTo(0, 0);
  };

  const hideArticle = () => {
    setView('list');
    window.scrollTo(0, 0);
  };

  const posts = [
    { cat: 'tutorial', icon: <FileText size={28} />, title: 'How to search inside scanned PDFs', excerpt: 'OCR is coming in v1.0. Until then, here\'s how to pre-process your scans for searchability.', read: '5 min', bg: 'var(--bg-3)', bg2: 'var(--surface)' },
    { cat: 'productivity', icon: <Zap size={28} />, title: '5 search habits that will save you hours every week', excerpt: 'From date filters to regex shortcuts, here\'s how power users get the most out of FileFlow.', read: '4 min', bg: 'var(--surface-2)', bg2: 'var(--bg-2)' },
    { cat: 'build', icon: <Settings size={28} />, title: 'Why we chose Electron + Python for the desktop app', excerpt: 'The tradeoffs, the surprises, and why this stack lets us ship fast without sacrificing performance.', read: '8 min', bg: 'var(--bg-3)', bg2: 'var(--surface-3)' },
    { cat: 'product', icon: <Shield size={28} />, title: 'What "100% offline" actually means in FileFlow', excerpt: 'A technical breakdown of why your files never touch our servers — or anyone else\'s.', read: '3 min', bg: 'var(--bg-2)', bg2: 'var(--surface)' },
    { cat: 'tutorial', icon: <BarChart size={28} />, title: 'Searching inside Excel files: tips and edge cases', excerpt: 'Merged cells, hidden sheets, formula values — here\'s what FileFlow reads and what to watch out for.', read: '6 min', bg: 'var(--surface-3)', bg2: 'var(--bg-3)' },
    { cat: 'product', icon: <Award size={28} />, title: 'Introducing achievements — making search fun', excerpt: 'We added an achievement system to FileFlow. Here\'s why gamification might actually improve your workflow.', read: '2 min', bg: 'var(--bg-3)', bg2: 'var(--surface-2)' },
  ];

  return (
    <>
      <section className="blog-hero section">
        <div className="container">
          <div className="section-label">Blog</div>
          <h1 className="section-title">Tips, updates &<br /><span className="gold-text">deep dives.</span></h1>
          <div className="blog-cats">
            {['all', 'product', 'tutorial', 'productivity', 'build'].map(cat => (
              <button 
                key={cat}
                className={`cat-btn ${activeCat === cat ? 'active' : ''}`}
                onClick={() => setActiveCat(cat)}
              >
                {cat === 'all' ? 'All' : cat === 'product' ? 'Product updates' : cat === 'tutorial' ? 'Tutorials' : cat === 'productivity' ? 'Productivity' : 'Behind the build'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        {/* LIST VIEW */}
        <div className={`list-view ${view === 'article' ? 'hidden' : ''}`}>
          <div className="blog-layout">
            <div>
              {/* Featured */}
              {('all' === activeCat || 'product' === activeCat) && (
                <div className="featured-post anim-fade-up" onClick={showArticle}>
                  <div className="featured-img">
                    <div className="featured-img-pattern"></div>
                    <Search className="featured-img-icon" />
                  </div>
                  <div className="featured-body">
                    <div className="post-meta"><span className="tag gold">Product Update</span><span className="post-date">Apr 20, 2026</span></div>
                    <h2>FileFlow v0.9 — Regex search, faster engine, and new file formats</h2>
                    <p>Our biggest update yet. v0.9 introduces regex and Boolean search modes, a 40% faster engine, and support for 8 new file types including EPUB and ODS.</p>
                    <span style={{ color: 'var(--gold)', fontSize: '14px', fontWeight: 500 }}>Read the full update →</span>
                  </div>
                </div>
              )}
              
              {/* Grid */}
              <div className="posts-grid">
                {posts.filter(p => activeCat === 'all' || p.cat === activeCat).map((post, i) => (
                  <div key={i} className="post-card anim-fade-up" onClick={showArticle}>
                    <div className="post-thumb" style={{ background: `linear-gradient(135deg, ${post.bg}, ${post.bg2})` }}>
                      <div className="post-thumb-pattern"></div>
                      {post.icon}
                    </div>
                    <div className="post-body">
                      <div className="post-meta">
                        <span className="tag">{post.cat === 'tutorial' ? 'Tutorial' : post.cat === 'productivity' ? 'Productivity' : post.cat === 'build' ? 'Behind the build' : 'Product'}</span>
                        <span className="post-read">{post.read}</span>
                      </div>
                      <div className="post-title">{post.title}</div>
                      <div className="post-excerpt">{post.excerpt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="blog-sidebar">
              <div className="sidebar-box">
                <h4>📬 Newsletter</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '1rem' }}>Get new posts in your inbox. No spam, ever.</p>
                <form className="sidebar-input-row" onSubmit={handleNewsletterSubmit}>
                  <input className="input" type="email" placeholder="your@email.com" style={{ fontSize: '13px', padding: '9px 12px' }} required />
                  <button type="submit"><ArrowRight size={14} /></button>
                </form>
              </div>
              <div className="sidebar-box">
                <h4>🔥 Popular posts</h4>
                <div className="pop-post" onClick={showArticle}><span className="pop-num">01</span><span className="pop-title">FileFlow v0.9 — Regex search, faster engine, and new file formats</span></div>
                <div className="pop-post" onClick={showArticle}><span className="pop-num">02</span><span className="pop-title">Why we chose Electron + Python for the desktop app</span></div>
                <div className="pop-post" onClick={showArticle}><span className="pop-num">03</span><span className="pop-title">5 search habits that will save you hours every week</span></div>
                <div className="pop-post" onClick={showArticle}><span className="pop-num">04</span><span className="pop-title">What "100% offline" actually means in FileFlow</span></div>
              </div>
              <div className="sidebar-box">
                <h4>🏷️ Topics</h4>
                <div className="tags-cloud">
                  <span className="tag" style={{ cursor: 'pointer' }}>Search tips</span>
                  <span className="tag" style={{ cursor: 'pointer' }}>PDF</span>
                  <span className="tag gold" style={{ cursor: 'pointer' }}>v0.9 update</span>
                  <span className="tag" style={{ cursor: 'pointer' }}>Privacy</span>
                  <span className="tag" style={{ cursor: 'pointer' }}>Productivity</span>
                  <span className="tag" style={{ cursor: 'pointer' }}>Excel</span>
                  <span className="tag" style={{ cursor: 'pointer' }}>Regex</span>
                  <span className="tag" style={{ cursor: 'pointer' }}>Behind the build</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ARTICLE VIEW */}
        <div className={`article-view ${view === 'article' ? 'active' : ''}`}>
          <div style={{ padding: '3rem 0 6rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem', alignItems: 'start' }}>
            <div>
              <div className="article-back" onClick={hideArticle}><ArrowLeft size={16} /> Back to blog</div>
              <div className="article-hdr">
                <div className="post-meta"><span className="tag gold">Product Update</span><span className="post-date">Apr 20, 2026</span><span className="post-read">7 min read</span></div>
                <h1 className="article-title">FileFlow v0.9 — Regex search, faster engine, and new file formats</h1>
                <div className="article-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--purple-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--purple-3)' }}>FF</div>
                    <div><div style={{ fontSize: '14px', fontWeight: 500 }}>FileFlow Team</div><div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-3)' }}>file-flow.com</div></div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    <span className="tag" style={{ cursor: 'pointer' }}><Share size={12} /> Share</span>
                    <span className="tag" style={{ cursor: 'pointer' }}><LinkIcon size={12} /> Copy link</span>
                  </div>
                </div>
              </div>
              <div className="article-body">
                <p>Today we're shipping FileFlow v0.9 — our biggest update since launch. This release focuses on three things: more powerful search modes, a significantly faster engine, and broader file format support.</p>
                <h2>What's new in v0.9</h2>
                <h3>Regex & Boolean search</h3>
                <p>You can now use regular expressions directly in the search bar. Wrap your query in forward slashes to activate regex mode:</p>
                <pre><code>/quarterly.{`{0,20}`}revenue/i</code></pre>
                <p>Boolean operators also work as expected. Use <code>AND</code>, <code>OR</code>, and <code>NOT</code> to build complex queries:</p>
                <pre><code>"invoice" AND ("2024" OR "2025") NOT "draft"</code></pre>
                <h3>40% faster search engine</h3>
                <p>We rewrote the core file-reading pipeline in Cython and switched to parallel processing for multi-folder searches. On a test set of 50,000 mixed documents, average search time dropped from 140ms to 82ms.</p>
                <blockquote>Our goal is sub-50ms on any consumer-grade Windows PC for collections up to 100,000 files. We're not there yet, but v0.9 gets us closer.</blockquote>
                <h3>8 new file formats</h3>
                <p>FileFlow now reads inside: <code>.epub</code>, <code>.ods</code>, <code>.odt</code>, <code>.odp</code>, <code>.pages</code>, <code>.numbers</code>, <code>.key</code>, and <code>.msg</code> (Outlook email exports).</p>
                <h2>How to update</h2>
                <p>If you have auto-update enabled, FileFlow will prompt you on next launch. Otherwise, download the installer from your dashboard or from the beta page. Your settings and search history are preserved.</p>
                <p>As always, your files never leave your machine. The update is distributed as a signed Windows installer — no cloud sync, no telemetry changes.</p>
              </div>
            </div>
            
            <div className="blog-sidebar" style={{ position: 'sticky', top: '90px' }}>
              <div className="sidebar-box">
                <h4>📬 Newsletter</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '1rem' }}>Get new posts in your inbox.</p>
                <form className="sidebar-input-row" onSubmit={handleNewsletterSubmit}>
                  <input className="input" type="email" placeholder="your@email.com" style={{ fontSize: '13px', padding: '9px 12px' }} required />
                  <button type="submit"><ArrowRight size={14} /></button>
                </form>
              </div>
              <div className="sidebar-box">
                <h4>🏷️ Topics</h4>
                <div className="tags-cloud">
                  <span className="tag gold" style={{ cursor: 'pointer' }}>v0.9 update</span>
                  <span className="tag" style={{ cursor: 'pointer' }}>Search tips</span>
                  <span className="tag" style={{ cursor: 'pointer' }}>Regex</span>
                  <span className="tag" style={{ cursor: 'pointer' }}>Performance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
