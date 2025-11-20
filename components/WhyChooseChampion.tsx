
import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { WhyChooseSection } from '../data';

const iconMap: { [key: string]: React.ReactNode } = {
    Time: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Guidance: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path d="M12 14l9-5-9-5-9 5 9 5zm0 0v3.422"></path></svg>,
    AllInOne: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    Success: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Transparent: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    Support: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Default: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
};

const FeatureCard: React.FC<{ section: WhyChooseSection; delay: number }> = ({ section, delay }) => (
  <div 
    data-aos="fade-up"
    data-aos-delay={delay}
    className="bg-[var(--color-light-bg)] p-8 rounded-[var(--ui-border-radius)] text-center transform hover:-translate-y-2 transition-transform duration-500 shadow-[var(--ui-shadow)] hover:shadow-[var(--color-primary)]/20 cursor-pointer border-2 border-transparent hover:border-[var(--color-primary)]/50"
  >
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[var(--color-primary)] text-white mx-auto mb-6">
      {iconMap[section.icon] || iconMap['Default']}
    </div>
    <h3 className="text-2xl font-display font-semibold mb-3 text-white">{section.title}</h3>
    <p className="text-[var(--color-muted-text)]">{section.description}</p>
  </div>
);

const WhyChooseChampion: React.FC = () => {
    const [language, setLanguage] = useState<'en' | 'bn'>('en');
    const { appData } = useContext(DataContext);
    const { whyChooseChampion } = appData.pages;
    const content = whyChooseChampion[language];

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'bn' : 'en');
    }

    return (
        <section className="py-20 bg-[var(--color-dark-bg)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-primary)]" data-aos="fade-up">{content.title}</h2>
                    <p className="mt-4 text-lg text-[var(--color-muted-text)] max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">{content.subtitle}</p>
                    <div className="mt-6" data-aos="zoom-in" data-aos-delay="200">
                        <button 
                            onClick={toggleLanguage}
                            className="bg-[var(--color-secondary)] text-[var(--color-dark-bg)] font-bold py-2 px-6 rounded-[var(--ui-button-radius)] hover:bg-amber-600 transition-all duration-300"
                        >
                            {language === 'en' ? 'বাংলা দেখুন' : 'View in English'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {content.sections.map((section, index) => (
                        <FeatureCard key={index} section={section} delay={index * 100} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseChampion;
