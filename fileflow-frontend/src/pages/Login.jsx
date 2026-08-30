import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Shield, Trophy } from 'lucide-react';
import { useFormik } from 'formik';
import { z } from 'zod';
import { withZodSchema } from 'formik-validator-zod';
import { useAuthStore } from '../store/useAuthStore';
import { useGoogleLogin } from '@react-oauth/google';
import Loader from '../components/Loader';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const { loginUser, registerUser, loginWithGoogle, isLoading } = useAuthStore();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const success = await loginWithGoogle(tokenResponse.access_token);
      if (success) navigate('/dashboard');
    },
    onError: () => {
      console.error('Google Login Failed');
    }
  });

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validate: withZodSchema(isRegistering ? registerSchema : loginSchema),
    onSubmit: async (values) => {
      if (isRegistering) {
        const success = await registerUser({ name: values.name, email: values.email, password: values.password });
        if (success) navigate('/dashboard');
      } else {
        const success = await loginUser({ email: values.email, password: values.password });
        if (success) navigate('/dashboard');
      }
    },
  });

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-left-orb"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '3rem' }}>
            <div className="nav-logo-icon">
              <svg viewBox="0 0 18 18" fill="none">
                <path d="M3 2h8l4 4v10H3V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M11 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--display)', fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
              File<span style={{ color: 'var(--gold)' }}>Flow</span>
            </span>
          </Link>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '42px', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.1, color: 'var(--text)', marginBottom: '1rem' }}>
            Welcome<br />{isRegistering ? 'aboard.' : 'back.'}
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '380px' }}>
            Your files are waiting. Search across thousands of documents instantly — no cloud, no delay.
          </p>
          <ul className="feature-list">
            <li>
              <div className="fl-icon" style={{ background: 'var(--gold-dim)' }}>
                <Search size={14} color="var(--gold)" />
              </div>
              Search 30+ file formats in milliseconds
            </li>
            <li>
              <div className="fl-icon" style={{ background: 'var(--green-dim)' }}>
                <Shield size={14} color="var(--green)" />
              </div>
              100% local — your files never leave your PC
            </li>
            <li>
              <div className="fl-icon" style={{ background: 'var(--purple-dim)' }}>
                <Trophy size={14} color="var(--purple-3)" />
              </div>
              Earn achievements as you search
            </li>
          </ul>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '26px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em', marginBottom: '.5rem' }}>
            {isRegistering ? 'Create account' : 'Sign in'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '2rem' }}>
            {isRegistering ? 'Join FileFlow today' : 'Welcome back to FileFlow'}
          </p>
          
          <div className="oauth-btn" onClick={() => handleGoogleLogin()}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.1 9.2c0-.6-.1-1.2-.2-1.7H9v3.3h4.6c-.2 1-.8 1.9-1.7 2.4v2h2.7c1.6-1.5 2.5-3.7 2.5-6z" fill="#4285F4" />
              <path d="M9 18c2.3 0 4.2-.8 5.6-2.1l-2.7-2c-.8.5-1.7.8-2.9.8-2.2 0-4.1-1.5-4.8-3.6H1.4v2.1C2.9 15.9 5.8 18 9 18z" fill="#34A853" />
              <path d="M4.2 11.1C4 10.5 3.9 9.8 3.9 9s.1-1.5.3-2.1V4.8H1.4C.8 6 .5 7.5.5 9s.3 3 .9 4.2l2.8-2.1z" fill="#FBBC05" />
              <path d="M9 3.6c1.2 0 2.3.4 3.2 1.3l2.4-2.4C13.2.8 11.3 0 9 0 5.8 0 2.9 2.1 1.4 5.1l2.8 2.1C4.9 5.1 6.8 3.6 9 3.6z" fill="#EA4335" />
            </svg>
            Continue with Google
          </div>
          
          <div className="divider-or"><span>or</span></div>
          
          <form onSubmit={formik.handleSubmit}>
            {isRegistering && (
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="input" 
                  placeholder="Alex Morgan"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.name}</div>
                )}
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                className="input" 
                placeholder="alex@company.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.email}</div>
              )}
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                className="input" 
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.password}</div>
              )}
            </div>
            
            {!isRegistering && (
              <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Link to="#" style={{ fontSize: '12px', color: 'var(--gold)', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
            )}
            
            <button disabled={isLoading} type="submit" className="btn-primary btn-lg btn-loader" style={{ width: '100%', justifyContent: 'center', marginTop: isRegistering ? '1rem' : '0' }}>
              {isLoading ? <Loader size="sm" inline /> : (isRegistering ? 'Create account' : 'Sign in')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', color: 'var(--text-3)' }}>
            {isRegistering ? (
              <>Already have an account? <span style={{ color: 'var(--gold)', cursor: 'pointer' }} onClick={() => setIsRegistering(false)}>Sign in</span></>
            ) : (
              <>Don't have an account? <span style={{ color: 'var(--gold)', cursor: 'pointer' }} onClick={() => setIsRegistering(true)}>Create one</span></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
