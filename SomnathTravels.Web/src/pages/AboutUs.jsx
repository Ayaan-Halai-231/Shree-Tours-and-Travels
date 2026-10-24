import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  CheckCircleFill,
  StarFill,
  ShieldCheck,
  LightningChargeFill,
  TreeFill,
  AwardFill,
  GlobeAsiaAustraliaFill,
  ArrowRight,
  ShieldFillCheck,
  EvStationFill
} from 'react-bootstrap-icons';

const AboutUs = () => {
  return (
    <div className="bg-light" style={{ backgroundColor: '#f8faf9' }}>
      {/* Eco-Friendly Hero Page Header */}
      <div
        className="text-white py-5 position-relative"
        style={{
          background: 'linear-gradient(135deg, #06281e 0%, #0d4734 50%, #153e2d 100%)',
          borderBottom: '4px solid #10b981',
          boxShadow: '0 8px 30px rgba(6, 40, 30, 0.25)'
        }}
      >
        <Container className="py-3 text-center">
          <Badge
            bg="success"
            className="px-3 py-2 rounded-pill fw-semibold mb-3 shadow-sm"
            style={{ backgroundColor: '#10b981', fontSize: '0.85rem' }}
          >
            <TreeFill className="me-1" /> 100% Eco-Conscious & Sustainable Travel
          </Badge>
          <h1 className="display-4 fw-bold text-white mb-2">
            About <span style={{ color: '#86efac' }}>Shree Tours & Travels</span>
          </h1>
          <p className="lead text-light mb-0 mx-auto" style={{ maxWidth: '680px', opacity: 0.9 }}>
            Pioneering clean, dependable, and comfortable journeys across Somnath, Saurashtra, and holy pilgrimage circuits in Gujarat.
          </p>
        </Container>
      </div>

      {/* Floating Eco Impact Highlights Bar */}
      <Container style={{ marginTop: '-30px' }} className="position-relative z-2">
        <div
          className="bg-white rounded-4 shadow-sm p-4 border"
          style={{ borderColor: 'rgba(16, 185, 129, 0.25)' }}
        >
          <Row className="g-4 text-center">
            <Col sm={6} lg={3}>
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-success"
                  style={{ width: '50px', height: '50px', backgroundColor: '#ecfdf5' }}
                >
                  <TreeFill size={24} />
                </div>
                <div className="text-start">
                  <div className="fs-4 fw-bold text-dark">50+</div>
                  <div className="small text-muted">Eco & Clean Vehicles</div>
                </div>
              </div>
            </Col>

            <Col sm={6} lg={3}>
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-success"
                  style={{ width: '50px', height: '50px', backgroundColor: '#ecfdf5' }}
                >
                  <GlobeAsiaAustraliaFill size={24} />
                </div>
                <div className="text-start">
                  <div className="fs-4 fw-bold text-dark">25,000+</div>
                  <div className="small text-muted">Clean Trips Done</div>
                </div>
              </div>
            </Col>

            <Col sm={6} lg={3}>
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-success"
                  style={{ width: '50px', height: '50px', backgroundColor: '#ecfdf5' }}
                >
                  <ShieldCheck size={24} />
                </div>
                <div className="text-start">
                  <div className="fs-4 fw-bold text-dark">100%</div>
                  <div className="small text-muted">Sanitized & Safe</div>
                </div>
              </div>
            </Col>

            <Col sm={6} lg={3}>
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-warning"
                  style={{ width: '50px', height: '50px', backgroundColor: '#fef3c7' }}
                >
                  <StarFill size={22} />
                </div>
                <div className="text-start">
                  <div className="fs-4 fw-bold text-dark">4.9 / 5</div>
                  <div className="small text-muted">Customer Rating</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Main Welcome & Showcase Section */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <Badge
            bg="light"
            className="text-success border px-3 py-2 rounded-pill fw-bold mb-2 shadow-sm"
            style={{ borderColor: '#86efac' }}
          >
            🌱 Sustainable Pilgrimage Journey
          </Badge>
          <h2 className="text-uppercase fw-bold text-dark mt-2" style={{ letterSpacing: '0.5px' }}>
            Welcome To Shree Tours & Travels
          </h2>
          <h5 className="text-muted fw-normal">
            The Best Eco-Conscious Car Rental Providers in Somnath
          </h5>
        </div>

        <Row className="g-4 align-items-stretch">
          {/* Left: Showcase Taxi Service Card with Eco Aesthetics */}
          <Col lg={5}>
            <div
              className="h-100 p-4 p-md-5 rounded-4 shadow-lg text-white d-flex flex-column justify-content-between position-relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #0d3b2e 0%, #155742 50%, #0a2e23 100%)',
                border: '1px solid rgba(134, 239, 172, 0.25)'
              }}
            >
              <div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span
                    className="badge rounded-pill px-3 py-2 fw-semibold"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(4px)', color: '#86efac' }}
                  >
                    🌿 Eco-Smart Travel
                  </span>
                  <span className="badge bg-warning text-dark rounded-pill px-2 py-1 small">
                    Somnath Special
                  </span>
                </div>

                <h3 className="fw-bold mb-3" style={{ color: '#ffffff' }}>
                  Taxi Services in <span style={{ color: '#facc15' }}>Somnath</span>
                </h3>

                <p className="lh-lg mb-4" style={{ color: '#d1fae5', fontSize: '0.96rem' }}>
                  We provide eco-optimized packages for taxi booking in Somnath. Whether visiting the sacred Jyotirlinga, heading to the lion sanctuaries of Sasan Gir, or traveling across coastal Gujarat, travel with peace of mind, transparent fares, and low-emission comfort.
                </p>

                {/* Real High-Resolution Vehicle Image */}
                <div className="position-relative rounded-3 overflow-hidden shadow mb-4" style={{ height: '190px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop"
                    alt="Eco Friendly Shree Tours Fleet"
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 end-0 p-2 text-white d-flex justify-content-between align-items-center"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
                  >
                    <span className="small fw-semibold ps-1">
                      <EvStationFill className="text-warning me-1" /> Clean Fuel & Hybrid Fleet
                    </span>
                    <span className="badge bg-success bg-opacity-75 rounded-pill px-2 py-1 small">
                      Inspected
                    </span>
                  </div>
                </div>

                {/* Key Bullet Highlights */}
                <div className="d-flex flex-column gap-2 mb-4" style={{ fontSize: '0.9rem', color: '#d1fae5' }}>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircleFill className="text-warning" />
                    <span>Regular emission-certified & well-tuned engines</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircleFill className="text-warning" />
                    <span>Air-conditioned, ultra-clean sanitized interiors</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircleFill className="text-warning" />
                    <span>Fixed, honest per-km and daily flat tariffs</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2 pt-2 border-top border-white border-opacity-10">
                <Button
                  as={Link}
                  to="/cars"
                  variant="warning"
                  className="fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                >
                  Explore Fleet <ArrowRight />
                </Button>
              </div>
            </div>
          </Col>

          {/* Right: Why Choose Shree Tours & Travels Cards */}
          <Col lg={7}>
            <div className="h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                  <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <TreeFill className="text-success" /> Why Choose Shree Tours & Travels?
                  </h4>
                  <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">
                    Eco Certified
                  </span>
                </div>
                <p className="text-muted small mb-4">
                  We blend devotional hospitality with sustainable travel practices, ensuring your spiritual journey across Gujarat is pure, tranquil, and comfortable.
                </p>

                <Row className="g-3">
                  {/* Card 1: Variety of Fleets */}
                  <Col md={6}>
                    <Card
                      className="border-0 shadow-sm h-100 p-3 rounded-4 transition-all"
                      style={{
                        backgroundColor: '#ffffff',
                        borderLeft: '4px solid #10b981'
                      }}
                    >
                      <Card.Body className="p-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                          style={{ width: '45px', height: '45px', backgroundColor: '#ecfdf5', color: '#10b981' }}
                        >
                          <TreeFill size={22} />
                        </div>
                        <Card.Title className="fw-bold text-dark fs-5 mb-2">
                          Green & Diverse Fleets
                        </Card.Title>
                        <Card.Text className="text-muted small lh-base">
                          Wide selection of well-maintained, fuel-efficient sedans, spacious SUVs, and luxury coaches with low-emission CNG and hybrid options.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Card 2: Best Rate Guarantee */}
                  <Col md={6}>
                    <Card
                      className="border-0 shadow-sm h-100 p-3 rounded-4 transition-all"
                      style={{
                        backgroundColor: '#ffffff',
                        borderLeft: '4px solid #f59e0b'
                      }}
                    >
                      <Card.Body className="p-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                          style={{ width: '45px', height: '45px', backgroundColor: '#fef3c7', color: '#f59e0b' }}
                        >
                          <AwardFill size={22} />
                        </div>
                        <Card.Title className="fw-bold text-dark fs-5 mb-2">
                          Best Rate Guarantee
                        </Card.Title>
                        <Card.Text className="text-muted small lh-base">
                          One of the most trusted taxi providers in Somnath offering honest, transparent fares with no hidden surcharges for outstation and local trips.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Card 3: Awesome Support */}
                  <Col md={6}>
                    <Card
                      className="border-0 shadow-sm h-100 p-3 rounded-4 transition-all"
                      style={{
                        backgroundColor: '#ffffff',
                        borderLeft: '4px solid #06b6d4'
                      }}
                    >
                      <Card.Body className="p-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                          style={{ width: '45px', height: '45px', backgroundColor: '#cffafe', color: '#0891b2' }}
                        >
                          <ShieldCheck size={22} />
                        </div>
                        <Card.Title className="fw-bold text-dark fs-5 mb-2">
                          24/7 Dedicated Support
                        </Card.Title>
                        <Card.Text className="text-muted small lh-base">
                          Our team is always active to ensure timely pickups, seamless railway and airport transfers, and round-the-clock emergency travel assistance.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Card 4: Safe, Smooth & Clean */}
                  <Col md={6}>
                    <Card
                      className="border-0 shadow-sm h-100 p-3 rounded-4 transition-all"
                      style={{
                        backgroundColor: '#ffffff',
                        borderLeft: '4px solid #84cc16'
                      }}
                    >
                      <Card.Body className="p-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                          style={{ width: '45px', height: '45px', backgroundColor: '#ecfccb', color: '#65a30d' }}
                        >
                          <LightningChargeFill size={22} />
                        </div>
                        <Card.Title className="fw-bold text-dark fs-5 mb-2">
                          Safe & Eco-Smooth Ride
                        </Card.Title>
                        <Card.Text className="text-muted small lh-base">
                          Courteous, verified drivers trained in safe and smooth driving habits, providing a peaceful, relaxing commute across all pilgrimage routes.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Eco Commitment Banner */}
              <div
                className="mt-4 p-3 rounded-3 d-flex align-items-center gap-3 border"
                style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
              >
                <div className="fs-3 text-success">🌱</div>
                <div className="small text-muted">
                  <strong className="text-dark">Eco-Friendly Tourism Pledge:</strong> We actively maintain our fleet to minimize emissions, protect wildlife in Sasan Gir zones, and promote clean, plastic-reduced travel across Gujarat.
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Detailed About Section */}
      <div className="bg-white py-5 border-top" style={{ borderColor: '#e5e7eb' }}>
        <Container>
          <div className="text-center mb-5">
            <span
              className="badge px-3 py-2 rounded-pill fw-semibold mb-2"
              style={{ backgroundColor: '#ecfdf5', color: '#047857' }}
            >
              🌿 Verified Reliability & Care
            </span>
            <h2 className="fw-bold text-dark">
              Most Reliable & Affordable Car Rental in Somnath
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
              Delivering dependable, honest, and comfortable road journeys across Gujarat for families, pilgrims, and corporate travelers.
            </p>
          </div>

          <Row className="g-4 align-items-center">
            <Col lg={7}>
              <p className="lh-lg text-muted mb-3">
                <strong>Shree Tours & Travels</strong> is one of the leading car rental companies and car hire service providers in Somnath, Gujarat. The company provides best-in-class services living up to the standard and quality promised to every passenger.
              </p>
              <p className="lh-lg text-muted mb-3">
                Today, travelers and pilgrims visiting Somnath, Dwarka, Diu, Sasan Gir Forest, Rajkot, Ahmedabad, Surat, Vadodara, Morbi, Gondal, or Bhavnagar rely on our trusted car rental services. Our fleet ranges from economy hatchbacks to premium sedans and luxury multi-seater coaches with A/C and non-A/C options.
              </p>
              <p className="lh-lg text-muted">
                Each vehicle is rigorously inspected for mechanical reliability, safety, and hygiene. Our courteous drivers ensure you reach Somnath Temple Sightseeing, Somnath Railway Station, or nearby Rajkot/Diu airports comfortably and on time.
              </p>

              <div className="mt-4 d-flex gap-3">
                <Button
                  as={Link}
                  to="/cars"
                  variant="success"
                  className="px-4 py-2 rounded-pill fw-bold shadow-sm"
                  style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                >
                  View Available Cars
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  variant="outline-dark"
                  className="px-4 py-2 rounded-pill fw-semibold"
                >
                  Contact Our Team
                </Button>
              </div>
            </Col>

            <Col lg={5}>
              <div
                className="p-4 rounded-4 border shadow-sm"
                style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
              >
                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <ShieldFillCheck className="text-success" /> Why Choose Shree Tours & Travels?
                </h5>
                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                  {[
                    'Instant online car booking & fast confirmations',
                    'High quality services at fair, transparent rates',
                    'Flexible hiring packages (full-day or per-km)',
                    'Well-maintained, spacious A/C and non-A/C cars',
                    'Sanitized & spotless vehicle guarantee',
                    'Well-behaved, verified & punctual drivers',
                    'Eco-conscious driving practices reducing emissions',
                    'Safe pilgrimage & hassle-free Saurashtra journeys'
                  ].map((item, index) => (
                    <li key={index} className="d-flex align-items-start gap-2 text-muted" style={{ fontSize: '0.92rem' }}>
                      <CheckCircleFill className="text-success flex-shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AboutUs;
