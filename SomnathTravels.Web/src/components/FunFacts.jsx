import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { PeopleFill, CarFrontFill, EmojiSmileFill, MapFill } from 'react-bootstrap-icons';
import statsBg from '../assets/stats_bg.jpg';

const FunFacts = () => {
  return (
    <div className="py-5 position-relative bg-dark text-white text-center shadow-lg" style={{ 
      backgroundImage: `url(${statsBg})`,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>
      <Container className="position-relative py-5" style={{ zIndex: 1 }}>
        <Row className="g-4">
          <Col md={3} sm={6}>
            <div className="p-4 rounded-4 hover-lift bg-white bg-opacity-10 border border-light border-opacity-25">
              <PeopleFill size={40} className="text-warning mb-3" />
              <h2 className="display-4 fw-bold text-white mb-2">30</h2>
              <p className="text-uppercase fw-semibold mb-0 tracking-wider">Drivers</p>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="p-4 rounded-4 hover-lift bg-white bg-opacity-10 border border-light border-opacity-25">
              <CarFrontFill size={40} className="text-warning mb-3" />
              <h2 className="display-4 fw-bold text-white mb-2">50</h2>
              <p className="text-uppercase fw-semibold mb-0 tracking-wider">Cars in Fleet</p>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="p-4 rounded-4 hover-lift bg-white bg-opacity-10 border border-light border-opacity-25">
              <EmojiSmileFill size={40} className="text-warning mb-3" />
              <h2 className="display-4 fw-bold text-white mb-2">15K+</h2>
              <p className="text-uppercase fw-semibold mb-0 tracking-wider">Happy Customers</p>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="p-4 rounded-4 hover-lift bg-white bg-opacity-10 border border-light border-opacity-25">
              <MapFill size={40} className="text-warning mb-3" />
              <h2 className="display-4 fw-bold text-white mb-2">800+</h2>
              <p className="text-uppercase fw-semibold mb-0 tracking-wider">Trips Completed</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FunFacts;
