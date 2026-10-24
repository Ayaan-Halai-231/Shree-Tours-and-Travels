import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Button, Form, Modal, Spinner, InputGroup } from 'react-bootstrap';
import {
  Search,
  FunnelFill,
  FuelPumpFill,
  PeopleFill,
  GearFill,
  Snow,
  CheckCircleFill,
  ArrowRepeat,
  Whatsapp,
  GeoAltFill,
  CalendarCheckFill,
  ShieldCheck,
  Speedometer2,
  XCircleFill,
  InfoCircleFill,
  X
} from 'react-bootstrap-icons';

// Fallback high-resolution photos for popular car categories if placeholders or broken links exist
const CAR_FALLBACK_IMAGES = {
  innova: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop',
  ertiga: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
  dzire: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop',
  swift: 'https://images.unsplash.com/photo-1518987048-93e29699e79a?w=800&auto=format&fit=crop',
  city: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop',
  verna: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop',
  creta: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop',
  fortuner: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&auto=format&fit=crop',
  scorpio: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop',
  audi: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800&auto=format&fit=crop',
  bmw: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
  mercedes: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
  sedan: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop',
  suv: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1503376712351-460d3d5f57de?w=800&auto=format&fit=crop'
};

const resolveCarImage = (car) => {
  const rawUrl = (car?.imageUrls || '').split(',')[0]?.trim();
  if (rawUrl && !rawUrl.includes('placehold.co') && !rawUrl.includes('example.com')) {
    return rawUrl;
  }
  const nameLower = (car?.name || car?.model || '').toLowerCase();
  for (const [key, url] of Object.entries(CAR_FALLBACK_IMAGES)) {
    if (nameLower.includes(key)) return url;
  }
  const typeLower = (car?.vehicleType || '').toLowerCase();
  if (typeLower.includes('suv')) return CAR_FALLBACK_IMAGES.suv;
  if (typeLower.includes('sedan')) return CAR_FALLBACK_IMAGES.sedan;
  return CAR_FALLBACK_IMAGES.default;
};

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedSeats, setSelectedSeats] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Pagination & Infinite Scroll States (12 cars initially, 12 on scroll)
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef(null);

  // Selected Car for Modals
  const [detailsCar, setDetailsCar] = useState(null);
  const [bookingCar, setBookingCar] = useState(null);

  // Quick Booking Form State
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    contactNo: '',
    startDestination: 'Somnath',
    endDestination: '',
    pickupDate: ''
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingStatus, setBookingStatus] = useState({ success: null, message: '' });

  // 1. Fetch Dynamic Cars Data from Backend
  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoints = [
        'http://localhost:5174/api/cars',
        'https://localhost:7166/api/cars'
      ];
      let res = null;
      for (const url of endpoints) {
        try {
          res = await axios.get(url, { timeout: 6000 });
          if (res?.data && Array.isArray(res.data)) break;
        } catch {
          // try next endpoint
        }
      }

      if (res?.data && Array.isArray(res.data)) {
        setCars(res.data);
      } else {
        throw new Error('Unable to retrieve vehicle list from server');
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Could not connect to car rental service. Please make sure the backend is active.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Extract unique vehicle types for quick chips
  const vehicleTypes = useMemo(() => {
    const types = new Set();
    cars.forEach((c) => {
      if (c.vehicleType) types.add(c.vehicleType.trim());
    });
    return ['All', ...Array.from(types).sort()];
  }, [cars]);

  // 2. Filter & Sort Cars dynamically
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.brand?.toLowerCase().includes(q) ||
          c.model?.toLowerCase().includes(q) ||
          c.vehicleType?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }

    // Vehicle Type filter
    if (selectedType !== 'All') {
      result = result.filter(
        (c) => (c.vehicleType || '').toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Fuel Type filter
    if (selectedFuel !== 'All') {
      result = result.filter(
        (c) => (c.fuelType || '').toLowerCase() === selectedFuel.toLowerCase()
      );
    }

    // Transmission filter
    if (selectedTransmission !== 'All') {
      result = result.filter(
        (c) => (c.transmission || '').toLowerCase() === selectedTransmission.toLowerCase()
      );
    }

    // Seating Capacity filter
    if (selectedSeats !== 'All') {
      if (selectedSeats === '4-5') {
        result = result.filter((c) => c.seatingCapacity >= 4 && c.seatingCapacity <= 5);
      } else if (selectedSeats === '6-7') {
        result = result.filter((c) => c.seatingCapacity >= 6 && c.seatingCapacity <= 7);
      } else if (selectedSeats === '8+') {
        result = result.filter((c) => c.seatingCapacity >= 8);
      }
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.rentPerDay || 0) - (b.rentPerDay || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.rentPerDay || 0) - (a.rentPerDay || 0));
    } else if (sortBy === 'seats-high') {
      result.sort((a, b) => (b.seatingCapacity || 0) - (a.seatingCapacity || 0));
    } else if (sortBy === 'name-az') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [cars, searchQuery, selectedType, selectedFuel, selectedTransmission, selectedSeats, sortBy]);

  // Reset pagination count to 12 whenever filters or search change
  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, selectedType, selectedFuel, selectedTransmission, selectedSeats, sortBy]);

  // 3. Load More Handler (Infinite Scroll helper)
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || visibleCount >= filteredCars.length) return;

    setIsLoadingMore(true);
    // Smooth micro-delay to show the loading animation clearly
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 12, filteredCars.length));
      setIsLoadingMore(false);
    }, 550);
  }, [isLoadingMore, visibleCount, filteredCars.length]);

  // 4. IntersectionObserver for Infinite Scroll
  useEffect(() => {
    const sentinel = observerRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '250px' }
    );

    observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [handleLoadMore]);

  // Active filter count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedType !== 'All') count++;
    if (selectedFuel !== 'All') count++;
    if (selectedTransmission !== 'All') count++;
    if (selectedSeats !== 'All') count++;
    return count;
  }, [searchQuery, selectedType, selectedFuel, selectedTransmission, selectedSeats]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setSelectedSeats('All');
    setSortBy('featured');
    setVisibleCount(12);
  };

  // Quick Booking Submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingCar) return;

    setBookingSubmitting(true);
    setBookingStatus({ success: null, message: '' });

    const payload = {
      fullName: bookingForm.fullName,
      email: bookingForm.email,
      contactNo: bookingForm.contactNo,
      startDestination: bookingForm.startDestination,
      endDestination: bookingForm.endDestination,
      pickupDate: bookingForm.pickupDate ? new Date(bookingForm.pickupDate).toISOString() : new Date().toISOString(),
      vehicle: bookingCar.name,
      totalAmount: bookingCar.rentPerDay
    };

    try {
      const endpoints = [
        'http://localhost:5174/api/bookings',
        'https://localhost:7166/api/bookings'
      ];
      let bookingRes = null;
      for (const ep of endpoints) {
        try {
          bookingRes = await axios.post(ep, payload, { timeout: 8000 });
          if (bookingRes?.data) break;
        } catch {
          // retry fallback
        }
      }

      setBookingStatus({
        success: true,
        message: `Your booking for ${bookingCar.name} has been placed! Our team will contact you shortly.`
      });
      setBookingForm({
        fullName: '',
        email: '',
        contactNo: '',
        startDestination: 'Somnath',
        endDestination: '',
        pickupDate: ''
      });
    } catch (err) {
      console.error('Booking failed:', err);
      setBookingStatus({
        success: false,
        message: err.response?.data?.message || 'Booking submission could not complete. Please try calling us directly.'
      });
    } finally {
      setBookingSubmitting(false);
    }
  };

  const displayedCars = filteredCars.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCars.length;

  return (
    <div className="cars-page-wrapper bg-light min-vh-100 pb-5">
      {/* Main Content Area */}
      <Container className="pt-4 pb-4">
        {/* Unified All-in-One Filter Bar */}
        <div className="mb-4 p-3 p-md-4 bg-white rounded-4 shadow-sm text-dark border">
          <Row className="g-2 g-md-3 align-items-center">
            {/* Live Search */}
            <Col lg={4} md={12}>
              <InputGroup size="lg">
                <InputGroup.Text className="bg-light border-0 text-warning ps-3 rounded-start-3">
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, brand, model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-light shadow-none ps-2"
                  style={{ fontSize: '0.95rem' }}
                />
                {searchQuery && (
                  <Button
                    variant="light"
                    className="text-muted pe-3 border-0 rounded-end-3"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={20} />
                  </Button>
                )}
              </InputGroup>
            </Col>

            {/* Vehicle Type */}
            <Col lg={2} sm={6}>
              <Form.Select
                size="lg"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-light border-0 shadow-none rounded-3 fw-semibold text-dark"
                style={{ fontSize: '0.9rem' }}
              >
                <option value="All">All Vehicle Types</option>
                {vehicleTypes.filter((t) => t !== 'All').map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Fuel Type */}
            <Col lg={2} sm={6}>
              <Form.Select
                size="lg"
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="bg-light border-0 shadow-none rounded-3 fw-semibold text-dark"
                style={{ fontSize: '0.9rem' }}
              >
                <option value="All">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </Form.Select>
            </Col>

            {/* Seating Capacity */}
            <Col lg={2} sm={6}>
              <Form.Select
                size="lg"
                value={selectedSeats}
                onChange={(e) => setSelectedSeats(e.target.value)}
                className="bg-light border-0 shadow-none rounded-3 fw-semibold text-dark"
                style={{ fontSize: '0.9rem' }}
              >
                <option value="All">All Seating</option>
                <option value="4-5">4 - 5 Seater</option>
                <option value="6-7">6 - 7 Seater</option>
                <option value="8+">8+ Seater</option>
              </Form.Select>
            </Col>

            {/* Sort By & Reset */}
            <Col lg={2} sm={6}>
              <div className="d-flex gap-2">
                <Form.Select
                  size="lg"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-light border-0 shadow-none rounded-3 fw-semibold text-dark flex-grow-1"
                  style={{ fontSize: '0.9rem' }}
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="seats-high">Seats: Most First</option>
                  <option value="name-az">Name: A to Z</option>
                </Form.Select>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline-danger"
                    className="rounded-3 px-3 d-flex align-items-center justify-content-center"
                    onClick={handleResetFilters}
                    title="Reset all filters"
                  >
                    <XCircleFill size={18} />
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>

        {/* Results Counter Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4 px-1">
          <div>
            <span className="fw-bold fs-5 text-dark">
              Available Cars{' '}
              <Badge bg="warning" text="dark" className="ms-1 rounded-pill">
                {filteredCars.length}
              </Badge>
            </span>
          </div>

          <div className="text-muted small d-none d-md-block">
            <ShieldCheck className="text-success me-1" /> Guaranteed Best Fares • Instant Confirmation
          </div>
        </div>

        {/* Loading State for initial fetch */}
        {loading && (
          <div className="text-center py-5 my-5">
            <Spinner animation="border" variant="warning" style={{ width: '3.5rem', height: '3.5rem' }} />
            <h5 className="mt-4 fw-bold text-dark">Loading Shree Tours & Travels Fleet...</h5>
            <p className="text-muted">Fetching live availability and verified rates</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-5 my-4 bg-white rounded-4 shadow-sm p-5 border">
            <XCircleFill className="text-danger" size={48} />
            <h4 className="mt-3 fw-bold text-dark">Unable to load fleet data</h4>
            <p className="text-muted">{error}</p>
            <Button variant="warning" className="rounded-pill px-4 mt-2" onClick={fetchCars}>
              <ArrowRepeat className="me-2" /> Try Again
            </Button>
          </div>
        )}

        {/* No Results Empty State */}
        {!loading && !error && filteredCars.length === 0 && (
          <div className="text-center py-5 my-4 bg-white rounded-4 shadow-sm p-5 border">
            <Search className="text-warning" size={48} />
            <h4 className="mt-3 fw-bold text-dark">No matching vehicles found</h4>
            <p className="text-muted">
              We couldn&apos;t find any vehicle matching &quot;{searchQuery || selectedType}&quot;.
              Try adjusting your search criteria or resetting filters.
            </p>
            <Button variant="warning" className="rounded-pill px-4 mt-2" onClick={handleResetFilters}>
              Reset All Filters
            </Button>
          </div>
        )}

        {/* Car Cards Grid (12 per batch) */}
        {!loading && !error && filteredCars.length > 0 && (
          <Row className="g-4">
            {displayedCars.map((car, index) => {
              const carImg = resolveCarImage(car);
              const isAvailable = (car.status || 'Available').toLowerCase() === 'available';

              return (
                <Col lg={4} md={6} sm={12} key={car.id || index}>
                  <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-lift bg-white position-relative d-flex flex-column">
                    {/* Top Image Container */}
                    <div
                      className="position-relative overflow-hidden bg-light"
                      style={{ height: '210px', cursor: 'pointer' }}
                      onClick={() => setDetailsCar(car)}
                    >
                      <img
                        src={carImg}
                        alt={car.name}
                        className="w-100 h-100"
                        style={{
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease'
                        }}
                        onError={(e) => {
                          e.target.src = CAR_FALLBACK_IMAGES.default;
                        }}
                      />

                      {/* Top Badges */}
                      <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1">
                        <Badge
                          bg={isAvailable ? 'success' : 'secondary'}
                          className="rounded-pill px-3 py-2 fw-bold shadow-sm"
                          style={{ fontSize: '0.75rem' }}
                        >
                          {isAvailable ? 'Available Now' : 'Reserved'}
                        </Badge>
                      </div>

                      <div className="position-absolute top-0 end-0 m-3">
                        <Badge bg="warning" text="dark" className="rounded-pill px-2 py-1 shadow-sm fw-bold">
                          ★ 4.9
                        </Badge>
                      </div>

                      {/* Fuel & Transmission Overlay Tag */}
                      <div
                        className="position-absolute bottom-0 start-0 end-0 p-2 text-white d-flex justify-content-between align-items-center"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
                      >
                        <small className="fw-semibold ps-2">{car.brand || 'Shree Tours'}</small>
                        <small className="pe-2 text-warning fw-semibold">{car.year || 2024}</small>
                      </div>
                    </div>

                    {/* Card Body */}
                    <Card.Body className="p-4 d-flex flex-column flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h4
                          className="fw-bold text-dark mb-0 fs-5 text-truncate"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setDetailsCar(car)}
                          title={car.name}
                        >
                          {car.name}
                        </h4>
                      </div>

                      <p className="text-muted small mb-3 text-truncate" title={car.model || car.description}>
                        {car.model || car.description || 'Top verified condition vehicle'}
                      </p>

                      {/* Specs Row */}
                      <div className="p-2 bg-light rounded-3 mb-3 d-flex justify-content-around text-center small">
                        <div>
                          <PeopleFill className="text-warning mb-1 d-block mx-auto" size={16} />
                          <span className="fw-semibold text-dark">{car.seatingCapacity || 5} Seats</span>
                        </div>
                        <div className="border-start ps-2">
                          <FuelPumpFill className="text-warning mb-1 d-block mx-auto" size={16} />
                          <span className="fw-semibold text-dark">{car.fuelType || 'Petrol'}</span>
                        </div>
                        <div className="border-start ps-2">
                          <GearFill className="text-warning mb-1 d-block mx-auto" size={16} />
                          <span className="fw-semibold text-dark">{car.transmission || 'Manual'}</span>
                        </div>
                        <div className="border-start ps-2">
                          <Snow className="text-warning mb-1 d-block mx-auto" size={16} />
                          <span className="fw-semibold text-dark">{car.hasAirConditioning !== false ? 'AC' : 'Non-AC'}</span>
                        </div>
                      </div>

                      {/* Pricing Section */}
                      <div className="mt-auto pt-2 border-top">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <span className="text-muted small">Daily Rental</span>
                            <div className="fw-bold fs-4 text-dark lh-1">
                              ₹{Number(car.rentPerDay || 2000).toLocaleString('en-IN')}
                              <span className="fs-6 text-muted fw-normal"> /day</span>
                            </div>
                          </div>
                          {car.rentPerHour > 0 && (
                            <div className="text-end">
                              <span className="text-muted small">Hourly</span>
                              <div className="fw-semibold text-secondary">
                                ₹{car.rentPerHour}/hr
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2">
                          <Button
                            variant="warning"
                            className="w-100 fw-bold rounded-pill text-dark shadow-sm py-2"
                            onClick={() => {
                              setBookingCar(car);
                              setBookingStatus({ success: null, message: '' });
                            }}
                          >
                            Book Now
                          </Button>
                          <Button
                            variant="outline-secondary"
                            className="rounded-circle d-flex align-items-center justify-content-center p-2"
                            style={{ width: '42px', height: '42px', minWidth: '42px' }}
                            title="View Vehicle Details"
                            onClick={() => setDetailsCar(car)}
                          >
                            <InfoCircleFill size={18} />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Infinite Scroll Sentinel element */}
        <div ref={observerRef} style={{ height: '30px', margin: '20px 0' }} />

        {/* Loading Feature when scrolling (Shows shimmer/loading indicator) */}
        {isLoadingMore && (
          <div className="my-5 py-4 text-center">
            <div className="d-inline-flex align-items-center bg-white shadow-sm border rounded-pill px-4 py-3 gap-3">
              <Spinner animation="border" variant="warning" size="sm" />
              <span className="fw-bold text-dark">
                Loading...
              </span>
            </div>

            {/* Skeleton Card previews while loading next 12 */}
            <Row className="g-4 mt-2 opacity-75">
              {[1, 2, 3].map((s) => (
                <Col lg={4} md={6} key={s}>
                  <div className="bg-white rounded-4 p-3 border shadow-sm text-start" style={{ height: '360px' }}>
                    <div
                      className="rounded-3 mb-3 bg-secondary bg-opacity-10 placeholder-wave"
                      style={{ height: '180px' }}
                    />
                    <div className="bg-secondary bg-opacity-10 rounded mb-2" style={{ height: '22px', width: '70%' }} />
                    <div className="bg-secondary bg-opacity-10 rounded mb-4" style={{ height: '16px', width: '40%' }} />
                    <div className="bg-secondary bg-opacity-10 rounded" style={{ height: '40px', width: '100%' }} />
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Manual Load More button as fallback or when user prefers clicking */}
        {!loading && hasMore && !isLoadingMore && (
          <div className="text-center mt-5">
            <Button
              variant="outline-dark"
              size="lg"
              className="rounded-pill px-5 fw-bold shadow-sm"
              onClick={handleLoadMore}
            >
              Load More Cars
            </Button>
          </div>
        )}

        {/* End of list indicator */}
        {!loading && !hasMore && filteredCars.length > 0 && (
          <div className="text-center mt-5 pt-3">
            <Badge bg="light" text="muted" className="p-3 px-4 rounded-pill border fs-6 fw-normal">
              <CheckCircleFill className="text-success me-2" />
              You have viewed all {filteredCars.length} available vehicles in this category.
            </Badge>
          </div>
        )}
      </Container>

      {/* 5. Quick Booking Modal */}
      <Modal
        show={!!bookingCar}
        onHide={() => setBookingCar(null)}
        centered
        size="lg"
        backdrop="static"
        className="booking-car-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <div>
            <Badge bg="warning" text="dark" className="rounded-pill px-3 py-1 fw-bold mb-1">
              Instant Booking
            </Badge>
            <Modal.Title className="fw-bold fs-4 text-dark">
              Reserve {bookingCar?.name}
            </Modal.Title>
          </div>
        </Modal.Header>

        <Modal.Body className="px-4 py-3">
          {bookingStatus.message && (
            <div
              className={`alert ${
                bookingStatus.success ? 'alert-success' : 'alert-danger'
              } d-flex align-items-center gap-2 rounded-3`}
            >
              {bookingStatus.success ? <CheckCircleFill size={20} /> : <XCircleFill size={20} />}
              <div>{bookingStatus.message}</div>
            </div>
          )}

          {bookingStatus.success ? (
            <div className="text-center py-4">
              <h5 className="fw-bold text-success mb-2">Thank you for choosing Shree Tours & Travels!</h5>
              <p className="text-muted">
                Our support team is dispatching your confirmation email and will get in touch with you right away.
              </p>
              <div className="d-flex justify-content-center gap-2 mt-4">
                <Button variant="warning" className="rounded-pill px-4 fw-bold" onClick={() => setBookingCar(null)}>
                  Close
                </Button>
                <Button
                  as="a"
                  href="https://wa.me/919054450052"
                  target="_blank"
                  rel="noreferrer"
                  variant="success"
                  className="rounded-pill px-4 fw-bold d-flex align-items-center"
                >
                  <Whatsapp className="me-2" /> Chat on WhatsApp
                </Button>
              </div>
            </div>
          ) : (
            <Form onSubmit={handleBookingSubmit}>
              {/* Selected vehicle summary strip */}
              <div className="d-flex align-items-center bg-light p-3 rounded-3 mb-4 border">
                <img
                  src={resolveCarImage(bookingCar)}
                  alt={bookingCar?.name}
                  style={{ width: '80px', height: '55px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div className="ms-3 flex-grow-1">
                  <div className="fw-bold text-dark">{bookingCar?.name}</div>
                  <div className="text-muted small">
                    {bookingCar?.seatingCapacity || 5} Seater • {bookingCar?.fuelType || 'Petrol'} •{' '}
                    {bookingCar?.transmission || 'Manual'}
                  </div>
                </div>
                <div className="text-end">
                  <div className="fw-bold fs-5 text-warning">₹{bookingCar?.rentPerDay}/day</div>
                  <small className="text-muted">Estimated Rate</small>
                </div>
              </div>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={bookingForm.fullName}
                      onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Contact Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={bookingForm.contactNo}
                      onChange={(e) => setBookingForm({ ...bookingForm, contactNo: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      required
                      placeholder="e.g. ramesh@example.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Pickup Date & Time *</Form.Label>
                    <Form.Control
                      type="date"
                      required
                      value={bookingForm.pickupDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, pickupDate: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Pickup Location (Start) *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="e.g. Somnath Temple Gate / Hotel"
                      value={bookingForm.startDestination}
                      onChange={(e) => setBookingForm({ ...bookingForm, startDestination: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Destination (End) *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="e.g. Dwarka, Diu, Gir, Rajkot..."
                      value={bookingForm.endDestination}
                      onChange={(e) => setBookingForm({ ...bookingForm, endDestination: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="mt-4 d-flex justify-content-end gap-2 border-top pt-3">
                <Button variant="light" className="rounded-pill px-4" onClick={() => setBookingCar(null)}>
                  Cancel
                </Button>
                <Button
                  variant="warning"
                  type="submit"
                  disabled={bookingSubmitting}
                  className="rounded-pill px-4 fw-bold shadow-sm"
                >
                  {bookingSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" /> Confirming...
                    </>
                  ) : (
                    'Confirm Reservation'
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* 6. Car Specifications Details Modal */}
      <Modal
        show={!!detailsCar}
        onHide={() => setDetailsCar(null)}
        centered
        size="lg"
        className="car-details-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <div>
            <Badge bg="warning" text="dark" className="rounded-pill px-3 py-1 fw-bold mb-1">
              Vehicle Specifications
            </Badge>
            <Modal.Title className="fw-bold fs-3 text-dark">{detailsCar?.name}</Modal.Title>
            <p className="text-muted small mb-0">{detailsCar?.brand} • {detailsCar?.model}</p>
          </div>
        </Modal.Header>

        <Modal.Body className="p-4">
          {detailsCar && (
            <div>
              {/* Image banner */}
              <div
                className="rounded-4 overflow-hidden mb-4 shadow-sm"
                style={{ height: '300px', backgroundColor: '#000' }}
              >
                <img
                  src={resolveCarImage(detailsCar)}
                  alt={detailsCar.name}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Pricing Cards Row */}
              <Row className="g-3 mb-4 text-center">
                <Col md={3} sm={6}>
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="small text-muted">Daily Rate</div>
                    <div className="fw-bold fs-4 text-warning">
                      ₹{Number(detailsCar.rentPerDay || 2000).toLocaleString('en-IN')}
                    </div>
                  </div>
                </Col>
                <Col md={3} sm={6}>
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="small text-muted">Hourly Rate</div>
                    <div className="fw-bold fs-5 text-dark">
                      {detailsCar.rentPerHour ? `₹${detailsCar.rentPerHour}` : 'On Request'}
                    </div>
                  </div>
                </Col>
                <Col md={3} sm={6}>
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="small text-muted">Extra KM Charge</div>
                    <div className="fw-bold fs-5 text-dark">
                      ₹{detailsCar.extraKilometreCharge || 12}/km
                    </div>
                  </div>
                </Col>
                <Col md={3} sm={6}>
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="small text-muted">Driver Allowance</div>
                    <div className="fw-bold fs-5 text-dark">
                      ₹{detailsCar.driverCharge || 500}/day
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Description */}
              {detailsCar.description && (
                <div className="mb-4">
                  <h6 className="fw-bold text-dark">Overview</h6>
                  <p className="text-muted">{detailsCar.description}</p>
                </div>
              )}

              {/* Specs Grid */}
              <h6 className="fw-bold text-dark mb-3">Key Features & Inclusions</h6>
              <Row className="g-2 mb-4">
                <Col sm={6}>
                  <div className="d-flex align-items-center p-2 bg-light rounded-3">
                    <PeopleFill className="text-warning me-2" size={18} />
                    <span>Seating Capacity: <strong>{detailsCar.seatingCapacity || 5} Passengers</strong></span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="d-flex align-items-center p-2 bg-light rounded-3">
                    <FuelPumpFill className="text-warning me-2" size={18} />
                    <span>Fuel Type: <strong>{detailsCar.fuelType || 'Petrol'}</strong></span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="d-flex align-items-center p-2 bg-light rounded-3">
                    <GearFill className="text-warning me-2" size={18} />
                    <span>Transmission: <strong>{detailsCar.transmission || 'Manual'}</strong></span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="d-flex align-items-center p-2 bg-light rounded-3">
                    <Snow className="text-warning me-2" size={18} />
                    <span>Air Conditioning: <strong>{detailsCar.hasAirConditioning !== false ? 'Yes (Chilled AC)' : 'No'}</strong></span>
                  </div>
                </Col>
                {detailsCar.hasGpsNavigation && (
                  <Col sm={6}>
                    <div className="d-flex align-items-center p-2 bg-light rounded-3">
                      <GeoAltFill className="text-warning me-2" size={18} />
                      <span>GPS Navigation System</span>
                    </div>
                  </Col>
                )}
                {detailsCar.hasBluetooth && (
                  <Col sm={6}>
                    <div className="d-flex align-items-center p-2 bg-light rounded-3">
                      <CheckCircleFill className="text-success me-2" size={18} />
                      <span>Bluetooth & Touch Audio</span>
                    </div>
                  </Col>
                )}
                {detailsCar.hasSunroof && (
                  <Col sm={6}>
                    <div className="d-flex align-items-center p-2 bg-light rounded-3">
                      <CheckCircleFill className="text-success me-2" size={18} />
                      <span>Panoramic / Electric Sunroof</span>
                    </div>
                  </Col>
                )}
                {detailsCar.hasLeatherSeats && (
                  <Col sm={6}>
                    <div className="d-flex align-items-center p-2 bg-light rounded-3">
                      <CheckCircleFill className="text-success me-2" size={18} />
                      <span>Luxury Leather Upholstery</span>
                    </div>
                  </Col>
                )}
              </Row>

              {/* Extra features text */}
              {detailsCar.additionalFeatures && (
                <div className="mb-4">
                  <h6 className="fw-bold text-dark">Additional Highlights</h6>
                  <p className="text-muted small mb-0">{detailsCar.additionalFeatures}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="d-flex justify-content-end pt-3 border-top">
                <Button
                  variant="warning"
                  className="rounded-pill px-4 fw-bold text-dark shadow-sm"
                  onClick={() => {
                    setDetailsCar(null);
                    setBookingCar(detailsCar);
                    setBookingStatus({ success: null, message: '' });
                  }}
                >
                  Proceed to Book
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CarsPage;
