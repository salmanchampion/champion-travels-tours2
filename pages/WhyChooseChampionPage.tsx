import React from 'react';
import PageBanner from '../components/PageBanner';
import WhyChooseChampion from '../components/WhyChooseChampion';

const WhyChooseChampionPage: React.FC = () => {
    // The dynamic title will be inside the WhyChooseChampion component.
    return (
        <div className="pt-20">
            <PageBanner 
                title="Why Choose Us"
                subtitle="Your Trusted Partner in Spiritual and Leisure Travel"
            />
            <WhyChooseChampion />
        </div>
    );
};

export default WhyChooseChampionPage;