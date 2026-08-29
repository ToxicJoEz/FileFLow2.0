import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function About() {
  return (
    <>
      <section className="about-hero section">
        <div className="hero-orb-a"></div>
        <div className="geo-a" style={{ borderWidth: '0 20px 35px 20px', borderColor: 'transparent transparent var(--gold) transparent', opacity: 0.1, top: '28%', left: '9%', animation: 'float 6s ease-in-out infinite' }}></div>
        <div className="geo-a" style={{ borderWidth: '0 14px 24px 14px', borderColor: 'transparent transparent var(--purple-2) transparent', opacity: 0.15, top: '32%', right: '7%', animation: 'float 8s ease-in-out infinite 1s' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge" style={{ margin: '0 auto 2rem', width: 'fit-content' }}>
            <span className="badge-dot"></span>We're a small team with a big mission
          </div>
          <h1 className="section-title" style={{ fontSize: 'clamp(44px,7vw,80px)', textAlign: 'center', maxWidth: '820px', margin: '0 auto 1.25rem' }}>
            Built for people who live<br />inside their <span className="gold-text">files.</span>
          </h1>
          <p className="section-desc" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '540px', fontSize: '18px' }}>
            We're on a mission to make working with files smarter, faster, and simpler. FileFlow is built for everyday people who just want their tools to work — effortlessly.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="mission section">
        <div className="container">
          <div className="mission-inner">
            <div className="mission-visual anim-fade-up">
              <div className="m-card">
                <div className="m-card-inner">
                  <div className="s-demo-bar">
                    <Search size={14} color="var(--gold)" strokeWidth={1.3} />
                    <span className="s-demo-q">termination clause 30 days notice<span className="s-cursor"></span></span>
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-4)', marginBottom: '10px' }}>
                    8 results in 0.06s
                  </div>
                  <div className="s-result">
                    <div className="sr-icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>PDF</div>
                    <div className="sr-text">
                      ...the <mark>termination clause</mark> requires <mark>30 days notice</mark> in writing, sent via certified mail...
                    </div>
                  </div>
                  <div className="s-result">
                    <div className="sr-icon" style={{ background: 'var(--purple-dim)', color: 'var(--purple-3)' }}>DOC</div>
                    <div className="sr-text">
                      §12.3 — Either party may invoke the <mark>termination clause</mark> with no less than <mark>30 days'</mark> written <mark>notice</mark>...
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="tag green">50ms avg</span>
                  <span className="tag">0 files uploaded</span>
                  <span className="tag gold">30+ formats</span>
                </div>
              </div>
              <div className="m-quote">
                <div className="mq-t">"I used to open 200 contracts one by one. Now I find what I need in seconds."</div>
                <div className="mq-a">— Legal Ops Lead, FileFlow beta user</div>
              </div>
            </div>
            
            <div className="mission-text anim-fade-up">
              <div className="section-label">Why FileFlow?</div>
              <h2 className="section-title">File management<br />should be <span className="gold-text">effortless.</span></h2>
              <p>FileFlow was created with one goal in mind: to make finding information inside your files instant, private, and painless. We're a small team passionate about simplifying the way people work with documents.</p>
              <p>Our Keyword Search tool is the first of many features we're building. Instead of opening every file to find what you need, simply type your keywords and FileFlow will almost instantly locate the exact lines containing them — across every document in your folders.</p>
              <p>Everything runs locally on your Windows PC. Your files never leave your machine. No cloud sync. No telemetry. Just a fast, private tool that works.</p>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/beta" className="btn-primary">Join the beta free</Link>
                <Link to="/roadmap" className="btn-ghost">See what's next →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="values section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="anim-fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>What we believe</div>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Our principles.</h2>
          </div>
          <div className="values-grid">
            <div className="val-card anim-fade-up">
              <div className="val-n gold-text">01</div>
              <div className="val-title">Privacy by default</div>
              <div className="val-desc">Your files are yours. We will never build features that require uploading your documents to any server. FileFlow will always work 100% offline — that's non-negotiable.</div>
            </div>
            <div className="val-card anim-fade-up" style={{ transitionDelay: '0.1s' }}>
              <div className="val-n" style={{ color: 'var(--purple-3)' }}>02</div>
              <div className="val-title">Speed as a feature</div>
              <div className="val-desc">Waiting is a form of disrespect for the user's time. We obsess over search performance. Sub-50ms results on consumer hardware is our target — not a stretch goal.</div>
            </div>
            <div className="val-card anim-fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="val-n" style={{ color: 'var(--green)' }}>03</div>
              <div className="val-title">Ship with honesty</div>
              <div className="val-desc">We publish our roadmap publicly, show real progress bars, admit bugs openly, and price transparently. If something isn't ready, we say so — we never overpromise.</div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="story section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="anim-fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>Our story</div>
            <h2 className="section-title" style={{ textAlign: 'center' }}>How we got here.</h2>
          </div>
          <div className="timeline">
            <div className="tl-item anim-fade-up">
              <div className="tl-dot">💡</div>
              <div className="tl-body">
                <div className="tl-date">Early 2025</div>
                <div className="tl-title">The frustration</div>
                <div className="tl-desc">Our founder spent an afternoon opening 150 PDF contracts one by one searching for a single clause. FileFlow started as a Python script written out of pure frustration that evening.</div>
              </div>
            </div>
            <div className="tl-item anim-fade-up">
              <div className="tl-dot">🛠️</div>
              <div className="tl-body">
                <div className="tl-date">Mid 2025</div>
                <div className="tl-title">Building in public</div>
                <div className="tl-desc">The script became an Electron app. We posted it in a few forums and got 200 downloads in the first week. The feedback was overwhelming — people wanted more formats, more speed, more everything.</div>
              </div>
            </div>
            <div className="tl-item anim-fade-up">
              <div className="tl-dot">🚀</div>
              <div className="tl-body">
                <div className="tl-date">October 2025</div>
                <div className="tl-title">Public beta launch</div>
                <div className="tl-desc">FileFlow v0.8.0 launched to public beta. Within 30 days we had 1,200 active users across 40 countries — all from word of mouth, no advertising spend.</div>
              </div>
            </div>
            <div className="tl-item anim-fade-up">
              <div className="tl-dot">⚡</div>
              <div className="tl-body">
                <div className="tl-date">April 2026</div>
                <div className="tl-title">v0.9 and growing</div>
                <div className="tl-desc">We shipped regex search, a 40% faster engine, and 8 new file formats. Community is now 4,000+ users. We're building towards v1.0 — our first stable, paid release.</div>
              </div>
            </div>
            <div className="tl-item anim-fade-up">
              <div className="tl-dot" style={{ borderColor: 'var(--gold)', background: 'var(--gold-dim)' }}>🌟</div>
              <div className="tl-body">
                <div className="tl-date">Coming — late 2026</div>
                <div className="tl-title">v1.0 — The full vision</div>
                <div className="tl-desc">OCR for scanned documents, PDF editing, semantic AI search, and macOS support. FileFlow becomes the file management platform we always wanted to exist.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="team-section section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="anim-fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>The team</div>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Small team,<br /><span className="gold-text">big ambition.</span></h2>
          </div>
          <div className="team-grid">
            <div className="team-card anim-fade-up">
              <div className="team-av" style={{ background: 'linear-gradient(135deg,var(--purple),var(--gold))' }}>YK</div>
              <div className="team-name">Yousef Karimi</div>
              <div className="team-role">Founder & CEO · Product</div>
              <div className="team-bio">Built the first version of FileFlow overnight out of frustration. Background in Python, search systems, and distributed computing.</div>
              <div className="team-tags">
                <span className="tag">Python</span>
                <span className="tag">Product</span>
                <span className="tag gold">Founder</span>
              </div>
            </div>
            <div className="team-card anim-fade-up" style={{ transitionDelay: '0.1s' }}>
              <div className="team-av" style={{ background: 'linear-gradient(135deg,var(--purple-2),var(--purple))' }}>SR</div>
              <div className="team-name">Sara Raza</div>
              <div className="team-role">Lead Engineer · Search Engine</div>
              <div className="team-bio">Responsible for the core search pipeline. Obsessed with performance. Previously worked on full-text indexing infrastructure at scale.</div>
              <div className="team-tags">
                <span className="tag">Rust</span>
                <span className="tag">Python</span>
                <span className="tag">Search</span>
              </div>
            </div>
            <div className="team-card anim-fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="team-av" style={{ background: 'linear-gradient(135deg,var(--gold),var(--gold-2))' }}>MA</div>
              <div className="team-name">Malik Ahmed</div>
              <div className="team-role">Design & Frontend</div>
              <div className="team-bio">Responsible for every pixel you see in FileFlow. Believes good design is invisible — you only notice bad design. Figma and CSS perfectionist.</div>
              <div className="team-tags">
                <span className="tag">Figma</span>
                <span className="tag">CSS</span>
                <span className="tag">UX</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }} className="anim-fade-up">
            <p style={{ fontSize: '15px', color: 'var(--text-2)', marginBottom: '1.5rem' }}>We're a small team. Every user matters to us personally.</p>
            <Link to="/contact" className="btn-ghost">Talk to us directly →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta section">
        <div className="cta-orb-a"></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="anim-fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>Get started</div>
            <h2 className="section-title" style={{ fontSize: 'clamp(36px,5vw,60px)', textAlign: 'center', maxWidth: '640px', margin: '0 auto 1rem' }}>
              Ready to stop opening<br />files one by one?
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-2)', textAlign: 'center', marginBottom: '2.5rem', fontWeight: 300 }}>
              Join 4,000+ users already searching smarter.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/beta" className="btn-primary btn-lg">Join the beta — free</Link>
              <Link to="/screenshots" className="btn-ghost btn-lg">See it in action →</Link>
            </div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-4)', textAlign: 'center', marginTop: '1.25rem' }}>
              Windows 10 / 11 · 12 MB download · No cloud, ever
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
