import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNo: '',
    startDestination: '',
    endDestination: '',
    pickupDate: '',
    vehicle: 'Select Vehicle'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5174/api/bookings', formData);
      setMessage('Booking submitted successfully! We will contact you shortly.');
      setFormData({
        fullName: '',
        email: '',
        contactNo: '',
        startDestination: '',
        endDestination: '',
        pickupDate: '',
        vehicle: 'Select Vehicle'
      });
    } catch (error) {
      console.error(error);
      setMessage('Error submitting booking. Please try again.');
    }
  };

  return (
    <Container className="my-5 mt-n5 position-relative" style={{ zIndex: 10, top: '-80px' }}>
      <Card className="shadow-lg border-0 rounded-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <Row className="g-0">
          <Col md={4} className="d-flex flex-column justify-content-center text-white p-5 position-relative">
            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25" style={{ background: 'radial-gradient(circle at top left, #ffc107, transparent 70%)' }}></div>
            <div className="position-relative" style={{ zIndex: 2 }}>
              <h5 className="text-warning fw-bold text-uppercase tracking-wider mb-2">Reserve Your Ride</h5>
              <h2 className="display-5 fw-bold mb-4">Start Your<br/>Journey</h2>
              <p className="text-light mb-4">Experience the best travel service with Shree Tours & Travels. Easy booking, comfortable rides.</p>
              <h4 className="fw-semibold text-warning">Book Now, Pay Later!</h4>
            </div>
          </Col>
          <Col md={8}>
            <Form onSubmit={handleSubmit} className="p-5 bg-white h-100">
              {message && <div className="alert alert-success border-0 shadow-sm">{message}</div>}
              <Row className="g-4">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-muted small text-uppercase fw-bold">Full Name</Form.Label>
                    <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" className="border-0 bg-light shadow-none py-2" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-muted small text-uppercase fw-bold">Email Address</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="border-0 bg-light shadow-none py-2" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-muted small text-uppercase fw-bold">Contact No.</Form.Label>
                    <Form.Control type="text" name="contactNo" value={formData.contactNo} onChange={handleChange} required placeholder="Your Number" className="border-0 bg-light shadow-none py-2" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-muted small text-uppercase fw-bold">Pick-up Location</Form.Label>
                    <Form.Control type="text" name="startDestination" value={formData.startDestination} onChange={handleChange} required placeholder="Starting point" className="border-0 bg-light shadow-none py-2" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-muted small text-uppercase fw-bold">Pick-up Date</Form.Label>
                    <Form.Control type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required className="border-0 bg-light shadow-none py-2" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-muted small text-uppercase fw-bold">Drop-off Location</Form.Label>
                    <Form.Control type="text" name="endDestination" value={formData.endDestination} onChange={handleChange} required placeholder="Destination" className="border-0 bg-light shadow-none py-2" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-muted small text-uppercase fw-bold">Select Vehicle</Form.Label>
                    <Form.Select name="vehicle" value={formData.vehicle} onChange={handleChange} required className="border-0 bg-light shadow-none py-2">
                      <option value="Select Vehicle">Choose...</option>
                      <option value="Honda City">Honda City</option>
                      <option value="Toyota Innova">Toyota Innova</option>
                      <option value="Swift Dzire">Swift Dzire</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={12} className="text-end mt-4">
                  <Button variant="warning" type="submit" size="lg" className="fw-bold px-5 text-dark rounded-3 shadow hover-lift w-100 py-3 text-uppercase tracking-wider">
                    Confirm Booking
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default BookingForm;
