import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import CRMLayout from './layouts/CRMLayout';
import AuthLayout from './layouts/AuthLayout';
import AuthGuard from './components/AuthGuard';
import SplashScreen from './components/SplashScreen';

// Portfolio Pages
import HomePage from './modules/portfolio/pages/HomePage';
import AboutPage from './modules/portfolio/pages/AboutPage';
import ServicesPage from './modules/portfolio/pages/ServicesPage';
import ProjectsPage from './modules/portfolio/pages/ProjectsPage';
import ContactPage from './modules/portfolio/pages/ContactPage';

// Auth Pages
import LoginPage from './routes/auth/LoginPage';
import RegisterPage from './routes/auth/RegisterPage';
import ForgotPasswordPage from './routes/auth/ForgotPasswordPage';

// Admin Pages
import AdminDashboard from './modules/admin/pages/Dashboard';
import ServicesManager from './modules/admin/pages/Services';
import ProjectsManager from './modules/admin/pages/Projects';
import MessagesManager from './modules/admin/pages/Messages';
import TestimonialsManager from './modules/admin/pages/TeamMembers';
import AdminTeamMembersManager from './modules/admin/pages/TeamMembers';
import AdminSettingsComponent from './modules/admin/pages/Settings';
import AdminProfile from './modules/admin/pages/Profile';

// CRM Pages
import CRMDashboard from './modules/crm/pages/Dashboard';
import ProjectsTracker from './modules/crm/pages/Projects';
import TasksManager from './modules/crm/pages/Tasks';
import InternalMessages from './modules/crm/pages/InternalMessages';
import TeamMembersManager from './modules/crm/pages/TeamMembers';

// Toolkit Pages
import ToolkitDashboard from './modules/toolkit/pages/Dashboard';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 0.98
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Router>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Routes>
          {/* Public Portfolio Routes */}
          <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Authentication Routes */}
          <Route path="/login" element={<AuthLayout title="Sign In" subtitle="Welcome back to Fusioncrafttech"><LoginPage /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout title="Create Account" subtitle="Join our team today"><RegisterPage /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout title="Reset Password" subtitle="Enter your email to reset your password"><ForgotPasswordPage /></AuthLayout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AuthGuard requiredRole="admin">
              <AdminLayout><Outlet /></AdminLayout>
            </AuthGuard>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="team-members" element={<TeamMembersManager />} />
            <Route path="settings" element={<AdminSettingsComponent />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* CRM Routes */}
          <Route path="/dashboard" element={
            <AuthGuard>
              <CRMLayout><Outlet /></CRMLayout>
            </AuthGuard>
          }>
            <Route index element={<CRMDashboard />} />
            <Route path="projects" element={<ProjectsTracker />} />
            <Route path="tasks" element={<TasksManager />} />
            <Route path="messages" element={<InternalMessages />} />
            <Route path="clients" element={<div className="p-8"><h1 className="text-3xl font-bold">CRM Clients</h1></div>} />
            <Route path="team" element={<TeamMembersManager />} />
          </Route>

          {/* Toolkit Routes */}
          <Route path="/toolkit" element={<AdminLayout><Outlet /></AdminLayout>}>
            <Route index element={<ToolkitDashboard />} />
            <Route path="auth" element={<div className="p-8"><h1 className="text-3xl font-bold">Toolkit Auth</h1></div>} />
            <Route path="dashboard" element={<div className="p-8"><h1 className="text-3xl font-bold">Toolkit Dashboard Layouts</h1></div>} />
            <Route path="contact" element={<div className="p-8"><h1 className="text-3xl font-bold">Toolkit Contact Forms</h1></div>} />
            <Route path="api" element={<div className="p-8"><h1 className="text-3xl font-bold">Toolkit API</h1></div>} />
            <Route path="ui" element={<div className="p-8"><h1 className="text-3xl font-bold">Toolkit UI</h1></div>} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold">404 - Page Not Found</h1></div>} />
        </Routes>
      </motion.div>
    </Router>
  );
}

export default App;
