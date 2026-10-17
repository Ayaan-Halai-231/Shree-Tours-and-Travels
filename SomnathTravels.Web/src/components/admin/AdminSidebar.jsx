import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Speedometer2,
  CarFrontFill,
  PlusCircleFill,
  CalendarCheckFill,
  BoxArrowRight,
  ShieldCheck,
  X
} from 'react-bootstrap-icons';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Branding Header */}
      <div className="admin-brand-header">
        <div className="admin-brand-icon-wrap">
          <CarFrontFill />
        </div>
        <div className="admin-brand-info">
          <div className="admin-brand-name">
            Shree Tours <span>& Travels</span>
          </div>
          <div className="admin-brand-badge">Admin Dashboard</div>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button
            type="button"
            className="btn btn-link text-white-50 p-0 ms-auto d-lg-none"
            onClick={onClose}
            aria-label="Close Sidebar"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Navigation Label */}
      <div className="admin-nav-section-label">Main Menu</div>

      {/* Navigation Links */}
      <ul className="admin-nav-list">
        <li>
          <NavLink
            to="/admin"
            end
            onClick={handleNavClick}
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">
              <Speedometer2 />
            </span>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/cars"
            onClick={handleNavClick}
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">
              <CarFrontFill />
            </span>
            <span>Manage Cars</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/bookings"
            onClick={handleNavClick}
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">
              <CalendarCheckFill />
            </span>
            <span>Bookings</span>
          </NavLink>
        </li>
      </ul>

      {/* Sidebar Footer with Logged In User Pill and Logout Button */}
      <div className="admin-sidebar-footer">
        <div className="admin-user-pill">
          <div className="admin-avatar">
            <ShieldCheck size={18} />
          </div>
          <div className="admin-user-details">
            <span className="admin-user-name">Administrator</span>
            <span className="admin-user-role">
              <span className="admin-status-dot"></span> Active Session
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="admin-logout-btn"
          title="Sign out of Admin Portal"
        >
          <BoxArrowRight size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
