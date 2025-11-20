
import React, { useState } from 'react';
import PageBanner from '../components/PageBanner';
import InteractiveMap from '../components/InteractiveMap';

// Site Data for the detailed list view
const ziyaratSites = {
  makkah: [
    {
      title: 'Jabal Al-Nour (Cave Hira)',
      desc: 'The mountain of light where the Prophet (PBUH) received the first revelation of the Quran.',
      img: 'https://i.postimg.cc/RZ8BGSpf/aj.webp'
    },
    {
      title: 'Jabal Thawr',
      desc: 'The cave where Prophet Muhammad (PBUH) and Abu Bakr (RA) hid during the migration.',
      img: 'https://i.postimg.cc/x1gn4TDd/ad.jpg'
    },
    {
      title: 'Jannat al-Mualla',
      desc: 'The historical cemetery in Makkah where the Prophet\'s wife Khadija (RA) is buried.',
      img: 'https://i.postimg.cc/VkQL0LnX/al.webp'
    },
    {
      title: 'Mina, Arafat & Muzdalifah',
      desc: 'Visit the key sites of Hajj rituals and understand their historical context.',
      img: 'https://i.postimg.cc/CL6k3832/ak.jpg'
    }
  ],
  madinah: [
    {
      title: 'Masjid Quba',
      desc: 'The first mosque in Islam. Offering 2 Rakat prayer here equals the reward of an Umrah.',
      img: 'https://i.postimg.cc/RZ8BGSpf/aj.webp'
    },
    {
      title: 'Mount Uhud',
      desc: 'Site of the Battle of Uhud and the resting place of Hamza (RA) and other martyrs.',
      img: 'https://i.postimg.cc/mD2wzRfY/hajj-b.jpg'
    },
    {
      title: 'Masjid Al-Qiblatayn',
      desc: 'The mosque where the direction of prayer (Qibla) was changed from Jerusalem to Makkah.',
      img: 'https://i.postimg.cc/50rQG1f5/umrah-2.jpg'
    },
    {
      title: 'The Seven Mosques',
      desc: 'A complex of small historic mosques marking the location of the Battle of the Trench.',
      img: 'https://i.postimg.cc/x1gn4TDd/ad.jpg'
    }
  ]
};

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
    <div className="bg-[#1F2937] p-6 rounded-xl border border-gray-700 hover:border-[var(--color-primary)] transition-all duration-300 group">
        <div className="w-14 h-14 bg-[var(--color-dark-bg)] rounded-full flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:scale-110 transition-transform border border-gray-600">
            {icon}
        </div>
        <h4 className="text-xl font-display font-bold text-white mb-2">{title}</h4>
        <p className="text-[var(--color-muted-text)] text-sm">{text}</p>
    </div>
);

const ZiyaratPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'makkah' | 'madinah'>('makkah');

  return (
    <div className="pt-20 bg-[var(--color-dark-bg)] min-h-screen">
      <PageBanner 
        title="Historical Ziyarat Tours" 
        subtitle="Walk in the footsteps of the Prophet (PBUH) and his companions."
        backgroundImage="https://i.postimg.cc/RZ8BGSpf/aj.webp"
      />
      
      {/* Intro Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative">
         <div className="max-w-4xl mx-auto">
            <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm mb-2 block">Connect with History</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-light-text)] mb-6">Why Ziyarat is Important?</h2>
            <p className="text-lg text-[var(--color-muted-text)] leading-relaxed">
                Performing Ziyarat allows pilgrims to connect deeply with Islamic history. 
                It is a profound opportunity to witness the places where the Prophet Muhammad (PBUH) and his companions lived, prayed, and strove for Islam. 
                Our guided Ziyarat tours ensure you not only see these places but understand their spiritual significance with the help of expert scholars.
            </p>
         </div>
      </div>

      {/* Interactive Map Section */}
      <div className="border-t border-gray-800">
        <InteractiveMap />
      </div>

      {/* Detailed Itinerary List */}
      <section className="py-16 bg-[#0d1117]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Places We Visit</h2>
                  
                  {/* Tabs */}
                  <div className="inline-flex bg-[#1F2937] p-1 rounded-full">
                      <button 
                        onClick={() => setActiveTab('makkah')}
                        className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'makkah' ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      >
                          Makkah Ziyarat
                      </button>
                      <button 
                        onClick={() => setActiveTab('madinah')}
                        className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'madinah' ? 'bg-[var(--color-secondary)] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      >
                          Madinah Ziyarat
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {ziyaratSites[activeTab].map((site, index) => (
                      <div key={index} className="bg-[#1F2937] rounded-lg overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300 group">
                          <div className="h-48 overflow-hidden relative">
                              <img src={site.img} alt={site.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] to-transparent opacity-60"></div>
                          </div>
                          <div className="p-5">
                              <h3 className="text-xl font-display font-bold text-white mb-2">{site.title}</h3>
                              <p className="text-[var(--color-muted-text)] text-sm">{site.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Features / Inclusions */}
      <section className="py-16 bg-[var(--color-dark-bg)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Tour Inclusions</h2>
                  <p className="text-[var(--color-muted-text)] mt-2">We provide a comfortable and educational experience.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FeatureItem 
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>}
                    title="Expert Scholar Guide"
                    text="Each bus is accompanied by a knowledgeable scholar (Muallim) who explains the history and significance of every site in Bangla."
                  />
                   <FeatureItem 
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
                    title="Luxury Transport"
                    text="Travel in comfort with our private, air-conditioned luxury buses designated exclusively for your group."
                  />
                   <FeatureItem 
                    icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>}
                    title="Refreshments"
                    text="Complimentary snacks and drinks are provided during the tour to keep you refreshed."
                  />
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <div className="py-20 bg-gradient-to-b from-[#0d1117] to-[#111827]">
         <div className="container mx-auto px-4 text-center">
            <div className="bg-[#1F2937] rounded-2xl p-8 md:p-12 border border-gray-700 shadow-2xl max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-primary)] mb-4">Book Your Ziyarat Tour Today</h2>
                <p className="text-lg text-[var(--color-muted-text)] mb-8">Don't miss out on this spiritual educational journey. Seats fill up fast during the season.</p>
                <a href="#contact?subject=Book Ziyarat Tour" className="inline-block bg-[var(--color-primary)] text-white font-bold py-4 px-12 rounded-full hover:bg-[var(--color-primary-dark)] transition-all duration-300 shadow-[0_10px_30px_rgba(197,164,126,0.3)] transform hover:-translate-y-1 hover:scale-105 text-lg">
                    Request Booking
                </a>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ZiyaratPage;
