import React, { useContext } from 'react';
import Contact from '../components/Contact';
import PageBanner from '../components/PageBanner';
import { DataContext } from '../contexts/DataContext';

interface ContactPageProps {
  defaultSubject?: string;
}

const ContactPage: React.FC<ContactPageProps> = ({ defaultSubject }) => {
  const { appData } = useContext(DataContext);
  const { pageBanner } = appData.pages.contact;

  return (
    <div className="pt-20">
      <PageBanner 
        title={pageBanner.title}
        subtitle={pageBanner.subtitle}
      />
      <Contact defaultSubject={defaultSubject} showTitle={false} />
    </div>
  );
};

export default ContactPage;