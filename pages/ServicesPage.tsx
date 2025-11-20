
import React, { useContext } from 'react';
import Services from '../components/Services';
import PageBanner from '../components/PageBanner';
import { DataContext } from '../contexts/DataContext';

// Internal component for Process Steps
const ProcessStep: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div className="relative flex flex-col items-center text-center p-6 bg-[var(--color-light-bg)] rounded-lg border border-gray-700 hover:border-[var(--color-primary)] transition-all duration-300 group" data-aos="fade-up">
    <div className="w-16 h-16 rounded-full bg-[var(--color-dark-bg)] border-2 border-[var(--color-primary)] flex items-center justify-center text-2xl font-bold text-[var(--color-primary)] mb-4 shadow-[0_0_15px_rgba(197,164,126,0.3)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
      {number}
    </div>
    <h3 className="text-xl font-display font-bold text-white mb-2">{title}</h3>
    <p className="text-[var(--color-muted-text)] text-sm">{description}</p>
  </div>
);

const ServicesPage: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { pageBanner } = appData.pages.services;

  return (
    <div className="pt-20 bg-[var(--color-dark-bg)] min-h-screen flex flex-col">
      <PageBanner 
          title={pageBanner.title} 
          subtitle={pageBanner.subtitle}
          backgroundImage="https://i.postimg.cc/Y2z4HFFK/ah.jpg"
      />
      
      {/* Intro / Philosophy Section */}
      <section className="py-16 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto" data-aos="fade-up">
              <span className="text-[var(--color-primary)] font-bold uppercase tracking-widest text-sm">Our Commitment</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mt-2 mb-6">Excellence in Every Step</h2>
              <p className="text-[var(--color-muted-text)] text-lg leading-relaxed">
                  At Champion Travels & Tours, we don't just provide services; we curate experiences. Whether you are embarking on a spiritual journey to the Holy Lands or traveling for business, our dedicated team ensures every detail is handled with precision, care, and professionalism.
              </p>
          </div>
      </section>

      {/* Services Grid (Existing Component) */}
      <div className="flex-grow bg-[#0f172a]/50">
        <Services showTitle={false} />
      </div>

      {/* Our Process Section */}
      <section className="py-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">How We Serve You</h2>
            <p className="text-[var(--color-muted-text)] mt-2">A simple, transparent, and hassle-free process.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute top-14 left-0 w-full h-0.5 bg-gray-700 -z-10"></div>
            
            <ProcessStep 
                number="1" 
                title="Consultation" 
                description="We discuss your needs, preferences, and budget to understand exactly what you are looking for." 
            />
            <ProcessStep 
                number="2" 
                title="Customization" 
                description="Our experts tailor a package or service plan that aligns perfectly with your requirements." 
            />
            <ProcessStep 
                number="3" 
                title="Booking & Processing" 
                description="We handle all the documentation, bookings, and visa processing efficiently." 
            />
            <ProcessStep 
                number="4" 
                title="Support & Journey" 
                description="Enjoy your trip with our continuous support until you return home safely." 
            />
        </div>
      </section>

      {/* Detailed Features / Why Us for Services */}
      <section className="py-16 bg-[var(--color-light-bg)] border-y border-gray-700">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
               <div className="md:w-1/2" data-aos="fade-right">
                   <img 
                    src="https://i.postimg.cc/x1gn4TDd/ad.jpg" 
                    alt="Customer Service" 
                    className="rounded-lg shadow-2xl border-2 border-[var(--color-primary)]/20 w-full max-w-md mx-auto object-cover h-80"
                   />
               </div>
               <div className="md:w-1/2" data-aos="fade-left">
                   <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Why Trust Our Services?</h2>
                   <ul className="space-y-6">
                       <li className="flex items-start">
                           <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mr-4">
                               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                           </div>
                           <div>
                               <h4 className="text-white font-bold text-lg">24/7 Dedicated Support</h4>
                               <p className="text-[var(--color-muted-text)] text-sm mt-1">Our team is available round the clock to assist you with any queries or emergencies during your travel.</p>
                           </div>
                       </li>
                       <li className="flex items-start">
                           <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mr-4">
                               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           </div>
                           <div>
                               <h4 className="text-white font-bold text-lg">Transparent Pricing</h4>
                               <p className="text-[var(--color-muted-text)] text-sm mt-1">No hidden fees. We provide detailed breakdowns of all costs involved so you know exactly what you are paying for.</p>
                           </div>
                       </li>
                       <li className="flex items-start">
                           <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mr-4">
                               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                           </div>
                           <div>
                               <h4 className="text-white font-bold text-lg">Global Network</h4>
                               <p className="text-[var(--color-muted-text)] text-sm mt-1">Strong partnerships with top-rated hotels and airlines worldwide ensure you get the best deals and premium service.</p>
                           </div>
                       </li>
                   </ul>
               </div>
           </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center bg-gradient-to-b from-[var(--color-dark-bg)] to-[#000]">
          <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Need a Custom Service?</h2>
              <p className="text-[var(--color-muted-text)] text-lg max-w-2xl mx-auto mb-8">
                  If you have specific requirements or need a tailored solution, our team is ready to design a package just for you.
              </p>
              <a href="#contact?subject=Custom Service Request" className="inline-block bg-[var(--color-primary)] text-white font-bold py-4 px-10 rounded-full hover:bg-[var(--color-primary-dark)] transition-all duration-300 shadow-lg transform hover:scale-105">
                  Contact Us Today
              </a>
          </div>
      </section>
    </div>
  );
};

export default ServicesPage;
