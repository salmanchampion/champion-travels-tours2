
import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { DataContext } from '../contexts/DataContext';
import { Service } from '../data';

// --- Icon Components ---
// A map to associate icon names from data with actual SVG components
const iconMap: { [key: string]: React.ReactNode } = {
  Hajj: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>,
  Umrah: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a9.004 9.004 0 00-4.5 15.75" /></svg>,
  Visa: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  AirTicket: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
  Hotel: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Tour: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Default: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
};


const ServiceCard: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void; delay: number }> = ({ icon, title, description, onClick, delay }) => (
  <div 
    data-aos="fade-up" 
    data-aos-delay={delay}
    onClick={onClick} 
    className="bg-[var(--color-light-bg)] p-8 rounded-[var(--ui-border-radius)] text-center transform hover:-translate-y-2 transition-all duration-500 shadow-[var(--ui-shadow)] hover:shadow-[var(--color-primary)]/30 cursor-pointer border-2 border-transparent hover:border-[var(--color-primary)] group"
  >
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[var(--color-dark-bg)] text-[var(--color-primary)] mx-auto mb-6 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-2xl font-display font-semibold mb-3 text-white">{title}</h3>
    <p className="text-[var(--color-muted-text)] group-hover:text-gray-300 transition-colors">{description}</p>
  </div>
);

interface ServicesProps {
  showTitle?: boolean;
}

const Services: React.FC<ServicesProps> = ({ showTitle = true }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { appData } = useContext(DataContext);
  const data = showTitle ? appData.pages.home.sections.services : appData.pages.services.pageBanner;
  const services = appData.pages.services.list ? appData.pages.services.list.filter(s => s.enabled) : [];

  return (
    <>
      <section className={`${showTitle ? 'py-20' : 'py-16'} bg-[var(--color-dark-bg)]`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {showTitle && (
              <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-primary)]" data-aos="fade-up">{data.title}</h2>
              <p className="mt-4 text-lg text-[var(--color-muted-text)] max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">{data.subtitle}</p>
              </div>
          )}
          
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard 
                  key={index} 
                  icon={iconMap[service.icon] || iconMap['Default']}
                  title={service.title}
                  description={service.description}
                  onClick={() => setSelectedService(service)} 
                  delay={index * 100}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[var(--color-light-bg)] rounded-[var(--ui-border-radius)] border border-dashed border-gray-700" data-aos="fade-up">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[var(--color-muted-text)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-xl font-bold text-[var(--color-light-text)]">No Services Available</h3>
                <p className="text-[var(--color-muted-text)] mt-2">We are currently updating our service list. Please check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {selectedService && (
        <Modal isOpen={!!selectedService} onClose={() => setSelectedService(null)}>
          <div className="flex items-start sm:items-center mb-6 flex-col sm:flex-row">
            <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-[var(--color-primary)] text-white mr-4 mb-4 sm:mb-0">
              {iconMap[selectedService.icon] || iconMap['Default']}
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-[var(--color-primary)]">{selectedService.title}</h2>
              <p className="text-[var(--color-muted-text)]">{selectedService.description}</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-bold text-white mb-4">Key Features & Benefits:</h3>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-light-text)]">
              {selectedService.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
          <div className="mt-8 text-center">
            <a
              href={`#contact?subject=${encodeURIComponent(`Inquiry about ${selectedService.title}`)}`}
              onClick={() => setSelectedService(null)}
              className="bg-[var(--color-primary)] text-white font-bold py-3 px-8 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] transition-all duration-300 inline-block"
            >
              Inquire Now
            </a>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Services;
