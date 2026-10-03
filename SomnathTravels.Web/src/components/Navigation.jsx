import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { TelephoneFill } from 'react-bootstrap-icons';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <Navbar bg="light" expand="lg" className="py-3 shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-dark">
          Shree <span className="text-warning">Tours and Travels</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center fw-semibold">
            <Nav.Link as={Link} to="/" className={`px-3 ${location.pathname === '/' ? 'text-warning' : ''}`}>Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className={`px-3 ${location.pathname === '/about' ? 'text-warning' : ''}`}>About Us</Nav.Link>
            <Nav.Link as={Link} to="/faq" className={`px-3 ${location.pathname === '/faq' ? 'text-warning' : ''}`}>FAQ</Nav.Link>
            <Nav.Link as={Link} to="/contact" className={`px-3 ${location.pathname === '/contact' ? 'text-warning' : ''}`}>Contact Us</Nav.Link>
            <Button variant="danger" className="ms-3 d-flex align-items-center rounded-pill px-4">
              <TelephoneFill className="me-2" /> 9924483215
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
