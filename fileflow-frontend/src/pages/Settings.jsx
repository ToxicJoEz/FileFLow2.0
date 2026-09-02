import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Mail, Lock, Globe, CreditCard, AlertTriangle, Upload, Eye, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { compressImage, readFile } from '../utils/imageCompression';
import ImageCropperModal from '../components/ImageCropperModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { avatarUrl } from '../utils/avatarUrl';

const ACCENT_COLORS = [
  '#8b5cf6', '#f59e0b', '#ec4899', '#f43f5e', 
  '#f97316', '#84cc16', '#10b981', '#14b8a6', 
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1'
];

export default function Settings() {
  const { user, updateProfile, updateEmail, updatePassword, uploadAvatar, deleteAvatar, deleteAccount, isLoading } = useAuthStore();
  const fileInputRef = useRef(null);

  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null); // 'avatar' or 'account'

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    handle: user?.handle || '',
    location: user?.location || '',
    bio: user?.bio || '',
    accentColor: user?.accentColor || '#8b5cf6'
  });

  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [socialsForm, setSocialsForm] = useState({
    facebook: user?.socialLinks?.facebook || '',
    instagram: user?.socialLinks?.instagram || '',
    linkedin: user?.socialLinks?.linkedin || '',
    x: user?.socialLinks?.x || '',
    reddit: user?.socialLinks?.reddit || '',
    discord: user?.socialLinks?.discord || ''
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

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const imageDataUrl = await readFile(file);
        setImageSrc(imageDataUrl);
        setCropperOpen(true);
      } catch (e) {
        console.warn(e);
      }
      e.target.value = ''; // Reset input
    }
  };

  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [socialsMessage, setSocialsMessage] = useState({ type: '', text: '' });
  const [emailMessage, setEmailMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [avatarMessage, setAvatarMessage] = useState({ type: '', text: '' });

  const handleCropComplete = async (croppedAreaPixels) => {
    setCropperOpen(false);
    setAvatarMessage({ type: '', text: '' });
    try {
      const compressedBase64 = await compressImage(imageSrc, croppedAreaPixels);
      const res = await uploadAvatar(compressedBase64);
      if (res.success) {
        setAvatarMessage({ type: 'success', text: 'Avatar uploaded' });
      } else {
        setAvatarMessage({ type: 'error', text: res.message });
      }
    } catch (err) {
      setAvatarMessage({ type: 'error', text: 'Error processing image' });
    }
  };

  const handleRemoveAvatar = () => {
    setDeleteTarget('avatar');
  };

  const handleDeleteAccount = () => {
    setDeleteTarget('account');
  };

  const executeDelete = async () => {
    if (deleteTarget === 'avatar') {
      const res = await deleteAvatar();
      if (res.success) {
        setAvatarMessage({ type: 'success', text: 'Avatar removed' });
      } else {
        setAvatarMessage({ type: 'error', text: res.message });
      }
    } else if (deleteTarget === 'account') {
      await deleteAccount();
    }
    setDeleteTarget(null);
  };

  const handleProfileSubmit = async () => {
    setProfileMessage({ type: '', text: '' });
    if (isEditingProfile) {
      const res = await updateProfile(profileForm);
      if (res.success) {
        setProfileMessage({ type: 'success', text: 'Profile updated' });
        setIsEditingProfile(false);
      } else {
        setProfileMessage({ type: 'error', text: res.message });
      }
    } else {
      setIsEditingProfile(true);
    }
  };

  const handleSocialsSubmit = async () => {
    setSocialsMessage({ type: '', text: '' });
    if (isEditingSocials) {
      const res = await updateProfile({ socialLinks: socialsForm });
      if (res.success) {
        setSocialsMessage({ type: 'success', text: 'Social links updated' });
        setIsEditingSocials(false);
      } else {
        setSocialsMessage({ type: 'error', text: res.message });
      }
    } else {
      setIsEditingSocials(true);
    }
  };

  const handleEmailSubmit = async () => {
    setEmailMessage({ type: '', text: '' });
    if (isEditingEmail) {
      const res = await updateEmail(emailForm);
      if (res.success) {
        setEmailMessage({ type: 'success', text: 'Email updated' });
        setIsEditingEmail(false);
        setEmailForm({ ...emailForm, currentPassword: '' });
      } else {
        setEmailMessage({ type: 'error', text: res.message });
      }
    } else {
      setIsEditingEmail(true);
    }
  };

  const handlePasswordSubmit = async () => {
    setPasswordMessage({ type: '', text: '' });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    const res = await updatePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
    if (res.success) {
      setPasswordMessage({ type: 'success', text: 'Password updated' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordMessage({ type: 'error', text: res.message });
    }
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
                  background: user?.hasAvatar ? `url(${avatarUrl(user._id, user.avatarVersion || 0)}) center/cover no-repeat` : (user?.accentColor || 'var(--purple)'), 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontSize: '24px', 
                  fontWeight: 800, color: user?.accentColor ? '#fff' : 'var(--bg)', flexShrink: 0 
                }}>
                  {!user?.hasAvatar && getInitials(user?.name)}
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                  />
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="btn-ghost" 
                    style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }} 
                    disabled={isLoading}
                  >
                    <Upload size={12} /> {isLoading ? 'Uploading...' : 'Upload'}
                  </button>
                  {user?.hasAvatar && (
                    <button 
                      onClick={handleRemoveAvatar}
                      className="btn-ghost" 
                      style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.3)' }} 
                      disabled={isLoading}
                      title="Remove custom avatar"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '250px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Display Name</label>
                    <input type="text" name="name" className="input" value={profileForm.name} onChange={handleProfileChange} disabled={!isEditingProfile} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>User Handle</label>
                      <span style={{ fontSize: '10px', color: 'var(--gold)', fontFamily: 'var(--mono)' }}>7-day cooldown</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', fontSize: '13px', fontFamily: 'var(--mono)' }}>@</span>
                      <input 
                        type="text" 
                        name="handle" 
                        className="input" 
                        value={profileForm.handle} 
                        onChange={handleProfileChange} 
                        disabled={!isEditingProfile} 
                        placeholder="handle" 
                        style={{ paddingLeft: '28px' }}
                      />
                    </div>
                  </div>
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

            {avatarMessage.text && (
              <div style={{ padding: '8px 12px', marginBottom: '1rem', background: avatarMessage.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${avatarMessage.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, borderRadius: '6px', color: avatarMessage.type === 'error' ? 'var(--red)' : 'var(--green)', fontSize: '13px' }}>
                {avatarMessage.text}
              </div>
            )}
            {profileMessage.text && (
              <div style={{ padding: '8px 12px', marginBottom: '1rem', background: profileMessage.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${profileMessage.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, borderRadius: '6px', color: profileMessage.type === 'error' ? 'var(--red)' : 'var(--green)', fontSize: '13px' }}>
                {profileMessage.text}
              </div>
            )}

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

              {/* Reddit */}
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px' }}>
                <div style={{ aspectRatio: '1/1', borderRadius: '8px', background: '#FF4500', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                </div>
                <input type="text" name="reddit" className="input" value={socialsForm.reddit} onChange={handleSocialsChange} disabled={!isEditingSocials} placeholder="reddit.com/user/username" style={{ flex: 1 }} />
              </div>

              {/* Discord */}
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px' }}>
                <div style={{ aspectRatio: '1/1', borderRadius: '8px', background: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <input type="text" name="discord" className="input" value={socialsForm.discord} onChange={handleSocialsChange} disabled={!isEditingSocials} placeholder="discord.gg/invite or username" style={{ flex: 1 }} />
              </div>
            </div>

            {socialsMessage.text && (
              <div style={{ padding: '8px 12px', marginBottom: '1rem', background: socialsMessage.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${socialsMessage.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, borderRadius: '6px', color: socialsMessage.type === 'error' ? 'var(--red)' : 'var(--green)', fontSize: '13px' }}>
                {socialsMessage.text}
              </div>
            )}

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
                
                {emailMessage.text && (
                  <div style={{ padding: '8px 12px', background: emailMessage.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${emailMessage.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, borderRadius: '6px', color: emailMessage.type === 'error' ? 'var(--red)' : 'var(--green)', fontSize: '13px' }}>
                    {emailMessage.text}
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

                {passwordMessage.text && (
                  <div style={{ padding: '8px 12px', background: passwordMessage.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${passwordMessage.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, borderRadius: '6px', color: passwordMessage.type === 'error' ? 'var(--red)' : 'var(--green)', fontSize: '13px' }}>
                    {passwordMessage.text}
                  </div>
                )}
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
            <button onClick={handleDeleteAccount} className="btn-ghost" style={{ marginTop: 'auto', alignSelf: 'flex-start', color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '8px 16px', fontSize: '13px' }}>
              Delete Account
            </button>
          </div>

        </div>

      </div>

      {cropperOpen && imageSrc && (
        <ImageCropperModal
          imageSrc={imageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropperOpen(false)}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title={deleteTarget === 'account' ? 'Delete your account?' : 'Remove avatar?'}
          description={deleteTarget === 'account' ? 'This action is permanent and will delete all your data. Are you absolutely sure?' : 'Are you sure you want to remove your custom avatar?'}
          onConfirm={executeDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
