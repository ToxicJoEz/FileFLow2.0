import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Cropper from 'react-easy-crop';
import { X, Crop } from 'lucide-react';

export default function ImageCropperModal({ imageSrc, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onCancel, 300);
  };

  const handleSave = () => {
    setIsClosing(true);
    setTimeout(() => onCropComplete(croppedAreaPixels), 300);
  };

  return createPortal(
    <div className={`fixed inset-0 z-[200] modal-overlay flex items-center justify-center ${isClosing ? 'anim-fade-out' : 'anim-fade-in'}`}>
      <div className={`modal-content relative flex flex-col ${isClosing ? 'anim-slide-down' : 'anim-slide-up'}`} style={{ width: '400px', maxWidth: '90vw', padding: '0', overflow: 'hidden' }}>
        
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Crop size={18} className="text-[var(--gold)]" />
            <h3 className="text-sm font-semibold m-0">Crop your avatar</h3>
          </div>
          <button type="button" className="text-[var(--text-3)] hover:text-[var(--text)] transition-colors" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="relative w-full h-[300px] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="p-4 bg-[var(--bg-2)] flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[var(--text-3)]">Zoom</span>
            <input 
              type="range" 
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="w-full accent-[var(--gold)]"
            />
          </div>
          <div className="flex gap-3">
            <button className="btn-outline flex-1" onClick={handleClose}>Cancel</button>
            <button className="btn-primary flex-1" onClick={handleSave}>Apply Crop</button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
