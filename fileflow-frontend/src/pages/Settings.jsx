import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Mail, Lock, Globe, CreditCard, AlertTriangle, Upload, Eye } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const ACCENT_COLORS = [
  '#8b5cf6', '#f59e0b', '#ec4899', '#f43f5e', 
  '#f97316', '#84cc16', '#10b981', '#14b8a6', 
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1'
];

export default function Settings() {
  const { user, updateProfile, updateEmail, updatePassword, isLoading } = useAuthStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    location: user?.location || '',
    bio: user?.bio || '',
    accentColor: user?.accentColor || '#8b5cf6'
  });

  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [socialsForm, setSocialsForm] = useState({
    facebook: user?.socialLinks?.facebook || '',
    instagram: user?.socialLinks?.instagram || '',
    linkedin: user?.socialLinks?.linkedin || '',
    x: user?.socialLinks?.x || ''
  });

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailForm, setEmailForm] = useState({
    newEmail: user?.email || '',
    currentPassword: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  const handleSocialsChange = (e) => setSocialsForm({ ...socialsForm, [e.target.name]: e.target.value });
  const handleEmailChange = (e) => setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = async () => {
    if (isEditingProfile) {
      const success = await updateProfile(profileForm);
      if (success) setIsEditingProfile(false);
    } else {
      setIsEditingProfile(true);
    }
  };

  const handleSocialsSubmit = async () => {
    if (isEditingSocials) {
      const success = await updateProfile({ socialLinks: socialsForm });
      if (success) setIsEditingSocials(false);
    } else {
      setIsEditingSocials(true);
    }
  };

  const handleEmailSubmit = async () => {
    if (isEditingEmail) {
      const success = await updateEmail(emailForm);
      if (success) {
        setIsEditingEmail(false);
        setEmailForm({ ...emailForm, currentPassword: '' }); // Clear password field
      }
    } else {
      setIsEditingEmail(true);
    }
  };

  const handlePasswordSubmit = async () => {
    import('react-toastify').then(({ toast }) => {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }).then((success) => {
        if (success) {
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
      });
    });
  };

  return (
    <div className="anim-fade-up">
      <div className="section-hdr" style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em' }}>Settings</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
        
        {/* ROW 1: Public Profile & Social Links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          
          {/* Public Profile */}
          <div className="info-box" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <User size={18} color="var(--gold)" />
              <h4 style={{ margin: 0 }}>Public Profile</h4>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', 
                  background: user?.accentColor || 'var(--purple)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontSize: '24px', 
                  fontWeight: 800, color: user?.accentColor ? '#fff' : 'var(--bg)', flexShrink: 0 
                }}>
                  {getInitials(user?.name)}
                </div>
                <button className="btn-ghost" style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }} disabled={!isEditingProfile}>
                  <Upload size={12} /> Upload
                </button>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '250px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Display Name</label>
                  <input type="text" name="name" className="input" value={profileForm.name} onChange={handleProfileChange} disabled={!isEditingProfile} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Location</label>
                  <input type="text" name="location" className="input" value={profileForm.location} onChange={handleProfileChange} disabled={!isEditingProfile} placeholder="E.g. San Francisco, CA" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Bio</label>
              <textarea name="bio" className="input" rows={3} value={profileForm.bio} onChange={handleProfileChange} disabled={!isEditingProfile} style={{ resize: 'vertical' }}></textarea>
              <p style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '4px' }}>Brief description for your community profile. URLs are auto-linked.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Profile Accent Color</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    disabled={!isEditingProfile}
                    onClick={() => setProfileForm({ ...profileForm, accentColor: color })}
                    style={{
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      background: color,
                      border: 'none',
                      cursor: isEditingProfile ? 'pointer' : 'not-allowed',
                      outline: profileForm.accentColor === color ? `2px solid ${color}` : '2px solid transparent',
                      outlineOffset: '2px',
                      opacity: isEditingProfile ? 1 : 0.6,
                      transition: 'all 0.2s'
                    }}
                    title={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            <button onClick={handleProfileSubmit} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', marginTop: 'auto', alignSelf: 'flex-start' }} disabled={isLoading}>
              {isEditingProfile ? (isLoading ? 'Saving...' : 'Save Profile') : 'Edit Profile'}
            </button>
          </div>

          {/* Social Links */}
          <div className="info-box" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Globe size={18} color="var(--purple-3)" />
              <h4 style={{ margin: 0 }}>Social Links</h4>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '1.5rem' }}>
              Add links to your other profiles to display them on your community card.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem', flex: 1 }}>
              {/* Facebook */}
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px' }}>
                <div style={{ aspectRatio: '1/1', borderRadius: '8px', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </div>
                <input type="text" name="facebook" className="input" value={socialsForm.facebook} onChange={handleSocialsChange} disabled={!isEditingSocials} placeholder="facebook.com/username" style={{ flex: 1 }} />
              </div>

              {/* Instagram */}
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px' }}>
                <div style={{ aspectRatio: '1/1', borderRadius: '8px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <input type="text" name="instagram" className="input" value={socialsForm.instagram} onChange={handleSocialsChange} disabled={!isEditingSocials} placeholder="instagram.com/username" style={{ flex: 1 }} />
              </div>

              {/* LinkedIn */}
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px' }}>
                <div style={{ aspectRatio: '1/1', borderRadius: '8px', background: '#0077b5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <input type="text" name="linkedin" className="input" value={socialsForm.linkedin} onChange={handleSocialsChange} disabled={!isEditingSocials} placeholder="linkedin.com/in/username" style={{ flex: 1 }} />
              </div>

              {/* X / Twitter */}
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px' }}>
                <div style={{ aspectRatio: '1/1', borderRadius: '8px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                  </svg>
                </div>
                <input type="text" name="x" className="input" value={socialsForm.x} onChange={handleSocialsChange} disabled={!isEditingSocials} placeholder="x.com/username" style={{ flex: 1 }} />
              </div>
            </div>

            <button onClick={handleSocialsSubmit} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', marginTop: 'auto', alignSelf: 'flex-start' }} disabled={isLoading}>
              {isEditingSocials ? (isLoading ? 'Saving...' : 'Save Links') : 'Edit Links'}
            </button>
          </div>
        </div>

        {/* ROW 2: Security */}
        <div className="info-box" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <Lock size={18} color="var(--green)" />
            <h4 style={{ margin: 0 }}>Security</h4>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
            
            {/* Change Email */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
              <h5 style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '1rem', fontWeight: 600 }}>Change Email Address</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>New Email Address</label>
                  <input type="email" name="newEmail" className="input" placeholder="new@example.com" value={emailForm.newEmail} onChange={handleEmailChange} disabled={!isEditingEmail} />
                </div>
                
                {isEditingEmail && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Current Password (to confirm)</label>
                    <input type="password" name="currentPassword" className="input" placeholder="••••••••" value={emailForm.currentPassword} onChange={handleEmailChange} />
                  </div>
                )}
                <button onClick={handleEmailSubmit} className={isEditingEmail ? "btn-primary" : "btn-ghost"} style={{ padding: '8px 16px', fontSize: '13px', marginTop: 'auto', alignSelf: 'flex-start' }} disabled={isLoading}>
                  {isEditingEmail ? (isLoading ? 'Saving...' : 'Save Email') : 'Edit Email'}
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
              <h5 style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '1rem', fontWeight: 600 }}>Change Password</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Current Password</label>
                  <input type="password" name="currentPassword" className="input" placeholder="••••••••" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>New Password</label>
                    <input type="password" name="newPassword" className="input" placeholder="••••••••" value={passwordForm.newPassword} onChange={handlePasswordChange} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Confirm Password</label>
                    <input type="password" name="confirmPassword" className="input" placeholder="••••••••" value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
                  </div>
                </div>

                <button onClick={handlePasswordSubmit} className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px', marginTop: 'auto', alignSelf: 'flex-start' }} disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ROW 3: Billing & Danger Zone */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          
          {/* Subscription Status */}
          <div className="info-box" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <CreditCard size={18} color="var(--text-2)" />
              <h4 style={{ margin: 0 }}>Subscription</h4>
            </div>
            
            <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-4)', fontFamily: 'var(--mono)', textTransform: 'uppercase', marginBottom: '6px' }}>CURRENT PLAN</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Pro Beta <span className="tag gold" style={{ fontSize: '10px', padding: '2px 8px' }}>Active</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '6px' }}>Thanks for being an early supporter!</div>
              </div>
              
              <Link to="/billing" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none', alignSelf: 'flex-start', marginTop: 'auto' }}>
                Manage Billing
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="info-box" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <AlertTriangle size={18} color="var(--red)" />
              <h4 style={{ margin: 0, color: 'var(--red)' }}>Danger Zone</h4>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '1.5rem' }}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button className="btn-ghost" style={{ marginTop: 'auto', alignSelf: 'flex-start', color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '8px 16px', fontSize: '13px' }}>
              Delete Account
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
