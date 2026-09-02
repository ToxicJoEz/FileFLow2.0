import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { subscribeNewsletter } from '../services/form.service';

export default function Changelog() {
  const [activeVersion, setActiveVersion] = useState('v094');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await subscribeNewsletter(email);
      toast.success("Subscribed successfully!");
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || "Subscription failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScroll = (id) => {
    setActiveVersion(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="cl-hero section">
        <div className="cl-orb"></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label">Changelog</div>
          <h1 className="section-title">What's new<br /><span className="gold-text">in FileFlow.</span></h1>
          <p className="section-desc">Every release, every fix, every improvement — documented here.</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link to="/roadmap" className="btn-ghost" style={{ fontSize: '13px', padding: '8px 16px' }}>📋 View roadmap</Link>
            <Link to="/beta" className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>Download v0.9.4</Link>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="cl-layout">
          <div className="cl-sidebar">
            <div className="cl-label">Versions</div>
            <button onClick={() => handleScroll('v094')} className={`cl-link ${activeVersion === 'v094' ? 'cur' : ''}`} style={{ background: 'none', borderRight: 'none', borderTop: 'none', borderBottom: 'none', textAlign: 'left', width: '100%' }}>
              <div className="cl-dot" style={{ background: 'var(--green)' }}></div>v0.9.4 <span className="tag green" style={{ fontSize: '9px', marginLeft: '4px' }}>latest</span>
            </button>
            <button onClick={() => handleScroll('v093')} className={`cl-link ${activeVersion === 'v093' ? 'cur' : ''}`} style={{ background: 'none', borderRight: 'none', borderTop: 'none', borderBottom: 'none', textAlign: 'left', width: '100%' }}>
              <div className="cl-dot" style={{ background: 'var(--text-3)' }}></div>v0.9.3
            </button>
            <button onClick={() => handleScroll('v092')} className={`cl-link ${activeVersion === 'v092' ? 'cur' : ''}`} style={{ background: 'none', borderRight: 'none', borderTop: 'none', borderBottom: 'none', textAlign: 'left', width: '100%' }}>
              <div className="cl-dot" style={{ background: 'var(--text-3)' }}></div>v0.9.2
            </button>
            <button onClick={() => handleScroll('v090')} className={`cl-link ${activeVersion === 'v090' ? 'cur' : ''}`} style={{ background: 'none', borderRight: 'none', borderTop: 'none', borderBottom: 'none', textAlign: 'left', width: '100%' }}>
              <div className="cl-dot" style={{ background: 'var(--text-3)' }}></div>v0.9.0
            </button>
            <button onClick={() => handleScroll('v082')} className={`cl-link ${activeVersion === 'v082' ? 'cur' : ''}`} style={{ background: 'none', borderRight: 'none', borderTop: 'none', borderBottom: 'none', textAlign: 'left', width: '100%' }}>
              <div className="cl-dot" style={{ background: 'var(--text-3)' }}></div>v0.8.2
            </button>
            <button onClick={() => handleScroll('v080')} className={`cl-link ${activeVersion === 'v080' ? 'cur' : ''}`} style={{ background: 'none', borderRight: 'none', borderTop: 'none', borderBottom: 'none', textAlign: 'left', width: '100%' }}>
              <div className="cl-dot" style={{ background: 'var(--text-3)' }}></div>v0.8.0
            </button>
            <button onClick={() => handleScroll('v07x')} className={`cl-link ${activeVersion === 'v07x' ? 'cur' : ''}`} style={{ background: 'none', borderRight: 'none', borderTop: 'none', borderBottom: 'none', textAlign: 'left', width: '100%' }}>
              <div className="cl-dot" style={{ background: 'var(--text-4)' }}></div>v0.7.x
            </button>
            
            <div className="cl-sub">
              <h4>🎉 Stay updated</h4>
              <p>Get release notes in your inbox.</p>
              <form className="cl-sub-row" onSubmit={handleSubscribe}>
                <input 
                  className="input" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={isSubmitting}
                />
                <button type="submit" disabled={isSubmitting}>→</button>
              </form>
            </div>
          </div>

          <div>
            <div className="cl-entry" id="v094">
              <div className="cl-hdr">
                <div className="cl-ver">v0.9.4</div>
                <span className="tag green">Latest</span>
                <span className="cl-date">April 20, 2026</span>
              </div>
              <div className="cl-grp">
                <div className="cl-grp-title new">New features</div>
                <ul className="cl-items">
                  <li><div className="cl-item-dot new"></div><span><strong>Search history panel</strong> — browse your last 50 searches and re-run any with one click. Stored locally in SQLite.</span></li>
                  <li><div className="cl-item-dot new"></div><span><strong>Pinned searches</strong> — save up to 10 frequent queries to the sidebar for instant access. <span className="pro">PRO</span></span></li>
                  <li><div className="cl-item-dot new"></div><span><strong>Date range filter</strong> — narrow results to files modified in the last day, week, month, or custom range.</span></li>
                  <li><div className="cl-item-dot new"></div><span><strong>.MSG support</strong> — search inside exported Outlook email files.</span></li>
                </ul>
              </div>
              <div className="cl-grp">
                <div className="cl-grp-title imp">Improvements</div>
                <ul className="cl-items">
                  <li><div className="cl-item-dot imp"></div><span><strong>40% faster Excel parsing</strong> — rewrote XLSX reader using openpyxl streaming. Large spreadsheets no longer block the UI.</span></li>
                  <li><div className="cl-item-dot imp"></div><span><strong>Result highlighting</strong> — all keyword occurrences highlighted in snippets, not just the first.</span></li>
                  <li><div className="cl-item-dot imp"></div><span>Improved performance on network drives — reduced timeout errors and added retry logic for slow NAS.</span></li>
                </ul>
              </div>
              <div className="cl-grp">
                <div className="cl-grp-title fix">Bug fixes</div>
                <ul className="cl-items">
                  <li><div className="cl-item-dot fix"></div><span>Fixed crash when searching folders containing files with emoji in filenames on Windows 10.</span></li>
                  <li><div className="cl-item-dot fix"></div><span>Fixed regex mode returning zero results for lookahead patterns on some Windows configurations.</span></li>
                  <li><div className="cl-item-dot fix"></div><span>Fixed settings window not saving theme preference after restart.</span></li>
                  <li><div className="cl-item-dot fix"></div><span>Fixed memory leak when searching folders with 50,000+ files repeatedly in one session.</span></li>
                </ul>
              </div>
            </div>
            
            <div className="cl-sep"></div>
            
            <div className="cl-entry" id="v093">
              <div className="cl-hdr"><div className="cl-ver">v0.9.3</div><span className="cl-date">March 28, 2026</span></div>
              <div className="cl-grp">
                <div className="cl-grp-title new">New features</div>
                <ul className="cl-items">
                  <li><div className="cl-item-dot new"></div><span><strong>Achievement system</strong> — 40 achievements across search, file mastery, and community. Earn ranks from Beginner to Legend.</span></li>
                  <li><div className="cl-item-dot new"></div><span><strong>User profile page</strong> — view your stats, achievements, and activity in your account.</span></li>
                  <li><div className="cl-item-dot new"></div><span><strong>.EPUB and .ODS support</strong> — search inside ebooks and OpenDocument spreadsheets.</span></li>
                </ul>
              </div>
              <div className="cl-grp">
                <div className="cl-grp-title fix">Bug fixes</div>
                <ul className="cl-items">
                  <li><div className="cl-item-dot fix"></div><span>Fixed password-protected DOCX files causing a silent crash instead of a proper error message.</span></li>
                  <li><div className="cl-item-dot fix"></div><span>Fixed search bar losing focus unexpectedly when a new result appeared during live search.</span></li>
                </ul>
              </div>
            </div>

            <div className="cl-sep"></div>

            <div className="cl-entry" id="v092">
              <div className="cl-hdr"><div className="cl-ver">v0.9.2</div><span className="cl-date">March 8, 2026</span></div>
              <div className="cl-grp">
                <div className="cl-grp-title new">New features</div>
                <ul className="cl-items">
                  <li><div className="cl-item-dot new"></div><span><strong>Pro and Team plans</strong> — subscription tiers launched with Stripe Checkout.</span></li>
                  <li><div className="cl-item-dot new"></div><span><strong>File type filter chips</strong> — filter results by type with one click. Combinations saved per session.</span></li>
                </ul>
              </div>
              <div className="cl-grp">
                <div className="cl-grp-title imp">Improvements</div>
                <ul className="cl-items">
                  <li><div className="cl-item-dot imp"></div><span>Regex engine switched to <code style={{ fontSize: '12px', fontFamily: 'var(--mono)', background: 'var(--bg-3)', padding: '1px 5px', borderRadius: '4px', color: 'var(--purple-3)' }}>regex</code> library — 30% faster, supports lookaheads and Unicode categories.</span></li>
                  <li><div className="cl-item-dot imp"></div><span>App installer is now code-signed — no more Windows SmartScreen warning on fresh installs.</span></li>
                </ul>
              </div>
            </div>

            <div className="cl-sep"></div>

            <div className="cl-entry" id="v090">
              <div className="cl-hdr"><div className="cl-ver">v0.9.0</div><span className="tag gold">Major release</span><span className="cl-date">February 14, 2026</span></div>
              <div className="cl-grp">
                <div className="cl-grp-title new">New features</div>
                <ul className="cl-items">
                  <li><div className="cl-item-dot new"></div><span><strong>Regex & Boolean search</strong> — use <code style={{ fontSize: '12px', fontFamily: 'var(--mono)', background: 'var(--bg-3)', padding: '1px 5px', borderRadius: '4px', color: 'var(--purple-3)' }}>/pattern/i</code> for regex or AND/OR/NOT for Boolean. <span className="pro">PRO</span></span></li>
                  <li><div className="cl-item-dot new"></div><span><strong>8 new file formats</strong> — EPUB, ODS, ODT, ODP, Pages, Numbers, Keynote, MSG.</span></li>
                  <li><div className="cl-item-dot new"></div><span><strong>Context snippet length control</strong> — choose 1, 2, or 3 lines of surrounding context in settings.</span></li>
                </ul>
              </div>
              <div className="cl-grp">
                <div className="cl-grp-title imp">Improvements</div>
                <ul className="cl-items">
                  <li><div className="cl-item-dot imp"></div><span><strong>40% faster search engine</strong> — core reader rewritten in Cython with parallel processing. Average time: 140ms → 82ms on 50,000 files.</span></li>
                  <li><div className="cl-item-dot imp"></div><span>Multi-folder search now runs all folders in parallel instead of sequentially.</span></li>
                  <li><div className="cl-item-dot imp"></div><span>PDF page number shown in every result for fast navigation.</span></li>
                </ul>
              </div>
            </div>

            <div className="cl-sep"></div>

            <div className="cl-entry" id="v082">
              <div className="cl-hdr"><div className="cl-ver">v0.8.2</div><span className="cl-date">January 10, 2026</span></div>
              <div className="cl-grp">
                <div className="cl-grp-title new">New features</div>
                <ul className="cl-items">
                  <li><div className="cl-item-dot new"></div><span><strong>Multi-folder search</strong> — add multiple locations, search across all simultaneously.</span></li>
                  <li><div className="cl-item-dot new"></div><span><strong>Community forum</strong> — launched the FileFlow community at file-flow.com/community.</span></li>
                </ul>
              </div>
              <div className="cl-grp">
                <div className="cl-grp-title fix">Bug fixes</div>
                <ul className="cl-items">
                  <li><div className="cl-item-dot fix"></div><span>Fixed XLSX files with merged cells returning incorrect row numbers in results.</span></li>
                  <li><div className="cl-item-dot fix"></div><span>Fixed app hanging on startup when a previously-added folder had been deleted.</span></li>
                </ul>
              </div>
            </div>

            <div className="cl-sep"></div>

            <div className="cl-entry" id="v080">
              <div className="cl-hdr"><div className="cl-ver">v0.8.0</div><span className="tag gold">Major release</span><span className="cl-date">November 30, 2025</span></div>
              <div className="cl-grp">
                <div className="cl-grp-title new">New features</div>
                <ul className="cl-items">
                  <li><div className="cl-item-dot new"></div><span><strong>Full-text keyword search</strong> — the core feature. Search inside PDF, DOCX, and XLSX in real time.</span></li>
                  <li><div className="cl-item-dot new"></div><span><strong>Context snippets</strong> — surrounding text with matched keywords highlighted gold.</span></li>
                  <li><div className="cl-item-dot new"></div><span><strong>TXT, CSV, Markdown support</strong> — plain text formats added.</span></li>
                  <li><div className="cl-item-dot new"></div><span><strong>User accounts</strong> — create an account, sync settings, track search history (opt-in).</span></li>
                </ul>
              </div>
            </div>

            <div className="cl-sep"></div>

            <div className="cl-entry" id="v07x">
              <div className="cl-hdr"><div className="cl-ver">v0.7.x</div><span className="cl-date">Aug–Oct 2025</span><span className="tag">Early beta</span></div>
              <ul className="cl-items" style={{ color: 'var(--text-3)' }}>
                <li><div className="cl-item-dot" style={{ background: 'var(--text-4)', marginTop: '6px' }}></div><span>Private beta with 50 users. PDF-only search.</span></li>
                <li><div className="cl-item-dot" style={{ background: 'var(--text-4)', marginTop: '6px' }}></div><span>v0.7.1 — Added DOCX support. Fixed crash on large PDFs.</span></li>
                <li><div className="cl-item-dot" style={{ background: 'var(--text-4)', marginTop: '6px' }}></div><span>v0.7.2 — Added XLSX support. Reduced installer from 48 MB to 12 MB.</span></li>
                <li><div className="cl-item-dot" style={{ background: 'var(--text-4)', marginTop: '6px' }}></div><span>v0.7.5 — 1,000 users reached. Major UI redesign based on community feedback.</span></li>
              </ul>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
