import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { createPost, updatePost } from '../services/blog.service';
import CustomSelect from './CustomSelect';
import Loader from './Loader';
import '../styles/pages/_roadmap.scss'; // Re-use the modal styles from roadmap

export default function BlogEditorModal({ post, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'product',
    excerpt: '',
    content: '',
    readTime: 5,
    status: 'draft',
    isFeatured: false,
    thumbnailUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        category: post.category || 'product',
        excerpt: post.excerpt || '',
        content: post.content || '',
        readTime: post.readTime || 5,
        status: post.status || 'draft',
        isFeatured: post.isFeatured || false,
        thumbnailUrl: post.thumbnailUrl || '',
      });
    }
  }, [post]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleSuccess = () => {
    setIsClosing(true);
    setTimeout(onSuccess, 300);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Auto-generate slug if title changes and we are creating a new post
      ...(name === 'title' && !post ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (post) {
        await updatePost(post._id, formData);
        toast.success("Post updated!");
      } else {
        await createPost(formData);
        toast.success("Post created!");
      }
      handleSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className={`fixed inset-0 z-[100] modal-overlay ${isClosing ? 'anim-fade-out' : 'anim-fade-in'}`}>
      <div className={`modal-content relative ${isClosing ? 'anim-slide-down' : 'anim-slide-up'}`}>
        <div className="flex justify-between items-center modal-header">
          <h3 className="modal-title">{post ? 'Edit Post' : 'New Blog Post'}</h3>
          <button type="button" className="modal-close" onClick={handleClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col modal-form">
          <div className="flex flex-col form-group">
            <label className="form-label">Title</label>
            <input type="text" className="input" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          
          <div className="grid grid-cols-2 form-row">
            <div className="flex flex-col form-group">
              <label className="form-label">Slug (URL)</label>
              <input type="text" className="input" name="slug" value={formData.slug} onChange={handleChange} required />
            </div>
            <div className="flex flex-col form-group">
              <label className="form-label">Category</label>
              <CustomSelect 
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={[
                  { value: 'product', label: 'Product Update' },
                  { value: 'tutorial', label: 'Tutorial' },
                  { value: 'productivity', label: 'Productivity' },
                  { value: 'build', label: 'Behind the build' }
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 form-row">
            <div className="flex flex-col form-group">
              <label className="form-label">Status</label>
              <CustomSelect 
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'published', label: 'Published' }
                ]}
              />
            </div>
            <div className="flex flex-col form-group">
              <label className="form-label">Read Time (mins)</label>
              <input type="number" className="input" name="readTime" value={formData.readTime} onChange={handleChange} min="1" required />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} id="isFeatured" />
            <label htmlFor="isFeatured" className="form-label check-label">Feature this post at the top</label>
          </div>

          <div className="flex flex-col form-group">
            <label className="form-label">Thumbnail URL (optional)</label>
            <input type="text" className="input" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} placeholder="https://example.com/image.png" />
          </div>

          <div className="flex flex-col form-group">
            <label className="form-label">Excerpt (Short summary for feed)</label>
            <textarea className="input" name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} required />
          </div>

          <div className="flex flex-col form-group">
            <label className="form-label">Content (Markdown supported)</label>
            <textarea className="input markdown-textarea" name="content" value={formData.content} onChange={handleChange} rows={12} required />
          </div>

          <div className="flex justify-end gap-2 modal-actions">
            <button type="button" className="btn-outline" onClick={handleClose}>Cancel</button>
            <button type="submit" className="btn-primary btn-loader" disabled={isSubmitting}>
              {isSubmitting ? <Loader size="sm" inline /> : <><Save size={16} /> Save Post</>}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
