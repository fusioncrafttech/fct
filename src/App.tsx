import { lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import CRMLayout from './layouts/CRMLayout';
import AuthLayout from './layouts/AuthLayout';
import AuthGuard from './components/AuthGuard';
import SplashScreen from './components/SplashScreen';
import ScrollToTop from './components/ScrollToTop';

// Portfolio Pages
import HomePage from './modules/portfolio/pages/HomePage';
const AboutPage = lazy(() => import('./modules/portfolio/pages/AboutPage'));
const ServicesPage = lazy(() => import('./modules/portfolio/pages/ServicesPage'));
const ProjectsPage = lazy(() => import('./modules/portfolio/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./modules/portfolio/pages/ProjectDetailPage'));
const ContactPage = lazy(() => import('./modules/portfolio/pages/ContactPage'));

// Auth Pages
const LoginPage = lazy(() => import('./routes/auth/LoginPage'));
const RegisterPage = lazy(() => import('./routes/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./routes/auth/ForgotPasswordPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./modules/admin/pages/Dashboard'));
const ServicesManager = lazy(() => import('./modules/admin/pages/Services'));
const ProjectsManager = lazy(() => import('./modules/admin/pages/Projects'));
const MessagesManager = lazy(() => import('./modules/admin/pages/Messages'));
const AdminProfile = lazy(() => import('./modules/admin/pages/Profile'));
const AdminSettings = lazy(() => import('./modules/admin/pages/Settings'));
const QuotationForm = lazy(() => import('./modules/admin/pages/QuotationForm'));
const InvoiceForm = lazy(() => import('./modules/admin/pages/InvoiceForm'));
const BrochureForm = lazy(() => import('./modules/admin/pages/BrochureForm'));
const DocumentHistory = lazy(() => import('./modules/admin/pages/DocumentHistory'));
const SlideshowManager = lazy(() => import('./modules/admin/pages/SlideshowManager'));

// CRM Pages
const CRMDashboard = lazy(() => import('./modules/crm/pages/Dashboard'));
const ProjectsTracker = lazy(() => import('./modules/crm/pages/Projects'));
const TasksManager = lazy(() => import('./modules/crm/pages/Tasks'));
const InternalMessages = lazy(() => import('./modules/crm/pages/InternalMessages'));
const TeamMembersManager = lazy(() => import('./modules/crm/pages/TeamMembersView'));

// Toolkit Pages
const ToolkitDashboard = lazy(() => import('./modules/toolkit/pages/Dashboard'));

function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  const handleSplashScreenComplete = () => {
    // Add a small delay to ensure splash screen is completely hidden
    setTimeout(() => {
      setShowSplashScreen(false);
    }, 100);
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
    duration: 0.5
  };

  return (
    <>
      {showSplashScreen ? (
        <SplashScreen onComplete={handleSplashScreenComplete} />
      ) : (
        <Router>
          <ScrollToTop />
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
              <Route path="projects/:id" element={<ProjectDetailPage />} />
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
              <Route path="team-members" element={<TeamMembersManager />} />
              <Route path="slideshow" element={<SlideshowManager />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="create-quotation" element={<QuotationForm />} />
              <Route path="create-invoice" element={<InvoiceForm />} />
              <Route path="create-brochure" element={<BrochureForm />} />
              <Route path="document-history" element={<DocumentHistory />} />
              <Route path="settings" element={<AdminSettings />} />
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
      )}
    </>
  );
}

export default App;
