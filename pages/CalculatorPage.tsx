
import React from 'react';
import PageBanner from '../components/PageBanner';
import CostCalculator from '../components/CostCalculator';

const CalculatorPage: React.FC = () => {
    return (
        <div className="pt-20">
            <PageBanner 
                title="Umrah Cost Estimator" 
                subtitle="Calculate your approximate Umrah budget in seconds." 
                backgroundImage="https://i.postimg.cc/Bb92VfRP/ag.webp"
            />
            <CostCalculator />
        </div>
    );
};

export default CalculatorPage;
