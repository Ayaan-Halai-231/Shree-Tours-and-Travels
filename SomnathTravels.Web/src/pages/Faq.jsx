import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

const Faq = () => {
  return (
    <div className="bg-light min-vh-100">
      <div className="bg-dark text-white py-5 text-center">
        <h2 className="display-4 fw-bold">FAQ</h2>
        <p className="text-warning fs-5">Frequently Asked Questions</p>
      </div>

      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Some of the common questions!</h2>
        </div>
        
        <div className="mx-auto" style={{ maxWidth: '800px' }}>
          <Accordion defaultActiveKey="0" className="shadow-sm">
            <Accordion.Item eventKey="0" className="border-0 border-bottom">
              <Accordion.Header className="fw-bold">How do I book a taxi?</Accordion.Header>
              <Accordion.Body className="text-muted">
                You can book a taxi through our website by filling out the booking form on the homepage, or you can directly call us at 9054450052. We offer instant booking confirmations.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" className="border-0 border-bottom">
              <Accordion.Header className="fw-bold">Do you offer outstation travel services?</Accordion.Header>
              <Accordion.Body className="text-muted">
                Yes, we specialize in both local and outstation travel. We offer trips from Somnath to destinations like Ahmedabad, Dwarka, Diu, Rajkot, and more.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" className="border-0 border-bottom">
              <Accordion.Header className="fw-bold">What types of vehicles are available?</Accordion.Header>
              <Accordion.Body className="text-muted">
                We have a wide range of well-maintained vehicles including Sedans (Swift Dzire, Honda City), SUVs (Toyota Innova, Ertiga, XUV500), and larger vehicles like Tempo Travellers. All cars are available with A/C options.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3" className="border-0 border-bottom">
              <Accordion.Header className="fw-bold">Are the drivers experienced?</Accordion.Header>
              <Accordion.Body className="text-muted">
                Absolutely. All our drivers are highly experienced, professional, well-behaved, and familiar with all local routes and outstation destinations to ensure a safe and comfortable journey.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4" className="border-0 border-bottom">
              <Accordion.Header className="fw-bold">Can I hire a car for a full day?</Accordion.Header>
              <Accordion.Body className="text-muted">
                Yes, we offer flexible rental packages. You can hire our cars on a per-kilometer basis for outstation trips, or for a full day at fixed rates for local sightseeing in and around Somnath.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </Container>
    </div>
  );
};

export default Faq;
