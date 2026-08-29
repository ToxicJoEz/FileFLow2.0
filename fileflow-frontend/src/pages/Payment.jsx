import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { z } from 'zod';
import { withZodSchema } from 'formik-validator-zod';

const paymentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  cardNumber: z.string().min(19, "Card number is incomplete"),
  cardName: z.string().min(1, "Name on card is required"),
  expiry: z.string().min(7, "Expiry is incomplete"),
  cvc: z.string().min(3, "CVC is incomplete")
});

export default function Payment() {
  const [plan, setPlan] = useState('mo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvc: ''
    },
    validate: withZodSchema(paymentSchema),
    onSubmit: (values) => {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
      }, 2000);
    },
  });

  const handleCardNumber = (e) => {
    let v = e.target.value.replace(/\D/g,'').slice(0,16);
    let formatted = v.replace(/(.{4})/g,'$1  ').trim();
    formik.setFieldValue('cardNumber', formatted);
  };

  const handleExpiry = (e) => {
    let v = e.target.value.replace(/\D/g,'').slice(0,4);
    if (v.length >= 2) v = v.slice(0,2) + ' / ' + v.slice(2);
    formik.setFieldValue('expiry', v);
  };

  return (
    <div className="pay-wrap">
      {/* LEFT: Order summary */}
      <div className="pay-left">
        <div className="pay-orb"></div>
        <div className="pay-geo" style={{ borderWidth: '0 24px 42px 24px', borderColor: 'transparent transparent var(--gold) transparent', opacity: 0.1, top: '12%', right: '8%' }}></div>
        <div className="pay-geo" style={{ borderWidth: '0 16px 28px 16px', borderColor: 'transparent transparent var(--purple-2) transparent', opacity: 0.14, bottom: '22%', left: '6%', animation: 'float 7s ease-in-out infinite' }}></div>

        <div className="pay-logo">
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <div className="nav-logo-icon">
              <svg viewBox="0 0 18 18" fill="none"><path d="M3 2h8l4 4v10H3V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M11 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </div>
            File<span>Flow</span>
          </Link>
        </div>

        <div className="pay-summary">
          <div className="trial-pill">🎉 &nbsp;14-day free trial — no charge today</div>
          <div className="pay-plan-box">
            <div className="pbox-label">You're subscribing to</div>
            <div className="pbox-name">FileFlow Pro</div>
            <div className="pbox-desc">Full-text search across unlimited files. Regex, OCR, PDF editing, and priority support — all running locally on your PC.</div>
            <div className="pbox-price">
              <div className="pbox-amount">{plan === 'mo' ? '$9' : '$6'}</div>
              <div className="pbox-period">/ month</div>
            </div>
            <div className="pbox-feats">
              <div className="pbox-feat"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Unlimited files & folders</div>
              <div className="pbox-feat"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>30+ file formats (PDF, DOCX, XLSX…)</div>
              <div className="pbox-feat"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Regex & Boolean search</div>
              <div className="pbox-feat"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>OCR for scanned PDFs</div>
              <div className="pbox-feat"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>100% offline — files never leave your PC</div>
            </div>
            <div className="pbox-divider"></div>
            <div className="pbox-line"><span>14-day free trial</span><span style={{ color: 'var(--green)' }}>$0.00</span></div>
            <div className="pbox-line">
              <span>{plan === 'mo' ? 'Then billed monthly' : 'Then billed annually'}</span>
              <span style={{ color: plan === 'mo' ? 'var(--text)' : 'var(--green)' }}>{plan === 'mo' ? '$9 / month' : '$76 / year'}</span>
            </div>
            <div className="pbox-line total"><span>Due today</span><span>$0.00</span></div>
          </div>
        </div>

        <div className="pay-trust">
          <div className="trust-item"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="5.5" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M4 5.5V4a2.5 2.5 0 015 0v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>Stripe-secured checkout</div>
          <div className="trust-item"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1C4 1 2 3 2 5.5c0 3.5 4.5 6.5 4.5 6.5s4.5-3 4.5-6.5C11 3 9 1 6.5 1z" stroke="currentColor" strokeWidth="1.1"/><path d="M4.5 5.5l1.5 1.5 2.5-2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>Cancel anytime</div>
          <div class="trust-item"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.1"/><path d="M6.5 3.5v3l2 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>7-day refund policy</div>
        </div>
      </div>

      {/* RIGHT: Checkout form */}
      <div className="pay-right">
        {!isSuccess ? (
          <form onSubmit={formik.handleSubmit}>
            <div className="pay-form-title">Complete your order</div>
            <div className="pay-form-sub">Start your free trial now. Your card won't be charged for 14 days.</div>

            {/* Plan toggle */}
            <div className="plan-toggle">
              <div className={`ptoggle-opt ${plan === 'mo' ? 'on' : ''}`} onClick={() => setPlan('mo')}>
                <div className="ptoggle-name">Monthly</div>
                <div className="ptoggle-price">$9 / month</div>
              </div>
              <div className={`ptoggle-opt ${plan === 'yr' ? 'on' : ''}`} onClick={() => setPlan('yr')}>
                <div className="ptoggle-name">Annual &nbsp;<span style={{ fontSize: '10px', background: 'var(--green-dim)', color: 'var(--green)', padding: '1px 7px', borderRadius: '100px' }}>Save 30%</span></div>
                <div className="ptoggle-price">$6 / month · $76 billed yearly</div>
              </div>
            </div>

            {/* Account */}
            <div className="fsec-title">Account details</div>
            <div className="frow2" style={{ marginBottom: '1rem' }}>
              <div className="fgroup">
                <label>First name</label>
                <input type="text" name="firstName" className="input" placeholder="Ahmed" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.firstName && formik.errors.firstName && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.firstName}</div>}
              </div>
              <div className="fgroup">
                <label>Last name</label>
                <input type="text" name="lastName" className="input" placeholder="Al-Rashidi" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.lastName && formik.errors.lastName && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.lastName}</div>}
              </div>
            </div>
            <div className="fgroup">
              <label>Email address</label>
              <input type="email" name="email" className="input" placeholder="you@company.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.email && formik.errors.email && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.email}</div>}
            </div>
            <div className="fgroup">
              <label>Password</label>
              <input type="password" name="password" className="input" placeholder="Create a password (min. 8 chars)" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.password && formik.errors.password && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.password}</div>}
            </div>

            {/* Payment */}
            <div className="fsec-title">Payment details</div>
            <div className="fgroup">
              <label>Card number</label>
              <div className={`card-wrap ${formik.touched.cardNumber && formik.errors.cardNumber ? 'error-border' : ''}`} style={formik.touched.cardNumber && formik.errors.cardNumber ? { borderColor: 'rgba(239,68,68,0.5)' } : {}}>
                <input type="text" name="cardNumber" placeholder="1234  5678  9012  3456" maxLength={19} value={formik.values.cardNumber} onChange={handleCardNumber} onBlur={formik.handleBlur} />
                <div className="card-chips">
                  <div className="chip" style={{ background: '#1a1f71', color: '#fff' }}>VISA</div>
                  <div className="chip" style={{ background: '#EB001B', color: '#fff' }}>MC</div>
                  <div className="chip" style={{ background: '#2557D6', color: '#fff' }}>AMEX</div>
                </div>
              </div>
              {formik.touched.cardNumber && formik.errors.cardNumber && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.cardNumber}</div>}
            </div>
            
            <div className="frow3">
              <div className="fgroup">
                <label>Name on card</label>
                <input type="text" name="cardName" className="input" placeholder="Ahmed Al-Rashidi" value={formik.values.cardName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.cardName && formik.errors.cardName && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.cardName}</div>}
              </div>
              <div className="fgroup">
                <label>Expiry</label>
                <input type="text" name="expiry" className="input" placeholder="MM / YY" maxLength={7} value={formik.values.expiry} onChange={handleExpiry} onBlur={formik.handleBlur} />
                {formik.touched.expiry && formik.errors.expiry && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.expiry}</div>}
              </div>
              <div className="fgroup">
                <label>CVC</label>
                <input type="text" name="cvc" className="input" placeholder="•••" maxLength={4} value={formik.values.cvc} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.cvc && formik.errors.cvc && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.cvc}</div>}
              </div>
            </div>
            
            <div className="secure-note">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="5" width="10" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M3.5 5V3.5a2.5 2.5 0 015 0V5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
              Processed securely by Stripe. We never store your card details.
            </div>

            <button type="submit" className="pay-btn" disabled={isProcessing}>
              {!isProcessing ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.4"/><path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <div>Start free trial
                    <div className="pay-btn-note">{plan === 'mo' ? 'No charge for 14 days · Then $9/month' : 'No charge for 14 days · Then $76/year'}</div>
                  </div>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: 'spin 0.9s linear infinite', flexShrink: 0 }}><path d="M10 2a8 8 0 018 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  <div>Processing…
                    <div className="pay-btn-note">Securing your order</div>
                  </div>
                </>
              )}
            </button>

            <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-4)', textAlign: 'center', marginTop: '1rem', lineHeight: 1.7 }}>
              By subscribing you agree to our <Link to="/terms" style={{ color: 'var(--text-3)' }}>Terms</Link> and <Link to="/privacy" style={{ color: 'var(--text-3)' }}>Privacy Policy</Link>.<br />
              Cancel anytime from your dashboard. Refunds within 7 days of first charge.
            </p>
          </form>
        ) : (
          <div className="pay-success on">
            <div className="sring">✓</div>
            <div className="s-title">You're in! 🎉</div>
            <div className="s-sub">Your FileFlow Pro trial is active. Check your email for your download link and welcome kit.</div>
            <div className="s-steps">
              <div className="s-step"><div className="s-step-n">1</div><div className="s-step-t"><strong>Check your email</strong> — download link sent to <span style={{ color: 'var(--gold)' }}>{formik.values.email}</span></div></div>
              <div className="s-step"><div className="s-step-n">2</div><div className="s-step-t"><strong>Install FileFlow</strong> — 12 MB installer, no admin rights needed on Windows 10/11</div></div>
              <div className="s-step"><div className="s-step-n">3</div><div className="s-step-t"><strong>Point it at your folders</strong> — and start finding anything inside any file in seconds</div></div>
            </div>
            <Link to="/dashboard" className="btn-primary btn-lg" style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>Go to your dashboard →</Link>
            <div style={{ marginTop: '1rem' }}><Link to="/" style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-3)', textDecoration: 'none' }}>← Back to homepage</Link></div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
