import React, { useContext } from 'react';
import Services from '../components/Services';
import PageBanner from '../components/PageBanner';
import { DataContext } from '../contexts/DataContext';

const ServicesPage: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { pageBanner } = appData.pages.services;
  return (
    <div className="pt-20">
      <PageBanner 
          title={pageBanner.title} 
          subtitle={pageBanner.subtitle}
      />
      <Services showTitle={false} />
    </div>
  );
};

export default ServicesPage;