import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import * as communityService from '../services/community.service';
import Loader from './Loader';

export default function EditPostModal({ isOpen, onClose, post, isReply, onSuccess }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content);
      if (!isReply) setTitle(post.title || '');
    }
  }, [post, isReply]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 280);
  };

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!content.trim()) return setFormError('Content cannot be empty');
    if (!isReply && !title.trim()) return setFormError('Title cannot be empty');

    setLoading(true);
    try {
      if (isReply) {
        const updated = await communityService.updateReply(post._id, content);
        onSuccess(updated);
      } else {
        const updated = await communityService.updateTopic(post._id, { title, content });
        onSuccess(updated);
      }
      setFormSuccess('Post updated');
      setTimeout(handleClose, 500); // give time to read success before closing
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className={`modal-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 ${isClosing ? 'anim-fade-out' : 'anim-fade-in'}`} onClick={handleClose}>
      <div className={`modal-content relative ${isClosing ? 'anim-slide-down' : 'anim-slide-up'}`} onClick={e => e.stopPropagation()} style={{ maxWidth: '820px', width: '100%', padding: '2.5rem', marginTop: 0, marginBottom: 0, maxHeight: '90vh' }}>
        <button className="modal-close absolute top-6 right-6" onClick={handleClose}><X size={20} /></button>
        <div className="modal-header">
          <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>Edit {isReply ? 'Reply' : 'Thread'}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form flex flex-col gap-5">
          {!isReply && (
            <div>
              <label className="label">Title</label>
              <input 
                type="text" 
                className="input" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
          )}
          
          <div>
            <label className="label">Content (Markdown supported)</label>
            <textarea 
              className="input resize-y" 
              rows={8}
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
          </div>

          {formError && (
            <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: 'var(--red)', fontSize: '13px' }}>
              {formError}
            </div>
          )}
          {formSuccess && (
            <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', color: 'var(--green)', fontSize: '13px' }}>
              {formSuccess}
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-ghost" onClick={handleClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Loader size="sm" /> : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
