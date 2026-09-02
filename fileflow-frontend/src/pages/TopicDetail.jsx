import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowUp, MoreHorizontal, Trash, Edit2, Share2, 
  ChevronRight, ShieldCheck, MessageSquare, Eye, Sparkles, Pin, PinOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import { avatarUrl } from '../utils/avatarUrl';
import remarkGfm from 'remark-gfm';
import * as communityService from '../services/community.service';
import { useAuthStore } from '../store/useAuthStore';
import Loader from '../components/Loader';
import EditPostModal from '../components/EditPostModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import UserCardModal from '../components/UserCardModal';
import { categoryConfig } from './Community';

export default function TopicDetail() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [replying, setReplying] = useState(false);
  const [editorTab, setEditorTab] = useState('write'); // 'write' | 'preview'
  
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchTopicData();
    
    const closeMenu = () => setActiveMenuId(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [topicId]);

  const fetchTopicData = async () => {
    setLoading(true);
    try {
      const [topicData, repliesData] = await Promise.all([
        communityService.getTopicById(topicId),
        communityService.getReplies(topicId)
      ]);
      setTopic(topicData);
      setReplies(repliesData);
    } catch (err) {
      toast.error('Discussion not found');
      navigate('/community');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteTopic = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return navigate('/login', { state: { from: `/community/${topicId}` } });

    try {
      const isVoted = topic.upvotes.includes(user._id);
      setTopic(prev => ({
        ...prev,
        upvotes: isVoted ? prev.upvotes.filter(id => id !== user._id) : [...prev.upvotes, user._id],
        upvoteCount: isVoted ? prev.upvoteCount - 1 : prev.upvoteCount + 1
      }));
      await communityService.voteTopic(topicId);
    } catch (err) {
      toast.error('Vote failed');
      fetchTopicData();
    }
  };

  const handleVoteReply = async (e, replyId) => {
    e.stopPropagation();
    if (!isAuthenticated) return navigate('/login', { state: { from: `/community/${topicId}` } });

    try {
      setReplies(prev => prev.map(r => {
        if (r._id === replyId) {
          const isVoted = r.upvotes.includes(user._id);
          const newUpvotes = isVoted ? r.upvotes.filter(id => id !== user._id) : [...r.upvotes, user._id];
          return { ...r, upvotes: newUpvotes, upvoteCount: newUpvotes.length };
        }
        return r;
      }));
      await communityService.voteReply(replyId);
    } catch (err) {
      toast.error('Vote failed');
      fetchTopicData();
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate('/login', { state: { from: `/community/${topicId}` } });
    if (!replyContent.trim()) return;

    setReplying(true);
    try {
      const newReply = await communityService.createReply(topicId, replyContent);
      setReplies(prev => [...prev, newReply]);
      setTopic(prev => ({ ...prev, replyCount: (prev.replyCount || 0) + 1 }));
      setReplyContent('');
      setEditorTab('write');
      toast.success("Reply posted!");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post reply');
    } finally {
      setReplying(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const executeDelete = async () => {
    if (deleteTarget === 'topic') {
      try {
        await communityService.deleteTopic(topicId);
        toast.success('Discussion deleted');
        navigate('/community');
      } catch (err) {
        toast.error('Failed to delete');
      }
    } else if (deleteTarget) {
      try {
        await communityService.deleteReply(deleteTarget);
        setReplies(prev => prev.filter(r => r._id !== deleteTarget));
        setTopic(prev => ({ ...prev, replyCount: Math.max(0, (prev.replyCount || 1) - 1) }));
        toast.success('Reply deleted');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
    setDeleteTarget(null);
  };

  const openEdit = (post, isReply) => {
    setPostToEdit({ post, isReply });
    setEditModalOpen(true);
  };

  const onEditSuccess = (updated) => {
    if (postToEdit.isReply) {
      setReplies(prev => prev.map(r => r._id === updated._id ? updated : r));
    } else {
      setTopic(updated);
    }
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const canModify = (post) => {
    if (!isAuthenticated || !user) return false;
    if (user.role === 'admin') return true;
    return post.author?._id === user._id;
  };

  if (loading) {
    return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader /></div>;
  }
  if (!topic) return null;

  const handleTogglePin = async () => {
    try {
      const updated = await communityService.togglePinTopic(topicId);
      setTopic(updated);
      toast.success(updated.isPinned ? 'Discussion pinned (top 3)' : 'Discussion unpinned');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle pin state');
    }
  };

  // Render dropdown menu for OP or Reply
  const renderOptionsMenu = (target, isReply) => {
    const isTopic = !isReply;
    const canEditOrDelete = canModify(target);
    const isAdmin = isAuthenticated && user?.role === 'admin';

    if (!canEditOrDelete && !(isTopic && isAdmin)) return null;
    const targetId = isReply ? target._id : 'topic';
    return (
      <div className="absolute top-4 right-4">
        <button className="t-vote-btn border-none" onClick={(e) => toggleMenu(e, targetId)}>
          <MoreHorizontal size={16} />
        </button>
        {activeMenuId === targetId && (
          <div className="dropdown-menu">
            {isTopic && isAdmin && (
              <button onClick={handleTogglePin} className="dropdown-item">
                {topic.isPinned ? <PinOff size={14}/> : <Pin size={14}/>} {topic.isPinned ? 'Unpin thread' : 'Pin thread (max 3)'}
              </button>
            )}
            {canEditOrDelete && (
              <>
                <button onClick={() => openEdit(target, isReply)} className="dropdown-item"><Edit2 size={14}/> Edit</button>
                <button onClick={() => setDeleteTarget(targetId)} className="dropdown-item danger"><Trash size={14}/> Delete</button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container pb-24">
      <div className="thread-view active">
        
        {/* Back Link */}
        <div className="article-back-link mb-6" onClick={() => navigate('/community')}>
          <ArrowLeft size={16} /> Back to forum
        </div>

        {/* ── 2-COLUMN MAIN DISCUSSION & CONTEXTUAL SIDEBAR (VARIANT B) ── */}
        <div className="detail-grid-layout">
          <div>
            {/* Thread Header */}
            <div className="mb-6">
              <div className="topic-header-tags flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`tag tag-${topic.category} capitalize`}>{categoryConfig[topic.category]?.name || topic.category}</span>
                  {topic.isPinned && <span className="tag gold">📌 Pinned</span>}
                </div>
                <button onClick={handleShare} className="btn-ghost btn-sm flex items-center gap-1.5 text-xs">
                  <Share2 size={13} /> Share
                </button>
              </div>
              <h1 className="topic-header-title text-2xl md:text-4xl leading-tight">{topic.title}</h1>
            </div>

            {/* Premium OP Hero Card */}
            <div className="op-hero-card relative" style={{ borderTopColor: topic.author?.accentColor || 'var(--purple)' }}>
              {renderOptionsMenu(topic, false)}
              
              <div className="op-hero-card-header">
                <div className="reply-author">
                  <div 
                    className="reply-av" 
                    style={{ 
                      cursor: 'pointer', 
                      background: topic.author?.hasAvatar ? `url(${avatarUrl(topic.author._id, topic.author.avatarVersion || 0)}) center/cover no-repeat` : (topic.author?.accentColor || 'var(--gold-dim)'), 
                      color: topic.author?.accentColor ? '#fff' : 'var(--gold)',
                      border: `2px solid ${topic.author?.accentColor || 'transparent'}`
                    }}
                    onClick={() => setSelectedUser(topic.author)}
                  >
                    {!topic.author?.hasAvatar && (topic.author?.name ? topic.author.name.substring(0, 2).toUpperCase() : '??')}
                  </div>
                  <div>
                    <div 
                      className="reply-name flex items-center gap-2" 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => setSelectedUser(topic.author)}
                    >
                      {topic.author?.name} 
                      <span className="tag gold text-[10px]">Author</span>
                      {topic.author?.role === 'admin' && <span className="tag green text-[10px]">Staff</span>}
                    </div>
                    <div className="reply-meta">Original Post · {new Date(topic.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mr-8">
                  <button 
                    className={`vote-btn ${user && topic.upvotes.includes(user._id) ? 'voted' : ''}`} 
                    onClick={handleVoteTopic}
                  >
                    <ArrowUp size={14} /> Upvote ({topic.upvoteCount || topic.upvotes.length})
                  </button>
                </div>
              </div>

              <div className="reply-body article-body text-base leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{topic.content}</ReactMarkdown>
              </div>
            </div>

            {/* Replies Stream */}
            <div className="mt-8">
              <h4 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
                Discussion Activity <span className="tag">{replies.length}</span>
              </h4>

              {replies.length === 0 ? (
                <div className="empty-state">No replies yet. Be the first to join the conversation!</div>
              ) : (
                replies.map((reply) => (
                  <div className="reply-card relative" key={reply._id}>
                    {renderOptionsMenu(reply, true)}
                    
                    {/* Reply Header with Far-Right Upvote Button */}
                    <div className="flex items-center justify-between mb-3 pr-8">
                      <div className="reply-author">
                        <div 
                          className="reply-av" 
                          style={{ 
                            cursor: 'pointer', 
                            background: reply.author?.hasAvatar ? `url(${avatarUrl(reply.author._id, reply.author.avatarVersion || 0)}) center/cover no-repeat` : (reply.author?.accentColor || 'var(--bg-3)'), 
                            color: reply.author?.accentColor ? '#fff' : 'var(--text-3)',
                            border: `2px solid ${reply.author?.accentColor || 'transparent'}`
                          }}
                          onClick={() => setSelectedUser(reply.author)}
                        >
                          {!reply.author?.hasAvatar && (reply.author?.name ? reply.author.name.substring(0, 2).toUpperCase() : '??')}
                        </div>
                        <div>
                          <div 
                            className="reply-name flex items-center gap-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedUser(reply.author)}
                          >
                            {reply.author?.name}
                            {reply.author?._id === topic.author?._id && <span className="tag gold text-[10px]">Author</span>}
                            {reply.author?.role === 'admin' && <span className="tag green text-[10px]">Staff</span>}
                          </div>
                          <div className="reply-meta">{new Date(reply.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <button 
                        className={`vote-btn text-xs flex items-center gap-1.5 ${user && reply.upvotes.includes(user._id) ? 'voted' : ''}`} 
                        onClick={(e) => handleVoteReply(e, reply._id)}
                      >
                        <ArrowUp size={13} /> {reply.upvoteCount || reply.upvotes.length}
                      </button>
                    </div>

                    <div className="reply-body article-body pl-1">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{reply.content}</ReactMarkdown>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Interactive Markdown Reply Box */}
            <div className="reply-box mt-8">
              <div className="flex items-center justify-between mb-3">
                <h4>Reply to this thread</h4>
                {isAuthenticated && (
                  <div className="editor-tabs">
                    <button 
                      type="button"
                      className={`editor-tab-btn ${editorTab === 'write' ? 'active' : ''}`}
                      onClick={() => setEditorTab('write')}
                    >
                      Write
                    </button>
                    <button 
                      type="button"
                      className={`editor-tab-btn ${editorTab === 'preview' ? 'active' : ''}`}
                      onClick={() => setEditorTab('preview')}
                    >
                      Preview
                    </button>
                  </div>
                )}
              </div>
              
              {isAuthenticated ? (
                <form onSubmit={handlePostReply}>
                  {editorTab === 'write' ? (
                    <textarea 
                      className="input resize-y mb-3 w-full p-4 font-sans text-sm" 
                      rows={5} 
                      placeholder="Write your response... Markdown formatting is supported (e.g. `code`, **bold**, - lists)" 
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      required
                    />
                  ) : (
                    <div className="editor-preview-box article-body">
                      {replyContent.trim() ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{replyContent}</ReactMarkdown>
                      ) : (
                        <span className="text-[var(--text-4)] italic">Nothing to preview yet. Start typing in the Write tab!</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[var(--text-4)] font-mono">
                      ⚡ Markdown enabled
                    </div>
                    <button type="submit" className="btn-primary btn-sm" disabled={replying || !replyContent.trim()}>
                      {replying ? <Loader size="sm" /> : 'Post reply'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="reply-auth-prompt">
                  <p>You must be logged in to participate and reply to this discussion.</p>
                  <button className="btn-primary" onClick={() => navigate('/login', { state: { from: `/community/${topicId}` } })}>Log in to reply</button>
                </div>
              )}
            </div>
          </div>

          {/* Right Contextual Sidebar */}
          <div className="detail-sidebar">
            {/* Live Author Profile Widget */}
            <div className="author-card-widget">
              <div className="text-xs uppercase font-mono text-[var(--text-3)]">Original Author</div>
              <div className="author-widget-header">
                <div 
                  className="author-widget-av"
                  style={{ 
                    cursor: 'pointer', 
                    background: topic.author?.hasAvatar ? `url(${avatarUrl(topic.author._id, topic.author.avatarVersion || 0)}) center/cover no-repeat` : (topic.author?.accentColor || 'var(--purple)'), 
                    color: '#fff',
                    border: `2px solid ${topic.author?.accentColor || 'transparent'}`
                  }}
                  onClick={() => setSelectedUser(topic.author)}
                >
                  {!topic.author?.hasAvatar && (topic.author?.name ? topic.author.name.substring(0, 2).toUpperCase() : '??')}
                </div>
                <div>
                  <div 
                    className="font-semibold text-[var(--text)]"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedUser(topic.author)}
                  >
                    {topic.author?.name}
                  </div>
                  <div className="text-xs text-[var(--text-3)] capitalize">{topic.author?.role || 'Member'}</div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)] text-xs text-[var(--text-3)]">
                <div className="flex items-center justify-between">
                  <span>Threads Created</span>
                  <span className="text-[var(--text)] font-mono font-semibold">{topic.author?.threadsCount || 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Member Since</span>
                  <span className="text-[var(--text)] font-mono">
                    {topic.author?.createdAt ? new Date(topic.author.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '2026'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-[var(--text-3)] flex items-center gap-1.5 pt-1">
                <ShieldCheck size={14} className="text-[var(--gold)]" /> Verified Community Member
              </div>
            </div>

            {/* Live Thread Metrics Widget */}
            <div className="meta-stats-widget">
              <div className="text-xs uppercase font-mono text-[var(--text-3)] mb-1">Thread Details</div>
              <div className="meta-stat-row">
                <span>Category</span>
                <span className="meta-stat-val capitalize">{categoryConfig[topic.category]?.name || topic.category}</span>
              </div>
              <div className="meta-stat-row">
                <span>Replies</span>
                <span className="meta-stat-val">{topic.replyCount || 0}</span>
              </div>
              <div className="meta-stat-row">
                <span>Views</span>
                <span className="meta-stat-val">{topic.views || 1}</span>
              </div>
              <div className="meta-stat-row">
                <span>Upvotes</span>
                <span className="meta-stat-val">{topic.upvoteCount || topic.upvotes?.length || 0}</span>
              </div>
              <div className="meta-stat-row">
                <span>Created</span>
                <span className="meta-stat-val">{new Date(topic.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Share CTA */}
            <button onClick={handleShare} className="btn-outline w-full justify-center text-xs">
              <Share2 size={14} /> Copy Discussion Link
            </button>
          </div>
        </div>

      </div>
      
      {/* Modals */}
      {editModalOpen && postToEdit && (
        <EditPostModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          post={postToEdit.post}
          isReply={postToEdit.isReply}
          onSuccess={onEditSuccess}
        />
      )}
      
      {deleteTarget && (
        <ConfirmDeleteModal
          onConfirm={executeDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* User Card Modal */}
      {selectedUser && (
        <UserCardModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
}
