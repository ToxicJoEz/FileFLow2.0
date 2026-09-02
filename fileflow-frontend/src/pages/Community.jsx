import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Bug, Rocket, HelpCircle, ArrowUp, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/useAuthStore';
import * as communityService from '../services/community.service';
import Loader from '../components/Loader';
import NewThreadModal from '../components/NewThreadModal';

export const categoryConfig = {
  tips: { icon: <Lightbulb size={22} color="var(--gold)" />, name: 'Tips & Tricks', desc: 'Search techniques and workflow ideas', bg: 'var(--gold-dim)' },
  bugs: { icon: <Bug size={22} color="#f87171" />, name: 'Bug Reports', desc: 'Found something broken? Report it here', bg: 'var(--red-dim)' },
  features: { icon: <Rocket size={22} color="var(--purple-3)" />, name: 'Feature Requests', desc: 'What should we build next?', bg: 'var(--purple-dim)' },
  help: { icon: <HelpCircle size={22} color="var(--green)" />, name: 'Help & Support', desc: 'Installation, settings, and how-tos', bg: 'var(--green-dim)' },
};

export default function Community() {
  const [stats, setStats] = useState({ members: 0, topics: 0, replies: 0 });
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewThread, setShowNewThread] = useState(false);
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const activeCategory = searchParams.get('category') || 'all';
  const activeSort = searchParams.get('sort') || 'latest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    fetchStats();
    fetchTopics();
  }, [activeCategory, activeSort, page]);

  const fetchStats = async () => {
    try {
      const data = await communityService.getCommunityStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const data = await communityService.getTopics({
        category: activeCategory,
        sort: activeSort,
        page
      });
      setTopics(data.topics || []);
    } catch (err) {
      toast.error('Failed to load community topics');
    } finally {
      setLoading(false);
    }
  };

  const setCategory = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const setSort = (sort) => {
    const newParams = new URLSearchParams(searchParams);
    if (sort === 'latest') {
      newParams.delete('sort');
    } else {
      newParams.set('sort', sort);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleVote = async (e, topic) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please log in to vote');
      navigate('/login', { state: { from: '/community' } });
      return;
    }

    try {
      // Optimistic update
      const isVoted = topic.upvotes.includes(user._id);
      setTopics(prev => prev.map(t => {
        if (t._id === topic._id) {
          const newUpvotes = isVoted
            ? t.upvotes.filter(id => id !== user._id)
            : [...t.upvotes, user._id];
          return { ...t, upvotes: newUpvotes, upvoteCount: newUpvotes.length };
        }
        return t;
      }));

      await communityService.voteTopic(topic._id);
    } catch (err) {
      toast.error('Failed to vote');
      fetchTopics(); // revert on fail
    }
  };

  const handleCreateThread = () => {
    if (!isAuthenticated) {
      toast.info('Please log in to start a thread');
      navigate('/login', { state: { from: '/community' } });
      return;
    }
    setShowNewThread(true);
  };

  const onThreadCreated = (newTopic) => {
    setShowNewThread(false);
    toast.success('Thread created successfully');
    navigate(`/community/${newTopic._id}`);
  };

  return (
    <>
      <section className="comm-hero section">
        <div className="container">
          <div className="section-label">Community</div>
          <h1 className="section-title">Ask, share, and<br /><span className="gold-text">help each other.</span></h1>
          <p className="section-desc">Join thousands of FileFlow users discussing tips, reporting bugs, and voting on the next features.</p>
          <div className="comm-stats anim-fade-up">
            <div className="comm-stat"><div className="comm-stat-n">{stats.members}</div><div className="comm-stat-l">Members</div></div>
            <div className="comm-stat"><div className="comm-stat-n">{stats.topics}</div><div className="comm-stat-l">Threads</div></div>
            <div className="comm-stat"><div className="comm-stat-n">{stats.online || 1}</div><div className="comm-stat-l">Online now</div></div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="list-view" id="list-view">
          <div className="community-feed-wrapper">
            <div className="cats-grid anim-fade-up">
              <div 
                className={`cat-card ${activeCategory === 'all' ? 'active-cat border-[var(--gold)]' : ''}`}
                onClick={() => setCategory('all')}
              >
                <div className="cat-icon cat-all">
                  <MessageSquare size={18} />
                </div>
                <div className="cat-name">All Topics</div>
              </div>
              {Object.entries(categoryConfig).map(([key, conf]) => (
                <div 
                  key={key} 
                  className={`cat-card ${activeCategory === key ? 'active-cat border-[var(--gold)]' : ''}`}
                  onClick={() => setCategory(activeCategory === key ? 'all' : key)}
                >
                  <div className={`cat-icon cat-${key}`}>{conf.icon}</div>
                  <div className="cat-name">{conf.name}</div>
                </div>
              ))}
            </div>

            <div className="comm-layout">
              <div>
                <div className="threads-hdr flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3>{activeCategory !== 'all' ? categoryConfig[activeCategory].name : 'All discussions'}</h3>
                    {activeCategory !== 'all' && (
                      <button 
                        className="btn-outline btn-sm flex items-center gap-1.5" 
                        onClick={() => setCategory('all')}
                      >
                        ✕ Show all topics
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="sort-btns">
                      {['all', 'latest', 'top'].map(sort => (
                        <button 
                          key={sort} 
                          className={`sort-btn capitalize-text ${activeSort === sort ? 'active' : ''}`} 
                          onClick={() => setSort(sort)}
                        >
                          {sort}
                        </button>
                      ))}
                    </div>
                    <button className="btn-primary btn-sm" onClick={handleCreateThread}>+ New thread</button>
                  </div>
                </div>
                
                <div className="thread-list relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={loading ? 'loading' : `loaded-${activeCategory}-${activeSort}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-2 w-full"
                    >
                      {loading ? (
                        <div className="empty-state"><Loader size="md" /></div>
                      ) : topics.length === 0 ? (
                        <div className="empty-state">
                          No threads found in this category.
                        </div>
                      ) : (
                        topics.map((topic) => (
                          <div className={`thread ${topic.isPinned ? 'pinned' : ''}`} key={topic._id} onClick={() => navigate(`/community/${topic._id}`)}>
                            <div className="thread-votes">
                              <button 
                                className={`t-vote-btn ${user && topic.upvotes.includes(user._id) ? 'voted' : ''}`} 
                                onClick={(e) => handleVote(e, topic)}
                              >
                                <ArrowUp size={10} />
                              </button>
                              <span className="t-vote-count">{topic.upvoteCount || topic.upvotes.length}</span>
                            </div>
                            <div className="thread-body">
                              <div className="thread-title">
                                {topic.isPinned && <span className="pin-icon">📌 </span>}
                                {topic.title}
                              </div>
                              <div className="thread-excerpt">
                                {/* Simple text extraction for excerpt */}
                                {topic.content.replace(/[#_*\[\]]/g, '').substring(0, 150)}...
                              </div>
                              <div className="thread-meta">
                                <span className={`tag tag-${topic.category}`}>{categoryConfig[topic.category]?.name || topic.category}</span>
                                <span className="thread-author">by {topic.author?.name}</span>
                                <span className="thread-replies">💬 {topic.replyCount || 0} replies</span>
                                <span className="thread-time">{new Date(topic.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Sidebar */}
              <div className="comm-sidebar">
                <div className="flex flex-col gap-2">
                  {!isAuthenticated && (
                    <Link to="/beta" className="btn-primary flex justify-center">Join FileFlow free</Link>
                  )}
                  <button className="btn-ghost flex justify-center" onClick={handleCreateThread}>+ Start a thread</button>
                </div>
                
                <div className="sidebar-box">
                  <h4>📋 Community rules</h4>
                  <div className="rule"><span className="rule-n">01</span>Be respectful and constructive</div>
                  <div className="rule"><span className="rule-n">02</span>Search before posting — avoid duplicates</div>
                  <div className="rule"><span className="rule-n">03</span>Use the right category</div>
                  <div className="rule"><span className="rule-n">04</span>No spam or self-promotion</div>
                  <div className="rule"><span className="rule-n">05</span>Bug reports need version number & OS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNewThread && (
        <NewThreadModal 
          onClose={() => setShowNewThread(false)} 
          onSuccess={onThreadCreated} 
        />
      )}
    </>
  );
}
