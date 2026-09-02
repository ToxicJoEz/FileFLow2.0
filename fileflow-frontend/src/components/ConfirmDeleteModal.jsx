import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDeleteModal({ onConfirm, onCancel, title = "Delete this post?", description = "This action cannot be undone. Are you completely sure?" }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onCancel, 300);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(onConfirm, 300);
  };

  return createPortal(
    <div className={`fixed inset-0 z-[200] modal-overlay flex items-start justify-center ${isClosing ? 'anim-fade-out' : 'anim-fade-in'}`}>
      <div className={`modal-content delete-modal relative flex flex-col items-center ${isClosing ? 'anim-slide-down' : 'anim-slide-up'}`}>
        <button type="button" className="modal-close absolute top-6 right-6" onClick={handleClose}><X size={20} /></button>
        
        <div className="delete-icon flex items-center justify-center">
          <AlertTriangle size={24} />
        </div>
        <h3 className="delete-title">{title}</h3>
        <p className="delete-desc">{description}</p>
        
        <div className="flex w-full delete-actions">
          <button className="btn-outline flex-1" onClick={handleClose}>Cancel</button>
          <button className="btn-danger flex-1" onClick={handleConfirm}>Delete</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
