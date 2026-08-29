import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Screenshots() {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const i = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(i);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="ss-hero section">
        <div className="ss-orb"></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>App tour</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(36px,6vw,68px)', textAlign: 'center' }}>See FileFlow<br /><span className="gold-text">in action.</span></h1>
          <p className="section-desc" style={{ textAlign: 'center', margin: '0 auto 2.5rem' }}>A walkthrough of every major feature — from instant search to regex mode to achievements.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/beta" className="btn-primary btn-lg">Download free — Windows</Link>
            <Link to="/pricing" className="btn-ghost btn-lg">View pricing</Link>
          </div>
        </div>
      </section>

      {/* Feature 1 — Search */}
      <section className="tour section">
        <div className="container">
          <div className="tour-grid anim-fade-up">
            <div>
              <div className="tour-label">Core feature</div>
              <h2 className="tour-title">Type to search.<br /><span className="gold-text">Results in 50ms.</span></h2>
              <p className="tour-desc">Type any keyword and FileFlow instantly scans the full text of every file in your selected folders — no pre-indexing, no waiting. Results appear as you type.</p>
              <ul className="tour-bullets">
                <li><div className="tbi">⚡</div>Results across 10,000 files in under 100ms on average hardware</li>
                <li><div className="tbi">📄</div>Reads inside PDFs, Word, Excel, PowerPoint, TXT, and 25+ more</li>
                <li><div className="tbi">🎯</div>Context snippets show surrounding text so you know what to open</li>
                <li><div className="tbi">📁</div>Search across multiple folders simultaneously with one query</li>
              </ul>
            </div>
            <div className="aw">
              <div className="aw-bar"><span className="ad r"></span><span className="ad y"></span><span className="ad g"></span><span className="aw-title">FileFlow — Keyword Search</span></div>
              <div className="screen">
                <div className="search-row">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="var(--gold)" strokeWidth="1.4"/><path d="M11 11l2.5 2.5" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  <span className="search-q">termination clause 30 days<span className="cur" style={{ opacity: blink ? 1 : 0 }}></span></span>
                </div>
                <div className="filter-row">
                  <div className="fchip on">All types</div>
                  <div className="fchip">PDF</div><div className="fchip">DOCX</div><div className="fchip">XLSX</div>
                </div>
                <div className="rcount">8 results · 0.06s · 3 folders</div>
                <div className="ritem hl">
                  <div className="rbadge" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>PDF</div>
                  <div className="rinfo"><div className="rname">ServiceAgreement_ClientABC.pdf</div><div className="rsnip">...either party may invoke <mark>termination</mark> with <mark>30 days</mark> written notice...</div></div>
                  <div className="rmeta">p.7<br />3d ago</div>
                </div>
                <div className="ritem">
                  <div className="rbadge" style={{ background: 'var(--purple-dim)', color: 'var(--purple-3)' }}>DOC</div>
                  <div className="rinfo"><div className="rname">NDA_Template_v4.docx</div><div className="rsnip">Section 8: <mark>Termination Clause</mark> — <mark>30 days</mark> notice period...</div></div>
                  <div className="rmeta">p.3<br />1w ago</div>
                </div>
                <div className="ritem">
                  <div className="rbadge" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>PDF</div>
                  <div className="rinfo"><div className="rname">ContractBundle_Q4.pdf</div><div className="rsnip">Standard <mark>30</mark>-day <mark>termination</mark> window applies in all jurisdictions...</div></div>
                  <div className="rmeta">p.14<br />2w ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2 — Folders */}
      <section className="tour section" style={{ background: 'var(--bg-1)' }}>
        <div className="container">
          <div className="tour-grid rev anim-fade-up">
            <div>
              <div className="tour-label">Organisation</div>
              <h2 className="tour-title">Search your folders,<br /><span className="gold-text">your way.</span></h2>
              <p className="tour-desc">Add any folder on your PC, external drive, or network path. FileFlow remembers your locations and lets you search across all of them — or just one — with a single click.</p>
              <ul className="tour-bullets">
                <li><div className="tbi">📂</div>Add unlimited folders from anywhere Windows can reach</li>
                <li><div className="tbi">🔍</div>Search one folder or all at once — you decide per search</li>
                <li><div className="tbi">🏷️</div>Filter by file type, date modified, or file size</li>
                <li><div className="tbi">⭐</div>Pin favourite folders to the top for one-click access</li>
              </ul>
            </div>
            <div className="aw">
              <div className="aw-bar"><span className="ad r"></span><span className="ad y"></span><span className="ad g"></span><span className="aw-title">FileFlow — Folder Manager</span></div>
              <div className="sidebar-screen">
                <div className="spanel">
                  <div className="spanel-label">Locations</div>
                  <div className="sitem active"><div className="sdot" style={{ background: 'var(--gold)' }}></div>All folders</div>
                  <div className="sitem"><div className="sdot" style={{ background: 'var(--purple-2)' }}></div>Documents</div>
                  <div className="sitem"><div className="sdot" style={{ background: '#10b981' }}></div>Desktop</div>
                  <div className="sitem"><div className="sdot" style={{ background: '#3b82f6' }}></div>Downloads</div>
                  <div className="sitem"><div className="sdot" style={{ background: 'var(--text-4)' }}></div>D:\ Archive</div>
                  <div className="sadd">+ Add folder</div>
                </div>
                <div className="smain">
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-4)', marginBottom: '4px' }}>5 locations · 3,872 files</div>
                  <div className="ritem" style={{ marginBottom: '4px' }}><div className="rbadge" style={{ background: 'var(--purple-dim)', color: 'var(--purple-3)' }}>DOC</div><div className="rinfo"><div className="rname">~/Documents</div><div className="rsnip" style={{ fontSize: '10px' }}>1,248 files · Searched 2h ago</div></div></div>
                  <div className="ritem" style={{ marginBottom: '4px' }}><div className="rbadge" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>PDF</div><div className="rinfo"><div className="rname">~/Desktop</div><div className="rsnip" style={{ fontSize: '10px' }}>342 files · Searched 5h ago</div></div></div>
                  <div className="ritem"><div className="rbadge" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>XLS</div><div className="rinfo"><div className="rname">~/Downloads</div><div className="rsnip" style={{ fontSize: '10px' }}>921 files · Searched 1d ago</div></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3 — Regex */}
      <section className="tour section">
        <div className="container">
          <div className="tour-grid anim-fade-up">
            <div>
              <div className="tour-label">Power users</div>
              <h2 className="tour-title">Regex, Boolean,<br /><span className="gold-text">exact match.</span></h2>
              <p className="tour-desc">Simple keyword not cutting it? Switch to regex, exact phrase matching, or Boolean operators for surgical searches across thousands of files.</p>
              <ul className="tour-bullets">
                <li><div className="tbi">🔮</div>Full regex — wrap query in <code style={{ fontFamily: 'var(--mono)', fontSize: '12px', background: 'var(--bg-3)', padding: '1px 5px', borderRadius: '4px', color: 'var(--purple-3)' }}>/pattern/i</code></li>
                <li><div className="tbi">🔗</div>Boolean: AND, OR, NOT between terms</li>
                <li><div className="tbi">💬</div>Exact phrase matching with double quotes</li>
                <li><div className="tbi">📊</div>Wildcard * for partial word matching</li>
              </ul>
              <span className="tag gold">Pro feature</span>
            </div>
            <div className="aw">
              <div className="aw-bar"><span className="ad r"></span><span className="ad y"></span><span className="ad g"></span><span className="aw-title">FileFlow — Regex Mode</span></div>
              <div className="screen">
                <div className="search-row" style={{ borderColor: 'rgba(124,58,237,0.4)', boxShadow: '0 0 0 3px rgba(124,58,237,0.1)' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="var(--purple-3)" strokeWidth="1.4"/><path d="M11 11l2.5 2.5" stroke="var(--purple-3)" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  <span className="search-q" style={{ color: 'var(--purple-3)' }}>/INV-\d{"{4,6}"}/i</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--purple-3)', background: 'var(--purple-dim)', padding: '2px 8px', borderRadius: '4px', flexShrink: 0 }}>REGEX</span>
                </div>
                <div className="rcount">47 invoice numbers · 12 files · 0.09s</div>
                <div className="ritem hl">
                  <div className="rbadge" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>PDF</div>
                  <div className="rinfo"><div className="rname">Supplier_Invoices_Q4.pdf</div><div className="rsnip">Reference: <mark>INV-48291</mark> · Amount: $14,500 · Due: 15 Jan 2026</div></div>
                  <div className="rmeta">p.3<br />14 hits</div>
                </div>
                <div className="ritem">
                  <div className="rbadge" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>PDF</div>
                  <div className="rinfo"><div className="rname">Accounts_Payable_Nov.pdf</div><div className="rsnip"><mark>INV-5521</mark>, <mark>INV-5522</mark>, <mark>INV-5589</mark> — batch approved</div></div>
                  <div className="rmeta">p.8<br />9 hits</div>
                </div>
                <div className="ritem">
                  <div className="rbadge" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>XLS</div>
                  <div className="rinfo"><div className="rname">Finance_Tracker_2026.xlsx</div><div className="rsnip"><mark>INV-1047</mark> through <mark>INV-1092</mark> — Q1 cleared</div></div>
                  <div className="rmeta">row 14<br />24 hits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 4 — Achievements & settings */}
      <section className="tour section" style={{ background: 'var(--bg-1)' }}>
        <div className="container">
          <div className="tour-grid rev anim-fade-up">
            <div>
              <div className="tour-label">Personalisation</div>
              <h2 className="tour-title">Achievements,<br /><span className="gold-text">stats & settings.</span></h2>
              <p className="tour-desc">FileFlow tracks your search activity and rewards heavy users with a full achievement system. Every setting is customisable and stored locally.</p>
              <ul className="tour-bullets">
                <li><div className="tbi">🏆</div>40 achievements across search, file mastery, and community</li>
                <li><div className="tbi">📊</div>Personal stats — searches run, time saved, files opened</li>
                <li><div className="tbi">🌙</div>Dark / light theme, font size, result density settings</li>
                <li><div className="tbi">🔒</div>Opt in or out of anonymous analytics anytime in Settings → Privacy</li>
              </ul>
            </div>
            <div className="aw">
              <div className="aw-bar"><span className="ad r"></span><span className="ad y"></span><span className="ad g"></span><span className="aw-title">FileFlow — Settings</span></div>
              <div className="settings-screen">
                <div className="setting-row"><div><div className="setting-lbl">Dark theme</div><div className="setting-sub">Matches system default</div></div><div className="toggle on"></div></div>
                <div className="setting-row"><div><div className="setting-lbl">Anonymous analytics</div><div class="setting-sub">Help improve FileFlow</div></div><div className="toggle off"></div></div>
                <div className="setting-row"><div><div className="setting-lbl">Crash reports</div><div className="setting-sub">No file content included</div></div><div className="toggle on"></div></div>
                <div className="setting-row"><div><div className="setting-lbl">Show page numbers</div><div className="setting-sub">For PDF results</div></div><div className="toggle on"></div></div>
                <div className="setting-row"><div><div className="setting-lbl">Context lines</div><div className="setting-sub">Lines shown per result</div></div><span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--gold)' }}>2 lines</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery section">
        <div className="container">
          <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Feature gallery</div>
            <h2 className="section-title" style={{ textAlign: 'center' }}>More of the app.</h2>
          </div>
          <div className="gal-grid anim-fade-up">
            <div className="gthumb">
              <div className="gthumb-pre" style={{ background: 'linear-gradient(135deg,var(--bg-3),var(--surface))' }}>🔍</div>
              <div className="gthumb-lbl">Keyword search results</div>
            </div>
            <div className="gthumb">
              <div className="gthumb-pre" style={{ background: 'linear-gradient(135deg,var(--surface-2),var(--bg-2))' }}>📂</div>
              <div className="gthumb-lbl">Multi-folder manager</div>
            </div>
            <div className="gthumb">
              <div className="gthumb-pre" style={{ background: 'linear-gradient(135deg,var(--bg-3),var(--surface-3))' }}>⚙️</div>
              <div className="gthumb-lbl">Settings & preferences</div>
            </div>
            <div className="gthumb">
              <div className="gthumb-pre" style={{ background: 'linear-gradient(135deg,var(--surface),var(--bg-3))' }}>🏆</div>
              <div className="gthumb-lbl">Achievement system</div>
            </div>
            <div className="gthumb">
              <div className="gthumb-pre" style={{ background: 'linear-gradient(135deg,var(--bg-2),var(--surface-2))' }}>📊</div>
              <div className="gthumb-lbl">Personal usage stats</div>
            </div>
            <div className="gthumb">
              <div className="gthumb-pre" style={{ background: 'linear-gradient(135deg,var(--bg-3),var(--bg-2))' }}>🔮</div>
              <div className="gthumb-lbl">Regex search mode</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/beta" className="btn-primary btn-lg">Download FileFlow free →</Link>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-4)', marginTop: '1rem' }}>Windows 10 / 11 · 12 MB · 100% offline · Free 14-day trial</p>
          </div>
        </div>
      </section>
    </>
  );
}
