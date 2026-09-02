import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  return createPortal(
    <AnimatePresence>
      <div 
        style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', width: '100vw', height: '100vh',
          transform: 'none'
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
                background: user?.hasAvatar ? `url(http://localhost:5000/api/users/${user._id}/avatar?v=${user.avatarVersion || 0}) center/cover no-repeat` : (user?.accentColor || 'var(--purple)'),
                border: '4px solid rgba(28, 12, 56, 1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 800, color: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                {!user?.hasAvatar && getInitials(user?.name)}
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
                  {user.socialLinks.reddit && user.socialLinks.reddit.trim() !== '' && (
                    <a href={`https://${user.socialLinks.reddit.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" 
                       style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FF4500', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'transform 0.2s' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                      </svg>
                    </a>
                  )}
                  {user.socialLinks.discord && user.socialLinks.discord.trim() !== '' && (
                    <a href={`https://${user.socialLinks.discord.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" 
                       style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'transform 0.2s' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Basic Info: Name & Handle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, fontFamily: 'var(--display)', color: 'var(--text)' }}>
                  {user?.name || 'User'}
                </h2>
                <span className="tag gold" style={{ fontSize: '11px', padding: '3px 8px', height: 'fit-content' }}>
                  {user?.role === 'admin' ? 'Admin' : (user?.plan === 'pro' ? 'Pro Plan' : 'Member')}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--purple-3)', fontFamily: 'var(--mono)', fontWeight: 500 }}>
                @{user?.handle || 'user'}
              </div>
            </div>

            {/* Contact & Location */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              {/* Only show email if the logged in viewer is an admin */}
              {user?.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', fontSize: '12px' }}>
                  <Mail size={13} />
                  <span>{user.email}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: user?.location ? 'var(--text-3)' : 'var(--text-4)', fontSize: '12px' }}>
                <MapPin size={13} />
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
    </AnimatePresence>,
    document.body
  );
}
