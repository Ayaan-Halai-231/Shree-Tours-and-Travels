import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { TelephoneFill, EnvelopeFill, TaxiFrontFill } from 'react-bootstrap-icons';

const Header = () => {
  return (
    <div className="bg-dark text-white py-2">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="d-none d-md-block">
            <TaxiFrontFill className="me-2 text-warning" />
            <small>TOP CAR RENTAL SERVICES AVAILABLE IN SOMNATH!</small>
          </Col>
          <Col md={6} className="text-end">
            <span className="me-3">
              <TelephoneFill className="me-2 text-warning" />
              <small>9924483215 / 9712472876</small>
            </span>
            <span>
              <EnvelopeFill className="me-2 text-warning" />
              <small>shreetoursandtravels@gmail.com</small>
            </span>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Header;
