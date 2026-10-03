import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const servicesData = [
  {
    title: 'Car Rental',
    desc: 'We provide flexibility with comfort by offering wide range of car options to customers.',
    img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop'
  },
  {
    title: 'Outstation Cabs',
    desc: 'Outstation cabs service is divided into 3 type’s services: roundtrip, one-way trip and multicity.',
    img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop'
  },
  {
    title: 'Airport Taxi',
    desc: 'Hire a car on rent for airport pick and drop services from any destinations in somnath.',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format&fit=crop'
  },
  {
    title: 'Hotel Transfer',
    desc: 'shreetoursandtravels.com provides pick and drop services from almost all hotels based in somnath.',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop'
  },
  {
    title: 'Corporate Cabs',
    desc: 'shreetoursandtravels.com provides most reliable & affordable car rental packages for corporates.',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop'
  },
  {
    title: 'Luxury Car Hire',
    desc: 'At shreetoursandtravels.com, you will find a wide range of luxury cars with best price & instant availability.',
    img: 'https://images.unsplash.com/photo-1503376712351-460d3d5f57de?w=500&auto=format&fit=crop'
  }
];

const Services = () => {
  return (
    <div className="py-5 bg-white">
      <Container>
        <div className="text-center mb-5">
          <h5 className="text-warning fw-bold text-uppercase tracking-wider">Our Services and Hospitality</h5>
          <h2 className="display-5 fw-bold text-dark">Our Excellent Services</h2>
        </div>
        
        <Row className="g-4">
          {servicesData.map((service, idx) => (
            <Col md={4} key={idx}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-lift">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={service.img} alt={service.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </div>
                <Card.Body className="p-4 text-center">
                  <h4 className="fw-bold mb-3">{service.title}</h4>
                  <p className="text-muted mb-0 lh-lg">{service.desc}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Services;
