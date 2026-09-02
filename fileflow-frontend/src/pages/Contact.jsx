import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { z } from 'zod';
import { withZodSchema } from 'formik-validator-zod';
import { toast } from 'react-toastify';
import { submitContactForm } from '../services/form.service';
import CustomSelect from '../components/CustomSelect';
import Loader from '../components/Loader';

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  topic: z.string(),
  message: z.string().min(10, "Please provide more details in your message")
});

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      topic: 'General question',
      message: ''
    },
    validate: withZodSchema(contactSchema),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setFormError('');
      try {
        await submitContactForm(values);
        setSubmitted(true);
      } catch (error) {
        setFormError(error.response?.data?.message || "Failed to send message");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <>
      <section className="contact-hero section">
        <div className="container">
          <div className="section-label">Contact</div>
          <h1 className="section-title">We're here<br /><span className="gold-text">to help.</span></h1>
          <p className="section-desc">Have a question, bug report, or just want to say hi? Pick the best channel below.</p>
        </div>
      </section>
      
      <div className="container">
        <div className="contact-layout">
          <div className="anim-fade-up">
            <div className="section-label">Channels</div>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>How to reach us</h2>
            <div className="contact-channels">
              <Link to="/community" className="channel-card">
                <div className="channel-icon" style={{ background: 'var(--purple-dim)' }}>💬</div>
                <div>
                  <div className="channel-name">Community Forum</div>
                  <div className="channel-desc">Fastest answers. Thousands of FileFlow users and our team reply here daily.</div>
                  <div className="channel-tag">Usually answered in &lt;2h</div>
                </div>
              </Link>
              <div className="channel-card">
                <div className="channel-icon" style={{ background: 'var(--gold-dim)' }}>📧</div>
                <div>
                  <div className="channel-name">Email support</div>
                  <div className="channel-desc">For billing issues, account problems, or anything that needs privacy.</div>
                  <div className="channel-tag">support@file-flow.com · Reply within 24h</div>
                </div>
              </div>
              <div className="channel-card">
                <div className="channel-icon" style={{ background: 'var(--red-dim)' }}>🐛</div>
                <div>
                  <div className="channel-name">Bug reports</div>
                  <div className="channel-desc">Found a bug? Use the form or post in the Bug Reports category with your OS and version.</div>
                  <div className="channel-tag">Include FileFlow version + Windows version</div>
                </div>
              </div>
              <div className="channel-card">
                <div className="channel-icon" style={{ background: 'var(--green-dim)' }}>🤝</div>
                <div>
                  <div className="channel-name">Partnerships & press</div>
                  <div className="channel-desc">For media inquiries, partnership proposals, or business collaboration.</div>
                  <div className="channel-tag">hello@file-flow.com · We read everything</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-form-box anim-fade-up">
            <h3>Send us a message</h3>
            <p>We'll get back to you within one business day.</p>
            
            {!submitted ? (
              <form onSubmit={formik.handleSubmit}>
                <div className="form-row" style={{ marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label>First name</label>
                    <input type="text" name="firstName" className="input" placeholder="Ahmed" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.touched.firstName && formik.errors.firstName && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.firstName}</div>}
                  </div>
                  <div className="form-group">
                    <label>Last name</label>
                    <input type="text" name="lastName" className="input" placeholder="Al-Rashidi" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.touched.lastName && formik.errors.lastName && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.lastName}</div>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" className="input" placeholder="you@company.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                  {formik.touched.email && formik.errors.email && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.email}</div>}
                </div>
                
                <div className="form-group">
                  <label>Topic</label>
                  <CustomSelect 
                    name="topic"
                    value={formik.values.topic}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={[
                      'General question',
                      'Bug report',
                      'Billing / account',
                      'Feature request',
                      'Partnership / press',
                      'Other'
                    ]}
                  />
                </div>
                
                <div className="form-group">
                  <label>Message</label>
                  <textarea name="message" className="input" rows={5} placeholder="Tell us what's on your mind..." style={{ resize: 'vertical' }} value={formik.values.message} onChange={formik.handleChange} onBlur={formik.handleBlur}></textarea>
                  {formik.touched.message && formik.errors.message && <div style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{formik.errors.message}</div>}
                </div>

                {formError && (
                  <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: 'var(--red)', fontSize: '13px', marginBottom: '1rem' }}>
                    {formError}
                  </div>
                )}
                
                <button type="submit" disabled={isSubmitting} className="btn-primary btn-loader" style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
                  {isSubmitting ? <Loader size="sm" inline /> : 'Send message'}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '40px', marginBottom: '1rem' }}>✉️</div>
                <h4 style={{ fontFamily: 'var(--display)', fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Message sent!</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>Thanks for reaching out. We'll reply to your email within one business day.</p>
                <div style={{ marginTop: '1.5rem' }}>
                  <Link to="/community" className="btn-ghost" style={{ fontSize: '13px' }}>Visit the community →</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
