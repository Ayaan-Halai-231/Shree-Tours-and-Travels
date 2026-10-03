import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const vehicles = [
  { name: 'Honda City', rent: '₹10/KM', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&auto=format&fit=crop' },
  { name: 'Toyota Innova', rent: '₹16/KM', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop' },
  { name: 'Chevrolet Tavera', rent: '₹15/KM', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop' },
  { name: 'Swift Dzire', rent: '₹10/KM', img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&auto=format&fit=crop' },
  { name: 'Mahindra Marazzo', rent: '₹13/KM', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&auto=format&fit=crop' },
  { name: 'Maruti Swift', rent: '₹09/KM', img: 'https://images.unsplash.com/photo-1518987048-93e29699e79a?w=500&auto=format&fit=crop' },
  { name: 'Hyundai Verna', rent: '₹11/KM', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop' },
  { name: 'XUV 500', rent: '₹13/KM', img: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=500&auto=format&fit=crop' },
];

const ChooseVehicle = () => {
  return (
    <div className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h5 className="text-warning fw-bold text-uppercase tracking-wider">Some Of the Most Loved Vehicles At Shree Tours & Travels</h5>
          <h2 className="display-5 fw-bold text-dark">Choose Your Vehicle</h2>
        </div>
        
        <Row className="g-4">
          {vehicles.map((v, idx) => (
            <Col lg={3} md={4} sm={6} key={idx}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-lift bg-white text-center p-3">
                <div style={{ height: '160px', borderRadius: '12px', overflow: 'hidden', marginBottom: '15px' }}>
                  <img src={v.img} alt={v.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </div>
                <h5 className="fw-bold mb-2 text-dark">{v.name}</h5>
                <p className="mb-0 text-muted">
                  <span className="text-warning fw-bold">Rent: {v.rent}</span> <small>(min 300km)</small>
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ChooseVehicle;
