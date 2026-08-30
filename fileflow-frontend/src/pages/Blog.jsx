import React, { useState, useEffect } from 'react';
import { Search, FileText, Zap, Settings, Shield, BarChart, Award, ArrowLeft, Share, Link as LinkIcon, ArrowRight, Plus, Edit, Trash2, BookOpen, Activity, Terminal } from 'lucide-react';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuthStore } from '../store/useAuthStore';
import { getPosts, getPopularPosts, deletePost, getPostBySlug } from '../services/blog.service';
import { subscribeNewsletter } from '../services/form.service';
import BlogEditorModal from '../components/BlogEditorModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Loader from '../components/Loader';

const getCategoryIcon = (cat, size = 48) => {
  switch (cat) {
    case 'product': return <Zap size={size} opacity={0.5} />;
    case 'tutorial': return <BookOpen size={size} opacity={0.5} />;
    case 'productivity': return <Activity size={size} opacity={0.5} />;
    case 'build': return <Terminal size={size} opacity={0.5} />;
    default: return <FileText size={size} opacity={0.5} />;
  }
};

export default function Blog() {
  const { user } = useAuthStore();
  const [activeCat, setActiveCat] = useState('all');
  const [view, setView] = useState('list'); // 'list' or 'article'
  const [posts, setPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePost, setActivePost] = useState(null);
  const [email, setEmail] = useState('');
  
  // Admin states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    Promise.all([fetchPosts(), fetchPopular()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('post');
    if (postSlug && posts.length > 0 && !activePost) {
      const p = posts.find(post => post.slug === postSlug);
      if (p) {
        setActivePost(p);
        setView('article');
      }
    }
  }, [posts, activePost]);

  const handleCopyLink = () => {
    if (activePost) {
      const url = `${window.location.origin}/blog?post=${activePost.slug}`;
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await getPosts();
      setPosts(res || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPopular = async () => {
    try {
      const res = await getPopularPosts();
      setPopularPosts(res || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      await subscribeNewsletter(email);
      toast.success("Subscribed successfully!");
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || "Subscription failed");
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await deletePost(deleteConfirmId);
        toast.success("Post deleted");
        fetchPosts();
        if (activePost && activePost._id === deleteConfirmId) {
          hideArticle();
        }
      } catch (error) {
        toast.error("Failed to delete post");
      }
      setDeleteConfirmId(null);
    }
  };

  const handleEdit = (e, post) => {
    e.stopPropagation();
    setPostToEdit(post);
    setIsEditorOpen(true);
  };

  const openNewPost = () => {
    setPostToEdit(null);
    setIsEditorOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const showArticle = (post) => {
    setActivePost(post);
    setView('article');
    
    // Silently trigger a backend fetch to increment the view count
    getPostBySlug(post.slug).catch(() => {});

    const scrollTarget = document.getElementById('blog-content-start');
    if (scrollTarget) {
      const y = scrollTarget.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const hideArticle = () => {
    setView('list');
    setActivePost(null);
    const scrollTarget = document.getElementById('blog-content-start');
    if (scrollTarget) {
      const y = scrollTarget.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const featuredPost = posts.find(p => p.isFeatured);
  let regularPosts = featuredPost 
    ? posts.filter(p => p._id !== featuredPost._id)
    : posts;

  if (activeCat !== 'all') {
    regularPosts = regularPosts.filter(p => p.category === activeCat);
  }

  const uniqueCategories = [...new Set(posts.map(p => p.category))].filter(Boolean);

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'product': return 'Product Updates';
      case 'tutorial': return 'Tutorials';
      case 'productivity': return 'Productivity';
      case 'build': return 'Behind the build';
      default: return cat;
    }
  };

  return (
    <>
      <section className="blog-hero section">
        <div className="container relative">
          {user?.role === 'admin' && (
            <div className="absolute right-0 top-0 z-10">
              <button className="btn-primary" onClick={openNewPost}><Plus size={16} /> New Post</button>
            </div>
          )}
          <div className="section-label">Blog</div>
          <h1 className="section-title">Tips, updates &<br /><span className="gold-text">deep dives.</span></h1>
          <div className="blog-cats">
            <button className={`cat-btn ${activeCat === 'all' ? 'active' : ''}`} onClick={() => setActiveCat('all')}>All</button>
            {uniqueCategories.map(cat => (
              <button 
                key={cat} 
                className={`cat-btn ${activeCat === cat ? 'active' : ''}`} 
                onClick={() => setActiveCat(cat)}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container" id="blog-content-start">
        {isLoading ? (
          <div style={{ padding: '8rem 0' }}>
            <Loader size="lg" />
          </div>
        ) : (
          <>
            {/* LIST VIEW */}
            <div className={`list-view view-transition ${view === 'article' ? 'view-hidden' : 'view-active'}`}>
              <div className="blog-layout">
                  <div className="blog-main">
                    
                    {featuredPost && (
                  <div className="featured-post anim-slide-up" onClick={() => showArticle(featuredPost)}>
                    {featuredPost.thumbnailUrl ? (
                      <div className="featured-bg" style={{ backgroundImage: `url(${featuredPost.thumbnailUrl})` }}></div>
                    ) : (
                      <div className="featured-bg mesh-bg"></div>
                    )}
                    <div className="featured-overlay"></div>
                    <div className="featured-content relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="featured-tag">{featuredPost.category === 'tutorial' ? 'Tutorial' : featuredPost.category === 'productivity' ? 'Productivity' : featuredPost.category === 'build' ? 'Behind the build' : 'Product Update'}</span>
                        <span className="featured-read">{featuredPost.readTime} min read</span>
                      </div>
                      <h2 className="featured-body-title">{featuredPost.title}</h2>
                      <p className="featured-body-excerpt">{featuredPost.excerpt}</p>
                      
                      <div className="flex items-center gap-3 mt-8">
                        <div className="article-avatar">FF</div>
                        <div>
                          <div className="text-[var(--text)] font-semibold font-display">FileFlow Team</div>
                          <div className="text-[var(--gold)] text-xs font-mono">file-flow.com</div>
                        </div>
                      </div>

                      {user?.role === 'admin' && (
                        <div className="flex gap-2 mt-6">
                          <button className="meta-btn" onClick={(e) => handleEdit(e, featuredPost)}><Edit size={14} /> Edit</button>
                          <button className="meta-btn delete" onClick={(e) => handleDelete(e, featuredPost._id)}><Trash2 size={14} /> Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="posts-grid">
                  {regularPosts.map((post, idx) => (
                    <div key={post._id} className="post-card anim-slide-up" onClick={() => showArticle(post)} style={{animationDelay: `${idx * 0.1}s`}}>
                      <div className={`post-thumb cat-${post.category}`} style={post.thumbnailUrl ? { backgroundImage: `url(${post.thumbnailUrl})` } : {}}>
                        {!post.thumbnailUrl && getCategoryIcon(post.category, 48)}
                      </div>
                      <div className="post-body">
                        <div className="post-meta">
                          <span className="tag">
                            {post.category === 'tutorial' ? 'Tutorial' : post.category === 'productivity' ? 'Productivity' : post.category === 'build' ? 'Behind the build' : 'Product'}
                          </span>
                          <span className="post-read">{post.readTime} min read</span>
                        </div>
                        <div className="post-title">{post.title}</div>
                        <div className="post-excerpt">{post.excerpt}</div>
                        
                        {user?.role === 'admin' && (
                          <div className="flex gap-2 admin-actions">
                            <button className="btn-outline btn-small" onClick={(e) => handleEdit(e, post)}><Edit size={12} /> Edit</button>
                            <button className="btn-outline btn-small tag-delete" onClick={(e) => handleDelete(e, post._id)}><Trash2 size={12} /> Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {posts.length === 0 && (
                    <div className="empty-state">
                      No posts published yet.
                    </div>
                  )}
                </div>
              </div>

            {/* Sidebar */}
            <div className="blog-sidebar">
              <div className="sidebar-box">
                <h4>Newsletter</h4>
                <p className="newsletter-desc">Get new posts in your inbox. No spam, ever.</p>
                <form className="sidebar-input-row" onSubmit={handleNewsletterSubmit}>
                  <input className="input newsletter-input" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <button type="submit"><ArrowRight size={14} /></button>
                </form>
              </div>
              <div className="sidebar-box">
                <h4>Popular posts</h4>
                {popularPosts.map((pop, index) => (
                  <div className="pop-post" key={pop._id} onClick={() => showArticle(pop)}>
                    <span className="pop-num">0{index + 1}</span>
                    <span className="pop-title">{pop.title}</span>
                  </div>
                ))}
              </div>
              <div className="sidebar-box">
                <h4>Topics</h4>
                <div className="tags-cloud">
                  {uniqueCategories.map(cat => (
                    <span 
                      key={cat} 
                      className={`tag cursor-pointer ${activeCat === cat ? 'gold' : ''}`} 
                      onClick={() => {
                        setActiveCat(activeCat === cat ? 'all' : cat);
                        window.scrollTo({ top: document.getElementById('blog-content-start').offsetTop - 80, behavior: 'smooth' });
                      }}
                    >
                      {getCategoryLabel(cat)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ARTICLE VIEW */}
        <div className={`article-view view-transition ${view === 'article' && activePost ? 'view-active' : 'view-hidden'}`}>
          {activePost && (
            <div className="grid md:grid-cols-[1fr_300px] gap-12 items-start article-layout">
              <div className="anim-slide-up">
                <div className="article-back" onClick={hideArticle}><ArrowLeft size={16} /> Back to blog</div>
                <div className="article-hdr">
                  <div className="post-meta">
                    <span className="tag gold">{activePost.category}</span>
                    <span className="post-date">{formatDate(activePost.createdAt)}</span>
                    <span className="post-read">{activePost.readTime} min read</span>
                  </div>
                  <h1 className="article-title">{activePost.title}</h1>
                  <div className="article-meta flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="article-avatar">FF</div>
                      <div>
                        <div className="article-author-name">{activePost.author}</div>
                        <div className="article-author-domain">file-flow.com</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {user?.role === 'admin' && (
                        <>
                          <button className="meta-btn" onClick={(e) => handleEdit(e, activePost)}><Edit size={14} /> Edit</button>
                          <button className="meta-btn delete" onClick={(e) => handleDelete(e, activePost._id)}><Trash2 size={14} /> Delete</button>
                        </>
                      )}
                      <button className="meta-btn" onClick={handleCopyLink}><LinkIcon size={14} /> Copy link</button>
                    </div>
                  </div>
                </div>
                <div className="article-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activePost.content}
                  </ReactMarkdown>
                </div>
              </div>
              
              <div className="blog-sidebar sticky top-24 anim-fade-in delay-100">
                <div className="sidebar-box">
                  <h4>Newsletter</h4>
                  <p className="newsletter-desc">Get new posts in your inbox.</p>
                  <form className="sidebar-input-row" onSubmit={handleNewsletterSubmit}>
                    <input className="input newsletter-input" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <button type="submit"><ArrowRight size={14} /></button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
          </>
        )}
      </div>
      
      {isEditorOpen && (
        <BlogEditorModal 
          post={postToEdit} 
          onClose={() => setIsEditorOpen(false)} 
          onSuccess={() => { setIsEditorOpen(false); fetchPosts(); fetchPopular(); }} 
        />
      )}

      {deleteConfirmId && (
        <ConfirmDeleteModal 
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </>
  );
}
