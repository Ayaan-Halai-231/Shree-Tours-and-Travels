import React from 'react';
import { Container, Table } from 'react-bootstrap';

const FareList = () => {
  return (
    <Container className="my-5 pt-5">
      <div className="text-center mb-4">
        <h6 className="text-warning fw-bold">Some Of the Most Loved Outstation Packages At Shree Tours & Travels</h6>
        <h2 className="fw-bold">One-Way Bookings Fare List</h2>
      </div>
      <div className="table-responsive shadow-sm rounded-4 overflow-hidden">
        <Table hover bordered className="mb-0 bg-white">
          <thead className="bg-warning text-dark border-0">
            <tr>
              <th className="py-3 border-0">ALL CITY ONE WAY SERVICE</th>
              <th className="py-3 border-0">SWIFT VDI</th>
              <th className="py-3 border-0">SWIFT DZIRE</th>
              <th className="py-3 border-0">ERTIGA OLD</th>
              <th className="py-3 border-0">ERTIGA NEW</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Somnath to Ahmedabad</td>
              <td>₹2000</td>
              <td>₹2300</td>
              <td>₹2500</td>
              <td>₹3000</td>
            </tr>
            <tr>
              <td>Somnath to Jamnagar</td>
              <td>₹1300</td>
              <td>₹1600</td>
              <td>₹1900</td>
              <td>₹2200</td>
            </tr>
            <tr>
              <td>Somnath to Junagadh</td>
              <td>₹1600</td>
              <td>₹1900</td>
              <td>₹2200</td>
              <td>₹2600</td>
            </tr>
            <tr>
              <td>Somnath to Porbandar</td>
              <td>₹2200</td>
              <td>₹2500</td>
              <td>₹2900</td>
              <td>₹3300</td>
            </tr>
            <tr>
              <td>Somnath to Rajkot</td>
              <td>₹2500</td>
              <td>₹2700</td>
              <td>₹3200</td>
              <td>₹3500</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default FareList;
