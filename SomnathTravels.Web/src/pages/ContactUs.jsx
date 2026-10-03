import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { GeoAltFill, TelephoneFill, EnvelopeFill } from 'react-bootstrap-icons';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitStatus('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="bg-light">
      <div className="bg-dark text-white py-5 text-center">
        <h2 className="display-4 fw-bold">Contact Us</h2>
        <p className="text-warning fs-5">Get In Touch</p>
      </div>

      <Container className="py-5">
        <Row className="g-5">
          <Col md={5}>
            <div className="bg-white p-4 rounded-4 shadow-sm h-100 border-top border-warning border-5">
              <h3 className="fw-bold mb-4">Contact Information</h3>
              <p className="text-muted mb-5">
                If you have any questions, just fill in the contact form, and we will answer you shortly. If you are living nearby, come visit us!
              </p>
              
              <div className="d-flex mb-4 align-items-center">
                <div className="bg-warning text-dark p-3 rounded-circle me-3 d-flex justify-content-center align-items-center" style={{width: '50px', height: '50px'}}>
                  <GeoAltFill size={20} />
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Address</h5>
                  <p className="text-muted mb-0">Somnath, Gujarat, India.</p>
                </div>
              </div>
              
              <div className="d-flex mb-4 align-items-center">
                <div className="bg-warning text-dark p-3 rounded-circle me-3 d-flex justify-content-center align-items-center" style={{width: '50px', height: '50px'}}>
                  <TelephoneFill size={20} />
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Phone Number</h5>
                  <p className="text-muted mb-0">+91 9924483215</p>
                  <p className="text-muted mb-0">+91 9712472876</p>
                </div>
              </div>
              
              <div className="d-flex mb-4 align-items-center">
                <div className="bg-warning text-dark p-3 rounded-circle me-3 d-flex justify-content-center align-items-center" style={{width: '50px', height: '50px'}}>
                  <EnvelopeFill size={20} />
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Email Address</h5>
                  <p className="text-muted mb-0">shreetoursandtravels@gmail.com</p>
                </div>
              </div>
            </div>
          </Col>
          
          <Col md={7}>
            <div className="bg-white p-5 rounded-4 shadow-sm">
              <h3 className="fw-bold mb-4">Send Us a Message</h3>
              {submitStatus && <div className="alert alert-success">{submitStatus}</div>}
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="bg-light border-0 py-3 px-4 rounded-3" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="bg-light border-0 py-3 px-4 rounded-3" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required className="bg-light border-0 py-3 px-4 rounded-3" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Control type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required className="bg-light border-0 py-3 px-4 rounded-3" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Control as="textarea" name="message" value={formData.message} onChange={handleChange} rows={5} placeholder="Message" required className="bg-light border-0 py-3 px-4 rounded-3" />
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mt-4">
                    <Button variant="warning" type="submit" size="lg" className="fw-bold px-5 text-dark rounded-pill">
                      Send Message
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
