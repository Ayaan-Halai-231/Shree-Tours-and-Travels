import React from 'react';
import { Container } from 'react-bootstrap';

const brands = [
  'Audi', 'Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Jeep', 'Mahindra', 'Maruti Suzuki', 'Mercedes Benz', 'Toyota', 'Tata'
];

const Brands = () => {
  return (
    <div className="py-5 bg-white border-top">
      <Container>
        <div className="text-center mb-4">
          <h5 className="text-warning fw-bold text-uppercase tracking-wider">Brands Provided For Car Rental By Shree Tours & Travels</h5>
          <h2 className="display-5 fw-bold text-dark mb-5">Choose Your Brand</h2>
        </div>
        
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
          {brands.map((b, idx) => (
            <div key={idx} className="bg-light px-4 py-3 rounded-pill shadow-sm text-muted fw-semibold hover-lift" style={{ fontSize: '1.1rem' }}>
              {b}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Brands;
