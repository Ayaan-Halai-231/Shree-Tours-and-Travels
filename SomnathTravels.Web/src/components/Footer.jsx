import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { EnvelopeFill, TelephoneFill, GeoAltFill, SendFill, Google, Linkedin, Instagram, Facebook, Twitter } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-5 position-relative" style={{ borderTop: '4px solid #ffc107', backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)' }}>
      <Container>
        <Row className="mb-5">
          {/* About Company Widget */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5 className="text-warning mb-4 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>About Company</h5>
            <div className="pe-lg-3">
              <div className="mb-3 bg-white p-2 rounded d-inline-block">
                <img src={logo} alt="Shree Tours & Travels" height="80" />
              </div>
              <p className="text-light text-opacity-75 small lh-lg text-justify">
                shreetourstravels.online is one of the leading taxi service providers in India, based in Somnath, Gujarat. Currently providing affordable budget car rental services in all major cities across Gujarat.
              </p>
            </div>
          </Col>

          {/* Useful Links Widget */}
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h5 className="text-warning mb-4 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Useful Links</h5>
            <ul className="list-unstyled text-light text-opacity-75 small lh-lg">
              <li className="mb-2"><Link to="/" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all">Home</Link></li>
              <li className="mb-2"><Link to="/about" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all">About Us</Link></li>
              <li className="mb-2"><Link to="/faq" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all">FAQs</Link></li>
              <li className="mb-2"><a href="#" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all">Chat With Us</a></li>
              <li className="mb-2"><Link to="/contact" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all">Contact Us</Link></li>
              <li className="mb-2"><Link to="/" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all">Book a Cab Now</Link></li>
              <li className="mb-2"><a href="tel:9924483215" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all">Book Via Phone</a></li>
            </ul>
          </Col>

          {/* Customer Support & Newsletter Widget */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5 className="text-warning mb-4 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Customer Support</h5>
            <ul className="list-unstyled text-light text-opacity-75 small lh-lg mb-4">
              <li className="mb-2"><a href="mailto:shreetoursandtravels@gmail.com" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all"><EnvelopeFill className="me-2 text-warning" />shreetoursandtravels@gmail.com</a></li>
              <li className="mb-2"><a href="tel:9924483215" className="text-light text-opacity-75 text-decoration-none hover-warning transition-all"><TelephoneFill className="me-2 text-warning" />(+91) 9924483215</a></li>
              <li className="mb-2"><GeoAltFill className="me-2 text-warning" />Somnath, Gujarat, India.</li>
            </ul>

            <h5 className="text-warning mb-3 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Subscribe Us</h5>
            <Form>
              <Form.Label className="small text-light text-opacity-75">Subscribe to our Newsletters</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Your email"
                  aria-label="Your email"
                  className="bg-secondary bg-opacity-25 border-0 text-white"
                />
                <Button variant="warning" id="button-addon2">
                  <SendFill />
                </Button>
              </InputGroup>
            </Form>
          </Col>

          {/* Reserve Your Taxi Form */}
          <Col lg={4} md={6}>
            <div className="bg-warning text-dark p-4 rounded-3 shadow position-relative">
              <div className="position-absolute top-0 start-50 translate-middle bg-dark text-warning rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                <SendFill size={20} />
              </div>
              <h4 className="fw-bold mb-4 text-center mt-2">Reserve Your Taxi Now</h4>
              <Form>
                <Row className="g-2 mb-2">
                  <Col sm={6}>
                    <Form.Control type="text" placeholder="Name*" className="border-0 shadow-sm" required />
                  </Col>
                  <Col sm={6}>
                    <Form.Control type="text" placeholder="Contact No.*" className="border-0 shadow-sm" required />
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Control type="email" placeholder="Email*" className="border-0 shadow-sm" required />
                </Form.Group>
                <Button variant="dark" type="submit" className="w-100 fw-bold text-uppercase shadow-sm">
                  Submit
                </Button>
              </Form>
            </div>
          </Col>
        </Row>

        {/* Footer Bottom Block */}
        <hr className="border-secondary opacity-50 my-4" />
        <Row className="align-items-center">
          <Col md={8} className="text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 text-light text-opacity-50 small">
              Copyright &copy; {new Date().getFullYear()} Shree Tours & Travels - All Right Reserved By <a href="/" className="text-warning text-decoration-none">shreetourstravels.online</a>. Website Made With &#10084; By Eyelash Technologies
            </p>
          </Col>
          <Col md={4} className="text-center text-md-end">
            <span className="text-light text-opacity-50 small me-3 fw-semibold">Follow Us:</span>
            <a href="#" className="text-white text-opacity-50 hover-warning me-3 transition-all"><Google /></a>
            <a href="#" className="text-white text-opacity-50 hover-warning me-3 transition-all"><Linkedin /></a>
            <a href="#" className="text-white text-opacity-50 hover-warning me-3 transition-all"><Instagram /></a>
            <a href="#" className="text-white text-opacity-50 hover-warning me-3 transition-all"><Facebook /></a>
            <a href="#" className="text-white text-opacity-50 hover-warning transition-all"><Twitter /></a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
