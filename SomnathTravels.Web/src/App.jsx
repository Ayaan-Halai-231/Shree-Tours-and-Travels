import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Faq from './pages/Faq';
import ContactUs from './pages/ContactUs';
import ScrollToTop from './components/ScrollToTop';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App bg-light min-vh-100 d-flex flex-column">
        <Header />
        <Navigation />
        
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
