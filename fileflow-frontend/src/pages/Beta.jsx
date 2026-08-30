import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { z } from 'zod';
import { withZodSchema } from 'formik-validator-zod';
import { toast } from 'react-toastify';
import { joinWaitlistForm } from '../services/form.service';
import CustomSelect from '../components/CustomSelect';
import Loader from '../components/Loader';

const betaSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  useCase: z.string(),
  terms: z.boolean().refine(val => val === true, "You must agree to the terms")
});

export default function Beta() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      useCase: 'Personal use',
      terms: false
    },
    validate: withZodSchema(betaSchema),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await joinWaitlistForm({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          useCase: values.useCase
        });
        setIsSuccess(true);
        toast.success("Successfully joined the waitlist!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to join waitlist");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (isSuccess) {
    return (
      <div className="beta-wrap">
        <div className="beta-orb"></div>
        <div className="beta-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>You're on the list!</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '2rem' }}>Keep an eye on your inbox. We'll email you as soon as a spot opens up for the FileFlow Beta.</p>
          <Link to="/" className="btn-ghost">Return to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="beta-wrap">
      <div className="beta-orb"></div>
      <div className="beta-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em' }}>
            <div className="nav-logo-icon" style={{ width: '36px', height: '36px' }}>
              <svg viewBox="0 0 18 18" fill="none">
                <path d="M3 2h8l4 4v10H3V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M11 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            File<span style={{ color: 'var(--gold)' }}>Flow</span>
          </Link>
        </div>
        
        <div className="perks">
          <div className="perk"><span style={{ color: 'var(--green)' }}>✓</span>Free 14-day Pro trial when launched</div>
          <div className="perk"><span style={{ color: 'var(--green)' }}>✓</span>Early access to new features</div>
          <div className="perk"><span style={{ color: 'var(--green)' }}>✓</span>50% off when you convert to paid</div>
        </div>
        
        <h1 style={{ fontFamily: 'var(--display)', fontSize: '26px', fontWeight: 700, color: 'var(--text)', textAlign: 'center', marginBottom: '.5rem', letterSpacing: '-.02em' }}>
          Join the Beta Waitlist
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-3)', textAlign: 'center', marginBottom: '2rem' }}>
          Sign up to get early access to FileFlow.
        </p>
        
        <form onSubmit={formik.handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First name</label>
              <input type="text" name="firstName" className="input" placeholder="Alex" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.firstName && formik.errors.firstName && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.firstName}</div>}
            </div>
            <div className="form-group">
              <label>Last name</label>
              <input type="text" name="lastName" className="input" placeholder="Morgan" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.lastName && formik.errors.lastName && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.lastName}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Email address</label>
            <input type="email" name="email" className="input" placeholder="alex@company.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.email && formik.errors.email && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label>How will you use FileFlow?</label>
            <CustomSelect 
              name="useCase" 
              value={formik.values.useCase} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              options={[
                'Personal use',
                'Professional / work',
                'Legal / compliance',
                'Research / academia',
                'Development / testing'
              ]}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '1.5rem' }}>
            <input type="checkbox" name="terms" id="terms-check" style={{ marginTop: '3px', accentColor: 'var(--gold)' }} checked={formik.values.terms} onChange={formik.handleChange} />
            <div>
              <label htmlFor="terms-check" style={{ fontSize: '13px', color: 'var(--text-3)', margin: 0, fontFamily: 'var(--sans)', fontWeight: 400, cursor: 'pointer' }}>
                I agree to FileFlow's <Link to="/terms" style={{ color: 'var(--gold)' }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: 'var(--gold)' }}>Privacy Policy</Link>
              </label>
              {formik.touched.terms && formik.errors.terms && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.terms}</div>}
            </div>
          </div>
          
          <button type="submit" disabled={isSubmitting} className="btn-primary btn-lg btn-loader" style={{ width: '100%', justifyContent: 'center' }}>
            {isSubmitting ? <Loader size="sm" inline /> : 'Join the waitlist'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', color: 'var(--text-3)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
