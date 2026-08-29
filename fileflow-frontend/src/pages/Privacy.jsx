import React from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="legal-hero section">
        <div className="container">
          <div className="section-label">Legal</div>
          <h1 className="section-title">Privacy Policy</h1>
          <p className="section-desc">We take your privacy seriously. FileFlow is designed from the ground up to keep your files on your machine — not ours.</p>
        </div>
      </section>

      <div className="container">
        <div className="legal-layout">
          <div className="legal-toc">
            <div className="toc-label">Contents</div>
            <button className="toc-item" onClick={() => scrollTo('summary')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>TL;DR</button>
            <button className="toc-item" onClick={() => scrollTo('who')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>1. Who We Are</button>
            <button className="toc-item" onClick={() => scrollTo('collect')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>2. What We Collect</button>
            <button className="toc-item" onClick={() => scrollTo('dont')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>3. What We Don't Collect</button>
            <button className="toc-item" onClick={() => scrollTo('use')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>4. How We Use Data</button>
            <button className="toc-item" onClick={() => scrollTo('third')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>5. Third Parties</button>
            <button className="toc-item" onClick={() => scrollTo('storage')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>6. Storage & Security</button>
            <button className="toc-item" onClick={() => scrollTo('rights')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>7. Your Rights</button>
            <button className="toc-item" onClick={() => scrollTo('children')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>8. Children</button>
            <button className="toc-item" onClick={() => scrollTo('changes')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>9. Changes</button>
            <button className="toc-item" onClick={() => scrollTo('contact')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>10. Contact</button>
          </div>

          <div className="legal-body">
            <div className="legal-updated">Last updated: April 1, 2026 · v1.1</div>

            <div className="legal-section" id="summary">
              <h2>TL;DR — The short version</h2>
              <div className="hbox green"><p>✅ <strong>Your files never leave your computer.</strong> FileFlow runs search entirely on your Windows PC. We have zero access to your documents, filenames, or search queries.</p></div>
              <div className="hbox gold"><p>📧 <strong>We only store your email, name, and plan status</strong> — the minimum needed to operate your account.</p></div>
              <div className="hbox purple"><p>🚫 <strong>No advertising. No tracking. No data selling. Ever.</strong> FileFlow is a subscription product. Your data is not the product.</p></div>
            </div>

            <div className="legal-section" id="who">
              <h2>1. Who We Are</h2>
              <p>FileFlow is a Windows desktop application available at <strong>file-flow.com</strong>. We are a small independent software team. For privacy matters, contact us at <a href="mailto:privacy@file-flow.com">privacy@file-flow.com</a>.</p>
            </div>

            <div className="legal-section" id="collect">
              <h2>2. What We Collect</h2>
              <p>We collect only what is strictly necessary to run your account:</p>
              <table className="dtable">
                <thead><tr><th>Data</th><th>Purpose</th><th>Where stored</th></tr></thead>
                <tbody>
                  <tr><td><strong>Email address</strong></td><td>Account login, support replies</td><td>Our servers (encrypted)</td></tr>
                  <tr><td><strong>Name</strong></td><td>Profile personalisation</td><td>Our servers</td></tr>
                  <tr><td><strong>Password hash</strong></td><td>Authentication — never stored in plaintext</td><td>Our servers (bcrypt)</td></tr>
                  <tr><td><strong>Plan & billing status</strong></td><td>Feature access control</td><td>Our servers + Stripe</td></tr>
                  <tr><td><strong>Payment details</strong></td><td>Subscription billing</td><td>Stripe only — we never see your card</td></tr>
                  <tr><td><strong>Usage stats</strong> (opt-in)</td><td>Product improvement</td><td>Our servers — anonymised</td></tr>
                  <tr><td><strong>Crash reports</strong> (opt-in)</td><td>Bug diagnosis — no file content included</td><td>Our servers</td></tr>
                  <tr><td><strong>Forum posts</strong></td><td>Running the community</td><td>Our servers — publicly visible</td></tr>
                </tbody>
              </table>
              <p>Usage stats and crash reports are <strong>opt-in</strong> and can be disabled anytime in Settings → Privacy inside the FileFlow app.</p>
            </div>

            <div className="legal-section" id="dont">
              <h2>3. What We Don't Collect</h2>
              <div className="hbox green"><p>🚫 We do <strong>not</strong> collect, store, or have access to: your files, their contents, their filenames, their file paths, your search queries, or any text found in your documents. This data never leaves your machine.</p></div>
              <p>FileFlow's search engine runs entirely on your PC. No query is sent to our servers. No file content is uploaded. No document metadata is transmitted. We also do not use cookies for tracking, run behavioural advertising, or share any personal data with advertisers.</p>
            </div>

            <div className="legal-section" id="use">
              <h2>4. How We Use Your Data</h2>
              <p>Your data is used exclusively for:</p>
              <ul>
                <li>Creating and managing your FileFlow account</li>
                <li>Processing subscription payments via Stripe</li>
                <li>Sending transactional emails (receipts, password resets, update notifications)</li>
                <li>Providing customer support</li>
                <li>Running the community forum</li>
                <li>Aggregated, anonymous product analytics to improve FileFlow (opt-in only)</li>
              </ul>
              <p>We will <strong>never</strong> sell your personal data, use it for advertising, or share it with third parties except as described in section 5.</p>
            </div>

            <div className="legal-section" id="third">
              <h2>5. Third-Party Services</h2>
              <table className="dtable">
                <thead><tr><th>Service</th><th>Purpose</th><th>Data shared</th></tr></thead>
                <tbody>
                  <tr><td><strong>Stripe</strong></td><td>Payment processing</td><td>Email, billing address — card details go to Stripe only</td></tr>
                  <tr><td><strong>Supabase</strong></td><td>Database & authentication</td><td>Account data (email, name, plan)</td></tr>
                  <tr><td><strong>Resend</strong></td><td>Transactional email</td><td>Email address only</td></tr>
                  <tr><td><strong>Cloudflare</strong></td><td>CDN & DDoS protection</td><td>IP address (standard web traffic)</td></tr>
                </tbody>
              </table>
              <p>All providers are GDPR-compliant. We choose services with strong data protection track records.</p>
            </div>

            <div className="legal-section" id="storage">
              <h2>6. Data Storage & Security</h2>
              <p>Account data is stored on servers in the EU (Frankfurt, Germany) via Supabase. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Passwords are hashed with bcrypt and never stored in plaintext.</p>
              <p>We retain your account data as long as your account is active. On account deletion, personal data is removed within 30 days — except financial records legally required to be kept (typically 7 years).</p>
            </div>

            <div className="legal-section" id="rights">
              <h2>7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access</strong> — request a copy of your personal data</li>
                <li><strong>Rectify</strong> — correct inaccurate data (most fields editable in your profile)</li>
                <li><strong>Erase</strong> — delete your account and all personal data</li>
                <li><strong>Portability</strong> — receive your data in a machine-readable format</li>
                <li><strong>Opt out</strong> — disable analytics &amp; crash reporting in Settings → Privacy</li>
              </ul>
              <p>Email <a href="mailto:privacy@file-flow.com">privacy@file-flow.com</a> or use Account Deletion in your dashboard. We respond within 30 days. EU/EEA users may also lodge a complaint with their local data protection authority.</p>
            </div>

            <div className="legal-section" id="children">
              <h2>8. Children's Privacy</h2>
              <p>FileFlow is not directed at children under 13. We do not knowingly collect personal data from children. If you believe a child has created an account, contact us and we will delete it promptly.</p>
            </div>

            <div className="legal-section" id="changes">
              <h2>9. Changes to This Policy</h2>
              <p>We may update this policy from time to time. Material changes will be communicated via email and an in-app notice at least 14 days before they take effect.</p>
            </div>

            <div className="legal-section" id="contact">
              <h2>10. Contact</h2>
              <p>Privacy questions or requests:</p>
              <ul>
                <li>Email: <a href="mailto:privacy@file-flow.com">privacy@file-flow.com</a></li>
                <li>General: <Link to="/contact">contact page</Link></li>
                <li>Response time: within 5 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
