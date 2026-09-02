import React, { useEffect } from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const hideFooterPaths = ['/dashboard', '/dashboard/profile', '/dashboard/achievements', '/payment', '/login', '/beta'];
  const showFooter = !hideFooterPaths.some(path => location.pathname === path || location.pathname.startsWith('/dashboard'));

  const baseKey = location.pathname.startsWith('/dashboard') ? '/dashboard' : location.pathname;
  const frozenOutlet = outlet ? React.cloneElement(outlet, { key: baseKey }) : null;

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={baseKey}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="page-wrap"
        >
          {frozenOutlet}
        </motion.main>
      </AnimatePresence>
      {showFooter && <Footer />}
    </>
  );
}
