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
  Bell,
  Moon,
  Sun,
  Settings
} from 'lucide-react';
import { cn } from '../utils/cn';
import { getStoredUserProfile, signOut, type UserProfile } from '../services/auth';
import NotificationDropdown from '../components/NotificationDropdown';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sidebarItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Services', href: '/admin/services', icon: Box },
    { name: 'Projects', href: '/admin/projects', icon: Folder },
    { name: 'Messages', href: '/admin/messages', icon: Mail },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Quote },
    { name: 'Team Members', href: '/admin/team-members', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
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
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:hidden"
          >
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/FCT Logo.png" 
                    alt="Fusioncrafttech Logo" 
                    className="w-8 h-8 rounded-lg"
                  />
                  <span className="text-xl font-bold gradient-text">Admin</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-600 dark:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 px-3 py-4">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User section */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      admin@fusioncrafttech.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64">
        <div className="flex h-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <img 
                src="/FCT Logo.png" 
                alt="Fusioncrafttech Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold gradient-text">Admin</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
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
                      ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
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
      <div className="lg:pl-64 flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 dark:text-gray-300 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <NotificationDropdown />

              {/* Profile dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
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
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {userProfile?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {userProfile?.email || 'user@example.com'}
                        </p>
                        <p className="text-xs text-primary-600 dark:text-primary-400 capitalize">
                          {userProfile?.role?.replace('_', ' ') || 'team_member'}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <Link
                        to={userProfile?.role === 'admin' || userProfile?.role === 'super_admin' ? "/admin/profile" : "/dashboard/profile"}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
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
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
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

export default AdminLayout;
