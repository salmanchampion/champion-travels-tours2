
import React, { useContext } from 'react';
import PageBanner from '../components/PageBanner';
import { DataContext } from '../contexts/DataContext';

const HajjDetailsPage: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { hajjDetails } = appData.pages;

  return (
    <div className="pt-20 bg-[var(--color-dark-bg)]">
      <PageBanner 
        title={hajjDetails.pageBanner.title} 
        subtitle={hajjDetails.pageBanner.subtitle} 
        backgroundImage={hajjDetails.pageBanner.backgroundImage}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-20">
            {hajjDetails.sections.filter(section => section.enabled).map((section, index) => (
                 <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                    <div className="lg:w-1/2">
                        {section.image && (
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <img 
                                    src={section.image} 
                                    alt={section.title} 
                                    className="relative w-full rounded-lg shadow-2xl transform transition duration-500 hover:scale-[1.01]"
                                />
                            </div>
                        )}
                    </div>
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-light-text)] mb-6 relative inline-block">
                            {section.title}
                            <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-[var(--color-primary)] rounded-full"></span>
                        </h2>
                        <p className="text-lg text-[var(--color-muted-text)] leading-relaxed whitespace-pre-line">
                            {section.description}
                        </p>
                    </div>
                 </div>
            ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
             <h3 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-light-text)] mb-8">Ready to embark on this sacred journey?</h3>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#hajj" className="bg-[var(--color-primary)] text-white font-bold py-3 px-8 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-primary-dark)] transition-all duration-300 shadow-lg">
                    View Hajj Packages
                </a>
                <a href="#contact?subject=Hajj Inquiry" className="bg-transparent border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] font-bold py-3 px-8 rounded-[var(--ui-button-radius)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-dark-bg)] transition-all duration-300 shadow-lg">
                    Contact Us
                </a>
             </div>
        </div>
      </div>
    </div>
  );
};

export default HajjDetailsPage;
