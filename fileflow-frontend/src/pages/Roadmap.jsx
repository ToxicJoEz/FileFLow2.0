import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Calendar, Lightbulb, ArrowUp, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import CustomSelect from '../components/CustomSelect';
import { getFeatures, suggestFeature, addOfficialFeature, toggleVote } from '../services/feature.service';
import { useAuthStore } from '../store/useAuthStore';

export default function Roadmap() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('all');
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Suggestion form state
  const [suggestionTitle, setSuggestionTitle] = useState('');
  const [suggestionDesc, setSuggestionDesc] = useState('');
  const [suggestionCategory, setSuggestionCategory] = useState('Search');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [pendingFeatures, setPendingFeatures] = useState([]);
  const [editingFeatureId, setEditingFeatureId] = useState(null);
  const [adminForm, setAdminForm] = useState({
    title: '',
    description: '',
    category: 'Search',
    status: 'planned',
    progress: 0,
    eta: ''
  });

  useEffect(() => {
    fetchFeatures();
  }, [user]);

  const fetchFeatures = async () => {
    try {
      const data = await getFeatures();
      setFeatures(data || []);
    } catch (error) {
      toast.error("Failed to load roadmap.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPending = async () => {
    try {
      const { getPendingFeatures } = await import('../services/feature.service');
      const data = await getPendingFeatures();
      setPendingFeatures(data);
      setShowReviewModal(true);
    } catch (error) {
      toast.error("Failed to load suggestions.");
    }
  };

  const handleToggleVote = async (id) => {
    if (!user) {
      toast.info("Please log in to vote.");
      return;
    }

    setFeatures(prev => prev.map(f => {
      if (f._id === id) {
        return { ...f, hasVoted: !f.hasVoted, totalVotes: f.hasVoted ? f.totalVotes - 1 : f.totalVotes + 1 };
      }
      return f;
    }));

    try {
      await toggleVote(id);
    } catch (error) {
      toast.error("Failed to register vote.");
      fetchFeatures();
    }
  };

  const handleSubmitSuggestion = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please log in to suggest features.");
      return;
    }

    setIsSubmitting(true);
    try {
      await suggestFeature({
        title: suggestionTitle,
        description: suggestionDesc,
        category: suggestionCategory
      });
      setSuggestionTitle('');
      setSuggestionDesc('');
      toast.success("Suggestion submitted! It is pending admin approval.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit suggestion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingFeatureId) {
        const { updateFeature } = await import('../services/feature.service');
        const updated = await updateFeature(editingFeatureId, adminForm);
        setFeatures(prev => {
          const exists = prev.find(f => f._id === updated._id);
          if (exists) return prev.map(f => f._id === updated._id ? updated : f);
          return [updated, ...prev]; // If it was pending, it wasn't in public features list yet
        });
        toast.success("Feature updated and published.");
      } else {
        const newFeature = await addOfficialFeature(adminForm);
        setFeatures([newFeature, ...features]);
        toast.success("Official feature added.");
      }
      setShowAdminModal(false);
      setEditingFeatureId(null);
      setAdminForm({ title: '', description: '', category: 'Search', status: 'planned', progress: 0, eta: '' });
      if (showReviewModal) loadPending(); // refresh pending list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save feature");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, isPending = false) => {
    if (!window.confirm("Delete this feature?")) return;
    try {
      const { deleteFeature } = await import('../services/feature.service');
      await deleteFeature(id);
      if (isPending) {
        setPendingFeatures(prev => prev.filter(f => f._id !== id));
      } else {
        setFeatures(prev => prev.filter(f => f._id !== id));
      }
      toast.success("Feature deleted.");
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  const handleEditPending = (feature) => {
    setEditingFeatureId(feature._id);
    setAdminForm({
      title: feature.title,
      description: feature.description,
      category: feature.category || 'Search',
      status: feature.status === 'pending' ? 'ideas' : feature.status, // Preserve status if not pending
      progress: feature.progress || 0,
      eta: feature.eta || ''
    });
    setShowAdminModal(true);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getLastUpdated = () => {
    if (!features || features.length === 0) return 'No updates yet';
    const latestDate = new Date(Math.max(...features.map(f => new Date(f.updatedAt || f.createdAt))));
    return latestDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isVisible = (phase) => filter === 'all' || filter === phase;

  const renderFeatures = (statusType) => {
    const filtered = features.filter(f => f.status === statusType);
    if (filtered.length === 0) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-4)', fontSize: '14px', border: '1px dashed var(--border)', borderRadius: '8px', margin: '1rem 0' }}>
          No features in this phase yet.
        </div>
      );
    }

    return (
      <div className="road-items">
        {filtered.map(feature => (
          <div className="road-item" key={feature._id}>
            <div className="road-item-icon" style={{ 
              background: statusType === 'shipped' ? 'var(--green-dim)' : statusType === 'in-progress' ? 'var(--gold-dim)' : statusType === 'planned' ? 'var(--purple-dim)' : 'var(--bg-3)',
              color: statusType === 'shipped' ? 'var(--green)' : statusType === 'in-progress' ? 'var(--gold)' : statusType === 'planned' ? 'var(--purple-3)' : 'var(--text-3)'
            }}>
              {statusType === 'shipped' && <CheckCircle2 size={18} />}
              {statusType === 'in-progress' && <Clock size={18} />}
              {statusType === 'planned' && <Calendar size={18} />}
              {statusType === 'ideas' && <Lightbulb size={18} />}
            </div>
            
            <div className="road-item-info">
              <div className="road-item-title">{feature.title}</div>
              <div className="road-item-desc">{feature.description}</div>
              
              {statusType === 'in-progress' && feature.progress > 0 && (
                <div className="progress-wrap">
                  <div className="progress-label"><span>Development</span><span>{feature.progress}%</span></div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${feature.progress}%` }}></div></div>
                </div>
              )}
              
              <div className="road-item-meta" style={{ marginTop: statusType === 'in-progress' ? '8px' : '0' }}>
                <span className={`tag ${statusType === 'shipped' ? 'green' : statusType === 'in-progress' ? 'gold' : ''}`}>
                  {statusType.replace('-', ' ')}
                </span>
                {feature.eta && <span className="tag">{feature.eta}</span>}
              </div>
            </div>
            
            <div className="road-item-votes" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <button 
                className={`vote-btn ${feature.hasVoted ? 'voted' : ''}`} 
                onClick={() => handleToggleVote(feature._id)}
              >
                <ArrowUp size={12} /> <span>{feature.totalVotes}</span>
              </button>
              {user?.role === 'admin' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleEditPending(feature)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '11px', cursor: 'pointer', opacity: 0.7, textDecoration: 'underline' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(feature._id, false)}
                    style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: '11px', cursor: 'pointer', opacity: 0.7, textDecoration: 'underline' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section className="road-hero section">
        <div className="road-orb"></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label">Roadmap</div>
          <h1 className="section-title">What we're building<br /><span className="gold-text">next.</span></h1>
          <p className="section-desc">Vote on features you want most. We ship based on what matters to you.</p>
          <div className="filters">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All features</button>
            <button className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`} onClick={() => setFilter('shipped')}>✓ Shipped</button>
            <button className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`} onClick={() => setFilter('in-progress')}>⚡ In Progress</button>
            <button className={`filter-btn ${filter === 'planned' ? 'active' : ''}`} onClick={() => setFilter('planned')}>📋 Planned</button>
            <button className={`filter-btn ${filter === 'ideas' ? 'active' : ''}`} onClick={() => setFilter('ideas')}>💡 Ideas</button>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="road-layout">
          <div className="road-sidebar">
            <button className={`road-nav-item ${filter === 'shipped' ? 'active' : ''}`} onClick={() => { setFilter('all'); scrollTo('shipped'); }}><div className="road-nav-dot" style={{ background: 'var(--green)' }}></div>Shipped</button>
            <button className={`road-nav-item ${filter === 'in-progress' ? 'active' : ''}`} onClick={() => { setFilter('all'); scrollTo('in-progress'); }}><div className="road-nav-dot" style={{ background: 'var(--gold)' }}></div>In Progress</button>
            <button className={`road-nav-item ${filter === 'planned' ? 'active' : ''}`} onClick={() => { setFilter('all'); scrollTo('planned'); }}><div className="road-nav-dot" style={{ background: 'var(--purple-2)' }}></div>Planned</button>
            <button className={`road-nav-item ${filter === 'ideas' ? 'active' : ''}`} onClick={() => { setFilter('all'); scrollTo('ideas'); }}><div className="road-nav-dot" style={{ background: 'var(--text-4)' }}></div>Ideas</button>
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-3)', marginBottom: '6px' }}>LAST UPDATED</div>
              <div style={{ fontSize: '14px', color: 'var(--text-2)', textTransform: 'capitalize' }}>{getLastUpdated()}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-4)', marginTop: '4px' }}>v0.9.4 current</div>
            </div>
          </div>

          <div>
            {user?.role === 'admin' && (
              <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn-outline" onClick={loadPending}>
                  Review Suggestions
                </button>
                <button className="btn-primary" onClick={() => setShowAdminModal(true)}>
                  <Plus size={16} style={{ marginRight: '8px' }} /> Add Official Feature
                </button>
              </div>
            )}

            {isLoading ? (
              <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-3)' }}>Loading roadmap...</div>
            ) : (
              <>
                {/* SHIPPED */}
                {isVisible('shipped') && (
                  <div className="road-section anim-fade-up" id="shipped">
                    <div className="road-section-hdr">
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }}></div>
                      <div className="road-section-title">Shipped</div><span className="tag green">Live</span>
                    </div>
                    {renderFeatures('shipped')}
                  </div>
                )}

                {/* IN PROGRESS */}
                {isVisible('in-progress') && (
                  <div className="road-section anim-fade-up" id="in-progress">
                    <div className="road-section-hdr">
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--gold)', animation: 'pulse-gold 2s infinite' }}></div>
                      <div className="road-section-title">In Progress</div><span className="tag gold">Active</span>
                    </div>
                    {renderFeatures('in-progress')}
                  </div>
                )}

                {/* PLANNED */}
                {isVisible('planned') && (
                  <div className="road-section anim-fade-up" id="planned">
                    <div className="road-section-hdr">
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--purple-2)' }}></div>
                      <div className="road-section-title">Planned</div><span className="tag">Upcoming</span>
                    </div>
                    {renderFeatures('planned')}
                  </div>
                )}

                {/* IDEAS */}
                {isVisible('ideas') && (
                  <div className="road-section anim-fade-up" id="ideas">
                    <div className="road-section-hdr">
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-4)' }}></div>
                      <div className="road-section-title">Ideas & Requests</div><span className="tag">Vote to prioritize</span>
                    </div>
                    {renderFeatures('ideas')}
                  </div>
                )}
              </>
            )}

            {/* SUGGEST */}
            <form className="suggest-box anim-fade-up" onSubmit={handleSubmitSuggestion}>
              <h3>💡 Suggest a feature</h3>
              <p>Missing something? Tell us what you'd like to see. We read every suggestion.</p>
              <div className="suggest-row">
                <div>
                  <label>Feature title</label>
                  <input 
                    className="input" 
                    type="text" 
                    placeholder="e.g. Network drive support" 
                    required 
                    value={suggestionTitle}
                    onChange={e => setSuggestionTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label>Category</label>
                  <CustomSelect 
                    name="category"
                    value={suggestionCategory}
                    onChange={(e) => setSuggestionCategory(e.target.value)}
                    options={[
                      'Search', 'UI / UX', 'File formats', 'Performance', 'Integrations', 'Other'
                    ]}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Description</label>
                <textarea 
                  className="input" 
                  rows="3" 
                  placeholder="Describe the feature and how you'd use it..." 
                  style={{ resize: 'vertical' }} 
                  required
                  value={suggestionDesc}
                  onChange={e => setSuggestionDesc(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? 'Submitting...' : 'Submit suggestion'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ADMIN MODAL */}
      {showAdminModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 101, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button 
              onClick={() => {
                setShowAdminModal(false);
                setEditingFeatureId(null);
              }}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--display)', fontSize: '20px' }}>
              {editingFeatureId ? 'Edit & Publish Feature' : 'Add Official Feature'}
            </h3>
            
            <form onSubmit={handleAdminSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input className="input" required value={adminForm.title} onChange={e => setAdminForm({...adminForm, title: e.target.value})} />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea className="input" rows="3" required value={adminForm.description} onChange={e => setAdminForm({...adminForm, description: e.target.value})}></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <CustomSelect 
                    name="status"
                    value={adminForm.status}
                    onChange={(e) => setAdminForm({...adminForm, status: e.target.value})}
                    options={[
                      { label: 'Ideas', value: 'ideas' },
                      { label: 'Planned', value: 'planned' },
                      { label: 'In Progress', value: 'in-progress' },
                      { label: 'Shipped', value: 'shipped' }
                    ]}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <CustomSelect 
                    name="category"
                    value={adminForm.category}
                    onChange={(e) => setAdminForm({...adminForm, category: e.target.value})}
                    options={['Search', 'UI / UX', 'File formats', 'Performance', 'Integrations', 'Other']}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Progress %</label>
                  <input type="number" className="input" min="0" max="100" value={adminForm.progress} onChange={e => setAdminForm({...adminForm, progress: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>ETA Tag (e.g. Q3 2026)</label>
                  <input type="text" className="input" value={adminForm.eta} onChange={e => setAdminForm({...adminForm, eta: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                {isSubmitting ? 'Saving...' : (editingFeatureId ? 'Publish' : 'Add Feature')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW SUGGESTIONS MODAL */}
      {showReviewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              onClick={() => setShowReviewModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--display)', fontSize: '20px' }}>Pending Suggestions</h3>
            
            {pendingFeatures.length === 0 ? (
              <p style={{ color: 'var(--text-3)' }}>No pending suggestions.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingFeatures.map(f => (
                  <div key={f._id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, color: 'var(--gold)' }}>{f.title}</h4>
                      <span className="tag">{f.category}</span>
                    </div>
                    <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-2)' }}>{f.description}</p>
                    <div style={{ fontSize: '12px', color: 'var(--text-4)', marginBottom: '16px' }}>
                      Suggested by: {f.author?.name || 'Unknown'} ({f.author?.email || 'Unknown'})
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-outline" onClick={() => handleEditPending(f)} style={{ padding: '4px 12px', fontSize: '13px' }}>Edit & Publish</button>
                      <button className="btn-ghost" onClick={() => handleDelete(f._id, true)} style={{ padding: '4px 12px', fontSize: '13px', color: 'var(--red)' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
