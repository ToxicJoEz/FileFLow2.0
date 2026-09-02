import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import * as communityService from '../services/community.service';
import Loader from './Loader';
import CustomSelect from './CustomSelect';

export default function NewThreadModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('tips');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 280);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const topic = await communityService.createTopic({
        title,
        category,
        content
      });
      onSuccess(topic);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create thread');
      setLoading(false);
    }
  };

  return createPortal(
    <div className={`modal-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 ${isClosing ? 'anim-fade-out' : 'anim-fade-in'}`} onClick={handleClose}>
      <div className={`modal-content relative ${isClosing ? 'anim-slide-down' : 'anim-slide-up'}`} onClick={e => e.stopPropagation()} style={{ maxWidth: '820px', width: '100%', padding: '2.5rem', marginTop: 0, marginBottom: 0, maxHeight: '90vh' }}>
        <button className="modal-close absolute top-6 right-6" onClick={handleClose}><X size={20} /></button>
        <div className="modal-header">
          <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>Create a new thread</h3>
          <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>Share a tip, report a bug, or ask the community for help.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form flex flex-col gap-5">
          <div>
            <label className="label">Title</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Keep it clear and concise"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div>
            <label className="label">Category</label>
            <CustomSelect 
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'tips', label: '💡 Tips & Tricks' },
                { value: 'bugs', label: '🪲 Bug Reports' },
                { value: 'features', label: '🚀 Feature Requests' },
                { value: 'help', label: '❓ Help & Support' },
                { value: 'general', label: '💬 General Discussion' },
              ]}
            />
          </div>
          
          <div>
            <label className="label">Content (Markdown supported)</label>
            <textarea 
              className="input resize-y" 
              rows={10}
              placeholder="Describe your issue or share your tip... Use markdown for code blocks, bold, lists, etc."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-ghost" onClick={handleClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Loader size="sm" /> : 'Post thread'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
