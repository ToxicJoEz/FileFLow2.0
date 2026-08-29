import React, { useEffect, useState } from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';

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

  const hideFooterPaths = ['/dashboard', '/profile', '/achievements', '/payment', '/login', '/beta'];
  const showFooter = !hideFooterPaths.includes(location.pathname);

  const appShellPaths = ['/dashboard', '/profile', '/achievements'];
  const isAppShell = appShellPaths.includes(location.pathname);
  const frozenOutlet = outlet ? React.cloneElement(outlet, { key: location.pathname }) : null;
  const appShellLayoutKey = "app-shell-wrapper";

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        {isAppShell ? (
          <motion.div
            key={appShellLayoutKey}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="page-wrap"
          >
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
          </motion.div>
        ) : (
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="page-wrap"
          >
            {frozenOutlet}
          </motion.main>
        )}
      </AnimatePresence>
      {showFooter && <Footer />}
    </>
  );
}
