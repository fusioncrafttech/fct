import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../utils/constants';
import { cn } from '../utils/cn';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if dark mode is already set in localStorage or system preference
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return savedMode === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode to document whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
      }
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/FCT Logo.png" 
                alt="Fusioncrafttech Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold gradient-text">Fusioncrafttech</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {NAVIGATION_ITEMS.public.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary-600",
                    location.pathname === item.href
                      ? "text-primary-600"
                      : "text-gray-600 dark:text-gray-300"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Login Button */}
            <Link
              to="/login"
              className="btn-primary"
            >
              Login
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-50"
          >
            <div className="max-w-7xl mx-auto px-4 py-2">
              {NAVIGATION_ITEMS.public.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    location.pathname === item.href
                      ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        {children || <Outlet />}
      </motion.main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/FCT Logo.png" 
                  alt="Fusioncrafttech Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-bold gradient-text">Fusioncrafttech</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Premium SaaS-style internal freelance agency toolkit for modern teams.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {NAVIGATION_ITEMS.public.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                    Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                    UI/UX Design
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                    Consulting
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="https://linkedin.com/company/fusioncrafttech" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://instagram.com/fusioncrafttech" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2026 Fusioncrafttech. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
