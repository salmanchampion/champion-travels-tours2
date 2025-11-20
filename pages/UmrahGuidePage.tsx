import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
            <div className="w-5 h-5 bg-[var(--color-secondary)]/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-[var(--color-secondary)] rounded-full"></div>
            </div>
        </div>
        <span className="text-[var(--color-muted-text)] text-lg">{children}</span>
    </li>
);

const FaqItem: React.FC<{ item: { question: string; answer: string; }; isOpen: boolean; onClick: () => void; }> = ({ item, isOpen, onClick }) => (
    <div className="border-b border-gray-700">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center text-left py-4 px-2"
        >
            <h3 className={`text-xl font-semibold ${isOpen ? 'text-[var(--color-secondary)]' : 'text-[var(--color-light-text)]'}`}>{item.question}</h3>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                <svg className="w-6 h-6 text-[var(--color-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
                </svg>
            </span>
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
            <p className="p-4 pt-0 text-[var(--color-muted-text)] leading-relaxed">{item.answer}</p>
        </div>
    </div>
);


const UmrahGuidePage: React.FC = () => {
    const { appData } = useContext(DataContext);
    const { umrahGuide } = appData.pages;
    const { pageBanner, stepsTitle, stepsIntro, steps, dosAndDonts, faq, cta } = umrahGuide;

    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    
    const handleFaqClick = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const visibleSteps = steps.filter(step => step.enabled);
    const visibleFaqs = faq.items.filter(item => item.enabled);

    return (
        <div className="pt-20 bg-[var(--color-dark-bg)]" style={{ backgroundImage: `url('https://www.toptal.com/designers/subtlepatterns/uploads/islamic-style.png')` }}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-[var(--color-light-text)]">

                {/* --- Banner --- */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-[var(--color-primary)]">{pageBanner.title}</h1>
                    <p className="mt-4 text-lg text-[var(--color-muted-text)] max-w-3xl mx-auto">{pageBanner.subtitle}</p>
                </section>

                {/* --- Step by Step Guide --- */}
                <section className="mb-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-light-text)]">{stepsTitle}</h2>
                        <p className="mt-4 text-lg text-[var(--color-muted-text)] max-w-3xl mx-auto">{stepsIntro}</p>
                    </div>
                    <div className="space-y-8">
                        {visibleSteps.map((step, index) => (
                            <div key={index} className="bg-[var(--color-light-bg)] p-6 rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)] border border-gray-700">
                                <h3 className="text-3xl font-bold text-[var(--color-secondary)] mb-2">{step.title}</h3>
                                <p className="text-[var(--color-muted-text)] mb-4">{step.description}</p>
                                <ul className="space-y-3 mb-4">
                                    {step.points.map((point, pIndex) => (
                                        <ListItem key={pIndex}>{point}</ListItem>
                                    ))}
                                </ul>
                                {step.arabicText && (
                                    <div className="mt-4 p-4 bg-[var(--color-secondary)]/10 rounded-md text-center">
                                        <p className="text-lg font-semibold text-[var(--color-secondary)]">{step.arabicText}</p>
                                        {step.arabicMeaning && <p className="mt-2 text-[var(--color-light-text)]">{step.arabicMeaning}</p>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* --- Do's and Don'ts --- */}
                 <section className="mb-16">
                    <div className="bg-[var(--color-light-bg)] p-6 md:p-10 rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)] border border-gray-700">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-light-text)]">{dosAndDonts.title}</h2>
                            <p className="mt-4 text-lg text-[var(--color-muted-text)] max-w-3xl mx-auto">{dosAndDonts.intro}</p>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-10">
                            <div className="lg:w-1/2">
                                <h3 className="text-2xl font-bold text-[var(--color-light-text)] mb-4">{dosAndDonts.dos.title}</h3>
                                <ul className="space-y-3 mb-6">
                                    {dosAndDonts.dos.items.map((item, index) => <ListItem key={index}>{item}</ListItem>)}
                                </ul>
                                <h3 className="text-2xl font-bold text-[var(--color-light-text)] mb-4">{dosAndDonts.donts.title}</h3>
                                <ul className="space-y-3">
                                    {dosAndDonts.donts.items.map((item, index) => <ListItem key={index}>{item}</ListItem>)}
                                </ul>
                            </div>
                             <div className="lg:w-1/2 flex items-center justify-center min-h-[300px]">
                                <div className="relative w-full h-64 sm:h-80">
                                    <img 
                                        src={dosAndDonts.images[0]}
                                        alt="Kaaba"
                                        className="absolute top-0 left-0 w-[65%] h-[90%] object-cover rounded-[var(--ui-border-radius)] shadow-xl transform -rotate-12"
                                    />
                                    <img 
                                        src={dosAndDonts.images[1]}
                                        alt="Pilgrim praying"
                                        className="absolute bottom-0 right-0 w-[65%] h-[90%] object-cover rounded-[var(--ui-border-radius)] shadow-xl transform rotate-12"
                                    />
                                </div>
                            </div>
                        </div>
                         <div className="mt-10 pt-6 border-t border-gray-700">
                           <p className="text-lg text-[var(--color-muted-text)]"><span className="font-bold text-[var(--color-light-text)]">নোট:</span> {dosAndDonts.note}</p>
                        </div>
                    </div>
                </section>
                
                {/* --- FAQ Section --- */}
                <section className="mb-16">
                    <div className="bg-[var(--color-light-bg)] p-6 md:p-10 rounded-[var(--ui-border-radius)] shadow-[var(--ui-shadow)] border border-gray-700">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-light-text)]">{faq.title}</h2>
                        </div>
                        <div className="max-w-3xl mx-auto">
                            {visibleFaqs.map((item, index) => (
                                <FaqItem
                                    key={index}
                                    item={item}
                                    isOpen={openFaqIndex === index}
                                    onClick={() => handleFaqClick(index)}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- CTA Section --- */}
                <section className="text-center py-10">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-light-text)] max-w-3xl mx-auto leading-tight">
                        {cta.title}
                    </h2>
                    <div className="mt-8">
                        <a href="#contact?subject=Request for Umrah Booking Online" className="inline-block bg-[var(--color-primary)] text-white font-bold py-4 px-10 rounded-[var(--ui-button-radius)] text-lg hover:bg-[var(--color-primary-dark)] transition-all duration-300 shadow-md hover:shadow-lg">
                            {cta.buttonText}
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UmrahGuidePage;