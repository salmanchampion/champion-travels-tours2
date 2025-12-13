
import React from 'react';

const ServiceSection: React.FC<{
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    image: string;
    align: 'left' | 'right';
    link: string;
    buttonText?: string;
}> = ({ title, subtitle, description, features, image, align, link, buttonText = "Inquire About This Service" }) => (
    <div className="py-12 md:py-24 border-b border-gray-800/50 last:border-0 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/arabesque.png')]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className={`flex flex-col lg:flex-row items-center gap-8 md:gap-16 ${align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Image Side */}
                <div className="lg:w-1/2 w-full" data-aos={align === 'left' ? 'fade-right' : 'fade-left'}>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[#8B6E4E] rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                        <div className="relative overflow-hidden rounded-xl shadow-2xl h-[250px] sm:h-[350px] lg:h-[500px]">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-500 z-10"></div>
                            <img 
                                src={image} 
                                alt={title} 
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        {/* Decorative Box */}
                        <div className={`absolute -bottom-4 -right-4 md:-bottom-6 ${align === 'left' ? 'md:-right-6' : 'md:-left-6'} w-16 h-16 md:w-24 md:h-24 border-2 border-[var(--color-primary)] hidden md:block bg-transparent z-20`}></div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="lg:w-1/2 w-full" data-aos="fade-up">
                    <div className="flex items-center gap-4 mb-3 md:mb-4">
                        <div className="h-px w-8 md:w-12 bg-[var(--color-primary)]"></div>
                        <span className="text-[var(--color-primary)] font-bold tracking-[0.2em] uppercase text-xs md:text-sm">{subtitle}</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 md:mb-6 leading-tight">
                        {title}
                    </h2>
                    <p className="text-base md:text-lg text-[var(--color-muted-text)] leading-relaxed mb-6 md:mb-8">
                        {description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-3 group">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] group-hover:scale-150 transition-transform shrink-0"></div>
                                <span className="text-gray-300 group-hover:text-white transition-colors text-sm md:text-base">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <a 
                        href={link}
                        className="inline-flex items-center space-x-3 text-white font-bold group"
                    >
                        <span className="border-b-2 border-[var(--color-primary)] pb-1 group-hover:text-[var(--color-primary)] transition-colors text-sm md:text-base">{buttonText}</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
);

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-[#0B0F19] min-h-screen pt-20">
      {/* --- Hero Section --- */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
              <img 
                src="https://i.postimg.cc/R0N8Mv8X/as.jpg" 
                alt="Luxury Travel" 
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/90 via-[#0B0F19]/60 to-[#0B0F19]"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto" data-aos="fade-up">
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent mx-auto mb-6 md:mb-8"></div>
              <h1 className="text-4xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-wide mb-4 md:mb-6">
                  World-Class Services
              </h1>
              <p className="text-lg md:text-2xl text-[var(--color-muted-text)] font-light">
                  We don't just facilitate travel; we curate spiritual and global experiences with unmatched precision and luxury.
              </p>
          </div>
      </section>

      {/* --- Services List --- */}
      <div className="bg-[#0B0F19]">
          <ServiceSection 
            title="Hajj & Umrah Pilgrimage"
            subtitle="Spiritual Journeys"
            description="Embark on the sacred journey of a lifetime with our premium Hajj and Umrah packages. We specialize in providing executive arrangements, close-proximity hotels, and scholarly guidance to ensure your worship is accepted and your comfort is guaranteed."
            features={['VIP Shifting & Non-Shifting Hajj', 'Custom Umrah Itineraries', 'Luxury Ground Transport', 'Scholarly Guidance (Muallim)']}
            image="https://i.postimg.cc/CL6k3832/ak.jpg"
            align="left"
            link="#exclusive-hajj"
            buttonText="View Packages"
          />

          <ServiceSection 
            title="Historical Ziyarat Tours"
            subtitle="Echoes of History"
            description="Walk in the footsteps of the Prophet (PBUH) and his companions. Our guided Ziyarat tours take you to the most significant historical sites in Makkah and Madinah, providing deep historical context and spiritual insight."
            features={['Guided by Historians/Scholars', 'Exclusive Access to Sites', 'Comfortable AC Transport', 'Educational Sessions']}
            image="https://i.postimg.cc/K8cRp4r0/jeyarah.png"
            align="right"
            link="#ziyarat-tours"
            buttonText="Explore Ziyarat"
          />

          <ServiceSection 
            title="Global Visa Processing"
            subtitle="Hassle-Free Documentation"
            description="Navigating complex immigration rules can be daunting. Our expert visa consultants handle the intricacies of visa processing for major destinations worldwide, ensuring a high success rate and peace of mind for tourists, students, and business travelers."
            features={['Tourist & Business Visas', 'Student Visa Assistance', 'Medical Visa Support', 'Document Verification']}
            image="hhttps://i.postimg.cc/j2qpYVgt/visa.jpg"
            align="left"
            link="#visa-processing"
          />

          <ServiceSection 
            title="Air Ticketing & Flights"
            subtitle="Connect to the World"
            description="As an IATA accredited agency, we offer competitive fares on all major international airlines. Whether you need a last-minute business class seat or a budget-friendly family vacation ticket, our global distribution system ensures you get the best deal."
            features={['Domestic & International Flights', 'Group Booking Discounts', '24/7 Flight Support', 'Date Change & Refund Assistance']}
            image="https://i.postimg.cc/8kFcxq6b/air-tekate.png"
            align="right"
            link="#air-ticketing"
          />

          <ServiceSection 
            title="Luxury Hotels & Tours"
            subtitle="Comfort Beyond Borders"
            description="From 5-star suites overlooking the Kaaba to serene resorts in Europe, we have partnerships with top-tier hotels globally. We also curate exclusive holiday tour packages for families and honeymoons, blending adventure with relaxation."
            features={['Direct Hotel Booking System', 'Kaaba/Haram View Rooms', 'Custom Holiday Packages', 'Airport Transfers']}
            image="https://i.postimg.cc/pV9r3gF3/HOTEL.png"
            align="left"
            link="#contact?subject=Hotel/Tour Service Inquiry"
          />
      </div>

      {/* --- VIP Concierge Banner --- */}
      <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[#8B6E4E]">
               <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/geometric-leaves.png')] opacity-10 mix-blend-multiply"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 text-white mb-8 md:mb-0 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-[#0B0F19]">Need VIP Concierge Service?</h2>
                  <p className="text-lg md:text-xl text-[#0B0F19]/80 font-medium max-w-2xl">
                      For elite travelers requiring private jets, dedicated butlers, or custom security arrangements during Hajj/Umrah, our VIP desk is at your service.
                  </p>
              </div>
              <div className="md:w-1/3 text-center md:text-right">
                  <a 
                    href="#contact?subject=VIP Concierge Request" 
                    className="inline-block bg-[#0B0F19] text-[var(--color-primary)] font-bold py-3 px-8 md:py-4 md:px-10 rounded-none hover:bg-white transition-all duration-300 shadow-2xl transform hover:-translate-y-1 border border-[#0B0F19]"
                  >
                      Contact VIP Desk
                  </a>
              </div>
          </div>
      </section>
    </div>
  );
};

export default ServicesPage;
