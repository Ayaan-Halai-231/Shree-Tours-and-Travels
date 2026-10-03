import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Quote } from 'react-bootstrap-icons';

const reviews = [
  { name: 'Mr. Rahul Sharma', review: 'Had a great trip. The car was well maintained and clean. Our driver was very knowledgeable about the city and his recommendations were helpful.', rating: 5 },
  { name: 'Mr. Manoj Shah', review: 'We had very good experience in terms of reliability, punctuality, safe driving, good recommendations for food, shopping, places to visit.', rating: 5 },
  { name: 'Mr. Vikas Bansal', review: 'I am very happy with the Shree Tours & Travels team and would definitely choose them for my next trip. Everything was so well managed.', rating: 5 },
  { name: 'Dr. Vishal Patel', review: 'Timely pick up and timely drop at destination was something really appreciable. Good response from the driver.', rating: 5 },
];

const Testimonials = () => {
  return (
    <div className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h5 className="text-danger fw-bold text-uppercase tracking-wider">
            <Quote className="me-2" />
            Some Reviews From Our Valuable Clients
          </h5>
          <h2 className="display-5 fw-bold text-dark">Customer Feedbacks</h2>
        </div>
        
        <Row className="g-4">
          {reviews.map((r, idx) => (
            <Col lg={6} key={idx}>
              <Card className="h-100 border-0 shadow-sm rounded-4 hover-lift bg-white p-4">
                <div className="d-flex mb-3 align-items-center">
                  <div className="bg-warning text-dark rounded-circle d-flex justify-content-center align-items-center fw-bold fs-4 me-3" style={{ width: '60px', height: '60px' }}>
                    {r.name.charAt(4)}
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">{r.name}</h5>
                    <p className="text-muted small mb-0">Our Valuable Customer</p>
                  </div>
                  <div className="ms-auto text-warning fs-5">
                    {'★'.repeat(r.rating)}
                  </div>
                </div>
                <p className="text-muted fst-italic lh-lg mb-0">"{r.review}"</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Testimonials;
