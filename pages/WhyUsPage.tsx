import React from 'react';
import WhyChooseUs from '../components/WhyChooseUs';

const WhyUsPage: React.FC = () => {
  return (
    <div className="pt-20">
      {/* The new WhyChooseUs component is a full-page design, so the banner is no longer needed here. */}
      <WhyChooseUs />
    </div>
  );
};

export default WhyUsPage;
