import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, LayoutGrid, FileText, Monitor, FileSpreadsheet, 
  Search, Filter, Terminal, Zap, Shield, File
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Home() {
  const [email, setEmail] = useState('');

  const handleBetaSubmit = () => {
    if (email && email.includes('@')) {
      toast.success("You're on the list!");
      setEmail('');
    } else {
      toast.error("Please enter a valid email");
    }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="geo-tri hero-geo-1"></div>
        <div className="geo-tri hero-geo-2"></div>
        <div className="geo-tri hero-geo-3"></div>
        <div className="hero-dot" style={{top: '30%', left: '20%'}}></div>
        <div className="hero-dot" style={{top: '70%', right: '25%', background: 'var(--gold)', opacity: 0.2}}></div>
        <div className="hero-dot" style={{top: '15%', right: '30%'}}></div>

        <div className="hero-badge">
          <div className="badge"><span className="badge-dot"></span>Now in public beta — Windows 10 & 11</div>
        </div>

        <h1 className="hero-title">
          Stop opening files.<br />
          Start finding <span className="gold-text">answers</span>.
        </h1>

        <p className="hero-sub">FileFlow searches inside every document on your PC — PDFs, Word files, spreadsheets and more — in milliseconds. No cloud. No indexing wait. Just results.</p>

        <div className="hero-actions">
          <Link to="/beta" className="btn-primary btn-lg">
            <Download size={18} strokeWidth={2} />
            Join the Beta — Free
          </Link>
          <Link to="/pricing" className="btn-ghost btn-lg">View Pricing</Link>
        </div>
        <p className="hero-note">Free 14-day trial &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Windows 10 / 11</p>

        <div className="hero-mockup">
          <div className="mockup-frame">
            <div className="mockup-bar">
              <span className="m-dot r"></span><span className="m-dot y"></span><span className="m-dot g"></span>
              <span className="m-title">FileFlow — Keyword Search</span>
            </div>
            <div className="mockup-body">
              <div className="m-sidebar">
                <div className="m-sidebar-label">Locations</div>
                <div className="m-item active"><LayoutGrid size={16} /> All files</div>
                <div className="m-item"><FileText size={16} /> Documents</div>
                <div className="m-item"><Monitor size={16} /> Desktop</div>
                <div className="m-item"><Download size={16} /> Downloads</div>
                <div className="m-sidebar-label" style={{marginTop: '1.5rem'}}>File types</div>
                <div className="m-item"><File size={16} /> Word / PDF</div>
                <div className="m-item"><FileSpreadsheet size={16} /> Spreadsheets</div>
              </div>
              <div className="m-main">
                <div className="search-bar">
                  <Search size={16} color="var(--gold)" />
                  <span className="search-q">quarterly revenue forecast<span className="search-cursor"></span></span>
                  <span className="search-shortcut">Ctrl+F</span>
                </div>
                <div className="result-count">4 results found in 0.08s</div>
                
                <div className="r-item hl">
                  <div className="r-icon docx">DOCX</div>
                  <div className="r-info">
                    <div className="r-name">Q4_Financial_Report_2024.docx</div>
                    <div className="r-snip">...the <mark>quarterly revenue forecast</mark> for EMEA exceeded projections by 12%...</div>
                    <div className="r-path">~/Documents/Finance/Reports/</div>
                  </div>
                  <div className="r-meta">2d ago<br />p. 14</div>
                </div>

                <div className="r-item">
                  <div className="r-icon xlsx">XLSX</div>
                  <div className="r-info">
                    <div className="r-name">Revenue_Tracker_v3.xlsx</div>
                    <div className="r-snip">Sheet: Forecasting — <mark>quarterly revenue</mark> targets vs actuals by region...</div>
                    <div className="r-path">~/Dropbox/Finance/</div>
                  </div>
                  <div className="r-meta">1w ago<br />row 47</div>
                </div>

                <div className="r-item">
                  <div className="r-icon pdf">PDF</div>
                  <div className="r-info">
                    <div className="r-name">Board_Presentation_Nov.pdf</div>
                    <div className="r-snip">Slide 8: <mark>Revenue forecast</mark> — <mark>quarterly</mark> growth rate of 8.3% through H1...</div>
                    <div className="r-path">~/Documents/Board/</div>
                  </div>
                  <div className="r-meta">3w ago<br />slide 8</div>
                </div>
              </div>
            </div>
            <div className="mockup-glow"></div>
          </div>
        </div>
      </section>

      <div className="stats anim-fade-up">
        <div className="stat"><div className="stat-n gold-text">50ms</div><div className="stat-l">avg. search time</div></div>
        <div className="stat"><div className="stat-n gold-text">30+</div><div className="stat-l">file formats</div></div>
        <div className="stat"><div className="stat-n gold-text">0</div><div className="stat-l">cloud uploads</div></div>
        <div className="stat"><div className="stat-n gold-text">100%</div><div className="stat-l">offline & private</div></div>
      </div>

      <section className="features section">
        <div className="container">
          <div className="features-hdr anim-fade-up">
            <div>
              <div className="section-label">Features</div>
              <h2 className="section-title">Built for people who<br />live inside their files.</h2>
            </div>
            <p className="section-desc">Every feature is designed around one goal — getting you to the right piece of text, in the right file, with zero friction.</p>
          </div>
          <div className="feat-grid anim-fade-up">
            <div className="feat-card wide">
              <div className="feat-icon gold"><Search size={20} /></div>
              <div className="feat-title">Full-text search across every file</div>
              <div className="feat-desc">Type any keyword and FileFlow scans the actual content of every document — not just filenames. Reads inside PDFs, Word docs, Excel sheets, PowerPoints, and plain text files simultaneously.</div>
              <div style={{marginTop: '1rem'}}><span className="tag gold">core feature</span></div>
            </div>
            <div className="feat-card">
              <div className="feat-icon"><FileText size={20} /></div>
              <div className="feat-title">Context snippets</div>
              <div className="feat-desc">Every result shows surrounding text so you know which file is relevant before opening it.</div>
            </div>
            <div className="feat-card">
              <div className="feat-icon" style={{background: 'var(--gold-dim)', borderColor: 'rgba(245,166,35,0.2)', color: 'var(--gold)'}}>
                <Filter size={20} />
              </div>
              <div className="feat-title">Filter by file type</div>
              <div className="feat-desc">Narrow results to PDFs, spreadsheets, or any combo. Search smarter.</div>
            </div>
            <div className="feat-card">
              <div className="feat-icon"><Terminal size={20} /></div>
              <div className="feat-title">Regex & exact match</div>
              <div className="feat-desc">Power users can run regex patterns or force exact phrase matching for surgical precision.</div>
            </div>
            <div className="feat-card">
              <div className="feat-icon" style={{background: 'var(--green-dim)', borderColor: 'rgba(16,185,129,0.2)', color: 'var(--green)'}}>
                <Zap size={20} />
              </div>
              <div className="feat-title">Instant results — no indexing</div>
              <div className="feat-desc">No pre-indexing required. FileFlow searches on demand — results appear as you type.</div>
              <div style={{marginTop: '1rem'}}><span className="tag green">no setup</span></div>
            </div>
            <div className="feat-card">
              <div className="feat-icon"><Shield size={20} /></div>
              <div className="feat-title">100% private & offline</div>
              <div className="feat-desc">Your files never leave your machine. No cloud, no telemetry, no surprises.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="hiw section">
        <div className="container">
          <div className="hiw-hdr anim-fade-up">
            <div className="section-label" style={{justifyContent: 'center'}}>How it works</div>
            <h2 className="section-title" style={{textAlign: 'center'}}>Three steps to finding anything.</h2>
          </div>
          <div className="hiw-steps anim-fade-up">
            <div className="hiw-step">
              <div className="hiw-num">01</div>
              <div className="hiw-title">Install & open</div>
              <div className="hiw-desc">Download the 12 MB installer, run it, and FileFlow is ready. No account needed to start. Works on Windows 10 and 11.</div>
            </div>
            <div className="hiw-step">
              <div className="hiw-num">02</div>
              <div className="hiw-title">Pick your folders</div>
              <div className="hiw-desc">Point FileFlow at any folder — Documents, Desktop, a network drive. Add multiple locations and search across all at once.</div>
            </div>
            <div className="hiw-step">
              <div className="hiw-num">03</div>
              <div className="hiw-title">Type to search</div>
              <div className="hiw-desc">Start typing any keyword. Results appear in real time with surrounding context. Click a result to open the exact file and page.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="ftypes section">
        <div className="container">
          <div className="ftypes-inner">
            <div className="anim-fade-up">
              <div className="section-label">File formats</div>
              <h2 className="section-title">Reads inside<br />30+ file types.</h2>
              <p className="section-desc">From legacy .doc files to modern .xlsx spreadsheets, FileFlow handles every document format your team uses every day.</p>
              <div style={{marginTop: '2rem'}}><Link to="/beta" className="btn-primary">Get started free</Link></div>
            </div>
            <div className="ftype-grid anim-fade-up">
              <div className="ftype-pill"><span className="ftype-ext">.pdf</span>PDF</div>
              <div className="ftype-pill"><span className="ftype-ext">.docx</span>Word</div>
              <div className="ftype-pill"><span className="ftype-ext">.xlsx</span>Excel</div>
              <div className="ftype-pill"><span className="ftype-ext">.pptx</span>PowerPoint</div>
              <div className="ftype-pill"><span className="ftype-ext">.txt</span>Text</div>
              <div className="ftype-pill"><span className="ftype-ext">.csv</span>CSV</div>
              <div className="ftype-pill"><span className="ftype-ext">.md</span>Markdown</div>
              <div className="ftype-pill"><span className="ftype-ext">.odt</span>OpenDoc</div>
              <div className="ftype-pill"><span className="ftype-ext">.doc</span>Word 97</div>
              <div className="ftype-pill"><span className="ftype-ext">.xls</span>Excel 97</div>
              <div className="ftype-pill"><span className="ftype-ext">.ppt</span>PPT 97</div>
              <div className="ftype-pill"><span className="ftype-ext">.rtf</span>RTF</div>
              <div className="ftype-pill"><span className="ftype-ext">.epub</span>EPUB</div>
              <div className="ftype-pill"><span className="ftype-ext">.html</span>HTML</div>
              <div className="ftype-pill"><span className="ftype-ext">.xml</span>XML</div>
              <div className="ftype-pill"><span className="ftype-ext">.json</span>JSON</div>
            </div>
          </div>
        </div>
      </section>

      <section className="testi section">
        <div className="container">
          <div className="testi-hdr anim-fade-up">
            <div className="section-label" style={{justifyContent: 'center'}}>What users say</div>
            <h2 className="section-title" style={{textAlign: 'center'}}>Built for knowledge workers.</h2>
          </div>
          <div className="testi-grid">
            <div className="t-card anim-fade-up">
              <p className="t-quote"><span className="t-quote-mark">"</span>I have thousands of PDFs from years of research. FileFlow found the quote I was looking for in under a second.</p>
              <div className="t-author">
                <div className="t-avatar" style={{background: 'var(--purple-dim)', color: 'var(--purple-3)'}}>SR</div>
                <div><div style={{fontSize: '14px', fontWeight: 500}}>Sarah R.</div><div style={{fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--mono)'}}>Research Analyst</div></div>
              </div>
            </div>
            <div className="t-card anim-fade-up" style={{transitionDelay: '0.1s'}}>
              <p className="t-quote"><span className="t-quote-mark">"</span>Being able to search contract language across 200+ agreements without opening a single file saves us hours every week.</p>
              <div className="t-author">
                <div className="t-avatar" style={{background: 'var(--gold-dim)', color: 'var(--gold)'}}>MK</div>
                <div><div style={{fontSize: '14px', fontWeight: 500}}>Marcus K.</div><div style={{fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--mono)'}}>Legal Operations Lead</div></div>
              </div>
            </div>
            <div className="t-card anim-fade-up" style={{transitionDelay: '0.2s'}}>
              <p className="t-quote"><span className="t-quote-mark">"</span>The fact that nothing is sent to any server is the deal-maker for us. Our financial data stays on our machines, period.</p>
              <div className="t-author">
                <div className="t-avatar" style={{background: 'var(--green-dim)', color: 'var(--green)'}}>JL</div>
                <div><div style={{fontSize: '14px', fontWeight: 500}}>Joelle L.</div><div style={{fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--mono)'}}>CFO, Fintech Startup</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-sec section">
        <div className="cta-orb"></div>
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="anim-fade-up">
            <div className="section-label" style={{justifyContent: 'center'}}>Get early access</div>
            <h2 className="cta-title">Stop hunting through files.<br /><span className="gold-text">Start your free trial.</span></h2>
            <p className="cta-sub">14 days free. No credit card. Works offline from day one.</p>
            <div className="cta-form">
              <input 
                type="email" 
                className="cta-input" 
                placeholder="Enter your work email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBetaSubmit()}
              />
              <button className="cta-btn" onClick={handleBetaSubmit}>Get early access</button>
            </div>
            <p className="cta-meta">Windows 10 / 11 &nbsp;·&nbsp; 12 MB download &nbsp;·&nbsp; No cloud, ever</p>
          </div>
        </div>
      </section>
    </>
  );
}
