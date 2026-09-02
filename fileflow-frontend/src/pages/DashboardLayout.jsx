import React from 'react';
import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

export default function DashboardLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  
  const frozenOutlet = outlet ? React.cloneElement(outlet, { key: location.pathname }) : null;

  return (
    <div className="app-shell">
      <Sidebar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="app-main"
          style={{ width: '100%', overflow: 'hidden' }}
        >
          {frozenOutlet}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
