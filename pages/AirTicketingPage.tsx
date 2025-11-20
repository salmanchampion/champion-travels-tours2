import React, { useContext } from 'react';
import PageBanner from '../components/PageBanner';
import AirTicketing from '../components/AirTicketing';
import { DataContext } from '../contexts/DataContext';

const AirTicketingPage: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { pageBanner } = appData.pages.airTicketing;
    
    return (
        <div className="pt-20">
            <PageBanner 
                title={pageBanner.title}
                subtitle={pageBanner.subtitle}
            />
            <AirTicketing />
        </div>
    );
};

export default AirTicketingPage;
