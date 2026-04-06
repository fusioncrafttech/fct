import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Folder, 
  Box, 
  Users, 
  Mail, 
  Menu, 
  X, 
  LogOut,
  User,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '../utils/cn';
import { getStoredUserProfile, signOut, type UserProfile } from '../services/auth';
import NotificationDropdown from '../components/NotificationDropdown';

interface CRMLayoutProps {
  children?: React.ReactNode;
}

const CRMLayout: React.FC<CRMLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return savedMode === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Get user profile on component mount
  useEffect(() => {
    const profile = getStoredUserProfile();
    setUserProfile(profile);
  }, []);

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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // CRM Navigation items
  const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/projects', icon: Folder },
    { name: 'Tasks', href: '/dashboard/tasks', icon: Box },
    { name: 'Messages', href: '/dashboard/messages', icon: Mail },
    { name: 'Team', href: '/dashboard/team', icon: Users },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/'); // Redirect to home page
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900 flex", darkMode && 'dark')}>
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -320 }}
            className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:hidden overflow-y-auto"
          >
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/FCT Logo.png" 
                    alt="Fusioncrafttech Logo" 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg"
                  />
                  <span className="text-lg sm:text-xl font-bold gradient-text hidden sm:block">CRM</span>
                  <span className="text-lg font-bold gradient-text sm:hidden">C</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-600 dark:text-gray-300 p-1 sm:p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 px-2 sm:px-3 py-3 sm:py-4">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center space-x-2 sm:space-x-3 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors touch-manipulation",
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      )}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User section */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    {userProfile?.avatar ? (
                      <img 
                        src={userProfile.avatar} 
                        alt={userProfile.name} 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                      {userProfile?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate hidden sm:block">
                      {userProfile?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 xl:w-72">
        <div className="flex h-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 xl:px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <img 
                src="/FCT Logo.png" 
                alt="Fusioncrafttech Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-lg xl:text-xl font-bold gradient-text">CRM</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 xl:px-3 py-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 xl:p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                {userProfile?.avatar ? (
                  <img 
                    src={userProfile.avatar} 
                    alt={userProfile.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userProfile?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userProfile?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 xl:pl-72 flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 dark:text-gray-300 p-1.5 sm:p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-1.5 sm:p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              {/* Notifications */}
              <NotificationDropdown />

              {/* Profile dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-1.5 sm:p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    {userProfile?.avatar ? (
                      <img 
                        src={userProfile.avatar} 
                        alt={userProfile.name} 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                    >
                      {/* User Info */}
                      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                          {userProfile?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {userProfile?.email || 'user@example.com'}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 capitalize">
                          {userProfile?.role?.replace('_', ' ') || 'team_member'}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children || <Outlet />}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default CRMLayout;
