import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ChevronUp } from 'lucide-react';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import JobListPage from './pages/JobListPage';
import JobDetailPage from './pages/JobDetailPage';
import ApplicationForm from './pages/ApplicationForm';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TestimonialsPage from './pages/TestimonialsPage';
import EventsPage from './pages/EventsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage'; // Assuming NotFoundPage is imported

// New pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import ScheduleConsultation from './pages/ScheduleConsultation';

// New components
import ChatAssistant from './components/ChatAssistant';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function App() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const isHome = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/secure-admin-access-2024');

  const RequireAdmin = ({ children }) => {
    let authAt = 0;
    try {
      authAt = parseInt(localStorage.getItem('adminAuthAt') || '0', 10);
    } catch (error) {
      return <Navigate to="/secure-admin-access-2024" replace />;
    }
    if (!authAt) return <Navigate to="/secure-admin-access-2024" replace />;
    const now = Date.now();
    const maxAgeMs = 24 * 60 * 60 * 1000;
    const age = now - authAt;
    if (age > maxAgeMs) {
      try { localStorage.removeItem('adminAuthAt'); } catch {}
      return <Navigate to="/secure-admin-access-2024" replace />;
    }
    return children;
  };

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        {!isAdminRoute && <Header />}

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/jobs/:id/apply" element={<ApplicationForm />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/consultation" element={<ScheduleConsultation />} />
            <Route path="/secure-admin-access-2024" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {!isAdminRoute && <Footer />}

        {/* Floating 3D Airplane on Home only - REMOVED AS PER USER REQUEST */}
        {/* {!isAdminRoute && isHome && <FloatingAirplane />} */}

        {/* 3D Scroll to Top Button */}
        {!isAdminRoute && showScrollButton && (
          <button
            onClick={scrollToTop}
            className="scroll-button-3d"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}

        {/* Chat Assistant disabled on admin */}
        {!isAdminRoute && <ChatAssistant />}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}