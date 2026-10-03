import React from 'react';
import HeroSlider from '../components/HeroSlider';
import BookingForm from '../components/BookingForm';
import FareList from '../components/FareList';
import ChooseVehicle from '../components/ChooseVehicle';
import FunFacts from '../components/FunFacts';
import Services from '../components/Services';
import AppBlock from '../components/AppBlock';
import Brands from '../components/Brands';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <>
      <HeroSlider />
      <BookingForm />
      <FareList />
      <ChooseVehicle />
      <FunFacts />
      <Services />
      <AppBlock />
      <Brands />
      <Testimonials />
    </>
  );
};

export default Home;
