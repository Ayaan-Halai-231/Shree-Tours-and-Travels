import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Badge, Form, InputGroup, Spinner, Modal, Alert } from 'react-bootstrap';
import {
  Search,
  CalendarCheckFill,
  ArrowRepeat,
  TelephoneFill,
  EnvelopeFill,
  GeoAltFill,
  CarFrontFill,
  CheckCircleFill,
  ClockHistory,
  SendFill,
  CurrencyRupee,
  ExclamationCircleFill
} from 'react-bootstrap-icons';

const API_BASE = 'http://localhost:5174/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'CONFIRMED'

  // Modal & Action states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAmount, setConfirmAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackAlert, setFeedbackAlert] = useState(null); // { type: 'success' | 'warning' | 'danger', message: '' }

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/bookings`);
      if (Array.isArray(response.data)) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setFeedbackAlert({
        type: 'danger',
        message: 'Failed to fetch bookings from server. Please verify backend service.'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };


  const openConfirmModal = (booking) => {
    setSelectedBooking(booking);
    // Suggest estimated total amount if not set
    const defaultAmount = booking.totalAmount && Number(booking.totalAmount) > 0 
      ? booking.totalAmount 
      : booking.vehicle?.toLowerCase().includes('innova') ? 3500
      : booking.vehicle?.toLowerCase().includes('city') ? 2500
      : booking.vehicle?.toLowerCase().includes('dzire') ? 1800 : 2000;
    
    setConfirmAmount(defaultAmount);
    setConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setIsSubmitting(true);
    setFeedbackAlert(null);

    try {
      const payload = {
        totalAmount: confirmAmount ? parseFloat(confirmAmount) : undefined
      };

      const res = await axios.put(`${API_BASE}/bookings/${selectedBooking.id}/confirm`, payload);

      if (res.data && res.data.success) {
        setFeedbackAlert({
          type: 'success',
          message: `Booking #${selectedBooking.id} successfully confirmed! Confirmation email, WhatsApp message, and SMS dispatched to customer (${selectedBooking.email}) and admin.`
        });

        // Update local state immediately
        setBookings(prev =>
          prev.map(b =>
            b.id === selectedBooking.id
              ? {
                  ...b,
                  status: 'Confirmed',
                  totalAmount: res.data.totalAmount || payload.totalAmount || b.totalAmount
                }
              : b
          )
        );

        setConfirmModalOpen(false);
        setSelectedBooking(null);
      } else {
        setFeedbackAlert({
          type: 'danger',
          message: res.data?.message || 'Failed to confirm booking.'
        });
      }
    } catch (err) {
      console.error('Error confirming booking:', err);
      const errMsg = err.response?.data?.message || err.message || 'Error occurred while confirming booking.';
      setFeedbackAlert({
        type: 'danger',
        message: errMsg
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async (booking) => {
    if (!window.confirm(`Resend confirmation notifications (Email, WhatsApp & SMS) for Booking #${booking.id} to customer (${booking.email}) and admin?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.put(`${API_BASE}/bookings/${booking.id}/confirm`, {
        totalAmount: booking.totalAmount || undefined
      });

      if (res.data && res.data.success) {
        setFeedbackAlert({
          type: 'success',
          message: `Confirmation notifications resent successfully for Booking #${booking.id} to both customer and admin!`
        });
      } else {
        setFeedbackAlert({
          type: 'warning',
          message: `Booking #${booking.id} is confirmed, but some notifications could not be dispatched.`
        });
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to resend confirmation email.';
      setFeedbackAlert({
        type: 'danger',
        message: errMsg
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter calculations
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => (b.status || '').toLowerCase() !== 'confirmed').length;
  const confirmedCount = bookings.filter(b => (b.status || '').toLowerCase() === 'confirmed').length;

  const filteredBookings = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (b.fullName && b.fullName.toLowerCase().includes(term)) ||
      (b.email && b.email.toLowerCase().includes(term)) ||
      (b.contactNo && b.contactNo.includes(term)) ||
      (b.vehicle && b.vehicle.toLowerCase().includes(term)) ||
      (b.startDestination && b.startDestination.toLowerCase().includes(term)) ||
      (b.endDestination && b.endDestination.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    const isConfirmed = (b.status || '').toLowerCase() === 'confirmed';
    if (statusFilter === 'PENDING') return !isConfirmed;
    if (statusFilter === 'CONFIRMED') return isConfirmed;
    return true;
  });

  return (
    <div className="w-100 pb-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.75rem', color: '#0f172a' }}>
            Bookings & Reservations
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Manage customer bookings, verify travel itineraries, and trigger automatic confirmation emails.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="admin-btn-outline"
          disabled={refreshing}
          title="Refresh booking list"
        >
          <ArrowRepeat className={refreshing ? 'spin-animation' : ''} size={16} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh List'}</span>
        </button>
      </div>

      {/* Real-time Alert Banner */}
      {feedbackAlert && (
        <Alert
          variant={feedbackAlert.type}
          dismissible
          onClose={() => setFeedbackAlert(null)}
          className="border-0 shadow-sm mb-4 d-flex align-items-center gap-2"
        >
          {feedbackAlert.type === 'success' ? (
            <CheckCircleFill size={18} className="text-success flex-shrink-0" />
          ) : feedbackAlert.type === 'warning' ? (
            <ExclamationCircleFill size={18} className="text-warning flex-shrink-0" />
          ) : (
            <ExclamationCircleFill size={18} className="text-danger flex-shrink-0" />
          )}
          <div>{feedbackAlert.message}</div>
        </Alert>
      )}

      {/* Main Table Card */}
      <div className="admin-section-card">
        {/* Header with Search and Status Filter Tabs */}
        <div className="admin-section-header flex-wrap gap-3">
          <InputGroup style={{ maxWidth: '360px' }}>
            <InputGroup.Text className="bg-light border-end-0 text-muted">
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by customer, email, car, route..."
              className="bg-light border-start-0 ps-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {/* Filter Pills */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-dark' : 'btn-light border'} fw-semibold px-3 py-1`}
              style={{ borderRadius: '20px' }}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`btn btn-sm ${statusFilter === 'PENDING' ? 'btn-warning text-dark' : 'btn-light border'} fw-semibold px-3 py-1`}
              style={{ borderRadius: '20px' }}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('CONFIRMED')}
              className={`btn btn-sm ${statusFilter === 'CONFIRMED' ? 'btn-success text-white' : 'btn-light border'} fw-semibold px-3 py-1`}
              style={{ borderRadius: '20px' }}
            >
              Confirmed ({confirmedCount})
            </button>
          </div>
        </div>

        <div className="admin-section-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
              <p className="text-muted mt-2 small">Loading customer bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon-wrap">
                <CalendarCheckFill />
              </div>
              <h5 className="admin-empty-title">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'No Matching Bookings Found'
                  : 'No Bookings Recorded Yet'}
              </h5>
              <p className="admin-empty-desc">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try adjusting your search query or switching the status filter tab.'
                  : 'Customer inquiries submitted via the booking form on the public website will appear here in real time.'}
              </p>
              {(searchTerm || statusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('ALL');
                  }}
                  className="admin-btn-outline"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Customer Details</th>
                    <th>Vehicle</th>
                    <th>Trip Route</th>
                    <th>Pickup Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th className="pe-4 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => {
                    const isConfirmed = (b.status || '').toLowerCase() === 'confirmed';
                    return (
                      <tr key={b.id}>
                        {/* Customer Info */}
                        <td className="ps-4">
                          <div className="fw-bold text-dark">{b.fullName}</div>
                          <div className="small text-muted d-flex flex-column gap-1 mt-1">
                            <span className="d-flex align-items-center gap-1">
                              <TelephoneFill size={11} className="text-warning" />
                              {b.contactNo}
                            </span>
                            {b.email && (
                              <span className="d-flex align-items-center gap-1">
                                <EnvelopeFill size={11} className="text-primary" />
                                {b.email}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Vehicle */}
                        <td>
                          <span className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 px-2 py-1">
                            <CarFrontFill size={12} className="text-warning" />
                            {b.vehicle}
                          </span>
                        </td>

                        {/* Route */}
                        <td>
                          <div className="small fw-semibold text-dark">
                            <GeoAltFill size={12} className="text-danger me-1" />
                            {b.startDestination} ➔ {b.endDestination}
                          </div>
                        </td>

                        {/* Pickup Date */}
                        <td>
                          <span className="fw-semibold text-dark">
                            {b.pickupDate ? new Date(b.pickupDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </td>

                        {/* Total Amount */}
                        <td>
                          {b.totalAmount && Number(b.totalAmount) > 0 ? (
                            <span className="fw-bold text-success" style={{ fontSize: '0.95rem' }}>
                              ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="badge bg-light text-muted border">
                              Pending Est.
                            </span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td>
                          {isConfirmed ? (
                            <Badge bg="success" className="px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1">
                              <CheckCircleFill size={11} /> Confirmed
                            </Badge>
                          ) : (
                            <Badge bg="warning" text="dark" className="px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1">
                              <ClockHistory size={11} /> Pending
                            </Badge>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="pe-4 text-end">
                          <div className="d-flex justify-content-end align-items-center gap-2">
                            {isConfirmed ? (
                              <button
                                onClick={() => handleResendEmail(b)}
                                disabled={isSubmitting}
                                className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                                title="Resend confirmation notifications to customer & admin"
                                style={{ borderRadius: '6px', fontSize: '0.8rem' }}
                              >
                                <EnvelopeFill size={12} />
                                <span>Resend</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => openConfirmModal(b)}
                                disabled={isSubmitting}
                                className="admin-btn-success"
                                title="Confirm booking and dispatch Email, WhatsApp & SMS to customer & admin"
                                style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
                              >
                                <CheckCircleFill size={13} />
                                <span>Confirm</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation & Email Dispatch Modal */}
      <Modal
        show={confirmModalOpen}
        onHide={() => !isSubmitting && setConfirmModalOpen(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton={!isSubmitting} className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold fs-5 text-dark d-flex align-items-center gap-2">
            <CheckCircleFill className="text-success" size={22} />
            <span>Confirm Booking #{selectedBooking?.id}</span>
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleConfirmSubmit}>
          <Modal.Body className="pt-3">
            {selectedBooking && (
              <>
                <p className="text-muted small mb-3">
                  Confirming this reservation will update its status to Confirmed and automatically dispatch <strong>Email, WhatsApp message, and SMS text message</strong> to both the customer and admin.
                </p>

                {/* Booking Summary Box */}
                <div className="bg-light p-3 rounded-3 mb-3 border">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Customer Name:</span>
                    <strong className="text-dark small">{selectedBooking.fullName}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Registered Email:</span>
                    <strong className="text-primary small">{selectedBooking.email}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Contact Phone:</span>
                    <strong className="text-dark small">{selectedBooking.contactNo}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Vehicle:</span>
                    <strong className="text-dark small">{selectedBooking.vehicle}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Pickup Date:</span>
                    <strong className="text-dark small">
                      {selectedBooking.pickupDate ? new Date(selectedBooking.pickupDate).toLocaleDateString() : 'N/A'}
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Travel Route:</span>
                    <strong className="text-dark small">{selectedBooking.startDestination} ➔ {selectedBooking.endDestination}</strong>
                  </div>
                </div>

                {/* Total Amount Input */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-dark d-flex align-items-center gap-1">
                    <CurrencyRupee size={14} className="text-success" />
                    <span>Total Booking Amount (₹)</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0 text-muted">₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="50"
                      min="100"
                      required
                      placeholder="e.g. 2500"
                      value={confirmAmount}
                      onChange={(e) => setConfirmAmount(e.target.value)}
                      className="border-start-0 ps-0 fw-bold"
                    />
                  </InputGroup>
                  <Form.Text className="text-muted small">
                    This amount will be specified on invoices and message notifications.
                  </Form.Text>
                </Form.Group>

                {/* Multi-channel Delivery Notice */}
                <div className="p-3 rounded-2 d-flex flex-column gap-2" style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981' }}>
                  <div className="d-flex align-items-center gap-2 text-success small fw-bold">
                    <SendFill size={14} />
                    <span>Multi-Channel Notifications Triggered on Confirmation:</span>
                  </div>
                  <div className="text-secondary small d-flex flex-column gap-1" style={{ fontSize: '0.82rem' }}>
                    <div className="d-flex align-items-center gap-2">
                      <EnvelopeFill size={12} className="text-primary" />
                      <span><strong>Email:</strong> Dispatched to {selectedBooking.email} and shreetourstravels50052@gmail.com</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <SendFill size={12} className="text-success" />
                      <span><strong>WhatsApp:</strong> Dispatched to {selectedBooking.contactNo} and admin (+91 9054450052)</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <TelephoneFill size={12} className="text-dark" />
                      <span><strong>SMS (Text):</strong> Dispatched to {selectedBooking.contactNo} and admin (+91 9054450052)</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Modal.Body>

          <Modal.Footer className="border-top-0 pt-0">
            <button
              type="button"
              className="admin-btn-outline"
              onClick={() => setConfirmModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn-success"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" animation="border" className="me-1" />
                  <span>Sending Notifications...</span>
                </>
              ) : (
                <>
                  <SendFill size={14} />
                  <span>Confirm & Send All Notifications</span>
                </>
              )}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminBookings;
