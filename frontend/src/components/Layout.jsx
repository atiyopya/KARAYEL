import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`app-layout ${isAuthPage ? 'auth-layout' : ''}`}>
      {!isAuthPage && <Sidebar />}
      
      <main className={`main-content ${isAuthPage ? 'full-width' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <div className="blob-bg blob-1"></div>
      <div className="blob-bg blob-2"></div>
    </div>
  );
};

export default Layout;
