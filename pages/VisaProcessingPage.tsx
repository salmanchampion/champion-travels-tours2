import React, { useContext } from 'react';
import VisaProcessing from '../components/VisaProcessing';
import PageBanner from '../components/PageBanner';
import { DataContext } from '../contexts/DataContext';

const VisaProcessingPage: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { pageBanner } = appData.pages.visaProcessing;

  return (
    <div className="pt-20">
      <PageBanner 
        title={pageBanner.title}
        subtitle={pageBanner.subtitle}
      />
      <VisaProcessing showTitle={false} />
    </div>
  );
};

export default VisaProcessingPage;