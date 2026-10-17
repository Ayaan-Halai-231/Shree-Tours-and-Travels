import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { List, BoxArrowUpRight, ShieldFillCheck } from 'react-bootstrap-icons';
import './Admin.css';

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Derive dynamic page title and subtitle from route
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') {
      return {
        title: 'Dashboard',
        subtitle: 'Fleet overview and real-time business performance'
      };
    }
    if (path.startsWith('/admin/cars/new')) {
      return {
        title: 'Add New Car',
        subtitle: 'Register a new vehicle with pricing and specifications'
      };
    }
    if (path.startsWith('/admin/cars/edit')) {
      return {
        title: 'Edit Car',
        subtitle: 'Update existing vehicle specifications and pricing'
      };
    }
    if (path.startsWith('/admin/cars')) {
      return {
        title: 'Manage Cars',
        subtitle: 'Fleet inventory, status updates, and vehicle management'
      };
    }
    if (path.startsWith('/admin/bookings')) {
      return {
        title: 'Bookings',
        subtitle: 'Customer rental requests and trip reservations'
      };
    }
    return {
      title: 'Admin Portal',
      subtitle: 'Shree Tours & Travels Administration'
    };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="admin-layout-wrapper">
      {/* Mobile Drawer Overlay Backdrop */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Full-Height Responsive Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Clean White Top Navigation Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Sidebar Navigation"
            >
              <List />
            </button>
            <div className="admin-topbar-title-wrap">
              <h1 className="admin-topbar-title">{title}</h1>
              <p className="admin-topbar-subtitle d-none d-sm-block">{subtitle}</p>
            </div>
          </div>

          <div className="admin-topbar-right">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="admin-topbar-action-btn d-none d-md-inline-flex"
              title="Open public website in new tab"
            >
              <span>View Site</span>
              <BoxArrowUpRight size={13} />
            </Link>

            {/* Yellow Admin Logged In Badge */}
            <div className="admin-badge-logged-in">
              <ShieldFillCheck size={16} />
              <span>Admin Logged In</span>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Viewport */}
        <main className="admin-content-scrollable">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
