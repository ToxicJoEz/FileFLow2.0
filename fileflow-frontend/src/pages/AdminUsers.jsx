import React, { useState, useEffect, useCallback } from 'react';
import { Search, User as UserIcon, Calendar, MapPin, ArrowUpDown, RefreshCw, ExternalLink, ChevronLeft, ChevronRight, Ban, Trash2, Undo2, Edit3, ShieldAlert } from 'lucide-react';
import { getAllUsersAdmin, toggleBanUser, toggleSoftDeleteUser } from '../services/user.service';
import AdminUserActionModal from '../components/AdminUserActionModal';
import AdminEditUserModal from '../components/AdminEditUserModal';
import CustomSelect from '../components/CustomSelect';
import { toast } from 'react-toastify';
import { avatarUrl } from '../utils/avatarUrl';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 12 });
  
  // Modals state
  const [editUser, setEditUser] = useState(null);
  const [actionModal, setActionModal] = useState({ isOpen: false, user: null, type: null });
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUsersAdmin({
        search,
        role: roleFilter,
        status: statusFilter,
        sort: sortBy,
        page,
        limit: 12
      });
      if (res?.success) {
        setUsers(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, sortBy, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleRoleChange = (role) => {
    setRoleFilter(role);
    setPage(1);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const openActionModal = (e, u, type) => {
    e.stopPropagation();
    setActionModal({ isOpen: true, user: u, type });
  };

  const closeActionModal = () => {
    setActionModal({ isOpen: false, user: null, type: null });
  };

  const handleConfirmAction = async ({ reason, deleteThreads, deleteReplies }) => {
    const { user: targetUser, type } = actionModal;
    if (!targetUser) return;

    setActionLoading(targetUser._id);
    closeActionModal();

    try {
      if (type === 'ban' || type === 'unban') {
        const res = await toggleBanUser(targetUser._id, reason, deleteThreads, deleteReplies);
        if (res?.success) {
          toast.success(res.data.isBanned ? `User ${targetUser.name} has been banned` : `User ${targetUser.name} has been unbanned`);
          setUsers(prev => prev.map(item => item._id === targetUser._id ? { ...item, isBanned: res.data.isBanned, banReason: res.data.banReason } : item));
        }
      } else if (type === 'delete' || type === 'restore') {
        const res = await toggleSoftDeleteUser(targetUser._id, deleteThreads, deleteReplies);
        if (res?.success) {
          toast.success(res.data.isDeleted ? `User ${targetUser.name} marked as deleted` : `User ${targetUser.name} restored successfully`);
          setUsers(prev => prev.map(item => item._id === targetUser._id ? { ...item, isDeleted: res.data.isDeleted } : item));
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(prev => prev.map(u => u._id === updatedUser._id ? { ...u, ...updatedUser } : u));
    if (editUser?._id === updatedUser._id) {
      setEditUser(prev => ({ ...prev, ...updatedUser }));
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="admin-users-page anim-fade-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tag gold" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Admin Panel
            </span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text-3)' }}>
              {pagination.total} Total Users
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: '26px', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>
            User Management
          </h1>
        </div>

        <button 
          onClick={fetchUsers}
          className="btn-ghost"
          style={{ fontSize: '12px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          disabled={loading}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Control Bar: Search, Filters & Sorting */}
      <div className="info-box" style={{ padding: '16px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '220px' }}>
            <Search size={16} color="var(--text-4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Search by ID, name, @handle, email, location..." 
              value={search}
              onChange={handleSearchChange}
              style={{ paddingLeft: '38px', width: '100%', fontSize: '13px' }}
            />
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            {[
              { id: 'all', label: 'All Status' },
              { id: 'active', label: 'Active' },
              { id: 'banned', label: 'Banned' },
              { id: 'deleted', label: 'Deleted' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleStatusChange(tab.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  background: statusFilter === tab.id ? (tab.id === 'banned' ? 'var(--red)' : tab.id === 'deleted' ? 'var(--bg-3)' : 'var(--purple)') : 'transparent',
                  color: statusFilter === tab.id ? '#fff' : 'var(--text-3)',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Role Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            {[
              { id: 'all', label: 'All Roles' },
              { id: 'admin', label: 'Admins' },
              { id: 'user', label: 'Members' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleRoleChange(tab.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  background: roleFilter === tab.id ? 'var(--purple)' : 'transparent',
                  color: roleFilter === tab.id ? '#fff' : 'var(--text-3)',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '170px' }}>
            <ArrowUpDown size={14} color="var(--text-3)" />
            <CustomSelect 
              name="sort"
              value={sortBy} 
              onChange={handleSortChange} 
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'name_asc', label: 'Name (A-Z)' },
                { value: 'name_desc', label: 'Name (Z-A)' }
              ]}
              style={{ flex: 1, minWidth: '140px' }}
            />
          </div>

        </div>
      </div>

      {/* Users Grid */}
      {loading && users.length === 0 ? (
        <div className="info-box" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ width: '24px', height: '24px', border: '2px solid var(--border-2)', borderTopColor: 'var(--gold)', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: 'var(--text-3)', fontSize: '13px' }}>Loading user directory...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="info-box" style={{ padding: '3rem', textAlign: 'center' }}>
          <UserIcon size={32} color="var(--text-4)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ color: 'var(--text)', marginBottom: '4px' }}>No users match your filters</h4>
          <p style={{ color: 'var(--text-3)', fontSize: '13px' }}>Try adjusting your search keywords, status, or role filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {users.map(u => (
            <div 
              key={u._id}
              className="info-box" 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '18px',
                position: 'relative',
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'pointer',
                opacity: u.isDeleted ? 0.6 : (u.isBanned ? 0.75 : 1),
                borderColor: u.isDeleted ? 'rgba(239, 68, 68, 0.2)' : (u.isBanned ? 'rgba(239, 68, 68, 0.4)' : 'var(--border)')
              }}
              onClick={() => setEditUser(u)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = u.isDeleted ? 'rgba(239, 68, 68, 0.2)' : (u.isBanned ? 'rgba(239, 68, 68, 0.4)' : 'var(--border)');
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Card Header: Avatar & Info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div 
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: u.hasAvatar 
                      ? `url(${avatarUrl(u._id, u.avatarVersion || 0)}) center/cover no-repeat` 
                      : (u.accentColor || 'var(--purple)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#fff',
                    flexShrink: 0,
                    border: `2px solid ${u.accentColor || 'var(--border)'}`,
                    filter: u.isBanned || u.isDeleted ? 'grayscale(80%)' : 'none'
                  }}
                >
                  {!u.hasAvatar && getInitials(u.name)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.name}
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {u.isDeleted && <span className="tag red" style={{ fontSize: '9px', padding: '1px 6px' }}>Deleted</span>}
                      {u.isBanned && <span className="tag red" style={{ fontSize: '9px', padding: '1px 6px' }}>Banned</span>}
                      <span 
                        className={`tag ${u.role === 'admin' ? 'green' : 'gold'}`}
                        style={{ fontSize: '10px', padding: '2px 8px', flexShrink: 0 }}
                      >
                        {u.role === 'admin' ? 'Admin' : 'Member'}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--mono)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.handle ? `@${u.handle}` : u.email}
                  </div>
                </div>
              </div>

              {/* Bio Excerpt */}
              <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: 0, lineHeight: 1.5, minHeight: '36px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {u.isBanned ? (
                  <span style={{ color: 'var(--red)' }}>?? Ban Reason: {u.banReason || 'Account suspended'}</span>
                ) : u.isDeleted ? (
                  <span style={{ color: 'var(--text-4)', fontStyle: 'italic' }}>Account marked as deleted</span>
                ) : (
                  u.bio || 'No bio provided yet.'
                )}
              </p>

              {/* Footer Metadata */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} color="var(--text-4)" />
                  <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.location || 'Unknown'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--mono)' }}>
                  <Calendar size={12} color="var(--text-4)" />
                  <span>{new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Quick Admin Actions Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-4)' }}>ID: {u._id.substring(0, 8)}...</span>

                <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                  {/* Ban/Unban Button */}
                  <button
                    type="button"
                    onClick={(e) => openActionModal(e, u, u.isBanned ? 'unban' : 'ban')}
                    disabled={actionLoading === u._id}
                    className="btn-ghost"
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: u.isBanned ? 'var(--green)' : 'var(--red)',
                      borderColor: u.isBanned ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                    }}
                    title={u.isBanned ? 'Unban User' : 'Ban User'}
                  >
                    <Ban size={12} />
                    {u.isBanned ? 'Unban' : 'Ban'}
                  </button>

                  {/* Soft Delete / Restore Button */}
                  <button
                    type="button"
                    onClick={(e) => openActionModal(e, u, u.isDeleted ? 'restore' : 'delete')}
                    disabled={actionLoading === u._id}
                    className="btn-ghost"
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: u.isDeleted ? 'var(--gold)' : 'var(--text-3)',
                      borderColor: u.isDeleted ? 'rgba(245, 166, 35, 0.3)' : 'var(--border)'
                    }}
                    title={u.isDeleted ? 'Restore Account' : 'Soft Delete Account'}
                  >
                    {u.isDeleted ? <Undo2 size={12} /> : <Trash2 size={12} />}
                    {u.isDeleted ? 'Restore' : 'Delete'}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '1.5rem' }}>
          <button 
            className="btn-ghost"
            style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
            disabled={page <= 1 || loading}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft size={14} /> Previous
          </button>
          
          <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text-3)' }}>
            Page {page} of {pagination.pages}
          </span>

          <button 
            className="btn-ghost"
            style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
            disabled={page >= pagination.pages || loading}
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Admin Action Confirmation Modal */}
      {actionModal.isOpen && (
        <AdminUserActionModal
          user={actionModal.user}
          actionType={actionModal.type}
          onConfirm={handleConfirmAction}
          onCancel={closeActionModal}
        />
      )}

      {/* Admin Edit User Modal */}
      {editUser && (
        <AdminEditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
}
