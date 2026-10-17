import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { ArrowLeft, CheckCircleFill, CloudUploadFill, ImageFill, TrashFill } from 'react-bootstrap-icons';

const CURRENT_YEAR = new Date().getFullYear();
const API_BASE = 'http://localhost:5174/api';

const AdminCarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
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
  });

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

  useEffect(() => {
    if (isEditMode) {
      const fetchCar = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_BASE}/cars/${id}`);
          // Handle null decimal values for inputs
          const carData = response.data;
          Object.keys(carData).forEach(key => {
            if (carData[key] === null) {
              carData[key] = '';
            }
          });
          setFormData(carData);
        } catch (err) {
          console.error("Error fetching car details:", err);
          setError("Failed to load car details.");
        } finally {
          setLoading(false);
        }
      };
      fetchCar();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

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

    const payload = { ...formData };
    numericFields.forEach((field) => {
      if (payload[field] === '' || payload[field] === undefined || payload[field] === null) {
        if (field === 'year') payload[field] = CURRENT_YEAR;
        else if (field === 'seatingCapacity') payload[field] = 5;
        else if (field === 'rentPerDay') payload[field] = 0;
        else payload[field] = null;
      } else {
        payload[field] = Number(payload[field]);
      }
    });

    if (!payload.registrationNumber) {
      payload.registrationNumber = 'N/A';
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_BASE}/cars/${id}`, payload);
      } else {
        await axios.post(`${API_BASE}/cars`, payload);
      }
      navigate('/admin/cars');
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.title || err.response?.data?.message || 'Failed to save car. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" />
        <p className="text-muted mt-2 small">Loading vehicle details...</p>
      </div>
    );
  }

  return (
    <div className="w-100 pb-5">
      {/* Header */}
      <div className="d-flex align-items-center mb-4 gap-3">
        <Link to="/admin/cars" className="admin-btn-outline p-2 rounded-circle" title="Back to Cars">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="fw-bold mb-0" style={{ fontSize: '1.75rem', color: '#0f172a' }}>
            {isEditMode ? 'Edit Vehicle Details' : 'Add New Vehicle'}
          </h2>
          <p className="text-muted mb-0 small">
            {isEditMode
              ? 'Update specifications, pricing, and amenities for this car.'
              : 'Fill in the information below to add a new car to your fleet catalog.'}
          </p>
        </div>
      </div>

      {error && <div className="alert alert-danger shadow-sm">{error}</div>}

      <Form onSubmit={handleSubmit}>
        {/* Basic Details Card */}
        <div className="admin-section-card mb-4">
          <div className="admin-section-header">
            <h5 className="admin-section-title">Basic Vehicle Information</h5>
            <span className="badge bg-light text-muted border">Required Details</span>
          </div>
          <div className="admin-section-body">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Car Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength="300"
                    placeholder="e.g. Mercedes-Benz S-Class / Toyota Innova Crysta"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Brand / Manufacturer *</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Toyota, Hyundai, BMW"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Model *</Form.Label>
                  <Form.Control
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Fortuner, Innova, Creta"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Availability Status</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange}>
                    <option>Available</option>
                    <option>Booked</option>
                    <option>Maintenance</option>
                    <option>Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of vehicle condition, features, or rental guidelines..."
                  />
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
                      htmlFor="car-form-image-upload"
                      className="btn btn-outline-warning w-100 d-flex align-items-center justify-content-center gap-2 text-dark bg-white py-2"
                      style={{ borderStyle: 'dashed', cursor: 'pointer', borderWidth: '2px', borderRadius: '10px' }}
                    >
                      <CloudUploadFill size={19} className="text-warning" />
                      <span className="fw-semibold">
                        {uploadingImage ? 'Uploading Image...' : 'Click to Upload Vehicle Image (PNG, JPG, WEBP)'}
                      </span>
                    </label>
                    <input
                      id="car-form-image-upload"
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
                      onChange={handleChange}
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
            </Row>
          </div>
        </div>

        {/* Pricing Details Card */}
        <div className="admin-section-card mb-4">
          <div className="admin-section-header">
            <h5 className="admin-section-title">Rental Rates & Pricing (INR ₹)</h5>
            <span className="badge bg-warning text-dark fw-bold">Tariffs</span>
          </div>
          <div className="admin-section-body">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Rent Per Day *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="rentPerDay"
                    value={formData.rentPerDay}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="e.g. 2500"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Rent Per Hour</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="rentPerHour"
                    value={formData.rentPerHour}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g. 200"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>

        {/* Features & Amenities */}
        <div className="admin-section-card mb-4">
          <div className="admin-section-header">
            <h5 className="admin-section-title">Features & Amenities</h5>
          </div>
          <div className="admin-section-body">
            <Row className="g-3">
              <Col md={2}>
                <Form.Check
                  type="checkbox"
                  id="ac"
                  label="Air Conditioning"
                  name="hasAirConditioning"
                  checked={formData.hasAirConditioning}
                  onChange={handleChange}
                />
              </Col>
              <Col md={2}>
                <Form.Check
                  type="checkbox"
                  id="gps"
                  label="GPS Navigation"
                  name="hasGpsNavigation"
                  checked={formData.hasGpsNavigation}
                  onChange={handleChange}
                />
              </Col>
              <Col md={2}>
                <Form.Check
                  type="checkbox"
                  id="bluetooth"
                  label="Bluetooth"
                  name="hasBluetooth"
                  checked={formData.hasBluetooth}
                  onChange={handleChange}
                />
              </Col>
              <Col md={2}>
                <Form.Check
                  type="checkbox"
                  id="sunroof"
                  label="Sunroof"
                  name="hasSunroof"
                  checked={formData.hasSunroof}
                  onChange={handleChange}
                />
              </Col>
              <Col md={3}>
                <Form.Check
                  type="checkbox"
                  id="leather"
                  label="Leather Seats"
                  name="hasLeatherSeats"
                  checked={formData.hasLeatherSeats}
                  onChange={handleChange}
                />
              </Col>
              <Col md={12} className="mt-3">
                <Form.Group>
                  <Form.Label className="fw-semibold">Additional Features</Form.Label>
                  <Form.Control
                    type="text"
                    name="additionalFeatures"
                    value={formData.additionalFeatures}
                    onChange={handleChange}
                    placeholder="e.g. Reverse Camera, Push Button Start, Apple CarPlay"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-3 mb-5">
          <Link to="/admin/cars" className="admin-btn-outline px-4">
            Cancel
          </Link>
          <button type="submit" className="admin-btn-primary px-5" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                <span>Saving Vehicle...</span>
              </>
            ) : (
              <>
                <CheckCircleFill size={16} />
                <span>Save Vehicle</span>
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default AdminCarForm;
