import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import {
  Modal,
  Table,
  Badge,
  Form,
  Row,
  Col,
  InputGroup,
  Spinner,
  Alert
} from 'react-bootstrap';
import {
  PencilFill,
  TrashFill,
  Search,
  PlusCircleFill,
  CarFrontFill,
  ArrowRepeat,
  CheckCircleFill,
  XCircleFill,
  CloudUploadFill,
  ImageFill
} from 'react-bootstrap-icons';

const API_BASE = 'http://localhost:5174/api';
const CURRENT_YEAR = new Date().getFullYear();

const initialFormData = {
  name: '',
  brand: '',
  model: '',
  year: CURRENT_YEAR,
  registrationNumber: '',
  vehicleType: 'Sedan',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  seatingCapacity: 5,
  color: '',
  description: '',
  rentPerHour: '',
  rentPerDay: '',
  rentPerWeek: '',
  rentPerMonth: '',
  securityDeposit: '',
  extraKilometreCharge: '',
  driverCharge: '',
  minimumBookingDuration: '',
  maximumBookingDuration: '',
  hasAirConditioning: false,
  hasGpsNavigation: false,
  hasBluetooth: false,
  hasSunroof: false,
  hasLeatherSeats: false,
  additionalFeatures: '',
  status: 'Available',
  imageUrls: ''
};

const AdminManageCars = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCarId, setEditCarId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [modalError, setModalError] = useState('');
  const [actionAlert, setActionAlert] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Image file size should not exceed 8MB.');
      return;
    }

    setUploadingImage(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await axios.post(`${API_BASE}/cars/upload-image`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls ? `${prev.imageUrls}, ${res.data.url}` : res.data.url
        }));
      }
    } catch (err) {
      console.warn('Server upload failed, converting to local preview:', err);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64Url = loadEvent.target?.result;
        if (base64Url) {
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls ? `${prev.imageUrls}, ${base64Url}` : base64Url
          }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const urls = (formData.imageUrls || '')
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);
    const updated = urls.filter((_, idx) => idx !== indexToRemove).join(', ');
    setFormData((prev) => ({ ...prev, imageUrls: updated }));
  };

  const fetchCars = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/cars`);
      if (Array.isArray(response.data)) {
        setCars(response.data);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Open Add Car modal if navigated with ?add=true query param
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      openAddModal();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCars();
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditCarId(null);
    setFormData(initialFormData);
    setModalError('');
    setShowModal(true);
  };

  const openEditModal = (car) => {
    setIsEditing(true);
    setEditCarId(car.id);
    setModalError('');

    // Pre-populate formData and convert nulls to empty strings
    const prefill = { ...initialFormData, ...car };
    Object.keys(prefill).forEach((key) => {
      if (prefill[key] === null || prefill[key] === undefined) {
        prefill[key] = '';
      }
    });

    setFormData(prefill);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalError('');
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const sanitizePayload = (data) => {
    const numericFields = [
      'year',
      'seatingCapacity',
      'rentPerHour',
      'rentPerDay',
      'rentPerWeek',
      'rentPerMonth',
      'securityDeposit',
      'extraKilometreCharge',
      'driverCharge',
      'minimumBookingDuration',
      'maximumBookingDuration'
    ];

    const cleaned = { ...data };
    numericFields.forEach((field) => {
      if (cleaned[field] === '' || cleaned[field] === undefined || cleaned[field] === null) {
        if (field === 'year') cleaned[field] = CURRENT_YEAR;
        else if (field === 'seatingCapacity') cleaned[field] = 5;
        else if (field === 'rentPerDay') cleaned[field] = 0;
        else cleaned[field] = null;
      } else {
        cleaned[field] = Number(cleaned[field]);
      }
    });

    if (!cleaned.registrationNumber) {
      cleaned.registrationNumber = 'N/A';
    }

    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError('');

    const payload = sanitizePayload(formData);

    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/cars/${editCarId}`, payload);
        setActionAlert({ type: 'success', message: `Vehicle "${formData.name}" updated successfully!` });
      } else {
        await axios.post(`${API_BASE}/cars`, payload);
        setActionAlert({ type: 'success', message: `Vehicle "${formData.name}" added to fleet catalog successfully!` });
      }

      setShowModal(false);
      fetchCars();

      // Clear alert after 5 seconds
      setTimeout(() => {
        setActionAlert(null);
      }, 5000);
    } catch (err) {
      console.error('Error saving car:', err);
      const msg =
        err.response?.data?.title ||
        err.response?.data?.message ||
        'Failed to save vehicle details. Please check all required fields and try again.';
      setModalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, carName) => {
    if (window.confirm(`Are you sure you want to delete "${carName || 'this vehicle'}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`${API_BASE}/cars/${id}`);
        setCars((prevCars) => prevCars.filter((car) => car.id !== id));
        setActionAlert({ type: 'success', message: `Vehicle "${carName || 'Selected vehicle'}" was deleted successfully.` });
        setTimeout(() => setActionAlert(null), 5000);
      } catch (error) {
        console.error('Error deleting car:', error);
        alert('Failed to delete vehicle. Please try again.');
      }
    }
  };

  const filteredCars = cars.filter(
    (car) =>
      (car.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.model || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-100 pb-4">
      {/* Action Notification Alert */}
      {actionAlert && (
        <Alert
          variant={actionAlert.type}
          dismissible
          onClose={() => setActionAlert(null)}
          className="d-flex align-items-center gap-2 shadow-sm mb-4"
        >
          <CheckCircleFill size={18} />
          <span className="fw-medium">{actionAlert.message}</span>
        </Alert>
      )}

      {/* Top Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '1.75rem', color: '#0f172a' }}>
            Manage Fleet Vehicles
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            View, search, edit availability, and maintain your rental car fleet.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleRefresh}
            className="admin-btn-outline"
            disabled={refreshing}
            title="Refresh fleet list"
          >
            <ArrowRepeat className={refreshing ? 'spin-animation' : ''} size={16} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          {/* Add New Car button opens popup modal */}
          <button
            type="button"
            onClick={openAddModal}
            className="admin-btn-primary"
            title="Add a new vehicle to fleet"
          >
            <PlusCircleFill size={16} />
            <span>Add New Car</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="admin-section-card">
        <div className="admin-section-header">
          <InputGroup style={{ maxWidth: '400px' }}>
            <InputGroup.Text className="bg-light border-end-0 text-muted">
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by vehicle name, brand, or model..."
              className="bg-light border-start-0 ps-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <span className="badge bg-warning text-dark fw-bold px-3 py-2">
            Total: {filteredCars.length} Vehicles
          </span>
        </div>

        <div className="admin-section-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
              <p className="text-muted mt-2 small">Loading fleet inventory...</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon-wrap">
                <CarFrontFill />
              </div>
              <h5 className="admin-empty-title">
                {searchTerm ? 'No Cars Match Your Search' : 'No Vehicles in Fleet'}
              </h5>
              <p className="admin-empty-desc">
                {searchTerm
                  ? 'Try searching with a different vehicle name, brand, or registration plate number.'
                  : 'Start adding vehicles to your rental catalog so customers can view and book them.'}
              </p>
              {searchTerm ? (
                <button onClick={() => setSearchTerm('')} className="admin-btn-outline">
                  Clear Search
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="admin-btn-primary"
                >
                  <PlusCircleFill size={15} />
                  <span>Add First Car</span>
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Vehicle Details</th>
                    <th>Rent / Day</th>
                    <th>Rent / Hour</th>
                    <th>Status</th>
                    <th className="pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => (
                    <tr key={car.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="p-2 rounded-3 bg-light border text-warning d-flex align-items-center justify-content-center"
                            style={{ width: '42px', height: '42px', flexShrink: 0 }}
                          >
                            <CarFrontFill size={20} />
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{car.name}</div>
                            <div className="small text-muted d-flex align-items-center gap-2 flex-wrap mt-1">
                              <span>{car.brand} {car.model}</span>
                              {car.fuelType && <Badge bg="light" text="dark" className="border">{car.fuelType}</Badge>}
                              {car.seatingCapacity && <Badge bg="light" text="dark" className="border">{car.seatingCapacity} Seats</Badge>}
                              {car.extraKilometreCharge && <span className="text-secondary small">₹{car.extraKilometreCharge}/km</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">₹{car.rentPerDay}</div>
                        <div className="small text-muted">per day</div>
                      </td>
                      <td>
                        {car.rentPerHour ? (
                          <>
                            <div className="fw-bold text-dark">₹{car.rentPerHour}</div>
                            <div className="small text-muted">per hour</div>
                          </>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td>
                        <Badge
                          bg={
                            car.status === 'Available'
                              ? 'success'
                              : car.status === 'Booked'
                              ? 'warning'
                              : 'danger'
                          }
                          className="px-2 py-1 fw-semibold"
                        >
                          {car.status || 'Available'}
                        </Badge>
                      </td>
                      <td className="pe-4 text-end">
                        <button
                          type="button"
                          onClick={() => openEditModal(car)}
                          className="btn btn-sm btn-outline-primary me-2 rounded-circle p-2"
                          title="Edit vehicle"
                        >
                          <PencilFill size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-circle p-2"
                          onClick={() => handleDelete(car.id, car.name)}
                          title="Delete vehicle"
                        >
                          <TrashFill size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Car Modal Popup */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
        backdrop="static"
        keyboard={!submitting}
        className="admin-car-modal"
      >
        <Modal.Header closeButton>
          <div className="d-flex align-items-center gap-2">
            <CarFrontFill size={22} className="text-warning" />
            <div>
              <Modal.Title as="h5" className="fw-bold mb-0">
                {isEditing ? `Edit Vehicle: ${formData.name || ''}` : 'Add New Vehicle'}
              </Modal.Title>
              <div className="small text-white-50">
                {isEditing ? 'Modify specifications, tariffs, and features' : 'Enter fleet vehicle details to add to catalog'}
              </div>
            </div>
          </div>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {modalError && (
              <Alert variant="danger" className="d-flex align-items-center gap-2 mb-3 py-2">
                <XCircleFill size={16} />
                <span>{modalError}</span>
              </Alert>
            )}

            {/* 1. Basic Vehicle Information */}
            <div className="admin-modal-card">
              <div className="admin-modal-card-title">
                <span>Basic Vehicle Information</span>
                <span className="badge bg-light text-muted border">Required Details</span>
              </div>

              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Vehicle Display Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      maxLength="300"
                      placeholder="e.g. Toyota Innova Crysta / Mercedes-Benz E-Class"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Brand / Make *</Form.Label>
                    <Form.Control
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Toyota, Maruti Suzuki, Hyundai"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Model *</Form.Label>
                    <Form.Control
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Innova Crysta, Dzire, Fortuner"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Registration Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber || ''}
                      onChange={handleFormChange}
                      placeholder="e.g. GJ-11-AB-1234"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Model Year</Form.Label>
                    <Form.Control
                      type="number"
                      name="year"
                      value={formData.year || ''}
                      onChange={handleFormChange}
                      placeholder="2024"
                      min="2000"
                      max={CURRENT_YEAR + 1}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Vehicle Type</Form.Label>
                    <Form.Select name="vehicleType" value={formData.vehicleType || 'Sedan'} onChange={handleFormChange}>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Compact SUV">Compact SUV</option>
                      <option value="MUV">MUV</option>
                      <option value="Luxury SUV">Luxury SUV</option>
                      <option value="Luxury Sedan">Luxury Sedan</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Electric SUV">Electric SUV</option>
                      <option value="Electric Sedan">Electric Sedan</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small text-dark">
                      Fuel Type * <span className="text-warning fw-bold">(Dropdown)</span>
                    </Form.Label>
                    <Form.Select
                      name="fuelType"
                      value={formData.fuelType || 'Petrol'}
                      onChange={handleFormChange}
                      className="border-warning"
                      required
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="CNG/Petrol">CNG / Petrol</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small text-dark">
                      Seating Capacity *
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="seatingCapacity"
                      value={formData.seatingCapacity || ''}
                      onChange={handleFormChange}
                      min="1"
                      max="50"
                      placeholder="e.g. 5, 7, 8"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Transmission</Form.Label>
                    <Form.Select name="transmission" value={formData.transmission || 'Automatic'} onChange={handleFormChange}>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Color</Form.Label>
                    <Form.Control
                      type="text"
                      name="color"
                      value={formData.color || ''}
                      onChange={handleFormChange}
                      placeholder="e.g. White, Silver, Black"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Availability Status</Form.Label>
                    <Form.Select name="status" value={formData.status || 'Available'} onChange={handleFormChange}>
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <div className="p-3 border rounded-3 bg-light">
                    <Form.Label className="fw-semibold small d-flex align-items-center justify-content-between mb-2">
                      <span className="d-flex align-items-center gap-2">
                        <ImageFill className="text-warning" size={17} />
                        Vehicle Photos / Image Upload
                      </span>
                      {uploadingImage && (
                        <span className="text-primary small d-flex align-items-center gap-1">
                          <Spinner animation="border" size="sm" /> Uploading image...
                        </span>
                      )}
                    </Form.Label>

                    {/* Upload File Input Button */}
                    <div className="mb-2">
                      <label
                        htmlFor="manage-car-image-upload"
                        className="btn btn-outline-warning w-100 d-flex align-items-center justify-content-center gap-2 text-dark bg-white py-2"
                        style={{ borderStyle: 'dashed', cursor: 'pointer', borderWidth: '2px', borderRadius: '10px' }}
                      >
                        <CloudUploadFill size={19} className="text-warning" />
                        <span className="fw-semibold">
                          {uploadingImage ? 'Uploading Image...' : 'Click to Upload Vehicle Image (PNG, JPG, WEBP)'}
                        </span>
                      </label>
                      <input
                        id="manage-car-image-upload"
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </div>

                    {/* Or URL input */}
                    <Form.Group className="mb-2">
                      <Form.Label className="text-muted small mb-1">Or paste image web link directly:</Form.Label>
                      <Form.Control
                        type="text"
                        name="imageUrls"
                        value={formData.imageUrls}
                        onChange={handleFormChange}
                        placeholder="https://example.com/car-photo.jpg"
                        size="sm"
                      />
                    </Form.Group>

                    {/* Image Preview List */}
                    {formData.imageUrls && (
                      <div className="mt-3 pt-2 border-top">
                        <div className="small fw-semibold text-muted mb-2">Selected Photo Preview:</div>
                        <div className="d-flex flex-wrap gap-2">
                          {(formData.imageUrls || '')
                            .split(',')
                            .map((u) => u.trim())
                            .filter(Boolean)
                            .map((url, idx) => (
                              <div
                                key={idx}
                                className="position-relative rounded-3 border overflow-hidden shadow-sm bg-white p-1"
                                style={{ width: '110px', height: '85px' }}
                              >
                                <img
                                  src={url}
                                  alt={`Vehicle preview ${idx + 1}`}
                                  className="w-100 h-100"
                                  style={{ objectFit: 'cover', borderRadius: '6px' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/110x85?text=Car+Image';
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 p-0 rounded-circle d-flex align-items-center justify-content-center shadow"
                                  style={{ width: '22px', height: '22px', fontSize: '10px' }}
                                  title="Remove image"
                                >
                                  <TrashFill size={11} />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Short description of condition, luggage space, guidelines..."
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* 2. Rental Rates & Tariffs */}
            <div className="admin-modal-card">
              <div className="admin-modal-card-title">
                <span>Rental Rates & Tariffs (INR ₹)</span>
                <span className="badge bg-warning text-dark fw-bold">Pricing</span>
              </div>

              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Rent Per Day * (24 Hrs)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="rentPerDay"
                      value={formData.rentPerDay}
                      onChange={handleFormChange}
                      required
                      min="0"
                      placeholder="e.g. 2500"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Hourly Rate (₹/hr)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="rentPerHour"
                      value={formData.rentPerHour}
                      onChange={handleFormChange}
                      min="0"
                      placeholder="e.g. 200"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Extra KM Charge (₹/km)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="extraKilometreCharge"
                      value={formData.extraKilometreCharge}
                      onChange={handleFormChange}
                      min="0"
                      placeholder="e.g. 12"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Driver Allowance / Charge (₹/day)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="driverCharge"
                      value={formData.driverCharge}
                      onChange={handleFormChange}
                      min="0"
                      placeholder="e.g. 500"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Security Deposit (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="securityDeposit"
                      value={formData.securityDeposit}
                      onChange={handleFormChange}
                      min="0"
                      placeholder="e.g. 5000"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* 3. Features & Amenities */}
            <div className="admin-modal-card">
              <div className="admin-modal-card-title">
                <span>Features & Amenities</span>
              </div>

              <Row className="g-2 mb-3">
                <Col xs={6} sm={4}>
                  <Form.Check
                    type="checkbox"
                    id="modal-ac"
                    label="Air Conditioning"
                    name="hasAirConditioning"
                    checked={formData.hasAirConditioning}
                    onChange={handleFormChange}
                  />
                </Col>
                <Col xs={6} sm={4}>
                  <Form.Check
                    type="checkbox"
                    id="modal-gps"
                    label="GPS Navigation"
                    name="hasGpsNavigation"
                    checked={formData.hasGpsNavigation}
                    onChange={handleFormChange}
                  />
                </Col>
                <Col xs={6} sm={4}>
                  <Form.Check
                    type="checkbox"
                    id="modal-bt"
                    label="Bluetooth"
                    name="hasBluetooth"
                    checked={formData.hasBluetooth}
                    onChange={handleFormChange}
                  />
                </Col>
                <Col xs={6} sm={4}>
                  <Form.Check
                    type="checkbox"
                    id="modal-sunroof"
                    label="Sunroof"
                    name="hasSunroof"
                    checked={formData.hasSunroof}
                    onChange={handleFormChange}
                  />
                </Col>
                <Col xs={6} sm={4}>
                  <Form.Check
                    type="checkbox"
                    id="modal-leather"
                    label="Leather Seats"
                    name="hasLeatherSeats"
                    checked={formData.hasLeatherSeats}
                    onChange={handleFormChange}
                  />
                </Col>
              </Row>

              <Form.Group>
                <Form.Label className="fw-semibold small">Additional Features</Form.Label>
                <Form.Control
                  type="text"
                  name="additionalFeatures"
                  value={formData.additionalFeatures}
                  onChange={handleFormChange}
                  placeholder="e.g. Reverse Camera, Push Button Start, Apple CarPlay / Android Auto"
                />
              </Form.Group>
            </div>
          </Modal.Body>

          <Modal.Footer className="d-flex justify-content-between">
            <button
              type="button"
              className="admin-btn-outline"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn-primary px-4"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span>Saving Vehicle...</span>
                </>
              ) : (
                <>
                  <CheckCircleFill size={16} />
                  <span>{isEditing ? 'Update Vehicle' : 'Add Vehicle'}</span>
                </>
              )}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminManageCars;
