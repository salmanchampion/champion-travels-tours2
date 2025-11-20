import React, { useContext } from 'react';
import Testimonials from '../components/Testimonials';
import PageBanner from '../components/PageBanner';
import { DataContext } from '../contexts/DataContext';

const TestimonialsPage: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { pageBanner } = appData.pages.testimonials;

  return (
    <div className="pt-20">
      <PageBanner 
        title={pageBanner.title}
        subtitle={pageBanner.subtitle}
      />
      <Testimonials showTitle={false} />
    </div>
  );
};

export default TestimonialsPage;