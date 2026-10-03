import React from 'react';
import { Carousel, Button } from 'react-bootstrap';
import heroImage from '../assets/hero_new.jpg';

const HeroSlider = () => {
  return (
    <Carousel fade controls={false} indicators={false} style={{ height: '70vh', minHeight: '500px', backgroundColor: '#111' }}>
      <Carousel.Item style={{ height: '70vh', minHeight: '500px' }}>
        <img
          className="d-block w-100 h-100"
          src={heroImage}
          alt="First slide"
          style={{ objectFit: 'cover', opacity: 0.5 }}
        />
        <Carousel.Caption className="d-flex flex-column justify-content-center align-items-center h-100" style={{ paddingBottom: '50px' }}>
          <p className="text-warning fs-4 fw-semibold mb-2" style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>Experience the Divine Journey</p>
          <h1 className="display-2 fw-bold text-white mb-3 text-center" style={{ textShadow: '2px 4px 10px rgba(0,0,0,0.5)' }}>Shree Tours & Travels</h1>
          <h2 className="fs-3 text-light mb-5 text-center">Your Ultimate Gateway to Somnath & Beyond</h2>
          <div className="d-flex gap-3">
            <Button variant="warning" size="lg" className="rounded-pill px-5 fw-bold shadow-lg">Book Now</Button>
            <Button variant="outline-light" size="lg" className="rounded-pill px-5 fw-bold">Explore Fleet</Button>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default HeroSlider;
