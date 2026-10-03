import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { CheckCircleFill, StarFill, ShieldFillCheck, LightningChargeFill } from 'react-bootstrap-icons';

const AboutUs = () => {
  return (
    <div className="bg-light">
      {/* Page Header */}
      <div className="bg-dark text-white py-5 text-center">
        <h2 className="display-4 fw-bold">About</h2>
        <p className="text-warning fs-5">About your company</p>
      </div>

      {/* Welcome Section */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="text-uppercase fw-bold">Welcome To Shree Tours & Travels</h2>
          <h4 className="text-muted">The Best Car Rental Providers in Somnath!</h4>
        </div>
        <Row className="g-5">
          <Col md={5}>
            <div className="p-4 bg-dark text-white rounded-4 shadow">
              <h3 className="text-warning mb-3">Taxi Services in Somnath</h3>
              <p className="text-light lh-lg text-justify">
                We provide various packages for Taxi Booking in Somnath. You can easily Book Taxi in Somnath as per your requirement. With Shree Tours & Travels, you can be rest assured of a world class customer service and transparent fares when you Book Taxi Online in Somnath.
              </p>
              <div className="text-center mt-4">
                {/* Dummy car image placeholder */}
                <div style={{ height: '150px', backgroundColor: '#555', borderRadius: '10px' }} className="d-flex align-items-center justify-content-center text-muted">
                  Service Car Image
                </div>
              </div>
            </div>
          </Col>
          <Col md={7}>
            <h4 className="mb-4 fw-bold border-bottom pb-2">Why Choose Shree Tours & Travels?</h4>
            <Row className="g-4 mt-2">
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100 p-3 hover-lift">
                  <Card.Body>
                    <CheckCircleFill className="text-warning fs-1 mb-3" />
                    <Card.Title className="fw-bold">Variety of Fleets</Card.Title>
                    <Card.Text className="text-muted">
                      Shree Tours & Travels provided fleet of vehicles includes well maintained, luxurious cars and coaches providing car rental, coach rental and airport cab services with reasonable tariffs.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100 p-3 hover-lift">
                  <Card.Body>
                    <StarFill className="text-warning fs-1 mb-3" />
                    <Card.Title className="fw-bold">Best Rate guarantee</Card.Title>
                    <Card.Text className="text-muted">
                      Shree Tours & Travels is one of the most reliable Taxi Service Providers in Somnath offering the best rates for Taxi in Somnath.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100 p-3 hover-lift">
                  <Card.Body>
                    <ShieldFillCheck className="text-warning fs-1 mb-3" />
                    <Card.Title className="fw-bold">Awesome Support</Card.Title>
                    <Card.Text className="text-muted">
                      Shree Tours & Travels have got you covered. And Offering the highest professional standard in service and support to cater for our clients transport needs.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100 p-3 hover-lift">
                  <Card.Body>
                    <LightningChargeFill className="text-warning fs-1 mb-3" />
                    <Card.Title className="fw-bold">Fast and Safe</Card.Title>
                    <Card.Text className="text-muted">
                      Shree Tours & Travels will provide you efficient, reliable and friendly transportation services. Customers attest to the safe and courteous service we provide.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      
      {/* Detailed About Section */}
      <div className="bg-white py-5 border-top">
        <Container>
          <div className="text-center mb-5">
            <h5 className="text-warning fw-bold">Why Choose Us</h5>
            <h2 className="fw-bold">Most Reliable And Affordable Car Rental Service Providers In Somnath</h2>
          </div>
          <Row>
            <Col md={12} className="mb-4">
              <p className="lh-lg text-muted text-justify">
                Shree Tours & Travels is one of the leading car rental companies and car hire service providers in Somnath, Gujarat. The company provide best services living up to the standard and the quality promised. Today most of the people who come to Somnath and want to visit places like Ahmedabad, Surat, Vadodara, Morbi, Gondal, Rajkot, Bhuj, Sasan gir, Diu, Bhavnagar or for business trip prefer the car rental services of Shree Tours & Travels. The company has fleet of cars ranging from luxury to standard with A/C and Non A/C facilities. Each and every cars are well maintained. All of our drivers are well experienced. They make you travel easier, hassle free and make you reach any Sightseeing of Somnath, Somnath railway station and nearby Airport on time.
              </p>
              <p className="lh-lg text-muted text-justify">
                If you are looking for a car rental services in Somnath or a pick up and drop facilities to Somnath Railway Station, Somnath Airport and also Somnath Bus Stand or a car for a Outstation trip, we are going to provide you the best car at the most competitive rate. We give you the great value to your hard money and charge at the competitive market price for the service we deliver to you.
              </p>
            </Col>
            <Col md={12}>
              <h5 className="fw-bold mb-3">Why Shree Tours & Travels ?</h5>
              <ul className="list-group list-group-flush border-0 bg-transparent">
                <li className="list-group-item bg-transparent text-muted"><CheckCircleFill className="text-warning me-2"/> Online car booking</li>
                <li className="list-group-item bg-transparent text-muted"><CheckCircleFill className="text-warning me-2"/> High Quality Services at reasonable prices</li>
                <li className="list-group-item bg-transparent text-muted"><CheckCircleFill className="text-warning me-2"/> Competitive Price (hire for full day or per km)</li>
                <li className="list-group-item bg-transparent text-muted"><CheckCircleFill className="text-warning me-2"/> Well Maintained A/C and Non A/C Spacious cars</li>
                <li className="list-group-item bg-transparent text-muted"><CheckCircleFill className="text-warning me-2"/> Clean & maintained cars</li>
                <li className="list-group-item bg-transparent text-muted"><CheckCircleFill className="text-warning me-2"/> Well behaved & experienced drivers</li>
                <li className="list-group-item bg-transparent text-muted"><CheckCircleFill className="text-warning me-2"/> Punctuality and Safety is our trademark</li>
                <li className="list-group-item bg-transparent text-muted"><CheckCircleFill className="text-warning me-2"/> Our motto is to provide our customers hassle-free and safe journey</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AboutUs;
