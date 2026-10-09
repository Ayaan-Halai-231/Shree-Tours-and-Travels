import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ShieldCheck } from 'react-bootstrap-icons';
import driverImg from '../assets/driver_new.jpg';

const AppBlock = () => {
  return (
    <div className="py-5 bg-dark text-white position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)' }}>
      <Container className="position-relative z-index-1">
        <Row className="align-items-center">
          <Col md={7} className="mb-4 mb-md-0">
            <h5 className="text-warning fw-bold text-uppercase tracking-wider mb-3">Premium Chauffeur Service</h5>
            <h2 className="display-4 fw-bold text-white mb-4 d-flex align-items-center">
              <ShieldCheck className="me-3 text-warning" size={50} />
              100% Safety Assurance
            </h2>
            <h3 className="fw-light lh-base mb-4 text-light" style={{ maxWidth: '600px' }}>
              Travel with peace of mind. Our experienced, background-checked drivers ensure a smooth and safe journey.
            </h3>
            <div className="d-inline-block bg-warning rounded-pill px-5 py-3 shadow-lg hover-lift cursor-pointer transition-all">
              <h4 className="mb-0 fw-bold"><a href="tel:9054450052" className="text-dark text-decoration-none">Book Now: 9054450052</a></h4>
            </div>
          </Col>
          <Col md={5} className="text-center text-md-end">
            <img 
              src={driverImg} 
              alt="Professional Driver" 
              className="img-fluid rounded-4 shadow-lg border border-2 border-warning"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AppBlock;
