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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDarkMode = localStorage.getItem('darkMode');
      if (storedDarkMode === 'true') {
        setDarkMode(true);
      }
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 hero-gradient border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 premium-gradient rounded-xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
                <img 
                  src="/FCT Logo.png" 
                  alt="Fusioncrafttech Logo" 
                  className="relative z-10 w-10 h-10 rounded-xl group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-gray-200 transition-colors">Fusioncrafttech</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {NAVIGATION_ITEMS.public.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 relative group",
                    location.pathname === item.href
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  )}
                >
                  {item.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform transition-transform duration-300",
                    location.pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}></span>
                </Link>
              ))}
              {/* Login Button - Hidden on mobile */}
              <Link
                to="/login"
                className="btn-primary text-sm font-medium hidden md:block"
              >
                Login
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 touch-manipulation"
                aria-label="Toggle mobile menu"
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
            className="md:hidden fixed top-20 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/20 shadow-2xl z-50 max-h-[60vh] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              {NAVIGATION_ITEMS.public.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 sm:py-4 rounded-xl text-base font-medium transition-all touch-manipulation",
                    location.pathname === item.href
                      ? "text-white bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 sm:py-4 rounded-xl text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all touch-manipulation"
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
      <footer className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 premium-gradient rounded-xl opacity-20 blur-lg"></div>
                  <img 
                    src="/FCT Logo.png" 
                    alt="Fusioncrafttech Logo" 
                    className="relative z-10 w-10 h-10 rounded-xl"
                  />
                </div>
                <span className="text-2xl font-bold text-white">Fusioncrafttech</span>
              </div>
              <p className="text-sm sm:text-base text-gray-300 max-w-md leading-relaxed">
                Premium SaaS-style internal freelance agency toolkit for modern teams. Transform your workflow with cutting-edge solutions.
              </p>
              
              {/* Social Icons */}
              <div className="flex space-x-3 sm:space-x-4 mt-4 sm:mt-6">
                <a 
                  href="https://linkedin.com/company/fusioncrafttech" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 touch-manipulation"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com/fusioncrafttech" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 touch-manipulation"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/fusioncrafttech" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 touch-manipulation"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-6 text-lg">Quick Links</h3>
              <ul className="space-y-3">
                {NAVIGATION_ITEMS.public.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-sm sm:text-base touch-manipulation py-2"
                    >
                      <span className="w-1 h-1 bg-purple-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-6 text-lg">Services</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-sm sm:text-base touch-manipulation py-2">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-sm sm:text-base touch-manipulation py-2">
                    <span className="w-1 h-1 bg-green-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-sm sm:text-base touch-manipulation py-2">
                    <span className="w-1 h-1 bg-orange-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    UI/UX Design
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-sm sm:text-base touch-manipulation py-2">
                    <span className="w-1 h-1 bg-pink-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Cloud Services
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              © 2026 Fusioncrafttech. All rights reserved. 
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
