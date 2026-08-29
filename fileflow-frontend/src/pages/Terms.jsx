import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
          <h1 className="section-title">Terms of Service</h1>
          <p className="section-desc">Please read these terms carefully before using FileFlow.</p>
        </div>
      </section>

      <div className="container">
        <div className="legal-layout">
          <div className="legal-toc">
            <div className="toc-label">Contents</div>
            <button className="toc-item" onClick={() => scrollTo('acceptance')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>1. Acceptance of Terms</button>
            <button className="toc-item" onClick={() => scrollTo('license')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>2. License</button>
            <button className="toc-item" onClick={() => scrollTo('privacy')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>3. Privacy & Data</button>
            <button className="toc-item" onClick={() => scrollTo('payments')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>4. Payments</button>
            <button className="toc-item" onClick={() => scrollTo('prohibited')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>5. Prohibited Use</button>
            <button className="toc-item" onClick={() => scrollTo('disclaimer')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>6. Disclaimer</button>
            <button className="toc-item" onClick={() => scrollTo('liability')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>7. Liability</button>
            <button className="toc-item" onClick={() => scrollTo('changes')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>8. Changes</button>
            <button className="toc-item" onClick={() => scrollTo('contact')} style={{ background: 'none', border: 'none', borderLeft: '2px solid var(--border)', textAlign: 'left', width: '100%', cursor: 'pointer' }}>9. Contact</button>
          </div>

          <div className="legal-body">
            <div className="legal-updated">Last updated: April 1, 2026 · v1.2</div>

            <div className="legal-section" id="acceptance">
              <h2>1. Acceptance of Terms</h2>
              <p>By downloading, installing, or using FileFlow ("the Software"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Software.</p>
              <p>These Terms apply to all versions of FileFlow, including the free tier, Pro, and Team plans, as well as any beta or preview releases.</p>
            </div>

            <div className="legal-section" id="license">
              <h2>2. License</h2>
              <p>FileFlow grants you a <strong>personal, non-transferable, non-exclusive license</strong> to install and use the Software on Windows devices you own or control, subject to these Terms.</p>
              <ul>
                <li>Free plan: 1 device per account</li>
                <li>Pro plan: Up to 3 devices per account</li>
                <li>Team plan: One license per seat as purchased</li>
              </ul>
              <p>You may not redistribute, sell, sublicense, reverse engineer, or modify the Software.</p>
            </div>

            <div className="legal-section" id="privacy">
              <h2>3. Privacy & Data</h2>
              <div className="legal-highlight"><p>📁 <strong>FileFlow does not upload your files.</strong> All search processing happens locally on your device. No file content, filenames, or metadata is transmitted to our servers.</p></div>
              <p>We collect only:</p>
              <ul>
                <li>Account information (email, name) provided at registration</li>
                <li>Usage statistics (number of searches, features used) — only if you opt in</li>
                <li>Crash reports — only if you opt in</li>
                <li>Payment information — processed by Stripe; we never see your full card number</li>
              </ul>
              <p>See our <Link to="/privacy" style={{ color: 'var(--gold)' }}>Privacy Policy</Link> for full details.</p>
            </div>

            <div className="legal-section" id="payments">
              <h2>4. Payments & Subscriptions</h2>
              <p>Paid plans are billed monthly or annually via Stripe. By subscribing, you authorize FileFlow to charge your payment method on a recurring basis.</p>
              <ul>
                <li><strong>Free trial:</strong> 14 days for Pro. No charge until trial ends.</li>
                <li><strong>Cancellation:</strong> You may cancel anytime from your billing dashboard. Access continues until the end of the billing period.</li>
                <li><strong>Refunds:</strong> We offer a 7-day refund window from the date of first charge. Contact support@file-flow.com.</li>
                <li><strong>Price changes:</strong> We will give 30 days notice before changing subscription prices.</li>
              </ul>
            </div>

            <div className="legal-section" id="prohibited">
              <h2>5. Prohibited Use</h2>
              <p>You may not use FileFlow to:</p>
              <ul>
                <li>Process or access files you do not have legal rights to</li>
                <li>Reverse engineer, decompile, or disassemble the Software</li>
                <li>Use the Software for any illegal purpose</li>
                <li>Share your license credentials with others (except as permitted by Team plan)</li>
                <li>Attempt to bypass license verification or access Pro features without payment</li>
              </ul>
            </div>

            <div className="legal-section" id="disclaimer">
              <h2>6. Disclaimer of Warranties</h2>
              <p>FileFlow is provided <strong>"as is"</strong> without warranty of any kind. We do not guarantee that the Software will be error-free, uninterrupted, or meet your specific requirements.</p>
              <p>We are not responsible for any data loss arising from use of the Software. We strongly recommend maintaining regular backups of important files.</p>
            </div>

            <div className="legal-section" id="liability">
              <h2>7. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, FileFlow and its team shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Software, even if advised of the possibility of such damages.</p>
              <p>Our total liability to you shall not exceed the amount you paid for FileFlow in the 12 months preceding the claim.</p>
            </div>

            <div className="legal-section" id="changes">
              <h2>8. Changes to These Terms</h2>
              <p>We may update these Terms from time to time. We will notify you of material changes via email and an in-app notice at least 14 days before they take effect. Continued use after changes take effect constitutes acceptance.</p>
            </div>

            <div className="legal-section" id="contact">
              <h2>9. Contact</h2>
              <p>For questions about these Terms, contact us at <strong style={{ color: 'var(--gold)' }}>legal@file-flow.com</strong> or visit our <Link to="/contact" style={{ color: 'var(--gold)' }}>contact page</Link>.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
