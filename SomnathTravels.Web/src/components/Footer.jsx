import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  EnvelopeFill,
  GeoAltFill,
  Whatsapp,
  ShieldCheck,
  ClockFill,
  ChevronRight,
  TaxiFrontFill,
  StarFill
} from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer
      className="bg-dark text-white pt-5 pb-3 mt-5 position-relative"
      style={{
        borderTop: '4px solid #ffc107',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255, 193, 7, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(255, 193, 7, 0.04) 0%, transparent 40%)'
      }}
    >
      <Container>
        {/* Top Feature Highlights Strip */}
        <div
          className="p-4 rounded-4 mb-5"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Row className="g-3 text-center text-md-start align-items-center">
            <Col lg={3} sm={6}>
              <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255, 193, 7, 0.15)', color: '#ffc107' }}
                >
                  <TaxiFrontFill size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-white">24/7 Cab Service</h6>
                  <small className="text-light text-opacity-50">Anytime booking in Gujarat</small>
                </div>
              </div>
            </Col>
            <Col lg={3} sm={6}>
              <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: 'rgba(40, 167, 69, 0.15)', color: '#28a745' }}
                >
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-white">Transparent Pricing</h6>
                  <small className="text-light text-opacity-50">Zero hidden fees & tolls clear</small>
                </div>
              </div>
            </Col>
            <Col lg={3} sm={6}>
              <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: 'rgba(13, 110, 253, 0.15)', color: '#0d6efd' }}
                >
                  <ClockFill size={22} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-white">Punctual & Reliable</h6>
                  <small className="text-light text-opacity-50">On-time airport & station pickup</small>
                </div>
              </div>
            </Col>
            <Col lg={3} sm={6}>
              <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255, 193, 7, 0.15)', color: '#ffc107' }}
                >
                  <StarFill size={22} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-white">Verified Drivers</h6>
                  <small className="text-light text-opacity-50">Courteous & experienced experts</small>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Main Footer Content */}
        <Row className="g-4 mb-5">
          {/* Column 1: About Company */}
          <Col lg={4} md={6}>
            <div className="pe-lg-4">
              <div className="mb-3 bg-white p-2 rounded-3 d-inline-block shadow-sm">
                <img src={logo} alt="Shree Tours & Travels" height="70" />
              </div>
              <p className="text-light text-opacity-75 small lh-lg mb-3">
                <strong className="text-white">Shree Tours & Travels</strong> is a premier car rental service provider based in Somnath, Gujarat. We are committed to delivering safe, comfortable, and affordable budget & luxury taxi services across all major cities and pilgrimage destinations in Gujarat.
              </p>
              <div className="d-flex align-items-center gap-2">
                <a
                  href="https://wa.me/919054450052"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-success rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center text-decoration-none shadow-sm"
                >
                  <Whatsapp className="me-2" size={16} /> WhatsApp Us
                </a>
              </div>
            </div>
          </Col>

          {/* Column 2: Quick Links */}
          <Col lg={2} md={6}>
            <h5 className="text-warning mb-4 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '1rem' }}>
              Quick Links
            </h5>
            <ul className="list-unstyled text-light text-opacity-75 small lh-lg mb-0">
              <li className="mb-2">
                <Link to="/" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all d-inline-flex align-items-center">
                  <ChevronRight size={12} className="me-2 text-warning" /> Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cars" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all d-inline-flex align-items-center">
                  <ChevronRight size={12} className="me-2 text-warning" /> Available Cars
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all d-inline-flex align-items-center">
                  <ChevronRight size={12} className="me-2 text-warning" /> About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all d-inline-flex align-items-center">
                  <ChevronRight size={12} className="me-2 text-warning" /> FAQs
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all d-inline-flex align-items-center">
                  <ChevronRight size={12} className="me-2 text-warning" /> Contact Us
                </Link>
              </li>
            </ul>
          </Col>

          {/* Column 3: Top Routes & Services */}
          <Col lg={3} md={6}>
            <h5 className="text-warning mb-4 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '1rem' }}>
              Popular Services
            </h5>
            <ul className="list-unstyled text-light text-opacity-75 small lh-lg mb-0">
              <li className="mb-2 d-flex align-items-center">
                <ChevronRight size={12} className="me-2 text-warning flex-shrink-0" />
                <span>Somnath Temple Darshan Cab</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <ChevronRight size={12} className="me-2 text-warning flex-shrink-0" />
                <span>Somnath to Dwarka Tour</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <ChevronRight size={12} className="me-2 text-warning flex-shrink-0" />
                <span>Outstation & Roundtrip Cabs</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <ChevronRight size={12} className="me-2 text-warning flex-shrink-0" />
                <span>Rajkot / Diu Airport Transfer</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <ChevronRight size={12} className="me-2 text-warning flex-shrink-0" />
                <span>Gir National Park Safari Cab</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <ChevronRight size={12} className="me-2 text-warning flex-shrink-0" />
                <span>Luxury Fleet & Innova Crysta</span>
              </li>
            </ul>
          </Col>

          {/* Column 4: Customer Support & Contact */}
          <Col lg={3} md={6}>
            <h5 className="text-warning mb-4 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '1rem' }}>
              Customer Support
            </h5>
            <div
              className="p-3 rounded-3 mb-3"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="small text-warning fw-semibold mb-1">24/7 Booking Helpline:</div>
              <a href="tel:9054450052" className="fs-5 fw-bold text-white text-decoration-none hover-warning transition-all d-block">
                (+91) 9054450052
              </a>
            </div>

            <ul className="list-unstyled text-light text-opacity-75 small lh-lg mb-0">
              <li className="mb-2 d-flex align-items-start">
                <EnvelopeFill className="me-2 text-warning mt-1 flex-shrink-0" />
                <a href="mailto:shreetourstravels50052@gmail.com" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all text-break">
                  shreetourstravels50052@gmail.com
                </a>
              </li>
              <li className="mb-2 d-flex align-items-start">
                <GeoAltFill className="me-2 text-warning mt-1 flex-shrink-0" />
                <span>Somnath, Gir Somnath, Gujarat, India - 362268</span>
              </li>
              <li className="d-flex align-items-center">
                <ClockFill className="me-2 text-warning flex-shrink-0" />
                <span>Open 24 Hours / 7 Days a Week</span>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Footer Bottom Block */}
        <hr className="border-secondary opacity-25 my-4" />
        <Row className="align-items-center gy-3">
          <Col md={7} className="text-center text-md-start">
            <p className="mb-0 text-light text-opacity-50 small">
              Copyright &copy; {new Date().getFullYear()} <strong className="text-white">Shree Tours & Travels</strong>. All Rights Reserved.
            </p>
          </Col>
          <Col md={5} className="text-center text-md-end">
            <p className="mb-0 text-light text-opacity-60 small">
              Developed by <strong className="text-warning">S.H Infotech</strong>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
