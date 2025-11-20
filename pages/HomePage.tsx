
import React, { useContext } from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import FeaturedPackages from '../components/FeaturedPackages';
import Contact from '../components/Contact';
import Testimonials from '../components/Testimonials';
import { DataContext } from '../contexts/DataContext';
import WhyChooseChampion from '../components/WhyChooseChampion';
import PackageFilterBar from '../components/PackageFilterBar';
import CountdownTimer from '../components/CountdownTimer';
import IslamicTools from '../components/IslamicTools';

const HomePage: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { home } = appData.pages;

  return (
    <>
      <Hero />
      
      {/* Islamic Utility Tools Button (Floating over filter bar area) */}
      {home.sections.islamicTools?.enabled !== false && <IslamicTools />}

      <PackageFilterBar />
      
      {/* Special Offer Countdown */}
      <CountdownTimer />
      
      {home.sections.services.enabled && <Services showTitle={true} />}
      {home.sections.packages.enabled && <FeaturedPackages showHajjFilters={false} showUmrahFilters={false} showTitle={true} />}
      
      {home.sections.whyChooseUs.enabled && <WhyChooseChampion />}
      {home.sections.testimonials.enabled && <Testimonials showTitle={true} />}
      {home.sections.contact.enabled && <Contact showTitle={true} />}
    </>
  );
};

export default HomePage;
