import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Ban, Trash2, Undo2, X, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function AdminUserActionModal({ user, actionType, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  const [deleteThreads, setDeleteThreads] = useState(false);
  const [deleteReplies, setDeleteReplies] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onCancel, 250);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm({ reason, deleteThreads, deleteReplies });
    }, 250);
  };

  if (!user || !actionType) return null;

  const isBanAction = actionType === 'ban';
  const isUnbanAction = actionType === 'unban';
  const isDeleteAction = actionType === 'delete';
  const isRestoreAction = actionType === 'restore';

  const getTitle = () => {
    if (isBanAction) return `Ban ${user.name}?`;
    if (isUnbanAction) return `Unban ${user.name}?`;
    if (isDeleteAction) return `Soft Delete ${user.name}'s Account?`;
    if (isRestoreAction) return `Restore ${user.name}'s Account?`;
    return 'Confirm Action';
  };

  const getDescription = () => {
    if (isBanAction) return `This will immediately block ${user.name} (@${user.handle || user.email}) from logging into FileFlow.`;
    if (isUnbanAction) return `This will remove the ban and allow ${user.name} to log in and use FileFlow again.`;
    if (isDeleteAction) return `This will mark ${user.name}'s account as deleted and block access without permanently deleting their data.`;
    if (isRestoreAction) return `This will restore ${user.name}'s account back to active status.`;
    return '';
  };

  const getIcon = () => {
    if (isBanAction) return <Ban size={24} color="var(--red)" />;
    if (isUnbanAction) return <ShieldAlert size={24} color="var(--green)" />;
    if (isDeleteAction) return <Trash2 size={24} color="var(--red)" />;
    if (isRestoreAction) return <Undo2 size={24} color="var(--gold)" />;
    return <AlertTriangle size={24} color="var(--gold)" />;
  };

  const getConfirmButtonText = () => {
    if (isBanAction) return 'Ban User';
    if (isUnbanAction) return 'Unban User';
    if (isDeleteAction) return 'Delete Account';
    if (isRestoreAction) return 'Restore Account';
    return 'Confirm';
  };

  const getConfirmButtonClass = () => {
    if (isBanAction || isDeleteAction) return 'btn-danger';
    return 'btn-primary';
  };

  return createPortal(
    <div 
      className={`fixed inset-0 z-[9999] modal-overlay flex items-center justify-center ${isClosing ? 'anim-fade-out' : 'anim-fade-in'}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 2, 10, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        zIndex: 99999
      }}
      onClick={handleClose}
    >
      <div 
        className={`modal-content relative flex flex-col ${isClosing ? 'anim-slide-down' : 'anim-slide-up'}`}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(28, 12, 56, 0.95)',
          border: '1px solid var(--border-2)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          type="button" 
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-3)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Icon & Title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1rem' }}>
          <div 
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: isBanAction || isDeleteAction ? 'var(--red-dim)' : 'var(--purple-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}
          >
            {getIcon()}
          </div>
          
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: '0 0 6px 0' }}>
            {getTitle()}
          </h3>

          <p style={{ fontSize: '13px', color: 'var(--text-2)', margin: 0, lineHeight: 1.5 }}>
            {getDescription()}
          </p>
        </div>

        {/* Ban Reason Input (Only for Ban action) */}
        {isBanAction && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
              Ban Reason (Shown to user)
            </label>
            <input 
              type="text" 
              className="input"
              placeholder="E.g. Violation of community guidelines, spam, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ fontSize: '13px', width: '100%' }}
              autoFocus
            />
          </div>
        )}

        {(isBanAction || isDeleteAction) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.25rem', background: 'var(--bg-2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>Delete all user's threads (Soft)</span>
              <input type="checkbox" checked={deleteThreads} onChange={e => setDeleteThreads(e.target.checked)} style={{ cursor: 'pointer' }} />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>Delete all user's replies (Soft)</span>
              <input type="checkbox" checked={deleteReplies} onChange={e => setDeleteReplies(e.target.checked)} style={{ cursor: 'pointer' }} />
            </label>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
          <button 
            type="button" 
            className="btn-outline" 
            style={{ flex: 1, padding: '9px 16px', fontSize: '13px', justifyContent: 'center' }} 
            onClick={handleClose}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className={getConfirmButtonClass()} 
            style={{ flex: 1, padding: '9px 16px', fontSize: '13px', justifyContent: 'center' }} 
            onClick={handleConfirm}
          >
            {getConfirmButtonText()}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
