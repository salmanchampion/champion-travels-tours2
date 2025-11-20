
import React from 'react';
import PageBanner from '../components/PageBanner';
import InteractiveMap from '../components/InteractiveMap';

const ZiyaratPage: React.FC = () => {
  return (
    <div className="pt-20 bg-[var(--color-dark-bg)]">
      <PageBanner 
        title="Ziyarat Tours" 
        subtitle="Experience the rich history of Islam through our immersive guide."
        backgroundImage="https://i.postimg.cc/RZ8BGSpf/aj.webp"
      />
      
      {/* Interactive Map Section */}
      <InteractiveMap />

      {/* Additional Text Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-transparent to-[var(--color-primary)] opacity-30"></div>
         
         <div data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-light-text)] mb-8">Why Ziyarat is Important?</h2>
            <p className="text-xl text-[var(--color-muted-text)] max-w-4xl mx-auto leading-relaxed mb-12 font-light">
                Performing Ziyarat allows pilgrims to connect deeply with Islamic history. 
                It is a profound opportunity to witness the places where the Prophet Muhammad (PBUH) and his companions lived, prayed, and strove for Islam. 
                Our guided Ziyarat tours ensure you not only see these places but understand their spiritual significance with the help of expert scholars.
            </p>
            <a href="#contact?subject=Book Ziyarat Tour" className="inline-block bg-[var(--color-primary)] text-white font-bold py-4 px-10 rounded-full hover:bg-[var(--color-primary-dark)] transition-all duration-300 shadow-[0_10px_30px_rgba(197,164,126,0.3)] transform hover:-translate-y-1 hover:scale-105">
                Book a Guided Ziyarat Tour
            </a>
         </div>
      </div>
    </div>
  );
};

export default ZiyaratPage;
