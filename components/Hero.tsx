
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { DataContext } from '../contexts/DataContext';

const Hero: React.FC = () => {
  const { appData } = useContext(DataContext);
  const { hero } = appData.pages.home;
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev === hero.images.length - 1 ? 0 : prev + 1));
  }, [hero.images.length]);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? hero.images.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (hero.images.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 7000); // Change image every 7 seconds

    return () => clearInterval(timer);
  }, [hero.images.length, nextSlide]);
  
  if (hero.images.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center text-center text-white bg-[var(--color-dark-bg)]">
        <p>No hero images available. Please add some in the admin panel.</p>
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] md:h-screen w-full overflow-hidden text-white">
      <div className="absolute inset-0 bg-black opacity-50 md:opacity-60 z-10"></div>
      
      {hero.images.map((src, index) => (
        <div
          key={src + index}
          className={`hero-slide absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 active' : 'opacity-0'
          }`}
        >
           {/* Using an div for the Ken Burns effect via CSS class */}
           <div 
              className={`w-full h-full bg-cover bg-center ${index === currentSlide ? 'ken-burns' : ''}`}
              style={{ backgroundImage: `url('${src}')` }}
           ></div>
        </div>
      ))}
      
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center text-center pt-20 md:pt-0">
          <div className="hero-slide-content max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-wide mb-3 leading-tight" data-aos="fade-up" data-aos-delay="200">
              {hero.title}
              </h1>
              <p className="text-xs md:text-lg font-sans text-[var(--color-primary)] mb-4 md:mb-6 font-medium tracking-wider uppercase" data-aos="fade-up" data-aos-delay="400">
              {hero.licenseInfo}
              </p>
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-[var(--color-light-text)] mb-6 leading-tight" data-aos="fade-up" data-aos-delay="600">
              {hero.subtitle}
              </h2>
              <p className="text-sm sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 text-[var(--color-light-text)]/90 px-2 leading-relaxed" data-aos="fade-up" data-aos-delay="800">
              {hero.description}
              </p>
              <div data-aos="zoom-in" data-aos-delay="1000">
                  <a
                  href="#packages"
                  className="bg-[var(--color-primary)] text-white font-bold py-3 px-8 md:py-4 md:px-10 rounded-[var(--ui-button-radius)] text-base md:text-lg hover:bg-[var(--color-primary-dark)] transition-transform duration-300 hover:scale-105 inline-block shadow-lg hover:shadow-[var(--color-primary)]/30"
                  >
                  {hero.buttonText}
                  </a>
              </div>
          </div>
      </div>

      {/* Slider Controls - Hidden on very small screens to avoid clutter */}
      {hero.images.length > 1 && (
        <>
        <button 
            onClick={prevSlide}
            className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 z-30 p-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors hidden sm:block"
            aria-label="Previous Slide"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button 
            onClick={nextSlide}
            className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 z-30 p-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors hidden sm:block"
            aria-label="Next Slide"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {hero.images.map((_, index) => (
                <button 
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-[var(--color-primary)] w-6 md:w-8' : 'bg-white/50 hover:bg-white/80'}`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
        </>
      )}
    </section>
  );
};

export default Hero;
