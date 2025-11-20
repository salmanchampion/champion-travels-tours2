import React, { useContext } from 'react';
import FeaturedPackages from '../components/FeaturedPackages';
import PageBanner from '../components/PageBanner';
import { DataContext } from '../contexts/DataContext';

const PackagesPage: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { pageBanner } = appData.pages.packages;

  return (
    <div className="pt-20">
      <PageBanner 
          title={pageBanner.title} 
          subtitle={pageBanner.subtitle}
      />
      <FeaturedPackages showHajjFilters={true} showUmrahFilters={true} showTitle={false} />
    </div>
  );
};

export default PackagesPage;