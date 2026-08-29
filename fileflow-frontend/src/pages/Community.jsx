import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Bug, Rocket, HelpCircle, ArrowLeft, ArrowUp } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Community() {
  const [activeTab, setActiveTab] = useState('Latest');
  const [view, setView] = useState('list'); // 'list' or 'thread'
  const [votedThreads, setVotedThreads] = useState({});

  const showThread = () => {
    setView('thread');
    window.scrollTo(0, 0);
  };

  const hideThread = () => {
    setView('list');
    window.scrollTo(0, 0);
  };

  const handleVote = (e, id) => {
    e.stopPropagation();
    setVotedThreads(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePostReply = (e) => {
    e.preventDefault();
    toast.success("Reply posted!");
  };

  return (
    <>
      <section className="comm-hero section">
        <div className="container">
          <div className="section-label">Community</div>
          <h1 className="section-title">Ask, share, and<br /><span className="gold-text">help each other.</span></h1>
          <p className="section-desc">Join thousands of FileFlow users discussing tips, reporting bugs, and voting on the next features.</p>
          <div className="comm-stats anim-fade-up">
            <div className="comm-stat"><div className="comm-stat-n">4.2k</div><div className="comm-stat-l">Members</div></div>
            <div className="comm-stat"><div className="comm-stat-n">891</div><div className="comm-stat-l">Threads</div></div>
            <div className="comm-stat"><div className="comm-stat-n">3.4k</div><div className="comm-stat-l">Replies</div></div>
            <div className="comm-stat"><div className="comm-stat-n">12</div><div className="comm-stat-l">Online now</div></div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* LIST VIEW */}
        <div className={`list-view ${view === 'thread' ? 'hidden' : ''}`} id="list-view">
          <div style={{ paddingBottom: '6rem' }}>
            <div className="cats-grid anim-fade-up">
              <div className="cat-card"><div className="cat-icon" style={{ background: 'var(--gold-dim)' }}><Lightbulb size={22} color="var(--gold)" /></div><div><div className="cat-name">Tips & Tricks</div><div className="cat-desc">Search techniques and workflow ideas</div><div className="cat-count">312 threads</div></div></div>
              <div className="cat-card"><div className="cat-icon" style={{ background: 'var(--red-dim)' }}><Bug size={22} color="#f87171" /></div><div><div className="cat-name">Bug Reports</div><div className="cat-desc">Found something broken? Report it here</div><div className="cat-count">94 threads</div></div></div>
              <div className="cat-card"><div className="cat-icon" style={{ background: 'var(--purple-dim)' }}><Rocket size={22} color="var(--purple-3)" /></div><div><div className="cat-name">Feature Requests</div><div className="cat-desc">What should we build next?</div><div className="cat-count">218 threads</div></div></div>
              <div className="cat-card"><div className="cat-icon" style={{ background: 'var(--green-dim)' }}><HelpCircle size={22} color="var(--green)" /></div><div><div className="cat-name">Help & Support</div><div className="cat-desc">Installation, settings, and how-tos</div><div className="cat-count">267 threads</div></div></div>
            </div>

            <div className="comm-layout">
              <div>
                <div className="threads-hdr">
                  <h3>Recent threads</h3>
                  <div className="sort-btns">
                    {['Latest', 'Top voted', 'Unanswered'].map(tab => (
                      <button key={tab} className={`sort-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                    ))}
                  </div>
                  <button className="btn-primary" onClick={showThread} style={{ padding: '8px 16px', fontSize: '13px' }}>+ New thread</button>
                </div>
                <div className="thread-list">
                  <div className="thread pinned" onClick={showThread}>
                    <div className="thread-votes">
                      <button className={`t-vote-btn ${votedThreads[1] ? 'voted' : ''}`} onClick={(e) => handleVote(e, 1)}><ArrowUp size={10} /></button>
                      <span className="t-vote-count">{votedThreads[1] ? 49 : 48}</span>
                    </div>
                    <div className="thread-body">
                      <div className="thread-title"><span className="pin-icon">📌 </span>Welcome to the FileFlow Community — read before posting</div>
                      <div className="thread-excerpt">Community guidelines, how to report bugs, how to request features, and where to find help fastest.</div>
                      <div className="thread-meta"><span className="tag green">pinned</span><span className="thread-author">by FileFlow Team</span><span className="thread-replies">💬 12 replies</span><span className="thread-time">Apr 1</span></div>
                    </div>
                  </div>
                  
                  <div className="thread" onClick={showThread}>
                    <div className="thread-votes">
                      <button className={`t-vote-btn ${votedThreads[2] ? 'voted' : ''}`} onClick={(e) => handleVote(e, 2)}><ArrowUp size={10} /></button>
                      <span className="t-vote-count">{votedThreads[2] ? 35 : 34}</span>
                    </div>
                    <div className="thread-body">
                      <div className="thread-title">Regex to find all invoice numbers across 500 PDFs — here's my pattern</div>
                      <div className="thread-excerpt">After a week of testing I landed on this pattern: /INV-\d{`{4,6}`}/ — works on all my supplier invoices</div>
                      <div className="thread-meta"><span className="tag">Tips & Tricks</span><span className="thread-author">by marcus_k</span><span className="thread-replies">💬 18 replies</span><span className="thread-time">2h ago</span></div>
                    </div>
                  </div>

                  <div className="thread" onClick={showThread}>
                    <div className="thread-votes">
                      <button className={`t-vote-btn ${votedThreads[3] ? 'voted' : ''}`} onClick={(e) => handleVote(e, 3)}><ArrowUp size={10} /></button>
                      <span className="t-vote-count">{votedThreads[3] ? 22 : 21}</span>
                    </div>
                    <div className="thread-body">
                      <div className="thread-title">Search returns 0 results for .xlsx files after Windows 11 update</div>
                      <div className="thread-excerpt">After KB5040442 installed last night, searching inside .xlsx files stopped working. PDFs still fine.</div>
                      <div className="thread-meta"><span className="tag" style={{ background: 'var(--red-dim)', color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}>Bug</span><span className="thread-author">by jlee_ops</span><span className="thread-replies">💬 7 replies</span><span className="thread-time">5h ago</span></div>
                    </div>
                  </div>

                  <div className="thread" onClick={showThread}>
                    <div className="thread-votes">
                      <button className={`t-vote-btn ${votedThreads[4] ? 'voted' : ''}`} onClick={(e) => handleVote(e, 4)}><ArrowUp size={10} /></button>
                      <span className="t-vote-count">{votedThreads[4] ? 90 : 89}</span>
                    </div>
                    <div className="thread-body">
                      <div className="thread-title">[Request] macOS support — please! 512 upvotes on roadmap</div>
                      <div className="thread-excerpt">Linking to the roadmap item to consolidate the discussion here. Let's show the team how many of us need this.</div>
                      <div className="thread-meta"><span className="tag">Feature Request</span><span className="thread-author">by sarah_r_research</span><span className="thread-replies">💬 43 replies</span><span className="thread-time">1d ago</span></div>
                    </div>
                  </div>

                  <div className="thread" onClick={showThread}>
                    <div className="thread-votes">
                      <button className={`t-vote-btn ${votedThreads[5] ? 'voted' : ''}`} onClick={(e) => handleVote(e, 5)}><ArrowUp size={10} /></button>
                      <span className="t-vote-count">{votedThreads[5] ? 16 : 15}</span>
                    </div>
                    <div className="thread-body">
                      <div className="thread-title">How do I search inside password-protected Word files?</div>
                      <div className="thread-excerpt">I have a folder of protected .docx files. Is there a way to provide passwords to FileFlow so it can search inside?</div>
                      <div className="thread-meta"><span className="tag green">Help</span><span className="thread-author">by newuser_42</span><span className="thread-replies">💬 5 replies</span><span className="thread-time">2d ago</span></div>
                    </div>
                  </div>
                  
                  <div className="thread" onClick={showThread}>
                    <div className="thread-votes">
                      <button className={`t-vote-btn ${votedThreads[6] ? 'voted' : ''}`} onClick={(e) => handleVote(e, 6)}><ArrowUp size={10} /></button>
                      <span className="t-vote-count">{votedThreads[6] ? 57 : 56}</span>
                    </div>
                    <div className="thread-body">
                      <div className="thread-title">FileFlow saved me 4 hours this week — here's how I use it</div>
                      <div className="thread-excerpt">I manage contracts for 80 clients. Here's my exact workflow for finding any clause in any agreement in under 10 seconds.</div>
                      <div className="thread-meta"><span className="tag">Tips & Tricks</span><span className="thread-author">by joelle_legal</span><span className="thread-replies">💬 22 replies</span><span className="thread-time">3d ago</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="comm-sidebar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link to="/beta" className="btn-primary" style={{ justifyContent: 'center' }}>Join FileFlow free</Link>
                  <button className="btn-ghost" onClick={showThread} style={{ justifyContent: 'center' }}>+ Start a thread</button>
                </div>
                <div className="sidebar-box">
                  <h4>🏆 Top contributors</h4>
                  <div className="contrib"><div className="contrib-av" style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}>MK</div><div className="contrib-name">marcus_k</div><span className="contrib-pts">2,140 pts</span></div>
                  <div className="contrib"><div className="contrib-av" style={{ background: 'var(--purple-dim)', color: 'var(--purple-3)' }}>SR</div><div className="contrib-name">sarah_r</div><span className="contrib-pts">1,870 pts</span></div>
                  <div className="contrib"><div className="contrib-av" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>JL</div><div className="contrib-name">joelle_legal</div><span className="contrib-pts">1,640 pts</span></div>
                  <div className="contrib"><div className="contrib-av" style={{ background: 'var(--bg-3)', color: 'var(--text-3)' }}>TK</div><div className="contrib-name">techkid_99</div><span className="contrib-pts">980 pts</span></div>
                </div>
                <div className="sidebar-box">
                  <h4>📋 Community rules</h4>
                  <div className="rule"><span className="rule-n">01</span>Be respectful and constructive</div>
                  <div className="rule"><span className="rule-n">02</span>Search before posting — avoid duplicates</div>
                  <div className="rule"><span className="rule-n">03</span>Use the right category</div>
                  <div className="rule"><span className="rule-n">04</span>No spam or self-promotion</div>
                  <div className="rule"><span className="rule-n">05</span>Bug reports need version number & OS</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* THREAD VIEW */}
        <div className={`thread-view ${view === 'thread' ? 'active' : ''}`} id="thread-view">
          <div style={{ padding: '3rem 0 6rem', maxWidth: '760px' }}>
            <div className="article-back" onClick={hideThread} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-2)', cursor: 'pointer', marginBottom: '2rem', fontSize: '14px', transition: 'color 0.2s' }}>
              <ArrowLeft size={16} /> Back to forum
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="tag">Tips & Tricks</span>
                <span className="tag gold">34 upvotes</span>
              </div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: '0.5rem' }}>
                Regex to find all invoice numbers across 500 PDFs — here's my pattern
              </h1>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-4)' }}>18 replies · posted 2h ago</div>
            </div>
            
            <div className="reply-card op">
              <div className="reply-author">
                <div className="reply-av" style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}>MK</div>
                <div>
                  <div className="reply-name">marcus_k <span className="tag gold" style={{ marginLeft: '6px', fontSize: '10px' }}>Top contributor</span></div>
                  <div className="reply-meta">Original post · 2h ago</div>
                </div>
              </div>
              <div className="reply-body">
                <p>After processing thousands of supplier invoices with FileFlow, I've settled on a regex pattern that catches 99% of my invoice numbers.</p>
                <p>The pattern I use: <code>/INV-\d{`{4,6}`}/i</code> — this catches formats like INV-1234, INV-98765, and inv-4321 (case-insensitive).</p>
                <p>For more complex invoices that use different formats, I combine patterns with OR: <code>/(INV|REF|PO)-\d{`{3,8}`}/i</code></p>
                <p>One tip: if you're searching across folders, make sure to set the file type filter to PDF only first — it's about 3x faster than searching all types.</p>
              </div>
              <div className="reply-actions">
                <button className={`vote-btn ${votedThreads['op'] ? 'voted' : ''}`} onClick={(e) => handleVote(e, 'op')}><ArrowUp size={12} /> {votedThreads['op'] ? 35 : 34}</button>
                <button className="vote-btn">Reply</button>
              </div>
            </div>

            <div className="reply-card">
              <div className="reply-author">
                <div className="reply-av" style={{ background: 'var(--purple-dim)', color: 'var(--purple-3)' }}>SR</div>
                <div><div className="reply-name">sarah_r</div><div className="reply-meta">2h ago</div></div>
              </div>
              <div className="reply-body">
                <p>This is incredibly helpful. I've been doing manual Ctrl+F inside each file. Going to try this across my research archive today.</p>
              </div>
              <div className="reply-actions">
                <button className={`vote-btn ${votedThreads['r1'] ? 'voted' : ''}`} onClick={(e) => handleVote(e, 'r1')}><ArrowUp size={12} /> {votedThreads['r1'] ? 9 : 8}</button>
                <button className="vote-btn">Reply</button>
              </div>
            </div>

            <div className="reply-card">
              <div className="reply-author">
                <div className="reply-av" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>FF</div>
                <div>
                  <div className="reply-name">FileFlow Team <span className="tag green" style={{ marginLeft: '6px', fontSize: '10px' }}>Official</span></div>
                  <div className="reply-meta">1h ago</div>
                </div>
              </div>
              <div className="reply-body">
                <p>Great thread! Just to add — in v0.9.2 (shipping next week), regex performance gets another boost. Multi-folder regex searches will be ~30% faster due to the new parallel reader.</p>
              </div>
              <div className="reply-actions">
                <button className={`vote-btn ${votedThreads['r2'] ? 'voted' : ''}`} onClick={(e) => handleVote(e, 'r2')}><ArrowUp size={12} /> {votedThreads['r2'] ? 22 : 21}</button>
              </div>
            </div>

            <div className="reply-box" style={{ marginTop: '2rem' }}>
              <h4>Reply to this thread</h4>
              <form onSubmit={handlePostReply}>
                <textarea className="input" rows={4} placeholder="Share your thoughts, tips, or follow-up questions..." style={{ resize: 'vertical', marginBottom: '12px', width: '100%', padding: '12px' }} required></textarea>
                <button type="submit" className="btn-primary">Post reply</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
