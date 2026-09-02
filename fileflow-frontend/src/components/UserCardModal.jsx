import React, { useEffect } from 'react';
import { X, MapPin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserCardModal({ user, onClose }) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const hasSocials = user?.socialLinks && Object.values(user.socialLinks).some(link => link.trim() !== '');

  return (
    <AnimatePresence>
      <div 
        style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}
      >
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(5, 2, 10, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            cursor: 'pointer'
          }}
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px',
            background: 'rgba(28, 12, 56, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.1) inset'
          }}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px', zIndex: 10,
              background: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff',
              width: '32px', height: '32px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(4px)'
            }}
          >
            <X size={16} />
          </button>

          {/* Banner */}
          <div style={{ 
            height: '120px', 
            background: user?.accentColor 
              ? `linear-gradient(135deg, ${user.accentColor}44 0%, var(--bg-1) 100%)`
              : 'linear-gradient(135deg, var(--bg-3) 0%, var(--surface) 40%, var(--bg-1) 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', inset: 0, 
              backgroundImage: user?.accentColor 
                ? `linear-gradient(${user.accentColor}55 1px, transparent 1px), linear-gradient(90deg, ${user.accentColor}55 1px, transparent 1px)`
                : `linear-gradient(rgba(124,58,237,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.12) 1px, transparent 1px)`,
              backgroundSize: '40px 40px' 
            }}></div>
            <div style={{ 
              position: 'absolute', width: 0, height: 0, borderStyle: 'solid',
              borderWidth: '0 20px 34px 20px', 
              borderColor: `transparent transparent ${user?.accentColor || 'var(--gold)'} transparent`, 
              opacity: user?.accentColor ? 0.3 : 0.08, top: '15px', right: '60px' 
            }}></div>
            <div style={{ 
              position: 'absolute', width: 0, height: 0, borderStyle: 'solid',
              borderWidth: '0 12px 20px 12px', 
              borderColor: `transparent transparent ${user?.accentColor || 'var(--purple-2)'} transparent`, 
              opacity: user?.accentColor ? 0.4 : 0.12, bottom: '20px', left: '30%', animation: 'float 7s ease-in-out infinite' 
            }}></div>
          </div>

          {/* Content */}
          <div style={{ padding: '0 24px 24px 24px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            
            {/* Top Row: Avatar and Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-44px', marginBottom: '16px' }}>
              {/* Avatar */}
              <div style={{
                width: '88px', height: '88px', borderRadius: '50%',
                background: user?.accentColor || 'var(--purple)',
                border: '4px solid rgba(28, 12, 56, 1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 800, color: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                {getInitials(user?.name)}
              </div>
              
              {/* Social Links placed on the top right opposite the avatar */}
              {hasSocials && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  {user.socialLinks.facebook && user.socialLinks.facebook.trim() !== '' && (
                    <a href={`https://${user.socialLinks.facebook.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" 
                       style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'transform 0.2s' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                      </svg>
                    </a>
                  )}
                  {user.socialLinks.instagram && user.socialLinks.instagram.trim() !== '' && (
                    <a href={`https://${user.socialLinks.instagram.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" 
                       style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'transform 0.2s' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                  )}
                  {user.socialLinks.linkedin && user.socialLinks.linkedin.trim() !== '' && (
                    <a href={`https://${user.socialLinks.linkedin.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" 
                       style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0077b5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'transform 0.2s' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  )}
                  {user.socialLinks.x && user.socialLinks.x.trim() !== '' && (
                    <a href={`https://${user.socialLinks.x.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" 
                       style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'transform 0.2s' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, fontFamily: 'var(--display)', color: 'var(--text)' }}>
                {user?.name || 'User'}
              </h2>
              <span className="tag gold" style={{ fontSize: '11px', padding: '4px 10px', height: 'fit-content' }}>
                {user?.role === 'admin' ? 'Admin' : (user?.plan === 'pro' ? 'Pro Plan' : 'Free Beta')}
              </span>
            </div>

            {/* Contact & Location */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-2)', fontSize: '13px' }}>
                <Mail size={14} />
                <span>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: user?.location ? 'var(--text-3)' : 'var(--text-4)', fontSize: '13px' }}>
                <MapPin size={14} />
                <span>{user?.location && user.location.trim() !== '' ? user.location : 'No location set'}</span>
              </div>
            </div>

            {/* Bio */}
            <div style={{ 
              background: 'var(--bg-1)', padding: '16px', borderRadius: '12px', 
              width: '100%', border: '1px solid var(--border-2)',
              fontSize: '13px', color: user?.bio && user.bio.trim() !== '' ? 'var(--text-2)' : 'var(--text-4)', 
              lineHeight: 1.5, textAlign: 'left', 
              fontStyle: user?.bio && user.bio.trim() !== '' ? 'normal' : 'italic'
            }}>
              {user?.bio && user.bio.trim() !== '' ? `"${user.bio}"` : 'This user has not written a bio yet.'}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
