import { lazy, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import AuthGuard from './components/AuthGuard';
import ScrollToTop from './components/ScrollToTop';

// Lazy loaded layouts
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const CRMLayout = lazy(() => import('./layouts/CRMLayout'));
const AuthLayout = lazy(() => import('./layouts/AuthLayout'));

// Portfolio Pages
const HomePage = lazy(() => import('./modules/portfolio/pages/HomePage'));
const AboutPage = lazy(() => import('./modules/portfolio/pages/AboutPage'));
const ServicesPage = lazy(() => import('./modules/portfolio/pages/ServicesPage'));
const ProjectsPage = lazy(() => import('./modules/portfolio/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./modules/portfolio/pages/ProjectDetailPage'));
const ContactPage = lazy(() => import('./modules/portfolio/pages/ContactPage'));
const ReviewPage = lazy(() => import('./pages/Review'));

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
            <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><MainLayout><Outlet /></MainLayout></Suspense>}>
              <Route index element={<Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense>} />
              <Route path="about" element={<Suspense fallback={<div>Loading...</div>}><AboutPage /></Suspense>} />
              <Route path="services" element={<Suspense fallback={<div>Loading...</div>}><ServicesPage /></Suspense>} />
              <Route path="projects" element={<Suspense fallback={<div>Loading...</div>}><ProjectsPage /></Suspense>} />
              <Route path="projects/:id" element={<Suspense fallback={<div>Loading...</div>}><ProjectDetailPage /></Suspense>} />
              <Route path="contact" element={<Suspense fallback={<div>Loading...</div>}><ContactPage /></Suspense>} />
              <Route path="review" element={<Suspense fallback={<div>Loading...</div>}><ReviewPage /></Suspense>} />
            </Route>

            {/* Authentication Routes */}
            <Route path="/login" element={<Suspense fallback={<div>Loading...</div>}><AuthLayout title="Sign In" subtitle="Welcome back to Fusioncrafttech"><LoginPage /></AuthLayout></Suspense>} />
            <Route path="/register" element={<Suspense fallback={<div>Loading...</div>}><AuthLayout title="Create Account" subtitle="Join our team today"><RegisterPage /></AuthLayout></Suspense>} />
            <Route path="/forgot-password" element={<Suspense fallback={<div>Loading...</div>}><AuthLayout title="Reset Password" subtitle="Enter your email to reset your password"><ForgotPasswordPage /></AuthLayout></Suspense>} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <AuthGuard requiredRole="admin">
                <Suspense fallback={<div>Loading...</div>}><AdminLayout><Outlet /></AdminLayout></Suspense>
              </AuthGuard>
            }>
              <Route index element={<Suspense fallback={<div>Loading...</div>}><AdminDashboard /></Suspense>} />
              <Route path="dashboard" element={<Suspense fallback={<div>Loading...</div>}><AdminDashboard /></Suspense>} />
              <Route path="services" element={<Suspense fallback={<div>Loading...</div>}><ServicesManager /></Suspense>} />
              <Route path="projects" element={<Suspense fallback={<div>Loading...</div>}><ProjectsManager /></Suspense>} />
              <Route path="messages" element={<Suspense fallback={<div>Loading...</div>}><MessagesManager /></Suspense>} />
              <Route path="team-members" element={<Suspense fallback={<div>Loading...</div>}><TeamMembersManager /></Suspense>} />
              <Route path="slideshow" element={<Suspense fallback={<div>Loading...</div>}><SlideshowManager /></Suspense>} />
              <Route path="profile" element={<Suspense fallback={<div>Loading...</div>}><AdminProfile /></Suspense>} />
              <Route path="create-quotation" element={<Suspense fallback={<div>Loading...</div>}><QuotationForm /></Suspense>} />
              <Route path="create-invoice" element={<Suspense fallback={<div>Loading...</div>}><InvoiceForm /></Suspense>} />
              <Route path="create-brochure" element={<Suspense fallback={<div>Loading...</div>}><BrochureForm /></Suspense>} />
              <Route path="document-history" element={<Suspense fallback={<div>Loading...</div>}><DocumentHistory /></Suspense>} />
              <Route path="settings" element={<Suspense fallback={<div>Loading...</div>}><AdminSettings /></Suspense>} />
            </Route>

            {/* CRM Routes */}
            <Route path="/dashboard" element={
              <AuthGuard>
                <Suspense fallback={<div>Loading...</div>}><CRMLayout><Outlet /></CRMLayout></Suspense>
              </AuthGuard>
            }>
              <Route index element={<Suspense fallback={<div>Loading...</div>}><CRMDashboard /></Suspense>} />
              <Route path="projects" element={<Suspense fallback={<div>Loading...</div>}><ProjectsTracker /></Suspense>} />
              <Route path="tasks" element={<Suspense fallback={<div>Loading...</div>}><TasksManager /></Suspense>} />
              <Route path="messages" element={<Suspense fallback={<div>Loading...</div>}><InternalMessages /></Suspense>} />
              <Route path="clients" element={<div className="p-8"><h1 className="text-3xl font-bold">CRM Clients</h1></div>} />
              <Route path="team" element={<Suspense fallback={<div>Loading...</div>}><TeamMembersManager /></Suspense>} />
            </Route>

            {/* Toolkit Routes */}
            <Route path="/toolkit" element={<Suspense fallback={<div>Loading...</div>}><AdminLayout><Outlet /></AdminLayout></Suspense>}>
              <Route index element={<Suspense fallback={<div>Loading...</div>}><ToolkitDashboard /></Suspense>} />
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
