import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Addiction from './pages/Addiction.jsx';
import Admission from './pages/Admission.jsx';
import Contact from './pages/Contact.jsx';
import Reviews from './pages/Reviews.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Forgot from './pages/Forgot.jsx';
import Reset from './pages/Reset.jsx';
import DashboardLayout from './dashboard/DashboardLayout.jsx';
import Overview from './dashboard/Overview.jsx';
import Profile from './dashboard/Profile.jsx';
import Appointments from './dashboard/Appointments.jsx';
import { Registrations, Inquiries, ReviewsAdmin } from './dashboard/AdminPanels.jsx';
import { useAuth } from './AuthContext.jsx';

function Site() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return (
    <>
      <Navbar />
      <main className="page" key={pathname}><Outlet /></main>
      <Footer />
    </>
  );
}

function Protected({ admin = false, children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="loading">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function Guest({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading…</div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Site />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/addiction" element={<Addiction />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/login" element={<Guest><Login /></Guest>} />
      <Route path="/register" element={<Guest><Register /></Guest>} />
      <Route path="/forgot-password" element={<Forgot />} />
      <Route path="/reset-password/:token" element={<Reset />} />
      <Route path="/dashboard" element={<Protected><DashboardLayout /></Protected>}>
        <Route index element={<Overview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="registrations" element={<Protected admin><Registrations /></Protected>} />
        <Route path="inquiries" element={<Protected admin><Inquiries /></Protected>} />
        <Route path="reviews" element={<Protected admin><ReviewsAdmin /></Protected>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
