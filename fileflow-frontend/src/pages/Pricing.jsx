import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Plus } from 'lucide-react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) setOpenFaq(null);
    else setOpenFaq(index);
  };

  const faqs = [
    { q: "Is there a free trial?", a: "Yes — Pro comes with a 14-day free trial. No credit card required. Cancel anytime before the trial ends and you won't be charged." },
    { q: "Does FileFlow upload my files?", a: "Never. FileFlow runs 100% locally on your Windows PC. No file content ever leaves your machine — not even metadata." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex) via Stripe. All payments are encrypted and secure." },
    { q: "Can I switch plans later?", a: "Yes. You can upgrade or downgrade at any time from your billing dashboard. Upgrades take effect immediately, downgrades at the end of your billing period." },
    { q: "How does team billing work?", a: "Team pricing is per seat, billed monthly or annually. You can add or remove seats at any time and we prorate automatically." },
    { q: "Is there a student or nonprofit discount?", a: "Yes. Contact us with proof of student enrollment or nonprofit status and we'll set up a discounted plan for you." }
  ];

  return (
    <>
      <section className="pricing-hero section">
        <div className="pricing-orb"></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Pricing</div>
          <h1 className="section-title" style={{ textAlign: 'center', fontSize: 'clamp(40px, 5vw, 64px)' }}>Simple, transparent<br /><span className="gold-text">pricing for everyone.</span></h1>
          <p className="section-desc" style={{ textAlign: 'center', margin: '0 auto' }}>Start free. Upgrade when you need more. Cancel anytime.</p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="toggle-wrap">
              <span className={`toggle-label ${!isAnnual ? 'active' : ''}`} onClick={() => setIsAnnual(false)}>Monthly</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={isAnnual} onChange={(e) => setIsAnnual(e.target.checked)} />
                <div className="toggle-track"></div>
                <div className="toggle-thumb"></div>
              </label>
              <span className={`toggle-label ${isAnnual ? 'active' : ''}`} onClick={() => setIsAnnual(true)}>Annual</span>
              <span className="annual-badge">Save 30%</span>
            </div>
          </div>

          <div className="plans-grid anim-fade-up">
            {/* FREE */}
            <div className="plan-card" style={{ textAlign: 'left' }}>
              <div className="plan-name">Free</div>
              <div className="plan-desc">Perfect for individuals just getting started with keyword search.</div>
              <div className="plan-price">
                <div className="plan-amount">$0</div>
                <div className="plan-period">forever free</div>
              </div>
              <ul className="plan-features">
                <li><Check size={16} className="check" />Up to 5,000 files</li>
                <li><Check size={16} className="check" />10 file formats</li>
                <li><Check size={16} className="check" />Basic keyword search</li>
                <li><Check size={16} className="check" />Community forum access</li>
                <li className="no"><X size={16} className="cross" />Regex / exact match</li>
                <li className="no"><X size={16} className="cross" />PDF editing tools</li>
                <li className="no"><X size={16} className="cross" />Priority support</li>
              </ul>
              <Link to="/beta" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Get started free</Link>
            </div>

            {/* PRO */}
            <div className="plan-card featured" style={{ textAlign: 'left' }}>
              <div className="plan-name">Pro</div>
              <div className="plan-desc">For power users who need the full toolkit and unlimited searches.</div>
              <div className="plan-price">
                <div className="plan-amount gold">{isAnnual ? '$6' : '$9'}</div>
                <div className="plan-period">{isAnnual ? 'per month, billed annually' : 'per month'}</div>
                {isAnnual && <div className="plan-annual">Billed as $76/year — save $32</div>}
              </div>
              <ul className="plan-features">
                <li><Check size={16} className="check" />Unlimited files</li>
                <li><Check size={16} className="check" />30+ file formats</li>
                <li><Check size={16} className="check" />Regex & exact match</li>
                <li><Check size={16} className="check" />PDF editing tools</li>
                <li><Check size={16} className="check" />OCR (scanned PDFs)</li>
                <li><Check size={16} className="check" />Achievement system</li>
                <li><Check size={16} className="check" />Priority email support</li>
              </ul>
              <Link to="/payment" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Start Pro — 14 days free</Link>
            </div>

            {/* TEAM */}
            <div className="plan-card" style={{ textAlign: 'left' }}>
              <div className="plan-name">Team</div>
              <div className="plan-desc">For teams who need shared workspaces, admin controls, and volume pricing.</div>
              <div className="plan-price">
                <div className="plan-amount">{isAnnual ? '$20' : '$29'}</div>
                <div className="plan-period">{isAnnual ? 'per seat / month, billed annually' : 'per seat / month'}</div>
                {isAnnual && <div className="plan-annual">Billed annually — save 30%</div>}
              </div>
              <ul className="plan-features">
                <li><Check size={16} className="check" />Everything in Pro</li>
                <li><Check size={16} className="check" />Shared team folders</li>
                <li><Check size={16} className="check" />Admin dashboard</li>
                <li><Check size={16} className="check" />Usage analytics</li>
                <li><Check size={16} className="check" />SSO / SAML</li>
                <li><Check size={16} className="check" />Dedicated support</li>
                <li><Check size={16} className="check" />SLA guarantee</li>
              </ul>
              <Link to="/payment" className="btn-outline" style={{ width: '100%', justifyContent: 'center', color: 'var(--gold)' }}>Contact sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq section">
        <div className="container">
          <div className="faq-title anim-fade-up">
            <div className="section-label" style={{ justifyContent: 'center' }}>FAQ</div>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Common questions.</h2>
          </div>
          <div className="faq-grid anim-fade-up">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item" onClick={() => toggleFaq(idx)}>
                <div className="faq-q">
                  {faq.q}
                  <Plus size={18} color="var(--gold)" style={{ transform: openFaq === idx ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
                {openFaq === idx && <div className="faq-a" style={{ marginTop: '0.75rem' }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
