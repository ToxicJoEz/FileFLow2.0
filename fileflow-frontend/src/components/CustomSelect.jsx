import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/components/_custom-select.scss';

export default function CustomSelect({ options, name, value, onChange, onBlur, placeholder, className, style }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        if (onBlur) {
          // Simulate an onBlur event for formik
          onBlur({ target: { name } });
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [name, onBlur]);

  const handleSelect = (option) => {
    const val = typeof option === 'string' ? option : option.value;
    
    // Simulate an onChange event for formik
    onChange({ target: { name, value: val } });
    setIsOpen(false);
  };

  const selectedOption = typeof options[0] === 'string'
    ? options.find(o => o === value)
    : options.find(o => o.value === value);
    
  const displayValue = typeof selectedOption === 'string' 
    ? selectedOption 
    : (selectedOption?.label || value || placeholder || 'Select option...');

  return (
    <div 
      className={`custom-select-container ${className || ''}`} 
      ref={containerRef}
      style={style}
    >
      <div 
        className={`input custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className="custom-select-value">{displayValue}</span>
        <ChevronDown size={16} className={`custom-select-icon ${isOpen ? 'open' : ''}`} />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="custom-select-dropdown"
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ transformOrigin: "top center" }}
          >
            {options.map((option, idx) => {
              const val = typeof option === 'string' ? option : option.value;
              const label = typeof option === 'string' ? option : option.label;
              const isSelected = val === value;
              
              return (
                <div 
                  key={idx}
                  className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {label}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
