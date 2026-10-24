import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarsPage from './pages/CarsPage';
import AboutUs from './pages/AboutUs';
import Faq from './pages/Faq';
import ContactUs from './pages/ContactUs';
import ScrollToTop from './components/ScrollToTop';

// Admin Components
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManageCars from './pages/admin/AdminManageCars';
import AdminCarForm from './pages/admin/AdminCarForm';
import AdminBookings from './pages/admin/AdminBookings';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Layout for public pages
const PublicLayout = () => (
  <div className="App bg-light min-vh-100 d-flex flex-column">
    <Header />
    <Navigation />
    <div className="flex-grow-1">
      <Outlet />
    </div>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<CarsPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<ContactUs />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/cars" element={<AdminManageCars />} />
              <Route path="/admin/cars/new" element={<AdminCarForm />} />
              <Route path="/admin/cars/edit/:id" element={<AdminCarForm />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
