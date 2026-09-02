import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Shield, Trash2, Save, MessageSquare, List, Undo2, ExternalLink, Pin } from 'lucide-react';
import { updateUserAdmin, deleteUserAvatarAdmin } from '../services/user.service';
import { getAdminUserTopics, getAdminUserReplies, deleteTopic, restoreTopic, togglePinTopic, deleteReply, restoreReply } from '../services/community.service';
import CustomSelect from './CustomSelect';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { avatarUrl } from '../utils/avatarUrl';

const ACCENT_COLORS = [
  '#8b5cf6', '#f59e0b', '#ec4899', '#f43f5e', 
  '#f97316', '#84cc16', '#10b981', '#14b8a6', 
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1'
];

export default function AdminEditUserModal({ user, onClose, onUserUpdated }) {
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarDeleting, setAvatarDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    handle: user?.handle || '',
    bio: user?.bio || '',
    location: user?.location || '',
    role: user?.role || 'user',
    accentColor: user?.accentColor || '#8b5cf6',
    socialLinks: {
      facebook: user?.socialLinks?.facebook || '',
      instagram: user?.socialLinks?.instagram || '',
      linkedin: user?.socialLinks?.linkedin || '',
      x: user?.socialLinks?.x || '',
      reddit: user?.socialLinks?.reddit || '',
      discord: user?.socialLinks?.discord || ''
    }
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const loadUserContent = async (type) => {
    setLoadingContent(true);
    try {
      if (type === 'threads') {
        const data = await getAdminUserTopics(user._id);
        setThreads(data || []);
      } else if (type === 'replies') {
        const data = await getAdminUserReplies(user._id);
        setReplies(data || []);
      }
    } catch (err) {
      toast.error(`Failed to load ${type}`);
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'threads' && threads.length === 0) {
      loadUserContent('threads');
    }
    if (activeTab === 'replies' && replies.length === 0) {
      loadUserContent('replies');
    }
  }, [activeTab]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [e.target.name]: e.target.value
      }
    });
  };

  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormMessage({ type: '', text: '' });
    try {
      const res = await updateUserAdmin(user._id, formData);
      if (res?.success) {
        setFormMessage({ type: 'success', text: `Updated profile for ${formData.name}` });
        onUserUpdated(res.data);
      }
    } catch (err) {
      setFormMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update user profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm(`Are you sure you want to remove the avatar for ${user.name}?`)) return;
    setAvatarDeleting(true);
    setFormMessage({ type: '', text: '' });
    try {
      const res = await deleteUserAvatarAdmin(user._id);
      if (res?.success) {
        setFormMessage({ type: 'success', text: `Avatar removed for ${user.name}` });
        onUserUpdated(res.data);
      }
    } catch (err) {
      setFormMessage({ type: 'error', text: err.response?.data?.message || 'Failed to remove avatar' });
    } finally {
      setAvatarDeleting(false);
    }
  };

  const handleTogglePin = async (topicId) => {
    try {
      await togglePinTopic(topicId);
      toast.success('Pin state updated');
      setThreads(prev => prev.map(t => t._id === topicId ? { ...t, isPinned: !t.isPinned } : t));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle pin');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Soft delete this thread?')) return;
    try {
      await deleteTopic(topicId);
      toast.success('Thread deleted');
      setThreads(prev => prev.map(t => t._id === topicId ? { ...t, isDeleted: true } : t));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete thread');
    }
  };

  const handleRestoreTopic = async (topicId) => {
    try {
      await restoreTopic(topicId);
      toast.success('Thread restored');
      setThreads(prev => prev.map(t => t._id === topicId ? { ...t, isDeleted: false } : t));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to restore thread');
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Soft delete this reply?')) return;
    try {
      await deleteReply(replyId);
      toast.success('Reply deleted');
      setReplies(prev => prev.map(r => r._id === replyId ? { ...r, isDeleted: true } : r));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete reply');
    }
  };

  const handleRestoreReply = async (replyId) => {
    try {
      await restoreReply(replyId);
      toast.success('Reply restored');
      setReplies(prev => prev.map(r => r._id === replyId ? { ...r, isDeleted: false } : r));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to restore reply');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return createPortal(
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${isClosing ? 'anim-fade-out' : 'anim-fade-in'}`}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(5, 2, 10, 0.75)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 99999
      }}
      onClick={handleClose}
    >
      <div 
        className={`relative flex flex-col ${isClosing ? 'anim-slide-down' : 'anim-slide-up'}`}
        style={{
          width: '100%', maxWidth: '640px', height: '700px', maxHeight: '90vh',
          background: 'rgba(28, 12, 56, 0.95)', border: '1px solid var(--border-2)',
          borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Tabs */}
        <div style={{ padding: '24px 24px 0 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--gold)" />
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                Manage {user.name}
              </h3>
            </div>
            <button type="button" onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button type="button" onClick={() => setActiveTab('edit')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: activeTab === 'edit' ? 'var(--purple-3)' : 'var(--text-3)', borderBottom: activeTab === 'edit' ? '2px solid var(--purple-3)' : '2px solid transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Edit Profile
            </button>
            <button type="button" onClick={() => setActiveTab('threads')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: activeTab === 'threads' ? 'var(--purple-3)' : 'var(--text-3)', borderBottom: activeTab === 'threads' ? '2px solid var(--purple-3)' : '2px solid transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <List size={16} /> Threads
            </button>
            <button type="button" onClick={() => setActiveTab('replies')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: activeTab === 'replies' ? 'var(--purple-3)' : 'var(--text-3)', borderBottom: activeTab === 'replies' ? '2px solid var(--purple-3)' : '2px solid transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} /> Replies
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="anim-fade-in" key={activeTab} style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>

          
          {/* TAB: EDIT */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-1)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: user.hasAvatar ? `url(${avatarUrl(user._id, user.avatarVersion || 0)}) center/cover no-repeat` : (formData.accentColor || 'var(--purple)'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {!user.hasAvatar && getInitials(formData.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>User Profile Avatar</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{user.hasAvatar ? 'Custom uploaded avatar photo' : 'Default generated initials'}</div>
                </div>
                {user.hasAvatar && (
                  <button type="button" onClick={handleDeleteAvatar} disabled={avatarDeleting} className="btn-ghost" style={{ fontSize: '11px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <Trash2 size={12} /> {avatarDeleting ? 'Removing...' : 'Delete Image'}
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Full Name</label>
                  <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Email Address</label>
                  <input type="email" name="email" className="input" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Handle</label>
                  <input type="text" name="handle" className="input" placeholder="username" value={formData.handle} onChange={handleChange} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Location</label>
                  <input type="text" name="location" className="input" placeholder="City, Country" value={formData.location} onChange={handleChange} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Role</label>
                  <CustomSelect name="role" value={formData.role} onChange={handleChange} options={[{ value: 'user', label: 'Member' }, { value: 'admin', label: 'Admin' }]} style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Bio</label>
                <textarea name="bio" className="input" rows={2} value={formData.bio} onChange={handleChange} placeholder="Tell the community about this user..." style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Accent Color</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ACCENT_COLORS.map(color => (
                    <button type="button" key={color} onClick={() => setFormData({ ...formData, accentColor: color })} style={{ width: '24px', height: '24px', borderRadius: '50%', background: color, border: formData.accentColor === color ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', outline: formData.accentColor === color ? `2px solid ${color}` : 'none' }} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>Social Links</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {['x', 'discord', 'reddit', 'linkedin', 'instagram', 'facebook'].map(platform => (
                    <input key={platform} type="text" name={platform} className="input" placeholder={`${platform} link/username`} value={formData.socialLinks[platform]} onChange={handleSocialChange} style={{ fontSize: '12px' }} />
                  ))}
                </div>
              </div>

              {formMessage.text && (
                <div style={{
                  padding: '10px 14px',
                  background: formMessage.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  border: `1px solid ${formMessage.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                  borderRadius: '6px',
                  color: formMessage.type === 'error' ? 'var(--red)' : 'var(--green)',
                  fontSize: '13px',
                  marginTop: '4px'
                }}>
                  {formMessage.text}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <button type="button" className="btn-outline" style={{ flex: 1, padding: '9px 16px', fontSize: '13px', justifyContent: 'center' }} onClick={handleClose} disabled={loading}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '9px 16px', fontSize: '13px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }} disabled={loading}>
                  <Save size={14} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* TAB: THREADS */}
          {activeTab === 'threads' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {loadingContent ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-3)' }}>Loading threads...</div>
              ) : threads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-3)' }}>User has not created any threads.</div>
              ) : (
                threads.map(topic => (
                  <div key={topic._id} className="info-box" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', opacity: topic.isDeleted ? 0.6 : 1, borderColor: topic.isDeleted ? 'var(--red-dim)' : 'var(--border)' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--text)' }}>{topic.title}</h4>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="tag" style={{ fontSize: '10px', padding: '2px 6px' }}>{topic.category}</span>
                        <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                        {topic.isDeleted && <span style={{ color: 'var(--red)' }}>• Deleted</span>}
                        {topic.isPinned && <span style={{ color: 'var(--gold)' }}>• Pinned</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                      <Link to={`/community/${topic._id}`} className="btn-ghost" style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--text-2)', textDecoration: 'none' }}>
                        <ExternalLink size={12} /> View
                      </Link>
                      <button type="button" onClick={() => handleTogglePin(topic._id)} className="btn-ghost" style={{ fontSize: '11px', padding: '4px 8px', color: topic.isPinned ? 'var(--gold)' : 'var(--text-2)' }}>
                        <Pin size={12} /> {topic.isPinned ? 'Unpin' : 'Pin'}
                      </button>
                      {topic.isDeleted ? (
                        <button type="button" onClick={() => handleRestoreTopic(topic._id)} className="btn-ghost" style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--gold)' }}>
                          <Undo2 size={12} /> Restore
                        </button>
                      ) : (
                        <button type="button" onClick={() => handleDeleteTopic(topic._id)} className="btn-ghost" style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--red)' }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: REPLIES */}
          {activeTab === 'replies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {loadingContent ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-3)' }}>Loading replies...</div>
              ) : replies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-3)' }}>User has not posted any replies.</div>
              ) : (
                replies.map(reply => (
                  <div key={reply._id} className="info-box" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', opacity: reply.isDeleted ? 0.6 : 1, borderColor: reply.isDeleted ? 'var(--red-dim)' : 'var(--border)' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '6px' }}>
                        Replying to: <Link to={`/community/${reply.topic?._id}`} style={{ color: 'var(--purple-3)', textDecoration: 'none' }}>{reply.topic?.title || 'Unknown Topic'}</Link>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{reply.content}</p>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '8px', display: 'flex', gap: '8px' }}>
                        {new Date(reply.createdAt).toLocaleDateString()}
                        {reply.isDeleted && <span style={{ color: 'var(--red)' }}>• Deleted</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                      {reply.isDeleted ? (
                        <button type="button" onClick={() => handleRestoreReply(reply._id)} className="btn-ghost" style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--gold)' }}>
                          <Undo2 size={12} /> Restore
                        </button>
                      ) : (
                        <button type="button" onClick={() => handleDeleteReply(reply._id)} className="btn-ghost" style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--red)' }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}

