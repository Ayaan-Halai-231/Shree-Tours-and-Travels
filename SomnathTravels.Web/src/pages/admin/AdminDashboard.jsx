import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Row, Col, Badge, Spinner } from 'react-bootstrap';
import {
  CarFrontFill,
  CheckCircleFill,
  XCircleFill,
  CalendarCheckFill,
  PlusCircleFill,
  ArrowRight,
  ClockHistory,
  ArrowRepeat,
  ShieldCheck,
  TagFill
} from 'react-bootstrap-icons';

const API_BASE = 'http://localhost:5174/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    unavailableCars: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  const [recentCars, setRecentCars] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      // 1. Fetch Stats & Cars in parallel
      const [statsRes, carsRes, bookingsRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/cars/stats`),
        axios.get(`${API_BASE}/cars`),
        axios.get(`${API_BASE}/bookings`)
      ]);

      let carsData = [];
      if (carsRes.status === 'fulfilled' && Array.isArray(carsRes.value.data)) {
        carsData = carsRes.value.data;
        setRecentCars(carsData.slice(0, 5));
      }

      let bookingsData = [];
      if (bookingsRes.status === 'fulfilled' && Array.isArray(bookingsRes.value.data)) {
        bookingsData = bookingsRes.value.data;
        setRecentBookings(bookingsData.slice(0, 5));
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.data) {
        setStats(statsRes.value.data);
      } else if (carsData.length > 0 || bookingsData.length > 0) {
        // Fallback calculation if stats endpoint is unreachable or requires different params
        const total = carsData.length;
        const available = carsData.filter(c => (c.status || '').toLowerCase() === 'available').length;
        setStats({
          totalCars: total,
          availableCars: available,
          unavailableCars: total - available,
          totalBookings: bookingsData.length,
          totalRevenue: 0
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const hasActivity = recentCars.length > 0 || recentBookings.length > 0;

  return (
    <div className="w-100 pb-4">
      {/* Top Banner / Welcome Row */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.75rem', color: '#0f172a' }}>
            Dashboard Overview
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Monitor fleet availability, track active vehicles, and view incoming customer bookings.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleRefresh}
            className="admin-btn-outline"
            disabled={refreshing}
            title="Refresh dashboard numbers"
          >
            <ArrowRepeat className={refreshing ? 'spin-animation' : ''} size={16} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <Link to="/admin/cars?add=true" className="admin-btn-primary">
            <PlusCircleFill size={16} />
            <span>Add New Car</span>
          </Link>
        </div>
      </div>

      {/* 4 Dashboard Statistics Cards */}
      <Row className="g-3 g-xl-4 mb-4">
        {/* Card 1: Total Cars (Blue) */}
        <Col xs={12} sm={6} xl={3}>
          <div className="admin-stat-card card-blue">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Total Cars</span>
              <div className="admin-stat-icon-wrap">
                <CarFrontFill />
              </div>
            </div>
            <div>
              <div className="admin-stat-number">{stats.totalCars}</div>
              <div className="admin-stat-meta">
                <ShieldCheck className="text-primary" size={14} />
                <span>Registered in fleet catalog</span>
              </div>
            </div>
          </div>
        </Col>

        {/* Card 2: Available Cars (Green) */}
        <Col xs={12} sm={6} xl={3}>
          <div className="admin-stat-card card-green">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Available Cars</span>
              <div className="admin-stat-icon-wrap">
                <CheckCircleFill />
              </div>
            </div>
            <div>
              <div className="admin-stat-number">{stats.availableCars}</div>
              <div className="admin-stat-meta">
                <span className="admin-status-dot"></span>
                <span>Ready for immediate booking</span>
              </div>
            </div>
          </div>
        </Col>

        {/* Card 3: Unavailable Cars (Red) */}
        <Col xs={12} sm={6} xl={3}>
          <div className="admin-stat-card card-red">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Unavailable Cars</span>
              <div className="admin-stat-icon-wrap">
                <XCircleFill />
              </div>
            </div>
            <div>
              <div className="admin-stat-number">{stats.unavailableCars}</div>
              <div className="admin-stat-meta">
                <TagFill className="text-danger" size={13} />
                <span>Booked or in maintenance</span>
              </div>
            </div>
          </div>
        </Col>

        {/* Card 4: Total Bookings (Yellow) */}
        <Col xs={12} sm={6} xl={3}>
          <div className="admin-stat-card card-yellow">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Total Bookings</span>
              <div className="admin-stat-icon-wrap">
                <CalendarCheckFill />
              </div>
            </div>
            <div>
              <div className="admin-stat-number">{stats.totalBookings}</div>
              <div className="admin-stat-meta">
                <ClockHistory className="text-warning" size={13} />
                <span>Customer inquiries & orders</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Fleet Summary & Shortcuts */}
      <div className="admin-section-card mb-4">
        <div className="admin-section-header">
          <div className="admin-section-title">
            <ClockHistory className="text-warning" size={20} />
            <span>Recent Activity & Fleet Status</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Link to="/admin/cars" className="admin-btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
              <span>View All Cars</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="admin-section-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
              <p className="text-muted mt-2 small">Loading activity data...</p>
            </div>
          ) : !hasActivity ? (
            /* Clean Empty State */
            <div className="admin-empty-state">
              <div className="admin-empty-icon-wrap">
                <ClockHistory />
              </div>
              <h5 className="admin-empty-title">No Recent Activity to Display</h5>
              <p className="admin-empty-desc">
                Your fleet and booking records are up to date. Once new cars are registered or customers submit reservations, they will appear here in real-time.
              </p>
              <div className="d-flex gap-2">
                <Link to="/admin/cars?add=true" className="admin-btn-primary">
                  <PlusCircleFill size={15} />
                  <span>Add First Car</span>
                </Link>
                <button onClick={handleRefresh} className="admin-btn-outline">
                  <ArrowRepeat size={15} />
                  <span>Refresh Status</span>
                </button>
              </div>
            </div>
          ) : (
            /* Real Activity List */
            <div className="p-3 p-md-4">
              <div className="row g-3">
                {/* Recent Cars Column */}
                <div className="col-lg-6">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.95rem' }}>
                      Recently Added Vehicles
                    </h6>
                    <span className="badge bg-light text-muted border">
                      {recentCars.length} vehicles
                    </span>
                  </div>
                  <ul className="admin-activity-list">
                    {recentCars.map((car) => (
                      <li key={car.id} className="admin-activity-item">
                        <div className="admin-activity-left">
                          <div
                            className="admin-activity-icon"
                            style={{
                              backgroundColor: car.status === 'Available' ? '#ecfdf5' : '#fee2e2',
                              color: car.status === 'Available' ? '#16a34a' : '#dc2626'
                            }}
                          >
                            <CarFrontFill />
                          </div>
                          <div className="admin-activity-info">
                            <h6 className="admin-activity-title">{car.name}</h6>
                            <p className="admin-activity-sub">
                              {car.brand} • {car.registrationNumber || 'No Plate'} • ₹{car.rentPerDay}/day
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Badge
                            bg={car.status === 'Available' ? 'success' : car.status === 'Booked' ? 'warning' : 'secondary'}
                            className="fw-semibold px-2 py-1"
                          >
                            {car.status}
                          </Badge>
                          <Link
                            to={`/admin/cars/edit/${car.id}`}
                            className="btn btn-sm btn-light border rounded-circle p-1"
                            title="Edit vehicle"
                          >
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent Bookings Column */}
                <div className="col-lg-6">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.95rem' }}>
                      Recent Reservation Inquiries
                    </h6>
                    <span className="badge bg-light text-muted border">
                      {recentBookings.length} bookings
                    </span>
                  </div>

                  {recentBookings.length === 0 ? (
                    <div className="p-4 text-center border rounded-3 bg-light">
                      <CalendarCheckFill className="text-muted mb-2" size={24} />
                      <p className="text-muted mb-0 small">No active customer bookings recorded yet.</p>
                    </div>
                  ) : (
                    <ul className="admin-activity-list">
                      {recentBookings.map((b) => (
                        <li key={b.id} className="admin-activity-item">
                          <div className="admin-activity-left">
                            <div
                              className="admin-activity-icon"
                              style={{ backgroundColor: '#fffbeb', color: '#d97706' }}
                            >
                              <CalendarCheckFill />
                            </div>
                            <div className="admin-activity-info">
                              <h6 className="admin-activity-title">{b.fullName}</h6>
                              <p className="admin-activity-sub">
                                {b.vehicle} • {b.startDestination} ➔ {b.endDestination}
                              </p>
                            </div>
                          </div>
                          <div className="text-end d-flex flex-column align-items-end gap-1">
                            <Badge
                              bg={(b.status || '').toLowerCase() === 'confirmed' ? 'success' : 'warning'}
                              text={(b.status || '').toLowerCase() === 'confirmed' ? 'white' : 'dark'}
                              className="fw-semibold px-2 py-1"
                            >
                              {(b.status || '').toLowerCase() === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </Badge>
                            <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                              {new Date(b.pickupDate).toLocaleDateString()}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
