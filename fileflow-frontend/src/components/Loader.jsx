import React from 'react';
import '../styles/components/_loader.scss';

export default function Loader({ size = 'md', fullPage = false, inline = false, className = '' }) {
  // size can be 'sm', 'md', 'lg'
  return (
    <div className={`ff-loader-wrapper ${fullPage ? 'full-page' : ''} ${inline ? 'inline' : ''} ${className}`}>
      <div className={`ff-loader ${size}`}>
        <div className="spinner-ring ring-1"></div>
        <div className="spinner-ring ring-2"></div>
      </div>
    </div>
  );
}
